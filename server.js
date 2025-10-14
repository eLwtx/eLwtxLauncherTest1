const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '1h',
    extensions: ['html'],
  })
);

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function validatePayload(body) {
  const errors = {};
  const name = (body.name || body.isim || '').toString().trim();
  const phone = (body.phone || body.numara || '').toString().trim();
  const message = (body.message || body.mesaj || '').toString().trim();

  if (!name) errors.name = 'İsim gereklidir.';
  if (!phone) errors.phone = 'Numara gereklidir.';
  if (!message) errors.message = 'Mesaj gereklidir.';

  if (name && name.length < 2) errors.name = 'İsim en az 2 karakter.';
  if (message && message.length < 5) errors.message = 'Mesaj en az 5 karakter.';

  return { errors, name, phone, message };
}

app.post('/api/contact', async (req, res) => {
  const { errors, name, phone, message } = validatePayload(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, errors });
  }

  const isSmtpConfigured = Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );

  if (!isSmtpConfigured) {
    return res.status(500).json({
      ok: false,
      error:
        'E-posta ayarları yapılmamış. Lütfen SMTP ortam değişkenlerini yapılandırın.'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const toEmail = process.env.MAIL_TO || 'iletisim@sahindekorasyon.tr';
    const fromEmail = process.env.MAIL_FROM || 'website@sahindekorasyon.tr';

    const plainText = `Yeni iletişim mesajı:\n\nİsim: ${name}\nNumara: ${phone}\n\nMesaj:\n${message}`;
    const html = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 12px 0;color:#0f172a">Yeni İletişim Mesajı</h2>
        <p style="margin:0 0 8px 0"><strong>İsim:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 8px 0"><strong>Numara:</strong> ${escapeHtml(phone)}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `Şahin Dekorasyon Website <${fromEmail}>`,
      to: toEmail,
      subject: 'Yeni İletişim Mesajı - Şahin Dekorasyon',
      text: plainText,
      html,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('Mail gönderimi hatası:', err);
    return res.status(500).json({ ok: false, error: 'Mail gönderilemedi.' });
  }
});

app.use((req, res) => {
  // Fallback to index.html for root
  if (req.method === 'GET' && (req.path === '/' || req.path === '')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  return res.status(404).json({ ok: false, error: 'Bulunamadı' });
});

app.listen(PORT, () => {
  console.log(`Şahin Dekorasyon sitesi ${PORT} portunda çalışıyor`);
});

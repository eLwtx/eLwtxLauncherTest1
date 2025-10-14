document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submitBtn');

  function setStatus(message, isOk) {
    if (!statusEl) return;
    statusEl.textContent = message || '';
    statusEl.className = 'form-status ' + (isOk ? 'ok' : 'err');
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      if (!payload.name || !payload.phone || !payload.message) {
        setStatus('Lütfen tüm alanları doldurun.', false);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Gönderiliyor…';
      setStatus('', true);

      try {
        const res = await fetch('/contact.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          setStatus('Mesajınız gönderildi. Teşekkürler!', true);
          form.reset();
        } else {
          const msg = data?.error || 'Gönderim sırasında bir hata oluştu.';
          setStatus(msg, false);
        }
      } catch (err) {
        setStatus('Bağlantı sorunu oluştu. Lütfen tekrar deneyin.', false);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gönder';
      }
    });
  }
});

<?php
// contact.php — cPanel uyumlu form gönderimi
// JSON ve form-urlencoded POST destekler, düz metin e-posta gönderir

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

// Basit CORS (aynı origin için gerekli değil). Gerekirse alan adınıza göre özelleştirin.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Yalnızca POST istekleri kabul edilir.']);
  exit;
}

function load_config(): array {
  $configPath = __DIR__ . '/config.php';
  if (is_file($configPath)) {
    $cfg = include $configPath;
    if (is_array($cfg)) return $cfg;
  }
  return [];
}

function get_input_payload(): array {
  $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
  $raw = file_get_contents('php://input');
  if ($raw && stripos($contentType, 'application/json') !== false) {
    $data = json_decode($raw, true);
    if (is_array($data)) return $data;
  }
  return $_POST ?? [];
}

function str_trim(string $v): string { return trim($v); }
function val(array $src, string $key): string {
  $v = $src[$key] ?? '';
  if (!is_string($v)) $v = strval($v);
  return str_trim($v);
}

$cfg = load_config();
$toEmail = $cfg['MAIL_TO'] ?? 'iletisim@sahindekorasyon.tr';
$fromEmail = $cfg['MAIL_FROM'] ?? 'website@sahindekorasyon.tr';

$data = get_input_payload();
$name = val($data, 'name');
if ($name === '') $name = val($data, 'isim');
$phone = val($data, 'phone');
if ($phone === '') $phone = val($data, 'numara');
$message = val($data, 'message');
if ($message === '') $message = val($data, 'mesaj');

$errors = [];
if ($name === '') $errors['name'] = 'İsim gereklidir.';
if ($phone === '') $errors['phone'] = 'Numara gereklidir.';
if ($message === '') $errors['message'] = 'Mesaj gereklidir.';
if ($name !== '' && mb_strlen($name) < 2) $errors['name'] = 'İsim en az 2 karakter.';
if ($message !== '' && mb_strlen($message) < 5) $errors['message'] = 'Mesaj en az 5 karakter.';

if (!empty($errors)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'errors' => $errors], JSON_UNESCAPED_UNICODE);
  exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$subject = 'Yeni İletişim Mesajı - Şahin Dekorasyon';
$subjectEncoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$body = "Yeni iletişim mesajı:\n\n" .
        "İsim: {$name}\n" .
        "Numara: {$phone}\n\n" .
        "Mesaj:\n{$message}\n\n" .
        "Gönderen IP: {$ip}\n" .
        "User-Agent: {$ua}\n";

$headers = [];
$headers[] = 'From: ' . 'Şahin Dekorasyon Website' . ' <' . $fromEmail . '>';
$headers[] = 'Reply-To: ' . $fromEmail;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$headersStr = implode("\r\n", $headers);

// cPanel/Exim üzerinde -f ile envelope from belirtmek teslimatı iyileştirir
$additionalParams = '-f' . $fromEmail;

$ok = @mail($toEmail, $subjectEncoded, $body, $headersStr, $additionalParams);

if ($ok) {
  echo json_encode(['ok' => true]);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Mail gönderilemedi. Lütfen daha sonra tekrar deneyin.'], JSON_UNESCAPED_UNICODE);
}

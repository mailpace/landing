$url = 'https://app.mailpace.com/api/v1/send';
$data = array(
  'from' => 'test@test.com',
  'to' => 'test@test.com',
  'subject' => 'Hello from MailPace.com',
  'textbody' => 'Hello'
);

$options = array(
  'http' => array(
    'header'  => "Content-type: application/json\r\n" .
           "Accept: application/json\r\n" .
           "mailpace-Server-Token: API_TOKEN_GOES_HERE\r\n",
    'method'  => 'POST',
    'content' => json_encode($data)
  )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
var_dump($result);

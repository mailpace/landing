# Install our ruby gem: https://github.com/mailpace/mailpace-rails

client = MailPace::DomainClient.new('API_TOKEN_HERE')

client.sendEmail(
  from: 'test@test.com',
  to: 'test@test.com',
  subject: 'test',
  htmlbody: '<H1>HTML Email</h1>'
).then do |r|
  puts r
end

req_options = {
  use_ssl: uri.scheme == 'https'
}

response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
  http.request(request)
end

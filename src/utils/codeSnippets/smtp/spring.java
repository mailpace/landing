// Add the following configuration to application.properties:
spring.mail.host=smtp.mailpace.com
spring.mail.port=587
spring.mail.username=YOUR_MAILPACE_SERVER_API_TOKEN
spring.mail.password=YOUR_MAILPACE_SERVER_API_TOKEN
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

// Or if using application.yml:
spring:
  mail:
    host: smtp.mailpace.com
    port: 587
    username: YOUR_MAILPACE_SERVER_API_TOKEN
    password: YOUR_MAILPACE_SERVER_API_TOKEN
    properties:
      mail:
        smtp:
          auth: true
          starttls.enable: true


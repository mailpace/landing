# Add this to your settings.py:

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.mailpace.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "YOUR_MAILPACE_SERVER_API_TOKEN"
EMAIL_HOST_PASSWORD = "YOUR_MAILPACE_SERVER_API_TOKEN"
DEFAULT_FROM_EMAIL = "your-email@example.com"

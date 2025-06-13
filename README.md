# CS391 Attendance

Web application to keep track of students' attendance

## Dev Docs

The following environment variables are required:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI
    - /callback path for your domain
- MONGO_URI
    - MongoDB connection string
- SECRET
    - Any string random characters, essentially a password
- PRIVATE_KEY and PUBLIC_KEY 
    - RSA private and public keys, respectively
- ENVIRONMENT 
    - e.g. dev, prod
- WINDOW_SIZE
    - Positive integer representing the allowable totp offset
    - Defaults to 1
The following public environment variables are recommended:
- NEXT_PUBLIC_INPUT_CODE_LENGTH
    - Positive integer representing the length of manual input codes
    - Defaults to 6 digits
- NEXT_PUBLIC_INPUT_TEMP_CODE_PERIOD
    - Positive integer representing how long, in seconds, manual input temporary codes live
    - Defaults to 15 seconds
- NEXT_PUBLIC_SCAN_TEMP_CODE_LENGTH
    - Positive integer representing the length of scannable codes
    - Defaults to 16 digits
- NEXT_PUBLIC_SCAN_TEMP_CODE_PERIOD
    - Positive integer representing how long, in seconds, scannable temporary codes live
    - Defaults to 5 seconds
The following environment variables are optional and will only affect the dev environment:
- MOCK
- DEFAULT_ROLE
- ENABLE_SIGN_ON
- DISABLE_DAY_CHECKING

![image](https://github.com/user-attachments/assets/bcc0d481-e904-45e5-837e-ec51a6c42c39)

# CS391 Attendance

Web application to keep track of students' attendance

## Dev Docs

The following environment variables are required:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI
- MONGO_URI
- SECRET
- PRIVATE_KEY and PUBLIC_KEY 
- ENVIRONMENT (dev or prod)
- PUBLIC
The following environment variables are recommended:
- TTL 
    - Lifetime of temporary codes in seconds
    - Defaults to 10 seconds
- GRACE_PERIOD
    - Acceptable +/- in milliseconds to account for network delays and clock misalignment 
    - Defaults to 0 milliseconds
- NUM_CODES
    - The number of temporary codes to create at a time, reducing DB calls
    - Defaults to 3
The following environment variables are optional and will only affect the dev environment:
- MOCK
- DEFAULT_ROLE
- ENABLE_SIGN_ON
- DISABLE_DAY_CHECKING

![image](https://github.com/user-attachments/assets/bcc0d481-e904-45e5-837e-ec51a6c42c39)

DE-10-TC01 | POST /api/auth/login with missing email | 400 with error "Email and password are required"
DE-10-TC02 | POST /api/auth/login with missing password | 400 with error "Email and password are required"
DE-10-TC03 | POST /api/auth/login when user is not found | 401 with error "Invalid email or password"
DE-10-TC04 | POST /api/auth/login with wrong password | 401 with error "Invalid email or password"
DE-10-TC05 | POST /api/auth/login when account_status is 0 | 403 with error "Account is suspended"
DE-10-TC06 | POST /api/auth/login when is_deleted is 1 | 403 with error "Account is deleted"
DE-10-TC07 | POST /api/auth/login with valid credentials and active account | 200 with accessToken and safe user payload
DE-10-TC08 | POST /api/auth/login when JWT secret is missing | 500 with error "JWT_ACCESS_SECRET is not configured"
DE-10-TC09 | POST /api/auth/login when JWT expiry is invalid | 500 with error "Internal server error"

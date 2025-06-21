# OIDC Provider Project

This is a minimal **OpenID Connect (OIDC) Provider** built with:

- **Vite-Express** (for easy dev-server integration)
- **TypeScript**
- **Mongoose** (MongoDB)
- **JWT** (for token generation and verification)

---

## Features

- OIDC Authorization Code Flow
- Refresh Token support
- Dynamic Scope Mapping
- UserInfo Endpoint with Scope-Based Filtering
- Secure Token Handling
- Frontend-Backend Integration with Vite

---

## Installation

```bash
git clone https://github.com/disezmike/oidc-provider-vite.git
cd oidc-provider-vite
yarn
```

### Start the Server

```bash
yarn dev
```

This will run the Vite-Express server on `http://localhost:3000`.

---

## Example Environment Configuration (`.env`)

```ini
# Server Config
PORT=3000
JWT_SECRET=your_jwt_secret_key

# PRODUCTION
PROD_HOST=https://your-production-domain.com

# DEV
DEV_HOST=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=27017
DB_DATABASE=oidc

# Google API (Optional if Google Login is added later)
GOOGLE_CLIENT_ID=

# Local Client (Example Client for Local Testing)
LOCAL_CLIENT_ID=your_local_client_id
LOCAL_CLIENT_SECRET=your_local_client_secret
```

---

## API Endpoints

### 1. `/auth/register` (POST)
- Handles registration user.

### 1. `/auth/authorize` (GET/POST)

- Handles authorization requests.
- GET: Prepare login form.
- POST: Validate user, generate auth code.

### 2. `/auth/token` (POST)

- Handles token exchange.
- Supports:
  - `authorization_code` grant
  - `refresh_token` grant

### 3. `/auth/logout` (GET)

- Basic logout endpoint.

### 4. `/api/me` (GET)

- Returns user profile based on granted scopes.
- Requires Bearer access token.

---

## Example Postman Flow

1. **Registration (POST)**
   ```
   POST /auth/register
   Body: { username, password }
   ```

2. **Authorization Request (GET)**

   ```
   GET /auth/authorize?response_type=code&client_id=CLIENT_ID&redirect_uri=http://localhost:4000/callback&scope=openid profile email&state=xyz
   ```

3. **User Login (POST)**

   ```
   POST /auth/authorize
   Body: { username, password, client_id, redirect_uri, state, scope }
   ```

4. **Token Request (POST)**

   ```
   POST /auth/token
   Body: { grant_type, code, client_id, client_secret, redirect_uri }
   ```

5. **User Info (GET)**

   ```
   GET /auth/userinfo
   Headers: Authorization: Bearer {access_token}
   ```

6. **Refresh Token (POST)**

   ```
   POST /auth/token
   Body: { grant_type: 'refresh_token', refresh_token, client_id, client_secret }
   ```

7. **Logout (GET)**

   ```
   GET /auth/logout?id_token_hint=ID_TOKEN_HINT
   ```

---

## Notes

- This project focuses on OIDC Core functionality (Authorization, Token, UserInfo).

---

## Future Improvements

- Add PKCE support
- Implement a full discovery document (`/.well-known/openid-configuration`)
- Add proper session storage or revoke access tokens on logout

---

## License

MIT License


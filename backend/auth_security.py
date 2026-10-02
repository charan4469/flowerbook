from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt


# ==========================================
# JWT CONFIGURATION
# ==========================================

SECRET_KEY = "flowerbook-development-secret-change-before-production"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ==========================================
# CREATE ACCESS TOKEN
# ==========================================

def create_access_token(user_id, email):

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": expire
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# ==========================================
# VERIFY ACCESS TOKEN
# ==========================================

def verify_access_token(token):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        email = payload.get("email")

        if not user_id or not email:

            return None

        return {
            "user_id": int(user_id),
            "email": email
        }

    except (JWTError, ValueError, TypeError):

        return None
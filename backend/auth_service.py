import re

from passlib.context import CryptContext

from auth_database import create_user, get_user_by_email
from auth_security import create_access_token


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def normalize_email(email):
    return email.strip().lower()


def validate_password(password):

    if len(password) < 8:
        return False, "Password must be at least 8 characters."

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."

    if not re.search(r"\d", password):
        return False, "Password must contain at least one number."

    if not re.search(r"[^A-Za-z0-9]", password):
        return False, "Password must contain at least one special character."

    return True, "Password is strong."


def hash_password(password):
    return pwd_context.hash(password)


def verify_password(password, password_hash):
    return pwd_context.verify(password, password_hash)


def register_user(name, email, password):

    name = name.strip()
    email = normalize_email(email)

    if not name:
        return {
            "success": False,
            "message": "Name is required."
        }

    if not email:
        return {
            "success": False,
            "message": "Email is required."
        }

    if not re.match(
        r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$",
        email
    ):
        return {
            "success": False,
            "message": "Please enter a valid email address."
        }

    valid, message = validate_password(password)

    if not valid:
        return {
            "success": False,
            "message": message
        }

    existing_user = get_user_by_email(email)

    if existing_user:
        return {
            "success": False,
            "message": "An account with this email already exists."
        }

    password_hash = hash_password(password)

    user_id = create_user(
        name,
        email,
        password_hash
    )

    if not user_id:
        return {
            "success": False,
            "message": "Unable to create account."
        }

    return {
        "success": True,
        "message": "Account created successfully.",
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    }


def login_user(email, password):

    email = normalize_email(email)

    user = get_user_by_email(email)

    if not user:
        return {
            "success": False,
            "message": "Invalid email or password."
        }

    if not verify_password(
        password,
        user["password_hash"]
    ):
        return {
            "success": False,
            "message": "Invalid email or password."
        }

    access_token = create_access_token(
        user["id"],
        user["email"]
    )

    return {
        "success": True,
        "message": "Login successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }
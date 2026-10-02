import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_DIR = BASE_DIR / "database"
AUTH_DATABASE = DATABASE_DIR / "users.db"


def get_connection():
    DATABASE_DIR.mkdir(exist_ok=True)

    connection = sqlite3.connect(AUTH_DATABASE)

    connection.row_factory = sqlite3.Row

    return connection


def create_users_table():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            email TEXT UNIQUE NOT NULL,

            password_hash TEXT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
    """)

    connection.commit()

    connection.close()


def create_user(name, email, password_hash):

    connection = get_connection()

    cursor = connection.cursor()

    try:

        cursor.execute("""
            INSERT INTO users
            (name, email, password_hash)
            VALUES (?, ?, ?)
        """, (
            name,
            email,
            password_hash
        ))

        connection.commit()

        user_id = cursor.lastrowid

        return user_id

    except sqlite3.IntegrityError:

        return None

    finally:

        connection.close()


def get_user_by_email(email):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM users
        WHERE email = ?
    """, (email,))

    user = cursor.fetchone()

    connection.close()

    return user


def get_user_by_id(user_id):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM users
        WHERE id = ?
    """, (user_id,))

    user = cursor.fetchone()

    connection.close()

    return user


def update_password(email, password_hash):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        UPDATE users
        SET password_hash = ?
        WHERE email = ?
    """, (
        password_hash,
        email
    ))

    connection.commit()

    updated = cursor.rowcount > 0

    connection.close()

    return updated


if __name__ == "__main__":

    create_users_table()

    print("✅ User database ready!")
    print(f"📁 Database: {AUTH_DATABASE}")
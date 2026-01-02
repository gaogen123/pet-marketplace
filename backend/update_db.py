from app import database
from sqlalchemy import text

def update_db():
    db = database.SessionLocal()
    try:
        # Check if role column exists
        result = db.execute(text("SHOW COLUMNS FROM users LIKE 'role'"))
        if not result.fetchone():
            print("Adding 'role' column to users table...")
            db.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
            db.commit()
            print("Column 'role' added successfully.")
        else:
            print("Column 'role' already exists.")
            
    except Exception as e:
        print(f"Error updating database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    update_db()

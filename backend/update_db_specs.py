from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root@localhost/pet_marketplace")
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def add_column_if_not_exists(engine, table_name, column_name, column_type):
    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(text(f"SHOW COLUMNS FROM {table_name} LIKE '{column_name}'"))
        if result.fetchone():
            print(f"Column {column_name} already exists in {table_name}")
        else:
            print(f"Adding column {column_name} to {table_name}")
            conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}"))
            conn.commit()

if __name__ == "__main__":
    print("Updating database schema...")
    add_column_if_not_exists(engine, "cart_items", "selected_specs", "TEXT")
    add_column_if_not_exists(engine, "order_items", "selected_specs", "TEXT")
    print("Database schema updated successfully.")

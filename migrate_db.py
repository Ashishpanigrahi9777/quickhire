import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    print("Checking if 'priority' column exists in 'applications' table...")
    # Using raw SQL for PostgreSQL to check for column existence
    result = conn.execute(text(
        "SELECT column_name FROM information_schema.columns "
        "WHERE table_name='applications' and column_name='priority'"
    )).fetchone()

    if not result:
        print("Adding 'priority' column...")
        conn.execute(text("ALTER TABLE applications ADD COLUMN priority VARCHAR(50) DEFAULT 'Medium' NOT NULL;"))
        conn.commit()
        print("'priority' column added successfully.")
    else:
        print("'priority' column already exists.")

    print("Migration complete.")

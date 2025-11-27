import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from sqlalchemy import create_engine, text
from constants.settings import get_settings


def test_connection():
    print("Testing Supabase Database Connection...")
    SETTINGS = get_settings()
    print("📋 Configuration:")
    print(f"   Environment: {SETTINGS.ENVIRONMENT}")
    print(f"   Stage: {SETTINGS.STAGE}")

    # Parse and display connection info (hide password)
    db_url = SETTINGS.DATABASE_URL

    if "@" in db_url:
        protocol = db_url.split("://")[0]

        remaining = db_url.split("://")[1]
        credentials = remaining.split("@")[0]

        host_info = remaining.split("@")[1]
        username = credentials.split(":")[0]

        print(f"   Protocol: {protocol}")
        print(f"   Username: {username}")
        print(f"   Host: {host_info}")

    print("\n" + "=" * 50)

    try:
        # Create engine
        print("\n🔌 Creating database engine...")
        engine = create_engine(SETTINGS.DATABASE_URL, echo=False)

        # Test connection
        print("🔌 Connecting to database...")
        with engine.connect() as connection:
            print("Connection successful!")
            print("Test 1: Simple query (SELECT 1)")
            result = connection.execute(text("SELECT 1"))
            print(f"Result: {result.fetchone()[0]}")
            print("Pass")
            print("Test 2: Get database timestamp")
            result = connection.execute(text("SELECT NOW()"))
            db_time = result.fetchone()[0]
            print(f"   Database time: {db_time}")

            print("   ✅ Pass\n")

            # Test 3: Get database version

            print("📊 Test 3: Get database version")
            result = connection.execute(text("SELECT version()"))

            version = result.fetchone()[0]

            print(f"   Version: {version.split(',')[0]}")
            print("   ✅ Pass\n")
            print("📊 Test 4: Get database name")
            result = connection.execute(text("SELECT current_database()"))
            db_name = result.fetchone()[0]
            print(f"   Database: {db_name}")
            print("   ✅ Pass\n")

            # Test 5: List tables
            print("📊 Test 5: List all tables")
            result = connection.execute(
                text(
                    """
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """
                )
            )
            tables = [row[0] for row in result.fetchall()]
            print(f"   Found {len(tables)} tables:")
            for table in tables:
                print(f"      - {table}")

            print("   ✅ Pass\n")
            print("📊 Test 6: Check Alembic migrations")
            result = connection.execute(
                text(
                    """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'alembic_version'
                )
            """
                )
            )
            has_alembic = result.fetchone()[0]
            if has_alembic:
                result = connection.execute(
                    text("SELECT version_num FROM alembic_version")
                )

                version_num = result.fetchone()
                if version_num:
                    print(f"   Current migration: {version_num[0]}")
                    print("   ✅ Pass\n")
                else:
                    print("   ⚠️  No migrations applied yet\n")
            else:
                print("   ⚠️  Alembic not initialized\n")

        print("=" * 50)
        print("\n✅ All tests passed!")
        print("🎉 Your FastAPI backend is successfully connected to Supabase!\n")

    except Exception as e:
        print("\n" + "=" * 50)
        print("\n❌ Connection failed!")
        print(f"Error: {str(e)}\n")
        print("Troubleshooting steps:")
        print("1. Check your .env file has correct DATABASE_URL")
        print("2. Verify Supabase project is running")
        print("3. Check if your IP is allowed in Supabase dashboard")
        print("4. Verify database credentials are correct\n")
        sys.exit(1)


if __name__ == "__main__":
    test_connection()

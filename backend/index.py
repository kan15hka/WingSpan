# api/index.py
from app import create_app

app = create_app()

# This is required for Vercel serverless functions
if __name__ == "__main__":
    app.run()
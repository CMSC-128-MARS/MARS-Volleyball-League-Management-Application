# main.py
import os
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Project metadata
PROJECT_NAME = os.getenv("PROJECT_NAME", "Team MARS API")
PROJECT_CONTACT = {
    "name": "Team MARS Backend Team",
    "email": os.getenv("CONTACT_EMAIL"),
}

# Initialize FastAPI app

app = FastAPI(
    title=PROJECT_NAME,
    version="0.1.0",
    contact=PROJECT_CONTACT,
)


@app.get("/", include_in_schema=False)
def welcome():
    html_content = """

    <html>
        <head>
            <title>Welcome to Team MARS API</title>
        </head>
        <body>
            <h1>Welcome to Team MARS API</h1>
            <p>The backend service is running successfully 🎉</p>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/health", tags=["System"])
def health_check():
    """
    Health check endpoint.
    Returns the current status of the API service.
    """
    return JSONResponse(
        status_code=200,
        content={
            "status": "ok",
            "service": PROJECT_NAME,
            "environment": os.getenv("ENVIRONMENT", "development"),
        },
    )


# Placeholder for including routers later
# from app.presentation.api import router
# app.include_router(router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

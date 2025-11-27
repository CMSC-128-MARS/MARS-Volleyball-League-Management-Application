from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse

from fastapi.middleware.cors import CORSMiddleware
from config.settings import get_settings

# Import all routers
from controller.health_check import router as health_router
from controller.player_controller import router as player_router
from controller.team_controller import router as team_router

from controller.league_controller import router as league_router
from controller.match_controller import router as match_router

from controller.admin_controller import router as admin_router

# Get settings
SETTINGS = get_settings()


# Initialize FastAPI app
app = FastAPI(
    title=SETTINGS.PROJECT_NAME,
    version="0.1.0",
    contact={
        "name": "Team MARS Backend Team",
        "email": SETTINGS.CONTACT_EMAIL,
    },
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(health_router)
app.include_router(player_router)
app.include_router(team_router)
app.include_router(league_router)
app.include_router(match_router)
app.include_router(admin_router)


@app.get("/", include_in_schema=False)
def welcome():
    html_content = """
    <html>
        <head>
            <title>Welcome to Team MARS API</title>
        </head>
        <body>
            <h1>Welcome to Team MARS API</h1>
            <p>The backend service is running successfully 🎉<

/           <p><a href="/docs">View API Documentation</a></p>
        </body>

    </html>

    """
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/health", tags=["System"])
def health_check():
    """Health check endpoint"""

    return JSONResponse(
        status_code=200,
        content={
            "status": "ok",
            "service": SETTINGS.PROJECT_NAME,
            "environment": SETTINGS.ENVIRONMENT,
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

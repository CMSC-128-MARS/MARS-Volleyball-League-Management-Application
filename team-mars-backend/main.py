from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
import logging

from constants.settings import get_settings
from mangum import Mangum

# Import all routers
from controller.health_check import router as health_router
from controller.player_controller import router as player_router
from controller.team_controller import router as team_router
from controller.team_player_controller import router as team_player_router
from controller.match_controller import router as match_router
from controller.league_controller import router as league_router
from controller.match_team_stats_controller import router as match_team_stats_router
from controller.team_generator_controller import router as team_generator_controller

from model import rebuild_models


# ------------------------------------------------------------------------------
# Settings & Logging
# ------------------------------------------------------------------------------
SETTINGS = get_settings()

logging.basicConfig(
    level=logging.INFO if SETTINGS.ENVIRONMENT != "production" else logging.WARNING,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("api")


# ------------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ------------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application...")
    rebuild_models()
    yield
    logger.info("Shutting down application...")


# ------------------------------------------------------------------------------
# App Initialization
# ------------------------------------------------------------------------------
app = FastAPI(
    title=SETTINGS.PROJECT_NAME,
    version="0.1.0",
    contact={
        "name": "Team MARS Backend Team",
        "email": SETTINGS.CONTACT_EMAIL,
    },
    lifespan=lifespan,
)


# ------------------------------------------------------------------------------
# Middleware
# ------------------------------------------------------------------------------

# 1️⃣ CORS (lock this to your deployed frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=SETTINGS.CORS_ORIGINS,  # e.g. ["https://your-frontend.com"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


# 2️⃣ Request / Response Logging
@app.middleware("http")
async def request_logger(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = round(time.time() - start_time, 4)
    logger.info(
        f"{request.method} {request.url.path} "
        f"| {response.status_code} "
        f"| {duration}s"
    )

    return response


# 3️⃣ Security Headers
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-XSS-Protection"] = "1; mode=block"

    return response


# 4️⃣ Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error on {request.url.path}")

    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "service": SETTINGS.PROJECT_NAME,
        },
    )


# ------------------------------------------------------------------------------
# Routers
# ------------------------------------------------------------------------------
app.include_router(health_router)
app.include_router(player_router)
app.include_router(team_router)
app.include_router(team_player_router)
app.include_router(match_router)
app.include_router(league_router)
app.include_router(match_team_stats_router)
app.include_router(team_generator_controller)


# ------------------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------------------
@app.get("/", include_in_schema=False)
def welcome():
    return HTMLResponse(
        content="""
        <html>
            <head><title>Team MARS API</title></head>
            <body style="text-align:center;padding:20px;">
                <h1>🚀 Team MARS API</h1>
                <p>Backend is alive and kicking.</p>
                <p><a href="/docs">API Documentation</a></p>
            </body>
        </html>
        """,
        status_code=200,
    )


@app.get("/health", tags=["System"], include_in_schema=False)
def health_check():
    return {
        "status": "ok",
        "service": SETTINGS.PROJECT_NAME,
        "environment": SETTINGS.ENVIRONMENT,
    }


# ------------------------------------------------------------------------------
# AWS Lambda Handler
# ------------------------------------------------------------------------------
handler = Mangum(app, lifespan="off")


# ------------------------------------------------------------------------------
# Local Dev
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
import time
import logging

from app.api.routes import router
from app.core.config import settings
from app.db import init_db

app = FastAPI(title=settings.app_name, debug=settings.debug)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("hirewell.api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)


@app.middleware("http")
async def request_metrics(request: Request, call_next):
    started = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - started) * 1000
    logger.info("%s %s -> %s in %.2fms", request.method, request.url.path, response.status_code, elapsed_ms)
    return response


@app.on_event("startup")
def on_startup():
    init_db()

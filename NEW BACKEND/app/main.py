from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, devices, contacts, sos, search, reports
from app.routers import location, saferoute, community, analytics, ai_predict

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SafeStep API", description="Backend for SafeStep Emergency Insole")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(devices.router, prefix="/api")
app.include_router(contacts.router, prefix="/api")
app.include_router(sos.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(location.router, prefix="/api")
app.include_router(saferoute.router, prefix="/api")
app.include_router(community.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(ai_predict.router, prefix="/api")


@app.get("/")
def home():
    return {"message": "SafeStep API is running"}
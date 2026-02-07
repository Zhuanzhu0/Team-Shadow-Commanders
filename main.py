from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

from routers import auth
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/patient", response_class=HTMLResponse)
async def read_patient(request: Request):
    return templates.TemplateResponse("patient.html", {"request": request})

@app.get("/doctor", response_class=HTMLResponse)
async def read_doctor(request: Request):
    return templates.TemplateResponse("doctor.html", {"request": request})

@app.get("/staff", response_class=HTMLResponse)
async def read_staff(request: Request):
    return templates.TemplateResponse("staff.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def read_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/signup", response_class=HTMLResponse)
async def read_signup(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

@app.get("/otp", response_class=HTMLResponse)
async def read_otp(request: Request):
    return templates.TemplateResponse("otp.html", {"request": request})

import asyncio
import csv
import io
import logging
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

import stripe
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Request, Header
from fastapi.responses import FileResponse, PlainTextResponse
from pydantic import BaseModel, Field, EmailStr
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from lib.db import client, db, ensure_indexes

DOWNLOADS_DIR = ROOT_DIR / "downloads"
PDF_PATH = DOWNLOADS_DIR / "guide.pdf"

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

DEFAULT_SETTINGS = {
    "id": "site",
    "product_name": "Le Guide de l'Abondance Intérieure",
    "price_euros": 8.90,
    "contact_email": "contact@abondance-interieure.fr",
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    existing = await db.settings.find_one({"id": "site"})
    if not existing:
        await db.settings.insert_one(dict(DEFAULT_SETTINGS))
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


# ---------- Models ----------

class LeadCreate(BaseModel):
    prenom: str = Field(min_length=1, max_length=60)
    email: EmailStr
    consent: bool

class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    prenom: str
    email: str
    created_at: str

class PublicConfig(BaseModel):
    product_name: str
    price_euros: float
    contact_email: str

class AdminLogin(BaseModel):
    password: str

class ConfigUpdate(BaseModel):
    price_euros: float = Field(gt=0, le=1000)
    contact_email: EmailStr

class CheckoutRequest(BaseModel):
    origin_url: str
    prenom: Optional[str] = None
    email: Optional[EmailStr] = None

class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str

class PaymentStatus(BaseModel):
    session_id: str
    status: str
    payment_status: str


# ---------- Helpers ----------

async def get_settings() -> dict:
    doc = await db.settings.find_one({"id": "site"}, {"_id": 0})
    return doc or DEFAULT_SETTINGS

def require_admin(x_admin_key: Optional[str] = Header(None)):
    if not ADMIN_PASSWORD or x_admin_key != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Non autorisé")


# ---------- Public routes ----------

@api_router.get("/")
async def root():
    return {"message": "Le Guide de l'Abondance Intérieure — API"}

@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    if not input.consent:
        raise HTTPException(status_code=400, detail="Le consentement est requis.")
    now = datetime.now(timezone.utc).isoformat()
    existing = await db.leads.find_one({"email": input.email.lower()})
    if existing:
        await db.leads.update_one(
            {"email": input.email.lower()},
            {"$set": {"prenom": input.prenom.strip(), "created_at": now}},
        )
        return Lead(id=existing["id"], prenom=input.prenom.strip(), email=input.email.lower(), created_at=now)
    lead = Lead(prenom=input.prenom.strip(), email=input.email.lower(), created_at=now)
    await db.leads.insert_one(lead.model_dump())
    return lead

@api_router.get("/config", response_model=PublicConfig)
async def public_config():
    s = await get_settings()
    return PublicConfig(**{k: s[k] for k in ("product_name", "price_euros", "contact_email")})


# ---------- Admin routes ----------

@api_router.post("/admin/login")
async def admin_login(input: AdminLogin):
    if not ADMIN_PASSWORD or input.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Mot de passe incorrect")
    return {"ok": True}

@api_router.get("/admin/leads", response_model=List[Lead])
async def admin_leads(_=None, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    return [Lead(**d) for d in docs]

@api_router.get("/admin/leads.csv")
async def admin_leads_csv(x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["prenom", "email", "date"])
    for d in docs:
        writer.writerow([d["prenom"], d["email"], d["created_at"]])
    return PlainTextResponse(buf.getvalue(), media_type="text/csv")

@api_router.get("/admin/payments")
async def admin_payments(x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    docs = await db.payment_transactions.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    return docs

@api_router.put("/admin/config", response_model=PublicConfig)
async def admin_config_update(input: ConfigUpdate, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    await db.settings.update_one(
        {"id": "site"},
        {"$set": {"price_euros": input.price_euros, "contact_email": str(input.contact_email)}},
        upsert=True,
    )
    s = await get_settings()
    return PublicConfig(**{k: s[k] for k in ("product_name", "price_euros", "contact_email")})


# ---------- Stripe payments ----------

@api_router.post("/payments/checkout", response_model=CheckoutResponse)
async def create_checkout(req: CheckoutRequest):
    s = await get_settings()
    amount_cents = int(round(float(s["price_euros"]) * 100))
    kwargs = dict(
        mode="payment",
        line_items=[{
            "price_data": {
                "currency": "eur",
                "unit_amount": amount_cents,
                "product_data": {"name": s["product_name"], "tax_code": "txcd_10302000"},
            },
            "quantity": 1,
        }],
        success_url=f"{req.origin_url}/merci?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{req.origin_url}/#prix",
        metadata={"product": "abondance_guide"},
    )
    if req.email:
        kwargs["customer_email"] = str(req.email)
    try:
        session = stripe.checkout.Session.create(**kwargs, managed_payments={"enabled": True})
    except stripe.error.InvalidRequestError as e:
        msg = (getattr(e, "user_message", None) or str(e)).lower()
        if "managed payments" in msg or "ineligible" in msg:
            try:
                session = stripe.checkout.Session.create(
                    **kwargs, automatic_tax={"enabled": True}, billing_address_collection="required",
                )
            except stripe.error.InvalidRequestError:
                session = stripe.checkout.Session.create(**kwargs)
        else:
            raise
    now = datetime.now(timezone.utc).isoformat()
    await db.payment_transactions.insert_one({
        "session_id": session.id,
        "prenom": req.prenom or "",
        "email": str(req.email) if req.email else "",
        "amount": amount_cents / 100.0,
        "currency": "eur",
        "status": "initiated",
        "payment_status": "pending",
        "created_at": now,
        "updated_at": now,
    })
    return CheckoutResponse(checkout_url=session.url, session_id=session.id)


@api_router.get("/payments/status/{session_id}", response_model=PaymentStatus)
async def payment_status(session_id: str):
    record = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Transaction introuvable")
    if record.get("payment_status") != "paid":
        try:
            s = stripe.checkout.Session.retrieve(session_id)
            if s.payment_status == "paid" or s.status == "complete":
                await db.payment_transactions.update_one(
                    {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                    {"$set": {"status": "completed", "payment_status": "paid",
                              "stripe_payment_intent_id": s.payment_intent,
                              "updated_at": datetime.now(timezone.utc).isoformat()}},
                )
                record = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        except stripe.error.StripeError:
            pass
    return PaymentStatus(session_id=record["session_id"], status=record["status"], payment_status=record["payment_status"])


@api_router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    obj, t = event["data"]["object"], event["type"]
    now = datetime.now(timezone.utc).isoformat()
    if t == "checkout.session.completed":
        await db.payment_transactions.update_one(
            {"session_id": obj["id"], "payment_status": {"$ne": "paid"}},
            {"$set": {"status": "completed", "payment_status": obj.get("payment_status", "paid"),
                      "stripe_payment_intent_id": obj.get("payment_intent"), "updated_at": now}},
        )
    elif t == "checkout.session.async_payment_succeeded":
        await db.payment_transactions.update_one({"session_id": obj["id"]},
            {"$set": {"payment_status": "paid", "updated_at": now}})
    elif t == "checkout.session.async_payment_failed":
        await db.payment_transactions.update_one({"session_id": obj["id"]},
            {"$set": {"status": "failed", "payment_status": "failed", "updated_at": now}})
    elif t == "checkout.session.expired":
        await db.payment_transactions.update_one({"session_id": obj["id"]},
            {"$set": {"status": "expired", "payment_status": "expired", "updated_at": now}})
    elif t == "charge.refunded":
        await db.payment_transactions.update_one({"stripe_payment_intent_id": obj.get("payment_intent")},
            {"$set": {"status": "refunded", "payment_status": "refunded", "updated_at": now}})
    return {"status": "ok"}


@api_router.get("/download/guide")
async def download_guide(session_id: str):
    record = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not record or record.get("payment_status") != "paid":
        raise HTTPException(status_code=403, detail="Paiement non confirmé")
    if not PDF_PATH.exists():
        raise HTTPException(status_code=404, detail="Fichier PDF non configuré")
    return FileResponse(PDF_PATH, media_type="application/pdf", filename="Le-Guide-de-lAbondance-Interieure.pdf")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import (
    FastAPI,
    Depends,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from pydantic import BaseModel


from excel_service import (
    get_flowers,
    save_order,
    get_orders_by_email
)

from invoice_service import (
    generate_invoice
)


from auth_database import (
    create_users_table,
    get_user_by_id
)

from auth_service import (
    register_user,
    login_user
)

from auth_security import (
    verify_access_token
)


# ==========================================
# FLOWERBOOK API
# ==========================================

app = FastAPI(
    title="FlowerBook API",
    description="Online Flower Booking App API",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==========================================
# CREATE USER DATABASE
# ==========================================

create_users_table()


# ==========================================
# SECURITY
# ==========================================

security = HTTPBearer()


# ==========================================
# REQUEST MODELS
# ==========================================

class RegisterRequest(BaseModel):

    name: str

    email: str

    password: str


class LoginRequest(BaseModel):

    email: str

    password: str


class OrderItem(BaseModel):

    name: str

    quantity: int

    price: float


class OrderRequest(BaseModel):

    customer_name: str

    email: str

    phone: str

    address: str

    delivery_date: str

    delivery_time: str

    special_message: str = ""

    items: list[OrderItem]


# ==========================================
# VERIFY CURRENT USER
# ==========================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    token = credentials.credentials

    token_data = verify_access_token(
        token
    )


    if not token_data:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired login token."
        )


    user = get_user_by_id(
        token_data["user_id"]
    )


    if not user:

        raise HTTPException(
            status_code=401,
            detail="User account not found."
        )


    return user


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():

    return {

        "message":
            "🌸 Welcome to FlowerBook API!",

        "status":
            "running"

    }


# ==========================================
# REGISTER
# ==========================================

@app.post(
    "/api/auth/register"
)
def register(
    request: RegisterRequest
):

    return register_user(

        request.name,

        request.email,

        request.password

    )


# ==========================================
# LOGIN
# ==========================================

@app.post(
    "/api/auth/login"
)
def login(
    request: LoginRequest
):

    return login_user(

        request.email,

        request.password

    )


# ==========================================
# GET FLOWERS
# ==========================================

@app.get(
    "/api/flowers"
)
def flowers():

    return get_flowers()


# ==========================================
# CREATE ORDER
# ==========================================

@app.post(
    "/api/orders"
)
def create_order(

    order: OrderRequest,

    current_user=Depends(
        get_current_user
    )

):

    # ==========================================
    # VERIFY ORDER EMAIL
    # ==========================================

    if (
        order.email.strip().lower()
        !=
        current_user["email"].strip().lower()
    ):

        raise HTTPException(
            status_code=403,
            detail=
                "Order email must match the logged-in account."
        )


    # ==========================================
    # CONVERT ORDER
    # ==========================================

    order_data = order.model_dump()


    # ==========================================
    # SAVE ORDER
    # ==========================================

    result = save_order(
        order_data
    )


    # ==========================================
    # GENERATE INVOICE
    # ==========================================

    invoice_path = generate_invoice(
        order_data,
        result
    )


    # ==========================================
    # RESPONSE
    # ==========================================

    return {

        "message":
            "🌸 Order placed successfully!",

        "order":
            result,

        "invoice":
            invoice_path

    }


# ==========================================
# GET MY ORDERS
# ==========================================

@app.get(
    "/api/orders/my-orders"
)
def get_my_orders(

    current_user=Depends(
        get_current_user
    )

):

    orders = get_orders_by_email(
        current_user["email"]
    )


    return {

        "success":
            True,

        "orders":
            orders

    }
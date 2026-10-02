// ==========================================
// FlowerBook Checkout
// ==========================================

const API_URL = "http://127.0.0.1:8000";


// ==========================================
// GET LOGGED-IN USER
// ==========================================

function getLoggedInUser() {

    return JSON.parse(
        localStorage.getItem("flowerUser")
    );

}


// ==========================================
// GET JWT TOKEN
// ==========================================

function getAuthToken() {

    return localStorage.getItem(
        "flowerToken"
    );

}


// ==========================================
// LOAD CART
// ==========================================

const cart =
    JSON.parse(
        localStorage.getItem("flowerCart")
    ) || [];


// ==========================================
// CHECK CHECKOUT ACCESS
// ==========================================

function checkCheckoutAccess() {

    const user =
        getLoggedInUser();

    const token =
        getAuthToken();


    // ------------------------------------------
    // LOGIN CHECK
    // ------------------------------------------

    if (!user || !token) {

        alert(
            "🔐 Please login to FlowerBook before checkout."
        );

        window.location.href =
            "login.html";

        return false;
    }


    // ------------------------------------------
    // CART CHECK
    // ------------------------------------------

    if (cart.length === 0) {

        alert(
            "🛒 Your cart is empty."
        );

        window.location.href =
            "cart.html";

        return false;
    }


    return true;

}


// ==========================================
// DISPLAY ORDER SUMMARY
// ==========================================

function displayCheckout() {

    const container =
        document.getElementById(
            "checkout-items"
        );

    const totalElement =
        document.getElementById(
            "checkout-total"
        );


    if (!container || !totalElement) {

        return;

    }


    if (cart.length === 0) {

        container.innerHTML = `
            <p>
                Your cart is empty.
            </p>
        `;

        totalElement.textContent =
            "₹0";

        return;
    }


    let total = 0;


    container.innerHTML =
        "";


    cart.forEach(
        item => {

            const quantity =
                Number(
                    item.quantity
                ) || 1;


            const price =
                Number(
                    item.price
                ) || 0;


            const itemTotal =
                price * quantity;


            total += itemTotal;


            const itemElement =
                document.createElement(
                    "div"
                );


            itemElement.className =
                "checkout-item";


            itemElement.innerHTML = `

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        ₹${price} × ${quantity}
                    </p>

                </div>

                <strong>
                    ₹${itemTotal}
                </strong>

            `;


            container.appendChild(
                itemElement
            );

        }
    );


    totalElement.textContent =
        `₹${total}`;

}


// ==========================================
// PLACE ORDER
// ==========================================

async function placeOrder() {


    // ==========================================
    // SECURITY CHECK
    // ==========================================

    if (!checkCheckoutAccess()) {

        return;

    }


    const token =
        getAuthToken();


    // ==========================================
    // GET FORM VALUES
    // ==========================================

    const customerName =
        document
            .getElementById(
                "customer-name"
            )
            .value
            .trim();


    const customerEmail =
        document
            .getElementById(
                "customer-email"
            )
            .value
            .trim();


    const customerPhone =
        document
            .getElementById(
                "customer-phone"
            )
            .value
            .trim();


    const customerAddress =
        document
            .getElementById(
                "customer-address"
            )
            .value
            .trim();


    const deliveryDate =
        document
            .getElementById(
                "delivery-date"
            )
            .value;


    const deliveryTime =
        document
            .getElementById(
                "delivery-time"
            )
            .value;


    const specialMessage =
        document
            .getElementById(
                "special-message"
            )
            .value
            .trim();


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!customerName) {

        alert(
            "Please enter your full name."
        );

        return;
    }


    if (!customerEmail) {

        alert(
            "Please enter your email address."
        );

        return;
    }


    if (!customerPhone) {

        alert(
            "Please enter your phone number."
        );

        return;
    }


    if (!customerAddress) {

        alert(
            "Please enter your delivery address."
        );

        return;
    }


    if (!deliveryDate) {

        alert(
            "Please select a delivery date."
        );

        return;
    }


    if (!deliveryTime) {

        alert(
            "Please select a delivery time."
        );

        return;
    }


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    // ==========================================
    // PREPARE ORDER ITEMS
    // ==========================================

    const orderItems =
        cart.map(
            item => ({

                name:
                    item.name,

                quantity:
                    Number(
                        item.quantity
                    ),

                price:
                    Number(
                        item.price
                    )

            })
        );


    // ==========================================
    // ORDER DATA
    // ==========================================

    const orderData = {

        customer_name:
            customerName,

        email:
            customerEmail,

        phone:
            customerPhone,

        address:
            customerAddress,

        delivery_date:
            deliveryDate,

        delivery_time:
            deliveryTime,

        special_message:
            specialMessage,

        items:
            orderItems

    };


    // ==========================================
    // BUTTON
    // ==========================================

    const button =
        document.querySelector(
            ".place-order-btn"
        );


    const originalButtonText =
        button.textContent;


    button.disabled =
        true;


    button.textContent =
        "Processing...";


    // ==========================================
    // SEND ORDER TO FASTAPI
    // ==========================================

    try {

        const response =
            await fetch(
                `${API_URL}/api/orders`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(
                            orderData
                        )

                }
            );


        const result =
            await response.json();


        console.log(
            "FASTAPI RESPONSE:",
            result
        );


        // ==========================================
        // AUTHENTICATION ERROR
        // ==========================================

        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "flowerToken"
            );

            localStorage.removeItem(
                "flowerUser"
            );


            alert(
                "🔐 Your login session has expired. Please login again."
            );


            window.location.href =
                "login.html";


            return;
        }


        // ==========================================
        // EMAIL / USER MISMATCH
        // ==========================================

        if (
            response.status === 403
        ) {

            alert(
                result.detail ||
                "You are not authorized to place this order."
            );


            button.disabled =
                false;


            button.textContent =
                originalButtonText;


            return;
        }


        // ==========================================
        // OTHER ERROR
        // ==========================================

        if (!response.ok) {

            console.error(
                "Order error:",
                result
            );


            alert(
                result.detail ||
                "Unable to place your booking. Please try again."
            );


            button.disabled =
                false;


            button.textContent =
                originalButtonText;


            return;
        }


        // ==========================================
        // SAVE ORDER FOR SUCCESS PAGE
        // ==========================================

        const orderInfo = {

            bookingId:
                result.order.order_id,

            customerId:
                result.order.customer_id,

            customerName:
                customerName,

            email:
                customerEmail,

            phone:
                customerPhone,

            address:
                customerAddress,

            deliveryDate:
                deliveryDate,

            deliveryTime:
                deliveryTime,

            specialMessage:
                specialMessage,

            items:
                cart,

            status:
                result.order.status

        };


        localStorage.setItem(
            "flowerOrder",
            JSON.stringify(
                orderInfo
            )
        );


        // ==========================================
        // CLEAR CART
        // ==========================================

        localStorage.removeItem(
            "flowerCart"
        );


        // ==========================================
        // SUCCESS PAGE
        // ==========================================

        window.location.href =
            "order-success.html";


    } catch (error) {

        console.error(
            "Connection error:",
            error
        );


        alert(
            "Unable to connect to FlowerBook server. Please make sure the backend is running."
        );


        button.disabled =
            false;


        button.textContent =
            originalButtonText;

    }

}


// ==========================================
// LOAD PAGE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            !checkCheckoutAccess()
        ) {

            return;

        }


        displayCheckout();

    }
);
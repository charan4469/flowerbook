const API_URL = "http://127.0.0.1:8000";


// ==========================================
// USER
// ==========================================

function getLoggedInUser() {

    return JSON.parse(
        localStorage.getItem("flowerUser")
    );

}


// ==========================================
// TOKEN
// ==========================================

function getAuthToken() {

    return localStorage.getItem(
        "flowerToken"
    );

}


// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );

    if (!cartCount) {
        return;
    }

    const cart =
        JSON.parse(
            localStorage.getItem("flowerCart")
        ) || [];

    const count =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.quantity || 0),
            0
        );

    cartCount.textContent = count;
}


// ==========================================
// FLOWER EMOJI
// ==========================================

function getFlowerEmoji(name) {

    const value =
        String(name).toLowerCase();

    if (value.includes("rose")) {
        return "🌹";
    }

    if (value.includes("lily")) {
        return "🌷";
    }

    if (value.includes("sunflower")) {
        return "🌻";
    }

    if (value.includes("tulip")) {
        return "🌷";
    }

    return "💐";
}


// ==========================================
// FORMAT CURRENCY
// ==========================================

function formatCurrency(amount) {

    return `₹${Number(amount || 0).toFixed(2)}`;

}


// ==========================================
// COPY BOOKING ID
// ==========================================

async function copyBookingId(orderId) {

    try {

        await navigator.clipboard.writeText(
            orderId
        );

        alert(
            "📋 Booking ID copied!"
        );

    } catch (error) {

        alert(
            `Booking ID: ${orderId}`
        );

    }

}


// ==========================================
// REORDER
// ==========================================

function reorder(order) {

    const items =
        order.itemsData || [];

    if (items.length === 0) {

        alert(
            "Unable to reorder this booking."
        );

        return;
    }


    let cart = [];


    items.forEach(
        item => {

            cart.push({

                id:
                    item.id || Date.now(),

                name:
                    item.name,

                price:
                    Number(item.price || 0),

                category:
                    item.category || "",

                description:
                    item.description || "",

                quantity:
                    Number(item.quantity || 1)

            });

        }
    );


    localStorage.setItem(
        "flowerCart",
        JSON.stringify(cart)
    );


    alert(
        "🌸 Flowers added to your cart!"
    );


    window.location.href =
        "cart.html";

}


// ==========================================
// LOAD ORDER HISTORY
// ==========================================

async function loadOrderHistory() {

    const container =
        document.getElementById(
            "order-history-container"
        );


    if (!container) {
        return;
    }


    const user =
        getLoggedInUser();

    const token =
        getAuthToken();


    // ==========================================
    // LOGIN CHECK
    // ==========================================

    if (!user || !token) {

        container.innerHTML = `

            <div class="empty-cart">

                <div>
                    🔐
                </div>

                <h3>
                    Login Required
                </h3>

                <p>
                    Please login to view your bookings.
                </p>

                <a href="login.html">
                    Login to FlowerBook →
                </a>

            </div>

        `;

        return;
    }


    // ==========================================
    // LOADING
    // ==========================================

    container.innerHTML = `

        <div class="loading">

            Loading your beautiful bookings... 🌸

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/api/orders/my-orders`,
                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const result =
            await response.json();


        console.log(
            "ORDER HISTORY:",
            result
        );


        // ==========================================
        // TOKEN EXPIRED
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


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Unable to load bookings."
            );

        }


        const orders =
            result.orders || [];


        // ==========================================
        // NO BOOKINGS
        // ==========================================

        if (orders.length === 0) {

            container.innerHTML = `

                <div class="empty-cart">

                    <div>
                        🌸
                    </div>

                    <h3>
                        No bookings yet
                    </h3>

                    <p>
                        Your beautiful flower journey
                        starts here.
                    </p>

                    <a href="index.html#flowers">
                        Explore Flowers →
                    </a>

                </div>

            `;

            return;
        }


        // ==========================================
        // BUILD CARDS
        // ==========================================

        let html = `

            <div class="booking-count">

                ${orders.length}
                booking${orders.length === 1 ? "" : "s"}

            </div>

        `;


        orders.forEach(
            order => {

                const status =
                    String(
                        order.status || "Confirmed"
                    );


                const statusClass =
                    status.toLowerCase()
                        .replace(
                            /\s+/g,
                            "-"
                        );


                const flowerNames =
                    String(
                        order.items || ""
                    );


                const flowerList =
                    flowerNames
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(
                            item =>
                                item
                        );


                let flowerHTML = "";


                flowerList.forEach(
                    flower => {

                        flowerHTML += `

                            <div class="booking-flower">

                                <span class="booking-flower-icon">

                                    ${getFlowerEmoji(
                                        flower
                                    )}

                                </span>

                                <span>

                                    ${flower}

                                </span>

                            </div>

                        `;

                    }
                );


                html += `

                    <div class="booking-card">

                        <!-- HEADER -->

                        <div class="booking-card-header">

                            <div>

                                <span class="booking-label">

                                    BOOKING ID

                                </span>


                                <div class="booking-id-row">

                                    <strong>

                                        ${order.order_id}

                                    </strong>


                                    <button
                                        class="copy-booking-btn"
                                        onclick="copyBookingId('${order.order_id}')"
                                        title="Copy Booking ID"
                                    >

                                        📋

                                    </button>

                                </div>

                            </div>


                            <span
                                class="booking-status ${statusClass}"
                            >

                                ✓ ${status}

                            </span>

                        </div>


                        <!-- DETAILS -->

                        <div class="booking-details-grid">


                            <div class="booking-detail">

                                <span>

                                    📅

                                    Delivery Date

                                </span>

                                <strong>

                                    ${order.delivery_date}

                                </strong>

                            </div>


                            <div class="booking-detail">

                                <span>

                                    ⏰

                                    Delivery Time

                                </span>

                                <strong>

                                    ${order.delivery_time}

                                </strong>

                            </div>


                            <div class="booking-detail">

                                <span>

                                    📍

                                    Delivery Address

                                </span>

                                <strong>

                                    ${order.address}

                                </strong>

                            </div>


                            <div class="booking-detail">

                                <span>

                                    💰

                                    Order Total

                                </span>

                                <strong class="booking-total">

                                    ${formatCurrency(
                                        order.total
                                    )}

                                </strong>

                            </div>


                        </div>


                        <!-- FLOWERS -->

                        <div class="booking-flowers-section">

                            <h4>

                                🌸 Your Flowers

                            </h4>


                            <div class="booking-flowers">

                                ${flowerHTML}

                            </div>

                        </div>


                        <!-- FOOTER -->

                        <div class="booking-card-footer">

                            <span>

                                🌷 Thank you for choosing FlowerBook

                            </span>


                            <button
                                class="reorder-btn"
                                onclick='reorder(${JSON.stringify(order).replace(/'/g, "&#39;")})'
                            >

                                🔄 Reorder

                            </button>

                        </div>

                    </div>

                `;

            }
        );


        container.innerHTML =
            html;


    } catch (error) {

        console.error(
            "ORDER HISTORY ERROR:",
            error
        );


        container.innerHTML = `

            <div class="loading">

                ❌ Unable to load your bookings.

                <br><br>

                Please try again.

            </div>

        `;

    }

}


// ==========================================
// START
// ==========================================

updateCartCount();

loadOrderHistory();
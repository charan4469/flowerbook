const API_URL = "http://127.0.0.1:8000";

let cart = JSON.parse(localStorage.getItem("flowerCart")) || [];

let flowers = [];


// ==========================================
// USER / PROFILE
// ==========================================

function getLoggedInUser() {

    return JSON.parse(
        localStorage.getItem("flowerUser")
    );

}


// ==========================================
// UPDATE NAVBAR
// ==========================================

function updateNavbar() {

    const navActions =
        document.querySelector(".nav-actions");

    if (!navActions) {
        return;
    }


    const user = getLoggedInUser();


    // ------------------------------------------
    // NOT LOGGED IN
    // ------------------------------------------

    if (!user) {

        navActions.innerHTML = `

            <button
                class="cart-btn"
                onclick="window.location.href='cart.html'"
            >
                🛒
                <span id="cart-count">0</span>
            </button>

            <button
                class="login-btn"
                onclick="window.location.href='login.html'"
            >
                Login
            </button>

        `;

        updateCartCount();

        return;
    }


    // ------------------------------------------
    // LOGGED IN
    // ------------------------------------------

    navActions.innerHTML = `

        <button
            class="cart-btn"
            onclick="window.location.href='cart.html'"
        >
            🛒
            <span id="cart-count">0</span>
        </button>


        <div class="profile-container">

            <button
                class="profile-btn"
                onclick="toggleProfileMenu()"
            >
                👤
                <span>${user.name}</span>
                ▾
            </button>


            <div
                class="profile-menu"
                id="profile-menu"
            >

                <div class="profile-header">

                    <div class="profile-avatar">
                        👤
                    </div>

                    <div>

                        <strong>
                            ${user.name}
                        </strong>

                        <small>
                            ${user.email}
                        </small>

                    </div>

                </div>


                <div class="profile-divider"></div>


                <button
                    onclick="window.location.href='order-history.html'"
                >
                    📦
                    My Bookings
                </button>


                <button
                    onclick="window.location.href='wishlist.html'"
                >
                    ❤️
                    My Wishlist
                </button>


                <button
                    onclick="window.location.href='cart.html'"
                >
                    🛒
                    My Cart
                </button>


                <div class="profile-divider"></div>


                <button
                    class="logout-btn"
                    onclick="logoutUser()"
                >
                    🚪
                    Logout
                </button>

            </div>

        </div>

    `;


    updateCartCount();

}


// ==========================================
// PROFILE DROPDOWN
// ==========================================

function toggleProfileMenu() {

    const menu =
        document.getElementById("profile-menu");

    if (!menu) {
        return;
    }


    menu.classList.toggle("show");

}


// ==========================================
// CLOSE PROFILE MENU
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const profile =
            document.querySelector(".profile-container");

        const menu =
            document.getElementById("profile-menu");


        if (!profile || !menu) {
            return;
        }


        if (!profile.contains(event.target)) {

            menu.classList.remove("show");

        }

    }
);


// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {
        return;
    }


    localStorage.removeItem("flowerUser");


    alert(
        "🌸 You have been logged out."
    );


    window.location.href =
        "index.html";

}


// ==========================================
// LOAD FLOWERS
// ==========================================

async function loadFlowers() {

    const container =
        document.getElementById(
            "flower-container"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/flowers`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load flowers"
            );

        }


        flowers =
            await response.json();


        container.innerHTML = "";


        flowers.forEach(
            (flower) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "flower-card";


                card.innerHTML = `

                    <div class="flower-image">

                        ${getFlowerEmoji(
                            flower.category
                        )}

                    </div>


                    <div class="flower-info">

                        <h3>
                            ${flower.name}
                        </h3>


                        <p class="flower-category">

                            ${flower.category}

                        </p>


                        <p class="flower-description">

                            ${flower.description}

                        </p>


                        <div class="flower-bottom">

                            <span class="price">

                                ₹${flower.price}

                            </span>


                            <button
                                class="add-btn"
                                onclick="addToCart(${flower.id})"
                            >

                                Add to Cart

                            </button>

                        </div>

                    </div>

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(error);


        container.innerHTML = `

            <div class="loading">

                ❌ Unable to connect to
                FlowerBook server.

                <br>

                Please make sure the
                backend is running.

            </div>

        `;

    }

}


// ==========================================
// FLOWER EMOJI
// ==========================================

function getFlowerEmoji(category) {

    const emojis = {

        Roses: "🌹",

        Lilies: "🌷",

        Sunflowers: "🌻",

        Tulips: "🌷",

        Bouquets: "💐"

    };


    return emojis[category] || "🌸";

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(flowerId) {


    // ==========================================
    // LOGIN CHECK
    // ==========================================

    const user =
        getLoggedInUser();


    if (!user) {

        alert(
            "🔐 Please login to FlowerBook before adding flowers to your cart."
        );


        window.location.href =
            "login.html";


        return;

    }


    // ==========================================
    // FIND FLOWER
    // ==========================================

    const flower =
        flowers.find(
            item =>
                Number(item.id) ===
                Number(flowerId)
        );


    if (!flower) {

        alert(
            "Unable to find flower details."
        );

        return;

    }


    // ==========================================
    // CHECK EXISTING CART ITEM
    // ==========================================

    const existingItem =
        cart.find(
            item =>
                Number(item.id) ===
                Number(flowerId)
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: flower.id,

            name: flower.name,

            price: Number(
                flower.price
            ),

            category:
                flower.category,

            description:
                flower.description,

            quantity: 1

        });

    }


    // ==========================================
    // SAVE CART
    // ==========================================

    localStorage.setItem(
        "flowerCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    alert(
        `🌸 ${flower.name} added to your cart!`
    );

}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (!cartCount) {
        return;
    }


    const count =
        cart.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 0
                ),
            0
        );


    cartCount.textContent =
        count;

}


// ==========================================
// INITIALIZE
// ==========================================

updateNavbar();

updateCartCount();

loadFlowers();
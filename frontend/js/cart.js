const API_URL = "http://127.0.0.1:8000";

let cart = JSON.parse(localStorage.getItem("flowerCart")) || [];


// ==========================================
// LOGIN CHECK
// ==========================================

function getLoggedInUser() {

    return JSON.parse(
        localStorage.getItem("flowerUser")
    );

}


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

    localStorage.setItem(
        "flowerCart",
        JSON.stringify(cart)
    );

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
// LOAD CART
// ==========================================

async function loadCart() {

    const container =
        document.getElementById(
            "cart-container"
        );


    if (!container) {
        return;
    }


    // ==========================================
    // LOGIN PROTECTION
    // ==========================================

    const user =
        getLoggedInUser();


    if (!user) {

        container.innerHTML = `

            <div class="empty-cart">

                <div>
                    🔐
                </div>

                <h3>
                    Login Required
                </h3>

                <p>
                    Please login to view your cart.
                </p>

                <a href="login.html">
                    Login to FlowerBook →
                </a>

            </div>

        `;

        return;
    }


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <div>
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some beautiful flowers to your cart.
                </p>

                <a href="index.html#flowers">
                    Explore Flowers →
                </a>

            </div>

        `;

        return;
    }


    // ==========================================
    // LOAD FLOWERS
    // ==========================================

    try {

        const response =
            await fetch(
                `${API_URL}/api/flowers`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load flowers."
            );

        }


        const flowers =
            await response.json();


        let total = 0;


        let html = `

            <div class="cart-layout">

                <div class="cart-items">

        `;


        // ==========================================
        // CART ITEMS
        // ==========================================

        cart.forEach(
            (item, index) => {

                const flower =
                    flowers.find(
                        product =>
                            Number(product.id) ===
                            Number(item.id)
                    );


                if (!flower) {
                    return;
                }


                const quantity =
                    Number(item.quantity);


                const itemTotal =
                    Number(flower.price) *
                    quantity;


                total += itemTotal;


                html += `

                    <div class="cart-item">


                        <div class="cart-flower-image">

                            ${getFlowerEmoji(
                                flower.category
                            )}

                        </div>


                        <div class="cart-item-info">

                            <h3>
                                ${flower.name}
                            </h3>

                            <p>
                                ${flower.category}
                            </p>

                            <strong>
                                ₹${flower.price}
                            </strong>

                        </div>


                        <div class="quantity-controls">

                            <button
                                onclick="decreaseQuantity(${index})"
                            >
                                −
                            </button>


                            <span>
                                ${quantity}
                            </span>


                            <button
                                onclick="increaseQuantity(${index})"
                            >
                                +
                            </button>

                        </div>


                        <div class="item-total">

                            <strong>
                                ₹${itemTotal}
                            </strong>


                            <button
                                class="remove-btn"
                                onclick="removeItem(${index})"
                            >
                                🗑️
                            </button>

                        </div>


                    </div>

                `;

            }
        );


        // ==========================================
        // ORDER SUMMARY
        // ==========================================

        html += `

                </div>


                <div class="cart-summary">

                    <h3>
                        Order Summary
                    </h3>


                    <div class="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹${total}
                        </strong>

                    </div>


                    <div class="summary-row">

                        <span>
                            Delivery
                        </span>

                        <strong>
                            FREE
                        </strong>

                    </div>


                    <hr>


                    <div class="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹${total}
                        </strong>

                    </div>


                    <button
                        class="checkout-btn"
                        onclick="goToCheckout()"
                    >
                        Proceed to Checkout →
                    </button>

                </div>


            </div>

        `;


        container.innerHTML =
            html;


    } catch (error) {

        console.error(
            error
        );


        container.innerHTML = `

            <div class="loading">

                ❌ Unable to load cart.

            </div>

        `;

    }

}


// ==========================================
// INCREASE QUANTITY
// ==========================================

function increaseQuantity(index) {

    const user =
        getLoggedInUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    cart[index].quantity++;


    saveCart();


    loadCart();

}


// ==========================================
// DECREASE QUANTITY
// ==========================================

function decreaseQuantity(index) {

    const user =
        getLoggedInUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(
            index,
            1
        );

    }


    saveCart();


    loadCart();

}


// ==========================================
// REMOVE ITEM
// ==========================================

function removeItem(index) {

    const user =
        getLoggedInUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    cart.splice(
        index,
        1
    );


    saveCart();


    loadCart();

}


// ==========================================
// GO TO CHECKOUT
// ==========================================

function goToCheckout() {

    const user =
        getLoggedInUser();


    if (!user) {

        alert(
            "🔐 Please login before proceeding to checkout."
        );


        window.location.href =
            "login.html";


        return;

    }


    if (cart.length === 0) {

        alert(
            "🛒 Your cart is empty."
        );

        return;

    }


    window.location.href =
        "checkout.html";

}


// ==========================================
// START
// ==========================================

loadCart();
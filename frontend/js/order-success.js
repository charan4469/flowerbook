// ==========================================
// FlowerBook Order Success
// ==========================================

const order =
    JSON.parse(localStorage.getItem("flowerOrder"));


// ==========================================
// CHECK ORDER
// ==========================================

if (!order) {

    window.location.href = "index.html";

} else {

    // Booking ID
    document.getElementById("order-id").textContent =
        order.bookingId || "N/A";


    // Customer Name
    document.getElementById("customer-name").textContent =
        order.customerName || "N/A";


    // Delivery Date
    document.getElementById("delivery-date").textContent =
        order.deliveryDate || "N/A";


    // Delivery Time
    document.getElementById("delivery-time").textContent =
        order.deliveryTime || "N/A";

}
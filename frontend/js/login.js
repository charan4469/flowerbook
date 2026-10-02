const API_URL = "http://127.0.0.1:8000";

const loginForm =
    document.getElementById("login-form");

const passwordInput =
    document.getElementById("login-password");

const togglePassword =
    document.getElementById("toggle-password");


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                togglePassword.textContent =
                    "🙈";

            } else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "👁️";

            }

        }
    );

}


// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword =
    document.getElementById(
        "forgot-password"
    );


if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "🌸 Password reset will be available soon."
            );

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "login-email"
                    )
                    .value
                    .trim();


            const password =
                passwordInput.value;


            // ==========================================
            // VALIDATION
            // ==========================================

            if (!email || !password) {

                alert(
                    "Please enter your email and password."
                );

                return;

            }


            // ==========================================
            // BUTTON
            // ==========================================

            const button =
                loginForm.querySelector(
                    ".auth-submit-btn"
                );


            button.disabled =
                true;


            button.innerHTML = `

                <span>
                    Logging in...
                </span>

                <span class="login-spinner">
                    ⟳
                </span>

            `;


            // ==========================================
            // LOGIN REQUEST
            // ==========================================

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/auth/login`,
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email:
                                        email,

                                    password:
                                        password
                                })
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "LOGIN RESPONSE:",
                    result
                );


                // ==========================================
                // LOGIN ERROR
                // ==========================================

                if (
                    !response.ok ||
                    !result.success
                ) {

                    alert(
                        result.message ||
                        "Invalid email or password."
                    );


                    button.disabled =
                        false;


                    button.innerHTML = `

                        <span>
                            Login to FlowerBook
                        </span>

                        <span class="button-arrow">
                            →
                        </span>

                    `;

                    return;

                }


                // ==========================================
                // CHECK TOKEN
                // ==========================================

                if (
                    !result.access_token
                ) {

                    alert(
                        "Login succeeded, but authentication token was not received."
                    );


                    button.disabled =
                        false;


                    button.innerHTML = `

                        <span>
                            Login to FlowerBook
                        </span>

                        <span class="button-arrow">
                            →
                        </span>

                    `;

                    return;

                }


                // ==========================================
                // SAVE USER
                // ==========================================

                localStorage.setItem(
                    "flowerUser",
                    JSON.stringify(
                        result.user
                    )
                );


                // ==========================================
                // SAVE JWT TOKEN
                // ==========================================

                localStorage.setItem(
                    "flowerToken",
                    result.access_token
                );


                // ==========================================
                // SUCCESS
                // ==========================================

                alert(
                    `🌸 Welcome back, ${result.user.name}!`
                );


                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                alert(
                    "Unable to connect to FlowerBook server."
                );


                button.disabled =
                    false;


                button.innerHTML = `

                    <span>
                        Login to FlowerBook
                    </span>

                    <span class="button-arrow">
                        →
                    </span>

                `;

            }

        }
    );

}
const API_URL = "http://127.0.0.1:8000";

const registerForm =
    document.getElementById("register-form");

const passwordInput =
    document.getElementById("register-password");

const confirmPasswordInput =
    document.getElementById("register-confirm-password");


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

const togglePassword =
    document.getElementById(
        "toggle-register-password"
    );

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.textContent = "🙈";

            } else {

                passwordInput.type = "password";

                togglePassword.textContent = "👁️";

            }

        }
    );

}


// ==========================================
// CONFIRM PASSWORD SHOW / HIDE
// ==========================================

const toggleConfirmPassword =
    document.getElementById(
        "toggle-confirm-password"
    );

if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener(
        "click",
        function () {

            if (
                confirmPasswordInput.type ===
                "password"
            ) {

                confirmPasswordInput.type = "text";

                toggleConfirmPassword.textContent =
                    "🙈";

            } else {

                confirmPasswordInput.type =
                    "password";

                toggleConfirmPassword.textContent =
                    "👁️";

            }

        }
    );

}


// ==========================================
// REGISTRATION
// ==========================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("register-name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("register-email")
                    .value
                    .trim();


            const password =
                passwordInput.value;


            const confirmPassword =
                confirmPasswordInput.value;


            // ----------------------------------
            // NAME VALIDATION
            // ----------------------------------

            if (!name) {

                alert(
                    "Please enter your full name."
                );

                return;

            }


            // ----------------------------------
            // EMAIL VALIDATION
            // ----------------------------------

            if (!email) {

                alert(
                    "Please enter your email address."
                );

                return;

            }


            // ----------------------------------
            // PASSWORD VALIDATION
            // ----------------------------------

            if (password.length < 8) {

                alert(
                    "Password must be at least 8 characters."
                );

                return;

            }


            if (!/[A-Z]/.test(password)) {

                alert(
                    "Password must contain at least one uppercase letter."
                );

                return;

            }


            if (!/[a-z]/.test(password)) {

                alert(
                    "Password must contain at least one lowercase letter."
                );

                return;

            }


            if (!/\d/.test(password)) {

                alert(
                    "Password must contain at least one number."
                );

                return;

            }


            if (!/[^A-Za-z0-9]/.test(password)) {

                alert(
                    "Password must contain at least one special character."
                );

                return;

            }


            // ----------------------------------
            // CONFIRM PASSWORD
            // ----------------------------------

            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;

            }


            // ----------------------------------
            // BUTTON
            // ----------------------------------

            const button =
                registerForm.querySelector(
                    ".auth-submit-btn"
                );


            button.disabled = true;


            button.innerHTML = `
                <span>Creating Account...</span>
                <span class="login-spinner">⟳</span>
            `;


            // ----------------------------------
            // API REQUEST
            // ----------------------------------

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/auth/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                password: password
                            })
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "REGISTER RESPONSE:",
                    result
                );


                // ----------------------------------
                // ERROR
                // ----------------------------------

                if (
                    !response.ok ||
                    !result.success
                ) {

                    alert(
                        result.message ||
                        "Unable to create account."
                    );


                    button.disabled = false;


                    button.innerHTML = `
                        <span>
                            Create My Account
                        </span>

                        <span class="button-arrow">
                            →
                        </span>
                    `;


                    return;

                }


                // ----------------------------------
                // SAVE USER
                // ----------------------------------

                localStorage.setItem(
                    "flowerUser",
                    JSON.stringify(result.user)
                );


                // ----------------------------------
                // SUCCESS
                // ----------------------------------

                alert(
                    `🌸 Welcome to FlowerBook, ${result.user.name}!`
                );


                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    "REGISTRATION ERROR:",
                    error
                );


                alert(
                    "Unable to connect to FlowerBook server."
                );


                button.disabled = false;


                button.innerHTML = `
                    <span>
                        Create My Account
                    </span>

                    <span class="button-arrow">
                        →
                    </span>
                `;

            }

        }
    );

}
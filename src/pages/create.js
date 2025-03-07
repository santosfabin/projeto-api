// src/pages/create.js
function createPage() {
	return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Create User</title>
        </head>
        <body>
            <h1>Create User</h1>
            <form id="createUserForm">
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                 <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <div id="message"></div>
                <button type="submit">Create User</button>
            </form>
            <p>
              <a href="/">Back to Login</a>
            </p>
            <script>
                document
                    .getElementById("createUserForm")
                    .addEventListener("submit", async (event) => {
                        event.preventDefault();
                        const username = document.getElementById("username").value;
                        const password = document.getElementById("password").value;
                        const email = document.getElementById("email").value;
                        const messageDiv = document.getElementById("message");
                        // Basic Email Validation
                        const emailRegex = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
                        if (!emailRegex.test(email)) {
                            messageDiv.textContent = "Invalid email format.";
                            return;
                        }

                        // Password Strength Validation (at least 8 characters, including uppercase, lowercase, and numbers)
                        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$/;
                        if (!passwordRegex.test(password)) {
                            messageDiv.textContent = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.";
                            return;
                        }

                        try {
                            const response = await fetch("/api/users", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ username, password, email }), //add email
                            });

                            const data = await response.json();

                            if (response.ok) {
                                window.location.href = '/app'
                            } else {
                                messageDiv.textContent = data.error;
                            }
                        } catch (error) {
                            console.error("Error:", error);
                            messageDiv.textContent = "An error occurred.";
                        }
                    });
            </script>
        </body>
    </html>
    `;
}

module.exports = createPage;

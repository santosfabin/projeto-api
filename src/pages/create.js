function createPage() {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Create User</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h1 {
                    text-align: center;
                }
                form {
                    max-width: 400px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                div {
                    margin-bottom: 10px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                }
                input {
                    width: 100%;
                    padding: 8px;
                    margin-top: 5px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                button {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    background-color: #4CAF50;
                    color: white;
                    font-size: 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #45a049;
                }
                p {
                    text-align: center;
                }
                #message {
                    color: red;
                    text-align: center;
                    margin-top: 10px;
                }
            </style>
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
                <a href="/">Voltar para Login</a>
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
                            const response = await fetch("/users", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ username, email, password }),
                            });

                            const data = await response.json();

                            if (response.ok) {
                                window.location.href = '/app';
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

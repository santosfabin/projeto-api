const loginContent = `
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fa;
            color: #333;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }

        h1 {
            color: #4CAF50;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }

        form {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }

        input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1rem;
        }

        input[type="text"]:focus, input[type="password"]:focus {
            border-color: #4CAF50;
            outline: none;
        }

        button {
            width: 100%;
            background-color: #4CAF50;
            color: white;
            padding: 12px;
            font-size: 1.2rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #45a049;
        }

        p {
            font-size: 1rem;
            margin-top: 15px;
        }

        a {
            text-decoration: none;
            color: #2196F3;
            font-weight: bold;
            transition: color 0.3s ease;
        }

        a:hover {
            color: #4CAF50;
        }

        #error-message {
            color: red;
            font-weight: bold;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h1>Login</h1>
    <form action="/login" method="POST">
        <input type="text" name="email" placeholder="email" required>
        <input type="password" name="password" placeholder="Senha" required>
        <button type="submit">Entrar</button>
    </form>
    <div id="error-message"></div>
    <p>
        <a href="/createUser">Criar Usuário</a>
    </p>

    <script>
        const form = document.querySelector('form');
        const errorMessageDiv = document.getElementById('error-message');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = form.email.value;
            const password = form.password.value;
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.error) {
                errorMessageDiv.innerText = data.error;
                document.cookie = ""; // Limpa o cookie
            } else {
                window.location.href = '/app';
            }
        });
    </script>
</body>
</html>

`;

function loginPage(req, res) {
    res.setHeader("Content-Type", "text/html");
    res.send(loginContent);
}

module.exports = loginPage;

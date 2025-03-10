const appContent = `
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aplicação</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fa;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
        }

        h1 {
            color: #4CAF50;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }

        p {
            font-size: 1.1rem;
            margin: 10px 0;
        }

        span {
            font-weight: bold;
            color: #2196F3;
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

        button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            font-size: 1.1rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #45a049;
        }

        #createActivityButton {
            margin-top: 20px;
        }

        .link-container {
            margin-top: 20px;
        }

        .link-container p {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <h1>Autenticado!</h1>
    <p>Seja bem-vindo à aplicação <span id="username"></span>!</p>
    <p>Você é um <span id="role"></span></p>
    
    <!-- Botão de criar tarefa, inicialmente escondido -->
    <button id="createActivityButton" style="display: none;">
        <a href="/createActivity" style="text-decoration: none; color: white;">Criar Tarefa</a>
    </button>
    
    <div class="link-container">
        <p><a href="/activities">Atividades</a></p>
        <p><a href="/logout">Logout</a></p>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", async function() {
            const response = await fetch('/login', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
                document.cookie = "";
                window.location.href = "/";
            } else {
                document.getElementById('username').textContent = data.username;
                document.getElementById('role').textContent = data.isAdmin ? "Admin" : "Usuário";
                
                // Se o usuário for admin, mostra o botão de criar tarefa
                if (data.isAdmin) {
                    document.getElementById('createActivityButton').style.display = 'block';
                }
            }
        });
    </script>
</body>
</html>
`;

function appPage(req, res) {
    res.setHeader("Content-Type", "text/html");
    res.send(appContent);
}

module.exports = appPage;

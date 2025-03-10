const appContent = `
<html>
<head>
    <title>Aplicação</title>
</head>
<body>
    <h1>Autenticado!</h1>
    <p>Seja bem-vindo à aplicação <span id="username"></span>!</p>
    <p>Você é um <span id="role"></span></p>
    
    <!-- Botão de criar tarefa, inicialmente escondido -->
    <button id="createActivityButton" style="display: none;">
        <a href="/createActivity" style="text-decoration: none; color: white;">Criar Tarefa</a>
    </button>
    <p>
        <a href="/activities">Atividades</a>
    </p>
    
    <p>
        <a href="/logout">Logout</a>
    </p>

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

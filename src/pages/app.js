const appContent = `
<html>
<head>
    <title>Aplicação</title>
</head>
<body>
    <h1>Autenticado!</h1>
    <p>Seja bem-vindo à aplicação <span id="username"></span>!</p>
    <p>Vocẽ é um <span id="role"></span></p>
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

const loginContent = `
<html>
<head>
    <title>Login</title>
</head>
<body>
    <h1>Login</h1>
    <form action="/login" method="POST">
        <input type="text" name="email" placeholder="email">
        <input type="password" name="password" placeholder="Senha">
        <button type="submit">Entrar</button>
    </form>
    <p>
        <a href="/createUser">Criar Usuário</a>
    </p>
    
    <script>
        const form = document.querySelector('form');
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
                alert(data.error);
                document.cookie = "";
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

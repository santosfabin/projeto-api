const loginContent = `
<html>
<head>
    <title>Login</title>
</head>
<body>
    <h1>Login</h1>
    <form action="/login" method="POST">
        <input type="email" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="Senha">
        <button type="submit">Entrar</button>
    </form>
     <div id="message"></div>
    <p>
        <a href="/create">Criar Usuário</a>
    </p>
    <script>
        const form = document.querySelector('form');
        const messageDiv = document.getElementById('message');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = form.email.value; //changed to email
            const password = form.password.value;
            try {
             const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), //changed to email
            });
            const data = await response.json();
            if (data.error) {
                messageDiv.textContent = data.error; // changed to messageDiv
                document.cookie = "";
            } else {
                window.location.href = '/app';
            }
            }catch(err){
                 messageDiv.textContent = "An error occurred."; // changed to messageDiv
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

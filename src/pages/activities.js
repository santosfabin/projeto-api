const activitiesPageContent = `
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atividades</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            min-height: 100vh;
        }

        h1 {
            color: #4CAF50;
            font-size: 2.5rem;
            margin-top: 30px;
        }

        #activities-list {
            width: 100%;
            max-width: 900px;
            margin: 20px;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .activity {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .activity h3 {
            margin: 0;
            font-size: 1.8rem;
            color: #333;
        }

        .activity p {
            margin: 10px 0;
            color: #555;
        }

        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 1rem;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #45a049;
        }

        #loader {
            text-align: center;
            font-size: 1.2rem;
            color: #777;
        }

        a {
            color: #2196F3;
            text-decoration: none;
            font-weight: bold;
            transition: color 0.3s;
        }

        a:hover {
            color: #4CAF50;
        }

        p {
            font-size: 1rem;
        }

        #error-message {
            color: red;
            text-align: center;
            font-weight: bold;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h1>Atividades Futuras</h1>
    <div id="activities-list">
        <div id="loader">Carregando atividades...</div>
    </div>
    <p>
        <a href="/app">Voltar para a página inicial</a>
    </p>
    <div id="error-message"></div> <!-- Error message div -->

    <script>
        document.addEventListener("DOMContentLoaded", async function() {
            const errorMessageDiv = document.getElementById('error-message');
            try {
                // Pega as informações do usuário
                const userResponse = await fetch('/login', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const userData = await userResponse.json();

                if (userData.error) {
                    errorMessageDiv.innerText = userData.error;
                    document.getElementById('loader').innerText = 'Erro ao carregar as atividades';
                    return;
                }

                const isAdmin = userData.isAdmin;
                const userEmail = userData.email;
                const userKey = \`user_\${userEmail}\`; // Formato user_<email>

                // Busca as atividades
                const response = await fetch('/createAcvitity', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.error) {
                    errorMessageDiv.innerText = data.error;
                    document.getElementById('loader').innerText = 'Erro ao carregar as atividades';
                } else {
                    const activitiesList = document.getElementById('activities-list');
                    activitiesList.innerHTML = ''; // Limpa o carregador

                    if (data.length === 0) {
                        activitiesList.innerHTML = '<p>Não há atividades disponíveis no momento.</p>';
                    } else {
                        data.forEach(activity => {
                            const isUserEnrolled = activity.participants.includes(userKey);

                            const activityElement = document.createElement('div');
                            activityElement.classList.add('activity');
                            activityElement.innerHTML = \`
                                <h3>\${activity.title}</h3>
                                <p><strong>Descrição:</strong> \${activity.description}</p>
                                <p><strong>Local:</strong> \${activity.location}</p>
                                <p><strong>Participantes Máximos:</strong> \${activity.maxParticipants}</p>
                                <p><strong>Data Limite:</strong> \${new Date(activity.deadline).toLocaleString()}</p>
                                \${isUserEnrolled
                                    ? \`<button onclick="unenrollFromActivity('\${activity.activityId}')">Desinscrever-se</button>\`
                                    : \`<button onclick="enrollInActivity('\${activity.activityId}')">Inscrever-se</button>\`
                                }
                                \${isAdmin
                                    ? \`<button onclick="editActivity('\${activity.activityId}')">Editar</button>\`
                                    : ''
                                }
                            \`;
                            activitiesList.appendChild(activityElement);
                        });
                    }
                }
            } catch (error) {
                errorMessageDiv.innerText = 'Erro ao carregar as atividades';
                document.getElementById('loader').innerText = 'Erro ao carregar as atividades';
            }
        });

        async function enrollInActivity(activityId) {
            const token = localStorage.getItem('token'); 
            const response = await fetch('/createAcvitity/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ activityId })
            });

            const data = await response.json();

            if (data.error) {
                document.getElementById('error-message').innerText = data.error;
            } else {
                window.location.reload();
            }
        }

        async function unenrollFromActivity(activityId) {
            const token = localStorage.getItem('token');
            const response = await fetch('/createAcvitity/unenroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ activityId })
            });

            const data = await response.json();

            if (data.error) {
                document.getElementById('error-message').innerText = data.error;
            } else {
                window.location.reload();
            }
        }

    </script>
</body>
</html>
`;

function renderActivitiesPage(req, res) {
    res.setHeader("Content-Type", "text/html");
    res.send(activitiesPageContent);
}

module.exports = renderActivitiesPage;

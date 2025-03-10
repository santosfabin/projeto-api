const activitiesPageContent = `
<html>
<head>
    <title>Atividades</title>
    <style>
        .activity {
            border: 1px solid #ccc;
            padding: 10px;
            margin: 10px 0;
        }
        .activity h3 {
            margin: 0;
        }
        .activity p {
            margin: 5px 0;
        }
        #loader {
            text-align: center;
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
    <script>
        document.addEventListener("DOMContentLoaded", async function() {
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
                    alert(userData.error);
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
                    alert(data.error);
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
                alert('Erro ao carregar as atividades');
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
                alert(data.error);
            } else {
                alert('Inscrição realizada com sucesso!');
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
                alert(data.error);
            } else {
                alert('Você se desinscreveu da atividade!');
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

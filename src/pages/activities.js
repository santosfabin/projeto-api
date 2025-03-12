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

        .edit-input {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            border: 1px solid #ddd;
            font-size: 1rem;
        }

        .activity-buttons {
            margin-top: 10px;
        }

        .activity-buttons button {
            margin: 5px;
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
    <div id="error-message"></div>

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
                            activityElement.id = \`activity-\${activity.activityId}\`;
                            activityElement.innerHTML = \`
                                <h3 id="title-\${activity.activityId}">\${activity.title}</h3>
                                <p><strong>Descrição:</strong> <span id="description-\${activity.activityId}">\${activity.description}</span></p>
                                <p><strong>Local:</strong> <span id="location-\${activity.activityId}">\${activity.location}</span></p>
                                <p><strong>Participantes:</strong> \${activity.participants.length}/<span id="maxParticipants-\${activity.activityId}">\${activity.maxParticipants}</span></p>
                                \${isAdmin 
                                    ? \`<p><strong>Lista de Participantes:</strong><ul>
                                            \${activity.participants.map(participant => \`<li>\${participant}</li>\`).join('')}
                                        </ul></p>\`
                                    : ''
                                }
                                <p><strong>Data Limite:</strong> <span id="deadline-\${activity.activityId}">\${new Date(activity.deadline).toLocaleString()}</span></p>
                                <div class="activity-buttons">
                                    \${isUserEnrolled
                                        ? \`<button onclick="unenrollFromActivity('\${activity.activityId}')">Desinscrever-se</button>\`
                                        : \`<button onclick="enrollInActivity('\${activity.activityId}')">Inscrever-se</button>\`
                                    }
                                    \${isAdmin
                                        ? \`<button onclick="openEditForm('\${activity.activityId}')">Editar</button><button onclick="deleteActivity('\${activity.activityId}')">Excluir</button>\`
                                        : ''
                                    }
                                </div>
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
            const response = await fetch('/createAcvitity/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            const response = await fetch('/createAcvitity/unenroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

        function openEditForm(activityId) {
            const titleElement = document.getElementById(\`title-\${activityId}\`);
            const descriptionElement = document.getElementById(\`description-\${activityId}\`);
            const locationElement = document.getElementById(\`location-\${activityId}\`);
            const maxParticipantsElement = document.getElementById(\`maxParticipants-\${activityId}\`);
            const deadlineElement = document.getElementById(\`deadline-\${activityId}\`);

            // Substitui os elementos com inputs
            titleElement.innerHTML = \`<input class="edit-input" id="edit-title-\${activityId}" value="\${titleElement.innerText}" />\`;
            descriptionElement.innerHTML = \`<input class="edit-input" id="edit-description-\${activityId}" value="\${descriptionElement.innerText}" />\`;
            locationElement.innerHTML = \`<input class="edit-input" id="edit-location-\${activityId}" value="\${locationElement.innerText}" />\`;
            maxParticipantsElement.innerHTML = \`<input class="edit-input" id="edit-maxParticipants-\${activityId}" value="\${maxParticipantsElement.innerText}" />\`;
            deadlineElement.innerHTML = \`<input class="edit-input" type="datetime-local" id="edit-deadline-\${activityId}" value="\${new Date(deadlineElement.innerText).toISOString().slice(0, 16)}" />\`;

            const activityButtons = document.querySelector(\`#activity-\${activityId} .activity-buttons\`);
            activityButtons.innerHTML = \`
                <button onclick="saveEdit('\${activityId}')">Salvar alterações</button>
                <button onclick="cancelEdit('\${activityId}')">Cancelar</button>
            \`;
        }

        function cancelEdit(activityId) {
            location.reload(); // Recarrega a página para reverter as edições
        }

        async function saveEdit(activityId) {
            const updatedActivity = {
                title: document.getElementById(\`edit-title-\${activityId}\`).value,
                description: document.getElementById(\`edit-description-\${activityId}\`).value,
                location: document.getElementById(\`edit-location-\${activityId}\`).value,
                maxParticipants: document.getElementById(\`edit-maxParticipants-\${activityId}\`).value,
                deadline: document.getElementById(\`edit-deadline-\${activityId}\`).value
            };

            const response = await fetch('/createAcvitity/editActivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ activityId, ...updatedActivity })
            });

            const data = await response.json();

            if (data.error) {
                document.getElementById('error-message').innerText = data.error;
            } else {
                alert('Atividade editada com sucesso!');
                window.location.reload();
            }
        }

        async function deleteActivity(activityId) {
            const response = await fetch('/createAcvitity/deleteActivity', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ activityId })
            });

            const data = await response.json();

            if (data.error) {
                document.getElementById('error-message').innerText = data.error;
            } else {
                alert('Atividade excluída com sucesso!');
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

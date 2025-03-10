// src/pages/createActivity.js
function createActivityPage() {
	return `
  <!DOCTYPE html>
  <html lang="pt-BR">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Criar Atividade</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background-color: #f4f4f9;
              }
              h1 {
                  color: #333;
              }
              form {
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                  max-width: 600px;
                  margin: auto;
              }
              .form-group {
                  margin-bottom: 15px;
              }
              label {
                  font-weight: bold;
                  display: block;
                  margin-bottom: 5px;
              }
              input, textarea, select {
                  width: 100%;
                  padding: 10px;
                  margin: 5px 0;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  box-sizing: border-box;
              }
              button {
                  background-color: #4CAF50;
                  color: white;
                  border: none;
                  padding: 10px 15px;
                  cursor: pointer;
                  font-size: 16px;
                  border-radius: 5px;
              }
              button:hover {
                  background-color: #45a049;
              }
              p {
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <h1>Criar Nova Atividade</h1>
          <form id="createActivityForm">
              <div class="form-group">
                  <label for="activityTitle">Título da Atividade:</label>
                  <input type="text" id="activityTitle" name="activityTitle" />
              </div>
              <div class="form-group">
                  <label for="activityDescription">Descrição:</label>
                  <textarea id="activityDescription" name="activityDescription" rows="4"></textarea>
              </div>
              <div class="form-group">
                  <label for="activityLocation">Local:</label>
                  <input type="text" id="activityLocation" name="activityLocation" />
              </div>
              <div class="form-group">
                  <label for="maxParticipants">Número Máximo de Participantes:</label>
                  <input type="number" id="maxParticipants" name="maxParticipants" min="1" />
              </div>
              <div class="form-group">
                  <label for="activityDeadline">Data Limite para Inscrição:</label>
                  <input type="datetime-local" id="activityDeadline" name="activityDeadline" />
              </div>
              <button type="submit">Criar Atividade</button>
              <div id="message" style="margin-top: 10px;"></div>
          </form>
          <p><a href="/app">Voltar para o App</a></p>
          <script>
              document.getElementById("createActivityForm").addEventListener("submit", async (event) => {
                  event.preventDefault();
                  
                  const activityTitle = document.getElementById("activityTitle").value;
                  const activityDescription = document.getElementById("activityDescription").value;
                  const activityLocation = document.getElementById("activityLocation").value;
                  const maxParticipants = document.getElementById("maxParticipants").value;
                  const activityDeadline = document.getElementById("activityDeadline").value;
                  const messageDiv = document.getElementById("message");

                  // Enviando os dados para o backend
                  try {
                      const response = await fetch("/createAcvitity", {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                              title: activityTitle,
                              description: activityDescription,
                              location: activityLocation,
                              maxParticipants: maxParticipants,
                              deadline: activityDeadline
                          }),
                      });

                      const data = await response.json();

                      if (response.ok) {
                          messageDiv.textContent = "Atividade criada com sucesso!";
                          messageDiv.style.color = "green";
                      } else {
                          messageDiv.textContent = data.error || "Ocorreu um erro.";
                          messageDiv.style.color = "red";
                      }
                  } catch (error) {
                      console.error("Erro:", error);
                      messageDiv.textContent = "Ocorreu um erro ao criar a atividade.";
                      messageDiv.style.color = "red";
                  }
              });
          </script>
      </body>
  </html>
  `;
}

module.exports = createActivityPage;

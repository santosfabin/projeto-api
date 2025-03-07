const appContent = `
<html>
<head>
    <title>Aplicação</title>
</head>
<body>
    <h1>Autenticado!</h1>
    <p>Seja bem-vindo à aplicação <span id="userType"></span><span id="username"></span>!</p>
    <div id="adminButtons">
    </div>
    <p>
        <a href="/logout">Logout</a>
    </p>
    <div id="activities"></div> 
    <script>
        let data = {}
        document.addEventListener("DOMContentLoaded", async function() {
             const response = await fetch('/api/login', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
             data = await response.json();
            if (data.error) {
                alert(data.error);
                document.cookie = "";
                window.location.href = "/";
            } else {
                document.getElementById('username').textContent = data.username; // now we use this property
                if(data.isAdmin){
                    document.getElementById('userType').textContent = '(Admin) ';
                    document.getElementById('adminButtons').innerHTML = '<a href="/createActivity">Atividade</a>'
                }
            }
            getActivities()
        });
        async function getActivities() {
            const response = await fetch('/api/activities');
            const activities = await response.json();
            const activitiesDiv = document.getElementById('activities');
            activitiesDiv.innerHTML = '<h2>Activities</h2>'; // Clear previous activities
            activities.forEach(activity => {
                const isSubscribed = activity.subscribers.includes(data.id) //verify if is subscribed
                const buttonText = isSubscribed ? 'Unsubscribe' : 'Subscribe'; //if it is subscribed, change the text
                const buttonClass = isSubscribed ? 'unsubscribeButton' : 'subscribeButton'; //if it is subscribed, change the class
                const activityElement = document.createElement('div');
                activityElement.innerHTML = \`
                    <h3>\${activity.title}</h3>
                    <p>\${activity.description}</p>
                    <p>Deadline: \${activity.deadline}</p>
                    <p>Location: \${activity.location}</p>
                    <p>Max Participants: \${activity.maxParticipants}</p>
                    <p>Current Subscribers: \${activity.subscribers.length}</p>
                    <button class="\${buttonClass}" data-activity-id="\${activity.id}">\${buttonText}</button>
                    <div id="activityMessage-\${activity.id}"></div>
                    <hr>
                \`;
                activitiesDiv.appendChild(activityElement);
            });
            attachEventListeners()
        }
        async function attachEventListeners(){
            document.querySelectorAll('.subscribeButton').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const activityId = event.target.dataset.activityId;
                    const activityMessage = document.getElementById('activityMessage-' + activityId)
                    activityMessage.textContent = 'loading...';
                    const response = await fetch('/api/activities/' + activityId + '/subscribe', {method: 'POST'});
                    if (response.ok) {
                        activityMessage.textContent = 'Subscribed successfully.';
                        getActivities();//refresh list
                    } else {
                        const data = await response.json();
                        activityMessage.textContent = data.error;
                    }
                });
            });
            document.querySelectorAll('.unsubscribeButton').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const activityId = event.target.dataset.activityId;
                    const activityMessage = document.getElementById('activityMessage-' + activityId)
                    activityMessage.textContent = 'loading...';
                    const response = await fetch('/api/activities/' + activityId + '/unsubscribe', {method: 'POST'});
                    if (response.ok) {
                        activityMessage.textContent = 'Unsubscribed successfully.';
                        getActivities()//refresh list
                    } else {
                        const data = await response.json();
                        activityMessage.textContent = data.error;
                    }
                });
            });
        }
    </script>
</body>
</html>
`;

function appPage(req, res) {
	res.setHeader("Content-Type", "text/html");
	res.send(appContent);
}

module.exports = appPage;

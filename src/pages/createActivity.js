function createActivityPage() {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Create Activity</title>
        </head>
        <body>
            <h1>Create Activity Page</h1>
            <a href="/app">Voltar</a>
            <hr>
            <h2>Create New Activity</h2>
            <form id="createActivityForm">
                <label for="title">Title:</label><br>
                <input type="text" id="title" name="title"><br><br>

                <label for="description">Description:</label><br>
                <textarea id="description" name="description"></textarea><br><br>

                <label for="deadline">Deadline:</label><br>
                <input type="date" id="deadline" name="deadline"><br><br>

                <label for="location">Location:</label><br>
                <input type="text" id="location" name="location"><br><br>

                <label for="maxParticipants">Max Participants:</label><br>
                <input type="number" id="maxParticipants" name="maxParticipants" min="1" value="1"><br><br>

                <button type="submit">Create</button>
            </form>
            <div id="formMessage"></div>
            <hr>
            <h2>Existing Activities</h2>
            <div id="activitiesList"></div>
            <script>
                const createActivityForm = document.getElementById('createActivityForm');
                const formMessage = document.getElementById('formMessage');
                const activitiesList = document.getElementById('activitiesList');
                // Event listener for create activity
                createActivityForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const title = document.getElementById('title').value;
                    const description = document.getElementById('description').value;
                    const deadline = document.getElementById('deadline').value;
                    const location = document.getElementById('location').value;
                    const maxParticipants = document.getElementById('maxParticipants').value;

                    if (!title || !description || !deadline || !location || !maxParticipants) {
                        formMessage.textContent = 'Please fill in all fields.';
                        return;
                    }

                    formMessage.textContent = 'loading...';
                    const response = await fetch('/api/activities', {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, description, deadline, location, maxParticipants }) // Send new fields
                    });
                    if (response.ok) {
                        formMessage.textContent = 'Activity created successfully.';
                        fetchActivities();
                    } else {
                        const data = await response.json();
                        formMessage.textContent = data.error;
                    }
                });

                async function fetchActivities() {
                    const response = await fetch('/api/activities');
                    const activities = await response.json();
                    activitiesList.innerHTML = ''; // Clear previous activities
                    activities.forEach(activity => {
                        const activityDiv = document.createElement('div');
                        activityDiv.setAttribute('id', 'activity-' + activity.id);
                        activityDiv.innerHTML = \`
                            <h3>\${activity.title}</h3>
                            <p>\${activity.description}</p>
                            <p>Deadline: \${activity.deadline}</p>
                            <p>Location: \${activity.location}</p>
                            <p>Max Participants: \${activity.maxParticipants}</p>
                            <p>Current Subscribers: \${activity.subscribers.length}</p>
                            <button class="editButton" data-activity-id="\${activity.id}">Edit</button>
                            <button class="deleteButton" data-activity-id="\${activity.id}">Delete</button>
                            <button class="subscribersButton" data-activity-id="\${activity.id}">Subscribers</button>
                            <div id="editForm-\${activity.id}" style="display: none;">
                                <label for="newTitle-\${activity.id}">New Title:</label><br>
                                <input type="text" id="newTitle-\${activity.id}" name="newTitle"><br><br>
                                <label for="newDescription-\${activity.id}">New Description:</label><br>
                                <textarea id="newDescription-\${activity.id}" name="newDescription"></textarea><br><br>
                                <label for="newDeadline-\${activity.id}">New Deadline:</label><br>
                                <input type="date" id="newDeadline-\${activity.id}" name="newDeadline"><br><br>
                                <label for="newLocation-\${activity.id}">New Location:</label><br>
                                <input type="text" id="newLocation-\${activity.id}" name="newLocation"><br><br>
                                <label for="newMaxParticipants-\${activity.id}">New Max Participants:</label><br>
                                <input type="number" id="newMaxParticipants-\${activity.id}" name="newMaxParticipants" min="1"><br><br>
                                <button class="saveEditButton" data-activity-id="\${activity.id}">Save</button>
                            </div>
                            <div id="subscribersList-\${activity.id}" style="display: none;"></div>
                            <div id="subscribersMessage-\${activity.id}"></div> \
                            <hr>
                        \`;
                        activitiesList.appendChild(activityDiv);
                    });
                    attachEventListeners();
                }
                //Attach event to each button
                function attachEventListeners(){
                    document.querySelectorAll('.editButton').forEach(button => {
                        button.addEventListener('click', async (event) => {
                            const activityId = event.target.dataset.activityId;
                            const editForm = document.getElementById('editForm-' + activityId);
                            editForm.style.display = 'block'; // Show the form
                            formMessage.textContent = '';
                        });
                    });
                    document.querySelectorAll('.saveEditButton').forEach(button => {
                        button.addEventListener('click', async (event) => {
                            const activityId = event.target.dataset.activityId;
                            const newTitle = document.getElementById('newTitle-' + activityId).value;
                            const newDescription = document.getElementById('newDescription-' + activityId).value;
                            const newDeadline = document.getElementById('newDeadline-' + activityId).value;
                            const newLocation = document.getElementById('newLocation-' + activityId).value;
                            const newMaxParticipants = document.getElementById('newMaxParticipants-' + activityId).value;

                            if (!newTitle || !newDescription || !newDeadline || !newLocation || !newMaxParticipants) {
                                formMessage.textContent = 'Please fill in all fields.';
                                return;
                            }

                            formMessage.textContent = 'loading...';
                            const response = await fetch('/api/activities/' + activityId, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ title: newTitle, description: newDescription, deadline:newDeadline, location:newLocation, maxParticipants:newMaxParticipants }) // Send new fields
                            });
                            if (response.ok) {
                                formMessage.textContent = 'Activity updated successfully.';
                                fetchActivities();
                            } else {
                                const data = await response.json();
                                formMessage.textContent = data.error;
                            }
                            const editForm = document.getElementById('editForm-' + activityId);
                            editForm.style.display = 'none'; //hide the form
                        });
                    });
                    document.querySelectorAll('.deleteButton').forEach(button => {
                        button.addEventListener('click', async (event) => {
                            const activityId = event.target.dataset.activityId;
                            formMessage.textContent = 'loading...';
                            const response = await fetch('/api/activities/' + activityId, {
                                method: 'DELETE'
                            });
                            if (response.ok) {
                                formMessage.textContent = 'Activity deleted successfully.';
                                fetchActivities();
                            } else {
                                const data = await response.json();
                                formMessage.textContent = data.error;
                            }
                        });
                    });
                    document.querySelectorAll('.subscribersButton').forEach(button => {
                        button.addEventListener('click', async (event) => {
                            const activityId = event.target.dataset.activityId;
                            const subscribersList = document.getElementById('subscribersList-' + activityId);
                            const subscribersMessage = document.getElementById('subscribersMessage-' + activityId);
                            subscribersMessage.textContent = 'loading...'; //add message
                            const response = await fetch('/api/activities/' + activityId + '/subscribers');
                            if (response.ok) {
                                const subscribers = await response.json();
                                subscribersList.innerHTML = ''; // Clear previous subscribers
                                subscribers.forEach(subscriber => {
                                    const subscriberElement = document.createElement('p');
                                    subscriberElement.textContent = subscriber.username;
                                    subscribersList.appendChild(subscriberElement);
                                });
                                subscribersList.style.display = 'block'; // Show the list
                                subscribersMessage.textContent = ''; //clear message
                            } else {
                                const data = await response.json();
                                subscribersMessage.textContent = data.error; //show error message
                            }
                        });
                    });
                }
                 fetchActivities();
            </script>
        </body>
    </html>
    `;
}

module.exports = {createActivityPage};

// src/models/Activity.js
const activities = [];
let nextId = 1;

class Activity {
	constructor(
		id,
		title,
		description,
		deadline,
		location,
		maxParticipants,
		subscribers = []
	) {
		// Add new fields here
		this.id = id;
		this.title = title;
		this.description = description;
		this.deadline = deadline; // Add new fields here
		this.location = location; // Add new fields here
		this.maxParticipants = maxParticipants; // Add new fields here
		this.subscribers = subscribers;
	}

	update(title, description, deadline, location, maxParticipants) {
		// Add new fields here
		this.title = title;
		this.description = description;
		this.deadline = deadline; // Add new fields here
		this.location = location; // Add new fields here
		this.maxParticipants = maxParticipants; // Add new fields here
	}

	// I not fineshed this
	subscribe(userId) {
		if (this.subscribers.length >= this.maxParticipants) {
			//verify if max participants are not reached
			throw new Error("This activity is full.");
		}
		if (!this.subscribers.includes(userId)) {
			this.subscribers.push(userId);
		}
	}

	unsubscribe(userId) {
		this.subscribers = this.subscribers.filter(id => id !== userId);
	}

	static findAll() {
		return activities.map(activity => {
			return {
				...activity,
				subscribers: [...activity.subscribers]
			};
		});
	}

	static findById(id) {
		return activities.find(activity => activity.id === id);
	}

	static create(title, description, deadline, location, maxParticipants) {
		// Add new fields here
		// Check for duplicate title
		const duplicate = activities.find(activity => activity.title === title);
		if (duplicate) {
			throw new Error("Activity with this title already exists.");
		}
		const newActivity = new Activity(
			nextId++,
			title,
			description,
			deadline,
			location,
			maxParticipants
		); // Add new fields here
		activities.push(newActivity);
		return newActivity;
	}

	static delete(id) {
		const index = activities.findIndex(activity => activity.id === id);
		if (index !== -1) {
			activities.splice(index, 1);
		}
	}
	getSubscribers() {
		return this.subscribers;
	}
	static validateUniqueTitle(activityId, newTitle) {
		//new function
		const duplicate = activities.find(
			activity => activity.title === newTitle && activity.id != activityId
		);
		if (duplicate) {
			throw new Error("Activity with this title already exists.");
		}
	}
}

module.exports = Activity;

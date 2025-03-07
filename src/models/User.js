// src/models/User.js
const { hashPassword, comparePassword } = require("../utils/functions");

const users = [];
let nextId = 1;

class User {
    constructor(id, username, email, password, isAdmin = false) { //add email
        this.id = id;
        this.username = username;
        this.email = email; //add email
        this.password = password;
        this.isAdmin = isAdmin;
    }
    static async create(username, email, password, isAdmin = false){ //add email
        // Verificar se o usuário já existe
        const existingUser = this.findUserByEmail(email); // change to email
        if (existingUser) {
            throw new Error('Email already exists'); //change to email
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new User(nextId++, username, email, hashedPassword, isAdmin); //add email
        users.push(newUser);
        return newUser
    }
    static findUserByEmail(email){ //add new function
        return users.find(user => user.email === email)
    }
    static findUser(username){ //change name
        return users.find(user => user.username === username)
    }
    static findUserById(id){
        return users.find(user => user.id === id)
    }
    static findAll(){
        return users
    }
    static isAdmin(userId){
        const user = users.find(user => user.id === userId)
        return user ? user.isAdmin : false;
    }
    static async createAdminIfNotExists() {
        const adminExists = users.some(user => user.isAdmin); //add again
        if (!adminExists) { //add again
            try {
                await this.create('fabiano', 'fabiano@admin.com', 'fabiano123', true); // change the values, and added email
                console.log('Admin user created.');
            } catch (error) {
                console.error('Error creating admin user:', error.message);
            }
        }
    }
    static async comparePassword(password, hashedPassword){
        return await comparePassword(password, hashedPassword)
    }
}

module.exports = User;

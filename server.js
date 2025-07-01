// const express = require('express'),
//     morgan = require('morgan'),
//     fs = require('fs'),
//     path = require('path');
import mongoose from 'mongoose';
import models from './models.js';
import express from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logFilePath = path.join(__dirname, 'log.txt');

const Npcs = models.Npc;
const Users = models.User;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Log function
async function logMessage(message) {
    try {
        await fs.appendFile(logFilePath, `${new Date}().toISOString()}: ${message}\n`);
        console.log('Logged', message)
    } catch(error) {
        console.error('Error writing to Log File:', error); 
    }
}

mongoose.connect('mongodb://127.0.0.1:27017/eldenWiki', { family: 4 }) // Use family: 4 to force IPv4
    .then(async () => {
        console.log('Connected to MongoDB');
        await logMessage('MongoDB Connected');
    })
    .catch(async (error) => {
        console.error('MongoDB connection error:', error);
        await logMessage(`MongoDB connection error: ${error.message}`);
    });

//Root route
app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

//Get all Users
app.get('/users', async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    }
    catch (error) {
        await logMessage('Error fetching users: ' + error.message);
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

app.get('/users/:Username', async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.Username });
        res.json(user);
    } catch (error) {
        await logMessage(`Error fetching user ${req.params.Username}: ${error.message}`);
        console.error('Error fetching user:', error);
        res.status(500).send(`Error fetching user: ${error.message}`);
    }
})

//Add a user
app.post('/users', async (req, res) => {
    try {
        const { Username, Password, Email, Birthday } = req.body;

        if (!Username || !Password || !Email) {
            await logMessage(`User creation failed: Missing required fields`);
            return res.status(400).send('All fields (Username, Password, Email) are required');
        }

        const existingUser = await Users.findOne({ Username });
        if (existingUser) {
            await logMessage(`User creation failed: ${Username} already exists`)
            return res.status(400).send(`${Username} already exists`);
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const user = await Users.create({
            Username,
            Password: hashedPassword,
            Email,
            Birthday    
        });

        await logMessage(`User created: ${Username}`);
        res.status(201).json(user);
    } catch (error) {
        await logMessage(`User creation error: ${error.message}`)
        console.error('Error:', error);
        res.status(500).send(`Error:', ${error.message}`);
    }
});

//Update users
app.put('/users/:Username', async (req, res) => {
    try {
        const updateUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $set: {
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                },
            },
            { new: true }
        );

        res.json(updateUser);
    } catch (error) {
        await logMessage(`Error updating user ${req.params.Username}: ${error.message}`);
        console.error('Error updating user:', error);
        res.status(500).send(`Error updating user: ${error.message}`);
    }
});

//Delete users
app.delete('/users/:Username', async (req, res) => {
    try {
        const deletedUser = await Users.findOneAndDelete({ Username: req.params.Username });
        if (!deletedUser) {
            await logMessage(`User deletion failed: ${req.params.Username} User not found`);
            return res.status(404).send(`User ${req.params.Username} not found`);
        } 
        await logMessage(`User deleted: ${req.params.Username}`);;
        res.json(deletedUser);
    } catch (error) {
        await logMessage('Error deleting user: ' + error.message);
        res.status(500).send('Error deleting user: ' + error.message);
        console.error('Error deleting user:', error);
    }
}); 

const PORT = 8080;

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await logMessage(`Server started on port ${PORT}`);
});
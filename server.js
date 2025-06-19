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

mongoose.connect('mongodb://localhost:27017/movieApi')
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

//Add a user
app.post('/users', async (req, res) => {
    try {
        const { Username, Password, Email, Birthday } = req.body;

        if (!Username || !Password || !Email) {
            await logMessage(`User creation failed: Missing required fields`);
            return res.status(400).send('All fields (Username, Password, Email) are required');
        }

        const existingUser = await User.findOne({ Username });
        if (existingUser) {
            await logMessage(`User creation failed: ${Username} already exists`)
            return res.status(400).send(`${Username} already exists`);
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const user = await User.create({
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

app.use((err, req, res, next) => {
    const errorMessage = `Server error: ${error.message}`;
    logMessage(errorMessage);
    console,error(error.stack);
    res.status(500).send('Something broke!');
});

const PORT = 8080;

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await logMessage(`Server started on port ${PORT}`);
});
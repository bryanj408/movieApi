// const express = require('express'),
//     morgan = require('morgan'),
//     fs = require('fs'),
//     path = require('path');
import mongoose from 'mongoose';
import models from './models.js';
import express from 'express';
import bcrypt from 'bcrypt';

const Npcs = models.Npc;
const Users = models.User;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/movieApi', { useNewUrlParser: true, useUnifiedTopology: true });

//create a write stream in append mode. This creates a log.txt file in the root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('common', {stream: accessLogStream}));

app.get('/', (req, res) => {
    res.send('Welcome Home log!')
});

//Add a user
/*We'll expect JSON in this format
{
Username: String,
Password: String,
Email: String,
Birthday: Date,
}*/
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                //Basic input validation
                if (!req.body.Username || !req.body.Password || !req.body.Email) {
                    return res.status(400).send('All fields are required')
                }

                //Hash the Password
                bcrypt.hash(req.body.Password, 10)
                .then((hashedPassword) => {
                    Users.create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => { res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

app.listen(8080, () => {
    console.log('Node server is launched');
});

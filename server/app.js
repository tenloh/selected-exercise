'use strict'

//Requiring modules
const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const Teacher = require('./db/models/teachers');
const bodyParser = require('body-parser');
const bb = require('express-busboy'); //To parse files
const utils = require('./util'); //All utility functions needed


//Static Middleware
var root = path.join(__dirname, '../');

var npmPath = path.join(root, './node_modules');
var browserPath = path.join(root, './browser');

app.use(express.static(npmPath));
app.use(express.static(browserPath));

// Parse our POST and PUT bodies.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
bb.extend(app, {
    upload: true,
    path: path.join(root, './files')
});



//Routes

/*
    Get list of teachers to display for employee
*/
app.get('/teachers', function(req, res, next){
    Teacher.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(next);
})

/*
    Default browser landing page - All get requests will serve the main page
*/
app.get('*', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../server/views/index.html'));
})

/*
    Route URL: '/file'
    Purpose is to allow users to upload files onto the server for processing
*/
app.post('/file', function (req, res, next) {
    console.log('File Info', req.files.file);
    let file = req.files.file;

    let interval = setInterval(function () {
        clearInterval(interval); //Only used to set delay
        utils.parseTeacherContactData(path.join(file.file))
        .then(teachers => {
            console.log('Attempting to send emails...');
            return utils.sendEmails(teachers)
        })
        .then(emails => {
            //Query bounce statistics and update DB
            console.log('Attempting to retrieve bounces...');
            utils.receiveBounces()
        })
        .catch(e => {
            console.error(e);
        }) 
    }, 1000)


    res.sendStatus(204);
})


//Error Handler Middleware
app.use(function (err, req, res, next) {
    console.log('Application hit an error');
    res.sendStatus(404);
})


//Server Start

db.sync({ force: false })
    .then(e => {
        app.listen(3456, function () {
            console.log('You are now live at 3456');
        });
    })
    .catch(function (err) {
        console.error('Error on Startup');
    });


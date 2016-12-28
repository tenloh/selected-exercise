'use strict'

let db = require('./server/db');


const Teacher = require('./server/db/models/teachers');

db.sync({force: true})
.then(function(){
    return Teacher.create({
        firstName: 'Bob',
        lastName: 'Dylan',
        email: 'BobDylan@FakeBobDylans.com',
        school: 'Bob Dylan\'s school of music'
    })
})
.then(teacher => {
    console.log('Teacher created', teacher);
})
.catch( e => {
    console.error('Error is: ' + e);
})
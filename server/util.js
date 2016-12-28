'use strict'

//Development ENV file
const dev = require('../env/development')

//Required Modules
const fs = require('fs');
const path = require('path');
const Teacher = require('./db/models/teachers');
const Promise = require('bluebird');

//Postmark
const postmark = require("postmark");
const client = new postmark.Client(dev.POSTMARK);
// const promisifiedSendEmailWithTemplate = Promise.promisify(client.sendEmailWithTemplate);


/*
Function purpose is to parse the CSV file and create the initial datastore in the database

Input: csvFile path
Output: Promise that returns the list of customers (Teacher Sequelize Object Array)
*/
function parseTeacherContactData(csvFile) {
    let fileContents = fs.readFileSync(csvFile).toString().split('\n');
    let customerList = [];

    for (let i = 1; i < fileContents.length; i++) {
        let customer = fileContents[i].split(',');
        let customerObj = {
            firstName: customer[0],
            lastName: customer[1],
            email: customer[2],
            schoolName: customer[3],
            contactedOn: new Date(),
        }

        /* For Testing -- Only add 3 to DB*/
        // if (i === 1 || i === 2 || i === 3) {
            customerList.push(Teacher.findOrCreate({
                where: customerObj
            }));
        // }
    }

    return Promise.all(customerList)
        .then(customers => {
            console.log('Successful Parsing');
            return customers
        })

}

/*
    Purpose of function is to send emails using the aforementioned template in the excercise using Postmark
    
    Input: Customer List (Array of Teachers)
    Output: Promise containing all the sending of emails when executed

*/
function sendEmails(customerList) {

    let messageArray = [];

    customerList.forEach((customerObj) => {
        let customer = customerObj[0]

        let messageObj = {
            "TemplateId": dev.TEMPLATE.TEMPLATE_ID,
            "From": dev.TEMPLATE.FROM,
        }

        if (customer.firstName) {
            messageObj.TemplateModel = {
                firstName: customer.firstName
            }
        } else {
            messageObj.TemplateModel = {
                firstName: 'Teacher!'
            }
        }

        //Since promise was not working, created own promise
        let promisifiedSendEmail = function (message) {
            let promise = new Promise((resolve, reject) => {
                client.sendEmailWithTemplate(message, function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                })
            });
            return promise;
        }


        if (customer.email) {
            messageObj.To = customer.email;
            messageArray.push(promisifiedSendEmail(messageObj)); //Sending email promise
        }


    })

    //Send Email in one Batch
    return Promise.all([messageArray]);
}

/*
    Purpose of function is to retreive the list of bounces from the Postmark server and 
    update the database accordingly

    Input: N/A 
    Output: N/A


*/
function receiveBounces() {
    client.getBounces({}, function (err, res) {

        let promiseArray = [];

        res.Bounces.forEach(bounce => {
            promiseArray.push(Teacher.update({
                bounceType: bounce.Name
            }, {
                    where: {
                        email: bounce.Email
                    }
                }))
        })

        //Handle Promises
        Promise.all(promiseArray)
            .then(updates => {
                console.log('Update Done')
            })
            .catch(e => {
                console.error(e);
            })
    })
}

module.exports = {
    parseTeacherContactData: parseTeacherContactData,
    sendEmails: sendEmails,
    receiveBounces: receiveBounces,
}
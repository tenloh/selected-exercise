# Selected CRM Coding Exercise

This application is built using Node.JS, run on an Express server with a Postgres DB and Angular Front-End.

To run this program, please clone this library and follow the steps

```sh
$ npm install
$ createdb selected
$ node seed.js
$ npm start
```

Add the env folder on the root directory and add 'development.js' - please contact me if you did not receive it

# Using the application

To use the application, navigate to http://locahost:3456 and upload the CSV file with the Teacher Contact Data

The application will automatically upload and parse the data, send e-mails to users and query bounce statistics afterwards.

To view the list of teachers, click on Refresh Teachers, which will display a list of teachers with the relevant contact information

# TODOs

* Was unable to write tests for this coding exercise, but would like to have done so.

* Issue with getting Contacted Date, so that is currently being left out

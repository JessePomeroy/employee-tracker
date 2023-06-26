const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db');

// Connect to database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: '',
        database: ''
    },
    console.log(`Connected to the employee database.`)
);

connection.connect();
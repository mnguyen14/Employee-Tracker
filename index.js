const mysql2 = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: 'sqlpass',
    database: 'company_db'
});

connection.connect(err => {
    if (err) throw err
    console.log('connected');
    start();
});

const prompt = [
    "View all employees",
    "Add employee",
    "Update employee role",
    "View all roles",
    "View all departments",
    "Add department",
    "Quit"
]

const start
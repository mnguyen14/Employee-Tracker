const mysql2 = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'sqlpass',
    database: 'company_db'
});

connection.connect(err => {
    if (err) throw err
    console.log(`connected as id${connection.threadId}`)
    intro();

})

const choices = [
    "View All Employees",
    "Add Employee",
    "Update Employee Role",
    "View All Roles",
    "Add Role",
    "View All Departments",
    "Add Department",
    "Quit"
]

const intro = () => {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: choices

    }]).then(answer => {
        switch (answer.action) {
            case choices[0]:
                viewEmployees();
                break;

            case choices[1]:
                addEmployee();
                break;

            case choices[2]:
                updateEmployeeRole();
                break;

            case choices[3]:
                viewAllRoles();
                break;

            case choices[4]:
                addRole();
                break;

            // case choices[5]:
            //     ();
            //     break;

            // case choices[6]:
            //     ();
            //     break;

            case choices[7]:
                quit();
                break;
        }
    })
}

const viewEmployees = () => {
    let queryInfo = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, employee.manager_id FROM role LEFT JOIN employee ON role.id = employee.role_id LEFT JOIN department ON department.id = role.dapartment_id'

    connection.query(queryInfo, (err, results) => {
        if (err) throw err
        console.table(results)
        intro();
    })
}

const addEmployee = () => {

    connection.query('SELECT * FROM employee', async (err, results) => {
          if (err) throw err
        let managers = []
        managers.push({
            name: "None",
            value: null
        })

        results.forEach(element => {
            if (element.manager_id === null) {
                managers.push({name:`${element.first_name} ${element.last_name}`, 
                     value:element.id})
            }
        })
 
        const getPersonInfo = await inquirer.prompt
           ([
            {
                name: "firstName",
                type: "input",
                message: "What employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What employee's last name?"
            },

            {
                name: "manager",
                message: "Who is employee's manager?",
                type: "list",
                choices: managers
            }
        ])

     
        connection.query('SELECT distinct title , id FROM role;', async (err, results) => {
           if (err) throw err

            let roles =   results.map(element=>(
                {name:`${element.title}`, 
                value:element.id})
            )
    

            const getRole =  await inquirer.prompt([
                {
                    name: "role",
                    type: "list",
                    message: "What is employee's role",
                    choices: roles
                }

            ])

            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: getPersonInfo.firstName,
                    last_name: getPersonInfo.lastName,
                    role_id: getRole.role,
                    manager_id: getPersonInfo.manager
    
                }, (err) => {
                    if (err) throw err
                    intro()
                }
            )                      
        })    
    })

}

const updateEmployeeRole = () => {

    connection.query('SELECT * FROM employee', async(err, results)=>{
            if(err) throw err                         

        let names = results.map(element => (
            { 
              name:`${element.first_name} ${element.last_name}`, 
              value:element.id 
            }
        ))
        
        const nameId = await (inquirer.prompt([
            {
                name: "name",
                type: "list",
                message: "Please choose employee name you would like to update",
                choices: names 
            }
        ]))
       
        connection.query('SELECT title , id FROM role;', async(err, results)=>{
            if(err) throw err
                let roles = results.map(element => (
                    {
                        name: element.title,
                        value: element.id
                    }
                ))
 
            const roleId = await(inquirer.prompt([
                {
                  name: "roleId",
                  type: "list",
                  message: "Please choose new title for employee",
                  choices: roles
                }
            ]));

            connection.query('UPDATE employee  SET ? WHERE ? ',
                [
                    {role_id:roleId.roleId},
                    {id:nameId.name}
                ]
                ,(err) => {
                    if (err) throw err
                })
                intro()
        })
    })
}

const viewAllRoles = () => {
    let queryByRoles = 'SELECT role.title, department.department_name AS department, role.salary FROM role LEFT JOIN department ON department.id = role.dapartment_id;'
    connection.query(queryByRoles, (err, results) => {
        if (err) throw err
        console.table(results)
        intro()
    })
}

const addRole = () => {
    
}

const quit = () => {
    connection.end();
    process.exit();
}
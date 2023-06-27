const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db');
require("console.table");

init();

function init() {
    mainPrompt();
}

async function mainPrompt() {
    const { choice } = await inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "what would you like to do?",
            choices: [
                {
                    name: "view employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "view employees by department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "view employees by manager",
                    valeu: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "add employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "delete employee",
                    value: "DELETE_EMPLOYEE"
                },
                {
                    name: "update employee role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "update employee manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "view all roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "add role",
                    value: "ADD_ROLE"
                },
                {
                    name: "delete role",
                    value: "DELETE_ROLE"
                },
                {
                    name: "view all departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "quit?",
                    value: "QUIT"
                }
            ]
        }
    ]);

    switch (choice) {
        case "VIEW_EMPLOYEES":
            return viewEmployees();
        case "VIEW_EMPLOYEES_BY_DEPARTMENT":
            return viewEmployeesByDepartment();
        case "ADD_EMPLOYEE":
            return addEmployee();
        case "UPDATE_EMPLOYEE_ROLE":
            return updateEmployeeRole();
        case "VIEW_DEPARTMENTS":
            return viewDepartments();
        case "ADD_DEPARTMENT":
            return addDepartment();
        case "VIEW_ROLES":
            return viewRoles();
        case "ADD_ROLE":
            return addRole();
        default:
            return quit();
    }
}

async function viewEmployees() {
    const employees = await db.findAllEmployees();

    console.table(employees);

    mainPrompt();
}

async function viewEmployeesByDepartment() {
    const departments = await db.findAllDepartments();

    const userDepartmentChoice = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await inquirer([
        {
            type: "list",
            name: "departmentId",
            message: "which department would you like to choose?",
            choices: userDepartmentChoice
        }
    ]);

    const employees = await db.findAllEmployeesByDepartment(departmentId);

    console.table(employees);

    mainPrompt();
}

async function updateEmployeeRole() {
    const employees = await db.findAllEmployees();

    const userEmployeeChoice = employees.map(({ id, first_name, last_name }) => ({
        name: first_name + '' + last_name,
        value: id,
    }));

    const { employeeId } = await inquirer([
        {
            type: "list",
            name: "employeeId",
            message: "which employee's role would you like to update?",
            choices: userEmployeeChoice
        }
    ]);

    const roles = await db.findAllRoles();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await inquirer([
        {
            type: "list",
            name: "roleId",
            message: "which role do you want to assign to the employee?",
            choices: roleChoices
        }
    ]);

    await db.updateEmployeeRole(employeeId, roleId);

    console.log("successfully updated employee role!");

    mainPrompt();
}

async function viewRoles() {
    const roles = await db.findAllRoles();

    console.table(roles);

    mainPrompt();
}

async function addRole() {
    const departments = await db.findAllDepartments();

    const userDepartmentChoice = departments.map(({ id, name }) => ({
        name: name,
        value: id,
    }));

    const role = await inquirer([
        {
            name: "title",
            message: "name of role?"
        },
        {
            name: "salary",
            message: "salary of the role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "which department does this role work for?",
            choices: userDepartmentChoice
        }
    ]);

    await db.createRole(role);

    console.log(`${role.title} added to database.`);

    mainPrompt();
}

async function viewDepartments() {
    const departments = await db.findAllDepartments();

    console.table(departments);

    mainPrompt();
}

async function addDepartment() {
    const department = await inquirer([
        {
            name: "name",
            message: "what is the name of the department?"
        }
    ]);

    await db.createDepartment(department);

    console.log(`${department.name} added to the database.`);

    mainPrompt();
}

async function addEmployee() {
    const roles = await db.findAllRoles();
    const employees = await db.findAllEmployees();

    const employee = await inquirer([
        {
            name: "first_name",
            message: "what is employee's first name?",
        },
        {
            name: "last_name",
        }
    ]);

    const userRoleChoice = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await inquirer([
        {
            type: "list",
            name: "roleId",
            message: "what is the employee's role?",
            choices: userRoleChoice
        }
    ]);

    employee.role_id = roleId;

    const userManagerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: first_name + '' + last_name,
        value: id,
    }));
    userManagerChoices.unshift({ name: "none", value: null });

    const { managerId } = await inquirer([
        {
            type: "list",
            name: "managerId",
            message: "who is the employee's manager?",
            choices: userManagerChoices
        }
    ]);

    employee.manager_id = managerId;

    await db.createEmployee(employee);

    console.log(`${employee.first_name} ${employee.last_name} added to the database.`);

    mainPrompt();
}

function quit() {
    console.log("adios~");
    process.exit();
}
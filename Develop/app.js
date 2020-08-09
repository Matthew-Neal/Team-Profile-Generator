const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

// array to save team members
const team = [];

// create questions arrays for inquirer
const managerQuestions = [
    // manager name
    {
        name: "name",
        type: "input",
        message: "Enter the following information about team's manager:\n? Name:",
    },

    // id
    {
        // type: "number" results in NaN that can't be deleted if validation is false
        // quickfix: use type: "input" instead
        // see inquirer issue #866: https://github.com/SBoudrias/Inquirer.js/issues/866
        name: "id",
        type: "input",
        message: "id:",
        validate: (value) =>
            isNaN(value) ? "Please enter a valid id number" : true,
    },

    // email
    {
        name: "email",
        type: "input",
        message: "email:",
        // regex email validation: https://www.w3resource.com/javascript/form/email-validation.php
        validate: (input) =>
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)
                ? true
                : "Please enter a valid email",
    },

    // Manager only - office number
    {
        name: "officeNumber",
        type: "input",
        message: "Office Number:",
    },
];

const anotherMember = {
    name: "cont",
    type: "confirm",
    message: "Add another team member?",
};

const employeeQuestions = [
    // role
    {
        name: "role",
        type: "list",
        message:
            "Select the following role for new team member:\n",
        choices: [
            {
                name: "ENGINEER",
                value: "engineer",
            },
            {
                name: "INTERN",
                value: "intern"
            },
        ],
    },

    // name
    {
        name: "name",
        type: "input",
        message: "Name:",
    },

    // id
    {
        // type: "number" results in NaN that can't be deleted if validation is false
        // quickfix: use type: "input" instead
        // see inquirer issue #866: https://github.com/SBoudrias/Inquirer.js/issues/866
        name: "id",
        type: "input",
        message: "id:",
        validate: (value) =>
            isNaN(value) ? "Please enter a valid id number" : true,
    },

    // email
    {
        name: "email",
        type: "input",
        message: "email:",
        // regex email validation: https://www.w3resource.com/javascript/form/email-validation.php
        validate: (input) =>
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)
                ? true
                : "Please enter a valid email",
    },

    // Engineer only - github username
    {
        name: "github",
        type: "input",
        message: "Github Username:",
        when: (member) => member.role === "engineer",
    },

    // Intern only - school name
    {
        name: "school",
        type: "input",
        message: "School:",
        when: (member) => member.role === "intern",
    },
];

// main function definition
async function getTeamInfo() {
    // get info about the manager
    const managerInfo = await inquirer.prompt(managerQuestions);
    // create Manager object
    const man = new Manager(
        managerInfo.name,
        managerInfo.id,
        managerInfo.email,
        managerInfo.officeNumber
    );
    // add Manager to team
    team.push(man);

    // ask if user wants to add more members
    let { cont } = await inquirer.prompt(anotherMember);
    // repeat while user chooses to continue
    while (cont) {
        // get info on next employee
        const employeeInfo = await inquirer.prompt(employeeQuestions);
        // if an engineer...
        if (employeeInfo.role === "engineer") {
            // ...create new Engineer
            const eng = new Engineer(
                employeeInfo.name,
                employeeInfo.id,
                employeeInfo.email,
                employeeInfo.github
            );
            // and add to team
            team.push(eng);
        } else {
            // ... create new Intern
            const int = new Intern(
                employeeInfo.name,
                employeeInfo.id,
                employeeInfo.email,
                employeeInfo.school
            );
            // and add to team
            team.push(int);
        }
        // ask if user wants to add another member (to continue while loop)
        cont = await inquirer.prompt(anotherMember).then((ans) => ans.cont);
    }

    // user is done adding team members, time to make html
    const html = render(team);
    // and write html file
    fs.writeFile(outputPath, html, (err) =>
        err ? console.log(err) : console.log(`${outputPath} written successfully!`)
    );
}

// main function call
getTeamInfo();
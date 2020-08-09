//Code to define and export the Intern class.  HINT: This class should inherit from Employee.
const Employee = require("./Employee");

class Intern extends Employee {
    constructor(name, id, email, school) {
        // create shared properties with employee
        super(name, id, email)
        this.school = school;
    }

    getSchool() {
        return this.school;
    }
    getRole() {
        return "Intern";
    }
}

// Exports Module
module.exports = Intern;
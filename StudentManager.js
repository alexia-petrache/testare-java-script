class StudentManager {
    constructor(name, grades) {
        this.name = name;
        this.grades = grades;
    }

    validateGrade(grade) {
        if (typeof grade !== 'number' || grade < 1 || grade > 10) {
            throw new Error('Grade must be a number between 1 and 10');
        }
        return grade;
    }

    checkMeritScholarship() {
        if (!Array.isArray(this.grades) || this.grades.length === 0) {
            throw new Error('The grade list is empty or invalid');
        }

        let sum = 0;
        for (let i = 0; i < this.grades.length; i++) {
            let g = this.validateGrade(this.grades[i]);
            sum += g;
        }

        let average = sum / this.grades.length;

        if (average >= 8.50 && !this.grades.includes(4)) {
            return 'Scholarship Approved';
        } else {
            return 'Scholarship Rejected';
        }
    }
}

module.exports = StudentManager;

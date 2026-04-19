'use strict';

const StudentManager = require('./StudentManager');

const avg = (...grades) => grades.reduce((s, g) => s + g, 0) / grades.length;

describe('StudentManager', () => {

    describe('testMain', () => {
        // Verifica scenariul de baza: un student cu medie 8.8 si fara nota 4 primeste bursa
        test('a student with all grades above average 8.50 and no grade of 4 receives the scholarship', () => {
            const student = new StudentManager('Alice', [9, 9, 8, 9, 9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });
    });

//TESTARE DE TIP BLACK-BOX
    describe('equivalencePartitioning', () => {
        // EP1: Clasa valida — medie >= 8.50 si fara nota 4 -> bursa aprobata
        test('EP1: average >= 8.50 and no grade of 4 -> scholarship approved', () => {
            const student = new StudentManager('Alice', [9, 9, 9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // EP2: Clasa invalida — nota in afara intervalului [1,10] -> exceptie
        test('EP2: grade outside valid range (grade = 0) -> throws validation error', () => {
            const student = new StudentManager('Bob', [9, 0, 9]);
            expect(() => student.checkMeritScholarship())
                .toThrow('Grade must be a number between 1 and 10');
        });

        // EP3: Clasa valida — medie sub 8.50 -> bursa respinsa
        test('EP3: average below 8.50 -> scholarship rejected', () => {
            const student = new StudentManager('Carol', [6, 7, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // EP4: Clasa valida — medie >= 8.50 dar contine nota 4 -> bursa respinsa
        test('EP4: average >= 8.50 but contains grade of 4 -> scholarship rejected', () => {
            const student = new StudentManager('Dan', [10, 10, 10, 4]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // EP5: Clasa invalida — lista de note este goala -> exceptie
        test('EP5: empty grades array -> throws "The grade list is empty or invalid"', () => {
            const student = new StudentManager('Eve', []);
            expect(() => student.checkMeritScholarship())
                .toThrow('The grade list is empty or invalid');
        });

        // EP6: Clasa invalida — lista de note nu este un array (null) -> exceptie
        test('EP6: grades is not an array (null) -> throws "The grade list is empty or invalid"', () => {
            const student = new StudentManager('Frank', null);
            expect(() => student.checkMeritScholarship())
                .toThrow('The grade list is empty or invalid');
        });
    });

    describe('boundaryValueAnalysis', () => {
        // Nota 0 este invalida — sub limita minima a intervalului [1,10]
        test('grade 0 is invalid — below minimum boundary', () => {
            const student = new StudentManager('Alice', [0]);
            expect(() => student.checkMeritScholarship()).toThrow();
        });

        // Nota 1 este valida — exact la limita minima; media=1 duce la respingere fara exceptie
        test('grade 1 is valid — at minimum boundary (avg=1 -> rejected without error)', () => {
            const student = new StudentManager('Alice', [1]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // Nota 2 este valida — imediat deasupra limitei minime
        test('grade 2 is valid — one above minimum boundary', () => {
            const student = new StudentManager('Alice', [2]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // Nota 9 este valida — imediat sub limita maxima; media=9 duce la aprobare
        test('grade 9 is valid — one below maximum boundary (avg=9 -> approved)', () => {
            const student = new StudentManager('Alice', [9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // Nota 10 este valida — exact la limita maxima; media=10 duce la aprobare
        test('grade 10 is valid — at maximum boundary (avg=10 -> approved)', () => {
            const student = new StudentManager('Alice', [10]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // Nota 11 este invalida — depaseste limita maxima a intervalului [1,10]
        test('grade 11 is invalid — above maximum boundary', () => {
            const student = new StudentManager('Alice', [11]);
            expect(() => student.checkMeritScholarship()).toThrow();
        });

        // Media exact 8.50 -> bursa aprobata (exact la limita de prag)
        test('average exactly 8.50 -> scholarship approved (at boundary)', () => {
            expect(avg(8, 9)).toBeCloseTo(8.5);
            const student = new StudentManager('Alice', [8, 9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // Media 8.25 este sub prag -> bursa respinsa
        test('average just below 8.50 (8.25) -> scholarship rejected', () => {
            expect(avg(8, 8, 9, 8)).toBeCloseTo(8.25);
            const student = new StudentManager('Alice', [8, 8, 9, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // Media ~8.67 este peste prag -> bursa aprobata
        test('average just above 8.50 (~8.67) -> scholarship approved', () => {
            expect(avg(9, 9, 8)).toBeCloseTo(8.667, 2);
            const student = new StudentManager('Alice', [9, 9, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // Nota 3 nu blocheaza bursa — doar nota 4 este valoarea de blocare
        test('grade 3 present does NOT block scholarship (avg=8.6, no grade 4)', () => {
            expect(avg(10, 10, 10, 3, 10)).toBeCloseTo(8.6);
            const student = new StudentManager('Alice', [10, 10, 10, 3, 10]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // Nota 4 blocheaza bursa chiar daca media este exact 8.50
        test('grade 4 present DOES block scholarship even when avg >= 8.50', () => {
            expect(avg(10, 10, 10, 4)).toBeCloseTo(8.5);
            const student = new StudentManager('Alice', [10, 10, 10, 4]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // Nota 5 nu blocheaza bursa — nu este valoarea de blocare
        test('grade 5 present does NOT block scholarship (avg=9.0, no grade 4)', () => {
            expect(avg(10, 10, 10, 5, 10)).toBeCloseTo(9.0);
            const student = new StudentManager('Alice', [10, 10, 10, 5, 10]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });
    });

    describe('categoryPartitioning', () => {
        // Categoria A: nota 0 este in afara intervalului -> mesaj exact de validare
        test('category A: grade = 0 (out of range) -> throws exact validation message', () => {
            const student = new StudentManager('Alice', [0, 9, 9]);
            expect(() => student.checkMeritScholarship())
                .toThrow('Grade must be a number between 1 and 10');
        });

        // Categoria A: nota 11 este in afara intervalului -> acelasi mesaj de validare
        test('category A: grade = 11 (out of range) -> throws exact validation message', () => {
            const student = new StudentManager('Alice', [11, 9, 9]);
            expect(() => student.checkMeritScholarship())
                .toThrow('Grade must be a number between 1 and 10');
        });

        // Categoria B: nota este un string -> tipul gresit declansaza mesajul de validare
        test('category B: grade is a string -> throws exact validation message', () => {
            const student = new StudentManager('Alice', ['ten', 9, 9]);
            expect(() => student.checkMeritScholarship())
                .toThrow('Grade must be a number between 1 and 10');
        });

        // Categoria B: lista nu este un array (undefined) -> mesaj pentru lista invalida
        test('category B: grades is not an array (undefined) -> throws exact empty-list message', () => {
            const student = new StudentManager('Alice', undefined);
            expect(() => student.checkMeritScholarship())
                .toThrow('The grade list is empty or invalid');
        });

        // Categoria C: media sub 8.50 -> decizia returnata este exact 'Scholarship Rejected'
        test('category C: average below 8.50 -> decision is exactly "Scholarship Rejected"', () => {
            const student = new StudentManager('Bob', [6, 7, 8, 7]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // Categoria D: medie >= 8.50 dar contine nota 4 -> decizia este exact 'Scholarship Rejected'
        test('category D: avg >= 8.50 but contains grade 4 -> decision is exactly "Scholarship Rejected"', () => {
            const student = new StudentManager('Carol', [10, 10, 10, 4]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // Categoria E: note valide, medie >= 8.50, fara nota 4 -> decizia este exact 'Scholarship Approved'
        test('category E: valid grades, avg >= 8.50, no grade 4 -> decision is exactly "Scholarship Approved"', () => {
            const student = new StudentManager('Dan', [9, 9, 10, 8, 9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // Rezultatul aprobat nu trebuie sa fie 'Scholarship Rejected'
        test('approved result is NOT "Scholarship Rejected"', () => {
            const student = new StudentManager('Dan', [9, 9, 9]);
            expect(student.checkMeritScholarship()).not.toBe('Scholarship Rejected');
        });

        // Rezultatul respins nu trebuie sa fie 'Scholarship Approved'
        test('rejected result is NOT "Scholarship Approved"', () => {
            const student = new StudentManager('Eve', [5, 6, 7]);
            expect(student.checkMeritScholarship()).not.toBe('Scholarship Approved');
        });
    });

//TESTARE DE TIP WHITE-BOX
    describe('statementCoverage', () => {
        // SC1: o valoare care nu este array declansaza prima instructiune de garda
        test('SC1: non-array grades triggers guard throw before entering loop', () => {
            const student = new StudentManager('Alice', 'invalid');
            expect(() => student.checkMeritScholarship()).toThrow('The grade list is empty or invalid');
        });

        // SC2: array gol declansaza instructiunea de garda pentru lungime
        test('SC2: empty array triggers length guard throw', () => {
            const student = new StudentManager('Alice', []);
            expect(() => student.checkMeritScholarship()).toThrow('The grade list is empty or invalid');
        });

        // SC3: nota invalida in interiorul buclei declansaza instructiunea throw din validateGrade
        test('SC3: invalid grade inside loop triggers validateGrade throw', () => {
            const student = new StudentManager('Alice', [9, 9, 0, 8]);
            expect(() => student.checkMeritScholarship()).toThrow('Grade must be a number between 1 and 10');
        });

        // SC4: toate notele valide, medie >= 8.50, fara nota 4 -> instructiunea return 'Approved' este atinsa
        test('SC4: all valid grades, avg >= 8.50, no 4 -> approval return statement reached', () => {
            const student = new StudentManager('Alice', [9, 9, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // SC5: medie sub 8.50 -> instructiunea return 'Rejected' este atinsa
        test('SC5: all valid grades, avg < 8.50 -> rejection return statement reached', () => {
            const student = new StudentManager('Alice', [6, 7, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // SC6: nota 4 prezenta -> instructiunea return 'Rejected' este atinsa pe ramura blocajului
        test('SC6: all valid grades, avg >= 8.50, grade 4 present -> rejection return statement reached', () => {
            const student = new StudentManager('Alice', [10, 10, 10, 4]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });
    });

    describe('branchCoverage', () => {
        // B1-T: ramura adevarata din validateGrade — nota sub minim arunca exceptie
        test('B1-T: validateGrade throws for grade below min (grade = 0)', () => {
            const student = new StudentManager('Alice', [0]);
            expect(() => student.checkMeritScholarship()).toThrow();
        });

        // B1-T: ramura adevarata din validateGrade — nota peste maxim arunca exceptie
        test('B1-T: validateGrade throws for grade above max (grade = 11)', () => {
            const student = new StudentManager('Alice', [11]);
            expect(() => student.checkMeritScholarship()).toThrow();
        });

        // B1-F: ramura falsa din validateGrade — nota valida nu arunca exceptie
        test('B1-F: validateGrade does not throw for a valid grade', () => {
            const student = new StudentManager('Alice', [7]);
            expect(() => student.checkMeritScholarship()).not.toThrow();
        });

        // B2-T: prima garda — lista nu este array arunca exceptie
        test('B2-T: grades is not an array -> first guard throws', () => {
            const student = new StudentManager('Alice', 'invalid');
            expect(() => student.checkMeritScholarship()).toThrow('The grade list is empty or invalid');
        });

        // B3-T: a doua garda — array gol arunca exceptie
        test('B3-T: grades is an array but empty -> second guard throws', () => {
            const student = new StudentManager('Alice', []);
            expect(() => student.checkMeritScholarship()).toThrow('The grade list is empty or invalid');
        });

        // B4-T: conditia finala este adevarata -> returneaza 'Scholarship Approved'
        test('B4-T: avg >= 8.50 AND no grade 4 -> "Scholarship Approved"', () => {
            const student = new StudentManager('Alice', [9, 9, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // B4-F: conditia finala este falsa din cauza mediei mici (fara nota 4)
        test('B4-F via avg < 8.50 (no grade 4 present)', () => {
            const student = new StudentManager('Alice', [7, 8, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // B4-F: conditia finala este falsa din cauza prezentei notei 4 (medie >= 8.50)
        test('B4-F via grade 4 present (avg >= 8.50)', () => {
            const student = new StudentManager('Alice', [10, 10, 10, 4]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });
    });

    describe('conditionCoverage', () => {
        // C1=adevarat, C2=adevarat: medie >= 8.50 SI fara nota 4 -> singura combinatie care aproba
        test('C1=true, C2=true — avg >= 8.50 AND no grade 4 -> approved', () => {
            const student = new StudentManager('Alice', [9, 9, 9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // C1=adevarat, C2=fals: medie >= 8.50 DAR nota 4 prezenta -> respins
        test('C1=true, C2=false — avg >= 8.50 BUT grade 4 present -> rejected', () => {
            const student = new StudentManager('Alice', [10, 10, 10, 4]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // C1=fals, C2=adevarat: medie < 8.50 si fara nota 4 -> respins
        test('C1=false, C2=true — avg < 8.50 AND no grade 4 -> rejected', () => {
            const student = new StudentManager('Alice', [7, 8, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // C1=fals, C2=fals: ambele conditii esueaza simultan -> respins
        test('C1=false, C2=false — avg < 8.50 AND grade 4 present -> rejected', () => {
            const student = new StudentManager('Alice', [4, 7, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });
    });

    describe('circuitsCoverage', () => {
        // Calea 1: lista nu este array -> exceptie inainte de orice iteratie
        test('Path 1: grades is undefined — throws before any loop iteration', () => {
            const student = new StudentManager('Alice', undefined);
            expect(() => student.checkMeritScholarship())
                .toThrow('The grade list is empty or invalid');
        });

        // Calea 2: array gol -> exceptie dupa verificarea tipului, inainte de bucla
        test('Path 2: grades is an empty array — throws after array check, before loop', () => {
            const student = new StudentManager('Alice', []);
            expect(() => student.checkMeritScholarship())
                .toThrow('The grade list is empty or invalid');
        });

        // Calea 3: nota invalida la mijlocul buclei -> exceptie in interiorul buclei
        test('Path 3: loop reaches an invalid grade mid-iteration — throws inside loop', () => {
            const student = new StudentManager('Alice', [9, 9, 0, 8]);
            expect(() => student.checkMeritScholarship())
                .toThrow('Grade must be a number between 1 and 10');
        });

        // Calea 4: bucla se termina, medie < 8.50, fara nota 4 -> respins
        test('Path 4: loop completes, avg < 8.50 -> rejection (no grade 4)', () => {
            const student = new StudentManager('Alice', [6, 7, 8, 7]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // Calea 5: bucla se termina, medie >= 8.50 dar nota 4 prezenta -> respins
        test('Path 5: loop completes, avg >= 8.50, grade 4 present -> rejection', () => {
            const student = new StudentManager('Alice', [10, 10, 10, 4]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // Calea 6: bucla se termina, medie >= 8.50, fara nota 4 -> aprobat
        test('Path 6: loop completes, avg >= 8.50, no grade 4 -> approval', () => {
            const student = new StudentManager('Alice', [9, 9, 8, 9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });
    });

//MUTATION TESTING
    describe('killMutants', () => {
        // M1: media exact 8.50 trebuie sa fie aprobata — elimina mutantul care schimba >= in >
        test('M1: average exactly 8.50 -> approved (kills ">8.50" off-by-one mutant)', () => {
            expect(avg(8, 9)).toBeCloseTo(8.5);
            const student = new StudentManager('Alice', [8, 9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // M1: media 8.25 trebuie sa fie respinsa — confirma ca pragul nu a fost coborat accidental
        test('M1: average 8.25 -> rejected (confirms threshold is not accidentally lowered)', () => {
            expect(avg(8, 8, 9, 8)).toBeCloseTo(8.25);
            const student = new StudentManager('Alice', [8, 8, 9, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // M2a: media 8.50 este aprobata — elimina mutantul care ridica pragul la >= 8.51
        test('M2a: avg=8.5 is approved — kills ">= 8.51" threshold shift mutant', () => {
            const student = new StudentManager('Alice', [8, 9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // M2b: media 8.25 este respinsa — elimina mutantul care coboara pragul la >= 8.0 sau >= 8.49
        test('M2b: avg=8.25 is rejected — kills ">= 8.0" or ">= 8.49" threshold shift mutant', () => {
            const student = new StudentManager('Alice', [8, 8, 9, 8]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // M3: nota 4 prezenta -> respins; nota 4 absenta -> aprobat — elimina mutantul care sterge negatia !
        test('M3: grade 4 present -> rejected, grade 4 absent -> approved (kills negation-flip mutant)', () => {
            expect(new StudentManager('Alice', [10, 10, 10, 4]).checkMeritScholarship())
                .toBe('Scholarship Rejected');
            expect(new StudentManager('Alice', [10, 10, 10, 8]).checkMeritScholarship())
                .toBe('Scholarship Approved');
        });

        // M4a: nota 3 nu blocheaza bursa — elimina mutantul care inlocuieste includes(4) cu includes(3)
        test('M4a: grade 3 does NOT block (kills includes(3) replacement mutant)', () => {
            const student = new StudentManager('Alice', [10, 10, 10, 3, 10]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // M4b: nota 4 blocheaza bursa — confirma ca valoarea de blocare este exact 4
        test('M4b: grade 4 DOES block (confirms the blocking value is 4)', () => {
            const student = new StudentManager('Alice', [10, 10, 10, 4]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });

        // M4c: nota 5 nu blocheaza bursa — elimina mutantul care inlocuieste includes(4) cu includes(5)
        test('M4c: grade 5 does NOT block (kills includes(5) replacement mutant)', () => {
            const student = new StudentManager('Alice', [10, 10, 9, 5, 9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Approved');
        });

        // M5a: nota 1 este valida — elimina mutantul care coboara minimul la 0
        test('M5a: grade 1 is valid — kills "grade < 0" (lowered min) mutant', () => {
            expect(() => new StudentManager('Alice', [1]).checkMeritScholarship()).not.toThrow();
        });

        // M5b: nota 0 este invalida — elimina mutantul care schimba limita minima de la 1 la 0
        test('M5b: grade 0 is invalid — kills "grade < 1" -> "grade < 0" boundary shift mutant', () => {
            expect(() => new StudentManager('Alice', [0]).checkMeritScholarship()).toThrow();
        });

        // M5c: nota 2 este valida — elimina mutantul care ridica minimul la 2
        test('M5c: grade 2 is valid — kills "grade < 2" (raised min) mutant', () => {
            expect(() => new StudentManager('Alice', [2]).checkMeritScholarship()).not.toThrow();
        });

        // M6a: nota 10 este valida — elimina mutantul care coboara maximul la 9
        test('M6a: grade 10 is valid — kills "grade > 10" -> "grade > 9" (lowered max) mutant', () => {
            expect(() => new StudentManager('Alice', [10]).checkMeritScholarship()).not.toThrow();
        });

        // M6b: nota 11 este invalida — elimina mutantul care ridica maximul la 11
        test('M6b: grade 11 is invalid — kills "grade > 10" -> "grade > 11" (raised max) mutant', () => {
            expect(() => new StudentManager('Alice', [11]).checkMeritScholarship()).toThrow();
        });

        // M6c: nota 9 este valida — confirma ca maximul nu este gresit setat la 9
        test('M6c: grade 9 is valid — confirms max is not off-by-one at 9', () => {
            expect(() => new StudentManager('Alice', [9]).checkMeritScholarship()).not.toThrow();
        });

        // M7a: decizia de aprobare returneaza exact 'Scholarship Approved' si nu 'Scholarship Rejected'
        test('M7a: approved decision returns "Scholarship Approved", not "Scholarship Rejected"', () => {
            const result = new StudentManager('Alice', [9, 9, 9]).checkMeritScholarship();
            expect(result).toBe('Scholarship Approved');
            expect(result).not.toBe('Scholarship Rejected');
        });

        // M7b: decizia de respingere returneaza exact 'Scholarship Rejected' si nu 'Scholarship Approved'
        test('M7b: rejected decision returns "Scholarship Rejected", not "Scholarship Approved"', () => {
            const result = new StudentManager('Alice', [6, 7, 8]).checkMeritScholarship();
            expect(result).toBe('Scholarship Rejected');
            expect(result).not.toBe('Scholarship Approved');
        });

        // M8a: medie >= 8.50 CU nota 4 -> respins — elimina mutantul care schimba && in ||
        test('M8a: avg >= 8.50 WITH grade 4 -> rejected (kills && -> || mutant)', () => {
            expect(new StudentManager('Alice', [10, 10, 10, 4]).checkMeritScholarship())
                .toBe('Scholarship Rejected');
        });

        // M8b: medie < 8.50 FARA nota 4 -> respins — confirma ca ambele conditii sunt necesare
        test('M8b: avg < 8.50 WITHOUT grade 4 -> rejected (kills && -> || mutant)', () => {
            expect(new StudentManager('Alice', [7, 8, 8]).checkMeritScholarship())
                .toBe('Scholarship Rejected');
        });
    });

    describe('NaN edge case (JavaScript-specific)', () => {
        // Nota NaN trece de garda de tip deoarece typeof NaN === 'number' in JavaScript;
        // corupe suma, media devine NaN, iar NaN >= 8.50 este fals -> bursa respinsa
        test('NaN grade is not caught by the type guard (typeof NaN === "number") and causes rejection via NaN average', () => {
            const student = new StudentManager('Alice', [NaN, 9, 9]);
            expect(student.checkMeritScholarship()).toBe('Scholarship Rejected');
        });
    });

});

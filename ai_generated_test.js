// Cod generat de AI
const StudentManager = require('./StudentManager');

describe('AI Generated Tests', () => {
  test('should calculate average correctly', () => {
    const sm = new StudentManager('Test', [10, 8]);
    expect(sm.checkMeritScholarship()).toBe('Scholarship Approved');
  });

  test('should reject if average is low', () => {
    const sm = new StudentManager('Test', [5, 6]);
    expect(sm.checkMeritScholarship()).toBe('Scholarship Rejected');
  });

  test('should throw error for invalid grade', () => {
    const sm = new StudentManager('Test', [11]);
    expect(() => sm.checkMeritScholarship()).toThrow();
  });
});
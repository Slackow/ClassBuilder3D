export const semesters = ["Fall 2022", "Spring 2023", "Fall 2023"]

export class SemesterSchedule {
  constructor(term) {
    this.term = term;
    this.courseSections = [];
  }
  addSection(courseSection) {
    this.courseSections.push(courseSection);
  }
  problemsWithOverlap() {
    let invalidCourses = new Set();
    for (let i = 0; i < this.courseSections.length; i++) {
      for (let j = i + 1; j < this.courseSections.length; j++) {
        let [days1, times1] = this.courseSections[i].times;
        let [days2, times2] = this.courseSections[j].times;
        if (Array(days1).find(day => days2.includes(day))) {
          let [s1, e1] = times1;
          let [s2, e2] = times2;
          if (Math.max(s1, s2) <= Math.min(e1, e2)) {
            invalidCourses.add(this.courseSections[i].courseId);
            invalidCourses.add(this.courseSections[j].courseId);
          }
        }
      }
    }
    if (invalidCourses.size > 0) {
      return {
        type: "overlap",
        courses: Array.from(invalidCourses),
        message: "The following courses have overlapping times."
      };
    }
    return null;
  }

  problemsWithCredits() {
    let totalCreditCount = this.courseSections
      .map(c => c.credits)
      .reduce((a, b) => a + b, 0);
    if (totalCreditCount < 12 || totalCreditCount > 20) {
      return {
        type: "credits",
        totalCredits: totalCreditCount,
        message: `Credits should be between 12 and 20, but found ${totalCreditCount}.`
      };
    }
    return null;
  }
}

export class Plan {
  /**
   * @param alreadyTaken {PrevSemester[]}
   * @param requests {string}
   */
  constructor(alreadyTaken, requests) {
    this.alreadyTaken = alreadyTaken;
    this.requests = requests;
  }

  problemsWithPreCoreqs(schedule, courseCatalog) {
    const takenCourses = new Set(
      this.alreadyTaken.flatMap(sem => sem.courses)
    );
    const scheduledCourses = new Set(
      schedule.courseSections.map(cs => cs.courseId)
    );
    let errors = [];
    schedule.courseSections.forEach(cs => {
      const course = courseCatalog[cs.courseId];
      if (!course) return;
      const missingPrereqs = course.prereqs.filter(pre =>
        !takenCourses.has(pre) && !(scheduledCourses.has(pre) && course.coreqs.includes(pre))
      );
      const missingCoreqs = course.coreqs.filter(co =>
        !takenCourses.has(co) && !scheduledCourses.has(co)
      );
      if (missingPrereqs.length > 0 || missingCoreqs.length > 0) {
        errors.push({
          course: cs.courseId,
          missingPrereqs,
          missingCoreqs,
          message: `Course ${cs.courseId} is missing required ${missingPrereqs.length > 0 ? "prerequisites" : ""}${(missingPrereqs.length > 0 && missingCoreqs.length > 0) ? " and " : ""}${missingCoreqs.length > 0 ? "corequisites" : ""}.`
        });
      }
    });
    return errors.length > 0 ? { type: "preCoreq", errors } : null;
  }

  problemsWithGraduateCourses(schedule, courseCatalog) {
    let totalTakenCredits = this.alreadyTaken.reduce((sum, sem) => {
      return sum + sem.courses.reduce((innerSum, courseId) => {
        let course = courseCatalog[courseId];
        return course ? innerSum + course.credits : innerSum;
      }, 0);
    }, 0);

    let gradErrors = [];
    schedule.courseSections.forEach(cs => {
      const course = courseCatalog[cs.courseId];
      if (!course) return;
      const match = cs.courseId.match(/\d+/);
      if (match) {
        const courseLevel = parseInt(match[0], 10);
        if (courseLevel >= 500 && totalTakenCredits < 60) {
          gradErrors.push({
            course: cs.courseId,
            totalTakenCredits,
            message: `Graduate-level course ${cs.courseId} cannot be taken with only ${totalTakenCredits} credits earned.`
          });
        }
      }
    });
    return gradErrors.length > 0 ? { type: "graduate", errors: gradErrors } : null;
  }
}

export class PrevSemester {
  constructor(term, courses) {
    this.term = term;
    this.courses = courses;
  }
}

export class CourseSection {
  constructor(courseId, section, times, instructor, credits) {
    this.courseId = courseId;
    this.section = section;
    this.times = times;
    this.instructor = instructor;
    this.credits = credits;
  }
}

export class Course {
  constructor(courseId, title, description, credits, prereqs, coreqs) {
    this.courseId = courseId;
    this.title = title;
    this.description = description;
    this.credits = credits;
    this.prereqs = prereqs;
    this.coreqs = coreqs;
  }
}
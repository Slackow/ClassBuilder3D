
export const semesters = ["Fall 2022", "Spring 2023", "Fall 2023"]

export class SemesterSchedule {
  constructor(term) {
    this.term = term;
    this.courseSections = [];
  }
  addSection(courseSection) {
    this.courseSections.push(courseSection);
  }
  checkOverlap() {
    let invalid = new Set();
    for (let i = 0; i < this.courseSections.length; i++) {
      for (let j = i + 1; j < this.courseSections.length; j++) {
        let [days1, times1] = this.courseSections[i].times;
        let [days2, times2] = this.courseSections[j].times;
        if (Array(days1).find(c => days2.includes(c))) {
          let [s1, e1] = times1;
          let [s2, e2] = times2;
          if (Math.max(s1, s2) <= Math.min(e1, e2)) {
            invalid.add(this.courseSections[i].courseId);
            invalid.add(this.courseSections[j].courseId);
            console.log("problem found!");
          }
        }
      }
    }
    console.log("Invalid!: ", invalid)
    return invalid.size === 0;
  }

  checkCredits() {
    let totalCreditCount = this.courseSections.map(c => c.credits).reduce((a, b) => a + b, 0);
    return 12 <= totalCreditCount && totalCreditCount <= 20;
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
  checkPreCoreqs(schedule, courseCatalog) {
    const takenCourses = new Set(
      this.alreadyTaken.flatMap(sem => sem.courses)
    );

    const scheduledCourses = new Set(
      schedule.courseSections.map(cs => cs.courseId)
    );

    return schedule.courseSections.every(cs => {
      const course = courseCatalog[cs.courseId];
      if (!course) return true;

      const prereqsOk = course.prereqs.every(pre =>
        takenCourses.has(pre) || (scheduledCourses.has(pre) && course.coreqs.includes(pre))
      );

      const coreqsOk = course.coreqs.every(co =>
        takenCourses.has(co) || scheduledCourses.has(co)
      );

      if (!prereqsOk || !coreqsOk) {
        console.log(`Course ${cs.courseId} is missing pre/coreqs`);
      }

      return prereqsOk && coreqsOk;
    });
  }
}

export class PrevSemester {
  constructor(term, courses) {
    this.term = term;
    this.courses = courses;
  }
}

export class CourseSection {
  constructor(courseId, section, times, instructor) {
    this.courseId = courseId;
    this.section = section;
    this.times = times;
    this.instructor = instructor;
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
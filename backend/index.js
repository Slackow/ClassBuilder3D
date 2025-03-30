import express from 'express';
import { generateSchedule, studyPlans } from "./schedule/converse.js";

import 'dotenv/config';
import available_registrations from "./available_registrations.js";
import { Plan, SemesterSchedule } from "./schedule/schedule.js";

let app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello World!")
});

// For GPT:
app.post('/schedule', async (req, res) => {
  let { plan, school, requests } = req.body ?? {};
  res.send(await generateSchedule(plan, studyPlans[school], requests));
});

app.get('/available_registrations', async (req, res) => {
  res.send(available_registrations);
});

app.post('/check_schedule', async (req, res) => {
  let schedule = new SemesterSchedule();
  let { courses, plan } = req.body ?? {};
  courses.forEach(c => schedule.addSection(c));
  let registrations = available_registrations;
  let courseCatalog = {};
  for (const course of registrations) {
    courseCatalog[course.code + ' ' + course.id] = course;
  }

  res.send( [ schedule.problemsWithCredits(), schedule.problemsWithOverlap() ] );
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});

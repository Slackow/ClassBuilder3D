import express from 'express';
import { generateSchedule, studyPlans } from "./schedule/converse.js";

import 'dotenv/config';
import available_registrations from "./available_registrations.js";

let app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello World!")
});

// For Rate My Professor:
app.get('/professor/:name', (req, res) => {
  let name = req.params.name;
  res.send(`Names: ${name}`)
});

// For GPT:
app.post('/schedule', async (req, res) => {
  let { plan, school, requests } = req.body ?? {};
  res.send(await generateSchedule(plan, studyPlans[school], requests));
});

app.get('/available_registrations', async (req, res) => {
  res.send(available_registrations);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});

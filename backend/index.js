import express from 'express';
import { generateSchedule, studyPlans } from "./schedule/converse.js";

import 'dotenv/config';

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

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});

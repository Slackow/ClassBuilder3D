import express from 'express';

let app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send("Hello World!")
});
app.get('/professor/:name', (req, res) => {
  let name = req.params.name;
  res.send(`Names: ${name}`)
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});

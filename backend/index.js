import * as express from 'express';
let app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send("Hello World!")
});


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});

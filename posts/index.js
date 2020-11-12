const app = require('express')();
const axios = require('axios');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const posts = {};

app.use(bodyParser.json());
app.use(require('cors')());
app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  posts[id] = { id, title };

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: posts[id],
  });
  res.status(200).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('listening on 4000');
});

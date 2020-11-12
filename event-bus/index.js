const { default: Axios } = require('axios');

const app = require('express')();
app.use(require('body-parser').json());
app.use(require('cors')());

const axios = require('axios');

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;
  events.push(event);
  //send the event to all running services

  console.log('bus got: ', event);
  axios.post('http://localhost:4000/events', event);
  axios.post('http://localhost:4001/events', event);
  axios.post('http://localhost:4002/events', event);
  axios.post('http://localhost:4003/events', event);

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});
app.listen(4005, () => {
  console.log('listening on 4005');
});

const app = require('express')();
const bodyParser = require('body-parser');
const axios = require('axios');
const { randomBytes } = require('crypto');
const { stat } = require('fs');

const commentsByPostId = {};

app.use(bodyParser.json());
app.use(require('cors')());
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: 'pending' });
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://event-bus-clusterip-srv:4005/events', {
    type: 'CommentCreated',
    data: { postId: req.params.id, id: commentId, content, status: 'pending' },
  });
  res.send(comments);
});

app.post('/events', async (req, res) => {
  //   console.log('Event Received: ', req.body.type);
  const { type, data } = req.body;
  if (type === 'CommentModerated') {
    const { postId, status, id, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    await axios.post('http://event-bus-clusterip-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }
  res.send({});
});
app.listen(4001, () => {
  console.log('listening on 4001');
});

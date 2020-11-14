const app = require('express')();
app.use(require('cors')());
app.use(require('body-parser').json());
const axios = require('axios');
const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id: id, content, status });
    posts[postId] = post;
  }

  if (type === 'CommentUpdated') {
    console.log('inside query comment updated');
    console.log(data);
    const { id, content, postId, status } = data;
    const post = posts[postId];
    let comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
  console.log(posts);
};
//QUICK EXAMPLE
// posts = {
//   j123j42: {
//     id: 'j12j42',
//     title: 'post title',
//     comments: [{ id: '123nsj', content: 'comment content' }],
//   },
// };

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log('listening on 4002');
  const res = await axios
    .get('http://event-bus-clusterip-srv:4005/events')
    .then((resp) => resp.data);
  for (let event of res) {
    handleEvent(event.type, event.data);
  }
});

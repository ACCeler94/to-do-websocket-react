const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io')


const tasks = [{ id: '1', name: 'Shopping' }, { id: '2', name: 'Go out with a dog' },];

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/public/index.html'));
});


const server = app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

const io = socket(server)

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (taskId) => {
    const indexToRemove = tasks.findIndex(element => element.id === taskId);
    tasks.splice(indexToRemove, 1);
    socket.broadcast.emit('removeTask', taskId);
  })
})
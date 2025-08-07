import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function initSocketIO(io) {
  io.on('connection', (socket) => {

    socket.on('list-created', async (newList) => {
      try {
        const html = await ejs.renderFile(
          path.join(__dirname, '../views/partials/list.ejs'),
          { list: newList }
        );
        io.emit('new-list-html', html);
      } catch (err) {
        socket.emit('server-error', 'Failed to render list partial');
      }
    });

    socket.on('task-created', async (task) => {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, '../views/partials/task.ejs'),
      { task }
    );
    io.emit('new-task-html', { html, listId: task.listId });
  } catch (err) {
    socket.emit('server-error', 'Failed to render task partial');
  }
});




    socket.on('task-deleted', (taskId) => {
      socket.broadcast.emit('task-deleted', taskId);
    });

    socket.on('list-deleted', (listId) => {
      socket.broadcast.emit('list-deleted', listId);
    });

        socket.on('list-updated', (updatedList) => {
        socket.broadcast.emit('list-updated', updatedList);
    });

    socket.on('task-updated', (updatedTask) => {
  socket.broadcast.emit('task-updated', updatedTask);
});

  socket.on('lists-reordered', (updatedLists) => {
    socket.broadcast.emit('lists-reordered', updatedLists);
  });

  socket.on('task-moved', (updatedTask) => {
  socket.broadcast.emit('task-moved', updatedTask);
});

    socket.on('disconnect', () => {
    });
  });
}

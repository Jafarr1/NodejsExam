// sockets/io.js
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

// Required because you're using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function initSocketIO(io) {
  io.on('connection', (socket) => {
    console.log('A client connected', socket.id);

    socket.on('list-created', async (newList) => {
      // existing code for list-created
      try {
        const html = await ejs.renderFile(
          path.join(__dirname, '../views/partials/list.ejs'),
          { list: newList }
        );
        io.emit('new-list-html', html);
      } catch (err) {
        console.error('Failed to render list partial:', err);
      }
    });

    socket.on('task-created', async (task) => {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, '../views/partials/task.ejs'),
      { task }
    );
    console.log('Rendered task html:', html);
    io.emit('new-task-html', { html, listId: task.listId });
  } catch (err) {
    console.error('Failed to render task partial:', err);
  }
});

    // NEW: listen for task delete events
    socket.on('task-deleted', (taskId) => {
      console.log('Task deleted:', taskId);
      socket.broadcast.emit('task-deleted', taskId);
    });

    socket.on('list-deleted', (listId) => {
      console.log('List deleted:', listId);
      socket.broadcast.emit('list-deleted', listId);
    });

        socket.on('list-updated', (updatedList) => {
        console.log('List updated:', updatedList);
        socket.broadcast.emit('list-updated', updatedList);
    });

    socket.on('task-updated', (updatedTask) => {
  socket.broadcast.emit('task-updated', updatedTask);
});

    socket.on('disconnect', () => {
      console.log('A client disconnected', socket.id);
    });
  });
}

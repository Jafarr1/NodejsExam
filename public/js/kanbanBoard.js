document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const board = document.getElementById('board');
  const listForm = document.getElementById('list-form');
  const listTitleInput = document.getElementById('list-title');
  const boardId = document.getElementById('board').dataset.boardId;

const inviteForm = document.getElementById('invite-form');
const inviteInput = document.getElementById('invite-username');
const inviteFeedback = document.getElementById('invite-message');


inviteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  inviteFeedback.textContent = ''; // clear previous message

  const username = inviteInput.value.trim();
  if (!username) {
    inviteFeedback.textContent = 'Please enter a username.';
    return;
  }

  try {
    await inviteMember(boardId, inviteInput.value);
    inviteFeedback.style.color = 'green';
    inviteFeedback.textContent = `User "${inviteInput.value}" invited successfully!`;
    inviteInput.value = '';
  } catch (error) {
    inviteFeedback.style.color = 'red';
    inviteFeedback.textContent = error.message || 'Failed to invite member.';
  }
});



// Create new list
listForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = listTitleInput.value.trim();
  if (!title) return;

  try {
    const res = await fetch(`/api/boards/${boardId}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create list');
    }

    const createdList = await res.json();
    listTitleInput.value = '';
    socket.emit('list-created', createdList);
  } catch (err) {
    toastr.error(err.message || 'Could not create list');
  }
});


  socket.on('new-list-html', (html) => {
    // Insert the new list HTML snippet into the board container
    board.insertAdjacentHTML('beforeend', html);
  });

board.addEventListener('submit', async (e) => {
  if (!e.target.classList.contains('task-form')) return;

  e.preventDefault();
  const taskForm = e.target;
  const input = taskForm.querySelector('input[type="text"]');
  const listId = taskForm.dataset.listId;
  const newTask = { title: input.value, listId };

  try {
    const res = await fetch(`/api/boards/${boardId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });

    if (!res.ok) throw new Error('Failed to create task');
    const createdTask = await res.json();
    socket.emit('task-created', createdTask);

    input.value = '';
  } catch (err) {
    toastr.error(err.message || 'Could not create task');
  }
});

  socket.on('new-task-html', ({ html, listId }) => {
  const column = document.querySelector(`.column[data-list-id="${listId}"]`);
  if (column) {
    const taskList = column.querySelector('.task-list');
    taskList.insertAdjacentHTML('beforeend', html);
  }
});

  // Toggle menus for tasks and lists
  board.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-menu-btn')) {
      e.stopPropagation();
      const task = e.target.closest('.task');
      if (!task) return;
      const menu = task.querySelector('.task-menu');

      board.querySelectorAll('.task-menu').forEach(m => {
        if (m !== menu) m.classList.add('hidden');
      });

      menu.classList.toggle('hidden');
    }

    if (e.target.classList.contains('list-menu-btn')) {
      e.stopPropagation();
      const column = e.target.closest('.column');
      if (!column) return;
      const menu = column.querySelector('.list-menu');

      board.querySelectorAll('.list-menu').forEach(m => m.classList.add('hidden'));
      menu.classList.toggle('hidden');
    }
  });

  // Close all menus on outside click
  document.addEventListener('click', () => {
    board.querySelectorAll('.task-menu').forEach(m => m.classList.add('hidden'));
    board.querySelectorAll('.list-menu').forEach(m => m.classList.add('hidden'));
  });

 // Edit Task
board.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-task-btn')) {
    e.stopPropagation();

    const task = e.target.closest('.task');
    const taskId = task.dataset.taskId;
    const titleSpan = task.querySelector('.task-title');
    const input = task.querySelector('.task-edit-input');
    const originalTitle = titleSpan.textContent.trim();
    const menu = task.querySelector('.task-menu');

    
    menu.classList.add('hidden');
    input.value = originalTitle;
    titleSpan.classList.add('hidden');
    input.classList.remove('hidden');
    input.focus();

    const saveEdit = async () => {
      const newTitle = input.value.trim();

      if (newTitle && newTitle !== originalTitle) {
        try {
          const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle })
          });

          if (!res.ok) throw new Error('Failed to update task');

          
          titleSpan.textContent = newTitle;
          socket.emit('task-updated', { _id: taskId, title: newTitle });

          cancelEdit();
        } catch (err) {
          toastr.error(err.message || 'Failed to update task');
        }
      } else {
        cancelEdit();
      }
    };

    const cancelEdit = () => {
      input.classList.add('hidden');
      titleSpan.classList.remove('hidden');
      input.value = originalTitle;
    };

    const handleKey = (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        saveEdit();
      }
      if (ev.key === 'Escape') {
        ev.preventDefault();
        cancelEdit();
      }
    };

    input.addEventListener('keydown', handleKey);
    input.addEventListener('blur', cancelEdit);
  }
});


  socket.on('task-updated', ({ _id, title }) => {
  const task = document.querySelector(`.task[data-task-id="${_id}"]`);
  if (task) {
    const titleSpan = task.querySelector('.task-title');
    titleSpan.textContent = title;
  }
});

  // Delete Task (Custom Modal)
  let taskToDelete = null;
  const modal = document.getElementById('delete-modal');
  const confirmBtn = document.getElementById('confirm-delete');
  const cancelBtn = document.getElementById('cancel-delete');

  board.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task-btn')) {
      e.stopPropagation();
      taskToDelete = e.target.closest('.task');
      modal.classList.remove('hidden');
    }
  });

  cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    taskToDelete = null;
  });

  confirmBtn.addEventListener('click', async () => {
    if (!taskToDelete) return;
    const taskId = taskToDelete.dataset.taskId;

    try {
      const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, { method: 'DELETE' });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete task');
    }

    socket.emit('task-deleted', taskId);
    taskToDelete.remove();
  } catch (err) {
    toastr.error(err.message || 'Failed to delete task');
  } finally {
    modal.classList.add('hidden');
    taskToDelete = null;
  }
});

  socket.on('task-deleted', (taskId) => {
  const taskElement = document.querySelector(`.task[data-task-id="${taskId}"]`);
  if (taskElement) {
    taskElement.remove();
  }
});

 // Edit List
board.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-list-btn')) {
    e.stopPropagation();

    const column = e.target.closest('.column');
    const listId = column.dataset.listId;
    const titleSpan = column.querySelector('.list-title-text');
    const input = column.querySelector('.list-edit-input');
    const menu = column.querySelector('.list-menu');
    const originalTitle = titleSpan.textContent.trim();

  
    menu.classList.add('hidden');
    input.value = originalTitle;
    titleSpan.classList.add('hidden');
    input.classList.remove('hidden');
    input.focus();

    const saveEdit = async () => {
      const newTitle = input.value.trim();

      if (newTitle && newTitle !== originalTitle) {
        try {
          const res = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle })
          });

          if (!res.ok) throw new Error('Failed to update list');

         
          titleSpan.textContent = newTitle;
          socket.emit('list-updated', { id: listId, title: newTitle });

          cancelEdit();
        } catch (err) {
          toastr.error(err.message || 'Failed to update list');
        }
      } else {
        cancelEdit(); // Cancel if title is empty or unchanged
      }
    };

    const cancelEdit = () => {
      input.classList.add('hidden');
      titleSpan.classList.remove('hidden');
      input.value = originalTitle;
    };

    const handleKey = (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        saveEdit();
      }
      if (ev.key === 'Escape') {
        ev.preventDefault();
        cancelEdit();
      }
    };

    input.addEventListener('keydown', handleKey);
    input.addEventListener('blur', cancelEdit);
  }
});


  // Delete List (Custom Modal)
  let listToDelete = null;
  const listModal = document.getElementById('list-delete-modal');
  const confirmListDelete = document.getElementById('confirm-list-delete');
  const cancelListDelete = document.getElementById('cancel-list-delete');

  board.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-list-btn')) {
      e.stopPropagation();
      listToDelete = e.target.closest('.column');
      listModal.classList.remove('hidden');
    }
  });

  cancelListDelete.addEventListener('click', () => {
    listModal.classList.add('hidden');
    listToDelete = null;
  });

  confirmListDelete.addEventListener('click', async () => {
    if (!listToDelete) return;
    const listId = listToDelete.dataset.listId;
    try {
      const res = await fetch(`/api/boards/${boardId}/lists/${listId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
    socket.emit('list-deleted', listId);

    listToDelete.remove(); 
    } catch {
      toastr.error(err.message || 'Failed to delete list');
    } finally {
      listModal.classList.add('hidden');
      listToDelete = null;
    }
  });

  socket.on('list-deleted', (listId) => {
  const listElement = document.querySelector(`.column[data-list-id="${listId}"]`);
  if (listElement) listElement.remove();
});

  // Enable drag-and-drop sorting between task lists using SortableJS
const taskLists = document.querySelectorAll('.task-list');

taskLists.forEach(taskList => {
  new Sortable(taskList, {
    group: 'shared-tasks',
    animation: 150,

    onEnd: async (evt) => {
      const taskId = evt.item.dataset.taskId;
      const newListId = evt.to.closest('.column').dataset.listId;


      try {
        const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listId: newListId })
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to move task');
        }
        const updatedTask = await res.json();
        socket.emit('task-moved', updatedTask);

      } catch (err) {
        toastr.error(err.message || 'Error moving task');
      }
    }
  });
});


new Sortable(board, {
  animation: 150,
  handle: '.list-title-text',
  onEnd: async (evt) => {
    // After drag ends, get all list ids in new order
    const lists = [...board.querySelectorAll('.column')];
    const updatedLists = lists.map((list, index) => ({
      id: list.dataset.listId,
      order: index
    }));

    try {
      const res = await fetch(`/api/boards/${boardId}/lists/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLists)
      });

      if (!res.ok) throw new Error('Failed to reorder lists');
      socket.emit('lists-reordered', updatedLists);
    } catch (err) {
      toastr.error(err.message || 'Error moving task');
    }
  }
});

async function inviteMember(boardId, memberUsername) {
  try {
    const response = await fetch(`/api/boards/${boardId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: memberUsername }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add member');
    }

  } catch (error) {
    toastr.error(error.message || 'Failed to invite member');
  }
}
});

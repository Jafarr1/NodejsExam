document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/logout', { method: 'POST' });
        if (res.ok) {
          window.location.href = '/login';
        } else {
          const error = await res.json();
          toastr.error(error.error || 'Logout failed');
        }
      } catch (err) {
        toastr.error(err.message || 'Could not create list');
      }
    });
  }

  const boardForm = document.getElementById('create-board-form');
  const boardTitleInput = document.getElementById('board-title');
  const boardsContainer = document.getElementById('boards-container');

  if (!boardForm || !boardTitleInput || !boardsContainer) return;

  boardForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = boardTitleInput.value.trim();
    if (!title) return;

    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      if (!res.ok) throw new Error('Failed to create board');

     const response = await res.json();
     const board = response.data;

      const boardCard = document.createElement('div');
      boardCard.classList.add('board-card');

      const boardTitle = document.createElement('h3');
      boardTitle.textContent = board.title;

      const boardLink = document.createElement('a');
      boardLink.href = `/boards/${board._id}`;
      boardLink.textContent = 'Open';

      boardCard.appendChild(boardTitle);
      boardCard.appendChild(boardLink);
      boardsContainer.appendChild(boardCard);

      boardTitleInput.value = '';
    } catch (err) {
    }
  });
});

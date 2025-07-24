document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const errorDiv = document.getElementById('error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      return showError('Please fill in all fields.');
    }

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    };

    fetch('/api/signup', options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/login';
        } else {
          showError(data.message || 'Signup failed.');
        }
      })
      .catch(() => showError('Something went wrong. Please try again.'));
  });

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
  }
});

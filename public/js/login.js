document.addEventListener('DOMContentLoaded', () => {
  const form     = document.getElementById('login-form');
  const errorDiv = document.getElementById('error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      return showError('Please provide both username and password.');
    }


    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    };

    fetch('/api/login', options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/';
        } else {
          showError(data.message || 'Login failed.');
        }
      })
      .catch(() => showError('Something went wrong. Please try again.'));
  });

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      return toastr.error('Please provide both username and password.');
    }


    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        toastr.success('Login successful!');
        setTimeout(() => {
          window.location.href = '/boards';
        }, 1000);
      } else {
        toastr.error(data.message || 'Login failed.');
      }
    } catch {
      toastr.error('Something went wrong. Please try again.');
    }
  });
});

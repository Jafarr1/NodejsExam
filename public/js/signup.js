document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      return toastr.error('Please fill in all fields.');
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toastr.success('Signup successful!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1200); // 1.5 second delay to show toastr
      } else {
        toastr.error(data.message || 'Signup failed.');
      }
    } catch (err) {
      toastr.error('Something went wrong. Please try again.');
    }
  });
});

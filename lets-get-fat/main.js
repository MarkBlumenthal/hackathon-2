// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert('Welcome ' + data.name);
    } else {
      alert(data.message);
    }
  });
  
  // Handle register form submission
  document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, username, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert('User registered successfully');
    } else {
      alert(data.message);
    }
  });
  
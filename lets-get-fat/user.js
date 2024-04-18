// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const height = document.getElementById('height').value;
    const age = document.getElementById('age').value;
    const currentWeight = document.getElementById('currentWeight').value;
    const desiredWeight = document.getElementById('desiredWeight').value;
    const dietPreference = document.getElementById('dietPreference').value;
    const response = await fetch('/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ height, age, currentWeight, desiredWeight, dietPreference }),
    });
    if (response.ok) {
      alert('Profile updated successfully');
    } else {
      const data = await response.json();
      alert(data.message);
    }
  });
  
 // Handle logout button click
document.getElementById('logoutButton').addEventListener('click', () => {
    // Clear any user data from the frontend
    // This will depend on how you're storing user data
  
    // Redirect to the landing page
    window.location.href = 'landingpage.html';
  });
  
  
// Retrieve userID from somewhere, possibly stored in localStorage after login
const userId = localStorage.getItem('userId'); 

if (!userId) {
    console.error('No user ID found, redirecting to login');
    // Redirect to login or handle appropriately
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;
    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.userId) {
            console.log('User logged in:', data.userId);
            localStorage.setItem('userId', data.userId); // Store user ID for session
            window.location.href = 'user.html'; // Redirect to user page
        } else {
            console.error('Login failed:', data.error);
        }
    })
    .catch((error) => {
        console.error('Login error:', error);
    });
});


// Handle register form submission
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var name = document.getElementById('register-name').value;
    var username = document.getElementById('register-username').value;
    var email = document.getElementById('register-email').value;
    var password = document.getElementById('register-password').value;
    fetch('/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, username: username, email: email, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.userId) {
            console.log('User registered:', data.userId);
            localStorage.setItem('userId', data.userId); // Store user ID
            window.location.href = 'user.html'; // Redirect to user page
        } else {
            console.error('Registration failed:', data.error);
        }
    })
    .catch((error) => {
        console.error('Registration error:', error);
    });
});


// Handle details form submission
document.getElementById('details-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var height = document.getElementById('height').value;
    var age = document.getElementById('age').value;
    var currentWeight = document.getElementById('current-weight').value;
    var desiredWeight = document.getElementById('desired-weight').value;
    fetch(`/user/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ height: height, age: age, current_weight: currentWeight, desired_weight: desiredWeight }),
    })
    .then(response => {
        if (response.ok) {
            console.log('User details updated');
        } else {
            console.error('Error:', response.statusText);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Get user details
fetch(`/user/${userId}`)
    .then(response => response.json())
    .then(data => console.log('User details:', data))
    .catch((error) => console.error('Error:', error));

// Get meal plans
fetch(`/user/${userId}/meal-plans`)
    .then(response => response.json())
    .then(data => console.log('Meal plans:', data))
    .catch((error) => console.error('Error:', error));

// Get exercise plans
fetch(`/user/${userId}/exercise-plans`)
    .then(response => response.json())
    .then(data => console.log('Exercise plans:', data))
    .catch((error) => console.error('Error:', error));

// Get progress
fetch(`/user/${userId}/progress`)
    .then(response => response.json())
    .then(data => console.log('Progress:', data))
    .catch((error) => console.error('Error:', error));

// Handle meal plan form submission
document.getElementById('meal-plan-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var meal = document.getElementById('meal').value;
    var dayOfWeek = document.getElementById('day-of-week').value;
    fetch(`/user/${userId}/meal-plan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meal: meal, day_of_week: dayOfWeek }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Meal plan updated');
        } else {
            console.error('Error:', response.statusText);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Handle exercise plan form submission
document.getElementById('exercise-plan-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var exercise = document.getElementById('exercise').value;
    var dayOfWeek = document.getElementById('day-of-week').value;
    fetch(`/user/${userId}/exercise-plan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exercise: exercise, day_of_week: dayOfWeek }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Exercise plan updated');
        } else {
            console.error('Error:', response.statusText);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

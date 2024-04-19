// Retrieve userID from localStorage after login
const userId = localStorage.getItem('userId');

// Redirect to login if no user ID is found and it's required
if (!userId && window.location.pathname.includes('user.html')) {
    console.error('No user ID found, redirecting to login');
    window.location.href = 'index.html'; // Ensure this redirects to your login page
}

// Function to handle login
function handleLogin(event) {
    event.preventDefault();
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;
    fetch('/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.userId) {
            console.log('User logged in:', data.userId);
            localStorage.setItem('userId', data.userId);
            window.location.href = 'user.html'; // Redirect to the user page after successful login
        } else {
            console.error('Login failed:', data.error);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
    });
}

// Function to handle registration
function handleRegistration(event) {
    event.preventDefault();
    var name = document.getElementById('register-name').value;
    var username = document.getElementById('register-username').value;
    var email = document.getElementById('register-email').value;
    var password = document.getElementById('register-password').value;
    fetch('/user/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: name, username: username, email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.userId) {
            console.log('User registered:', data.userId);
            localStorage.setItem('userId', data.userId);
            window.location.href = 'user.html'; // Redirect to the user page after successful registration
        } else {
            console.error('Registration failed:', data.error);
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
    });
    
}

// Assuming your user-specific page URL ends with 'user.html', adjust as necessary
if (userId && window.location.pathname.includes('user.html')) {
    // Handle details form submission
    var detailsForm = document.getElementById('details-form');
    if (detailsForm) {
        detailsForm.addEventListener('submit', function(event) {
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
                body: JSON.stringify({ height: height, age: age, current_weight: currentWeight, desired_weight: desiredWeight })
            })
            .then(response => {
                if (response.ok) {
                    console.log('User details updated');
                } else {
                    console.error('Error updating user details:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // Fetch user details and other data as previously detailed in your script
}


// Add event listeners if elements exist
var loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

var registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', handleRegistration);
}

// Event listeners for diet buttons
document.getElementById('allCarbDietButton').addEventListener('click', function() {
    fetchDietPlans('carb');
});

document.getElementById('allDessertDietButton').addEventListener('click', function() {
    fetchDietPlans('dessert');
});

function fetchDietPlans(dietType) {
    // Fetch meal plans based on the diet type
    fetch(`/user/${userId}/meal-plans?dietType=${dietType}`)
        .then(response => response.json())
        .then(mealPlans => {
            console.log(`${dietType} Meal plans:`, mealPlans);
            // Additional logic to display meal plans
        })
        .catch(error => console.error('Error fetching meal plans:', error));

    // Fetch exercise plans similarly if needed
}


// User-specific scripts should only run if userId exists and on appropriate pages
if (userId) {
    // Handle details form submission
    var detailsForm = document.getElementById('details-form');
    if (detailsForm) {
        detailsForm.addEventListener('submit', function(event) {
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
                body: JSON.stringify({ height: height, age: age, current_weight: currentWeight, desired_weight: desiredWeight })
            })
            .then(response => {
                if (response.ok) {
                    console.log('User details updated');
                } else {
                    console.error('Error updating user details:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // Fetch user details
    fetch(`/user/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log('User details:', data);
            // Populate form or display areas with user data here if necessary
        })
        .catch((error) => console.error('Error fetching user details:', error));

    // Fetch meal plans
    fetch(`/user/${userId}/meal-plans`)
        .then(response => response.json())
        .then(data => {
            console.log('Meal plans:', data);
            // Handle display or interaction with meal plan data here
        })
        .catch((error) => console.error('Error fetching meal plans:', error));

    // Fetch exercise plans
    fetch(`/user/${userId}/exercise-plans`)
        .then(response => response.json())
        .then(data => {
            console.log('Exercise plans:', data);
            // Handle display or interaction with exercise plan data here
        })
        .catch((error) => console.error('Error fetching exercise plans:', error));

    // Fetch progress reports
    fetch(`/user/${userId}/progress`)
        .then(response => response.json())
        .then(data => {
            console.log('Progress reports:', data);
            // Handle display or interaction with progress data here
        })
        .catch((error) => console.error('Error fetching progress:', error));
}



document.getElementById('carb-diet').addEventListener('click', function() {
    fetch('/meal-plans?type=carb')
        .then(response => response.json())
        .then(data => {
            // Handle the data here
            console.log(data);
        })
        .catch(error => {
            // Handle the error here
            console.error('Error:', error);
        });
});


document.getElementById('dessert-diet').addEventListener('click', function() {
    fetch('/meal-plans?type=dessert')
        .then(response => response.json())
        .then(data => {
            // Handle the data here
            console.log(data);
        })
        .catch(error => {
            // Handle the error here
            console.error('Error:', error);
        });
});


document.getElementById('logout').addEventListener('click', function() {
    // Clear the user ID from localStorage
    localStorage.removeItem('userId');

    // Redirect to the login page
    window.location.href = '/login';
});


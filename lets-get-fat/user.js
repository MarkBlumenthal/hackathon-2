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

  
  // Handle progress form submission
document.getElementById('progressForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const food = document.getElementById('food').value;
    const exercise = document.getElementById('exercise').value;
    const response = await fetch('/progress', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ food, exercise }),
    });
    if (response.ok) {
      alert('Progress updated successfully');
    } else {
      const data = await response.json();
      alert(data.message);
    }
  });

  
  // Meal plans
const mealPlans = {
    carb: [
      'Breakfast: Bagel with cream cheese',
      'Lunch: Pasta with alfredo sauce',
      'Dinner: Pizza with extra cheese',
    ],
    dessert: [
      'Breakfast: Pancakes with syrup and whipped cream',
      'Lunch: Chocolate chip muffin',
      'Dinner: Ice cream sundae',
    ],
  };
  
  // Exercise plans
  const exercisePlans = [
    'Channel surfing for 30 minutes',
    'Playing video games for 1 hour',
    '20 bites of fudge',
  ];
  
  // Call these functions when the user chooses a diet preference
  function displayMealPlan(dietPreference) {
    document.getElementById('mealPlan').textContent = mealPlans[dietPreference].join('\n');
  }
  
  function displayExercisePlan() {
    document.getElementById('exercisePlan').textContent = exercisePlans.join('\n');
  }

  
  // Handle diet preference change
document.getElementById('dietPreference').addEventListener('change', (event) => {
    const dietPreference = event.target.value;
    displayMealPlan(dietPreference);
    displayExercisePlan();
  });

  
  // Fetch and display meal plan
async function fetchMealPlan(username) {
    const response = await fetch('/mealplan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (response.ok) {
      document.getElementById('mealPlan').textContent = JSON.stringify(data);
    } else {
      alert(data.message);
    }
  }
  
  // Fetch and display exercise plan
  async function fetchExercisePlan(username) {
    const response = await fetch('/exerciseplan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (response.ok) {
      document.getElementById('exercisePlan').textContent = JSON.stringify(data);
    } else {
      alert(data.message);
    }
  }
  
  // Fetch and display progress
  async function fetchProgress(username) {
    const response = await fetch('/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (response.ok) {
      document.getElementById('progress').textContent = JSON.stringify(data);
    } else {
      alert(data.message);
    }
  }
  
  // Call these functions when the user logs in or when the page loads
  // You'll need to replace 'username' with the actual username
  fetchMealPlan('username');
  fetchExercisePlan('username');
  fetchProgress('username');
  
  
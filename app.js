let users = [];

// Load existing users from localStorage when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Load users from localStorage if they exist
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }

  // Redirect to login if no user is logged in and the current page is home.html
  if (
    window.location.pathname.includes("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === ""
  ) {
 
    const currentUser = localStorage.getItem("currentUser"); // if yes then it will return true or false
    if (!currentUser) {
      window.location.href = "./login.html";
      return;
    }
    updateHomePageUI();
  }

});

// Function to register a new user
function registerUser(event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("exampleInputEmail1").value.trim();
  const password = document.getElementById("exampleInputPassword1").value.trim();

  if (fullName === "" || email === "" || password === "") {
    alert("Please fill in all fields.");
    return false;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return false;
  }

  // Check if the email is already registered
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    alert("This email is already registered. Please log in.");
    return false;
  }

  // Register the new user
  const user = {
    fullName: fullName,
    email: email,
    password: password,
  };
  console.log(user);

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

//   alert("Registration successful! Redirecting to login page...");
  window.location.href = "./login.html";
  return false;
}

// Function to log in a user
function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("exampleInputEmail1").value.trim();
  const password = document.getElementById("exampleInputPassword1").value.trim();

  if (email === "" || password === "") {
    alert("Please fill in all fields.");
    return false;
  }

  // Check if the user exists in localStorage
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {  // if user is found then it will return true or false

    // Store the current user in localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    // alert("Login successful! Redirecting to homepage...");
    window.location.href = "./index.html";
  } else {
    alert("Invalid email or password. Please try again.");
    return false;
  }

  return false;
}

// Function to update the UI of the home page
function updateHomePageUI() {
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    const user = JSON.parse(currentUser);

    // Update the navbar with the user's name and email
    document.getElementById("userName").textContent = user.fullName;
    document.getElementById("userEmail").textContent = user.email;
  }
}

// Function to log out the user
function logoutUser() {
  localStorage.removeItem("currentUser");
  alert("You have been logged out.");
  window.location.href = "./login.html";
}

// Function to validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // regexr for regular expressions/ or 101 regex.com
  return emailRegex.test(email);
}

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // if (!currentUser) {
  //   window.location.href = "./login.html";
  //   return;
  // }

  // Display the current user's name and email
  document.getElementById("userName").textContent = currentUser.fullName;
  document.getElementById("userEmail").textContent = currentUser.email;

  // Initialize the To-Do List for the current user
  const todoList = JSON.parse(localStorage.getItem("todoList")) || {};
  if (!todoList[currentUser.email]) {
    todoList[currentUser.email] = [];
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }

  // Render the To-Do List
  renderTodoList(todoList[currentUser.email]);

  // Add event listener for the To-Do form
  document.getElementById("todoForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const todoInput = document.getElementById("todoInput");
    const newTask = todoInput.value.trim();
    if (newTask === "") return;

    // Add the new task to the user's To-Do List
    todoList[currentUser.email].push({ task: newTask, completed: false });
    localStorage.setItem("todoList", JSON.stringify(todoList));

    // Clear the input field and re-render the list
    todoInput.value = "";
    renderTodoList(todoList[currentUser.email]);
  });
});

// Function to render the To-Do List
function renderTodoList(tasks) {
  const todoListContainer = document.getElementById("todoList");
  todoListContainer.innerHTML = "";

  tasks.forEach((task) => {
    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";

    const taskText = document.createElement("span");
    taskText.textContent = task.task;
    if (task.completed) {
      taskText.style.textDecoration = "line-through";
    }

    todoItem.appendChild(taskText);
    todoListContainer.appendChild(todoItem);
  });
}

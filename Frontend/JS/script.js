let body = document.body;

const userData = localStorage.getItem("userData");
console.log(userData);

//change user name
if (userData) {

    const user = JSON.parse(userData);
    const name = user.name;
    const userNameElement = document.getElementById("userName");
    const userNameElement2 = document.getElementById("userName2");
    if (userNameElement&&userNameElement2) {
        userNameElement.textContent = name;
        userNameElement2.textContent = name;
    }


    //change password
    const imgElement = document.getElementById('logo');
    imgElement.src = user.picture;

    const imgElement2 = document.getElementById('logo2');
    imgElement2.src = user.picture;


    //controll acount btn

    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
    if (loginButton) loginButton.style.display = "none";
    if (registerButton) registerButton.style.display = "none";
  
    const logoutButton = document.createElement("a");
    logoutButton.textContent = "Logout";
    logoutButton.classList.add("profile-btn");
    logoutButton.id = "logoutButton";
      
    const loginRegisterButtons = document.getElementById("loginRegisterButtons");
    if (loginRegisterButtons) {
      loginRegisterButtons.appendChild(logoutButton);
    }
  }


const logoutButton = document.getElementById('logoutButton');
if(logoutButton) {
  logoutButton.addEventListener('click', function() {
    localStorage.removeItem('userData');
    window.location.href = "Login.html";
});
}


let Profile = document.querySelector(".header .up .Profile");
document.querySelector("#acount-btn").onclick = () => {
  Profile.classList.toggle("active");
  searchForm.classList.remove("active");
};
let searchForm = document.querySelector(".header .up .search-form");
document.querySelector("#search-btn").onclick = () => {
  searchForm.classList.toggle("active");
  Profile.classList.remove("active");
};

let sideBar = document.querySelector(".menu");
document.querySelector("#menu-btn").onclick = () => {
  sideBar.classList.toggle("active");
  body.classList.toggle("active");
};
document.querySelector(".menu .close-menu").onclick = () => {
  sideBar.classList.remove("active");
  body.classList.remove("active");
};

window.onscroll = () => {
  Profile.classList.remove("active");
  searchForm.classList.remove("active");

  if (window.innerWidth < 1200) {
    sideBar.classList.remove("active");
    body.classList.remove("active");
  }
};

//dark mode page
let mode = document.querySelector("#mode-btn");
let darkMode = localStorage.getItem("dark-mode");

const enabelDarkMode = () => {
  mode.classList.replace("fa-sun", "fa-moon");
  body.classList.add("dark");
  localStorage.setItem("dark-mode", "enabled");
};

const disableDarkMode = () => {
  mode.classList.replace("fa-moon", "fa-sun");
  body.classList.remove("dark");
  localStorage.setItem("dark-mode", "disabled");
};

if (darkMode === "enabled") {
  enabelDarkMode();
}

mode.onclick = (e) => {
  let darkMode = localStorage.getItem("dark-mode");
  if (darkMode === "disabled") {
    enabelDarkMode();
  } else {
    disableDarkMode();
  }
};




const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const resetForm = document.getElementById("resetForm");

//login page
if (loginForm) {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const data = { email: email, password: password };

      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            alert("Login failed");
            throw new Error("Network response was not ok");
          }
          alert("Login success");
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("userData", JSON.stringify(data));
          window.location.href = "Home.html";
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });
}

//registeration page
if (registerForm) {
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-pass").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }
      if (!isValidPassword(password)) {
        alert("Password should be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one digit.");
        return;
      }
      if (!isValidUsername(name)) {
        alert("Username should be at least 3 characters and cannot contain spaces or special characters.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password); 
      formData.append("profile", document.querySelector('input[type=file]').files[0]);
      
      fetch("http://localhost:3000/register", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            alert("Registration failed,the User already exists.");
            throw new Error("Network response was not ok");
          }          
          alert("successfully registered");
          window.location.href = "Login.html";
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });
}
function isValidEmail(email) {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidUsername(username) {
  // Username should be at least 3 characters and cannot contain spaces or special characters
  const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
  return usernameRegex.test(username);
}
function isValidPassword(password) {
  // Password should be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one digit
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
  return passwordRegex.test(password);
}



//forget password page
if(resetForm) {
  document.getElementById("resetForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newpassword").value;
    const confirmPassword = document.getElementById("confirmpassword").value;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    if (!isValidPassword(newPassword)) {
      alert("Password should be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one digit.");
      return;
    }

    // Construct data object
    const data = {
        email: email,
        password: newPassword
    };

    fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            alert("The user does not exist");
            throw new Error("Network response was not ok");
          }          
          alert("Password reset successfully.");
          window.location.href = "Login.html";
        })
        .catch((error) => {
          console.error("There was a problem with the reset password operation:", error);
        });
    });

}
function isValidPassword(newPassword) {
  // Password should be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one digit
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
  return passwordRegex.test(newPassword);
}

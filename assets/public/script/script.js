let userData = [];
const container = document.getElementById("card-container");
const loginForm = document.getElementById("loginForm");
const homePage = document.getElementById("main-homePage");
const userAvatar = document.getElementById("userAvatar");
const userEmail = document.getElementById("userEmail")?.value?.trim();

// Check login state on page load
LoadAccordingLoggedIn();

// Handle user login
function handleUserLogin(e) {
  e.preventDefault();

  try {
    if (!userEmail) {
      alert("Invalid user email!");
      return;
    }

    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("isUserLoggedIn", "true");

    loginForm?.classList?.add("d-none");
    homePage?.classList?.remove("d-none");

    LoadAccordingLoggedIn();
  } catch (error) {
    console.log(error);
  }
}

// Load app based on login state
function LoadAccordingLoggedIn() {
  const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");

  if (isUserLoggedIn === "true") {
    loginForm?.classList?.add("d-none");
    homePage?.classList?.remove("d-none");

    const userEmail = localStorage.getItem("userEmail");
    console.log(userAvatar.innerHTML);
    
    // userAvatar.innerText = userEmail?.slice(0, 2).toUpperCase();

    fetch("../json/userData.json")
      .then((res) => res.json())
      .then((data) => {
        userData = data;

        // Store each user in localStorage
        userData.forEach((user) => {
          localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
        });

        const match = window.location.pathname.match(/user-details\/(\d+)/);
        if (match) {
          const userId = match[1];
          showUserDetails(userId);
        } else {
          renderAllUsers();
        }
      })
      .catch((err) => console.error("Error loading JSON:", err));
  } else {
    loginForm.classList.remove("d-none");
    homePage.classList.add("d-none");
  }
}

// Render all user cards
function renderAllUsers() {
  if (!userData.length) {
    container.innerHTML = "<p>No users available.</p>";
    return;
  }

  container.innerHTML = userData
    .map((user) => {
      return `
        <div class="col-sm-12 col-md-6 col-lg-4 d-flex" onclick="RedirectTouserDetails(${user.id})">
          <div class="card my-4 w-100 shadow-sm">
            <div class="row object-fit-cover">
              <div class="col-4 d-flex align-items-center justify-content-center">
                <img src="${user.img}" class="card-img-top w-50" alt="${user.name}">
              </div>
              <div class="col-8 d-flex flex-column align-items-center justify-content-center">
                <h5 class="card-title">${user.name}</h5>
                <p class="card-text">${user.branch}</p>
              </div>
            </div>
            <div class="card-body text-center">
              <h6 class="card-subtitle mb-2 text-muted">${user.college}</h6>
              <p class="card-text">${user.emailid}</p>
            </div>
          </div>
        </div>`;
    })
    .join("");
}

// Redirect and update URL without reload
function RedirectTouserDetails(uId) {
  history.pushState({ userId: uId }, null, `user-details/${uId}`);
  showUserDetails(uId);
}

// Render a single user's details
function showUserDetails(uId) {
  const singleUserData = localStorage.getItem(`user_${uId}`);
  if (!singleUserData) {
    container.innerHTML = "<p>User not found.</p>";
    return;
  }

  const user = JSON.parse(singleUserData);

  container.innerHTML = `
     <div class="card shadow-lg my-5">
          <div class="row g-0">
            <div class="col-md-4 text-center p-4">
              <img src="${user.img}" alt="${
    user.name
  }" class="img-fluid rounded-circle mb-3" style="max-width: 200px;">
              <h4>${user.name}</h4>
              <p class="text-muted">${user.branch}</p>
              <span class="badge bg-primary">${user.gender}</span>
              <p class="mt-3"><strong>Age:</strong> ${user.age}</p>
              <p><strong>DOB:</strong> ${user.dob}</p>
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title mb-4">Personal Information</h5>
                <div class="row mb-2">
                  <div class="col-sm-4"><strong>Email:</strong></div>
                  <div class="col-sm-8">${user.emailid}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4"><strong>Mobile:</strong></div>
                  <div class="col-sm-8">${user.mobile_no}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4"><strong>Address:</strong></div>
                  <div class="col-sm-8">${user.address}, ${user.city}, ${
    user.state
  }, ${user.country} - ${user.pincode}</div>
                </div>

                <hr class="my-4">

                <h5 class="card-title mb-3">Education</h5>
                <div class="row mb-2">
                  <div class="col-sm-4"><strong>College:</strong></div>
                  <div class="col-sm-8">${user.college}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4"><strong>Branch:</strong></div>
                  <div class="col-sm-8">${user.branch}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4"><strong>Joining Date:</strong></div>
                  <div class="col-sm-8">${user.college_joining_date}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4"><strong>Passing Year:</strong></div>
                  <div class="col-sm-8">${user.passing_year}</div>
                </div>

                <hr class="my-4">

                <h5 class="card-title mb-3">Hobbies</h5>
                <p>${user.hobbies
                  .map(
                    (hobby) =>
                      `<span class="badge bg-secondary me-1">${hobby}</span>`
                  )
                  .join("")}</p>

                <div class="mt-4 text-end">
                  <a href="/" class="btn btn-outline-secondary">← Back to Home</a>
                </div>
              </div>
            </div>
          </div>
        </div>
`;
}

// Handle logout
function handleLogout() {
  localStorage.setItem("isUserLoggedIn", "false");
  localStorage.removeItem("userEmail");
  loginForm.classList.remove("d-none");
  homePage.classList.add("d-none");
}

let preview = document.getElementById("preview");
preview.addEventListener("click", () => {
  RedirectTouserDetails("16");
});

function openModal() {
  preview.disabled = true;
  let ModalTitle = document.getElementById("ModalTitle");
  ModalTitle.innerText = userEmail;

  let modal_body = document.getElementById("modal_body");

  modal_body.innerHTML = `
              <div class="d-flex align-items-center justify-content-center">
                      <button
                  type="button"
                  class=" bg-black text-light rounded-circle p-2 fw-bold"
                id="editProfileBtn"
                onclick="Editprofile()"
                >
                  <span id="">${userEmail.charAt(0).toUpperCase()}</span>
                </button>
              </div>
             
            </div>
            <div class="card-body text-center">
              <h6 class="card-text">${userEmail}</h6>
            </div>
          </div>



<form class="row g-3 d-none" id="modalform" onsubmit="handleFormSubmit(event)">
  <h4>User Profile Form</h4>

  <div class="col-md-6">
    <label for="name" class="form-label">Full Name</label>
    <input type="text" class="form-control" id="name" required>
  </div>

 
  <div class="col-md-6">
    <label for="emailid" class="form-label">Email</label>
    <input type="email" class="form-control" id="emailid" required>
  </div>

  <div class="col-md-6">
    <label for="mobile_no" class="form-label">Mobile Number</label>
    <input type="tel" class="form-control" id="mobile_no" required>
  </div>

  <div class="col-md-6">
    <label for="gender" class="form-label">Gender</label>
    <select class="form-select" id="gender" required>
      <option value="">Choose...</option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>
  </div>

  <div class="col-md-12">
    <label for="dob" class="form-label">Date of Birth</label>
    <input type="date" class="form-control" id="dob" required>
  </div>

  <div class="col-12">
  <label for="address" class="form-label">Address</label>
  <input type="text" class="form-control" id="address" required>
  </div>

  <div class="col-md-4">
    <label for="city" class="form-label">City</label>
    <input type="text" class="form-control" id="city" required>
  </div>

  <div class="col-md-4">
    <label for="state" class="form-label">State</label>
    <input type="text" class="form-control" id="state" required>
  </div>

  <div class="col-md-4">
    <label for="country" class="form-label">Country</label>
    <input type="text" class="form-control" id="country" required>
  </div>

  <div class="col-md-6">
    <label for="pincode" class="form-label">Pincode</label>
    <input type="text" class="form-control" id="pincode" required>
  </div>

  <div class="col-md-6">
    <label for="img" class="form-label">Profile Image URL</label>
    <input type="url" class="form-control" id="img" required>
  </div>

  <div class="col-md-6">
    <label for="college" class="form-label">College</label>
    <input type="text" class="form-control" id="college" required>
  </div>

  <div class="col-md-6">
  <label for="branch" class="form-label">Branch</label>
    <input type="text" class="form-control" id="branch" required>
  </div>
  
  <div class="col-12">
  <label for="college_joining_date" class="form-label">Joining Date</label>
    <input type="date" class="form-control" id="college_joining_date" required>
    </div>

    <div class="col-12">
    <label for="hobbies" class="form-label">Hobbies (comma-separated)</label>
    <input type="text" class="form-control" id="hobbies" placeholder="e.g. Reading, Coding, Music">
  </div>

    <div class="col-12 text-end">
    <button type="submit" class="btn btn-success">Save Profile</button>
  </div>

</form>

`;

  let userfromLocal = localStorage.getItem("user_16");

  if (userfromLocal) {
    let user = JSON.parse(userfromLocal);
    document.getElementById("name").value = user.name;
    document.getElementById("college").value = user.college;
    document.getElementById("img").value = user.img;
    document.getElementById("country").value = user.country;
    document.getElementById("state").value = user.state;
    document.getElementById("city").value = user.city;
    document.getElementById("pincode").value = user.pincode;
    document.getElementById("mobile_no").value = user.mobile_no;
    document.getElementById("address").value = user.address;
    document.getElementById("gender").value = user.gender;
    document.getElementById("emailid").value = user.emailid;
    document.getElementById("hobbies").value = user.hobbies.join(", ");
    document.getElementById("branch").value = user.branch;
    document.getElementById("dob").value = user.dob;
    document.getElementById("college_joining_date").value =
      user.college_joining_date;
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const dob = new Date(document.getElementById("dob").value);
  const joiningDate = new Date(
    document.getElementById("college_joining_date").value
  );
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const passingYear = joiningDate.getFullYear() + 4;

  const user = {
    id: userData.length + 1,
    name: document.getElementById("name").value.trim(),
    college: document.getElementById("college").value.trim(),
    img: document.getElementById("img").value.trim(),
    country: document.getElementById("country").value.trim(),
    state: document.getElementById("state").value.trim(),
    city: document.getElementById("city").value.trim(),
    pincode: document.getElementById("pincode").value.trim(),
    mobile_no: document.getElementById("mobile_no").value.trim(),
    address: document.getElementById("address").value.trim(),
    gender: document.getElementById("gender").value,
    emailid: document.getElementById("emailid").value.trim(),
    hobbies: document
      .getElementById("hobbies")
      .value.split(",")
      .map((hobby) => hobby.trim()) //remove blank hobies
      .filter(Boolean),
    branch: document.getElementById("branch").value.trim(),
    dob: document.getElementById("dob").value,
    college_joining_date: document.getElementById("college_joining_date").value,
    age: age,
    passing_year: passingYear,
  };

  localStorage.setItem(`user_16`, JSON.stringify(user));

  console.log("User saved:", user);

  alert("User profile saved successfully!");

  document.getElementById("preview").removeAttribute("disabled");

  // Clear form
  e.target.reset();
}

function Editprofile() {
  document.getElementById("modalform").classList.remove("d-none");
}

// Handle back/forward browser navigation
window.addEventListener("popstate", () => {
  const match = window.location.pathname.match(/user-details\/(\d+)/);
  if (match) {
    const userId = match[1];
    showUserDetails(userId);
  } else {
    renderAllUsers();
  }
});

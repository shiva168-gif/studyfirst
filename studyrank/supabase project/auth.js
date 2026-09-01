// js/auth.js
//
// Handles: signup, login, logout, and making sure every user
// has a row in the `profiles` table (which is where we track points).

// ---------- SIGNUP ----------
async function handleSignup(e) {
  e.preventDefault();

  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const errorBox = document.getElementById("signup-error");
  errorBox.textContent = "";

  if (!username || !email || !password) {
    errorBox.textContent = "Please fill in all fields.";
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username } // saved as user metadata, handy as a backup
    }
  });

  if (error) {
    errorBox.textContent = error.message;
    return;
  }

  // If Supabase gives us a session immediately, email confirmation is
  // OFF (recommended for hackathon demos) — so we create the profile
  // row right now and send the user straight into the app.
  if (data.session) {
    await createProfileIfNotExists(data.user.id, username);
    window.location.href = "feed.html";
  } else {
    alert("Account created! Please check your email to confirm, then log in.");
    window.location.href = "login.html";
  }
}

// ---------- LOGIN ----------
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorBox = document.getElementById("login-error");
  errorBox.textContent = "";

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    errorBox.textContent = error.message;
    return;
  }

  // Safety net: if this user somehow doesn't have a profile row yet
  // (e.g. they confirmed email after signing up), create one now.
  const fallbackUsername = data.user.user_metadata?.username || data.user.email.split("@")[0];
  await createProfileIfNotExists(data.user.id, fallbackUsername);

  window.location.href = "feed.html";
}

// ---------- CREATE PROFILE ROW ----------
// Every auth user needs a matching row in `profiles` (that's where
// username + points live). This checks first so we never duplicate it.
async function createProfileIfNotExists(userId, username) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      username: username,
      points: 0
    });
    if (error) console.error("Could not create profile:", error.message);
  }
}

// ---------- LOGOUT ----------
async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

// ---------- ROUTE PROTECTION ----------
// Call this at the top of any page that requires login (feed, profile,
// leaderboard, etc). It kicks the user back to login.html if they're
// not authenticated, and otherwise returns the session.
async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

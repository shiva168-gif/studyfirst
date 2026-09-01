// js/auth.js
// Handles signup, login, logout, and profile creation.

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
      data: { username }
    }
  });

  if (error) {
    errorBox.textContent = error.message;
    return;
  }

  if (data.session) {
    await createProfileIfNotExists(data.user.id, username);
    window.location.href = "feed.html";
  } else {
    alert("Account created! Please check your email to confirm, then log in.");
    window.location.href = "login.html";
  }
}

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

  const fallbackUsername = data.user.user_metadata?.username || data.user.email.split("@")[0];
  await createProfileIfNotExists(data.user.id, fallbackUsername);

  window.location.href = "feed.html";
}

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

    if (error) {
      console.error("Could not create profile:", error.message);
    }
  }
}

async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return null;
  }

  return session;
}

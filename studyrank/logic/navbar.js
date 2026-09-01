// js/navbar.js
//
// Renders the top navbar on every logged-in page. It pulls the
// current user's username + points from Supabase and drops the
// resulting HTML into <div id="navbar"></div>.
//
// Usage: put <div id="navbar"></div> at the top of your <body>,
// then call renderNavbar() from your page's script.

async function renderNavbar() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, points")
    .eq("id", session.user.id)
    .single();

  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  navbar.innerHTML = `
    <nav class="bg-white shadow px-6 py-4 flex flex-wrap gap-4 justify-between items-center">
      <a href="feed.html" class="text-xl font-bold text-indigo-600">StudyRank 🎓</a>
      <div class="flex items-center gap-4 text-sm">
        <a href="feed.html" class="text-gray-600 hover:text-indigo-600">Feed</a>
        <a href="leaderboard.html" class="text-gray-600 hover:text-indigo-600">Leaderboard</a>
        <a href="profile.html" class="text-gray-600 hover:text-indigo-600">Profile</a>
        <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
          ⭐ ${profile ? profile.points : 0} pts
        </span>
        <button onclick="handleLogout()" class="text-red-500 hover:text-red-700">Logout</button>
      </div>
    </nav>
  `;
}

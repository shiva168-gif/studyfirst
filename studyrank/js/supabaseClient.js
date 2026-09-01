// js/supabaseClient.js
//
// This file connects your website to your Supabase project.
// Every other JS file in this project uses the `supabase` object
// created here, so this script must be loaded FIRST (before auth.js,
// navbar.js, etc.) on every page.

// 1. Go to supabase.com -> your project -> Settings -> API
// 2. Copy "Project URL" and paste it below
// 3. Copy "anon public" key and paste it below
const SUPABASE_URL = "https://bbljlqaqidoyhxhvoath.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1iPUbm6d039vFlVj-7RxQA_TsSQGNRq";

// This creates one global `supabase` client that every page can use.
// (window.supabase here refers to the Supabase library loaded via CDN
// in the <head> of each HTML file - not to be confused with the
// client instance we're creating below.)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
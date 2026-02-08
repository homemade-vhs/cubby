// ============================================
// supabase.js - Supabase Connection
// ============================================

// Replace these with your actual values from Supabase dashboard
const SUPABASE_URL = 'https://pnudxqazvjjoedwbrtex.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XTnDhxmhJuXqKsQBTVDMQg_fXo4zL5t';

// Initialize the Supabase client
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// AUTH FUNCTIONS
// ============================================

async function signUp(email, password) {
    const { data, error } = await sb.auth.signUp({
        email: email,
        password: password
    });
    if (error) {
        console.error('Sign up error:', error.message);
        return null;
    }
    return data;
}

async function signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (error) {
        console.error('Sign in error:', error.message);
        return null;
    }
    return data;
}

async function signOut() {
    const { error } = await sb.auth.signOut();
    if (error) {
        console.error('Sign out error:', error.message);
    }
}

async function getCurrentUser() {
    const { data: { user } } = await sb.auth.getUser();
    return user;
}

// ============================================
// (Old test functions removed - sync.js handles all data operations)
// ============================================

// ============================================
// AUTH UI HANDLING
// ============================================

var authMode = 'signin'; // 'signin' or 'signup'

function toggleAuthMode() {
    authMode = authMode === 'signin' ? 'signup' : 'signin';

    var title = document.getElementById('auth-title');
    var submitBtn = document.getElementById('auth-submit-btn');
    var switchText = document.getElementById('auth-switch-text');
    var switchBtn = document.querySelector('.auth-switch-btn');
    var confirmGroup = document.getElementById('confirm-password-group');
    var errorEl = document.getElementById('auth-error');

    errorEl.textContent = '';

    if (authMode === 'signup') {
        title.textContent = 'Create account';
        submitBtn.textContent = 'Sign Up';
        switchText.textContent = 'Already have an account?';
        switchBtn.textContent = 'Sign In';
        confirmGroup.style.display = 'block';
    } else {
        title.textContent = 'Welcome back';
        submitBtn.textContent = 'Sign In';
        switchText.textContent = "Don't have an account?";
        switchBtn.textContent = 'Sign Up';
        confirmGroup.style.display = 'none';
    }
}

async function handleAuth(event) {
    event.preventDefault();

    var email = document.getElementById('auth-email').value;
    var password = document.getElementById('auth-password').value;
    var errorEl = document.getElementById('auth-error');
    var submitBtn = document.getElementById('auth-submit-btn');

    errorEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = authMode === 'signin' ? 'Signing in...' : 'Creating account...';

    if (authMode === 'signup') {
        var confirmPassword = document.getElementById('auth-confirm-password').value;
        if (password !== confirmPassword) {
            errorEl.textContent = 'Passwords do not match';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Up';
            return;
        }
        if (password.length < 6) {
            errorEl.textContent = 'Password must be at least 6 characters';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Up';
            return;
        }

        var result = await signUp(email, password);
        if (result) {
            // Check if email confirmation is required
            if (result.user && !result.session) {
                errorEl.style.color = '#5AE890';
                errorEl.textContent = 'Check your email to confirm your account!';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign Up';
            } else {
                showApp();
            }
        } else {
            errorEl.textContent = 'Error creating account. Try a different email.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Up';
        }
    } else {
        var result = await signIn(email, password);
        if (result) {
            showApp();
        } else {
            errorEl.textContent = 'Invalid email or password';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    }
}

async function showApp() {
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('home-screen').classList.add('active');

    // Update greeting with user's name
    await updateGreeting();

    // Try to load data from Supabase
    if (typeof loadFromSupabase === 'function') {
        var loaded = await loadFromSupabase();
        if (!loaded) {
            // No Supabase data — check if we should migrate localStorage data
            var user = await getCurrentUser();
            if (user && typeof migrateLocalDataToSupabase === 'function') {
                var localData = localStorage.getItem('cubby_data');
                if (localData) {
                    var parsed = null;
                    try { parsed = JSON.parse(localData); } catch (e) {}
                    if (parsed && parsed.rooms && parsed.rooms.length > 0) {
                        console.log('Found localStorage data, migrating to Supabase...');
                        var migrated = await migrateLocalDataToSupabase(user.id);
                        if (migrated) {
                            // Reload from Supabase with new UUIDs
                            await loadFromSupabase();
                        }
                    } else {
                        // No local data either — create fresh defaults
                        await initializeSupabaseDefaults(user.id);
                        await loadFromSupabase();
                    }
                } else {
                    // No local data — create fresh defaults
                    await initializeSupabaseDefaults(user.id);
                    await loadFromSupabase();
                }
            }
        }
    }

    if (typeof renderHome === 'function') {
        renderHome();
    }

    showNavBar();
    updateNavBar();
}

async function updateGreeting() {
    var user = await getCurrentUser();
    var greetingEl = document.getElementById('greeting-text');

    if (user && greetingEl) {
        // Get name from email (part before @)
        var name = user.email.split('@')[0];
        // Capitalize first letter
        name = name.charAt(0).toUpperCase() + name.slice(1);

        // Time-based greeting
        var hour = new Date().getHours();
        var timeGreeting;

        if (hour < 5) {
            timeGreeting = "You're up late";
        } else if (hour < 12) {
            timeGreeting = "Good morning";
        } else if (hour < 17) {
            timeGreeting = "Good afternoon";
        } else if (hour < 21) {
            timeGreeting = "Good evening";
        } else {
            timeGreeting = "Good night";
        }

        greetingEl.textContent = timeGreeting + ', ' + name + '!';

        // Update nav bar user name
        if (typeof updateNavUserName === 'function') {
            updateNavUserName(name);
        }
    }
}

async function handleSignOut() {
    await signOut();
    showAuth();
}

function showAuth() {
    document.getElementById('auth-screen').classList.add('active');
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('room-screen').classList.remove('active');
    document.getElementById('cubby-screen').classList.remove('active');
    document.getElementById('views-screen').classList.remove('active');
    hideNavBar();
}

// Check if user is already logged in on page load
async function checkAuthState() {
    var user = await getCurrentUser();
    if (user) {
        showApp();
    }
    // If no user, auth screen is already showing
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuthState);

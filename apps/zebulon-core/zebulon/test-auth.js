// Simple test to check if the session works in browser context
const testAuth = async () => {
  try {
    // Login first
  const baseUrl = process.env.API_URL || 'http://localhost:5001';
  const loginResponse = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Admin', password: 'Zed2025' }),
      credentials: 'include'
    });
    
    const loginData = await loginResponse.json();
    console.log('Login result:', loginData);
    
    // Wait a moment then check auth
    setTimeout(async () => {
  const authResponse = await fetch(`${baseUrl}/api/auth/user`, {
        credentials: 'include'
      });
      
      const authData = await authResponse.json();
      console.log('Auth check result:', authData);
    }, 500);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Auto-run when included
testAuth();

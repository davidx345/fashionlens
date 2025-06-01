// Auth Debug Helper - Run this in browser console to check authentication state
console.log("=== AUTHENTICATION DEBUG ===");

// Check localStorage tokens
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

console.log("Access Token:", accessToken ? "Present" : "Missing");
console.log("Refresh Token:", refreshToken ? "Present" : "Missing");

if (accessToken) {
  // Decode JWT to check expiration (basic check)
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    console.log("Token expires at:", new Date(exp).toISOString());
    console.log("Current time:", new Date(now).toISOString());
    console.log("Token expired:", now > exp);
  } catch (e) {
    console.log("Cannot decode token:", e);
  }
}

// Check if backend is accessible
console.log("=== BACKEND CONNECTION TEST ===");
fetch('/api/dashboard/analytics')
  .then(response => {
    console.log("Dashboard API Status:", response.status);
    if (response.status === 200) {
      console.log("✅ Backend is accessible and authentication works");
    } else if (response.status === 401) {
      console.log("❌ Authentication failed - need to login");
    } else {
      console.log("⚠️ Unexpected status:", response.status);
    }
    return response.text();
  })
  .then(data => {
    console.log("Response:", data.substring(0, 200) + "...");
  })
  .catch(error => {
    console.log("❌ Backend connection failed:", error);
  });

// Test analysis endpoint specifically
fetch('/api/analysis/history')
  .then(response => {
    console.log("Analysis API Status:", response.status);
    return response.text();
  })
  .then(data => {
    console.log("Analysis Response:", data.substring(0, 200) + "...");
  })
  .catch(error => {
    console.log("❌ Analysis API failed:", error);
  });

console.log("=== END DEBUG ===");

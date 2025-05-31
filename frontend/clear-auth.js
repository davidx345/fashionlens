// Clear authentication data to stop infinite refresh loops and fix API URL issues
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
sessionStorage.clear(); // Also clear session storage
console.log('Authentication data cleared. Please refresh the page, restart the frontend server, and login again.');
console.log('Make sure to restart the frontend server with: npm run dev');

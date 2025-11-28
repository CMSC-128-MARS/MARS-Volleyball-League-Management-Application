// Example: src/components/AuthTest.tsx 
// A simple component to test Zustand auth store functionality

import { useAuthStore } from '../stores/useAuthStore';

export default function AuthTest() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    setLoading 
  } = useAuthStore();

  const handleLogin = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      login("Mars Developer");
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2> Zustand Auth Test</h2>
      
      <div>
        <p><strong>User:</strong> {user || "Not logged in"}</p>
        <p><strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</p>
        <p><strong>Loading:</strong> {isLoading ? "Loading..." : "Ready"}</p>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        {!isAuthenticated ? (
          <button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        ) : (
          <button onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

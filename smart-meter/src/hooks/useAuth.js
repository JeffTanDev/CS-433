// Import the useContext hook from React
import { useContext } from 'react';

// Import the AuthContext from the AuthContext file
import { AuthContext } from "../contexts/AuthContext";

// Custom hook to retrieve the authentication context
function useAuth() {
  // Use the useContext hook to get the current authentication context
  const context = useContext(AuthContext);

  // Throw an error if the hook is not used within an AuthProvider
  if (!context) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }

  // Return the authentication context
  return context;
}

// Export the useAuth hook for use in other components
export { useAuth };

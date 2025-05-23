export const useAuth = () => {
  const token = localStorage.getItem("auth-token");
  return {
    isSignedIn: !!token,
    logout: () => {
      localStorage.removeItem("auth-token");
    }
  };
};
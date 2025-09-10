// Authentication utility functions
export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const logout = () => {
  removeToken();
  window.location.href = "/login";
};

// Validate token format (basic check)
export const isValidTokenFormat = (token) => {
  if (!token) return false;
  // JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
};

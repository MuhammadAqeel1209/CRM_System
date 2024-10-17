export const isAuthenticated = () => {
    const role = localStorage.getItem('userRole');
    return !!role; 
  };
  
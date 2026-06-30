import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists locally for persistent hackathon testing
    const cachedUser = localStorage.getItem('civic_user');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
    setLoading(false);
  }, []);

  const login = (role) => {
    const mockProfile = {
      uid: role === 'citizen' ? 'usr_citizen_77' : 'usr_officer_99',
      name: role === 'citizen' ? 'Jane Doe (Citizen)' : 'Officer Mandar (PMC)',
      email: `${role}@civicpulse.gov`,
      role: role,
      xp: role === 'citizen' ? 450 : 0,
      department: role === 'authority' ? 'PMC Road Asset Department' : null
    };
    setUser(mockProfile);
    localStorage.setItem('civic_user', JSON.stringify(mockProfile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civic_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
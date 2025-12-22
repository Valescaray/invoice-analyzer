import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  // Sync Firebase user with backend
  const syncUserWithBackend = async (firebaseUser) => {
    try {
      if (!firebaseUser) {
        setUserProfile(null);
        return;
      }

      // Get Firebase ID token
      const token = await firebaseUser.getIdToken();
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Check if user exists in backend, if not create
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, { timeout: 5000 });
        setUserProfile(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // User doesn't exist in backend, create them
          const createResponse = await axios.post(`${API_BASE_URL}/auth/signup`, {
            firebase_uid: firebaseUser.uid,
            email: firebaseUser.email,
            full_name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            photo_url: firebaseUser.photoURL,
          });
          setUserProfile(createResponse.data);
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error('Error syncing user with backend:', err);
      setError(err.message);
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await syncUserWithBackend(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Refresh user profile from backend
  const refreshUserProfile = async () => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      setUserProfile(response.data);
    } catch (err) {
      console.error('Error refreshing user profile:', err);
      setError(err.message);
    }
  };

  // Update user profile in backend
  const updateUserProfile = async (updates) => {
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      const token = await currentUser.getIdToken();
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, updates);
      setUserProfile(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    refreshUserProfile,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

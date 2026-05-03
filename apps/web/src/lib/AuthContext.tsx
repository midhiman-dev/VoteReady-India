import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getAuthInstance, getGoogleProviderInstance } from './firebase';
import { getFirebaseAuthStatus } from './firebaseAuthStatus';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | undefined>(undefined);
  const [provider, setProvider] = useState<GoogleAuthProvider | undefined>(undefined);
  const status = getFirebaseAuthStatus();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    async function init() {
      try {
        const authInstance = await getAuthInstance();
        const providerInstance = await getGoogleProviderInstance();
        
        setAuth(authInstance);
        setProvider(providerInstance);

        if (authInstance) {
          const { onAuthStateChanged } = await import('firebase/auth');
          unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing Auth:', error);
        setLoading(false);
      }
    }

    init();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signIn = async () => {
    if (!auth || !provider) {
      // Try one more time to get them if they aren't loaded yet
      const currentAuth = auth || await getAuthInstance();
      const currentProvider = provider || await getGoogleProviderInstance();
      
      if (!currentAuth || !currentProvider) {
        console.error('Firebase Auth not configured or failed to load');
        return;
      }
      
      const { signInWithPopup } = await import('firebase/auth');
      try {
        await signInWithPopup(currentAuth, currentProvider);
      } catch (error) {
        console.error('Sign-in error:', error);
        throw error;
      }
    } else {
      const { signInWithPopup } = await import('firebase/auth');
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error('Sign-in error:', error);
        throw error;
      }
    }
  };

  const handleSignOut = async () => {
    const currentAuth = auth || await getAuthInstance();
    if (!currentAuth) return;
    
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(currentAuth);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signIn, 
        signOut: handleSignOut, 
        isConfigured: status.configured 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

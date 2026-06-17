import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '../lib/firebase';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(isFirebaseEnabled);

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
      setAuthChecking(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecking(false);
    });

    return () => unsub();
  }, []);

  return { currentUser, authChecking };
}

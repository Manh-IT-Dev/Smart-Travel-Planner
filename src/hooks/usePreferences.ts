import { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import { isFirebaseEnabled, getUserData, saveUserData } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

export function usePreferences(currentUser: FirebaseUser | null) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'vi',
    theme: 'dark',
    preferredActivities: ['outdoor', 'cafe', 'sightseeing'],
    transportMode: 'walking',
    tempTolerance: 'temperate',
    uvTolerance: 'moderate',
    pushAlertsEnabled: true,
    historyNotifications: []
  });

  useEffect(() => {
    const loadPreferences = async () => {
      if (currentUser && isFirebaseEnabled) {
        const cloudData = await getUserData(currentUser.uid);
        if (cloudData && cloudData.preferences) {
          setPreferences(cloudData.preferences);
          localStorage.setItem('weather_ai_prefs', JSON.stringify(cloudData.preferences));
        }
      } else {
        const localPrefs = localStorage.getItem('weather_ai_prefs');
        if (localPrefs) {
          try {
            setPreferences(JSON.parse(localPrefs));
          } catch {}
        }
      }
    };
    loadPreferences();
  }, [currentUser]);

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem('weather_ai_prefs', JSON.stringify(updated));

    if (currentUser && isFirebaseEnabled) {
      await saveUserData(currentUser.uid, {
        preferences: updated,
        updatedAt: new Date().toISOString()
      });
    }
  };

  return { preferences, updatePreferences };
}

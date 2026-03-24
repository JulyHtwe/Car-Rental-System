// import { Redirect } from 'expo-router';

// export default function Index() {
//   // Let the (protected) layout handle the session check
//   return <Redirect href="/(tabs)" />;
// }

import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkFlow = async () => {
      // 1. Check onboarding
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');

      if (!hasOnboarded) {
        setRoute('/auth/onboarding');
        return;
      }

      // 2. Check session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setRoute('/(protected)');
      } else {
        setRoute('/auth/login');
      }
    };

    checkFlow();
  }, []);

  if (!route) return null;

  return <Redirect href={route} />;
}
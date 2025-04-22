
import { supabase } from '@/integrations/supabase/client';
import type { AuthResult } from './types';

export async function handleLogin(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function handleSignIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}

export async function handleSignUp(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signUp({ email, password });
  return { error };
}

export async function handleLogout() {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('redirectAfterLogin');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function handleGoogleAuth(mode: 'signin' | 'signup'): Promise<AuthResult> {
  try {
    console.log(`Starting Google ${mode} process...`);
    
    const origin = window.location.origin;
    const redirectTo = `${origin}/dashboard`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          prompt: mode === 'signin' ? 'select_account' : 'consent select_account',
          access_type: 'offline'
        }
      }
    });
    
    return { error };
  } catch (err: any) {
    console.error(`Unexpected error during Google auth:`, err);
    return { error: err };
  }
}

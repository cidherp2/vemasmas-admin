import type { Session, User } from "@supabase/supabase-js";

import { AppError, mapSupabaseError } from "@/lib/errors";
import { getAuthRedirectUrl, supabase } from "@/services/supabase";

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase)
    throw new AppError("CONFIGURATION", "Supabase no está configurado.");
  const { data, error } = await supabase.auth.getSession();
  if (error) throw mapSupabaseError(error);
  return data.session;
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<User> {
  if (!supabase)
    throw new AppError("CONFIGURATION", "Supabase no está configurado.");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    throw new AppError(
      "AUTHENTICATION",
      "El correo o la contraseña no son correctos.",
      { cause: error },
    );
  }
  return data.user;
}

export interface SignUpResult {
  user: User | null;
  session: Session | null;
}

export async function signUpWithPassword(
  email: string,
  password: string,
): Promise<SignUpResult> {
  if (!supabase)
    throw new AppError("CONFIGURATION", "Supabase no está configurado.");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: getAuthRedirectUrl() },
  });
  if (error) {
    throw mapSupabaseError(error);
  }
  return { user: data.user, session: data.session };
}

export async function signOut(): Promise<void> {
  if (!supabase)
    throw new AppError("CONFIGURATION", "Supabase no está configurado.");
  const { error } = await supabase.auth.signOut();
  if (error) throw mapSupabaseError(error);
}

export function subscribeToAuthChanges(
  onChange: (user: User | null) => void,
): () => void {
  if (!supabase) return () => undefined;
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    onChange(session?.user ?? null);
  });
  return () => data.subscription.unsubscribe();
}

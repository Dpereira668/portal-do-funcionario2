
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  userProfile: any | null;
  isAdmin: boolean;
  checkPermission: (requiredRole: string) => boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AdminUser } from '../types/admin';

interface AdminContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'momen_center_admin_auth';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check initial session
  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            // Fetch profile role from profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile && profile.role === 'admin') {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profile.full_name || 'مدير النظام',
                role: 'admin',
                avatarUrl: session.user.user_metadata?.avatar_url,
              });
            } else {
              // Customer or unprivileged user trying to access
              setUser(null);
            }
          }
        } else {
          // Check local session storage for development/standalone mode
          const localAuth = sessionStorage.getItem(ADMIN_STORAGE_KEY);
          if (localAuth && mounted) {
            try {
              const parsed = JSON.parse(localAuth) as AdminUser;
              if (parsed.role === 'admin') {
                setUser(parsed);
              }
            } catch {
              sessionStorage.removeItem(ADMIN_STORAGE_KEY);
            }
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkSession();

    // Listen for Supabase auth state changes if configured
    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'admin') {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.full_name || 'مدير النظام',
              role: 'admin',
            });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      });

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        });

        if (authError || !data.user) {
          const msg = authError?.message === 'Invalid login credentials'
            ? 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور'
            : (authError?.message || 'فشل تسجيل الدخول');
          setError(msg);
          return { success: false, error: msg };
        }

        // Verify admin role in profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          await supabase.auth.signOut();
          const forbiddenMsg = 'عذراً، هذا الحساب لا يمتلك صلاحيات مدير النظام.';
          setError(forbiddenMsg);
          return { success: false, error: forbiddenMsg };
        }

        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: profile.full_name || 'مدير مؤمن سنتر',
          role: 'admin',
        };

        setUser(adminUser);
        return { success: true };
      } else {
        // Standalone / Local development mode authentication
        // Standard admin credentials for store owner testing
        if (
          (email.trim().toLowerCase() === 'admin@momencenter.com' && pass === 'admin123456') ||
          (email.trim().toLowerCase() === 'owner@momen.sa' && pass === 'momen2026')
        ) {
          const adminUser: AdminUser = {
            id: 'admin-local-master',
            email: email.trim(),
            name: 'الأستاذ مؤمن (المالك)',
            role: 'admin',
          };
          setUser(adminUser);
          sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
          return { success: true };
        } else {
          const msg = 'بيانات الدخول غير صحيحة. للإدارة التجريبية: admin@momencenter.com / admin123456';
          setError(msg);
          return { success: false, error: msg };
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء تسجيل الدخول';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';

  return (
    <AdminContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

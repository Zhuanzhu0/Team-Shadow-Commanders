import { supabase } from "./supabase";

export type UserRole = "doctor" | "nurse" | "patient";

export interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface AuthError {
    message: string;
    status?: number;
}

/**
 * Map Supabase auth errors to user-friendly messages
 */
function mapAuthError(error: any): string {
    const message = error?.message || "";

    // Invalid credentials (wrong email or password)
    if (message.includes("Invalid login credentials")) {
        return "Invalid email or password";
    }

    // Email not confirmed
    if (message.includes("Email not confirmed")) {
        return "Please verify your email before signing in";
    }

    // Fallback to original message or generic error
    return message || "Sign in failed";
}

/**
 * Sign up a new user with email, password, and role
 */
export async function signUpUser(
    email: string,
    password: string,
    fullName: string,
    role: UserRole
): Promise<{ user: any; error: AuthError | null }> {
    try {
        // 1. Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        });

        if (authError) throw authError;

        // User profile is created automatically by database trigger

        return { user: authData.user, error: null };
    } catch (error: any) {
        console.error("Signup error:", error);
        return {
            user: null,
            error: {
                message: error?.message || "Signup failed",
                status: error?.status
            }
        };
    }
}

/**
 * Sign in user with email and password
 */
export async function signInUser(
    email: string,
    password: string
): Promise<{ user: any; session: any; error: AuthError | null }> {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
        console.error("Sign in error:", error);
        return {
            user: null,
            session: null,
            error: {
                message: mapAuthError(error),
                status: error?.status
            }
        };
    }
}

/**
 * Sign in user and verify profile exists
 */
export async function signInWithProfile(
    email: string,
    password: string
): Promise<{ user: any; session: any; profile: UserProfile | null; error: AuthError | null }> {
    try {
        // 1. Authenticate user
        const { user, session, error: signInError } = await signInUser(email, password);

        if (signInError) {
            return { user: null, session: null, profile: null, error: signInError };
        }

        if (!user) {
            return {
                user: null,
                session: null,
                profile: null,
                error: { message: "Authentication failed" }
            };
        }

        // 2. Verify profile exists in users table
        const { profile, error: profileError } = await getUserProfile(user.id);

        if (profileError || !profile) {
            // Profile missing - trigger might not have run or failed
            return {
                user,
                session,
                profile: null,
                error: {
                    message: "Profile not found. Please contact support."
                }
            };
        }

        return { user, session, profile, error: null };
    } catch (error: any) {
        console.error("Sign in with profile error:", error);
        return {
            user: null,
            session: null,
            profile: null,
            error: {
                message: error?.message || "Sign in failed",
                status: error?.status
            }
        };
    }
}

/**
 * Sign out the current user
 */
export async function signOutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error("Sign out error:", error);
        return { error };
    }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error) throw error;
        return { user, error: null };
    } catch (error) {
        console.error("Get current user error:", error);
        return { user: null, error };
    }
}

/**
 * Get user profile including role from users table
 */
export async function getUserProfile(userId: string): Promise<{
    profile: UserProfile | null;
    error: any;
}> {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw error;
        return { profile: data as UserProfile, error: null };
    } catch (error) {
        console.error("Get user profile error:", error);
        return { profile: null, error };
    }
}

/**
 * Get current user's role
 */
export async function getCurrentUserRole(): Promise<{
    role: UserRole | null;
    error: any;
}> {
    try {
        const { user, error: userError } = await getCurrentUser();
        if (userError || !user) {
            return { role: null, error: userError };
        }

        const { profile, error: profileError } = await getUserProfile(user.id);
        if (profileError || !profile) {
            return { role: null, error: profileError };
        }

        return { role: profile.role, error: null };
    } catch (error) {
        console.error("Get current user role error:", error);
        return { role: null, error };
    }
}

/**
 * Check if user has an active session
 */
export async function checkSession() {
    try {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        return { session, error: null };
    } catch (error) {
        console.error("Check session error:", error);
        return { session: null, error };
    }
}

/**
 * Verify user role matches expected role
 */
export async function verifyUserRole(expectedRole: UserRole): Promise<boolean> {
    try {
        const { role, error } = await getCurrentUserRole();
        if (error || !role) return false;
        return role === expectedRole;
    } catch (error) {
        console.error("Verify user role error:", error);
        return false;
    }
}

/**
 * Verify email with OTP token
 */
export async function verifyEmailOtp(
    email: string,
    token: string,
    type: any = 'signup'
): Promise<{ data: any; error: any | null }> {
    try {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type,
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        console.error("Verify OTP error:", error);
        return {
            data: null,
            error: {
                message: error?.message || "Verification failed",
                status: error?.status,
            },
        };
    }
}
/**
 * Verify email with OTP token
 */


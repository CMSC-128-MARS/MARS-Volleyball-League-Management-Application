import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  getCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth';

export interface SignInParams {
  username: string;
  password: string;
}

export interface SignUpParams {
  username: string;
  password: string;
  email: string;
}

export interface ConfirmSignUpParams {
  username: string;
  confirmationCode: string;
}

// Sign in user
export async function authSignIn({ username, password }: SignInParams) {
  try {
    const user = await signIn({ username, password });
    return { success: true, user };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error };
  }
}

// Sign out user
export async function authSignOut() {
  try {
    await signOut();
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
}

// Sign up new user
export async function authSignUp({ username, password, email }: SignUpParams) {
  try {
    const { userId } = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
    return { success: true, userId };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error };
  }
}

// Confirm sign up with code
export async function authConfirmSignUp({ username, confirmationCode }: ConfirmSignUpParams) {
  try {
    await confirmSignUp({ username, confirmationCode });
    return { success: true };
  } catch (error) {
    console.error('Error confirming sign up:', error);
    return { success: false, error };
  }
}

// Get current authenticated user
export async function getCurrentAuthUser() {
  try {
    const user = await getCurrentUser();
    return { success: true, user };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { success: false, error };
  }
}

// Get user session and tokens
export async function getUserSession() {
  try {
    const session = await fetchAuthSession();
    return { success: true, session };
  } catch (error) {
    console.error('Error getting session:', error);
    return { success: false, error };
  }
}

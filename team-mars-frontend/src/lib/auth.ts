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

// Minimal shape for the Amplify user object used by this app
type AmplifyAuthUser = {
  challengeName?: string;
  completeNewPassword?: (
    newPassword: string,
    requiredAttributes?: Record<string, string>,
  ) => Promise<unknown>;
  username?: string;
  getUsername?: () => string;
  [key: string]: unknown;
};

export type AuthSignInResult =
  | { success: true; user: AmplifyAuthUser; challenge?: 'NEW_PASSWORD_REQUIRED' }
  | { success: false; error: unknown };

// Sign in user
export async function authSignIn({ username, password }: SignInParams): Promise<AuthSignInResult> {
  try {
    const user = (await signIn({ username, password })) as unknown as AmplifyAuthUser;

    if (user?.challengeName === 'NEW_PASSWORD_REQUIRED') {
      return { success: true, user, challenge: 'NEW_PASSWORD_REQUIRED' };
    }

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
export async function getCurrentAuthUser(): Promise<
  { success: true; user: AmplifyAuthUser } | { success: false; error: unknown }
> {
  try {
    const user = (await getCurrentUser()) as unknown as AmplifyAuthUser;
    return { success: true, user };
  } catch (error) {
    // Amplify will throw when there is no authenticated user (this is expected
    // after sign-out). Avoid noisy error-level logging for that case.
    const msg = String(error ?? '');
    const name = (error as unknown as { name?: string })?.name;
    const unauthenticated =
      name === 'UserNotAuthenticatedException' ||
      name === 'UserUnauthenticatedException' ||
      /User needs to be authenticated/i.test(msg) ||
      /not authenticated/i.test(msg);

    if (unauthenticated) {
      // Debug-level message for expected unauthenticated state
      console.debug('No current authenticated user');
    } else {
      console.error('Error getting current user:', error);
    }
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

export async function authCompleteNewPassword({
  user,
  newPassword,
  requiredAttributes,
}: {
  user: AmplifyAuthUser;
  newPassword: string;
  requiredAttributes?: Record<string, string>;
}) {
  try {
    if (typeof user.completeNewPassword === 'function') {
      const result = await user.completeNewPassword(newPassword, requiredAttributes);
      return { success: true, result };
    }
    throw new Error('completeNewPassword method not found on user object.');
  } catch (error) {
    console.error('Error completing new password:', error);
    return { success: false, error };
  }
}

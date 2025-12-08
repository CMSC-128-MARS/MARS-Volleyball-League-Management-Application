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

    if ((user as any)?.challengeName === 'NEW_PASSWORD_REQUIRED') {
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
export async function getCurrentAuthUser() {
  try {
    const user = await getCurrentUser();
    return { success: true, user };
  } catch (error) {
    // Amplify will throw when there is no authenticated user (this is expected
    // after sign-out). Avoid noisy error-level logging for that case.
    const msg = String(error ?? '');
    const name = (error as any)?.name;
    const unauthenticated =
      name === 'UserNotAuthenticatedException' ||
      name === 'UserUnauthenticatedException' ||
      /User needs to be authenticated/i.test(msg) ||
      /not authenticated/i.test(msg);

    if (unauthenticated) {
      // Debug-level message for expected unauthenticated state
      // eslint-disable-next-line no-console
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
  user: any;
  newPassword: string;
  requiredAttributes?: { [key: string]: string };
}) {
  try {
    if (typeof user.completeNewPassword === 'function') {
      const result = await user.completeNewPassword(newPassword, requiredAttributes);
      return { success: true, result };
    } else {
      throw new Error('completeNewPassword method not found on user object.');
    }
  } catch (error) {
    console.error('Error completing new password:', error);
    return { success: false, error };
  }
}

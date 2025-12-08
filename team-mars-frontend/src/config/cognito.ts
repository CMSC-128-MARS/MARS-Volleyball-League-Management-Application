export const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID || undefined,
      loginWith: {
        username: true,
        email: false,
        phone: false,
      },
      oauth: {
        domain: import.meta.env.VITE_COGNITO_DOMAIN,
        scope: ['email', 'openid', 'profile'],
        redirectSignIn: import.meta.env.VITE_REDIRECT_SIGNIN_URL,
        redirectSignOut: import.meta.env.VITE_REDIRECT_SIGNOUT_URL,
        responseType: 'code',
      },
      region: import.meta.env.VITE_COGNITO_REGION,
    },
  },
};

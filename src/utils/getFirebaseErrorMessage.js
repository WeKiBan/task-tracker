export const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-credential':
      return 'The credentials you provided are invalid. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email address is already in use. Please use a different email or log in.';
    case 'auth/weak-password':
      return 'Your password is too weak. Please choose a stronger password.';
    // Add more cases as needed
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
};

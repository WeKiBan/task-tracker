import { useState } from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Github } from "lucide-react";
import { auth, hasFirebaseConfig } from "@/lib/firebase";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthGate() {
  const { userId } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M21.35 12.23c0-.72-.06-1.26-.19-1.82H12v3.47h5.38c-.11.86-.73 2.17-2.11 3.04l-.02.12 3.04 2.31.21.02c1.94-1.75 3.06-4.33 3.06-7.14Z"
        fill="#4285F4"
      />
      <path
        d="M12 21.5c2.63 0 4.83-.85 6.44-2.31l-3.23-2.45c-.86.59-2.02 1-3.21 1-2.58 0-4.76-1.69-5.54-4.03l-.12.01-3.16 2.4-.04.11A9.74 9.74 0 0 0 12 21.5Z"
        fill="#34A853"
      />
      <path
        d="M6.46 13.71A5.85 5.85 0 0 1 6.14 12c0-.6.12-1.18.3-1.71l-.01-.12-3.2-2.44-.1.04A9.46 9.46 0 0 0 2 12c0 1.53.37 2.97 1.03 4.23l3.43-2.52Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.26c1.5 0 2.5.63 3.07 1.15l2.24-2.13C16.82 3.75 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.86 5.77l3.3 2.52C7.24 7.95 9.42 6.26 12 6.26Z"
        fill="#EA4335"
      />
    </svg>
  );

  if (!hasFirebaseConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-lg border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold">Firebase setup required</h2>
          <p className="text-sm text-muted-foreground">Create a .env file in the project root and add:</p>
          <pre className="text-xs rounded bg-muted p-3 overflow-x-auto">{`VITE_FIREBASE_API_KEY=\nVITE_FIREBASE_AUTH_DOMAIN=\nVITE_FIREBASE_PROJECT_ID=\nVITE_FIREBASE_STORAGE_BUCKET=\nVITE_FIREBASE_MESSAGING_SENDER_ID=\nVITE_FIREBASE_APP_ID=`}</pre>
          <p className="text-xs text-muted-foreground">Then restart the dev server.</p>
        </div>
      </div>
    );
  }

  if (userId) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      return;
    }

    setError(null);
    setInfo(null);
    setIsBusy(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      return;
    }

    setError(null);
    setInfo(null);
    setIsBusy(true);

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      setError(message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleGithubSignIn = async () => {
    if (!auth) {
      return;
    }

    setError(null);
    setInfo(null);
    setIsBusy(true);

    try {
      await signInWithPopup(auth, new GithubAuthProvider());
    } catch (err) {
      const message = err instanceof Error ? err.message : "GitHub sign-in failed";
      setError(message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleResetPassword = async () => {
    if (!auth) {
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Enter your email first, then click reset password.");
      return;
    }

    setError(null);
    setInfo(null);
    setIsBusy(true);

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setInfo("Password reset email sent. Check your inbox.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send password reset email";
      setError(message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Sign in</h2>
          <p className="text-sm text-muted-foreground">Use your account to sync tasks with Firebase.</p>
        </div>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-xs text-destructive">{error}</p>}
        {info && <p className="text-xs text-emerald-600 dark:text-emerald-400">{info}</p>}

        <Button type="submit" className="w-full" disabled={isBusy}>
          {isBusy ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
        </Button>

        {!isRegister && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResetPassword}
            disabled={isBusy}
          >
            Reset password
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isBusy}
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGithubSignIn}
          disabled={isBusy}
        >
          <Github className="h-4 w-4" />
          Continue with GitHub
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister ? "Already have an account? Sign in" : "No account? Create one"}
        </Button>
      </form>
    </div>
  );
}

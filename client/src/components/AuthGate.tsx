import { useState } from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
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
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGithubSignIn}
          disabled={isBusy}
        >
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

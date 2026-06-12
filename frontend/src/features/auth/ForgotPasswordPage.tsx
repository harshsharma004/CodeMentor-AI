import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForgotPassword, getApiErrorMessage } from '@/hooks/useAuth';

export function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await forgotPassword.mutateAsync(email);
      setSent(true);
      if (result.resetToken) {
        setResetToken(result.resetToken);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-muted mb-6">
          If an account exists for {email}, we&apos;ve sent password reset instructions.
        </p>
        {resetToken && (
          <div className="rounded-lg bg-surface border border-slate-700 p-4 mb-6 text-left">
            <p className="text-sm text-muted mb-2">Dev mode reset token:</p>
            <Link
              to={`/reset-password?token=${resetToken}`}
              className="text-secondary text-sm break-all hover:underline"
            >
              Click here to reset password
            </Link>
          </div>
        )}
        <Link to="/login" className="text-secondary hover:underline text-sm">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Forgot password?</h1>
      <p className="text-muted mb-8">Enter your email and we&apos;ll send reset instructions</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Button type="submit" className="w-full" loading={forgotPassword.isPending}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <Link to="/login" className="text-secondary hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useResetPassword, getApiErrorMessage } from '@/hooks/useAuth';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const resetPassword = useResetPassword();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Invalid reset link');
      return;
    }
    try {
      await resetPassword.mutateAsync({ token, password });
      navigate('/login');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Reset password</h1>
      <p className="text-muted mb-8">Enter your new password below</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 6 characters"
          required
          minLength={6}
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          required
        />
        <Button type="submit" className="w-full" loading={resetPassword.isPending}>
          Reset Password
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

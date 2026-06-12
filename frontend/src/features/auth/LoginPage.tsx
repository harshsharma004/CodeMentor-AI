import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLogin, getApiErrorMessage } from '@/hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login.mutateAsync({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
      <p className="text-muted mb-8">Sign in to continue your coding journey</p>

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
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-secondary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={login.isPending}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-secondary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRegister, getApiErrorMessage } from '@/hooks/useAuth';

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register.mutateAsync({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
      <p className="text-muted mb-8">Start tracking your coding progress today</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
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
          placeholder="Min 6 characters"
          required
          minLength={6}
        />
        <Button type="submit" className="w-full" loading={register.isPending}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-secondary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

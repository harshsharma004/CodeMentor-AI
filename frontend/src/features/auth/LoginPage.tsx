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
    <div className="w-full">
      <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h1>
      <p className="text-slate-400 mb-8 font-light">Sign in to continue your interview prep.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-[12px] bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
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
        <div className="flex justify-end mt-2">
          <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            Forgot password?
          </Link>
        </div>
        <Button 
          type="submit" 
          className="w-full mt-6 bg-white text-black hover:bg-slate-200 font-bold rounded-[12px] py-6 shadow-none" 
          loading={login.isPending}
        >
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-white hover:text-indigo-300 font-semibold transition-colors">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}

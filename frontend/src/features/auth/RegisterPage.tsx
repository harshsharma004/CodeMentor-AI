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
    <div className="w-full">
      <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create an account</h1>
      <p className="text-slate-400 mb-8 font-light">Start mastering Data Structures and Algorithms today.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-[12px] bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
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
        <Button 
          type="submit" 
          className="w-full mt-6 bg-white text-black hover:bg-slate-200 font-bold rounded-[12px] py-6 shadow-none" 
          loading={register.isPending}
        >
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-white hover:text-indigo-300 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}

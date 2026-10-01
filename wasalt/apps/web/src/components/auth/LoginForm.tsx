import React, { useState } from 'react';
import { validateLogin } from '@wasalt/validation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Mail, Lock, ArrowRight, Sparkles, X } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  onForgotPassword: () => void;
  onSwitchToSignUp: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onCancel,
  onForgotPassword,
  onSwitchToSignUp,
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('kareem@wasalt.io');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateLogin({ email, password });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setAuthError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      onSuccess();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Invalid credentials. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 relative animate-scaleUp">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Sign In to Wasalt</h3>
            <p className="text-xs text-slate-500">Access your company workspaces</p>
          </div>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
                }`}
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-2"
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Don&apos;t have an account yet? </span>
          <button
            onClick={onSwitchToSignUp}
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            Start 14-day free trial
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { validateSignUp } from '@wasalt/validation';
import { Button } from '../common/Button';
import { ArrowRight, User, Mail, Lock, Briefcase } from 'lucide-react';

interface StepAdminAccountProps {
  initialData: {
    fullName: string;
    email: string;
    password: string;
    jobTitle?: string;
  };
  onNext: (data: { fullName: string; email: string; password: string; jobTitle?: string }) => void;
  onCancel: () => void;
}

export const StepAdminAccount: React.FC<StepAdminAccountProps> = ({
  initialData,
  onNext,
  onCancel,
}) => {
  const [fullName, setFullName] = useState(initialData.fullName);
  const [email, setEmail] = useState(initialData.email);
  const [password, setPassword] = useState(initialData.password);
  const [jobTitle, setJobTitle] = useState(initialData.jobTitle || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateSignUp({ fullName, email, password });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onNext({ fullName, email, password, jobTitle });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Create Your Master Admin Account</h3>
        <p className="text-xs text-slate-500">
          This single administrator identity allows you to manage or join multiple company
          workspaces.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Kareem Diyaa"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
              errors.fullName
                ? 'border-red-300 focus:ring-red-200'
                : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
            }`}
          />
        </div>
        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
      </div>

      {/* Work Email */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Work Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kareem@company.com"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? 'border-red-300 focus:ring-red-200'
                : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
            }`}
          />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title (Optional)</label>
        <div className="relative">
          <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="VP of Operations / Dispatch Lead"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
              errors.password
                ? 'border-red-300 focus:ring-red-200'
                : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
            }`}
          />
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
      </div>

      {/* Form Buttons */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" icon={<ArrowRight className="w-4 h-4" />}>
          Next: Company Setup
        </Button>
      </div>
    </form>
  );
};

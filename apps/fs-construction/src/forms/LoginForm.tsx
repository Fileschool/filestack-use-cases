'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, ILoginForm } from '@/schemas/auth.schema';
import { useAuthStore } from '@/store/authStore';
import { ShieldCheck, User, ArrowRight } from 'lucide-react';
import { UserRole } from '@/interfaces/user.interface';

interface ILoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: FC<ILoginFormProps> = ({ onSuccess }) => {
  const { setRole } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<ILoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'marcus.vance@apexcad.com',
      role: 'admin',
    },
  });

  const selectedRole = watch('role');

  const handleSelectRole = (role: UserRole) => {
    setValue('role', role);
    if (role === 'admin') {
      setValue('email', 'marcus.vance@apexcad.com');
    } else {
      setValue('email', 'jane.doe@horizondevelopments.com');
    }
  };

  const onSubmit = (data: ILoginForm) => {
    setRole(data.role);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left text-xs">
      <div>
        <label className="field-label">Select Demo Persona</label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSelectRole('admin')}
            className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
              selectedRole === 'admin'
                ? 'border-accent-500 bg-accent-50 text-accent-700 shadow-sm'
                : 'border-brand-200 bg-white text-brand-500 hover:bg-brand-50'
            }`}
          >
            <ShieldCheck className="h-6 w-6 mb-1 text-accent-500" />
            <span className="font-bold text-brand-950">Lead Architect</span>
            <span className="text-[10px] text-brand-400">Admin Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectRole('client')}
            className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
              selectedRole === 'client'
                ? 'border-accent-500 bg-accent-50 text-accent-700 shadow-sm'
                : 'border-brand-200 bg-white text-brand-500 hover:bg-brand-50'
            }`}
          >
            <User className="h-6 w-6 mb-1 text-blue-600" />
            <span className="font-bold text-brand-950">Client User</span>
            <span className="text-[10px] text-brand-400">Submit Quotes</span>
          </button>
        </div>
      </div>

      <div>
        <label className="field-label">Email Address</label>
        <input
          {...register('email')}
          type="email"
          className="input"
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full py-2.5"
      >
        Sign In Persona <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
};

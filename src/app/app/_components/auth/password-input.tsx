'use client';

import { useState, forwardRef } from 'react';
import { AuthInput } from './auth-input';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ label = 'Password', error, ...inputProps }, ref) {
    const [visible, setVisible] = useState(false);

    const toggle = () => setVisible((prev) => !prev);

    return (
      <AuthInput
        ref={ref}
        label={label}
        icon="lock"
        type={visible ? 'text' : 'password'}
        error={error}
        placeholder="••••••••"
        rightElement={
          <button
            type="button"
            onClick={toggle}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#bfc7d4] hover:text-[#dfe3e9] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {visible ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        }
        {...inputProps}
      />
    );
  },
);

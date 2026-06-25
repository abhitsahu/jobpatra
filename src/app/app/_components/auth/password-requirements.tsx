import { PASSWORD_RULES } from './password-rules';

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  if (!password) return null; // don't show until the user starts typing

  return (
    <ul
      className="space-y-1.5 mt-2"
      aria-label="Password requirements"
      aria-live="polite"
      aria-atomic="false"
    >
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li key={rule.id} className="flex items-center gap-2">
            {/* Icon */}
            <span
              className={[
                'material-symbols-outlined flex-shrink-0 transition-colors duration-300',
                met ? 'text-[#34a853]' : 'text-[#8a919e]',
              ].join(' ')}
              style={{
                fontSize: '16px',
                fontVariationSettings: met ? "'FILL' 1" : "'FILL' 0",
              }}
              aria-hidden="true"
            >
              {met ? 'check_circle' : 'radio_button_unchecked'}
            </span>

            {/* Label */}
            <span
              className={[
                'font-[Inter] text-[13px] transition-colors duration-300',
                met ? 'text-[#34a853]' : 'text-[#8a919e]',
              ].join(' ')}
            >
              {rule.label}
              {/* Screen-reader-only state */}
              <span className="sr-only">{met ? '— satisfied' : '— not satisfied'}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

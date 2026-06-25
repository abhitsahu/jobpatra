interface PasswordStrengthProps {
  password: string;
}

interface StrengthLevel {
  label: string;
  score: number;
  color: string;
  textColor: string;
}

function computeScore(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function getLevel(score: number): StrengthLevel {
  if (score <= 1)
    return { label: 'Weak', score: 1, color: 'bg-[#ef4444]', textColor: 'text-[#ef4444]' };
  if (score <= 3)
    return { label: 'Medium', score: 2, color: 'bg-[#f59e0b]', textColor: 'text-[#f59e0b]' };
  if (score <= 5)
    return { label: 'Strong', score: 3, color: 'bg-[#1a91f0]', textColor: 'text-[#1a91f0]' };
  return { label: 'Very Strong', score: 4, color: 'bg-[#34a853]', textColor: 'text-[#34a853]' };
}

const TOTAL_SEGMENTS = 4;

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null; // hide until typing starts

  const raw = computeScore(password);
  const level = getLevel(raw);

  return (
    <div className="mt-2 space-y-1.5" aria-label={`Password strength: ${level.label}`}>
      {/* Segment bar */}
      <div
        className="flex gap-1.5"
        role="meter"
        aria-valuenow={level.score}
        aria-valuemin={0}
        aria-valuemax={TOTAL_SEGMENTS}
      >
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className={[
              'h-1 flex-1 rounded-full transition-all duration-400',
              i < level.score ? level.color : 'bg-[#30353a]',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Label */}
      <p
        className={`font-[Inter] text-[12px] font-medium transition-colors duration-300 ${level.textColor}`}
      >
        {level.label}
      </p>
    </div>
  );
}

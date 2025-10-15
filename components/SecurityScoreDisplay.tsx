import React, { useEffect, useState } from 'react';

interface SecurityScoreDisplayProps {
  score: number;
}

const SecurityScoreDisplay: React.FC<SecurityScoreDisplayProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Animate the score number change
    const timeout = setTimeout(() => {
        setDisplayScore(score);
    }, 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const circumference = 2 * Math.PI * 55; // 2 * pi * radius
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor = score < 60 ? 'text-red-400' : score < 90 ? 'text-yellow-400' : 'text-green-400';
  const ringColor = score < 60 ? 'stroke-red-500' : score < 90 ? 'stroke-yellow-500' : 'stroke-green-500';

  return (
    <div className="relative w-48 h-48 flex-shrink-0">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="stroke-current text-gray-700"
          strokeWidth="10"
          fill="transparent"
          r="55"
          cx="60"
          cy="60"
        />
        <circle
          className={`stroke-current ${ringColor} transition-all duration-1000 ease-out`}
          strokeWidth="10"
          strokeLinecap="round"
          fill="transparent"
          r="55"
          cx="60"
          cy="60"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${scoreColor} transition-colors duration-500`}>
        <span className="text-5xl font-bold">{Math.round(displayScore)}%</span>
        <span className="text-sm font-semibold">Security Score</span>
      </div>
    </div>
  );
};

export default SecurityScoreDisplay;

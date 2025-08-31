
import React from 'react';

function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 80V20L50 35V95L20 80Z"
        fill="currentColor"
        className="opacity-70"
      />
      <path
        d="M50 5L80 20V80L50 65V5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default Logo;

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "h-16 w-16" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Maps Goal Planner logo"
    >
      <defs>
        <radialGradient id="logo-bg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#284C38" />
          <stop offset="58%" stopColor="#163326" />
          <stop offset="100%" stopColor="#071310" />
        </radialGradient>

        <linearGradient id="logo-gold" x1="42" y1="16" x2="180" y2="204">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="42%" stopColor="#D8AE52" />
          <stop offset="100%" stopColor="#8F681F" />
        </linearGradient>

        <linearGradient id="road-gold" x1="54" y1="110" x2="165" y2="165">
          <stop offset="0%" stopColor="#FFF0A3" />
          <stop offset="55%" stopColor="#D6A84A" />
          <stop offset="100%" stopColor="#9B7226" />
        </linearGradient>

        <filter id="logo-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="9"
            floodColor="#000000"
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      <g filter="url(#logo-shadow)">
        <path d="M110 6L121 43H99L110 6Z" fill="url(#logo-gold)" />
        <path d="M110 214L99 177H121L110 214Z" fill="url(#logo-gold)" />
        <path d="M6 110L43 99V121L6 110Z" fill="url(#logo-gold)" />
        <path d="M214 110L177 121V99L214 110Z" fill="url(#logo-gold)" />

        <circle
          cx="110"
          cy="110"
          r="83"
          fill="url(#logo-bg)"
          stroke="url(#logo-gold)"
          strokeWidth="10"
        />

        <circle
          cx="110"
          cy="110"
          r="67"
          stroke="#F3D783"
          strokeOpacity="0.35"
          strokeWidth="2"
        />

        <path
          d="M50 119L76 82L98 110L121 72L171 119H50Z"
          fill="#245640"
          opacity="0.62"
        />

        <path
          d="M76 82L88 105L98 110L121 72L136 105L171 119H50Z"
          fill="#376B50"
          opacity="0.35"
        />

        <path
          d="M55 163C78 143 96 138 124 138C101 132 78 126 68 118C88 111 119 111 156 107"
          stroke="url(#road-gold)"
          strokeWidth="17"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M55 163C78 143 96 138 124 138C101 132 78 126 68 118C88 111 119 111 156 107"
          stroke="#FFF2B7"
          strokeOpacity="0.35"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M110 53C94 53 81 66 81 82C81 105 110 134 110 134C110 134 139 105 139 82C139 66 126 53 110 53Z"
          fill="url(#logo-gold)"
        />

        <circle cx="110" cy="82" r="11" fill="#153324" />

        <circle
          cx="110"
          cy="110"
          r="83"
          stroke="#000000"
          strokeOpacity="0.28"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}
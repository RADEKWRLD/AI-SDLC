export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A1A1A] flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract SVG background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {/* Large gradient circle - top right */}
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FA5D29" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FA5D29" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="g2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FA5D29" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FA5D29" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="85%" cy="15%" r="280" fill="url(#g1)" />
          <circle cx="10%" cy="80%" r="200" fill="url(#g2)" />

          {/* Grid dots */}
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={60 + col * 80}
                cy={100 + row * 80}
                r="1.5"
                fill="#FA5D29"
                opacity={0.12 + ((row + col) % 3) * 0.06}
              />
            ))
          )}

          {/* Diagonal lines */}
          <line x1="70%" y1="0" x2="100%" y2="40%" stroke="#FA5D29" strokeOpacity="0.06" strokeWidth="1" />
          <line x1="75%" y1="0" x2="100%" y2="35%" stroke="#FA5D29" strokeOpacity="0.04" strokeWidth="1" />
          <line x1="0" y1="60%" x2="30%" y2="100%" stroke="#FA5D29" strokeOpacity="0.06" strokeWidth="1" />

          {/* Geometric ring */}
          <circle cx="75%" cy="65%" r="120" fill="none" stroke="#FA5D29" strokeOpacity="0.08" strokeWidth="1" />
          <circle cx="75%" cy="65%" r="80" fill="none" stroke="#FA5D29" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="8 6" />

          {/* Small accent shapes */}
          <rect x="15%" y="25%" width="24" height="24" rx="6" fill="none" stroke="#FA5D29" strokeOpacity="0.1" strokeWidth="1" transform="rotate(15, 100, 200)" />
          <polygon points="88,420 100,400 112,420" fill="#FA5D29" opacity="0.08" />
        </svg>

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">CycleMind</h1>
          <p className="text-sm text-[#666] mt-1">AI-Powered Software Design</p>
        </div>
        <div className="relative z-10">
          <p className="text-5xl font-extrabold text-white leading-tight tracking-tight">
            让 AI 重新定义<br />
            <span className="text-[#FA5D29]">软件设计流程</span>
          </p>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <p className="text-xs text-[#666]">&copy; 2026 CycleMind</p>
          <a href="https://github.com/RADEKWRLD" target="_blank" rel="noopener noreferrer" className="text-xs text-[#666] hover:text-[#FA5D29] transition-colors">RADEKWRLD</a>
        </div>
      </div>
      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--background)]">
        {children}
      </div>
    </div>
  );
}

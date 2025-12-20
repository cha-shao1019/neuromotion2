import React from 'react';

interface AiCoreIconProps extends React.SVGProps<SVGSVGElement> {
    isAnimating: boolean;
}

export const AiCoreIcon: React.FC<AiCoreIconProps> = ({ isAnimating, ...props }) => (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" {...props} className={`will-change-transform ${props.className}`}>
        <defs>
            <filter id="irisGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <linearGradient id="irisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4caaa2" />
                <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
        </defs>

        {/* 外圍精密刻度盤 - 使用較深灰色 */}
        <g className="animate-[spin_40s_linear_infinite] origin-center">
            <circle cx="120" cy="120" r="110" fill="none" stroke="rgba(76,170,162,0.15)" strokeWidth="1" />
            {[...Array(60)].map((_, i) => (
                <line 
                    key={i} 
                    x1="120" y1="10" x2="120" y2={i % 5 === 0 ? "20" : "15"} 
                    stroke={i % 5 === 0 ? "rgba(76,170,162,0.4)" : "rgba(76,170,162,0.2)"} 
                    strokeWidth="1" 
                    transform={`rotate(${i * 6} 120 120)`} 
                />
            ))}
        </g>

        {/* 中層旋轉數據環 */}
        <circle cx="120" cy="120" r="85" fill="none" stroke="url(#irisGrad)" strokeWidth="0.8" strokeDasharray="4 20" className="animate-[spin_20s_linear_infinite_reverse] opacity-50" />
        <circle cx="120" cy="120" r="75" fill="none" stroke="#4caaa2" strokeWidth="2.5" strokeDasharray="80 160" className="animate-[spin_8s_ease-in-out_infinite]" />

        {/* 數位虹膜核心 */}
        <g filter="url(#irisGlow)">
            <circle cx="120" cy="120" r="40" fill="none" stroke="url(#irisGrad)" strokeWidth="6" opacity="0.3" />
            <circle cx="120" cy="120" r="30" fill="none" stroke="url(#irisGrad)" strokeWidth="1.5" />
            
            {/* 視覺掃描針 */}
            <g className="animate-[spin_3s_linear_infinite] origin-center">
                <path d="M120 95 L120 105 M120 135 L120 145" stroke="#4caaa2" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="120" cy="120" r="6" fill="#4caaa2" />
            </g>

            {/* 閃爍數據點 */}
            {[...Array(8)].map((_, i) => (
                <circle 
                    key={i}
                    cx={120 + Math.cos(i * Math.PI / 4) * 55}
                    cy={120 + Math.sin(i * Math.PI / 4) * 55}
                    r="2.5"
                    fill="#4caaa2"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.4}s` }}
                />
            ))}
        </g>

        {/* 點擊光圈 */}
        <circle 
            cx="120" cy="120" r="20" fill="none" stroke="#4caaa2" strokeWidth="3" 
            className={isAnimating ? 'animate-radiance-burst' : 'opacity-0'}
        />
    </svg>
);
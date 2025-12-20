
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        {/* 背景圓角矩形：使用 currentColor 並設定低透明度，讓其適應各種背景色 */}
        <path 
            d="M20,0 C31.045695,0 40,8.954305 40,20 C40,31.045695 31.045695,40 20,40 C8.954305,40 0,31.045695 0,20 C0,8.954305 8.954305,0 20,0 Z" 
            fill="currentColor" 
            fillOpacity="0.15" 
        />
        {/* 主要線條：加粗至 3px，並確保圓角端點清晰 */}
        <path 
            d="M12 20 L18 14 M18 26 L12 20 L18 14 L28 20" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
    </svg>
);

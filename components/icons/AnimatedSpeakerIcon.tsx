import React from 'react';

interface AnimatedSpeakerIconProps extends React.SVGProps<SVGSVGElement> {
    isMuted: boolean;
}

export const AnimatedSpeakerIcon: React.FC<AnimatedSpeakerIconProps> = ({ isMuted, className, ...props }) => {
    const baseTransition = "transition-all duration-300 ease-in-out";

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...props}>
            {/* Speaker Body - Always visible */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />

            {/* Sound Waves - Visible when not muted */}
            <g className={`${baseTransition} ${!isMuted ? 'opacity-100' : 'opacity-0'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.463 8.288a5.25 5.25 0 0 1 0 7.424" className={`${baseTransition} delay-75`} />
            </g>
            
            {/* Mute Cross - Visible when muted */}
            <g transform="translate(18, 12)" className={`${baseTransition} ${isMuted ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-50'}`}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 -4.5 L -4.5 4.5" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M-4.5 -4.5 L 4.5 4.5" />
            </g>
        </svg>
    );
};

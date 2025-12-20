import React, { forwardRef } from 'react';

interface CssHamburgerProps {
    isOpen: boolean;
    onClick: () => void;
    className?: string;
}

export const CssHamburger = forwardRef<HTMLButtonElement, CssHamburgerProps>(({ isOpen, onClick, className = '' }, ref) => {
    return (
        <button
            ref={ref}
            onClick={onClick}
            className={`hamburger-css ${isOpen ? 'open' : ''} ${className}`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
        >
            <div className="hamburger-box">
                <div className="hamburger-inner"></div>
            </div>
        </button>
    );
});
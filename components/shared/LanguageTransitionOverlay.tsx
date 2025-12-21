
import React, { useEffect, useRef, useState } from 'react';

// Props remain the same
interface LanguageTransitionOverlayProps {
    duration?: number;
    onComplete: () => void;
}

// Particle interface
interface Particle {
    // position
    x: number;
    y: number;
    // velocity
    vx: number;
    vy: number;
    // target position for reforming
    targetX: number;
    targetY: number;
    // color
    color: string;
}

const PARTICLE_DENSITY = 0.6; 
const PARTICLE_SIZE = 1.5;
const GRAVITY = 0.08;
const EASING = 0.04;

// Word sets for the animation
const DISSOLVE_WORDS = ['Analysis', '分析', 'Movement', '數據', 'AI', '檢測', 'Capture'];
const REFORM_WORDS = ['NeuroMotion', 'Screening', '健康', 'Precision', '守護', 'Health'];

const LanguageTransitionOverlay: React.FC<LanguageTransitionOverlayProps> = ({ duration = 1800, onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    // FIX: Added initial value undefined to satisfy useRef argument requirement.
    const animationFrameId = useRef<number | undefined>(undefined);
    const [opacity, setOpacity] = useState(1);

    // Helper to generate particle coordinates from text
    const generateParticleCoords = (words: string[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): {x: number, y: number}[] => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const coords: {x: number, y: number}[] = [];
        
        let wordCount = 0;
        const maxWords = 15;

        // Try to fill the screen with words
        for (let i = 0; i < 200 && wordCount < maxWords; i++) {
            const word = words[Math.floor(Math.random() * words.length)];
            ctx.font = `bold ${Math.random() * 40 + 20}px 'Noto Sans TC', sans-serif`;
            const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
            const y = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
            
            ctx.fillStyle = `rgba(76, 170, 162, ${Math.random() * 0.5 + 0.5})`; // brand-teal
            ctx.fillText(word, x, y);
            wordCount++;
        }
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const step = Math.ceil(1 / PARTICLE_DENSITY);

        // Sample pixels to create particles
        for (let y = 0; y < canvas.height; y += step) {
            for (let x = 0; x < canvas.width; x += step) {
                const alphaIndex = (y * canvas.width + x) * 4 + 3;
                if (imageData.data[alphaIndex] > 128) {
                    coords.push({ x, y });
                }
            }
        }
        return coords;
    };


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Use willReadFrequently for performance optimization
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // --- Setup ---
        const sourceCoords = generateParticleCoords(DISSOLVE_WORDS, canvas, ctx);
        const targetCoords = generateParticleCoords(REFORM_WORDS, canvas, ctx);
        
        // shuffle target for a nice effect
        targetCoords.sort(() => Math.random() - 0.5);

        particlesRef.current = sourceCoords.map((coord, index) => {
            const target = targetCoords[index] || { x: Math.random() * canvas.width, y: canvas.height + 20 }; // fall off screen if no target
            return {
                x: coord.x,
                y: coord.y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                targetX: target.x,
                targetY: target.y,
                color: `rgba(76, 170, 162, ${Math.random() * 0.5 + 0.3})`,
            };
        });

        let startTime: number | null = null;
        const phase1Duration = duration * 0.4;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const inPhase1 = elapsed < phase1Duration;

            particlesRef.current.forEach(p => {
                if (inPhase1) {
                    // Phase 1: Dissolve with physics
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += GRAVITY;
                } else {
                    // Phase 2: Reform by moving towards target
                    p.x += (p.targetX - p.x) * EASING;
                    p.y += (p.targetY - p.y) * EASING;
                }

                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, PARTICLE_SIZE, PARTICLE_SIZE);
            });
            
            if (elapsed < duration) {
                animationFrameId.current = requestAnimationFrame(animate);
            }
        };

        // --- Execution ---
        animationFrameId.current = requestAnimationFrame(animate);
        
        // Fade out at the end
        const fadeOutTimer = setTimeout(() => {
            setOpacity(0);
        }, duration - 400);

        const completeTimer = setTimeout(onComplete, duration);

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            clearTimeout(fadeOutTimer);
            clearTimeout(completeTimer);
        };
    }, [duration, onComplete]);


    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999,
                backgroundColor: '#030712',
                transition: `opacity 400ms ease-out`,
                opacity: opacity,
                pointerEvents: opacity > 0 ? 'auto' : 'none', // Block interaction during transition
            }}
        >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default LanguageTransitionOverlay;

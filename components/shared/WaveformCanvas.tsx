
import React, { useRef, useEffect } from 'react';

interface WaveformCanvasProps {
    data: number[];
    width: number;
    height: number;
}

const WaveformCanvas: React.FC<WaveformCanvasProps> = ({ data, width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, width, height);
        
        ctx.strokeStyle = '#374151'; // dark:bg-slate-700
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(width, height);
        ctx.stroke();

        ctx.strokeStyle = '#4caaa2'; // brand-teal-500
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.beginPath();

        const step = width / (data.length > 1 ? data.length - 1 : 1);
        const maxVal = Math.max(...data, 0.4); 

        data.forEach((point, i) => {
            const x = i * step;
            const y = height - (point / maxVal) * height * 0.9; 
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

    }, [data, width, height]);

    return <canvas ref={canvasRef} width={width} height={height} className="w-full h-full" />;
};

export default WaveformCanvas;

import { MotorTestMetric } from '../types';

type TapState = 'OPEN' | 'CLOSING' | 'CLOSED' | 'OPENING';

interface TapCycle {
    peakAmplitude: number;
    durationMs: number;
}

export class BradykinesiaAnalyzer {
    private state: TapState = 'OPEN';
    private tapCycles: TapCycle[] = [];
    private currentCyclePeak: number = 0;
    private lastTapTimestamp: number = 0;

    private readonly CLOSE_THRESHOLD = 0.3;
    private readonly OPEN_THRESHOLD = 0.6;

    addDistance(distance: number, timestamp: number): void {
        if (distance > this.currentCyclePeak) {
            this.currentCyclePeak = distance;
        }

        switch (this.state) {
            case 'OPEN':
                if (distance < this.OPEN_THRESHOLD * 0.8) this.state = 'CLOSING';
                break;
            case 'CLOSING':
                if (distance < this.CLOSE_THRESHOLD) {
                    this.state = 'CLOSED';
                    if (this.lastTapTimestamp > 0 && this.currentCyclePeak > 0) {
                        this.tapCycles.push({
                            peakAmplitude: this.currentCyclePeak,
                            durationMs: timestamp - this.lastTapTimestamp,
                        });
                    }
                    this.lastTapTimestamp = timestamp;
                    this.currentCyclePeak = distance; 
                }
                break;
            case 'CLOSED':
                if (distance > this.CLOSE_THRESHOLD * 1.2) this.state = 'OPENING';
                break;
            case 'OPENING':
                if (distance > this.OPEN_THRESHOLD) this.state = 'OPEN';
                break;
        }
    }

    getMetrics(): MotorTestMetric | null {
        // FIX: Remove 'as any' cast as `tapCount` is now a valid property of `MotorTestMetric`.
        if (this.tapCycles.length < 5) return { 
            speed: 'normal', consistency: 'consistent', amplitude: 'normal', fatigue: 'none', 
            tapCount: this.tapCycles.length 
        };
        
        const durations = this.tapCycles.map(c => c.durationMs);
        const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        const freqHz = 1000 / avgDuration;

        let speed: 'normal' | 'slow' | 'fast' = 'normal';
        if (freqHz < 2.5) speed = 'slow';
        else if (freqHz > 6) speed = 'fast';

        const variance = durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / avgDuration;
        
        let consistency: 'consistent' | 'inconsistent' | 'hesitant' = 'consistent';
        let hesitationCount = durations.filter(d => d > avgDuration * 2.0).length;
        if (hesitationCount > 1) consistency = 'hesitant';
        else if (cv > 0.25) consistency = 'inconsistent';

        const thirdLen = Math.floor(this.tapCycles.length / 3);
        const firstThirdAmp = this.tapCycles.slice(0, thirdLen).reduce((s, c) => s + c.peakAmplitude, 0) / thirdLen;
        const lastThirdAmp = this.tapCycles.slice(-thirdLen).reduce((s, c) => s + c.peakAmplitude, 0) / thirdLen;
        
        let decrement = 0;
        if (firstThirdAmp > 0) {
            decrement = ((firstThirdAmp - lastThirdAmp) / firstThirdAmp) * 100;
        }

        let amplitude: 'normal' | 'decreasing' | 'variable' = 'normal';
        if (decrement > 15) amplitude = 'decreasing';
        
        return {
            speed,
            consistency,
            amplitude,
            fatigue: decrement > 15 ? 'present' : 'none',
            tremorFrequency: parseFloat(freqHz.toFixed(1)),
            amplitudeDecrement: parseFloat(decrement.toFixed(1)),
            rhythmVariability: parseFloat(cv.toFixed(2)),
            hesitationCount,
            tapCount: this.tapCycles.length,
        };
    }

    reset(): void {
        this.state = 'OPEN';
        this.tapCycles = [];
        this.currentCyclePeak = 0;
        this.lastTapTimestamp = 0;
    }
}
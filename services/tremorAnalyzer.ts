
import FFT from 'fft.js';
import { MotorTestMetric } from '../types';

class SimpleLowPassFilter {
    private lastValue: number = 0;
    private isFirst: boolean = true;
    constructor(private alpha: number) {}

    filter(value: number): number {
        if (this.isFirst) {
            this.lastValue = value;
            this.isFirst = false;
            return value;
        }
        const result = this.alpha * value + (1 - this.alpha) * this.lastValue;
        this.lastValue = result;
        return result;
    }

    reset(): void {
        this.isFirst = true;
        this.lastValue = 0;
    }
}

export class TremorAnalyzer {
    private buffer: number[] = [];
    private filter: SimpleLowPassFilter;
    private readonly BUFFER_SIZE = 128; // Power of 2 for FFT
    private readonly SAMPLING_RATE_HZ = 30; // A more realistic sampling rate from camera

    constructor() {
        this.filter = new SimpleLowPassFilter(0.4);
    }

    addDataPoint(y: number): void {
        const filteredY = this.filter.filter(y);
        this.buffer.push(filteredY);
        if (this.buffer.length > this.BUFFER_SIZE) {
            this.buffer.shift();
        }
    }

    analyze(): MotorTestMetric {
        if (this.buffer.length < this.BUFFER_SIZE) {
            return { speed: 'normal', consistency: 'consistent', amplitude: 'normal', fatigue: 'none', tremorFrequency: 0, tremorAmplitude: 0 };
        }

        const fft = new FFT(this.BUFFER_SIZE);
        const complexSpectrum = fft.createComplexArray();
        fft.realTransform(complexSpectrum, this.buffer);
        const magnitudeSpectrum = new Float32Array(this.BUFFER_SIZE / 2);
        
        for (let i = 0; i < this.BUFFER_SIZE / 2; i++) {
            const real = complexSpectrum[i * 2];
            const imag = complexSpectrum[i * 2 + 1];
            magnitudeSpectrum[i] = Math.sqrt(real * real + imag * imag);
        }

        const hzPerBin = this.SAMPLING_RATE_HZ / this.BUFFER_SIZE;
        const startIndex = Math.floor(4 / hzPerBin);
        const endIndex = Math.ceil(6 / hzPerBin);
        
        let maxPeak = 0;
        let dominantFreqIndex = -1;

        for (let i = 1; i < magnitudeSpectrum.length; i++) { // Start from 1 to ignore DC offset
            if (magnitudeSpectrum[i] > maxPeak) {
                maxPeak = magnitudeSpectrum[i];
                dominantFreqIndex = i;
            }
        }
        
        const dominantFrequency = dominantFreqIndex * hzPerBin;

        let isTremorInRange = dominantFrequency >= 4 && dominantFrequency <= 6;
        
        const tremorAmplitude = Math.sqrt(this.buffer.reduce((s, v) => s + v*v, 0) / this.buffer.length);

        return {
            speed: 'normal',
            consistency: 'consistent',
            amplitude: isTremorInRange ? 'variable' : 'normal',
            fatigue: 'none',
            tremorFrequency: parseFloat(dominantFrequency.toFixed(1)),
            tremorAmplitude: parseFloat(tremorAmplitude.toFixed(2)),
        };
    }

    reset(): void {
        this.buffer = [];
        this.filter.reset();
    }
}

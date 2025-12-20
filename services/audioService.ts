
class AudioService {
    private audioContext: AudioContext | null = null;
    private isUnlocked: boolean = false;
    private isMuted: boolean = false;
    private sounds: { [key: string]: AudioBuffer } = {};
    
    async init() {
        if (this.audioContext || typeof window === 'undefined') return;
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            await this.preloadSounds();
        } catch (e) {
            console.error("Web Audio API is not supported.", e);
        }
    }

    async unlockAudio() {
        if (!this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            try { await this.audioContext.resume(); } catch (e) {}
        }
        this.isUnlocked = true;
    }

    setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    private async preloadSounds() {
        if (!this.audioContext) return;
        const soundFiles: { [key: string]: string } = {
            click: 'https://cdn.pixabay.com/audio/2022/03/15/audio_28d0073280.mp3',
            transition: 'https://cdn.pixabay.com/audio/2022/11/17/audio_82c29520b2.mp3',
            start: 'https://cdn.pixabay.com/audio/2022/05/23/audio_a062a4a7ce.mp3',
            success: 'https://cdn.pixabay.com/audio/2022/10/13/audio_73138092b3.mp3',
        };
        for (const key in soundFiles) {
            try {
                const response = await fetch(soundFiles[key]);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.sounds[key] = audioBuffer;
            } catch (e) {}
        }
    }

    private play(soundKey: string, volume: number = 0.5) {
        if (!this.audioContext || !this.isUnlocked || !this.sounds[soundKey] || this.isMuted) return;
        const source = this.audioContext.createBufferSource();
        source.buffer = this.sounds[soundKey];
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start(0);
    }
    
    playClick() { this.play('click', 0.4); }
    playTransition() { this.play('transition', 0.4); }
    playTestStart() { this.play('start', 0.5); }
    playSuccess() { this.play('success', 0.5); }
}

const audioService = new AudioService();
export default audioService;

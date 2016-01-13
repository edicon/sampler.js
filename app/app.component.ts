import { Component, OnInit } from 'angular2/core';


@Component({
    selector: 'my-app',
    template: `
        <div><button (click)='playSample()' [disabled]='loadingSample'>play</button></div>
        <div>
            <label for='playbackRate'>Playback rate: </label>
            <input type='range' min='0.01' max='5.0' step='0.01' [(ngModel)]='playbackRate' id='playbackRate'>
        </div>
        <div>
            <label for='gain'>Volume: </label>
            <input type='range' min='0' max='1.0' step='0.1' [(ngModel)]='gain' id='gain'>
        </div>
    `
})
export class AppComponent implements OnInit {
    private audioContext: AudioContext;
    private loadingSample: boolean = false;
    private audioBuffer: AudioBuffer;
    private playbackRate: number = 1.0;
    private gain: number = 1.0;

    ngOnInit() {
        this.audioContext = new AudioContext();

        this.loadingSample = true;
        this.fetchSample()
            .then((audioBuffer) => {
                this.loadingSample = false;
                this.audioBuffer = audioBuffer;
            })
            .catch((error) => {
                throw error;
            });
    }

    fetchSample() {
        return fetch('samples/snare.wav')
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                return new Promise((resolve, reject) => {
                    this.audioContext.decodeAudioData(buffer, resolve, reject);
                });
            });
    }

    playSample() {
        let bufferSource = this.audioContext.createBufferSource();
        bufferSource.buffer = this.audioBuffer;
        bufferSource.playbackRate.value = this.playbackRate;

        let gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.gain;

        bufferSource.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        bufferSource.start(0);
    }

    onClick() {
        this.playSample();
    }
}

import { Component, OnInit } from 'angular2/core';


@Component({
    selector: 'my-app',
    template: `
        <div><button (click)="onClick()" [disabled]="loadingSample">play</button></div>
        <div><input type="range" min="0.01" max="5.0" step="0.01" [(ngModel)]="playbackRate"></div>

    `
})
export class AppComponent implements OnInit {
    private audioContext: AudioContext;
    private loadingSample: boolean = false;
    private audioBuffer: AudioBuffer;
    private playbackRate: number = 1.0;

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
        bufferSource.connect(this.audioContext.destination);
        bufferSource.start(0);
    }

    onClick() {
        this.playSample();
    }
}

import { Component, OnInit } from 'angular2/core';


@Component({
    selector: 'my-app',
    template: `<button (click)="onClick()" [disabled]="loadingSample">play</button>`
})
export class AppComponent implements OnInit {
    private audioContext: AudioContext;
    private loadingSample: boolean = false;
    private audioBuffer: AudioBuffer;

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
        bufferSource.connect(this.audioContext.destination);
        bufferSource.start(0);
    }

    onClick() {
        this.playSample();
    }
}

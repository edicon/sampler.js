import { Component, OnInit } from 'angular2/core';
import { PadBank } from './pad-bank.component';
import { PadBankService } from './pad-bank.service';
import { MIDIInputSelector } from './midi-input-selector.component';
import { MIDIService } from './midi.service';
import { AudioService } from './audio.service';


@Component({
    selector: 'sampler-app',
    template: `
        <midi-input-selector></midi-input-selector>
        <pad-bank></pad-bank>
    `,
    styles: [`
        body {
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `],
    directives: [PadBank, MIDIInputSelector],
    providers: [MIDIService, AudioService, PadBankService]
})
export class AppComponent implements OnInit {
    private audioContext: AudioContext;
    private loadingSample: boolean = false;
    private audioBuffer: AudioBuffer;
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

    playSample(noteNumber?: number, velocity?: number) {
        console.log(noteNumber);
        let bufferSource = this.audioContext.createBufferSource();
        bufferSource.buffer = this.audioBuffer;

        if (noteNumber) {
            bufferSource.playbackRate.value = Math.pow(noteNumber / 60, 2);
        }

        let gainNode = this.audioContext.createGain();

        if (velocity) {
            gainNode.gain.value = (velocity / 127) * this.gain;
        } else {
            gainNode.gain.value = this.gain;
        }

        bufferSource.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        bufferSource.start(0);
    }



    setupMIDIInput(midiInputIndex) {
    }

    handleMIDIMessage(midiEvent) {
    }

    onClick() {
        this.playSample();
    }
}

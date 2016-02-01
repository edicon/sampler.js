import { Component, OnInit } from 'angular2/core';


@Component({
    selector: 'my-app',
    template: `
        <div>
            <button (click)='onClick()' [disabled]='loadingSample'>play</button>
        </div>
        <div>
            <label for='gain'>Volume: </label>
            <input type='range' min='0' max='1.0' step='0.1' [(ngModel)]='gain' id='gain'>
        </div>
        <div>
            <label for='midiInputsList'>MIDI input: </label>
            <select id='midiInputsList' (change)='onChangeMIDIInput($event)' [(ngModel)]='selectedMIDIInputIndex'>
                <option value="-1">No input</option>
                <option *ngFor='#input of midiInputs; #inputIndex = index' [value]="inputIndex">{{ input.name }}</option>
            </select>
        </div>
    `
})
export class AppComponent implements OnInit {
    private audioContext: AudioContext;
    private loadingSample: boolean = false;
    private audioBuffer: AudioBuffer;
    private gain: number = 1.0;

    private midiInputs = [];
    private selectedMIDIInputIndex = -1;
    private selectedMIDIInput = null;

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

        this.initializeMIDI();
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

    initializeMIDI() {
        window.navigator.requestMIDIAccess()
            .then((midi) => {
                midi.inputs.forEach((input) => this.midiInputs.push(input));
            });
    }

    onChangeMIDIInput(event) {
        // selected midi index should change automatically because ngmodel
        this.setupMIDIInput(parseInt(event.target.value, 10));
    }

    setupMIDIInput(midiInputIndex) {
        if (this.selectedMIDIInput) {
            this.selectedMIDIInput.onmidimessage = null;
        }

        if (midiInputIndex === -1) {
            return;
        }

        this.selectedMIDIInput = this.midiInputs[midiInputIndex];
        this.selectedMIDIInput.onmidimessage = this.handleMIDIMessage.bind(this);
    }

    handleMIDIMessage(midiEvent) {
        let midiCommand = midiEvent.data[0] >> 4;

        if (midiCommand === 9) {
            let noteNumber = midiEvent.data[1];
            let velocity = midiEvent.data[2];
            this.playSample(noteNumber, velocity);
        }
    }

    onClick() {
        this.playSample();
    }
}

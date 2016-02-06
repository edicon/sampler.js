import { Injectable } from 'angular2/core';
import { PadBankService } from './pad-bank.service';
import { Constants } from './constants';


@Injectable()
export class MIDIService {
    private selectedInput = null;

    public midiInputs = [];
    public selectedInputIndex = -1;

    private noteOnHandlers = [];
    private noteOffHandlers = [];

    constructor(private padBankService: PadBankService) {
        window.navigator.requestMIDIAccess()
            .then((midi) => {
                midi.inputs.forEach((input) => this.midiInputs.push(input));
            });
    }

    setMIDIInput(index) {
        this.selectedInputIndex = index;

        if (this.selectedInput) {
            this.selectedInput.onmidimessage = null;
        }

        if (this.selectedInputIndex === -1) {
            return;
        }

        this.selectedInput = this.midiInputs[this.selectedInputIndex];
        this.selectedInput.onmidimessage = this.handleMIDIMessage.bind(this);
    }

    registerNoteOnHandler(handler, instance) {
        this.noteOnHandlers.push(handler.bind(instance));
    }

    registerNoteOffHandler(handler, instance) {
        this.noteOffHandlers.push(handler.bind(instance));
    }

    handleMIDIMessage(message) {
        let midiCommand = message.data[0] >> 4;
        let noteNumber = message.data[1];
        let note = Constants.NOTE_MAP[noteNumber];
        let velocity = message.data[2];

        if (midiCommand === 8 || (midiCommand === 9 && velocity === 0)) {
            this.noteOffHandlers.forEach((handler) => handler(note));
        } else if (midiCommand === 9) {
            this.padBankService.triggerNote(note, velocity);
            this.noteOnHandlers.forEach((handler) => handler(note, velocity));
        }
    }
}

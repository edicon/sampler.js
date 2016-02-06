import { Component, OnInit } from 'angular2/core';
import { MIDIService } from './midi.service';


@Component({
    selector: 'midi-input-selector',
    template: `
        <label for="midiInputsList">MIDI input: </label>
        <select id="midiInputsList" (change)="onChangeMIDIInput($event)" [(ngModel)]="selectedInputIndex">
            <option value="-1">No input</option>
            <option *ngFor="#input of midiService.midiInputs; #inputIndex = index" [value]="inputIndex">{{ input.name }}</option>
        </select>
    `
})
export class MIDIInputSelector implements OnInit {
    private selectedInputIndex = -1;

    constructor(private midiService: MIDIService) { }

    ngOnInit() {
        this.selectedInputIndex = this.midiService.selectedInputIndex;
    }

    onChangeMIDIInput(event) {
        this.midiService.setMIDIInput(parseInt(event.target.value, 10));
    }
}

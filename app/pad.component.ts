import { Component, OnInit, ElementRef } from 'angular2/core';
import { PadBankService } from './pad-bank.service';
import { MIDIService } from './midi.service';


@Component({
    selector: 'pad',
    properties: ['note'],
    template: `
            <div class="pad" (mousedown)="triggerSample()" (mouseup)="deactivate()" [class.pad__active]="active">
                 <label>{{ note }}</label>
                 <label *ngIf="sample">{{ sample }}</label>
                 <div class="btn" (click)="chooseSample()">map</div>
            </div>

            <input type="file" hidden>
    `,
    styles: [`
        .pad {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 10rem;
            min-width: 10rem;
            max-height: 10rem;
            max-width: 10rem;
            margin-right: 1rem;
            margin-top: 1rem;
            background-color: silver;
        }

        .pad label {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .btn {
            background-color: yellow;
            border: solid 1px gray;
            padding: 0.1rem;
            font-size: 0.76rem;
            flex-grow: 0;
            margin-left: auto;
            cursor: pointer;
        }

        .pad__active {
            background-color: yellow;
        }

        .hidden {
            display: none;
        }
    `]
})
export class Pad implements OnInit {
    private note: string;
    private sample: string;
    private active: boolean = false;
    private fileInput: HTMLElement;

    constructor(private padBankService: PadBankService,
                private midiService: MIDIService,
                private elementRef: ElementRef) { }

    ngOnInit() {
        this.midiService.registerNoteOnHandler((note) => note === this.note? this.active = true : 0, this);
        this.midiService.registerNoteOffHandler((note) => note === this.note? this.active = false : 0, this);

        this.fileInput = this.elementRef.nativeElement.querySelector('input');
        this.fileInput.addEventListener('change', this.mapSample.bind(this));
    }

    private chooseSample() {
        this.fileInput.click();
    }

    private mapSample(event) {
        this.sample = event.target.files[0].name;
        let reader = new FileReader();
        reader.addEventListener('loadend', () => {
            this.padBankService.mapNote(this.note, reader.result);
        });
        reader.readAsArrayBuffer(event.target.files[0]);
    }

    private activate() {
        this.active = true;
    }

    private deactivate() {
        this.active = false;
    }

    private triggerSample() {
        this.activate();
        this.padBankService.triggerNote(this.note, 127);
    }
}

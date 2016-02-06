import { Component } from 'angular2/core';
import { Pad } from './pad.component';
import { Constants } from './constants';


@Component({
    selector: 'pad-bank',
    template: `
        <div class="bank">
            <pad *ngFor="#note of notes" [note]="note"></pad>
        </div>
    `,
    styles: [`
        .bank {
            display: flex;
            flex-wrap: wrap;
            max-width: 48rem;
            margin-bottom: 1rem;
        }
    `],
    directives: [Pad]
})
export class PadBank {
    private notes: string[];

    constructor() {
        this.notes = Object.keys(Constants.NOTE_MAP).map((key) => Constants.NOTE_MAP[key]);
    }
}

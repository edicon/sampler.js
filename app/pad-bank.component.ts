import { Component } from 'angular2/core';
import { Pad } from './pad.component';
import { ConstantsService } from './constants.service';


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

    constructor(private constantsService: ConstantsService) {
        this.notes = Array.from(this.constantsService.NOTE_MAP.values());
    }
}

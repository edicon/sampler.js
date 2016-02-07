import { Component } from 'angular2/core';

import { PadBank } from './pad-bank.component';
import { MIDIInputSelector } from './midi-input-selector.component';

import { PadBankService } from './pad-bank.service';
import { MIDIService } from './midi.service';
import { AudioService } from './audio.service';
import { ConstantsService } from './constants.service';


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
    providers: [MIDIService, AudioService, PadBankService, ConstantsService]
})
export class AppComponent { }

import { Injectable } from 'angular2/core';


@Injectable()
export class ConstantsService {
    public NOTE_MAP;

    constructor() {
        this.NOTE_MAP = new Map([
            [48, 'C4'],
            [49, 'C4#'],
            [50, 'D4'],
            [51, 'D4#'],
            [44, 'G3#'],
            [45, 'A3'],
            [46, 'A3#'],
            [47, 'B3']
        ]);
    }
}

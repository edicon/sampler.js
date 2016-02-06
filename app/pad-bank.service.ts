import { Injectable } from 'angular2/core';
import { AudioService } from './audio.service';


@Injectable()
export class PadBankService {
    private noteMap = {};

    constructor(private audioService: AudioService) { }

    triggerNote(note: string, velocity: number) {
        if (this.noteMap[note]) {
            this.audioService.playSound(this.noteMap[note], velocity/127);
        }
    }

    mapNote(note: string, sample: ArrayBuffer) {
        this.audioService.ctx.decodeAudioData(sample, (audioBuffer) => {
            this.noteMap[note] = audioBuffer;
        });
    }
}

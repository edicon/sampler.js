import { Injectable } from 'angular2/core';


@Injectable()
export class AudioService {
    public ctx;

    constructor() {
        this.ctx = new AudioContext();
    }

    playSound(buffer, gain) {
        let bufferSource = this.ctx.createBufferSource();
        bufferSource.buffer = buffer;

        let gainNode = this.ctx.createGain();
        gainNode.gain.value = gain;

        bufferSource.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        bufferSource.start();
    }
}

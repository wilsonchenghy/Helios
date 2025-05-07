import { Howl } from 'howler';

class AudioControl {
  constructor() {
    this.cacheMap = {};
    this.listenerMap = {};
  }

  start({ id, src, startTime, time, engine }) {
    let item;
    const format = src.startsWith('blob:') ? ['mp3'] : null; // Specify format if it's a blob URL

    if (this.cacheMap[id]) {
      item = this.cacheMap[id].howl;
      item.rate(engine.getPlayRate());
      item.seek((time - startTime) % item.duration());
      item.play();
    } else {
      item = new Howl({ src, format, loop: true, autoplay: true }); // Use src directly without array
      this.cacheMap[id] = { howl: item, src: src };

      item.on('load', () => {
        item.rate(engine.getPlayRate());
        item.seek((time - startTime) % item.duration());
        item.play();
      });
    }

    // Accessing the src value from the cacheMap
    console.log('Playing src:', this.cacheMap[id].src);

    // !!! ISSUE Seems timeListener is never called? But it is included in the example code by the documentation
    const timeListener = ({ time }) => {
      item.seek(time);
    };
    const rateListener = ({ rate }) => {
      item.rate(rate);
    };
    this.listenerMap[id] = { time: timeListener, rate: rateListener };
    engine.on('afterSetTime', timeListener);
    engine.on('afterSetPlayRate', rateListener);
  }

  stop({ id, engine }) {
    if (this.cacheMap[id]) {
      const item = this.cacheMap[id].howl; // Access the 'howl' property
      item.stop(); // Call stop on the 'howl' property
      const { time, rate } = this.listenerMap[id] || {};
      if (time) engine.off('afterSetTime', time);
      if (rate) engine.off('afterSetPlayRate', rate);
      delete this.listenerMap[id];
    }
  }
  
}

export default new AudioControl();

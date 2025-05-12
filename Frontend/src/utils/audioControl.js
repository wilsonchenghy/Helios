import { Howl } from 'howler';

class AudioControl {
  constructor() {
    this.cacheMap = {};
    this.listenerMap = {};
  }

  start({ id, src, startTime, time, engine }) {
    let item;
    
    // Determine format based on URL or filename extension
    let format;
    if (src.startsWith('blob:')) {
      format = ['mp3'];
    } else if (src.endsWith('.mp3')) {
      format = ['mp3'];
    } else if (src.endsWith('.wav')) {
      format = ['wav'];
    } else if (src.endsWith('.ogg')) {
      format = ['ogg'];
    } else {
      // Default to mp3 for Jamendo and other remote sources
      format = ['mp3'];
    }

    console.log('Starting audio playback with source:', src);

    if (this.cacheMap[id]) {
      item = this.cacheMap[id].howl;
      item.rate(engine.getPlayRate());
      item.seek((time - startTime) % item.duration());
      item.play();
    } else {
      // Create new Howl with improved options
      item = new Howl({ 
        src: [src], 
        format: format, 
        loop: true, 
        autoplay: true,
        html5: true, // Use HTML5 Audio for better compatibility with remote sources
        xhrWithCredentials: false // Disable credentials for CORS requests
      });
      
      this.cacheMap[id] = { howl: item, src: src };

      // Debug loading state
      item.on('loaderror', (id, error) => {
        console.error('Error loading audio:', error);
      });

      item.on('load', () => {
        console.log('Audio loaded successfully:', src);
        item.rate(engine.getPlayRate());
        item.seek((time - startTime) % item.duration());
        item.play();
      });
      
      // Attempt to play even if load event hasn't fired yet
      setTimeout(() => {
        if (!item.playing() && item.state() === 'loaded') {
          console.log('Retrying play after timeout');
          item.play();
        }
      }, 1000);
    }

    const timeListener = ({ time }) => {
      item.seek((time - startTime) % item.duration());
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
      const item = this.cacheMap[id].howl;
      item.stop();
      const { time, rate } = this.listenerMap[id] || {};
      if (time) engine.off('afterSetTime', time);
      if (rate) engine.off('afterSetPlayRate', rate);
      delete this.listenerMap[id];
    }
  }
}

export default new AudioControl();

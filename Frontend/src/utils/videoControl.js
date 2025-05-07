// !!! ISSUE Later on see if we want to use React Player for displaying the video instead of just using the HTML video element

class VideoControl {
  constructor() {
    this.cacheMap = {};
    this.listenerMap = {};
  }

  // 'enter' can be called first before 'start' so the displaying of the video will be done in 'enter'
  enter({ id, src }) {
    let video;
    if (this.cacheMap[id]) {
      video = this.cacheMap[id].video;
    } else {
      const ground = document.getElementById('video-previewer-element');
      video = document.createElement('video');
      video.src = src;
      video.loop = true;
      video.autoplay = false;
      video.width = 500;
      video.height = 500;
      this.cacheMap[id] = { video, src };

      ground.appendChild(video);
    }
  }

  start({ id, src, startTime, time, engine }) {
    let video;
    if (this.cacheMap[id]) {
      video = this.cacheMap[id].video;
      video.currentTime = (time - startTime) % video.duration;  // For when timeline cursor's position is changed, the video will immediately skip to the time the crusor is at
      video.play();
    } else {
      const ground = document.getElementById('video-previewer-element');
      video = document.createElement('video');
      video.src = src;
      video.loop = true;
      video.autoplay = true;
      video.width = 500;
      video.height = 500;
      this.cacheMap[id] = { video, src };

      ground.appendChild(video);

      video.addEventListener('loadedmetadata', () => {
        video.currentTime = (time - startTime) % video.duration;
        video.play();
      });
    }

    console.log('Playing src:', this.cacheMap[id].src);

    // !!! ISSUE Seems timeListener is never called? But it is included in the example code by the documentation
    const timeListener = ({ time }) => {
      video.currentTime = time;
    };

    const rateListener = ({ rate }) => {
      video.playbackRate = rate;
    };

    this.listenerMap[id] = { time: timeListener, rate: rateListener };
    engine.on('afterSetTime', timeListener);
    engine.on('afterSetPlayRate', rateListener);
  }

  stop({ id, engine }) {
    if (this.cacheMap[id]) {
      const video = this.cacheMap[id].video;
      video.pause();
      const { time, rate } = this.listenerMap[id] || {};
      if (time) engine.off('afterSetTime', time);
      if (rate) engine.off('afterSetPlayRate', rate);
      delete this.listenerMap[id];
    }
  }
}

export default new VideoControl();
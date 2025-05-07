import audioControl from './audioControl';
import lottieControl from './lottieControl';
import videoControl from './videoControl';



// Describe Behaviour of Functions defined by the React Timeline Editor Library (Their doc didn't seems to in detail talk about it)
// 'start' is called whenever the play button of the timelineEditor is pressed and the timeline cursor is on the timeline block
// 'stop' is called whenever the pause button of the timelineEditor is pressed and the timeline cursor is on the timeline block
// 'enter' is called whenever the timeline cursor enter the timeline block
// 'leave' is called whenever the timeline cursor leave the timeline block
// 'update' seems to be called whenever any of the four conditions above occurs



export const mockEffect = {
    audioEffect: {
      id: 'audioEffect',
      name: 'playAudio',
      source: {
        start: ({ action, engine, isPlaying, time }) => {
          if (isPlaying) {                
            const src = action.data.src;
            audioControl.start({ id: src, src, startTime: action.start, engine, time });
          }
        },
        stop: ({ action, engine }) => {
          const src = action.data.src;
          audioControl.stop({ id: src, engine });
        },
        enter: ({ action, engine, isPlaying, time }) => {
          if (isPlaying) {
              const src = action.data.src;
              audioControl.start({ id: src, src, startTime: action.start, engine, time });
          }
        },
        leave: ({ action, engine }) => {
          const src = action.data.src;
          audioControl.stop({ id: src, engine });
        },
      },
    },
    videoEffect: {
      id: 'videoEffect',
      name: 'playVideo',
      source: {
        start: ({ action, engine, isPlaying, time }) => {
          console.log('start')
          if (isPlaying) {
              const src = action.data.src;
              videoControl.start({ id: src, src, startTime: action.start, engine, time });
          }
        },
        stop: ({ action, engine }) => {
          console.log('stop')
          const src = action.data.src;
          videoControl.stop({ id: src, engine });
        },
        // 'enter' can be called first before 'start' so the displaying of the video will be done in 'enter'
        enter: ({ action }) => {
          console.log('enter')
          const src = action.data.src;
          videoControl.enter({ id: src, src });
        },
        leave: ({ action, engine }) => {
          console.log('leave')
          const src = action.data.src;
          videoControl.stop({ id: src, engine });
        },
      },
    },
    visualEffect: {
      id: 'visualEffect',
      name: 'Play Lottie Animation',
      source: {
        enter: ({ action, time }) => {
          const src = action.data.src;
          lottieControl.enter({ id: src, src, startTime: action.start, endTime: action.end, time });
        },
        leave: ({ action, time }) => {
          const src = action.data.src;
          lottieControl.leave({ id: src, startTime: action.start, endTime: action.end, time });
        },
        update: ({ action, time }) => {
          const src = action.data.src;
          lottieControl.update({ id: src, src, startTime: action.start, endTime: action.end, time });
        },
      },
    },
};
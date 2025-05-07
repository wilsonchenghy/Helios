import backgroundMusic from '../assets/backgroundMusic.mp3';
import backgroundMusic2 from '../assets/backgroundMusic2.mp3';
import Video1 from '../assets/Video1.mp4';

// All the contents in initialState are examples for demostrating the functioning of the timelineEditor using the assets included
const initialState = {
    timelineData: [
      {
        id: '0',
        actions: [
          {
            id: 'action0',
            start: 30,
            end: 60,
            effectId: 'audioEffect',
            data: {
              src: backgroundMusic,
              name: 'backgroundMusic',
            },
          },
        ],
      },
      {
        id: '1',
        actions: [
          {
            id: 'action1',
            start: 60,
            end: 90,
            effectId: 'audioEffect',
            data: {
              src: backgroundMusic2,
              name: 'backgroundMusic2',
            },
          },
        ],
      },
      // {
      //   id: '2',
      //   actions: [
      //     {
      //       id: 'action2',
      //       start: 0,
      //       end: 1000,
      //       effectId: 'videoEffect',
      //       data: {
      //         src: Video1,
      //         name: 'Video1',
      //       },
      //     },
      //   ],
      // },
      // {
      //   id: '3',
      //   actions: [
      //     {
      //       id: 'action3',
      //       start: 0,
      //       end: 60,
      //       effectId: 'visualEffect',
      //       data: {
      //         src: '/src/assets/LottieAnimation.json',
      //         name: 'LottieAnimation',
      //       },
      //     },
      //   ],
      // },
      // {
      //   id: '4',
      //   actions: [
      //     {
      //       id: 'action4',
      //       start: 10,
      //       end: 40,
      //       effectId: 'visualEffect',
      //       data: {
      //         src: '/src/assets/LottieAnimation2.json',
      //         name: 'LottieAnimation2',
      //       },
      //     },
      //   ],
      // },
      // {
      //   id: '5',
      //   actions: [
      //     {
      //       id: 'action5',
      //       start: 40,
      //       end: 60,
      //       effectId: 'visualEffect',
      //       data: {
      //         src: '/src/assets/LottieAnimation3.json',
      //         name: 'LottieAnimation3',
      //       },
      //     },
      //   ],
      // },
    ],
};

const timelineReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'TIMELINE_ADD_ACTION':
            return {
                ...state,
                timelineData: [...state.timelineData, action.payload],
            }
        default:
            return state;
    }
};

export default timelineReducer;
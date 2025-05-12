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
        case 'TIMELINE_DELETE_ACTION':
            return {
                ...state,
                timelineData: state.timelineData.filter(item => item.id !== action.payload.id),
            }
        case 'TIMELINE_MOVE_MEDIA_ACTION': {
            const { id, targetPosition } = action.payload;
            
            // Find the index of the item to move
            const itemIndex = state.timelineData.findIndex(item => item.id === id);
            if (itemIndex === -1) return state;
            
            // Create a copy of the item to move
            const itemToMove = { ...state.timelineData[itemIndex] };
            
            // Get the target bar's items
            const targetBarItems = state.timelineData.filter(item => 
                parseInt(item.id) === targetPosition
            );
            
            // If target bar has media, we need to concatenate the actions
            if (targetBarItems.length > 0) {
                // Find the last end time in the target bar
                const lastEndTime = Math.max(
                    ...targetBarItems.flatMap(item => 
                        item.actions.map(action => action.end)
                    )
                );
                
                // Create adjusted actions with new timing
                const adjustedActions = itemToMove.actions.map(action => {
                    const duration = action.end - action.start;
                    return {
                        ...action,
                        start: lastEndTime,
                        end: lastEndTime + duration
                    };
                });
                
                // Add the adjusted actions to the target bar's first item
                const updatedTargetItem = {
                    ...targetBarItems[0],
                    actions: [...targetBarItems[0].actions, ...adjustedActions]
                };
                
                // Create the updated timeline data
                const updatedTimelineData = state.timelineData
                    .filter(item => item.id !== id && parseInt(item.id) !== targetPosition)
                    .concat(updatedTargetItem);
                
                return {
                    ...state,
                    timelineData: updatedTimelineData
                };
            } else {
                // If target bar is empty, simply update the id
                const updatedItem = {
                    ...itemToMove,
                    id: targetPosition.toString()
                };
                
                // Create the updated timeline data
                const updatedTimelineData = state.timelineData
                    .filter(item => item.id !== id)
                    .concat(updatedItem);
                
                return {
                    ...state,
                    timelineData: updatedTimelineData
                };
            }
        }
        default:
            return state;
    }
};

export default timelineReducer;
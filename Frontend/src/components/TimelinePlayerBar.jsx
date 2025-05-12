import { useEffect, useState } from 'react';
import { Play, Pause, ZoomIn, ZoomOut, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { timelineDeleteAction, timelineMoveMediaAction } from '../redux/actions';
import '../styles/TimelinePlayerBar.css'



const TimelinePlayerBar = ({ timelineState, autoScrollWhenPlay, scale, setScale }) => {

  const playbackSpeedOptions = [0.5, 1.0, 1.5, 2.0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setPlayingTime] = useState(0);
  const [activeSpeed, setActiveSpeed] = useState(1.0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const dispatch = useDispatch();
  const timelineData = useSelector(state => state.timeline.timelineData);


  // Control Play or pause
  const togglePlayOrPause = () => {
    if (!timelineState.current) return;
    
    if (timelineState.current.isPlaying) {
      timelineState.current.pause();
    } else {
      timelineState.current.play({ autoEnd: true });
    }
  };


  // For the custom 00:00:00:00 time scale displayed
  const playingTimeDisplay = (time) => {

    const timeInHours = Math.floor(time / 3600);
    const timeInMinutes = Math.floor((time % 3600) / 60);
    const timeInSeconds = Math.floor(time % 60);
    const timeInMilliseconds = Math.floor((time % 1) * 100);
  
    const formattedHours = String(timeInHours).padStart(2, '0');
    const formattedMins = String(timeInMinutes).padStart(2, '0');
    const formattedSec = String(timeInSeconds).padStart(2, '0');
    const formattedMicroSec = String(timeInMilliseconds).padStart(2, '0');
  
    return <>{`${formattedHours}:${formattedMins}:${formattedSec}.${formattedMicroSec}`}</>;
  };  


  // Change playback speed
  const changePlaybackSpeed = (playbackSpeed) => {
    if (!timelineState.current) return;
    setActiveSpeed(playbackSpeed);
    timelineState.current.setPlayRate(playbackSpeed);
  };


  // Handle zoom in/out
  const handleZoomOut = () => {
    setScale(Math.max(scale - 5, 1));
  };

  const handleZoomIn = () => {
    setScale(scale + 5);
  };


  // Manage useState and handle the autoscolling while playing
  useEffect(() => {
    if (!timelineState.current) return;

    const timelineCurrentState = timelineState.current;
    timelineCurrentState.listener.on('play', () => setIsPlaying(true));
    timelineCurrentState.listener.on('paused', () => setIsPlaying(false));
    timelineCurrentState.listener.on('afterSetTime', ({ time }) => setPlayingTime(time));
    timelineCurrentState.listener.on('setTimeByTick', ({ time }) => {
      setPlayingTime(time);

      const scaleWidth = 160;
      const offset = 800;
      // Use current scale value from props instead of the initial value
      const cursorPosition = time * (scaleWidth / scale) - offset;  // relative to autoScrollWhenPlay point

      if (cursorPosition >= 0 && autoScrollWhenPlay) {
        timelineState.current.setScrollLeft(cursorPosition);
      }
    });

    return () => {
      if (!timelineCurrentState) return;
      timelineCurrentState.pause();
      timelineCurrentState.listener.offAll();
    };
  }, [timelineState, scale, autoScrollWhenPlay]); // Add scale to dependency array


  // Delete current media being played
  const deleteCurrentMedia = () => {
    if (!timelineState.current || timelineData.length === 0) {
      setShowDeleteModal(false);
      return;
    }
    
    // Find the current media being played based on time
    const currentTime = time;
    
    // Find which item in the timeline is currently active
    const currentItem = timelineData.find(item => {
      return item.actions.some(action => 
        currentTime >= action.start && currentTime <= action.end
      );
    });
    
    if (currentItem) {
      dispatch(timelineDeleteAction(currentItem.id));
      timelineState.current.pause();
      setPlayingTime(0);
      setShowDeleteModal(false);
    } else {
      // No media found at current time
      setShowDeleteModal(false);
    }
  };
  
  // Check if there's media at the current timeline position
  const isMediaAtCurrentTime = () => {
    if (timelineData.length === 0) return false;
    
    return timelineData.some(item => 
      item.actions.some(action => 
        time >= action.start && time <= action.end
      )
    );
  };
  
  // Get the current media id based on time
  const getCurrentMediaId = () => {
    if (timelineData.length === 0) return null;
    
    const currentItem = timelineData.find(item => 
      item.actions.some(action => 
        time >= action.start && time <= action.end
      )
    );
    
    return currentItem ? currentItem.id : null;
  };
  
  // Get the current bar position (the id)
  const getCurrentBarPosition = () => {
    const mediaId = getCurrentMediaId();
    return mediaId ? parseInt(mediaId) : null;
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    if (isMediaAtCurrentTime()) {
      setShowDeleteModal(true);
    }
  };

  // Check if moving the current media would leave its track empty
  const wouldLeaveTrackEmpty = () => {
    const currentPos = getCurrentBarPosition();
    if (currentPos === null) return false;
    
    // Find the current item
    const currentItem = timelineData.find(item => item.id === getCurrentMediaId());
    if (!currentItem) return false;
    
    // Count actions for the current track at current time
    const actionsAtCurrentTime = currentItem.actions.filter(action => 
      time >= action.start && time <= action.end
    );
    
    // If there's only one action at this time and it's the only action in the track
    return actionsAtCurrentTime.length === 1 && currentItem.actions.length === 1;
  };

  // Check if we can move up (to position with lower id number)
  const canMoveUp = () => {
    const currentPos = getCurrentBarPosition();
    if (currentPos === null || currentPos === 0) return false;
    
    // Get all occupied timeline positions
    const occupiedPositions = timelineData.map(item => parseInt(item.id))
      .sort((a, b) => a - b);
    
    // Check if position above is available (either position 0 or an occupied position)
    const targetPos = currentPos - 1;
    return targetPos === 0 || occupiedPositions.includes(targetPos);
  };

  // Check if we can move down (to position with higher id number)
  const canMoveDown = () => {
    // Can't move down if it would leave an empty track
    if (wouldLeaveTrackEmpty()) return false;
    
    const currentPos = getCurrentBarPosition();
    if (currentPos === null) return false;
    
    // Always allow moving to the next consecutive position
    return true;
  };

  // Move media up
  const moveMediaUp = () => {
    if (!canMoveUp() || !isMediaAtCurrentTime()) return;
    
    const currentId = getCurrentMediaId();
    const currentPos = getCurrentBarPosition();
    
    if (currentId && currentPos !== null) {
      dispatch(timelineMoveMediaAction(currentId, currentPos - 1));
      timelineState.current.pause();
      setPlayingTime(0);
    }
  };

  // Move media down
  const moveMediaDown = () => {
    if (!canMoveDown() || !isMediaAtCurrentTime()) return;
    
    const currentId = getCurrentMediaId();
    const currentPos = getCurrentBarPosition();
    
    if (currentId && currentPos !== null) {
      dispatch(timelineMoveMediaAction(currentId, currentPos + 1));
      timelineState.current.pause();
      setPlayingTime(0);
    }
  };

  return (
    <div className="timelinePlayerBar">
      <div className="playerLeftControls">
        <button className="playOrPauseButton" onClick={togglePlayOrPause} title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? (
            <Pause size={20} className="play_pause_icon" />
          ) : (
            <Play size={20} className="play_pause_icon" />
          )}
        </button>
        <div className="displayTime">{playingTimeDisplay(time)}</div>
        <button 
          className={`deleteButton ${isMediaAtCurrentTime() ? '' : 'disabled'}`} 
          onClick={handleDeleteClick}
          title="Delete Current Media"
          disabled={!isMediaAtCurrentTime()}
        >
          <Trash2 size={16} />
        </button>
        <button 
          className={`moveUpButton ${canMoveUp() && isMediaAtCurrentTime() ? '' : 'disabled'}`} 
          onClick={moveMediaUp}
          title="Move Current Media Up"
          disabled={!canMoveUp() || !isMediaAtCurrentTime()}
        >
          <ArrowUp size={16} />
        </button>
        <button 
          className={`moveDownButton ${canMoveDown() && isMediaAtCurrentTime() ? '' : 'disabled'}`} 
          onClick={moveMediaDown}
          title="Move Current Media Down"
          disabled={!canMoveDown() || !isMediaAtCurrentTime()}
        >
          <ArrowDown size={16} />
        </button>
      </div>
      
      <div className="playerRightControls">
        <div className="zoomControls">
          <button 
            className="controlButton" 
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button 
            className="controlButton" 
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
        </div>
        
        <div className="speedControls">
          {playbackSpeedOptions.map((playbackSpeedOption) => (
            <button
              key={playbackSpeedOption}
              className={`speedButton ${activeSpeed === playbackSpeedOption ? 'active' : ''}`}
              onClick={() => changePlaybackSpeed(playbackSpeedOption)}
            >
              {`${playbackSpeedOption.toFixed(1)}x`}
            </button>
          ))}
        </div>
      </div>
      
      {showDeleteModal && (
        <div className="deleteModal">
          <div className="deleteModalContent">
            <p>Delete current media from the timeline?</p>
            <div className="deleteModalButtons">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={deleteCurrentMedia} className="confirmDelete">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default TimelinePlayerBar;
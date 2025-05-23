import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import '../styles/StockMediaBox.css';
import {
  previewMediaAction,
  setMediaTypeAction,
  setPreviewerLoadingAction,
} from '../redux/actions.js';

const StockMediaBox = ({ mediaType = 'image' }) => {
  const [imageQuery, setImageQuery] = useState('');
  const [videoQuery, setVideoQuery] = useState('');
  const [soundtrackQuery, setSoundtrackQuery] = useState('');

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [soundtracks, setSoundtracks] = useState([]);

  const [visibleGrid, setVisibleGrid] = useState('none');
  const [isLoading, setIsLoading] = useState(false);
  const [clickedAudioId, setClickedAudioId] = useState(null);

  const baseURL = 'http://127.0.0.1:5001';

  const dispatch = useDispatch();

  // Update visible grid when mediaType changes
  useEffect(() => {
    if (mediaType === 'image') {
      setVisibleGrid('imageGrid');
      if (images.length === 0 && imageQuery) {
        fetchImages();
      }
    } else if (mediaType === 'video') {
      setVisibleGrid('videoGrid');
      if (videos.length === 0 && videoQuery) {
        fetchVideos();
      }
    } else if (mediaType === 'audio') {
      setVisibleGrid('soundtrackGrid');
      if (soundtracks.length === 0 && soundtrackQuery) {
        fetchSoundtracks();
      }
    }
  }, [mediaType]);

  // Handle key press for search input
  const handleKeyPress = (e, searchFunction) => {
    if (e.key === 'Enter') {
      searchFunction();
    }
  };

  const handleSearchImageButtonClick = () => {
    setVisibleGrid('imageGrid');
    fetchImages();
  };

  const handleSearchVideoButtonClick = () => {
    setVisibleGrid('videoGrid');
    fetchVideos();
  };

  const handleSongsButtonClick = () => {
    setVisibleGrid('soundtrackGrid');
    fetchSoundtracks();
  };

  const fetchImages = async () => {
    if (!imageQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/proxy/pexels/images?query=${imageQuery}&per_page=10`);
      setImages(response.data.photos);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideos = async () => {
    if (!videoQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/proxy/pexels/videos?query=${videoQuery}&per_page=10`);
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSoundtracks = async () => {
    if (!soundtrackQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/proxy/jamendo/tracks?namesearch=${soundtrackQuery}&limit=10`);
      setSoundtracks(response.data.results);
    } catch (error) {
      console.error('Error fetching soundtracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addImageToPreviewer = (imagePath) => {
    dispatch(setPreviewerLoadingAction(true));
    axios
      .post(`${baseURL}/generate_video`, {
        imagePath: imagePath,
        duration: 5,
      })
      .then((response) => {
        const mediaPath = `${baseURL}/${response.data}`;
        console.log("Generated video URL:", mediaPath);
        dispatch(setPreviewerLoadingAction(false));
        dispatch(previewMediaAction(mediaPath));
        dispatch(setMediaTypeAction('video'));
      })
      .catch((error) => {
        console.error('Error generating video:', error);
      });
  };

  const addVideoToPreviewer = (e, mediaUrl) => {
    e.preventDefault();
    dispatch(previewMediaAction(mediaUrl));
    dispatch(setMediaTypeAction('video'));
  };

  const addAudioToPreviewer = (audioUrl) => {
    console.log(audioUrl);
    dispatch(previewMediaAction(audioUrl));
    dispatch(setMediaTypeAction('audio'));
  };

  const handleAudioClick = (id) => {
    setClickedAudioId(id);
    // Clear the tooltip after 2 seconds
    setTimeout(() => {
      setClickedAudioId(null);
    }, 2000);
  };

  // Render appropriate search input based on mediaType
  const renderSearchInput = () => {
    switch (mediaType) {
      case 'image':
        return (
          <div className="input-container">
            <input
              id="imageSearchQuery"
              className="inputbox"
              type="text"
              value={imageQuery}
              onChange={(e) => setImageQuery(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleSearchImageButtonClick)}
              placeholder="Search for images..."
            />
            <button className="button-4 search" onClick={handleSearchImageButtonClick}>
              Search
            </button>
          </div>
        );
      case 'video':
        return (
          <div className="input-container">
            <input
              id="videoSearchQuery"
              className="inputbox"
              type="text"
              value={videoQuery}
              onChange={(e) => setVideoQuery(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleSearchVideoButtonClick)}
              placeholder="Search for videos..."
            />
            <button className="button-4 search" onClick={handleSearchVideoButtonClick}>
              Search
            </button>
          </div>
        );
      case 'audio':
        return (
          <div className="input-container">
            <input
              id="soundtrackSearchQuery"
              className="inputbox"
              type="text"
              value={soundtrackQuery}
              onChange={(e) => setSoundtrackQuery(e.target.value)}
              placeholder="Search for audio..."
            />
            <button className="button-4 search" onClick={handleSongsButtonClick}>
              Search
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPlaceholder = () => {
    if (isLoading) return null;
    
    if ((visibleGrid === 'imageGrid' && images.length === 0) || 
        (visibleGrid === 'videoGrid' && videos.length === 0) || 
        (visibleGrid === 'soundtrackGrid' && soundtracks.length === 0)) {
      return (
        <div className="search-placeholder">
          <p>Start searching to find {mediaType === 'image' ? 'images' : mediaType === 'video' ? 'videos' : 'audio'}...</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="stock-media-container">
      <div className="MediaBox">
        {renderSearchInput()}
      </div>

      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
      
      {renderPlaceholder()}

      <div className={visibleGrid === 'imageGrid' ? 'imageGrid' : 'hidden'}>
        {images.length > 0 && 
          images.map((image) => (
            <img
              key={image.id}
              src={image.src.medium}
              alt={image.photographer}
              className="stockImages"
              onDoubleClick={() => addImageToPreviewer(image.src.medium)}
            />
          ))
        }
      </div>

      <div className={visibleGrid === 'videoGrid' ? 'videoGrid' : 'hidden'}>
        {videos.length > 0 && 
          videos.map((video) => (
            <ReactPlayer
              key={video.id}
              url={video.video_files[0].link}
              controls
              className="stockVideos"
              onClick={(e) => addVideoToPreviewer(e, video.video_files[0].link)}
              onDoubleClick={(e) => e.preventDefault()} // not sure why using addVideoToPreviewer on double click will make e.preventDefault() not work
              config={{
                file: {
                  attributes: {
                    onDoubleClick: (e) => e.preventDefault(),
                  },
                },
              }}
            />
          ))
        }
      </div>

      <div className={visibleGrid === 'soundtrackGrid' ? 'soundtrackGrid' : 'hidden'}>
        {soundtracks.length > 0 && 
          soundtracks.map((soundtrack) => (
            <div 
              key={soundtrack.id} 
              className="soundtrackItem"
              onDoubleClick={() => addAudioToPreviewer(soundtrack.audio)}
              onClick={() => handleAudioClick(soundtrack.id)}
              style={{ cursor: 'pointer' }}
              title="Double-click to add to timeline"
              data-audio-url={soundtrack.audio}
            >
              <div className="soundtrack-title">{soundtrack.name || 'Audio Track'}</div>
              {clickedAudioId === soundtrack.id && (
                <div className="audio-tooltip">Double-click to add to timeline</div>
              )}
              <audio 
                controls
                onClick={(e) => e.stopPropagation()}
              >
                <source src={soundtrack.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default StockMediaBox;

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

const StockMediaBox = () => {
  const [imageQuery, setImageQuery] = useState('');
  const [videoQuery, setVideoQuery] = useState('');
  const [soundtrackQuery, setSoundtrackQuery] = useState('');

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [soundtracks, setSoundtracks] = useState([]);

  const [visibleGrid, setVisibleGrid] = useState('none');
  const [isLoading, setIsLoading] = useState(false);

  const baseURL = 'http://127.0.0.1:5001';

  const dispatch = useDispatch();

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
        console.log(response.data);
        const mediaPath = '/' + response.data;
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

  return (
    <div>
      <div className="MediaBox">
        <div className="input-container">
          <input
            id="imageSearchQuery"
            className="inputbox"
            type="text"
            value={imageQuery}
            onChange={(e) => setImageQuery(e.target.value)}
            placeholder="Search Images"
          />
          <button className="button-4 search" onClick={handleSearchImageButtonClick}>
            Search Images
          </button>
        </div>

        <div className="input-container">
          <input
            id="videoSearchQuery"
            className="inputbox"
            type="text"
            value={videoQuery}
            onChange={(e) => setVideoQuery(e.target.value)}
            placeholder="Search Videos"
          />
          <button className="button-4 search" onClick={handleSearchVideoButtonClick}>
            Search Videos
          </button>
        </div>

        <div className="input-container">
          <input
            id="soundtrackSearchQuery"
            className="inputbox"
            type="text"
            value={soundtrackQuery}
            onChange={(e) => setSoundtrackQuery(e.target.value)}
            placeholder="Search Soundtracks"
          />
          <button className="button-4 search" onClick={handleSongsButtonClick}>
            Search Soundtrack
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      <div className={visibleGrid === 'imageGrid' ? 'imageGrid' : 'hidden'}>
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src.medium}
            alt={image.photographer}
            className="stockImages"
            onDoubleClick={() => addImageToPreviewer(image.src.medium)}
          />
        ))}
      </div>

      <div className={visibleGrid === 'videoGrid' ? 'videoGrid' : 'hidden'}>
        {videos.map((video) => (
          <ReactPlayer
            key={video.id}
            url={video.video_files[0].link}
            controls
            className="stockVideos"
            onClick={(e) => addVideoToPreviewer(e, video.video_files[0].link)}
            onDoubleClick={(e) => e.preventDefault()}
            config={{
              file: {
                attributes: {
                  onDoubleClick: (e) => e.preventDefault(),
                },
              },
            }}
          />
        ))}
      </div>

      <div className={visibleGrid === 'soundtrackGrid' ? 'soundtrackGrid' : 'hidden'}>
        {soundtracks.map((soundtrack) => (
          <div key={soundtrack.id} className="soundtrackItem">
            <audio controls>
              <source src={soundtrack.audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockMediaBox;

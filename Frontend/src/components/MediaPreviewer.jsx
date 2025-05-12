import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { timelineAddAction } from '../redux/actions';
import ReactPlayer from 'react-player';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { previewMediaAction, setMediaTypeAction } from '../redux/actions';
import { Film, Headphones, Upload } from 'lucide-react';
import videoControl from '../utils/videoControl';
import '../styles/MediaPreviewer.css';

const MediaPreviewer = ({timelineData, timelineAddAction}) => {
    const mediaUrl = useSelector(state => state.mediaPreview.mediaUrl);
    const mediaType = useSelector(state => state.mediaPreview.mediaType);
    const isLoading = useSelector(state => state.mediaPreview.isLoading);

    // useState
    const [durationTimelineData, setDurationTimelineData] = useState(null);

    // For handling video/audio dropbox
    const dispatch = useDispatch();

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        const fileType = file.type.startsWith('video') ? 'video' : 'audio';
        dispatch(setMediaTypeAction(fileType));
        dispatch(previewMediaAction(url));
    };

    const acceptType = {
        'video/*': ['.mp4', '.mov', '.avi'], // Need to specify video formats, or else there will be warnings
        'audio/*': ['.mp3', '.wav', '.ogg'], // Need to specify audio formats, or else there will be warnings
    };
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: acceptType,
        multiple: false
    });

    // Get duration of imported video/audio
    const getDuration = (duration) => {
        const durationInSeconds = duration;
        setDurationTimelineData(durationInSeconds);
    }

    // Add video/audio data to the timelineEditor (use useEffect to automatically add the data once any video/audio is added to the previewer)
    const handleTimelineAddData = (mediaSrc, mediaType) => {
        const id = timelineData.length.toString()

        const newTimelineData = {
            id: id,
            actions: [
                {
                    id: id,
                    start: 0,
                    end: durationTimelineData,
                    effectId: mediaType === 'video' ? 'videoEffect' : 'audioEffect',
                    data: {
                        src: mediaSrc,
                        name: mediaType === 'video' ? 'Video' + id : 'backgroundAudio' + id, 
                    },
                }
            ],
        };
        timelineAddAction(newTimelineData);
    };

    useEffect(() => {
        if (durationTimelineData != null) {
            handleTimelineAddData(mediaUrl, mediaType);
            
            // Manually use videoControl to show preview if it's a video
            if (mediaType === 'video') {
                videoControl.enter({ id: mediaUrl, src: mediaUrl });
            }
        }
    }, [durationTimelineData]);

    return (
        <div className="media-previewer">
            <div 
                {...getRootProps()} 
                className={`dropzone-container ${isDragActive ? 'active' : ''}`}
            >
                {isLoading ? (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <p>Processing media...</p>
                    </div>
                ) : (
                    <div className="dropzone-content">
                        <input {...getInputProps()} />
                        <div className="dropzone-icon">
                            {mediaUrl ? (
                                mediaType === 'video' ? (
                                    <Film size={48} />
                                ) : (
                                    <Headphones size={48} />
                                )
                            ) : (
                                <Upload size={48} />
                            )}
                        </div>
                        <div className="dropzone-text">
                            {mediaUrl ? (
                                <p className="media-status-text">
                                    {mediaType === 'video' ? 'Video' : 'Audio'} ready and added to timeline!
                                    <span className="replace-text">Drop to replace</span>
                                </p>
                            ) : (
                                <>
                                    <p className="primary-text">Drag & drop a video or audio file here</p>
                                    <p className="secondary-text">or click to browse files</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {mediaUrl && mediaType === 'video' && (
                <div className="video-preview-container">
                    <ReactPlayer
                        url={mediaUrl}
                        controls={false}
                        width="0"
                        height="0"
                        style={{ display: 'none' }}
                        onDuration={getDuration}
                    />
                </div>
            )}

            {/* In order to call getDuration even though I don't need the audio component to be rendered, I still create the react player component but set it to be non visible on the UI */}
            {mediaUrl && mediaType === 'audio' && (
                <ReactPlayer
                    url={mediaUrl}
                    controls={false}
                    width="0"
                    height="0"
                    style={{ display: 'none' }}
                    onDuration={getDuration}
                />
            )}
            <div id="video-previewer-element"></div>

            {/* Temporary for the lottie animation */}
            {/* <div id="player-ground-1"></div> */}
        </div>
    )
}

// React Redux Stuff
const mapStateToProps = (state) => ({
    timelineData: state.timeline.timelineData,
});

const mapDispatchToProps = {
    timelineAddAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaPreviewer);
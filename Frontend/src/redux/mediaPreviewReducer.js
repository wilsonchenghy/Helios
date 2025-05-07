const initialState = {
    mediaUrl: null,
    mediaType: null,
    isLoading: false
};

const mediaPreviewReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'PREVIEW_MEDIA_ACTION':
            return {
                ...state,
                mediaUrl: action.payload.mediaUrl
            };
        case 'SET_MEDIA_TYPE_ACTION':
            return {
                ...state,
                mediaType: action.payload.mediaType
            };
        case 'SET_PREVIEWER_LOADING_ACTION':
            return {
                ...state,
                isLoading: action.payload.isLoading
            };
        default:
            return state;
    }
};

export default mediaPreviewReducer;

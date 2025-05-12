export const timelineAddAction = (timelineData) => ({
    type: 'TIMELINE_ADD_ACTION',
    payload: timelineData,
});

export const timelineDeleteAction = (timelineId) => ({
    type: 'TIMELINE_DELETE_ACTION',
    payload: { id: timelineId },
});

export const previewMediaAction = (mediaUrl) => ({
    type: 'PREVIEW_MEDIA_ACTION',
    payload: {mediaUrl: mediaUrl},
});

export const setMediaTypeAction = (mediaType) => ({
    type: 'SET_MEDIA_TYPE_ACTION',
    payload: {mediaType: mediaType},
})

export const setPreviewerLoadingAction = (isLoading) => ({
    type: 'SET_PREVIEWER_LOADING_ACTION',
    payload: {isLoading: isLoading},
});

export const timelineMoveMediaAction = (timelineId, targetPosition) => ({
    type: 'TIMELINE_MOVE_MEDIA_ACTION',
    payload: { 
        id: timelineId,
        targetPosition: targetPosition 
    },
});
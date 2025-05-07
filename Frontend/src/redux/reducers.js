import { combineReducers } from "redux";
import timelineReducer from './timelineReducer';
import mediaPreviewReducer from "./mediaPreviewReducer";

const rootReducer = combineReducers({
    timeline: timelineReducer,
    mediaPreview: mediaPreviewReducer 
})

export default rootReducer;
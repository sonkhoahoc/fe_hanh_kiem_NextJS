import { combineReducers } from "redux";
import infoCurrentUserReducers from "./info_current_userr_reducers";

export const allReducers = combineReducers({
    infoCurrentUserReducers,
});

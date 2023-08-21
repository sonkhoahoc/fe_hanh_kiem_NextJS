
export const infoCurrentUserReducers = (state = {}, action: any) => {

    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            return action.payload;
        default:
            return state
    }
};

export default infoCurrentUserReducers;
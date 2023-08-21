export const add_info_current_user = (data: any) => {
    return {
        type: "login",
        payload: data,
    };
};
export const clear_info_current_user = () => {
    return {
        type: "logout",  
        payload: {},      
    };
};
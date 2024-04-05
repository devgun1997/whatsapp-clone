export const initialState = {
    user: null,
};

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_PARTICIPANT: "SET_PARTICIPANT",
};

const reducer = (state, action) => {
    // console.log(action);
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            };
        case actionTypes.SET_PARTICIPANT:
            return{
                ...state,
                participant: action.participant,
            }
        default:
            return state;
    }
};
export default reducer;
export const initialState = null;
export const reducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload;
  }
  if (action.type === "CLEAR") {
    return null;
  }
  if (action.type === "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers,
      followings: action.payload.followings,
    };
  }
  if (action.type === "UPLOAD") {
    return { ...state, photo: action.payload };
  }
  return state;
};

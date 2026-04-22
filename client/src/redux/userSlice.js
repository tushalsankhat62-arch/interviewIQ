import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
};

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: getInitialState()
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            if (action.payload) {
                localStorage.setItem("userData", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("userData");
            }
        }
    }
})

export const {setUserData} = userSlice.actions

export default userSlice.reducer
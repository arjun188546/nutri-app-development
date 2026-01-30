import { createSlice } from '@reduxjs/toolkit';

const initialState = {  
    nutriDetails: null,   
  };

const nutriDetailsSlice = createSlice({
    name : 'nutriDetails',
    initialState,
    reducers : {
        setNutriDetails(state, action){
            console.log("From nutri details",action.payload)
            state.nutriDetails = action.payload
        },
        removeNutriDetails(state, action){
            state.nutriDetails = null
        }
    }
})

export const {setNutriDetails,removeNutriDetails} = nutriDetailsSlice.actions
export default nutriDetailsSlice.reducer
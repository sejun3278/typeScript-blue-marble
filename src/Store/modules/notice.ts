import { createAction, handleActions } from 'redux-actions';

const SELECTTAP = 'notice/select_tap';

export const actionCreators = {
    select_tap : createAction(SELECTTAP)
}

export interface noticeState {
    large_cat : number,
    small_cat : number,
}

const initialState : noticeState = {
    large_cat : 0,
    small_cat : 0
}

export default handleActions<noticeState> ({
   [SELECTTAP] : (state : any, data : any) => {
      return {
        ...state,
        large_cat : data.payload.large_cat !== undefined ? data.payload.large_cat : state.large_cat,
        small_cat : data.payload.small_cat !== undefined ? data.payload.small_cat : state.small_cat,
      };
    }

}, initialState);
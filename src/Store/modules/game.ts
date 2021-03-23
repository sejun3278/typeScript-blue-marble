import { createAction, handleActions } from 'redux-actions';

const GAMELOADING = 'game/game_loading';

export const actionCreators = {
    game_loading : createAction(GAMELOADING),
}

export interface gameState {
    loading : boolean,
    main_start : boolean,
    playing : boolean
}

const initialState : gameState = {
    loading : false,
    main_start : false,
    playing : false
}

export default handleActions<gameState> ({
   [GAMELOADING] : (state : any, data : any) => {
      return {
        ...state,
        loading : data.payload.loading !== undefined ? data.payload.loading : state.loading,
        main_start : data.payload.start !== undefined ? data.payload.start : state.main_start,
        playing : data.payload.playing !== undefined ? data.payload.playing : state.playing
      };
    }

}, initialState);
import { createAction, handleActions } from 'redux-actions';

const GAMELOADING = 'game/game_loading';
const ROUNDSTART = 'game/round_start';
const SETGAMENOTICEMENT = 'game/set_game_notice_ment';
const SETTIMER = 'game/set_timer';

export const actionCreators = {
    game_loading : createAction(GAMELOADING),
    round_start : createAction(ROUNDSTART),
    set_game_notice_ment : createAction(SETGAMENOTICEMENT),
    set_timer : createAction(SETTIMER)
}

export interface gameState {
    loading : boolean,
    main_start : boolean,
    playing : boolean,
    round_start : boolean,
    turn : number,
    main_ment : string,
    alert_ment : string,
    round : number,
    timer : string,
}

const initialState : gameState = {
    loading : false,
    main_start : false,
    playing : false,
    round_start : false,
    turn : 0,
    main_ment : "",
    alert_ment : "",
    round : 0,
    timer : "-",
}

export default handleActions<gameState> ({
   [GAMELOADING] : (state : any, data : any) => {
      return {
        ...state,
        loading : data.payload.loading !== undefined ? data.payload.loading : state.loading,
        main_start : data.payload.start !== undefined ? data.payload.start : state.main_start,
        playing : data.payload.playing !== undefined ? data.payload.playing : state.playing
      };
    },

    [ROUNDSTART] : (state : any, data : any) => {
        return{
            ...state,
            round_start : data.payload.round_start !== undefined ? data.payload.round_start : state.round_start,
            turn : data.payload.turn !== undefined ? data.payload.turn : state.turn,
            round : data.payload.round !== undefined ? data.payload.round : state.round
        }
    },

    [SETGAMENOTICEMENT] : (state : any, data : any) => {
        return {
            ...state,
            main_ment : data.payload.main_ment !== undefined ? data.payload.main_ment : state.main_ment,
            alert_ment : data.payload.alert_ment !== undefined ? data.payload.alert_ment : state.alert_ment
        }
    },

    [SETTIMER] : (state : any, data : any) => {
        return {
            ...state,
            timer : data.payload.timer !== undefined ? data.payload.timer : state.timer
        }
    }

}, initialState);
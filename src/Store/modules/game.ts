import { createAction, handleActions } from 'redux-actions';

const GAMELOADING = 'game/game_loading';
const ROUNDSTART = 'game/round_start';
const SETGAMENOTICEMENT = 'game/set_game_notice_ment';
const SETTIMER = 'game/set_timer';
const SELECTTYPE = 'game/select_type';
const SELECTCARDINFO = 'game/select_card_info';
const MOVE = 'game/move';

export const actionCreators = {
    game_loading : createAction(GAMELOADING),
    round_start : createAction(ROUNDSTART),
    set_game_notice_ment : createAction(SETGAMENOTICEMENT),
    set_timer : createAction(SETTIMER),
    select_type : createAction(SELECTTYPE),
    select_card_info : createAction(SELECTCARDINFO),
    move : createAction(MOVE)
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
    select_type : string | null,
    select_info : string,
    select_tap : number,
    card_select_able : boolean,
    card_notice_ment : string,
    select_first_card : number,
    select_last_card : number,
    all_card_num : number,
    overlap_card_check : string,
    move_location : number | null,
    move_able : boolean,
    alert_able : boolean
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
    select_type : null,
    select_info : JSON.stringify({}),
    select_tap : 0,
    card_select_able : false,
    card_notice_ment : "",
    select_first_card : 0,
    select_last_card : 0,
    all_card_num : 0,
    overlap_card_check : JSON.stringify({}),
    move_location : null,
    move_able : true,
    alert_able : true
}

export default handleActions<gameState> ({
   [GAMELOADING] : (state : any, data : any) => {
      return {
        ...state,
        loading : data.payload.loading !== undefined ? data.payload.loading : state.loading,
        main_start : data.payload.start !== undefined ? data.payload.start : state.main_start,
        playing : data.payload.playing !== undefined ? data.payload.playing : state.playing,
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
            alert_ment : data.payload.alert_ment !== undefined ? data.payload.alert_ment : state.alert_ment,
            alert_able : data.payload.alert_able !== undefined ? data.payload.alert_able : state.alert_able
        }
    },

    [SETTIMER] : (state : any, data : any) => {
        return {
            ...state,
            timer : data.payload.timer !== undefined ? data.payload.timer : state.timer
        }
    },

    [SELECTTYPE] : (state : any, data : any) => {
        return {
            ...state,
            select_type : data.payload.select_type !== undefined ? data.payload.select_type : state.select_type,
            select_info : data.payload.select_info !== undefined ? data.payload.select_info : state.select_info,
            select_tap : data.payload.select_tap !== undefined ? data.payload.select_tap : state.select_tap
        }
    },

    [SELECTCARDINFO] : (state : any, data : any) => {
        return {
            ...state,
            card_select_able : data.payload.card_select_able !== undefined ? data.payload.card_select_able : state.card_select_able,
            card_notice_ment : data.payload.card_notice_ment !== undefined ? data.payload.card_notice_ment : state.card_notice_ment,
            select_first_card : data.payload.select_first_card !== undefined ? data.payload.select_first_card : state.select_first_card,
            select_last_card : data.payload.select_last_card !== undefined ? data.payload.select_last_card : state.select_last_card,
            all_card_num : data.payload.all_card_num !== undefined ? data.payload.all_card_num : state.all_card_num,
            overlap_card_check : data.payload.overlap_card_check !== undefined ? data.payload.overlap_card_check : state.overlap_card_check
        }
    },

    [MOVE] : (state : any, data : any) => {
        return {
            ...state,
            move_location : data.payload.move_location !== undefined ? data.payload.move_location : state.move_location,
            move_able : data.payload.move_able !== undefined ? data.payload.move_able : state.move_able
        }
    },

}, initialState);
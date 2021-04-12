import { createAction, handleActions } from 'redux-actions';

const GAMELOADING = 'game/game_loading';
const ROUNDSTART = 'game/round_start';
const SETGAMENOTICEMENT = 'game/set_game_notice_ment';
const SETTIMER = 'game/set_timer';
const SELECTTYPE = 'game/select_type';
const SELECTCARDINFO = 'game/select_card_info';
const MOVE = 'game/move';
const EVENTINFO = 'game/event_info';
const RESETCASINGO = 'game/reset_casino';

export const actionCreators = {
    game_loading : createAction(GAMELOADING),
    round_start : createAction(ROUNDSTART),
    set_game_notice_ment : createAction(SETGAMENOTICEMENT),
    set_timer : createAction(SETTIMER),
    select_type : createAction(SELECTTYPE),
    select_card_info : createAction(SELECTCARDINFO),
    move : createAction(MOVE),
    event_info : createAction(EVENTINFO),
    reset_casino : createAction(RESETCASINGO),
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
    alert_able : boolean,
    stop_info : string,
    turn_end_able : boolean,
    move_event_able : boolean,
    time_over : boolean,
    casino_start : boolean,
    casino_betting : number,
    casino_game_start : boolean | null,
    casino_select_card : number,
    casino_card_tool : string,
    casino_card_select : boolean,
    casino_card_ment : string,
    casino_select_result : string,
    casino_now_card_number : number,
    casino_game_result : boolean | null,
    bank_info : string,
    bank_tap : number | null,
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
    alert_able : true,
    stop_info : JSON.stringify({}),
    turn_end_able : false,
    move_event_able : false,
    time_over : false,
    casino_start : false,
    casino_betting : 1,
    casino_game_start : false,
    casino_select_card : 0,
    casino_card_tool : JSON.stringify([]),
    casino_card_select : false,
    casino_card_ment : "　",
    casino_select_result : JSON.stringify({}),
    casino_now_card_number : 0,
    casino_game_result : null,
    bank_info : JSON.stringify({}),
    bank_tap : null,
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
            round : data.payload.round !== undefined ? data.payload.round : state.round,
            turn_end_able : data.payload.turn_end_able !== undefined ? data.payload.turn_end_able : state.turn_end_able,
            time_over : data.payload.time_over !== undefined ? data.payload.time_over : state.time_over
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

    [EVENTINFO] : (state : any, data : any) => {
        return {
            ...state,
            stop_info : data.payload.stop_info !== undefined ? data.payload.stop_info : state.stop_info,
            move_event_able : data.payload.move_event_able !== undefined ? data.payload.move_event_able : state.move_event_able,
            casino_start : data.payload.casino_start !== undefined ? data.payload.casino_start : state.casino_start,
            casino_betting : data.payload.casino_betting !== undefined ? data.payload.casino_betting : state.casino_betting,
            casino_game_start : data.payload.casino_game_start !== undefined ? data.payload.casino_game_start : state.casino_game_start,
            casino_select_card : data.payload.casino_select_card !== undefined ? data.payload.casino_select_card : state.casino_select_card,
            casino_card_tool : data.payload.casino_card_tool !== undefined ? data.payload.casino_card_tool : state.casino_card_tool,
            casino_card_ment : data.payload.casino_card_ment !== undefined ? data.payload.casino_card_ment : state.casino_card_ment,
            casino_card_select : data.payload.casino_card_select !== undefined ? data.payload.casino_card_select : state.casino_card_select,
            casino_select_result : data.payload.casino_select_result !== undefined ? data.payload.casino_select_result : state.casino_select_result,
            casino_now_card_number : data.payload.casino_now_card_number !== undefined ? data.payload.casino_now_card_number : state.casino_now_card_number,
            casino_game_result : data.payload.casino_game_result !== undefined ? data.payload.casino_game_result : state.casino_game_result,
            bank_info : data.payload.bank_info !== undefined ? data.payload.bank_info : state.bank_info,
            bank_tap : data.payload.bank_tap !== undefined ? data.payload.bank_tap : state.bank_tap
        }
    },

    [RESETCASINGO] : (state : any) => {
        return {
            ...state,
            casino_start : false,
            casino_betting : 1,
            casino_game_start : false,
            casino_select_card : 0,
            casino_card_tool : JSON.stringify([]),
            casino_card_select : false,
            casino_card_ment : "　",
            casino_select_result : JSON.stringify({}),
            casino_now_card_number : 0,
            casino_game_result : null,
            bank_tap : null,
        }
    }

}, initialState);
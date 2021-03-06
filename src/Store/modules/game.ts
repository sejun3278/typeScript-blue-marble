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
const SETTILEPLAYERMONEY = 'game/settle_player_money';
const PLAYERBANKINFO = 'game/player_bank_info';
const SETGAMELOG = 'game/set_game_log';
const SETNEWSINFO = 'game/set_news_info';
const GAMEPLAYTIME = 'game/game_play_time';
const GAMEOVER = 'game/game_over';
const GAMESOUND = 'game/game_sound';

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
    settle_player_money : createAction(SETTILEPLAYERMONEY),
    player_bank_info : createAction(PLAYERBANKINFO),
    set_game_log : createAction(SETGAMELOG),
    set_news_info : createAction(SETNEWSINFO),
    game_play_time : createAction(GAMEPLAYTIME),
    game_over : createAction(GAMEOVER),
    game_sound : createAction(GAMESOUND)
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
    now_stop : number,
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
    loan_date_list : string,
    loan_order_money : number,
    loan_payback_date : number
    loan_plus_incentive : number,
    loan_order_confirm : boolean,
    settle_modal : boolean,
    settle_extra_money : number,
    settle_bill : string,
    player_bank_info_alert : boolean,
    game_log : string,
    news_list : string,
    news_round : number,
    news_set : boolean,
    player_estate_info_alert : boolean,
    settle_type : string | null,
    play_time : number,
    save_money_index : string,
    game_over : boolean,
    winner : number,
    multiple_winner : string,
    settle_state : string,
    player_rank : string,
    rank_update : boolean,
    computer_casingo : boolean,
    computer_move : boolean,
    bgm_number: number
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
    now_stop : 0,
    turn_end_able : false,
    move_event_able : false,
    time_over : false,
    casino_start : false,
    casino_betting : 1,
    casino_game_start : false,
    casino_select_card : 0,
    casino_card_tool : JSON.stringify([]),
    casino_card_select : false,
    casino_card_ment : "???",
    casino_select_result : JSON.stringify({}),
    casino_now_card_number : 0,
    casino_game_result : null,
    bank_info : JSON.stringify({}),
    bank_tap : null,
    loan_date_list : JSON.stringify([]),
    loan_order_money : 0,
    loan_payback_date : 0,
    loan_plus_incentive : 0,
    loan_order_confirm : false,
    settle_modal : false,
    settle_extra_money : 0,
    player_bank_info_alert : false,
    game_log : JSON.stringify([]),
    news_list : JSON.stringify({}),
    news_round : 1,
    news_set : false,
    player_estate_info_alert : false,
    settle_bill : JSON.stringify({ }),
    settle_type : null,
    play_time : 0,
    save_money_index : JSON.stringify({}),
    game_over : false,
    winner : 0,
    multiple_winner : JSON.stringify([]),
    settle_state : JSON.stringify({}),
    player_rank : JSON.stringify({}),
    rank_update : false,
    computer_casingo : false,
    computer_move : false,
    bgm_number : 0
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
            now_stop: data.payload.now_stop !== undefined ? data.payload.now_stop : state.now_stop,
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
            bank_tap : data.payload.bank_tap !== undefined ? data.payload.bank_tap : state.bank_tap,
            loan_date_list : data.payload.loan_date_list !== undefined ? data.payload.loan_date_list : state.loan_date_list,
            loan_order_money : data.payload.loan_order_money !== undefined ? data.payload.loan_order_money : state.loan_order_money,
            loan_payback_date : data.payload.loan_payback_date !== undefined ? data.payload.loan_payback_date : state.loan_payback_date,
            loan_plus_incentive : data.payload.loan_plus_incentive !== undefined ? data.payload.loan_plus_incentive : state.loan_plus_incentive,
            loan_order_confirm : data.payload.loan_order_confirm !== undefined ? data.payload.loan_order_confirm : state.loan_order_confirm,
            save_money_index : data.payload.save_money_index !== undefined ? data.payload.save_money_index : state.save_money_index,
            player_rank : data.payload.player_rank !== undefined ? data.payload.player_rank : state.player_rank,
            rank_update : data.payload.rank_update !== undefined ? data.payload.rank_update : state.rank_update,
            computer_casingo : data.payload.computer_casingo !== undefined ? data.payload.computer_casingo : state.computer_casingo,
            computer_move : data.payload.computer_move !== undefined ? data.payload.computer_move : state.computer_move
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
            casino_card_ment : "???",
            casino_select_result : JSON.stringify({}),
            casino_now_card_number : 0,
            casino_game_result : null,
            bank_tap : null,
            loan_order_money : 0,
            loan_payback_date : 0,
            loan_plus_incentive : 0,
            loan_order_confirm : false
        }
    },

    [SETTILEPLAYERMONEY] : (state : any, data : any) => {
        return {
            ...state,
            settle_modal : data.payload.settle_modal !== undefined ? data.payload.settle_modal : state.settle_modal,
            settle_extra_money : data.payload.settle_extra_money !== undefined ? data.payload.settle_extra_money : state.settle_extra_money,
            settle_bill : data.payload.settle_bill !== undefined ? data.payload.settle_bill : state.settle_bill,
            settle_type : data.payload.settle_type !== undefined ? data.payload.settle_type : state.settle_type,
            settle_state : data.payload.settle_state !== undefined ? data.payload.settle_state : state.settle_state
        }
    },

    [PLAYERBANKINFO] : (state : any, data : any) => {
        return {
            ...state,
            player_bank_info_alert : data.payload.player_bank_info_alert !== undefined ? data.payload.player_bank_info_alert : state.player_bank_info_alert,
            player_estate_info_alert : data.payload.player_estate_info_alert !== undefined ? data.payload.player_estate_info_alert : state.player_estate_info_alert
        }
    },

    [SETGAMELOG] : (state : any, data : any) => {
        return {
            ...state,
            game_log : data.payload.game_log !== undefined ? data.payload.game_log : state.game_log
        }
    },

    [SETNEWSINFO] : (state : any, data : any) => {
        return {
            ...state,
            news_list : data.payload.news_list !== undefined ? data.payload.news_list : state.news_list,
            news_round : data.payload.news_round !== undefined ? data.payload.news_round : state.news_round,
            news_set : data.payload.news_set !== undefined ? data.payload.news_set : state.news_set
        }
    },

    [GAMEPLAYTIME] : (state : any, data : any) => {
        return {
            ...state,
            play_time : data.payload.play_time !== undefined ? data.payload.play_time : state.play_time
        }
    },

    [GAMEOVER] : (state : any, data : any) => {
        return {
            ...state,
            game_over : data.payload.game_over !== undefined ? data.payload.game_over : state.game_over,
            winner : data.payload.winner !== undefined ? data.payload.winner : state.winner,
            multiple_winner : data.payload.multiple_winner !== undefined ? data.payload.multiple_winner : state.multiple_winner
        }
    },

    [GAMESOUND] : (state : any, data : any) => {
        return {
            ...state,
            bgm_number : data.payload.bgm_number !== undefined ? data.payload.bgm_number : state.bgm_number,
        }
    }

}, initialState);
import { createAction, handleActions } from 'redux-actions';

const REDUXTEST = 'init/redux_test';
const TOGGLESEETINGMODAL = 'init/toggle_setting_modal';
const SETSETTINGSTATE = 'init/set_setting_state';
const SETPLAYERINFO = 'init/set_player_info';
const CHANGESTATE = 'init/change_state';

export const actionCreators = {
    redux_test : createAction(REDUXTEST),
    toggle_setting_modal : createAction(TOGGLESEETINGMODAL),
    set_setting_state : createAction(SETSETTINGSTATE),
    set_player_info : createAction(SETPLAYERINFO),
    change_state : createAction(CHANGESTATE),
}

// export const redux_test = createAction(REDUXTEST);

export interface initState {
    value : number;
    game_start : boolean;
    setting_modal : boolean;
    setting_type : string | null;
    setting_stage : number;
    setting_able : boolean;
    start_price : number;
    round_timer : number;
    game_event : boolean;
    setting_modify : boolean;
    round_limit : number;
    pass_price : number;
    player_list : string;
    able_player : number;
    card_limit : number;
    select_character : boolean;
    select_info : string;
    select_character_list : string;
    overlap_card : boolean;
    map_info : string;
    card_deck : string;
    bank_incentive_percent : number,
    stop_days : number,
    loan_percent : number,
    news_info_list : string
}

const initialState : initState = {
    value : 0,
    game_start : false,
    setting_modal : false,
    setting_type : null,
    setting_able : true,
    setting_stage : 1,
    start_price : 100,
    round_timer : 0,
    game_event : true,
    setting_modify : false,
    round_limit : 0,
    pass_price : 1,
    player_list : JSON.stringify([]),
    able_player : 2,
    card_limit : 1,
    select_character : false,
    select_info : JSON.stringify({}),
    select_character_list : JSON.stringify({}),
    overlap_card : true,
    map_info : JSON.stringify([]),
    card_deck : JSON.stringify([]),
    bank_incentive_percent : 5,
    stop_days : 1,
    loan_percent : 5,
    news_info_list : JSON.stringify({})
}

// const initialState = {
//     test : 0
// };

export default handleActions<initState> ({
   [REDUXTEST] : (state : any, data : any) => {
      return {
        ...state,
        value : data.payload.value
      };
    },

    // 셋팅 모달 on / off
    [TOGGLESEETINGMODAL] : (state : any, data : any) => {
        return {
            ...state,
            setting_modal : data.payload.modal !== undefined ? data.payload.modal : state.setting_modal,
            setting_type : data.payload.type !== undefined ? data.payload.type : state.setting_type,
            setting_able : data.payload.able !== undefined ? data.payload.able : state.setting_able
        }
    },

    // 게임 셋팅 설정하기
    [SETSETTINGSTATE] : (state : any, data : any) => {
        return {
            ...state,
            setting_stage : data.payload.stage !== undefined ? data.payload.stage : state.setting_stage,
            setting_modify : data.payload.modify !== undefined ? data.payload.modify : state.setting_modify,
            start_price : data.payload.start_price !== undefined ? data.payload.start_price : state.start_price,
            round_timer : data.payload.round_timer !== undefined ? data.payload.round_timer : state.round_timer,
            game_event : data.payload.game_event !== undefined ? data.payload.game_event : state.game_event,
            round_limit : data.payload.round_limit !== undefined ? data.payload.round_limit : state.round_limit,
            pass_price : data.payload.pass_price !== undefined ? data.payload.pass_price : state.pass_price,
            card_limit : data.payload.card_limit !== undefined ? data.payload.card_limit : state.card_limit,
            overlap_card : data.payload.overlap_card !== undefined ? data.payload.overlap_card : state.overlap_card,
            map_info : data.payload.map_info !== undefined ? data.payload.map_info : state.map_info,
            card_deck : data.payload.card_deck !== undefined ? data.payload.card_deck : state.card_deck
        }
    },

    // 플레이어 셋팅하기
    [SETPLAYERINFO] : (state : any, data : any) => {
        return {
            ...state,
            player_list : data.payload.player_list !== undefined ? data.payload.player_list : state.player_list,
            select_character_list : data.payload.select_character_list !== undefined ? data.payload.select_character_list : state.select_character_list,
            able_player : data.payload.able_player !== undefined ? data.payload.able_player : state.able_player,
            select_character : data.payload.select_character !== undefined ? data.payload.select_character : state.select_character,
            select_info : data.payload.select_info !== undefined ? data.payload.select_info : state.select_info
        }
    },

    // 이벤트로 인해 변경되는 부분들
    [CHANGESTATE] : (state : any, data : any) => {
        return {
            ...state,
            // 무인도 체류 기간
            stop_days : data.payload.stop_days !== undefined ? data.payload.stop_days : state.stop_days,
            // 예금 이자율
            bank_incentive_percent : data.payload.bank_incentive_percent !== undefined ? data.payload.bank_incentive_percent : state.bank_incentive_percent,
            // 대출 이자율
            loan_percent : data.payload.loan_percent !== undefined ? data.payload.loan_percent : state.loan_percent,
            // 뉴스 정보
            news_info_list : data.payload.news_info_list !== undefined? data.payload.news_info_list : state.news_info_list
        }
    },

}, initialState);
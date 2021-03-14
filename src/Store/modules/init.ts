import { createAction, handleActions } from 'redux-actions';

const REDUXTEST = 'init/redux_test';
const TOGGLESEETINGMODAL = 'init/toggle_setting_modal';
const SETSETTINGSTATE = 'init/set_setting_state';

export const actionCreators = {
    redux_test : createAction(REDUXTEST),
    toggle_setting_modal : createAction(TOGGLESEETINGMODAL),
    set_setting_state : createAction(SETSETTINGSTATE)
}

// export const redux_test = createAction(REDUXTEST);

export interface initState {
    value : number;
    game_start : boolean;
    setting_modal : boolean;
    setting_type : string | null;
    setting_stage : number;
    start_price : number;
    round_timer : number;
    game_event : boolean;
    setting_modify : boolean;
}

const initialState : initState = {
    value : 0,
    game_start : false,
    setting_modal : false,
    setting_type : null,
    setting_stage : 1,
    start_price : 100,
    round_timer : 60,
    game_event : true,
    setting_modify : false
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
            setting_modal : data.payload.modal,
            setting_type : data.payload.type
        }
    },

    // 게임 셋팅 설정하기
    [SETSETTINGSTATE] : (state : any, data : any) => {
        return {
            ...state,
            setting_stage : data.payload.stage !== undefined ? data.payload.stage : state.setting_stage,
            setting_modify : data.payload.modify !== undefined ? data.payload.modify : state.setting_modify,
            start_price : data.payload.price !== undefined ? data.payload.price : state.start_price,
            round_timer : data.payload.round_timer !== undefined ? data.payload.round_timer : state.round_timer,
            game_event : data.payload.event !== undefined ? data.payload.event : state.game_event
        }
    }


}, initialState);
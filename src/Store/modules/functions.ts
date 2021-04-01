import { createAction, handleActions } from 'redux-actions';

const SAVEFUNCTION = 'functions/save_function';

export const actionCreators = {
    save_function : createAction(SAVEFUNCTION)
}

export interface functionsState {
    _moveCharacter : Function,
    _commaMoney : Function
}

const initialState : functionsState = {
    _moveCharacter : () => {},
    _commaMoney  :() => {}
}

export default handleActions<functionsState> ({
   [SAVEFUNCTION] : (state : any, data : any) => {
      return {
        ...state,
        _moveCharacter : data.payload._moveCharacter !== undefined ? data.payload._moveCharacter : state._moveCharacter,
        _commaMoney : data.payload._commaMoney !== undefined ? data.payload._commaMoney : state._commaMoney
      };
    }

}, initialState);
import { createAction, handleActions } from 'redux-actions';

const SAVEFUNCTION = 'functions/save_function';

export const actionCreators = {
    save_function : createAction(SAVEFUNCTION)
}

export interface functionsState {
    _moveCharacter : Function,
    _commaMoney : Function,
    _addSound : Function,
    _removeAlertMent : Function,
    _playerMoney : Function,
    _timer : Function,
    _flash : Function
}

const initialState : functionsState = {
    _moveCharacter : () => {},
    _commaMoney  :() => {},
    _addSound  :() => {},
    _removeAlertMent : () => {},
    _playerMoney : () => {},
    _timer : () => {},
    _flash : () => {}
}

export default handleActions<functionsState> ({
   [SAVEFUNCTION] : (state : any, data : any) => {
      return {
        ...state,
        _moveCharacter : data.payload._moveCharacter !== undefined ? data.payload._moveCharacter : state._moveCharacter,
        _commaMoney : data.payload._commaMoney !== undefined ? data.payload._commaMoney : state._commaMoney,
        _addSound : data.payload._addSound !== undefined ? data.payload._addSound : state._addSound,
        _removeAlertMent : data.payload._removeAlertMent !== undefined ? data.payload._removeAlertMent : state._removeAlertMent,
        _playerMoney : data.payload._playerMoney !== undefined ? data.payload._playerMoney : state._playerMoney,
        _timer : data.payload._timer !== undefined ? data.payload._timer : state._timer,
        _flash : data.payload._flash !== undefined ? data.payload._flash : state._flash
      };
    }

}, initialState);
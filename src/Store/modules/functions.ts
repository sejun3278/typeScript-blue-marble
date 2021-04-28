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
    _flash : Function,
    _infiniteFlash : Function,
    _timerOn : Function,
    _addLog : Function,
    _checkPlayerMoney : Function,
    _minusPlayerMoney : Function,
    _checkEstatePlayerMoney : Function,
    _splitMoneyUnit : Function,
    _turnEnd : Function,
    _getMyRating : Function,
    _setPlayerRank : Function,
    _buyMap : Function,
    _checkLandMark : Function,
    _build : Function
}

const initialState : functionsState = {
    _moveCharacter : () => {},
    _commaMoney  :() => {},
    _addSound  :() => {},
    _removeAlertMent : () => {},
    _playerMoney : () => {},
    _timer : () => {},
    _flash : () => {},
    _infiniteFlash : () => {},
    _timerOn : () => {},
    _addLog : () => {},
    _checkPlayerMoney : () => {},
    _minusPlayerMoney : () => {},
    _checkEstatePlayerMoney : () => {},
    _splitMoneyUnit : () => {},
    _turnEnd : () => {},
    _getMyRating : () => {},
    _setPlayerRank : () => {},
    _buyMap : () => {},
    _checkLandMark : () => {},
    _build : () => {}
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
        _flash : data.payload._flash !== undefined ? data.payload._flash : state._flash,
        _infiniteFlash : data.payload._infiniteFlash !== undefined ? data.payload._infiniteFlash : state._infiniteFlash,
        _timerOn : data.payload._timerOn !== undefined ? data.payload._timerOn : state._timerOn,
        _addLog : data.payload._addLog !== undefined ? data.payload._addLog : state._addLog,
        _checkPlayerMoney : data.payload._checkPlayerMoney !== undefined ? data.payload._checkPlayerMoney : state._checkPlayerMoney,
        _minusPlayerMoney : data.payload._minusPlayerMoney !== undefined ? data.payload._minusPlayerMoney : state._minusPlayerMoney,
        _checkEstatePlayerMoney : data.payload._checkEstatePlayerMoney !== undefined ? data.payload._checkEstatePlayerMoney : state._checkEstatePlayerMoney,
        _splitMoneyUnit : data.payload._splitMoneyUnit !== undefined ? data.payload._splitMoneyUnit : state._splitMoneyUnit,
        _turnEnd : data.payload._turnEnd !== undefined ? data.payload._turnEnd : state._turnEnd,
        _getMyRating : data.payload._getMyRating !== undefined ? data.payload._getMyRating : state._getMyRating,
        _setPlayerRank : data.payload._setPlayerRank !== undefined ? data.payload._setPlayerRank : state._setPlayerRank,
        _buyMap : data.payload._buyMap !== undefined ? data.payload._buyMap : state._buyMap,
        _checkLandMark : data.payload._checkLandMark !== undefined ? data.payload._checkLandMark : state._checkLandMark,
        _build : data.payload._build !== undefined ? data.payload._build : state._build
      };
    }

}, initialState);
import { combineReducers } from 'redux';

import init, { initState } from './init';
import game, { gameState } from './game';
import functions, { functionsState } from './functions';
import notice, { noticeState } from './notice';

export default combineReducers({
    init,
    game,
    functions,
    notice
});

export interface StoreState {
    init : initState;
    game : gameState;
    functions : functionsState;
    notice : noticeState
}
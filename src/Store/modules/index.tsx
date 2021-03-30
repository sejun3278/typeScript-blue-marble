import { combineReducers } from 'redux';

import init, { initState } from './init';
import game, { gameState } from './game';
import functions, { functionsState } from './functions';

export default combineReducers({
    init,
    game,
    functions
});

export interface StoreState {
    init : initState;
    game : gameState;
    functions : functionsState;
}
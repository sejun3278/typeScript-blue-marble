import { combineReducers } from 'redux';

import init, { initState } from './init';
import game, { gameState } from './game';

export default combineReducers({
    init,
    game
});

export interface StoreState {
    init : initState;
    game : gameState;
}
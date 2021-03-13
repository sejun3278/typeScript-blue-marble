import { combineReducers } from 'redux';
import init, { initState } from './init';

export default combineReducers({
    init
});

export interface StoreState {
    init : initState;
}
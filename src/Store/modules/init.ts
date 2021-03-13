import { createAction, handleActions } from 'redux-actions';

const REDUXTEST = 'init/redux_test';

export const actionCreators = {
    redux_test : createAction(REDUXTEST)
}

// export const redux_test = createAction(REDUXTEST);

export interface initState {
    value : number;
}

const initialState : initState = {
    value : 0
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

    // [ALLSTATE] : (state, data) => {
    //   let server = state.server
    //   let db = state.db

    //   if(data.payload.server === true) {
    //      server = '서버 연결 완료'
    //   }

    //   if(data.payload.db === true) {
    //      db = 'Sequelize 가동 중'
    //   }

    //   return {
    //     ...state,
    //     server : server,
    //     db : db
    //   };
    // },

}, initialState);
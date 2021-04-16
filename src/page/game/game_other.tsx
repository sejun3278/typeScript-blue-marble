import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import News from './news';
import Log from './log';

export interface AllProps {
  initActions : any,
  gameActions : any,
  functionsActions : any,
};

class GameOther extends React.Component<AllProps> {

  render() {

    return(
      <div id='game_play_other_div'>
        <News />
        <Log />
      </div>
    )
  }
}

export default connect( 
  ( { init, game, functions } : StoreState  ) => ({

  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(GameOther);

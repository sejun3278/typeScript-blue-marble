import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';


export interface AllProps {
  initActions : any,
  gameActions : any
};

class Card extends React.Component<AllProps> {

  render() {

    return(
      <div id='card_select_div'>
          123
      </div>
    )
  }
}

export default connect( 
  ( { init, game } : StoreState  ) => ({
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch) 
  }) 
)(Card);

import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

export interface AllProps {
  initActions : any,
  gameActions : any,
  select_info : string,
  turn : number | null
};

class Build extends React.Component<AllProps> {

  render() {
    const { turn } = this.props;

    const select_info = JSON.parse(this.props.select_info);
    const my_building = select_info.host === turn;

    console.log(select_info)

    return(
      <div id='build_div'>
          <h3 className='aCenter'> {select_info.fullname} </h3>

          {select_info.host === null
            ? <div id='buy_map_div'>

              </div>
            

            : undefined
          }
      </div>
    )
  }
}

export default connect( 
  ( { init, game } : StoreState  ) => ({
    select_info : game.select_info,
    turn : game.turn
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch) 
  }) 
)(Build);

import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import Player from './player';

export interface AllProps {
  initActions : any,
  list : string,
  _commaMoney : Function
};

class PlayerList extends React.Component<AllProps> {

  render() {
      const props : any = this.props;
      const list = JSON.parse(this.props.list);

    return(
      <div className='game_contents_player_div'>
            {list.map( (el : any, key : number) => {
              let float_style : object = { 'float' : 'left' };

              if(key === 1) {
                float_style = { 'float' : 'right' };
              }

              return(
                <Player
                  key={key}
                  float_style={float_style}
                  info={JSON.stringify(el)}
                  {...props}
                />
              )
            })}
      </div>
    )
  }
}

export default connect( 
  ( { init } : StoreState  ) => ({
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch) 
  }) 
)(PlayerList);

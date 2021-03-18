import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

export interface AllProps {
  initActions : any,
  _flash : Function
};

let twinkle_flash : any = null;
class Loading extends React.Component<AllProps> {

     componentDidMount() {
        const { _flash } = this.props;

        _flash('#game_loading_div', false, 1.4, true, 60, 4000);

        window.setTimeout( () => {
            const target : any = document.getElementById('game_loading_div');
            // target.style.opacity = 1.4;

            _flash('#game_loading_div', true, 0.2, false, 60);
            target.innerText = '로딩 완료';
            
        }, 4300)

    }

  render() {
    return(
      <div id='game_loading_div'>
        게임 로딩 중
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
)(Loading);

import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import Player from './player';
import PlayerList from './player_list';

export interface AllProps {
  initActions : any,
  gameActions : any,
  player_list : string
};

class Game extends React.Component<AllProps> {

  render() {
    const player_list = JSON.parse(this.props.player_list);

    const top_player_list = player_list.slice(0, 2);
    const bottom_player_list = player_list.slice(2, 4);

    return(
      <div id='game_div'>
        <div id='game_other_div'>
          <div id='game_title_div'>
            <h2> 대한의 마블 </h2>
            <p> Blue Marble Of Korea </p>
          </div>

          <div id='game_other_funtion_div'> 
            <div> 게임 방법 </div>
            <div onClick={() => window.confirm('게임을 재시작 하시겠습니까?') ? window.location.reload() : undefined}> 재시작 </div>
          </div>
        </div>

        <div id='game_contents_div'>
          <PlayerList
            list={JSON.stringify(top_player_list)}
          />

          <div id='game_main_contents_div'>

          </div>


          <PlayerList
            list={JSON.stringify(bottom_player_list)}
          />
        </div>
      </div>
    )
  }
}

export default connect( 
  ( { init, game } : StoreState  ) => ({
    player_list : init.player_list
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch)
  }) 
)(Game);

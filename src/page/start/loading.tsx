import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

export interface AllProps {
  initActions : any,
  gameActions : any,
  _flash : Function,
  player_list : string,
  start_price : number,
  round_timer : number
};

class Loading extends React.Component<AllProps> {

    componentDidMount() {
        const { _flash, gameActions } = this.props;

        this._initGameInfo();
        _flash('#game_loading_div', false, 1.4, true, 60, 4000);

        window.setTimeout( () => {
            const target : any = document.getElementById('game_loading_div');
            // target.style.opacity = 1.4;

            _flash('#game_loading_div', true, 0.2, false, 60);
            target.innerText = '로딩 완료';

            window.setTimeout( () => {
                _flash('#game_loading_div', false, 1.4, false, 60);
                _flash('#game_title_div', false, 1.4, false, 60);

                window.setTimeout( () => {
                    gameActions.game_loading({ 'start' : true })

                    window.setTimeout( () => {
                        _flash('#game_div', true, 0, false, 60);
                    }, 100)
                }, 500)
                
            }, 1000)

        }, 4300)

    }

    // 게임 초기 설정하기
    _initGameInfo = () => {
      const { start_price, initActions, gameActions } = this.props;
      const player_list = JSON.parse(this.props.player_list);
      const Map = require('../game/city_info.json');

      // 플레이어 설정하기
      for(let i = 0; i < player_list.length; i++) {
        // 초기 시작 자금 설정
        if(player_list[i]['able'] === true) {
          player_list[i]['money'] = start_price;
          player_list[i]['maps'] = [];
          player_list[i]['location'] = 0;
        }
      }

      // 타이머 관련
      gameActions.set_timer({ 'timer' : '-' });

      // 맵 저장하기
      initActions.set_setting_state({ 
        'map_info' : JSON.stringify(Map), 
      })

      initActions.set_player_info({
        'player_list' : JSON.stringify(player_list)
      })
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
  ( { init } : StoreState  ) => ({
    player_list : init.player_list,
    start_price : init.start_price,
    round_timer : init.round_timer
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch)
  }) 
)(Loading);

import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import PlayerList from './player_list';
import PlayGame from './play_games';

import MapList from '../../source/map.json';
import Map from './map';

export interface AllProps {
  initActions : any,
  gameActions : any,
  player_list : string,
  playing : boolean,
  _flash : Function,
  turn : number,
  round : number,
  round_timer : number,
  timer : string,
  able_player : number
};

const flash_info : any = {
  "flash" : false,
  "opacity" : 1.4,
  "on" : false
};

let game_start_button = false;
let timer_play : any = false;

class Game extends React.Component<AllProps> {

  componentDidMount() {
    // 초기 scrollTop 위치 잡기
    window.scrollTo(0, 80);

    // 초기 무한 플래쉬
    this._infiniteFlash('game_main_start_title', 70, true)
  }

  // 돈 컴마 표시하기
  _commaMoney = (money : number) => {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  _realGameStart = () => {
    const { _flash, gameActions } = this.props;

    if(game_start_button === false) {
      game_start_button = true;
      this._infiniteFlash('game_main_start_title', 70, false);

      window.setTimeout( () => {
        _flash('#game_main_start_ready_div', false, 1.4, false, 40);
        
        return window.setTimeout( () => {
        gameActions.game_loading({ 'playing' : true })

          return window.setTimeout( () => {
            _flash('#play_game_divs', true, 0, false, 40);

            gameActions.round_start({ 'round' : 1, 'turn' : 1 })
            gameActions.set_game_notice_ment({ "main_ment" : "<div> <b class='color_player_1'> 플레이어 1 (나) </b> 부터 시작합니다. </div>" })
  
            return window.setTimeout( () => {
              return this._roundStart('turn');
  
            }, 1000);
          }, 300)
        }, 300);

      }, 300)
    }
  }

  // 라운드 (턴) 시작하기
  _roundStart = (type : string) => {
    const { gameActions, round, turn, _flash, round_timer } = this.props;
    const ment_info = require('../../source/ment.json');
    const player_info = require('../../source/player.json');

    let ment : string = '';
    if(type === 'round') {
      

    } else if(type === 'turn') {
      _flash('#play_main_notice_div', false, 1.4, true, 30, null, 1);

      const player_target : any = document.getElementById(String(turn) + '_player_info_div');
      player_target.style.border = 'solid 3px black';

      if(turn === 1) {
        ment = '<div> 통행 카드를 뽑아주세요. </div>';

      } else {
        ment = `<div> <b class=${'color_player_' + turn}> 플레이어 ${turn} </b>의 턴입니다. </div>`;
      }

      // 타이머 지정하기
      if(round_timer !== 0) {
        const timer_el : any = document.getElementById('timer_slide_div');

        timer_el.style.opacity = 1.4;
        timer_el.style.width = String(6 * round_timer) + 'px';

        gameActions.set_timer({ 'timer' : String(round_timer) })

        // 타이머 가동하기
        timer_play = window.setInterval( () => {
          return this._timer(player_target);
        }, 1000)
      }      

      gameActions.set_game_notice_ment({ 'main_ment' : ment })
      gameActions.round_start({ 'round_start' : true })
    }
  }

  // 타이머 시작 / 종료
  _timer = (_target : any) => {
    const { gameActions, _flash, timer, turn } = this.props;

    if(timer !== '-') {
      gameActions.set_timer({ 'timer' : String(Number(timer) - 1) })
      _flash('#timer_notice_div', false, 1.4, true, 25, null, 1);

      const timer_el : any = document.getElementById('timer_slide_div');
      timer_el.style.width = String(6 * (Number(timer) - 1)) + 'px';

      if((Number(timer) - 1) <= 0) {
        // 턴 종료
        window.clearInterval(timer_play);

        _flash('#timer_slide_div', false, 1.4, false, 30);
        _flash('#playing_action_div', false, 1.4, false, 30);
        _flash('#play_main_notice_div', false, 1.4, false, 30);

        _target.style.border = 'solid 1px #ababab';

        gameActions.set_timer({ 'timer' : '-' })

        window.setTimeout( () => {
          gameActions.round_start({ 'round_start' : false })
          gameActions.set_game_notice_ment({ 'main_ment' : '' })
        }, 300)

        let next_turn = turn + 1;
        return this._nextGames(next_turn);
      }
    }
  }

  // 다음 라운드 (턴 준비)
  _nextGames = (turn : number) => {
    const { gameActions, able_player, _flash } = this.props;

    if(turn <= able_player) {
      gameActions.round_start({ 'turn' : turn });

      return window.setTimeout( () => {
        this._roundStart('turn');

        _flash('#playing_action_div', true, 0, false, 30);
        _flash('#play_main_notice_div', true, 0, false, 30);
      }, 500)

    } else {
      // 턴이 모두 돈 후, 다음 라운드 시작
      gameActions.round_start({ 'turn' : 0 });

    }

  }

  // 무한 플래쉬 효과
  _infiniteFlash = (target : string, timer : number, on : boolean) => {
    const _target : any = document.getElementById(target);

    if(_target) { 
      if(on === true) {
        flash_info['flash'] = window.setInterval( () => {
            _target.style.opacity = flash_info['opacity'];

            if(flash_info['on'] === false) {
              flash_info['opacity'] = flash_info['opacity'] - 0.2;

              if(flash_info['opacity'] <= 0) {
                flash_info['opacity'] = 0;
                flash_info['on'] = true;
              }
            
            } else if(flash_info['on'] === true) {
              flash_info['opacity'] = flash_info['opacity'] + 0.2;

              if(flash_info['opacity'] >= 1.4) {
                flash_info['opacity'] = 1.4;
                flash_info['on'] = false;
              }
            }
        }, timer)

      } else if(on === false) {
        _target.style.opacity = 0;

        return clearInterval(flash_info['flash']);
      }
    }

  }

  render() {
    const player_list = JSON.parse(this.props.player_list);
    const { _commaMoney, _realGameStart } = this;
    const { playing } = this.props;

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
            _commaMoney={_commaMoney}
          />

          <div id='game_main_contents_div'>
            <div id='game_main_map_div'>
                {playing === false 
                ? <div id='game_main_start_ready_div'>
                    <h2 id='game_main_start_title' onClick={game_start_button === false ? _realGameStart : undefined}> 
                      클릭해서 게임을 시작해주세요.
                    </h2>
                  </div>

                : undefined
              }
              {MapList.maps.map( (el : any, key : number) => {

                return(
                  <div key={key} className='game_main_map_divs float_left'>
                    <div id={el.id} className={el.class}>
                      {el.info.map( (cu : any, key_2 : number) => {
                        
                        let class_col : string = '';
                        let style : object = {};
                        let border_style : object = {};

                        if(el.where === 'top' || el.where === 'bottom') {
                          if(el.info.length > (key_2 + 1)) {
                            border_style = { 'borderRight' : 'solid 2px #ababab' }
                          }

                          if(el.where === 'top') {
                            style = { 'borderBottom' : 'solid 2px #ababab' }

                          } else if(el.where === 'bottom') {
                            style = { 'borderTop' : 'solid 2px #ababab' }
                          }

                        } else if(el.where === 'middle') {
                          class_col = 'game_middle_main_map_grid_div';
                        }

                        return(
                          <div key={key_2} className={class_col}
                               style={style}
                          >
                            {el.where !== 'middle'
                              ? <div className='game_top_and_bottom_maps_divs'>
                                  <Map 
                                    class_col={'game_map_columns_divs'}
                                    style={border_style}
                                    info={JSON.stringify(cu)}
                                  />
                                </div>

                              : <div className='game_middle_map_divs'
                                     id={cu.id}
                                  >
                                  {cu.type === 'contents'
                                    ? cu.info.map( (val : any, key_3 : number) => {
                                        let border_style : object = {}

                                        if(cu.info.length > (key_3 + 1)) {
                                          border_style = { 'borderBottom' : 'solid 2px #ababab' }
                                        }

                                        return(
                                            <Map 
                                              key={key_3}
                                              class_col={'game_map_rows_divs'}
                                              style={border_style}
                                              info={JSON.stringify(val)}
                                            />
                                        )
                                    })

                                    : <PlayGame />
                                  }
                                </div>
                            }
                          </div>
                        )

                      })}
                    </div>
                  </div>
                )
              })}

            </div>
          </div>


          <PlayerList
            _commaMoney={_commaMoney}
            list={JSON.stringify(bottom_player_list)}
          />

        </div>
      </div>
    )
  }
}

export default connect( 
  ( { init, game } : StoreState  ) => ({
    player_list : init.player_list,
    playing : game.playing,
    turn : game.turn,
    round : game.round,
    round_timer : init.round_timer,
    timer : game.timer,
    able_player : init.able_player
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch)
  }) 
)(Game);

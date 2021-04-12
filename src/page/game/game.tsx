import * as React from 'react';
import $ from 'jquery';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

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
  functionsActions : any,
  player_list : string,
  playing : boolean,
  _flash : Function,
  turn : number,
  round : number,
  round_timer : number,
  timer : string,
  able_player : number,
  overlap_card : boolean,
  _setCardDeck : Function,
  alert_able : boolean,
  map_info : string,
  _moveCharacter : Function,
  stop_info : string,
  move_event_able : boolean,
  time_over : boolean,
  move_able : boolean,
  card_deck : string,
  card_limit : number,
  select_first_card : number,
  select_last_card : number,
  move_location : number | null,
  casino_start : boolean,
  casino_game_result : boolean | null,
  bank_info : string
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
    const { functionsActions } = this.props;

    // 초기 scrollTop 위치 잡기
    window.scrollTo(0, 80);

    // 초기 무한 플래쉬
    this._infiniteFlash('game_main_start_title', 70, true, null);

    functionsActions.save_function({
      '_commaMoney' : this._commaMoney,
      '_removeAlertMent' : this._removeAlertMent,
      '_playerMoney' : this._playerMoney,
      '_timer' : this._timer,
      '_infiniteFlash' : this._infiniteFlash,
      '_timerOn' : this._timerOn
    })
  }

  // 플레이어 돈 관리하기
  _playerMoney = (player : number, money : number, type : string) => {
    const { initActions } = this.props;
    const player_list = JSON.parse(this.props.player_list);

    if(type === 'plus') {
      // 돈 추가하기
      player_list[player - 1].money += money;

    } else if(type === 'minus') {
      // 돈 삭감하기
      player_list[player - 1].money -= money;
    }

    initActions.set_player_info({ 
      'player_list' : JSON.stringify(player_list)
     })
  }

  // 돈 컴마 표시하기
  _commaMoney = (money : number) => {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  _realGameStart = () => {
    const { _flash, gameActions } = this.props;

    if(game_start_button === false) {
      game_start_button = true;
      this._infiniteFlash('game_main_start_title', 70, false, null);

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
    const { gameActions, round, turn, _flash, round_timer, _setCardDeck } = this.props;
    const stop_info = JSON.parse(this.props.stop_info)
    const player_list = JSON.parse(this.props.player_list);
    const map_info = JSON.parse(this.props.map_info);

    let ment : string = '';
    if(type === 'round') {
      // 라운드 올리기
      gameActions.round_start({ 'round' : round + 1, 'turn' : 1 });
      
      // 카드댁 초기화
      _setCardDeck('init');

      return window.setTimeout( () => {
        return this._roundStart('turn');

      }, 1000);

    } else if(type === 'turn') {

      gameActions.round_start({ 'time_over' : false });

      if(stop_info[turn] > 0) {
        // 무인도에 있을 경우

        stop_info[turn] = stop_info[turn] - 1;
        gameActions.event_info({ 'stop_info' : JSON.stringify(stop_info) })

        return this._turnEnd();
      }

      _flash('#play_main_notice_div', false, 1.4, true, 30, null, 1);
      _flash('#playing_action_div', true, 0, false, 30);

      const player_target : any = document.getElementById(String(turn) + '_player_info_div');
      player_target.style.border = 'solid 3px black';      

      const save_card_info : any = {};
      if(turn === 1) {
        ment = '<div> 내 턴입니다. </div>';
        save_card_info['card_select_able'] = true;

        // gameActions.round_start({ "turn_end_able" : true })

      } else {
        ment = `<div> <b class=${'color_player_' + turn}> 플레이어 ${turn} </b>의 턴입니다. </div>`;

        // 컴퓨터 행동하기
        this._playingComputerAction();
      }

      // 플레이어 현재 위치 파악하기
      const now_location = player_list[turn - 1].location;
      gameActions.move({ 'move_location' : now_location })

      gameActions.select_type({ 'select_info' : JSON.stringify( map_info[now_location] )})

      save_card_info['card_notice_ment'] = "첫번째 통행 카드를 뽑아주세요.";
      gameActions.select_card_info(save_card_info);

      // this._infiniteFlash('player_main_character_' + turn, 60, true);

      // 타이머 지정하기
      if(round_timer !== 0) {
        const timer_el : any = document.getElementById('timer_slide_div');

        timer_el.style.opacity = 1.4;
        timer_el.style.width = String(6 * round_timer) + 'px';

        gameActions.set_timer({ 'timer' : String(round_timer) })

        // 타이머 가동하기
        this._timerOn();
      }      

      gameActions.set_game_notice_ment({ 'main_ment' : ment })
      gameActions.round_start({ 'round_start' : true })
    }
  }

  // 타이머 가동하기
  _timerOn = () => {
    const { round_timer } = this.props;

    if(round_timer !== 0) {
      timer_play = window.setInterval( () => {
        return this._timer(true);
      }, 1000)
    }
  }

  // 타이머 시작 / 종료
  _timer = (start : boolean) => {
    const { gameActions, _flash, timer } = this.props;

    if(start === true) {
      // if(timer !== '-') {
        gameActions.set_timer({ 'timer' : String(Number(timer) - 1) })
        _flash('#timer_notice_div', false, 1.4, true, 25, null, 1);

        const timer_el : any = document.getElementById('timer_slide_div');
        timer_el.style.width = String(6 * (Number(timer) - 1)) + 'px';

        if((Number(timer) - 1) <= 0) {
          // 타임 아웃
          gameActions.round_start({ 'time_over' : true })
          gameActions.select_card_info({ 'card_select_able' : false });

          return this._turnEnd();
        }
      // }

    } else if(start === false) {
      window.clearInterval(timer_play);
    }
  }

  // 다음 라운드 (턴 준비)
  _nextGames = (turn : number) => {
    const { gameActions, able_player, _flash, overlap_card, _setCardDeck } = this.props;

    if(turn <= able_player) {
      gameActions.round_start({ 'turn' : turn });

      // 카드 초기화하기
      if(overlap_card === true) {
        _setCardDeck('init')

      } else {
        // 사용한 카드는 제외하기
        _setCardDeck('reset')
      }

      return window.setTimeout( () => {
        this._roundStart('turn');

        _flash('#playing_action_div', true, 0, false, 30);
        _flash('#play_main_notice_div', true, 0, false, 30);
      }, 500)

    } else {
      // 턴이 모두 돈 후, 다음 라운드 시작
      // gameActions.round_start({ 'turn' : 0 });
      gameActions.select_type({ 'select_tap' : 0 })

      // 플레이어들의 은행 정산하기
      this._setPlayerBank();

      this._roundStart('round');
    }
  }

  _setPlayerBank = () => {
    const { gameActions } = this.props;
    const bank_info = JSON.parse(this.props.bank_info);

    let player = 0;
    for(let key in bank_info) {
      player += 1;

      // 예금 정산하기
      if(bank_info[key].round_incentive) {
        this._playerMoney(player, bank_info[key].round_incentive, 'plus');

        bank_info[key].total_incentive += bank_info[key].round_incentive;
      }

      // 대출 정산하기
    }

    return gameActions.event_info({ 'bank_info' : JSON.stringify(bank_info) });
  }

  // 무한 플래쉬 효과
  _infiniteFlash = (target : string, timer : number, on : boolean, finish_opacity : undefined | null | number) => {
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
        let _finish = 0;
        if(finish_opacity !== undefined && finish_opacity !== null) {
          _finish = finish_opacity;
        }

        _target.style.opacity = _finish;

        return clearInterval(flash_info['flash']);
      }
    }
  }

  // 턴 끝내기
  _turnEnd = async () => {
    const { turn, _flash, gameActions, move_event_able, _moveCharacter, time_over, move_able } = this.props;
    const _target : any = document.getElementById(String(turn) + '_player_info_div');

    this._infiniteFlash('player_main_character_' + turn, 60, false, null);
    _flash('#player_main_character_' + turn, true, 0, false, 30);

    // 턴 종료
    window.clearInterval(timer_play);

    let timer = 200;
    if(time_over === true) {
    // 시간 초과로 인한 상황처리

      if(move_event_able === true) {
        // 김포 공항에서 시간이 초과됐을 경우에는
        // 플레이어를 은행으로 이동시킨다.
        _moveCharacter(8, 20);

        gameActions.event_info({ 'move_event_able' : false });

      } else {
        if(move_able === true) {
          // 카드 뽑기 전인 상태
          gameActions.select_type({ 'select_tap' : 0 });

          // 강제로 랜덤한 카드를 뽑는다.
          await this._drawRandomCard();

          timer = timer * 10;
        }
      }
    }

    window.setTimeout( () => {
      gameActions.move({ 'move_location' : null, 'move_able' : true });
      gameActions.round_start({ 'turn_end_able' : false })

      // if(casino_game_result !== null) {
        // 이벤트 초기화하기
        gameActions.reset_casino();
      // }

      // 카드 섞기
      gameActions.select_card_info({
        'card_select_able' : false,
        'select_first_card' : 0,
        'select_last_card' : 0,
        'all_card_num' : 0
      })

      $('.each_cards_div').animate({
        'marginLeft' : '0px'
      }, 200)

      return window.setTimeout( () => {
        _flash('#card_list_div', false, 1.4, false, 30);

        return window.setTimeout( () => {
          _flash('#timer_slide_div', false, 1.4, false, 30);
          _flash('#playing_action_div', false, 1.4, false, 30);
          _flash('#play_main_notice_div', false, 1.4, false, 30);
      
          _target.style.border = 'solid 1px #ababab';
      
          gameActions.set_timer({ 'timer' : '-' })
      
            window.setTimeout( () => {
              gameActions.round_start({ 'round_start' : false })
              gameActions.set_game_notice_ment({ 'main_ment' : '' })
            }, 300)
      
          const next_turn = turn + 1;
          return this._nextGames(next_turn);
        }, 200)
      }, 200)
    }, timer)
  }

  // 랜덤으로 카드 뽑기
  _drawRandomCard = () => {
    const card_deck = JSON.parse(this.props.card_deck);
    const { card_limit, _moveCharacter, initActions, select_last_card, select_first_card, gameActions, overlap_card } = this.props;

    const save_obj : any = { 'all_card_num' : 0 };

    let cover_first_card = select_first_card;
    const get_random_card : Function = (limit : number) => {
      const random_card = Math.trunc( Math.random() * (card_deck.length - 0) + 0 )

      if( (card_deck[random_card].select === false && card_deck[random_card].use === false) && card_deck[random_card].number !== cover_first_card) {
        card_deck[random_card].select = true;
        
        if(overlap_card === false) {
          card_deck[random_card].use = true;
        }

        initActions.set_setting_state({ 'card_deck' : JSON.stringify(card_deck) });

        const card_number = card_deck[random_card].number;
        save_obj['all_card_num'] += card_number

        const target : any = document.getElementById('each_cards_number_' + card_number);
        let z_idx : number = 100;
        
        if(cover_first_card === 0) {
          save_obj['select_first_card'] = card_number;
          cover_first_card = card_number;

        } else if(select_last_card === 0) {
          save_obj['select_last_card'] = card_number;
          save_obj['all_card_num'] = cover_first_card + card_number;

          limit = 2;

          z_idx = 200;
        }

        $(target).animate({ 'marginTop' : '-30px' }, 300)
        $(target).css({ 
          'zIndex' : z_idx,
          'border' : 'solid 3px black',
          'color' : 'black'
        });
        $(target).text(card_number)

        gameActions.select_card_info(save_obj)

      } else {
        return get_random_card(limit);
      }

      return window.setTimeout( async () => {
        if(limit >= card_limit) {
          gameActions.select_card_info({
            'card_notice_ment' : save_obj['all_card_num'] + ' 칸을 이동합니다.'
          })
          // await _moveCharacter(save_obj['all_card_num'], null);
          await _moveCharacter(1, null);
  
          return initActions.set_setting_state({ 'card_deck' : JSON.stringify(card_deck) });

        } else {
          limit = limit + 1;
  
          return get_random_card(limit);
        }
      }, 500)
    }

    return get_random_card(1);
  }

  // 컴퓨터 행동 함수
  _playingComputerAction = () => {
    const { _moveCharacter, gameActions, turn, move_location } = this.props;
    const player_list = JSON.parse(this.props.player_list);

    gameActions.select_type({ 'select_tap' : 0 })

    window.setTimeout( () => {
      this._drawRandomCard();

      window.setTimeout( () => {
        this._turnEnd();

      }, 2000)
    }, 2000)
  }

  // 부가 메세지 삭제하기
  _removeAlertMent = (ment : string) => {
    const { gameActions, _flash, alert_able } = this.props;

    if(alert_able === true) {
      _flash('#play_additional_notice_div', true, 0, false, 40);

      gameActions.set_game_notice_ment({
        'alert_ment' : ment,
        'alert_able' : false
      })

      return window.setTimeout( () => {
        _flash('#play_additional_notice_div', false, 1.4, false, 40);

        return window.setTimeout( () => {
          gameActions.set_game_notice_ment({
            'alert_ment' : "",
            'alert_able' : true
          })
        }, 300)

      }, 1500)
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

                        let info : any = JSON.stringify(cu);

                        return(
                          <div key={key_2} className={class_col}
                               style={style}
                          >
                            {el.where !== 'middle'
                              ? <div className='game_top_and_bottom_maps_divs'>
                                  <Map 
                                    class_col={'game_map_columns_divs'}
                                    style={border_style}
                                    info={info}
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

                                    : <PlayGame
                                        {...this}
                                    />
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
  ( { init, game, functions } : StoreState  ) => ({
    player_list : init.player_list,
    playing : game.playing,
    turn : game.turn,
    round : game.round,
    round_timer : init.round_timer,
    timer : game.timer,
    able_player : init.able_player,
    overlap_card : init.overlap_card,
    alert_able : game.alert_able,
    map_info : init.map_info,
    _moveCharacter : functions._moveCharacter,
    stop_info : game.stop_info,
    move_event_able : game.move_event_able,
    time_over : game.time_over,
    move_able : game.move_able,
    card_deck : init.card_deck,
    card_limit : init.card_limit,
    select_first_card : game.select_first_card,
    select_last_card : game.select_last_card,
    move_location : game.move_location,
    casino_start : game.casino_start,
    casino_game_result : game.casino_game_result,
    bank_info : game.bank_info
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Game);

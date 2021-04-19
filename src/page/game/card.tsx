import * as React from 'react';
import $ from 'jquery';

import { actionCreators as initActions } from '../../Store/modules/init';
import game, { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

export interface AllProps {
  initActions : any,
  gameActions : any,
  functionsActions : any,
  card_deck : string,
  card_notice_ment : string,
  select_first_card : number,
  select_last_card : number,
  round_start : boolean,
  turn : number | null,
  card_select_able : boolean
  card_limit : number,
  overlap_card : boolean,
  all_card_num : number,
  player_list : string,
  map_info : string,
  move_location : number | null,
  stop_info : string,
  _removeAlertMent : Function,
  _playerMoney : Function,
  time_over : boolean,
  able_player : number,
  _timer : Function,
  stop_days : number
};

class Card extends React.Component<AllProps> {

    componentDidMount() {
        const { functionsActions } = this.props;

        functionsActions.save_function({
            _moveCharacter : this._moveCharacter
        })
    }

  _toggleCardEvent = (event : any, type : string, key : number) => {
    const target = event !== null ? event.target : document.getElementById(event);
    const card_deck : any = JSON.parse(this.props.card_deck);

    const { time_over } = this.props;
    const able = card_deck[key].select === false && card_deck[key].use === false && time_over === false

        if(able === true) {
            if(type === 'on') {
                target.style.border = 'solid 3px black';
                target.style.color = 'black';

            } else if(type === 'off') {
                target.style.border = 'dotted 3px #ababab';
                target.style.color = '#bbbbbb';

            } else if(type === 'click') {
                const { card_limit, overlap_card, select_first_card, all_card_num, initActions, gameActions} = this.props;

                if(time_over === true) {
                    return;
                }

                let select_num : number | null = null;
                const save_obj : any = { 'all_card_num' : all_card_num };

                let z_idx = 100;
                if(key !== null) {
                    if(card_deck[key].select === false && card_deck[key].use === false) {
                        select_num = card_deck[key].number;
                        card_deck[key].select = true;

                        if(overlap_card === false) {
                            card_deck[key].use = true;
                        }

                        if(select_first_card === 0) {
                            save_obj['select_first_card'] = card_deck[key].number;  
                            save_obj['all_card_num'] += card_deck[key].number;

                            if(card_limit === 1) {
                                save_obj['card_select_able'] = false;

                            } else {
                                save_obj['card_notice_ment'] = '두번째 통행 카드를 뽑아주세요.'
                            }
                            
                        } else {
                            if(card_limit > 1) {
                                save_obj['select_last_card'] = card_deck[key].number;
                                save_obj['all_card_num'] += card_deck[key].number;

                                save_obj['card_select_able'] = false;
                                z_idx = 200;
                            }
                        }

                    } else {
                        alert('이미 선택된 카드입니다.');
                    }
                }

                if(save_obj['card_select_able'] === false) {
                    save_obj['card_notice_ment'] = save_obj['all_card_num'] + ' 칸을 이동합니다.';

                    // this._moveCharacter(save_obj['all_card_num'], null);
                    this._moveCharacter(20, null) //
                }

                initActions.set_setting_state({ 'card_deck' : JSON.stringify(card_deck) })
                gameActions.select_card_info(save_obj);

                $(target).animate({ 'marginTop' : '-30px' }, 200);
                $(target).css({ 'zIndex' : z_idx });
            }
        }
    }

    // 캐릭터 움직이기
    _moveCharacter = (move : number, _player_location : undefined | null | number) => {
        const { turn, gameActions, _removeAlertMent, _playerMoney } = this.props;
        const player_list = JSON.parse(this.props.player_list);

        let my_location : number = 0;
        if(_player_location !== undefined && _player_location !== null) {
            my_location = _player_location;

        } else {
            my_location = player_list[Number(turn) - 1].location;
        }
        // const my_location : number = 10;

        // 캐릭터의 현재 위치 + 이동할 위치
        let move_location = my_location + move;

        if(move_location > 27) {
            move_location = move_location - 28;
        }
        gameActions.move({ 'move_location' : move_location });

        let circle : boolean = false;
        // 이동하기

        const move_map_obj = {
            "1" : 0,
            "2" : 0,
            "3" : 0,
            "4" : 0
        }

        const _moveAction = (location : number) => {

            let start : number = 0;
            // 이동거리 구하기
            const get_move_map_info : Function = (_location : number, limit : number) => {

                if(limit <= 0) {
                    return move_map_obj;

                } else {
                    _location = _location + 1;
                    if(_location > 27) {
                        _location = 0;
                        // 맵을 한 바퀴 돌았을 경우
                        circle = true;
                    }

                    if(_location > 0 && _location <= 6) {
                        move_map_obj["1"] += 1;

                        if(start === 0) {
                            start = 1;
                        }


                    } else if(_location > 6 && _location <= 14) {
                        move_map_obj["2"] += 1;

                        if(start === 0) {
                            start = 2;
                        }

                    } else if(_location > 14 && _location <= 20) {
                        move_map_obj["3"] += 1;

                        if(start === 0) {
                            start = 3;
                        }

                    } else if(_location > 20 && _location <= 27 || _location === 0) {
                        move_map_obj["4"] += 1;

                        if(start === 0) {
                            start = 4;
                        }
                    }

                    limit = limit - 1;

                    return get_move_map_info(_location, limit);
                }
                
            }; // 함수 끝

            const move_obj = get_move_map_info(location, move);

            const move_character = (obj : any, num : number, _location : number) => {
                const { turn } = this.props;

                const target : any = document.getElementById('player_main_character_' + turn);

                // 현재 left 위치
                const player_left : number = Number( target.style.marginLeft.slice(0, target.style.marginLeft.indexOf("px")) );

                // 현재 top 위치
                const player_top : number = Number( target.style.marginTop.slice(0, target.style.marginTop.indexOf("px")) );

                let player_move_location = _location + obj[num];

                if(num === 1) {
                    $(target).animate({ 'marginLeft' : ( player_left + ( (player_move_location - _location) * -88.5) ) + 'px' }, 300);
                    // $(target).animate({ 'marginLeft' : ( (player_move_location * -84.5) ) + 'px' }, 300);

                } else if(num === 2) {
                    
                    if(player_move_location === 14) {
                        $(target).animate({ 'marginTop' : '-650px' }, 300);

                    } else {
                        $(target).animate({ 'marginTop' : (player_top + ( (player_move_location - _location) * -80 ) - 10) + 'px' }, 300);
                    }
                    // $(target).animate({ 'marginTop' : ( (player_move_location - 6) * -80 ) - 10 + 'px' }, 300);

                } else if(num === 3) {
                    // const player_left : number = Number( target.style.marginLeft.slice(0, target.style.marginLeft.indexOf("px")) );

                    // const move_left : number = player_left + ( obj[num] * 86.5 );
                    // $(target).animate({ 'marginLeft' : move_left + 'px' }, 300);

                    $(target).animate({ 'marginLeft' : ( player_left + ( (player_move_location - _location) * 88.5) ) + 'px' }, 300);

                } else if(num === 4) {
                    // const player_top : number = Number( target.style.marginTop.slice(0, target.style.marginTop.indexOf("px")) );
                    // const move_top = player_top + ( obj[num] * 82 );

                    // $(target).animate({ 'marginTop' : move_top + 'px' }, 300);

                    if(circle === false) {
                        $(target).animate({ 'marginTop' : (player_top + ( (player_move_location - _location) * 80 ) + 4) + 'px' }, 300);

                    } else if(circle === true) {
                        $(target).animate({ 'marginTop' : '-10px' }, 300);
                    }
                }

                obj[num] = 0;

                if(obj[num + 1] > 0 || (num === 4 && obj[1] > 0)) {
                    if(num === 4) {
                        num = 0;
                        player_move_location = 0;

                        circle = true;
                        // 한바퀴 순환

                        // 순환시 현재 자금의 10% 추가
                        _removeAlertMent('은행으로부터 50 만원의 추가금을 받았습니다.');
                        _playerMoney(turn, 50, 'plus');
                    }

                    return window.setTimeout( () => {
                        move_character(obj, num + 1, player_move_location);
                    }, 300)

                } else {
                    return window.setTimeout( () => {
                        this._action(move_location);
                    }, 300)
                }
            }

            return move_character(move_obj, start, my_location);
        }

        return _moveAction(my_location);
    }

    // 이동 후 액션취하기
    _action = (arrive : number) => {
        const { turn, initActions, gameActions, time_over, _removeAlertMent, _timer, stop_days } = this.props;
        const player_list : any = JSON.parse(this.props.player_list);

        const city : any = JSON.parse(this.props.map_info);
        const city_info = city[String(arrive)];

        let select_type : string = city_info.type;

        player_list[Number(turn) - 1].location = arrive;

        let turn_end = { 'turn_end_able' : true };
        let tap_info = 1;
        if(city_info.type === 'event') {
            if(city_info.number === 6) {
                // 무인도
                tap_info = 2;
                
                const stop_info : any = JSON.parse(this.props.stop_info);
                stop_info[Number(turn)] = stop_days;

                gameActions.event_info({ 'stop_info' : JSON.stringify(stop_info) })

            } else if(city_info.number === 14) {
                // 카지노
                tap_info = 3;
                turn_end['turn_end_able'] = false;

                gameActions.event_info({ 'casino_start' : true })
                _timer(false)

            } else if(city_info.number === 20) {
                // 김포공항
                tap_info = 4;

                gameActions.event_info({ 'move_event_able' : true });

            } else if(city_info.number === 0) {
                // 은행
                tap_info = 5;

                _removeAlertMent('은행으로부터 50 만원의 추가금을 받았습니다.');
                player_list[Number(turn) - 1].money += 50;    

                gameActions.player_bank_info({ 'player_bank_info_alert' : true })
            }
        }

        if(time_over === true) {
            tap_info = 0;

            gameActions.round_start({ 'time_over' : false })
        }
        
        gameActions.round_start(turn_end)
        gameActions.move({ 'move_able' : false });;
        gameActions.select_type({ 'select_type' : select_type, 'select_info' : JSON.stringify(city_info), "select_tap" : tap_info })
        initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) })
    }

  render() {
      const { 
          card_notice_ment, select_first_card, select_last_card, turn, round_start, card_select_able,
          card_limit, time_over
        } = this.props;
      const card_deck = JSON.parse(this.props.card_deck);
      const { _toggleCardEvent } = this;

      const toggle_able = card_select_able === true && round_start === true && turn === 1 && time_over === false;

    return(
      <div id='card_select_div' className='aLeft'>

        <div id='card_notice_div'>
            <p id='card_notice_ment_div'> {card_notice_ment} </p>
        </div>

        <div id='card_grid_div'>
            <div id='card_list_div'>
            {card_deck.map( (el : any, key : number) => {
                const card_num : number = Number(el.number);
                const left_style = { 'marginLeft' : 20 * key + 'px', 'zIndex' : key };

            return(
                <div className='each_cards_div' key={key} style={left_style}
                    onMouseEnter={(event) => toggle_able === true ? _toggleCardEvent(event, 'on', key) : undefined}
                    onMouseOut={(event) => toggle_able === true ? _toggleCardEvent(event, 'off', key) : undefined}
                    onClick={(event) => toggle_able === true ? _toggleCardEvent(event, 'click', key) : undefined}
                    id={'each_cards_number_' + card_num}
                >
                    {el.select === false ? '?' : card_num}
                </div>
            )  
            })}
            </div>

            <div id='card_result_div'>
                <div className='card_result_divs'
                    style={card_limit === 1 ? { 'marginTop' : '25px' } : undefined}
                > 
                    첫번째 카드 
                    <div>
                        {select_first_card === 0 ? '-' : select_first_card}
                    </div>
                </div>

                {card_limit !== 1
                    ? <div id='last_select_card_div'>
                        <div className='card_result_divs'> 
                            두번째 카드 

                            <div>
                                {select_last_card === 0 ? '-' : select_last_card}
                            </div>
                        </div>
                    </div>

                    : undefined
                }
            </div>
        </div>
        
      </div>
    )
  }
}

export default connect( 
  ( { init, game, functions } : StoreState  ) => ({
    card_deck : init.card_deck,
    card_notice_ment : game.card_notice_ment,
    select_first_card : game.select_first_card,
    select_last_card : game.select_last_card,
    round_start : game.round_start,
    turn : game.turn,
    card_select_able : game.card_select_able,
    card_limit : init.card_limit,
    overlap_card : init.overlap_card,
    all_card_num : game.all_card_num,
    player_list : init.player_list,
    map_info : init.map_info,
    move_location : game.move_location,
    stop_info : game.stop_info,
    _removeAlertMent : functions._removeAlertMent,
    _playerMoney : functions._playerMoney,
    time_over : game.time_over,
    able_player : init.able_player,
    _timer : functions._timer,
    stop_days : init.stop_days
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions: bindActionCreators(functionsActions, dispatch),
  }) 
)(Card);

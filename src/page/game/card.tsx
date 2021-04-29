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
  stop_days : number,
  _addLog : Function,
  round : number,
  _splitMoneyUnit : Function,
  _minusPlayerMoney : Function,
  pass_price : number,
  _setPlayerRank : Function,
  game_over : boolean,
  _checkPlayerMoney : Function,
  _turnEnd : Function,
  _buyMap : Function,
  _checkLandMark : Function,
  _build : Function
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

    const { time_over, game_over } = this.props;
    const able = card_deck[key].select === false && card_deck[key].use === false && time_over === false && game_over === false

        if(able === true) {
            if(type === 'on') {
                target.style.border = 'solid 3px black';
                target.style.color = 'black';

            } else if(type === 'off') {
                target.style.border = 'dotted 3px #ababab';
                target.style.color = '#bbbbbb';

            } else if(type === 'click') {
                const { card_limit, overlap_card, select_first_card, all_card_num, initActions, gameActions } = this.props;

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
                    this._moveCharacter(6, null) //

                    // 김포공항행

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
        const { turn, gameActions, _removeAlertMent, _playerMoney, round } = this.props;
        const player_list = JSON.parse(this.props.player_list);
        const map_info = JSON.parse(this.props.map_info);

        let my_location : number = 0;
        if(_player_location !== undefined && _player_location !== null) {
            my_location = _player_location;

        } else {
            my_location = player_list[Number(turn) - 1].location;
        }

        let now_location = map_info[my_location].name;

        if(my_location === 0 && round > 1) {
            now_location = '은행';
        }

        const log_ment = `<div class='game_alert_2'> ${move} 칸 이동 ( ${now_location}　=>　`;

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
                const { turn, _addLog } = this.props;
                const move_list = require('../../source/move.json');

                const target : any = document.getElementById('player_main_character_' + turn);

                // 현재 left 위치
                const player_left : number = Number( target.style.marginLeft.slice(0, target.style.marginLeft.indexOf("px")) );

                // 현재 top 위치
                // const player_top : number = Number( target.style.marginTop.slice(0, target.style.marginTop.indexOf("px")) );

                let player_move_location = _location + obj[num];

                if(num === 1) {
                    $(target).animate({ 'marginLeft' : ( player_left + ( (player_move_location - _location) * -88.5) ) + 'px' }, 300);
                    // $(target).animate({ 'marginLeft' : ( (player_move_location * -84.5) ) + 'px' }, 300);

                } else if(num === 2) {
                    const move : number = move_list[player_move_location];
                    $(target).animate({ 'marginTop' : move + 'px' }, 300);

                } else if(num === 3) {
                    // const player_left : number = Number( target.style.marginLeft.slice(0, target.style.marginLeft.indexOf("px")) );

                    // const move_left : number = player_left + ( obj[num] * 86.5 );
                    // $(target).animate({ 'marginLeft' : move_left + 'px' }, 300);

                    $(target).animate({ 'marginLeft' : ( player_left + ( (player_move_location - _location) * 88.5) ) + 'px' }, 300);

                } else if(num === 4) {
                    // console.log(player_move_location)
                    // const move : number = move_list[player_move_location];
                    // $(target).animate({ 'marginTop' : move + 'px' }, 300);

                    // const player_top : number = Number( target.style.marginTop.slice(0, target.style.marginTop.indexOf("px")) );
                    // const move_top = player_top + ( obj[num] * 82 );

                    // $(target).animate({ 'marginTop' : move_top + 'px' }, 300);

                    if(circle === false) {
                        const move : number = move_list[player_move_location];
                        $(target).animate({ 'marginTop' : move + 'px' }, 300);
                        // $(target).animate({ 'marginTop' : (player_top + ( (player_move_location - _location) * 80 ) + 4) + 'px' }, 300);

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

                        // 순환시 지원금 50 만원 추가
                        _removeAlertMent('은행으로부터 50 만원의 추가금을 받았습니다.');
                        _addLog(`<div class='game_alert color_player_${turn}'> 은행으로부터 지원금 50 만원을 받았습니다. </div>`);

                        window.setTimeout(() => {
                            this.props.gameActions.event_info({ 'rank_update' : true })                            
                        }, 200);

                        player_list[Number(turn) - 1].money += 50;
                        _playerMoney(turn, 50, 'plus');
                    }

                    return window.setTimeout( () => {
                        move_character(obj, num + 1, player_move_location);
                    }, 300)

                } else {
                    return window.setTimeout( () => {
                        this._action(move_location, log_ment, player_list);
                    }, 300)
                }
            }

            return move_character(move_obj, start, my_location);
        }

        return _moveAction(my_location);
    }

    // 이동 후 액션취하기
    _action = (arrive : number, log_ment : string, player_list : any) => {
        const { 
            turn, initActions, gameActions, time_over, _removeAlertMent, _timer, stop_days, _addLog, 
            round, _splitMoneyUnit, _minusPlayerMoney
        } = this.props;
        // const player_list : any = JSON.parse(this.props.player_list);
        const _pass_price = this.props.pass_price;

        const city : any = JSON.parse(this.props.map_info);
        const city_info = city[String(arrive)];

        let city_name = city_info.name;
        if(round > 1 && city_info.number === 0) {
            city_name = '은행';
        }

        log_ment += city_name + ' )';
        _addLog(log_ment);

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

                gameActions.event_info({ 'stop_info' : JSON.stringify(stop_info), 'now_stop' : stop_days })

                _addLog(`<div class='game_alert white back_black'> 무인도에 떨어졌습니다. <br /> <b class='red'> ${stop_days} 라운드 </b> 후에 탈출 할 수 있습니다. </div>`);

            } else if(city_info.number === 14) {
                // 카지노
                tap_info = 3;
                gameActions.event_info({ 'casino_start' : true })

                if(player_list[Number(turn) - 1].money > 0) {
                    turn_end['turn_end_able'] = false;

                    _timer(false)

                    _addLog(`<div class='game_alert'> 카지노에 도착했습니다. <br /> 배팅을 시작해주세요. </div>`);
                
                } else {
                    _addLog(`<div class='game_alert'> 현금이 없어 카지노를 이용할 수 없습니다. </div>`);
                }

            } else if(city_info.number === 20) {
                // 김포공항
                tap_info = 4;

                gameActions.event_info({ 'move_event_able' : true });

                _addLog(`<div class='game_alert'> 이동하고 싶은 장소를 선택해주세요. </div>`);

            } else if(city_info.number === 0) {
                // 은행
                tap_info = 5;

                _removeAlertMent('은행으로부터 50 만원의 지원금을 받았습니다.');
                _addLog(`<div class='game_alert color_player_${turn}'> 은행으로부터 지원금 50 만원을 받았습니다. </div>`);

                window.setTimeout(() => {
                    this.props.gameActions.event_info({ 'rank_update' : true })                            
                }, 200);

                player_list[Number(turn) - 1].money += 50;    

                gameActions.player_bank_info({ 'player_bank_info_alert' : true })
            }
        } else if(city_info.type === 'map') {
            if(city_info.host !== null && turn !== city_info.host) {
                // 상대방 땅에 도착함
                const pass_price = _splitMoneyUnit(city_info.pass * _pass_price);

                let arrive_name = city_info.name;
                if(arrive_name === '경기 광명') {
                    arrive_name = '광명';
                }

                _addLog(`<div class='game_alert'> <b class='color_player_${turn}'> ${turn} 플레이어</b>가 <b class='color_player_${city_info.host}'> ${city_info.host} 플레이어</b>의 <b class='custom_color_1'>${arrive_name}</b>에 도착합니다. <br /> <b class='red'>${pass_price}</b>을 통행료로 지불합니다.  </div>`);
                
                // 도착한 플레이어의 돈 감소
                const remove_money = _minusPlayerMoney(turn, city_info.pass * _pass_price, null, true);
                player_list = remove_money['player'];

                player_list[Number(turn) - 1].location = arrive;

                // 토지 소유주의 돈 증가
                player_list[city_info.host - 1].money += city_info.pass * _pass_price;
            }
        }

        if(time_over === true) {
            tap_info = 0;

            gameActions.round_start({ 'time_over' : false })
        }
        
        gameActions.round_start(turn_end)
        gameActions.move({ 'move_able' : false });;
        gameActions.select_type({ 'select_type' : select_type, 'select_info' : JSON.stringify(city_info), "select_tap" : tap_info })
        initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) });

        if(Number(turn) > 1) {
            window.setTimeout( () => {
                // 컴퓨터 행동 함수 실행하기
                return this._actionComputer(Number(turn), city_info, player_list);
            }, 500)
        }
    }

    // 컴퓨터 행동 알고리즘
    _actionComputer = (player : number, city : any, player_list : any) => {
        const { _checkPlayerMoney, _turnEnd, gameActions } = this.props;

        // 플레이어의 현재 자산 + 은행 자산
        const my_money = _checkPlayerMoney(player);

        // 도착한 토지의 타입 파악
        if(city.type === 'map') {
            // 일반 맵
            if(city.host !== null) {
                // 주인이 있는 경우 
                
                // (상대 플레이어의 토지인 경우) 바로 턴 종료
                if(city.host !== player) {
                    return this._computerTurnEnd();

                } else {
                    // 내가 구매한 토지인 경우
                    // 건설을 위한 알고리즘 실행
                    return this._computerBuild(player, 'build', player_list, city);
                }

            } else if(city.host === null) {
                // 주인이 없는 경우 토지 구매에 대한 알고리즘 실행
                return this._computerBuild(player, 'land', player_list, city);
            }

        } else if(city.type === 'event') {
            // 이벤트 맵
            if(city.number === 6) {
                // 무인도에 도착할 경우 바로 턴 종료
                return this._computerTurnEnd();

            } else if(city.number === 14) {
                // 카지노

            } else if(city.number === 20) {
                // 김포공항

            } else if(city.number === 0) {
                // 은행
            }
        }
    }

    // 컴퓨터 턴 종료
    _computerTurnEnd = () => {
        const { _turnEnd, turn } = this.props;

        return window.setTimeout( () => {
            return _turnEnd(turn);
        }, 500)
    }

    // 컴퓨터 토지 구매 및 건설 알고리즘 함수
    _computerBuild : Function = async (player : number, type : string, player_list : any, city : any) => {
        // type = land : 토지 구매, build : 건설
        const { _checkPlayerMoney, _buyMap } = this.props;

        // 플레이어의 현재 자산 + 은행 자산
        const my_money = _checkPlayerMoney(player);

        // 구매 확률
        let able : any = null;
        if(type === 'land') {
            // 토지 구매하기
            if(my_money > city.price) {
                // 컴퓨터의 토지 구매확률 구하기
                able = await this._computerBuyPercent(50, city, 'land', city.price);

                // 알고리즘을 통해 구매에 확정할 경우
                if(able === true) {
                    return setTimeout( () => {
                        _buyMap('click', player_list[player - 1], city);

                        // 토지 구매후 건설을 위한 함수 재실행
                        return window.setTimeout( () => {
                            // return this._computerTurnEnd();
                            return this._computerBuild(player, 'build', player_list, city);
                        }, 500)
                    }, 500);
                }

            } else {
                // 돈 부족할 경우 바로 턴 종료
                return this._computerTurnEnd();
            }

        } else if(type === 'build') {
            // 건설하기
            return this._computerBuyPercent(50, city, 'build', 0);
        }

        if(able === false) {
            return this._computerTurnEnd();
        }
    }

    // 확률
    _computerBuyPercent = (percent : number, city : any, type : string, buy_money : number) => {
        // percent : 시작 확률
        const { turn, _checkPlayerMoney, _checkLandMark, _build } = this.props;
        const my_money = _checkPlayerMoney(turn);

        if(type === 'land') {
            const player_list = JSON.parse(this.props.player_list);

            // 소유중인 토지의 갯수에 따라 확률 조정
            const my_maps : number = player_list[Number(turn) - 1].maps.length
            if(my_maps >= 0 && my_maps < 4) {
                // 소유 토지가 0개 이상, 4개 미만일 경우 (0 ~ 3개)
                percent += 20;

            } else if(my_maps >= 4 && my_maps < 8) {
                // 소유 토지가 4개 이상, 8개 미만일 경우 (4 ~ 7개)
                percent -= 5;

            } else if(my_maps >= 8) {
                // 소유 토지가 8개 이상일 경우
                percent -= 10;
            }

        } else if(type === 'build') {
            // 랜드마크 건설 여부 확인 : true 일 경우 랜드마크 건설 가능
            const lendmark_able = _checkLandMark(city);

            if(lendmark_able === false) {
                // 랜드마크 구매가 불가능한 상황
                let key : number = 0;

                const build_loop : Function = () => {
                    if(key === 3) {
                        return;
                    }

                    if(city.build[key].build === false) {
                    // 건설되지 않을 경우만 실행
                    const my_money : number = _checkPlayerMoney(turn);

                    if(my_money >= city.build[key].price) {
                        const able = this._computerBuyPercent(50, city, 'check', city.build[key].price);
                        if(able === true) {
                            // 건설하기
                            _build('click', key, city);

                            return window.setTimeout( () => {
                                key += 1;

                                if(key === 3) {
                                    return;

                                } else {
                                    return build_loop();
                                }
                            }, 800)

                        } else {
                            return window.setTimeout( () => {
                                key += 1;
                                return build_loop();
                            }, 800)
                        }

                        } else {
                            // 구매할 돈이 없다면 바로 턴 종료
                            return this._computerTurnEnd();
                        }

                    } else {
                        key += 1;
                        return build_loop();
                    }
                }

                return window.setTimeout( () => {
                    return build_loop()
                }, 800)

            } else if(lendmark_able === true) {
                // 랜드마크 구매 가능
                // return this._computerBuyPercent(50, city, 'check', city.build[3].price);
            }
        }

        const extra_money : number = Number(my_money - buy_money);
        if(extra_money <= 0 && extra_money > 20) {
            // 구매 후 남은 자산이 0 만원 ~ 20 만원 사이
            percent -= 30;
    
        } else if(extra_money <= 20 && extra_money > 40) {
            // 구매 후 남은 자산이 20 만원 ~ 40 만원 사이
            percent -= 15;

        } else if(extra_money <= 40 && extra_money > 60) {
            // 구매 후 남은 자산이 40 만원 ~ 60 만원 사이
            percent += 5;

        } else if(extra_money <= 60 && extra_money > 80) {
            // 구매 후 남은 자산이 60 만원 ~ 80 만원 사이
            percent += 15;

        } else if(extra_money <= 80 && extra_money > 100) {
            // 구매 후 남은 자산이 80 만원 ~ 100 만원 사이
            percent += 20;

        } else if(extra_money <= 100) {
            // 구매 후 남은 자산이 100 만원 이상
            percent += 30;
        }

        percent = percent > 100 ? 100 : percent;
        const random = Math.floor( Math.random() * (100 - 0) + 0 );

        if(percent >= random) {
            // 확률이 랜덤 숫자보다 클 경우 true
            return true;

        } else {
            return false;
        }
    }

  render() {
      const { 
          card_notice_ment, select_first_card, select_last_card, turn, round_start, card_select_able,
          card_limit, time_over, game_over
        } = this.props;
      const card_deck = JSON.parse(this.props.card_deck);
      const { _toggleCardEvent } = this;

      const toggle_able = card_select_able === true && round_start === true && turn === 1 && time_over === false && game_over === false;

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
    stop_days : init.stop_days,
    _addLog : functions._addLog,
    round : game.round,
    _splitMoneyUnit : functions._splitMoneyUnit,
    _minusPlayerMoney : functions._minusPlayerMoney,
    pass_price : init.pass_price,
    _setPlayerRank : functions._setPlayerRank,
    game_over : game.game_over,
    _checkPlayerMoney : functions._checkPlayerMoney,
    _turnEnd : functions._turnEnd,
    _buyMap : functions._buyMap,
    _checkLandMark : functions._checkLandMark,
    _build : functions._build
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions: bindActionCreators(functionsActions, dispatch),
  }) 
)(Card);

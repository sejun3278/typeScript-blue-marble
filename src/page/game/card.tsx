import * as React from 'react';
import $ from 'jquery';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
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
  _build : Function,
  _bettingGameStart : Function,
  _selectCard : Function,
  casino_select_card : number
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

                // let select_num : number | null = null;
                const save_obj : any = { 'all_card_num' : all_card_num };

                let z_idx = 100;
                if(key !== null) {
                    if(card_deck[key].select === false && card_deck[key].use === false) {
                        // select_num = card_deck[key].number;
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
                                save_obj['card_notice_ment'] = '????????? ?????? ????????? ???????????????.'
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
                        alert('?????? ????????? ???????????????.');
                    }
                }

                if(save_obj['card_select_able'] === false) {
                    save_obj['card_notice_ment'] = save_obj['all_card_num'] + ' ?????? ???????????????.';

                    this._moveCharacter(save_obj['all_card_num'], null);
                    // this._moveCharacter(10, null) //

                    // ???????????????

                }

                initActions.set_setting_state({ 'card_deck' : JSON.stringify(card_deck) })
                gameActions.select_card_info(save_obj);

                $(target).animate({ 'marginTop' : '-30px' }, 200);
                $(target).css({ 'zIndex' : z_idx });
            }
        }
    }

    // ????????? ????????????
    _moveCharacter = (move : number, _player_location : undefined | null | number) => {
        const { turn, gameActions, _removeAlertMent, _playerMoney, round } = this.props;
        const player_list = JSON.parse(this.props.player_list);
        const map_info = JSON.parse(this.props.map_info);

        gameActions.event_info({ 'move_event_able' : false })

        let my_location : number = 0;
        if(_player_location !== undefined && _player_location !== null) {
            my_location = _player_location;

        } else {
            my_location = player_list[Number(turn) - 1].location;
        }

        let now_location = map_info[my_location].name;

        if(my_location === 0 && round > 1) {
            now_location = '??????';
        }

        const log_ment = `<div class='game_alert_2'> ${move} ??? ?????? ( ${now_location}???=>???`;

        // ???????????? ?????? ?????? + ????????? ??????
        let move_location = my_location + move;

        if(move_location > 27) {
            move_location = move_location - 28;
        }
        gameActions.move({ 'move_location' : move_location });

        let circle : boolean = false;
        // ????????????

        const move_map_obj = {
            "1" : 0,
            "2" : 0,
            "3" : 0,
            "4" : 0
        }

        const _moveAction = (location : number) => {

            let start : number = 0;
            // ???????????? ?????????
            const get_move_map_info : Function = (_location : number, limit : number) => {

                if(limit <= 0) {
                    return move_map_obj;

                } else {
                    _location = _location + 1;
                    if(_location > 27) {
                        _location = 0;
                        // ?????? ??? ?????? ????????? ??????
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

                    } else if( (_location > 20 && _location <= 27) || _location === 0) {
                        move_map_obj["4"] += 1;

                        if(start === 0) {
                            start = 4;
                        }
                    }

                    limit = limit - 1;

                    return get_move_map_info(_location, limit);
                }
                
            }; // ?????? ???

            const move_obj = get_move_map_info(location, move);

            const move_character = (obj : any, num : number, _location : number) => {
                const { turn, _addLog } = this.props;
                const move_list = require('../../source/move.json');

                const target : any = document.getElementById('player_main_character_' + turn);

                // ?????? left ??????
                const player_left : number = Number( target.style.marginLeft.slice(0, target.style.marginLeft.indexOf("px")) );

                // ?????? top ??????
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
                        // ????????? ??????

                        // ????????? ????????? 50 ?????? ??????
                        _removeAlertMent('?????????????????? 50 ????????? ???????????? ???????????????.');
                        _addLog(`<div class='game_alert color_player_${turn}'> ?????????????????? ????????? 50 ????????? ???????????????. </div>`);

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

    // ?????? ??? ???????????????
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
            city_name = '??????';
        }

        log_ment += city_name + ' )';
        _addLog(log_ment);

        let select_type : string = city_info.type;

        player_list[Number(turn) - 1].location = arrive;

        let turn_end = { 'turn_end_able' : true };
        let tap_info = 1;
        if(city_info.type === 'event') {
            if(city_info.number === 6) {
                // ?????????
                tap_info = 2;
                
                const stop_info : any = JSON.parse(this.props.stop_info);
                stop_info[Number(turn)] = stop_days;

                gameActions.event_info({ 'stop_info' : JSON.stringify(stop_info), 'now_stop' : stop_days })

                _addLog(`<div class='game_alert white back_black'> ???????????? ??????????????????. <br /> <b class='red'> ${stop_days} ????????? </b> ?????? ?????? ??? ??? ????????????. </div>`);

            } else if(city_info.number === 14) {
                // ?????????
                tap_info = 3;
                gameActions.event_info({ 'casino_start' : true })

                if(player_list[Number(turn) - 1].money > 0) {
                    turn_end['turn_end_able'] = false;

                    _timer(false)

                    _addLog(`<div class='game_alert'> ???????????? ??????????????????. <br /> ????????? ??????????????????. </div>`);
                
                } else {
                    _addLog(`<div class='game_alert'> ????????? ?????? ???????????? ????????? ??? ????????????. </div>`);
                }

            } else if(city_info.number === 20) {
                // ????????????
                tap_info = 4;

                gameActions.event_info({ 'move_event_able' : true });

                _addLog(`<div class='game_alert'> ???????????? ?????? ????????? ??????????????????. </div>`);

            } else if(city_info.number === 0) {
                // ??????
                tap_info = 5;

                _removeAlertMent('?????????????????? 50 ????????? ???????????? ???????????????.');
                _addLog(`<div class='game_alert color_player_${turn}'> ?????????????????? ????????? 50 ????????? ???????????????. </div>`);

                window.setTimeout(() => {
                    this.props.gameActions.event_info({ 'rank_update' : true })                            
                }, 200);

                player_list[Number(turn) - 1].money += 50;    

                gameActions.player_bank_info({ 'player_bank_info_alert' : true })
            }

        } else if(city_info.type === 'map') {
            if(city_info.host !== null && turn !== city_info.host) {
                // ????????? ?????? ?????????
                const pass_price = _splitMoneyUnit(city_info.pass * _pass_price);

                let arrive_name = city_info.name;
                if(arrive_name === '?????? ??????') {
                    arrive_name = '??????';
                }

                initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) });

                _addLog(`<div class='game_alert'> <b class='color_player_${turn}'> ${turn} ????????????</b>??? <b class='color_player_${city_info.host}'> ${city_info.host} ????????????</b>??? <b class='custom_color_1'>${arrive_name}</b>??? ???????????????. <br /> <b class='red'>${pass_price}</b>??? ???????????? ???????????????.  </div>`);
                
                // ????????? ??????????????? ??? ??????
                const remove_money = _minusPlayerMoney(turn, city_info.pass * _pass_price, null, true);
                player_list = remove_money['player'];

                player_list[Number(turn) - 1].location = arrive;

                // ?????? ???????????? ??? ??????
                player_list[city_info.host - 1].money += city_info.pass * _pass_price;
                initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) });

                if(remove_money.result === false) {
                    // ?????? ?????? ?????? ??????
                    gameActions.settle_player_money({ 'settle_extra_money' : remove_money['extra'] });
                    gameActions.select_type({ 'select_tap' : 1 })

                    // ?????? ????????????
                    _timer(false);
                    gameActions.select_card_info({ 'card_select_able' : false });

                    _addLog(`<div class='game_alert_2 back_black white'> <b class='color_player_${turn}'> ${turn} ???????????? </b> ??? ??? <b class='red'> ${_splitMoneyUnit(remove_money['extra'])} </b> ??? ??????????????????.  </div>`)
                    gameActions.settle_player_money({ 'settle_modal' : true });
            
                    const event : any = document.querySelectorAll('.ReactModal__Overlay');
                    event[0].style.backgroundColor = 'rgba(0, 0, 0, 0.75)';

                    return
                }
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
                // ????????? ?????? ?????? ????????????
                return this._actionComputer(Number(turn), city_info, player_list);
            }, 500)
        }
    }

    // ????????? ?????? ????????????
    _actionComputer = (player : number, city : any, player_list : any) => {
        // ????????? ????????? ?????? ??????
        if(city.type === 'map') {
            // ?????? ???
            if(city.host !== null) {
                // ????????? ?????? ?????? 
                
                // (?????? ??????????????? ????????? ??????) ?????? ??? ??????
                if(city.host !== player) {
                    return this._computerTurnEnd();

                } else {
                    // ?????? ????????? ????????? ??????
                    // ????????? ?????? ???????????? ??????
                    return this._computerBuild(player, 'build', player_list, city);
                }

            } else if(city.host === null) {
                // ????????? ?????? ?????? ?????? ????????? ?????? ???????????? ??????
                return this._computerBuild(player, 'land', player_list, city);
            }

        } else if(city.type === 'event') {
            // ????????? ???
            if(city.number === 6) {
                // ???????????? ????????? ?????? ?????? ??? ??????
                return this._computerTurnEnd();

            } else {
                // ??? ????????? ????????? ?????? ?????? ??????
                return this._computerEventAction(city.number);
            }
        }
    }

    // ????????? ??? ??????
    _computerTurnEnd = () => {
        const { _turnEnd, turn } = this.props;

        return window.setTimeout( () => {
            return _turnEnd(turn);
        }, 500)
    }

    // ???????????? ????????? ?????? ?????????
    _computerEventAction : Function = async (map : number) => {
        const { _addLog, gameActions, _bettingGameStart, _selectCard, _checkPlayerMoney, _turnEnd } = this.props;
        const turn = Number(this.props.turn);
        const player_list = JSON.parse(this.props.player_list);

        if(map === 14) {
            // ?????????

            // 1. ????????? ?????????
            // ??? ????????? ???????????? ?????? ?????? ????????????
            const com_money : number = Number(player_list[turn - 1].money);

                // ?????? ????????? ????????? ????????? ??? ??????
                if(com_money < 1) {
                    _addLog(`<div class='game_alert'> ????????? ?????? ???????????? ????????? ??? ????????????. </div>`);
                    return this._computerTurnEnd();
                }

                // ?????? ????????? ?????????
                // ????????? 10% ?????? ????????? ??? ??????.
                const max = Math.round(com_money * 0.1);
                // ????????? ?????????
                const betting = Math.floor( Math.random() * (max - 2) + 2 );

                // ?????? ??????
                gameActions.event_info({ 'casino_betting' : betting });

                window.setTimeout( () => {
                    _bettingGameStart();

                    window.setTimeout( () => {
                        // ????????? ?????? ?????? ?????????
                        const select_card = Math.floor( Math.random() * (4 - 2) + 2 );
                        _selectCard('click', select_card);

                        // ?????? ??????
                        window.setTimeout( () => {
                            return gameActions.event_info({ 
                                'computer_casingo' : true, 
                                'casino_select_card' : select_card,
                                'casino_card_select' : true,
                                'casino_now_card_number' : 1
                            })
                        }, 600)                        

                    }, 800)
                }, 500)

        } else if(map === 20) {
            // ?????? ??????
            // window.setTimeout( () => {
            //     gameActions.event_info({
            //         'computer_move' : true
            //     })
            // }, 500)
            
            // return;
            const my_money = _checkPlayerMoney(turn);

            // ????????? ??? ?????? ??? ????????? ?????????
            const map_list : Number[] = [];
            const map_info = JSON.parse(this.props.map_info);

            for(let key in map_info) {
                const map = map_info[key];

                if(map.type === 'map') {
                    if(map.host === null) {
                        if(my_money >= map.price) {
                            map_list.push(map.number);
                        }

                    } else {
                        if(map.host === turn) {
                            map_list.push(map.number);
                        }
                    }

                } else if(map.key === 'bank' || map.key === 'gold_key') {
                    if(map.key === 'bank') {
                        map_list.push(0);

                    } else {
                        map_list.push(14);
                    }
                } 
            }
            
            const move_location = Math.floor( Math.random() * ((map_list.length + 1) - 0) + 0 );
        
            let move : number = move_location - 20;
            // ?????? ?????? ?????????
            if(move_location < 20) {
                move = ( 27 - 20 ) + ( move_location + 1);
            }

            this._moveCharacter(move, 20) //
 
        } else if(map === 0) {
            // ??????
            return _turnEnd();
        }
    }

    // ????????? ?????? ?????? ??? ?????? ???????????? ??????
    _computerBuild : Function = async (player : number, type : string, player_list : any, city : any) => {
        // type = land : ?????? ??????, build : ??????
        const { _checkPlayerMoney, _buyMap } = this.props;

        // ??????????????? ?????? ?????? + ?????? ??????
        const my_money = _checkPlayerMoney(player);

        // ?????? ??????
        let able : any = null;
        if(type === 'land') {
            // ?????? ????????????
            if(my_money > city.price) {
                // ???????????? ?????? ???????????? ?????????
                able = await this._computerBuyPercent(70, city, 'land', city.price);

                // ??????????????? ?????? ????????? ????????? ??????
                if(able === true) {
                    return setTimeout( () => {
                        _buyMap('click', player_list[player - 1], city);

                        // ?????? ????????? ????????? ?????? ?????? ?????????
                        return window.setTimeout( () => {
                            // return this._computerTurnEnd();
                            return this._computerBuild(player, 'build', player_list, city);
                        }, 500)
                    }, 500);
                }

            } else {
                // ??? ????????? ?????? ?????? ??? ??????
                return this._computerTurnEnd();
            }

        } else if(type === 'build') {
            // ????????????
            return this._computerBuyPercent(50, city, 'build', 0);
        }

        if(able === false) {
            return this._computerTurnEnd();
        }
    }

    // ??????
    _computerBuyPercent = (percent : number, city : any, type : string, buy_money : number) => {
        // percent : ?????? ??????
        const { turn, _checkPlayerMoney, _checkLandMark, _build } = this.props;
        const my_money = _checkPlayerMoney(turn);
        const player_list = JSON.parse(this.props.player_list);

        if(type === 'land') {

            // ???????????? ????????? ????????? ?????? ?????? ??????
            const my_maps : number = player_list[Number(turn) - 1].maps.length
            if(my_maps >= 0 && my_maps < 4) {
                // ?????? ????????? 0??? ??????, 4??? ????????? ?????? (0 ~ 3???)
                percent += 20;

            } else if(my_maps >= 4 && my_maps < 8) {
                // ?????? ????????? 4??? ??????, 8??? ????????? ?????? (4 ~ 7???)
                percent -= 5;

            } else if(my_maps >= 8) {
                // ?????? ????????? 8??? ????????? ??????
                percent -= 10;
            }

        } else if(type === 'build') {
            // ???????????? ?????? ?????? ?????? : true ??? ?????? ???????????? ?????? ??????
            const landmark = _checkLandMark(city);

            if(landmark === false) {
                // ???????????? ????????? ???????????? ??????
                let key : number = 0;
                const build_loop : Function = async () => {

                    if(key === 3) {
                        const _landmark = city.build[0].build && city.build[1].build && city.build[2].build;

                        if(_landmark === false) {
                            return this._computerTurnEnd();

                        } else {
                            return this._computerBuild(player_list[Number(turn) - 1], 'build', player_list, city);
                        }
                    }
                    
                    if(city.build[key].build === false) {
                    // ???????????? ?????? ????????? ??????
                    const my_money : number = _checkPlayerMoney(turn);

                    if(my_money >= city.build[key].price) {
                        const able = this._computerBuyPercent(50, city, 'check', city.build[key].price);
                        // const able = true;

                        if(able === true) {
                            // ????????????
                            const build = _build('click', key, city);
                            city.build[key].build = true;

                            return await window.setTimeout( () => {
                                key += 1;

                                if(key >= 3) {
                                    if(build === true) {
                                        // ???????????? ?????? ??????
                                        return this._computerBuild(player_list[Number(turn) - 1], 'build', player_list, city);

                                    } else {
                                        return this._computerTurnEnd();
                                    }

                                } else {
                                    return build_loop();
                                }
                            }, 800)

                        } else {
                            return await window.setTimeout( () => {
                                key += 1;
                                return build_loop();
                            }, 800)
                        }

                        } else {
                            // ????????? ?????? ????????? ?????? ??? ??????
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

            } else {
                // ???????????? ????????????
                const _landmark = city.build[0].build && city.build[1].build && city.build[2].build;

                if(_landmark === true) {
                    const able = this._computerBuyPercent(50, city, 'check', city.build[3].price);
                    // const able = true;

                    if(able === true) {
                        // ???????????? ??????
                        _build('click', 3, city);

                        return window.setTimeout( () => {
                            return this._computerTurnEnd();
                        }, 800)

                    } else {
                        return this._computerTurnEnd();
                    }
                }
                return;
            }
        }

        const extra_money : number = Number(my_money - buy_money);
        if(extra_money <= 0 && extra_money > 20) {
            // ?????? ??? ?????? ????????? 0 ?????? ~ 20 ?????? ??????
            percent -= 30;
    
        } else if(extra_money <= 20 && extra_money > 40) {
            // ?????? ??? ?????? ????????? 20 ?????? ~ 40 ?????? ??????
            percent -= 15;

        } else if(extra_money <= 40 && extra_money > 60) {
            // ?????? ??? ?????? ????????? 40 ?????? ~ 60 ?????? ??????
            percent += 5;

        } else if(extra_money <= 60 && extra_money > 80) {
            // ?????? ??? ?????? ????????? 60 ?????? ~ 80 ?????? ??????
            percent += 15;

        } else if(extra_money <= 80 && extra_money > 100) {
            // ?????? ??? ?????? ????????? 80 ?????? ~ 100 ?????? ??????
            percent += 20;

        } else if(extra_money <= 100) {
            // ?????? ??? ?????? ????????? 100 ?????? ??????
            percent += 30;
        }

        percent = percent > 100 ? 100 : percent;
        const random = Math.floor( Math.random() * (100 - 0) + 0 );

        if(percent >= random) {
            // ????????? ?????? ???????????? ??? ?????? true
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
                    ????????? ?????? 
                    <div>
                        {select_first_card === 0 ? '-' : select_first_card}
                    </div>
                </div>

                {card_limit !== 1
                    ? <div id='last_select_card_div'>
                        <div className='card_result_divs'> 
                            ????????? ?????? 

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
    _build : functions._build,
    _bettingGameStart: functions._bettingGameStart,
    _selectCard : functions._selectCard,
    casino_select_card : game.casino_select_card
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions: bindActionCreators(functionsActions, dispatch),
  }) 
)(Card);

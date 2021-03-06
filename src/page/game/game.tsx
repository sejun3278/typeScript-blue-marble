import * as React from 'react';
import $ from 'jquery';
import Modal from 'react-modal';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import PlayerList from './player_list';
import PlayGame from './play_games';
import GameOther from './game_other';
import Settle from './settle';

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
  bank_info : string,
  bank_incentive_percent : number,
  settle_modal : boolean,
  game_event: boolean,
  news_info_list : string,
  news_list : string,
  loan_percent : number,
  stop_days : number,
  add_land_info : string,
  game_log : string,
  settle_extra_money: number,
  play_time: number,
  round_start : boolean,
  start_price : number,
  round_limit : number,
  pass_price : number,
  sale_incentive : number,
  save_money_index : string,
  settle_state: string,
  game_over : boolean,
  winner : number,
  player_rank : string,
  rank_update : boolean,
  multiple_winner : string,
  select_info : string,
  _addSound : Function
};

const flash_info : any = {
  "flash" : false,
  "opacity" : 1.4,
  "on" : false
};

const modalCustomStyles = {
  content : {
    top                   : '350px',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '600px',
  }
};

let game_start_button = false;
let timer_play : any = false;

let overlap_news_number : any = {};
let play_time_count : any = false;

class Game extends React.Component<AllProps> {

  componentDidMount() {
    const { functionsActions } = this.props;

    this._setPlayerRank();

    // ?????? scrollTop ?????? ??????
    window.scrollTo(0, 80);

    // ?????? ?????? ?????????
    this._infiniteFlash('game_main_start_title', 70, true, null);

    functionsActions.save_function({
      '_commaMoney' : this._commaMoney,
      '_removeAlertMent' : this._removeAlertMent,
      '_playerMoney' : this._playerMoney,
      '_timer' : this._timer,
      '_infiniteFlash' : this._infiniteFlash,
      '_timerOn' : this._timerOn,
      '_addLog' : this._addLog,
      '_checkPlayerMoney' : this._checkPlayerMoney,
      '_minusPlayerMoney' : this._minusPlayerMoney,
      '_checkEstatePlayerMoney' : this._checkEstatePlayerMoney,
      '_splitMoneyUnit' : this._splitMoneyUnit,
      '_turnEnd' : this._turnEnd,
      '_getMyRating' : this._getMyRating,
      '_setPlayerRank' : this._setPlayerRank,
      '_buyMap' : this._buyMap,
      '_build' : this._build,
      '_checkLandMark' : this._checkLandMark,
      '_gameOver' : this._gameOver,
    })
  }

  componentDidUpdate() {
    const { rank_update, gameActions } = this.props;

    if(rank_update === true) {
      window.setTimeout( () => {
        this._setPlayerRank();
      }, 300)

      gameActions.event_info({ 'rank_update' : false })
    }
  }

  // ??? ????????????
  _minusPlayerMoney = (player : number, price : number, bank_info : any, save : any) => {
    const { initActions, bank_incentive_percent, gameActions } = this.props;
    const player_list = JSON.parse(this.props.player_list);

    // ????????? ?????????
    const settle_bill : any = { };
    settle_bill[player] = {
      "1" : {
        "loan" : price,
        "player_money" : player_list[player - 1].money,
        "repay_money" : 0
      }
    }

    if(bank_info === undefined || bank_info === null) {
      bank_info = JSON.parse(this.props.bank_info);
    }

    const result_obj : any = {};
    let result = true;

    // 1. ???????????? ?????? ???????????? ????????????

    let cover_price = price - player_list[player - 1].money <= 0 ? 0 : price - player_list[player - 1].money;

    const player_money = player_list[player - 1].money - price <= 0 ? 0 : player_list[player - 1].money - price;
    player_list[player - 1].money = player_money;

    initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) })

    settle_bill[player]["1"]['repay_money'] = price - cover_price;
    settle_bill[player]["1"]['cover_money'] = cover_price;

    if(cover_price > 0) {
    // 2. ?????? ???????????? ????????????

    settle_bill[player]["2"] = {
      'player_save_money' : bank_info[player].save_money
    };

    let player_save_money = bank_info[player].save_money;
      if(player_save_money > 0) {
        // console.log(bank_info, bank_info[player].save_money, cover_price)

        bank_info[player].save_money = bank_info[player].save_money - cover_price <= 0 ? 0 : bank_info[player].save_money - cover_price;

        cover_price = cover_price - player_save_money <= 0 ? 0 : cover_price - player_save_money;

        if(bank_info[player].save_money === 0) {
          // ????????? 0 ??? ???, 
          bank_info[player].round_incentive = 0;

        } else {
          // ????????? ?????? ?????? ???
          bank_info[player].round_incentive = Math.floor( (bank_incentive_percent / 100) * bank_info[player].save_money );
        }
      }

      if(cover_price > 0) {
        settle_bill[player]["3"] = {
          'player_total_incentive' : bank_info[player].total_incentive,
          'extra_price' : 0
        };

        let cover_total_incentive = bank_info[player].total_incentive;
        // 3. ??????????????? ?????? ???????????? ????????????
        bank_info[player].total_incentive = bank_info[player].total_incentive - cover_price <= 0 ? 0 : bank_info[player].total_incentive - cover_price;

        cover_price = cover_price - cover_total_incentive <= 0 ? 0 : cover_price - cover_total_incentive;
      
        settle_bill[player]["3"]['extra_price'] = cover_price;
      }
    }

    if(cover_price > 0) {
      result = false;
    }

    if(save === true) {
      gameActions.event_info({ 'bank_info' : JSON.stringify(bank_info) })
    }

    gameActions.settle_player_money({ 'settle_bill' : JSON.stringify(settle_bill) });

    result_obj['result'] = result;
    result_obj['extra'] = cover_price;
    result_obj['info'] = bank_info[player];
    result_obj['player'] = player_list;
    result_obj['bank'] = bank_info;

    window.setTimeout(() => {
      this.props.gameActions.event_info({ 'rank_update' : true })                            
    }, 200);

    return result_obj;
  }

  // ???????????? ??? ????????????
  _playerMoney = (player : number, money : number, type : string) => {
    const { initActions } = this.props;
    const player_list = JSON.parse(this.props.player_list);

    let result = true;
    if(type === 'plus') {
      // ??? ????????????
      player_list[player - 1].money += money;

    } else if(type === 'minus') {
      // ??? ????????????
      player_list[player - 1].money -= money;
    }

    initActions.set_player_info({ 
      'player_list' : JSON.stringify(player_list)
     })

     window.setTimeout(() => {
       this._setPlayerRank();              
    }, 200);

     return result;
  }

  // ??? ?????? ????????????
  _commaMoney = (money : number) => {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  _realGameStart = () => {
    const { _flash, gameActions, _addSound } = this.props;

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
            gameActions.set_game_notice_ment({ "main_ment" : "<div> <b class='color_player_1'> ???????????? 1 (???) </b> ?????? ???????????????. </div>" })
  
            return window.setTimeout( () => {
              this._setGamePlayTimeCount(true);

              _addSound('bgm', 'main', 0);

              return this._roundStart('turn');
  
            }, 1000);
          }, 300)
        }, 300);

      }, 300)
    }
  }

  // ????????? (???) ????????????
  _roundStart = (type : string) => {
    const { gameActions, able_player, round, turn, _flash, round_timer, _setCardDeck, game_event, settle_extra_money, round_limit } = this.props;

    const stop_info = JSON.parse(this.props.stop_info)
    const player_list = JSON.parse(this.props.player_list);
    const map_info = JSON.parse(this.props.map_info);
    const settle_state = JSON.parse(this.props.settle_state);
    const bank_info = JSON.parse(this.props.bank_info);
    // const player_rank = JSON.parse(this.props.player_rank);

    let ment : string = '';
    if(type === 'round') {
      // ????????? ?????????
      const next_round : number = round + 1;
      gameActions.round_start({ 'round' : next_round, 'turn' : 1 });

      if(next_round === round_limit) {
        this._addLog(`<div class='game_alert'> <b class='red'>????????? ??????????????????. </b> <br /> ?????? ???????????? ????????? ??? <br /><b class='custom_color_1'>????????? ?????? ?????? ???????????????</b>??? ???????????????. </div>`)

      } if(next_round + 5 === round_limit) {
        this._addLog(`<div class='game_alert'> <b class='red'>5 ????????? ?????? ????????? ???????????????.</b> <br /> ?????? ?????????????????? ????????? ??? ?????? ????????????! </div>`)
      }

      if(game_event === true) {
        gameActions.set_news_info({ 'news_round' : next_round });

        const round_inupt : any = document.getElementById('news_round_input');
        round_inupt.value = next_round

        this._setNewsEvent(next_round);
      }

      // ????????? ?????????
      _setCardDeck('init');

      return window.setTimeout( () => {
        return this._roundStart('turn');

      }, 1000);

    } else if(type === 'turn') {
      gameActions.round_start({ 'time_over' : false });

      let next_turn = turn;
      // ???????????? ????????? ????????? ?????? ?????? ??????????????? ??? ?????? ??????

      for(let i = next_turn; i <= able_player; i++) {
        if(stop_info[i] > 0 || settle_state[i] === true) {
          if(stop_info[i] > 0) {
            // ??? ?????? ?????? ????????? ????????? ???????????? ????????????.
            if(bank_info[i].repay_day === 0 && bank_info[i]['loan'] > 0) {
              next_turn = i;

              stop_info[i] = stop_info[i] - 1;
              gameActions.event_info({ 'stop_info' : JSON.stringify(stop_info), 'now_stop' : stop_info[i] - 1 })

              break;
            }

            if(settle_state[i] === false) {
              stop_info[i] = stop_info[i] - 1;
              gameActions.event_info({ 'stop_info' : JSON.stringify(stop_info), 'now_stop' : stop_info[i] - 1 })
            }
          }

          next_turn += 1;

        } else {
          break;
        }
      }

      if(next_turn > able_player) {
        this._addLog(`<div class='game_alert'> <b class='red'>?????? ????????? ??????????????? ????????????.</b> <br />???????????? ?????? ???????????? ???????????????. </div>`)

        return this._turnEnd(next_turn);
      }

      gameActions.round_start({ 'turn' : next_turn })

      if(round === 1 && next_turn === 1) {
        this._addLog(`<div class='game_alert back_black'> 1 ???????????? ???????????????. </div>`)

        if(game_event === true) {
          // ?????? ?????? ????????????
          this._setNewsEvent(round);
        }
      }

      _flash('#play_main_notice_div', false, 1.4, true, 30, null, 1);
      _flash('#playing_action_div', true, 0, false, 30);

      const player_target : any = document.getElementById(String(next_turn) + '_player_info_div');
      if(player_target.style) {
        player_target.style.border = 'solid 3px black';
      }

      gameActions.event_info({ 'now_stop' : 0 })

      const save_card_info : any = {};
      if(next_turn === 1) {
        ment = '<div> ??? ????????????. </div>';
        save_card_info['card_select_able'] = true;

        // gameActions.round_start({ "next_turn_end_able" : true })

      } else {
        ment = `<div> <b class=${'color_player_' + next_turn}> ???????????? ${next_turn} </b>??? ????????????. </div>`;

        // ????????? ????????????
        gameActions.select_type({ 'select_tap' : 0 })

        window.setTimeout( () => {
          this._drawRandomCard();
        }, 1000)
      }


      // ???????????? ????????????
      const _bank_info = this._getMyRating(next_turn, bank_info);
      gameActions.event_info({ 'bank_info' : JSON.stringify(_bank_info) });

      this._addLog(`<div class='game_alert white back_player_${next_turn}'> ???????????? ${next_turn} ??? ????????????. </div>`);

      if(settle_extra_money > 0) {
        // ?????? ???????????? ?????? ??????????????????.

        this._addLog(`<div class='game_alert_2 back_black white'> <b class='color_player_${next_turn}'> ${next_turn} ???????????? </b> ??? ??? <b class='red'> ${this._splitMoneyUnit(settle_extra_money)} </b> ??? ??????????????????.  </div>`)
        gameActions.settle_player_money({ 'settle_modal' : true });

        const event : any = document.querySelectorAll('.ReactModal__Overlay');
        event[0].style.backgroundColor = 'rgba(0, 0, 0, 0.75)';

        return;
      }

      // ???????????? ?????? ?????? ????????????
      const now_location = player_list[next_turn - 1].location;
      gameActions.move({ 'move_location' : now_location })

      gameActions.select_type({ 'select_info' : JSON.stringify( map_info[now_location] )})

      save_card_info['card_notice_ment'] = "????????? ?????? ????????? ???????????????.";
      gameActions.select_card_info(save_card_info);

      this._infiniteFlash('player_main_character_' + next_turn, 60, true, null);

      // ????????? ????????????
      if(round_timer !== 0) {
        const timer_el : any = document.getElementById('timer_slide_div');

        timer_el.style.opacity = 1.4;

        // if(next_turn === 1) {
        //   console.log(123123, round_timer, timer_el)
          $(timer_el).animate({
            'width' : String(6 * round_timer) + 'px'
          }, 0)

        // } else {
        // timer_el.style.width = String(6 * round_timer) + 'px';
        // }
        gameActions.set_timer({ 'timer' : String(round_timer) })

        // ????????? ????????????
        this._timerOn();
      }      

      gameActions.set_game_notice_ment({ 'main_ment' : ment })
      gameActions.round_start({ 'round_start' : true })
    }
  }

  // ????????? ????????????
  _timerOn = () => {
    const { round_timer, timer } = this.props;

    if(round_timer !== 0) {
        $('#timer_slide_div').animate({
          'width' : 0
        }, (Number(timer) * 1000))

      timer_play = window.setInterval( () => {
        return this._timer(true);
      }, 1000)
    }
  }

  // ????????? ?????? / ??????
  _timer = (start : boolean) => {
    const { gameActions, _flash, timer } = this.props;

    if(start === true) {
      // if(timer !== '-') {
        gameActions.set_timer({ 'timer' : String(Number(timer) - 1) })

        if(Number(timer) === 11) {
          this._addLog(`<div class='game_alert_2 red'> 10 ??? ???????????????. </div>`);
        }

        if(Number(timer) <= 11) {
          _flash('#timer_slide_div', false, 1.4, true, 25, null, 1);
        }

        _flash('#timer_notice_div', false, 1.4, true, 25, null, 1);

        // const timer_el : any = document.getElementById('timer_slide_div');

        // $(timer_el).animate({
        //   'width' : String(6 * Number(timer) - 1) + 'px'
        // }, 800)
        // timer_el.style.width = String(6 * (Number(timer) - 1)) + 'px';

        if((Number(timer) - 1) <= 0) {
          // ?????? ??????
          gameActions.round_start({ 'time_over' : true })
          gameActions.select_card_info({ 'card_select_able' : false });

          return this._turnEnd(null);
        }
      // }

    } else if(start === false) {
      window.clearInterval(timer_play);
    }
  }

  // ?????? ????????? (??? ??????)
  _nextGames = (turn : number) => {
    const { gameActions, able_player, _flash, overlap_card, _setCardDeck, round, round_limit } = this.props;

    // $('#timer_slide_div').css({ 'width' : '0px' })
    $('#timer_slide_div').stop().animate({
      'width' : '0px'
    }, 0);

    if(turn <= able_player) {
      gameActions.round_start({ 'turn' : turn });

      // ?????? ???????????????
      if(overlap_card === true) {
        _setCardDeck('init')

      } else {
        // ????????? ????????? ????????????
        _setCardDeck('reset')
      }

      return window.setTimeout( () => {
        this._roundStart('turn');

        _flash('#playing_action_div', true, 0, false, 30);
        _flash('#play_main_notice_div', true, 0, false, 30);
      }, 500)

    } else {
      // ?????? ?????? ??? ???, ?????? ????????? ??????
      const player_rank = JSON.parse(this.props.player_rank);

      if(round === round_limit) {
        // ???????????? ?????? ?????? ??????
        let _winner : number = 0;
        let multiple_winner : number[] = [];
        for(let key in player_rank) {
          if(player_rank[key].rank === 1) {
            _winner = Number(key);
            multiple_winner.push(Number(key));
          }
        }

        gameActions.game_over({ 'game_over' : true, 'winner' : _winner, 'multiple_winner' : JSON.stringify(multiple_winner) })
        // ?????? ??????
        this._gameOver(_winner);
        return;
      }

      // gameActions.round_start({ 'turn' : 0 });
      gameActions.select_type({ 'select_tap' : 0 })

      gameActions.set_news_info({ 'news_set' : false })

      // ?????????????????? ?????? ????????????
      this._setPlayerBank();

      this._addLog(`<div class='game_alert back_black'> ${ round + 1 } ???????????? ???????????????. </div>`);

      this._roundStart('round');
    }
  }

  _setPlayerBank = async () => {
    const { gameActions, turn, round } = this.props;
    const save_money_index = JSON.parse(this.props.save_money_index);
    let bank_info = JSON.parse(this.props.bank_info);

    save_money_index[round] = {};

    let player = 0;
    for(let key in bank_info) {
      player += 1;

      save_money_index[round][player] = bank_info[key].save_money;

      // ?????? ????????????
      if(bank_info[key].round_incentive) {
        this._playerMoney(player, bank_info[key].round_incentive, 'plus');

        bank_info[key].total_incentive += bank_info[key].round_incentive;
      }

      // ?????? ????????????
      if(bank_info[key].repay_day !== 0) {
        bank_info[key].repay_day = bank_info[key].repay_day - 1;

        if(bank_info[key].repay_day === 1) {
          if(turn === 1) {
            this._addLog(`<div class='game_alert_2 red'> ?????? ?????? ???????????? ??? ????????? ???????????????. </div>`);
          }
        }

        const return_loan_incentive = this._minusPlayerMoney(player, bank_info[key].loan_incentive, bank_info, false);
        bank_info[key] = return_loan_incentive['info'];

        if(bank_info[key].repay_day === 0) {
          // ???????????? ??????
          // ????????? ????????????
          const payback_result = this._minusPlayerMoney(player, (bank_info[key].loan * 100), bank_info, false);

          gameActions.settle_player_money({ 'settle_type' : 'loan' })

          bank_info[key] = payback_result['info'];

          if(payback_result['result'] === true) {
            this._addLog(`<div class='game_alert_2'> ????????? <b class='red'>${(bank_info[key].loan * 100)} ??????</b>??? ?????? ?????????????????????. </div>`)

            bank_info[key]['repay_day'] = 0;
            bank_info[key]['loan'] = 0;
            bank_info[key]['loan_incentive'] = 0;

          } else {
            // ?????? ??? ?????? ????????????
            gameActions.settle_player_money({ 'settle_extra_money' : payback_result['extra'] });

            // ?????? ????????????
            this._timer(false);
            gameActions.select_card_info({ 'card_select_able' : false })
          }
        }
      }
    }

    return gameActions.event_info({ 'bank_info' : JSON.stringify(bank_info), 'save_money_index' : JSON.stringify(save_money_index) });
  }

  // ???????????? ????????????
  _getMyRating = (player : number, bank_info : any) => {
    const player_list = JSON.parse(this.props.player_list);
    const my_info = player_list[player - 1];

    let my_rating = 9;

    // ?????? ?????? ??????
    const my_city_length = my_info.maps.length;
    if(my_city_length > 0) {
        if(my_city_length >= 1 && my_city_length < 4) {
            // 1 ~ 3??? ?????? ??????
            my_rating = my_rating - 1;

        } else if(my_city_length >= 4 && my_city_length < 8) {
            // 4 ~ 7??? ?????? ??????
            my_rating = my_rating - 2;

        } else if(my_city_length >= 8 && my_city_length < 12) {
            // 8 ~ 11??? ?????? ??????
            my_rating = my_rating - 3;

        } else if(my_city_length >= 12 && my_city_length < 17) {
            // 12 ~ 16??? ?????? ??????
            my_rating = my_rating - 4;

        } else if(my_city_length >= 17 && my_city_length < 20) {
            // 17 ~ 19??? ?????? ??????
            my_rating = my_rating - 5;

        } else if(my_city_length >= 20) {
            // 20??? ?????? ??????
            my_rating = my_rating - 6;
        }
    }

    // ????????? ??????
    const save_money : number = bank_info[player].save_money;

    if(save_money > 0) {
        if(save_money >= 100 && save_money < 300) {
          my_rating = my_rating - 1;

        } else if(save_money >= 300 && save_money < 500) {
          my_rating = my_rating - 2;

        } else if(save_money >= 500 && save_money < 1000) {
          my_rating = my_rating - 3;

        } else if(save_money >= 1000 && save_money < 2000) {
          my_rating = my_rating - 4;

        } else if(save_money >= 2000 && save_money < 3000) {
          my_rating = my_rating - 5;

        } else if(save_money >= 3000) {
          my_rating = my_rating - 6;
        }
    }

    if(my_rating <= 1) {
        my_rating = 1;
    }

    // ?????? ?????????
    let limit_loan = 0;
    if(my_rating !== 1) {
      for(let i = 9; i >= my_rating; i--) {
        limit_loan += 5;
      }

    } else if(my_rating === 1) {
      limit_loan = 50;
    }
    
    bank_info[player].bank_loan_limit = limit_loan;
    bank_info[player].my_rating = my_rating;

    return bank_info;
  }

  // ?????? ????????? ??????
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

  // ??? ?????????
  _turnEnd = async (_turn : number | null | undefined) => {
    const {_flash, gameActions, move_event_able, _moveCharacter, time_over, move_able, game_over, able_player } = this.props;

    let turn = !_turn ? this.props.turn : _turn;
    if(turn > 4 || turn > able_player) {
      // turn = 1;

      return this._nextGames(turn);
    }

    const _target : any = document.getElementById(String(turn) + '_player_info_div');

    if(game_over === true) {
      // ?????? ??????
      this._gameOver(null);
      return;
    }

    this._infiniteFlash('player_main_character_' + turn, 60, false, null);
    _flash('#player_main_character_' + turn, true, 0, false, 30);

    // _flash('#timer_slide_div' + turn, false, 1.4, false, 30);

    window.clearInterval(timer_play);

    gameActions.player_bank_info({ 'player_bank_info_alert' : false })

    let timer = 200;
    if(time_over === true) {
    // ?????? ????????? ?????? ????????????

      if(move_event_able === true) {
        // ?????? ???????????? ????????? ???????????? ????????????
        // ??????????????? ???????????? ???????????????.
        _moveCharacter(8, 20);

        gameActions.event_info({ 'move_event_able' : false });

      } else {
        if(move_able === true) {
          // ?????? ?????? ?????? ??????
          gameActions.select_type({ 'select_tap' : 0 });

          // ????????? ????????? ????????? ?????????.
          await this._drawRandomCard();

          timer = timer * 10;
        }
      }
    }

    window.setTimeout( () => {
      gameActions.move({ 'move_location' : null, 'move_able' : true });
      gameActions.round_start({ 'turn_end_able' : false })

      // if(casino_game_result !== null) {
        // ????????? ???????????????
        gameActions.reset_casino();
      // }

      // ?????? ??????
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
          // _flash('#timer_slide_div', false, 1.4, false, 30);
          _flash('#playing_action_div', false, 1.4, false, 30);
          _flash('#play_main_notice_div', false, 1.4, false, 30);
          
          if(_target.style !== null) {
            _target.style.border = 'solid 1px #ababab';
          }

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

  // ???????????? ?????? ??????
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
            'card_notice_ment' : save_obj['all_card_num'] + ' ?????? ???????????????.'
          })
          // await _moveCharacter(save_obj['all_card_num'], null);
          await _moveCharacter(4, null);
  
          return initActions.set_setting_state({ 'card_deck' : JSON.stringify(card_deck) });

        } else {
          limit = limit + 1;
  
          return get_random_card(limit);
        }
      }, 500)
    }

    return get_random_card(1);
  }

  // ?????? ????????? ????????????
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

  // ?????? ????????????
  _setNewsEvent = async (round : number) => {
    const { gameActions, initActions, game_event } = this.props;
    const news_list = JSON.parse(this.props.news_list);

    if(game_event === false) {
      return;
    }

    news_list[round] = { 'info' : [] };

    // ?????? ????????? ?????? ???????????? ?????? ??????
    overlap_news_number = {};

    let map_list : any = JSON.parse(this.props.map_info);
    for(let i = 1; i <= 3; i++) {
      let type = 'main';

      if(i === 3) {
        type = 'option';
      }

      const result = await this._getNewsData(type, map_list);

      if(i !== 3) {
        map_list = result.map_list;
      }

      news_list[round].info.push(result);
    }

    gameActions.set_news_info({ 'news_list' : JSON.stringify(news_list), 'news_set' : true });    
    initActions.set_setting_state({ 'map_info' : JSON.stringify(map_list) })

    this._checkEstatePlayerMoney(0, null, null);
    return;
  }

  // ?????? ?????????
  _getNewsData = (type : string, map_list : any) => {
    let result : any = {};
    const news_info = require('../../source/news.json');
    const props : any = this.props;

    if(type === 'main') {
      const _recursion : Function = async () => {
        // UP ?????? Down ??? ?????? ????????? ?????? ?????????.
        const main_random_number : number = Math.trunc(Math.random() * (2 - 0) + 0);
        // 0 ????????? Down, 1 ????????? Up
        const main_type : string = main_random_number === 0 ? "false" : "true";

        // ?????? ????????? ?????? ?????? Length ??? ????????????
        const length = Object.keys(news_info['main'][main_type]).length;

        // ?????? ?????? ?????????
        const random : number = Math.trunc(Math.random() * (length - 1) + 1);

        if(overlap_news_number[random] === undefined) {
          overlap_news_number[random] = true;

        } else if(overlap_news_number[random] === true) {
          return _recursion();
        }

        // ?????? ????????????
        const main_news = news_info['main'][main_type][random];

        // ?????? ?????? ?????????
        const min = main_news['range'][0];
        const max = main_news['range'][1];

        const value_result : number = Math.trunc(Math.random() * (max - min) + min);

        main_news['value'] = value_result;
        main_news['summary'] = '';

        // ????????????
        const set_main = await this._newsApply(main_news, 'main', map_list);

        main_news['map_list'] = set_main;

        return main_news;
      }

      result = _recursion();

    } else if(type === 'option') {
      const _recursion : Function = () => {
        const option_length : number = (Object.keys(news_info['option']).length + 1);
        const random : number = Math.trunc(Math.random() * (option_length - 1) + 1);
        // const random = 5;
        // const random : number = Math.trunc(Math.random() * (6 - 9) + 9);

        // ?????? ????????? ????????? ????????????.
        const option_news_result = news_info['option'][random];
        // ????????? ????????? ????????? ????????????.
        const option_news_value_range : number[] = option_news_result.range;

        // ????????? ?????????, ???????????? ????????? ????????????.
        const min : number = option_news_value_range[0];
        const max : number = option_news_value_range[1];

        // ????????? ???????????? ????????????.
        const option_value : number = Math.trunc(Math.random() * (max - min) + min);
        option_news_result['value'] = option_value;

        /* ////////// ??? ???????????? ///////////// */

        // ?????? ??? ????????????
        const origin_value = props[option_news_result['state']];

        option_news_result['origin_value'] = origin_value;
        
        if(origin_value === option_news_result.limit) {
          return _recursion();
        }

        // ??? ?????? ?????? ????????? ?????????
        let result_value : number = 0;
        if(option_news_result['result'] === true) {
          // ????????????
          result_value = origin_value + option_value;

          if(result_value > option_news_result.limit) {
            option_news_result['value'] = option_news_result.limit - origin_value;
            result_value = option_news_result.limit;
          }

        } else if(option_news_result['result'] === false) {
          // ????????????
          result_value = origin_value - option_value;
          
          if(result_value < option_news_result.limit) {
            option_news_result['value'] = origin_value - option_news_result.limit;
            result_value = option_news_result.limit;
          }
        }
        option_news_result['result_value'] = result_value;

        const save_obj : any = {};
        save_obj[option_news_result['state']] = result_value;

        if(option_news_result['apply'] === true) {
          // ?????? ????????? ??????
          this._newsApply(option_news_result, type, map_list);
        }

        const origin_str = origin_value + ' ' + option_news_result['unit'];
        const result_str = result_value + ' ' + option_news_result['unit'];
        if( (random >= 1 && random < 5) || (random >= 7 && random < 9)) {
          option_news_result['summary'] = `???( ${origin_str}???=>???${result_str} )`;

        } else if(random >= 5 && random < 7) {
          option_news_result['summary'] = `???( => ${result_str} )`;
        }

        props.initActions.change_state(save_obj);

        return option_news_result;
      }

      result = _recursion();
    }

    return result;
  }

  // ?????? ?????? ????????????
  _newsApply = async (info : any, type : string, map_list : any) => {
    const bank_info = JSON.parse(this.props.bank_info);
    const props : any = this.props;

    if(type === 'main') {
      // const map_list = JSON.parse(this.props.map_info);
      const target_col_arr : any = [];
      
      info.target.forEach( (el : any) => {
        let target : any;

        if(el === 0) {
          for(let key in map_list) {
            target = map_list[key];

            if(target.type === 'map') {
              target_col_arr.push(target);
            }
          }

        } else {
          target = map_list[el];
          target_col_arr.push(target);
        }
      })

      // ????????? ?????? ????????????
      await target_col_arr.forEach( (el : any) => {
        let bonus_value : number = info.value;

        if(info.type === true) {
          // ??????
          map_list[el.number].price += info.value;

          if(map_list[el.number].price > info.limit) {
            map_list[el.number].price = info.limit;
            bonus_value = info.limit - map_list[el.number].price;
          }

          if(map_list[el.number].host !== null) {
            map_list[el.number].pass += bonus_value;
          }
          
        } else if(info.type === false) {
          // ??????
          map_list[el.number].price -= info.value;

          if(map_list[el.number].price < info.limit) {
            map_list[el.number].price = info.limit;
            bonus_value = info.value - map_list[el.number].price;
          }

          if(map_list[el.number].host !== null) {
            map_list[el.number].pass -= bonus_value;
          }
        }
      })

      return map_list;

    } else if(type === 'option') {
      const result_value : number = info.result_value;

      if(info.state === "bank_incentive_percent") {
        // ?????? ?????? ??????
        for(let key in bank_info) {
          if(bank_info[key]['save_money'] > 0) {
            const percent = result_value / 100;
            const incentive = Math.floor(bank_info[key]['save_money'] * percent);

            bank_info[key]['round_incentive'] = incentive;
          }
        }
      }

      props.gameActions.event_info({ 'bank_info' : JSON.stringify(bank_info) })
    }
  }

  // ?????? ????????????
  _addLog = (str : string) => {
    const { gameActions } = this.props;
    
    const game_log = JSON.parse(this.props.game_log);
  
    game_log.push(str);

    gameActions.set_game_log({ 'game_log' : JSON.stringify(game_log) });
  }

  // ???????????? ??? ?????? + ????????? + ?????? ??????
  _checkPlayerMoney = (player : number) => {
    const bank_info = JSON.parse(this.props.bank_info);
    const player_list = JSON.parse(this.props.player_list);

    if(player > 0) {
      const money = player_list[player - 1].money + ( bank_info[player].save_money + bank_info[player].total_incentive );

      return money;
    }
  }

  // ??????????????? ????????? ??? ?????? ????????????
  _checkEstatePlayerMoney = (player : number, _player_list : any, _map_info : any) => {
    const { able_player, initActions } = this.props;

    // const bank_info = JSON.parse(this.props.bank_info);

    let start : number = player;
    let end : number = player; 

    let player_list : any = _player_list;
    let map_info : any = _map_info;

    if(player === 0) {
      start = 1;
      end = able_player;

      player_list = JSON.parse(this.props.player_list);
      map_info = JSON.parse(this.props.map_info);
    }

    let estate_money = 0;
    for(let i = start; i <= end; i++) {
      estate_money = 0;
      const player_info = player_list[i - 1];

      if(player_info['maps'].length > 0) {
        // ???????????? ????????? ?????? ??????
        player_info['maps'].forEach( (el : any) => {
          const map = map_info[el];

          estate_money += map.price;
        })
      }

      player_list[i - 1].estate_money = estate_money;
    }

    initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) });

    const result : any = {};
    result['bank_money'] = this._checkPlayerMoney(player);
    result['estate_money'] = estate_money;

    return result;
  }

  // ??? ?????? ?????????
  _splitMoneyUnit = (money : number) => {
    let trans_money : string = this._commaMoney(money) + ' ?????? ';

    // ??? ????????? ?????????
    if(money / 100 >= 100) {
      // 100 ?????? ????????? ??? 100 ????????? ?????? 1 ??? ????????????.
      const split_money = String(Math.floor(money / 100));
      let split_idx : number = 1;

      if(split_money.length >= 3) {
        trans_money = split_money[0];

        if(split_money.length === 4) {
          trans_money += split_money[1];

          split_idx += 1;
        }

        trans_money += ' ??? ';
      };

      const extra_money = Number(String(money).slice(split_idx, String(money).length + 1))
      if(extra_money > 0) {
        trans_money += '???' + this._commaMoney(extra_money) + ' ??????';
      }
    }

    return trans_money;
  }

  // ?????? ????????? ?????? ?????????
  _setGamePlayTimeCount = (on : boolean) => {
    const { gameActions } = this.props;
    let play_time = this.props.play_time;

    if(on === true) {
      play_time_count = window.setInterval( () => {
        play_time = play_time + 1;

        gameActions.game_play_time({ 'play_time' : play_time });
      }, 1000)

    } else if(on === false) {
      window.clearInterval(play_time_count);
      $('#timer_slide_div').remove();
    }
  }

  // ?????? ????????????
  _transTimer = (_timer : number) => {
    let timer : string = '';

    // ?????? (hour) ?????????
    // if(_timer / 3600 > 0) {
      const hour : number = Math.floor(_timer / 3600);

      _timer -= (3600 * hour);
      timer += hour + ' ?????????';
    // }

    // ??? (minute) ?????????
    // if(_timer / 60 > 0) {
      const minute : number = Math.floor(_timer / 60);

      _timer -= (60 * minute);
      timer += minute + ' ??????';
    // }

    timer += _timer + ' ???';

    return timer;
  }

  // ?????? ??????
  _gameOver = (_winner : number | null | undefined) => {
    const { turn, _flash, gameActions } = this.props;
    const multiple_winner = JSON.parse(this.props.multiple_winner);
    const winner : number = _winner !== null && _winner !== undefined ? Number(_winner) : Number(this.props.winner);

    const player_target : any = document.getElementById(turn + '_player_info_div');
    player_target.style.border = 'solid 1px #ababab';

    this._setGamePlayTimeCount(false);

    gameActions.set_game_notice_ment({ 'main_ment' : "?????? ??????" })

    _flash('#game_over_notice_div', true, 0, false, 30);

    window.setTimeout( () => {
      _flash('#game_over_notice_div', false, 1.4, false, 30);

      let padding_bottom : number = 0;
      let winner_ment : string = ``;
      // ????????? ???????????? ?????? ??????
      if(multiple_winner.length > 1) {
        multiple_winner.forEach( (el : number, key : number) => {
          if(key > 0) {
            padding_bottom += 10;
          }

          const winner_target : any = document.getElementById(el + '_player_info_div');
          if(winner_target.style !== null) {
            winner_target.style.border = 'solid 3px #9ede73';
          }
          
          winner_ment += `<b class='color_player_${el}'>${el} ????????????</b> <br />`;
        })
        winner_ment = `<div id='winner_player_list_div'> ${winner_ment} </div> ?????? ?????? ???????????????.`

      } else {
        if(winner > 0) {
          $('#' + winner + '_player_info_div').css({
            'border' : 'solid 3px #9ede73'
          })

          winner_ment = `<b class='color_player_${winner}'>${winner} ????????????</b>??? ???????????????!`;
        }
      }

      const padding_bottom_class = 'padding_bottom_' + String(padding_bottom);
      this._addLog(`<div id='game_over_alert' class=${padding_bottom_class}> ?????? ?????? ! <br /> ${winner_ment} </div>`)

      window.setTimeout( () => {
        document.getElementById('game_over_notice_div')?.remove();
        document.getElementById('playing_action_div')?.remove();
      }, 500)
    }, 1500)
  }

  // ?????? ????????????
  _setPlayerRank = () => {
    // ?????? + ?????? ?????? + ????????? ???????????? ????????? ??????
    const { able_player, gameActions } = this.props;

    const bank_info = JSON.parse(this.props.bank_info);
    const player_list = JSON.parse(this.props.player_list);

    let all_money : number = 0;

    const rank_obj : any = {};
    for(let i = 1; i <= able_player; i++) {
      const player_info = player_list[i - 1];
      const player_id = player_list[i - 1].number;

      const my_bank = bank_info[player_id];
      all_money = player_info.money + (my_bank.save_money + my_bank.total_incentive) + player_info.estate_money;

      if(rank_obj[all_money] === undefined) {
        rank_obj[all_money] = [];
      }
      rank_obj[all_money].push(player_id);
    }

    const trans_arr = Object.entries(rank_obj).reverse();

    let rank = 1;

    const rank_result : any = {};
    trans_arr.forEach( (el : any) => {
      el[1].forEach( (cu : any) => {
        rank_result[cu] = { 'money' : el[0], 'rank' : rank };
      })

      rank += el[1].length;
    })

    gameActions.event_info({ 'player_rank' : JSON.stringify(rank_result) })
  }

  // ?????? ????????????
  _buyMap = (type : string, my_info : any | undefined | null, city : any | undefined | null) => {
    const select_info = (city !== null && city !== undefined) ? city : JSON.parse(this.props.select_info);
    const map_info = JSON.parse(this.props.map_info);
    const player_list = JSON.parse(this.props.player_list);
    
    const { initActions, gameActions, pass_price, turn } = this.props; 
    const { 
      _removeAlertMent, _addLog, _checkPlayerMoney, _minusPlayerMoney, _checkEstatePlayerMoney, _splitMoneyUnit 
    } = this;

    const player_all_money = _checkPlayerMoney(turn);
    const event : any = document.getElementById('but_map_button');

    const _my_info = my_info === undefined ? player_list[Number(turn) - 1] : my_info;

    if(type === 'on') {
        if(player_all_money >= select_info.price) {
            event.style.backgroundColor = '#9fd8df';
            event.style.color = 'white'
        }

    } else if(type === 'off') {
        if(player_all_money >= select_info.price) {
            event.style.backgroundColor = 'white';
            event.style.color = 'black'
        }

    } else if(type === 'click') {
        if(player_all_money < select_info.price) {
            // ?????? ????????? ??????
            _removeAlertMent("?????? ?????? ????????? ???????????????.");
            return
        }

        if(map_info[select_info.number].host === null) {
            // ???????????? ??????
            const result = _minusPlayerMoney(turn, select_info.price, undefined, true);
            
            const player_list = result['player'];

            player_list[_my_info.number - 1]['maps'].push(select_info.number);

            initActions.set_player_info({ 
                'player_list' : JSON.stringify(player_list), 
            });

            gameActions.event_info({ 'bank_info' : JSON.stringify(result['bank']) })

            // ??? ??????
            map_info[select_info.number].host = _my_info.number;
            map_info[select_info.number].pass = select_info.price;
            initActions.set_setting_state({ 'map_info' : JSON.stringify(map_info) });

            select_info.host = _my_info.number;
            select_info.pass = select_info.price;
            gameActions.select_type({ 'select_info' : JSON.stringify(select_info) })

            const ment = `<div class='game_alert_2'> <b class='color_player_${turn}'> ???????????? ${turn} </b>???|???${map_info[select_info.number].name} ?????? ?????? <b class='red'> ( ${_splitMoneyUnit(select_info.price)} ) </b>  <br /> <b class='gray'> ( ???????????? ${map_info[select_info.number].name} ??? ????????? ?????? ????????????????????? <br /> <b class='custom_color_1'>${_splitMoneyUnit(map_info[select_info.number].pass * pass_price)} </b>??? ???????????? ???????????????. ) </b> </div>`;

            _checkEstatePlayerMoney(turn, player_list, map_info);

            _addLog(ment)
       }
    }
  }

  // ?????? ????????????
  _build = (type : string, key : number, city : any) => {
    const map_info = JSON.parse(this.props.map_info);
    const select_info = (city !== null && city !== undefined) ? city : JSON.parse(this.props.select_info);

    const player_list : any = JSON.parse(this.props.player_list);

    const { gameActions, initActions, turn, pass_price } = this.props;
    const { 
      _removeAlertMent, _addLog, _checkPlayerMoney, _minusPlayerMoney, _checkEstatePlayerMoney, _splitMoneyUnit 
    } = this;

    let check_lendMark : boolean = false;
    // if(turn === 1) {
        if(type === 'on') {
            for(let i = 0; i < map_info[select_info.number].build.length; i++) {
                delete map_info[select_info.number].build[i]['select'];
            }

            map_info[select_info.number].build[key]['select'] = true;

        } else if(type === 'off') {
            delete map_info[select_info.number].build[key]['select'];

        } else if(type === 'click') {
            const player_all_money = _checkPlayerMoney(turn);

            if(map_info[select_info.number].build[key].build === false) {
                if(player_all_money >= map_info[select_info.number].build[key].price) {
                    const result = _minusPlayerMoney(turn, map_info[select_info.number].build[key].price, undefined, true);
                    gameActions.event_info({ 'bank_info' : JSON.stringify(result['bank']) })

                    const origin_pass = map_info[select_info.number].pass * pass_price;

                    map_info[select_info.number].build[key].build = true;
                    map_info[select_info.number].price += map_info[select_info.number].build[key].price;
                    map_info[select_info.number].pass = map_info[select_info.number].pass + map_info[select_info.number].build[key].price;      
                    
                    delete map_info[select_info.number].build[key]['select'];
                    
                    const now_location = map_info[player_list[Number(turn) - 1].location].name;

                    const ment = `<div class='game_alert_2'> <b class='color_player_${turn}'> ???????????? ${turn} </b>???|???${now_location} ??? ${map_info[select_info.number].build[key].name} ?????? <b class='red'> ( ${_splitMoneyUnit(map_info[select_info.number].build[key].price)} ) </b>  <br /> <b class='gray'> ( ????????????|???${_splitMoneyUnit(origin_pass)}???=>???<b class='custom_color_1'>${_splitMoneyUnit(map_info[select_info.number].pass * pass_price)} </b> ) </b> </div>`;
                    _addLog(ment);

                    _checkEstatePlayerMoney(turn, result['player'], map_info);

                    _removeAlertMent(map_info[select_info.number].build[key].name + " (???)??? ?????????????????????.");

                    // ???????????? ?????? ?????? ??????
                    check_lendMark = this._checkLandMark(map_info[select_info.number]);

                    if(key !== 3) {
                        if(check_lendMark === true) {
                            window.setTimeout(() => {
                                _addLog(`<div class='game_alert_2'> ?????? <b class='custom_color_1'> ${now_location} </b> ??? ??????????????? ????????? ??? ????????????. </div>`)                                
                            }, 200);
                        }

                    } else {
                        _addLog(`<div class='game_alert_2'> <b class='custom_color_1'> ${now_location} </b> ???????????? ?????? ! <br /> <b class='gray'> ( ????????????|???${_splitMoneyUnit(origin_pass)}???=>???<b class='custom_color_1'>${_splitMoneyUnit(map_info[select_info.number].pass * pass_price)} </b> ) </b> </div>`)                                
                    }

                } else {
                    return _removeAlertMent("?????? ????????? ???????????????.");
                }
            }
        }
    // }

      gameActions.select_type({ 'select_info' : JSON.stringify(map_info[select_info.number]) });
      initActions.set_setting_state({ 'map_info' : JSON.stringify(map_info) });

      return check_lendMark;
  }

  // ???????????? ?????? ?????? ??????
  _checkLandMark = (_info : any) => {
    let select_info : any = JSON.parse(this.props.select_info);
      if(_info !== null) {
          select_info = _info;
      }

      let result = true;
      if(select_info.type === 'map') {
          for(let i = 0; i < 3; i++) {
              const info = select_info.build[i];

              if(info.build === false) {
                  result = false;
              }
          }
      }

      return result;
  }

  render() {
    const player_list = JSON.parse(this.props.player_list);
    const { _commaMoney, _realGameStart, _transTimer } = this;
    const { 
      playing, settle_modal, play_time, round, game_over
    } = this.props;

    // this._setPlayerRank();
    const props : any = this.props;

    const top_player_list = player_list.slice(0, 2);
    const bottom_player_list = player_list.slice(2, 4);

    const setting_list : any = [
      { "name" : "?????? ??????", "value" : "start_price", "unit" : "??????" },
      { "name" : "????????? ??????", "value" : "round_timer", "unit" : "???", "info" : { "0" : "?????? ??????" } },
      { "name" : "????????? ??????", "value" : "round_limit", "unit" : "?????????", "info" : { "0" : "?????? ??????" } },
      { "name" : "????????? ??????", "value" : "pass_price", "unit" : "???" },
      { "name" : "?????? ?????? ??????", "value" : "card_limit", "unit" : "???" },
      { "name" : "?????? ?????? ??????", "value" : "overlap_card", "info" : { "true" : "ON", "false" : "OFF" } },
      { "name" : "????????? ??????", "value" : "game_event", "info" : { "true" : "ON", "false" : "OFF" } }
    ]

    return(
      <div id='game_div'>

        {game_over === true
          ? <div id='game_over_notice_div'>
              ?????? ??????
            </div>

          : undefined
        }

        <div id='game_other_div'>
          <div id='game_title_div'>
            <h2> ????????? ?????? </h2>
            <p> Blue Marble Of Korea </p>
          </div>

          <div id='game_other_funtion_div'>
            <div onClick={() => window.confirm('????????? ????????? ???????????????????') ? window.location.reload() : undefined}> ????????? </div>
          </div>
        </div>

        <div id='game_contents_div'>
          {settle_modal === true
              ? <Modal
                  isOpen={settle_modal}
                  style={modalCustomStyles}
                  ariaHideApp={false}
                >
                  <Settle />
                </Modal>
            
              : undefined
          }

          <PlayerList
            list={JSON.stringify(top_player_list)}
            _commaMoney={_commaMoney}
          />

          <div id='game_main_contents_div'>
            <div id='game_setting_status_divs'>
              <h4> ?????? ?????? </h4>

              <div id='game_setting_status_list'>
                {setting_list.map( (el : any, key : number) => {
                  let contents = props[el.value] + ' ' + el.unit;

                  if(el.info !== undefined) {
                    if( el.info[String(props[el.value])]) {
                      contents = el.info[String(props[el.value])];
                    }
                  }

                  return(
                    <div key={key} className='game_setting_status_divs gray'>
                      <div className='game_setting_status_name_div'> {el.name} </div>
                      <div className='aRight'> {contents} </div>
                    </div>
                  )
                })}
              </div>

              <div id='game_play_time_div' style={round === 0 && game_over === false ? { 'color' : '#ababab' } : undefined}>
                <div id='game_play_time_title'> Play Time </div>
                <div id='game_play_contents_div'> {_transTimer(play_time)} </div>
              </div>
            </div>
            
            <div id='game_main_map_div'>
                {playing === false 
                ? <div id='game_main_start_ready_div'>
                    <h2 id='game_main_start_title' onClick={game_start_button === false ? _realGameStart : undefined}> 
                      ???????????? ????????? ??????????????????.
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

            <GameOther />              
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
    bank_info : game.bank_info,
    bank_incentive_percent : init.bank_incentive_percent,
    settle_modal : game.settle_modal,
    game_event : init.game_event,
    news_info_list: init.news_info_list,
    news_list : game.news_list,
    loan_percent : init.loan_percent,
    stop_days : init.stop_days,
    add_land_info : init.add_land_info,
    game_log : game.game_log,
    settle_extra_money : game.settle_extra_money,
    play_time : game.play_time,
    round_start : game.round_start,
    start_price : init.start_price,
    round_limit : init.round_limit,
    pass_price : init.pass_price,
    sale_incentive : init.sale_incentive,
    save_money_index : game.save_money_index,
    settle_state : game.settle_state,
    game_over : game.game_over,
    winner : game.winner,
    player_rank: game.player_rank,
    rank_update : game.rank_update,
    multiple_winner : game.multiple_winner,
    select_info : game.select_info,
    _addSound : functions._addSound
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Game);

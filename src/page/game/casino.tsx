import * as React from 'react';
import $ from 'jquery'

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
  turn : number | null,
  player_list : string,
  casino_start : boolean,
  casino_betting : number,
  casino_game_start : boolean | null,
  _flash : Function,
  _removeAlertMent : Function,
  _playerMoney: Function,
  casino_select_card : number,
  casino_card_tool : string,
  casino_card_select : boolean,
  casino_card_ment : string,
  casino_select_result : string,
  casino_now_card_number : number,
  _infiniteFlash : Function,
  casino_game_result : null | boolean,
  _commaMoney : Function,
  _timer : Function,
  round_timer : number,
  _timerOn : Function,
  _addLog : Function,
  _bettingGameStart : Function,
  _selectCard : Function,
  _setSelectCardEffect : Function,
  computer_casingo : boolean,
  _turnEnd : Function
};

class Casino extends React.Component<AllProps> {

    componentDidMount() {
        const { turn, gameActions } = this.props;

        const player_list = JSON.parse(this.props.player_list);

        const min = player_list[Number(turn) - 1].money > 0 ? 1 : 0;
        gameActions.event_info({ 'casino_betting' : min })
    }

    componentDidUpdate() { 
        const { computer_casingo, gameActions } = this.props;
        if(computer_casingo === true) {
            // 카드 뽑기
            this._computerCardSelect(1);

            gameActions.event_info({ 'computer_casingo' : false })
        }
    }

    _computerCardSelect = (num : number) => {
        const { casino_select_card, gameActions } = this.props;

        if(casino_select_card < num) {
            return;
        }

        gameActions.event_info({ 
            'casino_card_select' : true,
            'casino_now_card_number' : num
        });

        return window.setTimeout(() => {
            this._selectBettingCard(num, true);
        }, 500)
    }

  _checkMoney = (event : any, max : number) => {
    const { gameActions } = this.props;

    const target = event.target;

    let value = Number(target.value);

    if(value > max) {
        value = max;

    } else if(value < 0) {
        value = 0;
    }
    target.value = value;

    gameActions.event_info({ 'casino_betting' : value })
  }

  // 카드 선택하기
  _selectBettingCard = (num : number, computer : boolean) => {
    const { casino_card_select, casino_now_card_number, casino_select_card, _setSelectCardEffect } = this.props;
    const casino_select_result = JSON.parse(this.props.casino_select_result);

    const save_obj : any = {};
    if(casino_card_select === true) {
        if(casino_now_card_number === num) {
            const random_card = Math.trunc(Math.random() * (10 - 2) + 2);
            // const random_card = 7;

            // _infiniteFlash('select_casino_card_' + num, 50, false, 1.4);
            $('select_casino_card_' + num).css({
                'border' : 'solid 2px black',
                'color' : 'black',
            })

            casino_select_result[num] = random_card;
            
            save_obj['casino_select_result'] = JSON.stringify(casino_select_result);
            
            if(casino_select_card > num) {
                save_obj['casino_now_card_number'] = casino_now_card_number + 1;
                save_obj['casino_card_ment'] = save_obj['casino_now_card_number'] + ' 번 배팅 카드를 뽑아주세요.';

                _setSelectCardEffect(casino_now_card_number + 1, true);
            }
            
            return this._getGameResult(num, casino_select_result, save_obj, computer);
        }
    }
  }

  // 게임 결과 판정하기
  _getGameResult = (now : number, obj : any, save : any, computer : boolean) => {
    const { casino_select_card, gameActions } = this.props;
    let result_check = true;
    let first_number : null | number = null;
    let result_money : number = 0;

    gameActions.event_info({ 'casino_card_select' : false });

    for(let key in obj) {
        result_money = result_money * obj[key];
        
        if(first_number === null) {
            first_number = obj[key];
            result_money = obj[key];
        }

        if(obj[key] === null || obj[key] !== first_number) {
            result_check = false;
        }
    }

    save['casino_card_select'] = true;
    gameActions.event_info(save);

    if(computer === true) {
        if(now !== casino_select_card) {
            return window.setTimeout( () => {
                this._computerCardSelect(now + 1)
            }, 500)

        } else if(now === casino_select_card) {
            return this._endCasinoGame(result_check, result_money, true);
        }
    }

    if(result_check === true) {
        return this._endCasinoGame(true, result_money, false);

    } else {
        if(now === casino_select_card) {
            return this._endCasinoGame(false, 0, false);
        }
    }

    if(casino_select_card === 3) {
        if(now >= 2) {
            if(obj[1] !== obj[2]) {
                return this._endCasinoGame(false, 0, false);
            }
        } 
    }

    return 
  }

  // 마무리 짓기
  _endCasinoGame = (result : boolean, num : number, computer : boolean) => {
    const { gameActions, casino_betting,_playerMoney, turn, _commaMoney, _timerOn, round_timer, _addLog, _turnEnd } = this.props;

    return window.setTimeout( () => {
        gameActions.event_info({ 'casino_game_result' : result });
        gameActions.round_start({ 'turn_end_able' : true })

        if(result === true) {
            // 게임 성공

            _playerMoney(turn, casino_betting * num, 'plus');

            $('#casino_game_money_result_notice_div').text(num + ' 배율로 ' + _commaMoney((num * casino_betting)) + ' 만원을 획득하셨습니다.' );
    
            _addLog(`<div class="game_alert_2 custom_color_1"> 잭팟 성공 ( + ${_commaMoney((num * casino_betting))} 만원 ) </div>`)

        } else if(result === false) {
            // 게임 실패
            $('#casino_game_money_result_notice_div').text('다음에 다시 도전하세요.');
            _addLog(`<div class="game_alert_2 red back_black"> 잭팟 실패 </div>`)
        }

        if(round_timer !== 0) {
            _timerOn()
        }

        if(computer === true) {
            return window.setTimeout( () => {
                return _turnEnd()
            }, 500)
        }
    }, 500)
  }

  render() {
    const { 
        turn, casino_start, casino_betting, casino_game_start, casino_select_card, casino_card_select, casino_card_ment, casino_game_result, 
        _bettingGameStart, _selectCard 
    } = this.props;
    const { _checkMoney, _selectBettingCard } = this;

    const player_list = JSON.parse(this.props.player_list);
    const casino_card_tool = JSON.parse(this.props.casino_card_tool);
    const casino_select_result = JSON.parse(this.props.casino_select_result);

    const now_player = player_list[Number(turn) - 1];

    let max : number = now_player.money;
    let min : number = 1;
    if(now_player.money < 1) {
        min = 0;
        max = 0;
    }

    let game_result_ment = '';
    const casino_result_style : any = {}
    if(casino_game_result === true) {
        game_result_ment = '잭팟 성공 !';
        casino_result_style['color'] = '#1687a7';

    } else if(casino_game_result === false) {
        game_result_ment = '잭팟 실패';
        casino_result_style['color'] = '#9b5151';
    }

    return(
      <div id='casino_event_div'>
        {casino_start === true ?
        <div id='casino_betting_select_div'>

            {casino_game_start !== true
                ?
                <div id='casino_betting_input_div'>
                    <b> 배팅금　|　</b>
                    <input type='number' id='betting_input' defaultValue={min} max={max}
                        onChange={(event) => _checkMoney(event, now_player.money)}
                        readOnly={casino_game_start !== false}
                        disabled={turn !== 1}
                    /> 만원
                </div>

                : <h3> 현재 배팅금　|　<b style={{ 'color' : '#822659' }}> {casino_betting} </b> 만원 </h3>
            }
            
            <div id='casino_select_card_div'>
            {casino_game_start !== true
                ? <div id='casino_betting_confirm_div'>
                    <h3> 현재 배팅금　|　<b style={{ 'color' : '#822659' }}> {casino_betting} </b> 만원 </h3>
                  
                    <input type='button' value='배팅 완료' id='betting_confirm_input'
                           style={casino_betting <= 0 ? { 'backgroundColor' : '#ababab' } : undefined}
                           onClick={() => casino_game_start === false && turn === 1 ? _bettingGameStart() : undefined}
                    />
                  </div>

                : casino_select_card !== 2 && casino_select_card !== 3
                
                ? <div id='casino_card_limit_select'>
                    <h3> 진행할 카드의 갯수를 선택해주세요. </h3>

                    <div
                        id='casino_two_card'
                        onMouseEnter={() => turn === 1 ? _selectCard('on', 2) : undefined}
                        onMouseLeave={() => turn === 1 ? _selectCard('off', 2) : undefined}
                        onClick={() => turn === 1 ? _selectCard('click', 2) : undefined}
                    > 
                        2 카드 
                    </div>

                    <div
                        id='casino_three_card'
                        onMouseEnter={() => turn === 1 ? _selectCard('on', 3) : undefined}
                        onMouseLeave={() => turn === 1 ? _selectCard('off', 3) : undefined}
                        onClick={() => turn === 1 ? _selectCard('click', 3) : undefined}
                    > 
                        3 카드 
                    </div>
                  </div>

                : casino_game_result === null 
                ?
                    <div id='casino_game_contents_div'>
                        <p> {casino_card_ment} </p>

                        <div id='casino_card_selecting_div'>
                            {casino_card_tool.map( (el : any, key : number) => {
                                
                                let contents;
                                const div_style : any = {};
                                let card_click_able = false;

                                if(el.card === true) {
                                    contents = '?';
                                    div_style['border'] = 'dotted 2px #ababab'
                                    div_style['color'] = '#ababab';
                                    div_style['cursor'] = 'pointer';

                                } else {
                                    contents = 'X';
                                }

                                if(casino_card_select === true) {
                                    if(casino_select_result[el.number] === null) {
                                        card_click_able = true;

                                        if(el.number === 2 || el.number === 3) {
                                            if(casino_select_result[1] === null) {
                                                card_click_able = false;
                                            }

                                            if(el.number === 3) {
                                                if(casino_select_result[2] === null) {
                                                    card_click_able = false;
                                                }
                                            }
                                        }

                                    } else if(casino_select_result[el.number] !== undefined) {
                                        if(casino_select_result[el.number] !== null) {
                                            contents = casino_select_result[el.number];
                                        }
                                    }
                                }

                                return(
                                    <div key={key} style={div_style} id={el.card === true ? 'select_casino_card_' + el.number : undefined}
                                        className='select_casino_card_div'
                                        onClick={() => card_click_able === true && turn === 1 ? _selectBettingCard(el.number, false) : undefined}
                                    >
                                        {contents}

                                        {card_click_able === true
                                            ? <div className='casino_select_card_able_div'> 
                                                뽑기
                                              </div>
                                            
                                            : undefined}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    : <div id='casino_game_result_div'>
                        <h3 id='casino_game_result_ment'
                            style={casino_result_style}
                        >
                            {game_result_ment}
                        </h3>

                        <h4 id='casino_game_money_result_notice_div'>

                        </h4>

                      </div>
            }
            </div>
            {/* <input type='button' id='betting_confirm_input' value='배팅'
                   title='배팅액을 걸면 카지노 게임이 시작됩니다.'
            /> */}
        </div>

        : undefined}
      </div>
    )
  }
}

export default connect( 
  ( { init, game, functions } : StoreState  ) => ({
    turn : game.turn,
    player_list : init.player_list,
    casino_start : game.casino_start,
    casino_betting : game.casino_betting,
    casino_game_start : game.casino_game_start,
    _flash : functions._flash,
    _removeAlertMent : functions._removeAlertMent,
    _playerMoney : functions._playerMoney,
    casino_select_card : game.casino_select_card,
    casino_card_tool : game.casino_card_tool,
    casino_card_select : game.casino_card_select,
    casino_card_ment : game.casino_card_ment,
    casino_select_result : game.casino_select_result,
    casino_now_card_number : game.casino_now_card_number,
    _infiniteFlash : functions._infiniteFlash,
    casino_game_result : game.casino_game_result,
    _commaMoney : functions._commaMoney,
    _timer : functions._timer,
    round_timer : init.round_timer,
    _timerOn : functions._timerOn,
    _addLog : functions._addLog,
    _bettingGameStart : functions._bettingGameStart,
    _selectCard : functions._selectCard,
    _setSelectCardEffect : functions._setSelectCardEffect,
    computer_casingo : game.computer_casingo,
    _turnEnd : functions._turnEnd
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Casino);

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
  _timerOn : Function
};

let game_start = false;
class Casino extends React.Component<AllProps> {

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

  _bettingGameStart = () => {
    const { gameActions, casino_betting, _removeAlertMent, _playerMoney, turn, casino_game_start, _flash } = this.props;
    if(casino_betting <= 0) {
        document.getElementById('betting_input')?.focus();
        _removeAlertMent('배팅금은 1 만원 이상부터 가능합니다.')
        return;
    }

    if(casino_game_start !== false) {
        return;
    }
    _playerMoney(turn, casino_betting, 'minus');

    gameActions.event_info({ 'casino_game_start' : null })

    _flash('#casino_betting_confirm_div', false, 1.4, false, 30);
    _flash('#casino_betting_input_div', false, 1.4, false, 30);

    return window.setTimeout( () => {
        gameActions.event_info({ 'casino_game_start' : true })
        _flash('#casino_card_limit_select', true, 0, false, 30);
    }, 300)
  }

  // 카드 선택하기
  _selectCard = (event : any, type : string, num : number) => {
    const { gameActions, _flash, casino_select_card } = this.props;
    const target = event.target;

    if(casino_select_card !== 0) {
        return;
    }

    if(type === 'on') {
        target.style.backgroundColor = 'white';
        target.style.color = 'black';

    } else if(type === 'off') {
        target.style.backgroundColor = '#bbbbbb';
        target.style.color = 'white';

    } else if(type === 'click') {
        target.style.backgroundColor = 'white';
        target.style.color = 'black';

        gameActions.event_info({ 'casino_select_card' : 1 })

        return window.setTimeout( () => {
            _flash('#casino_card_limit_select', false, 1.4, false, 30);

            return window.setTimeout( () => {
                const card_tool : any = [];
                let card_result_obj : any = { "1" : null, "2" : null };

                let cover_num : number = 0;
                if(num === 2) {
                    cover_num = 3;

                } else if(num === 3) {
                    cover_num = 5;
                    card_result_obj['3'] = null;
                }

                let card_num = 1;
                for(let i = 0; i < cover_num; i++) {
                    card_tool[i] = {};

                    if(i % 2 === 0) {
                        // 카드 뽑기
                        card_tool[i]['card'] = true;
                        card_tool[i]['number'] = card_num;

                        card_num += 1;

                    } else {
                        card_tool[i]['card'] = false;
                    }
                }

                gameActions.event_info({ 'casino_select_card' : num, 'casino_card_tool' : JSON.stringify(card_tool), 'casino_select_result' : JSON.stringify(card_result_obj) })
                _flash('#casino_game_contents_div', true, 0, false, 30);

                return window.setTimeout( () => {
                    gameActions.event_info({ 'casino_card_ment' : "1 번 배팅 카드를 뽑아주세요.", 'casino_card_select' : true, 'casino_now_card_number' : 1 });
                    return this._setSelectCardEffect(1, true);
                }, 300)
            }, 300)
        }, 300)
    }
  }

  // 선택할 카드 표시하기
  _setSelectCardEffect = (num : number, on : boolean) => {
    const { _infiniteFlash } = this.props;
    const event : any = document.getElementById('select_casino_card_' + num);

    if(on === true) {
        _infiniteFlash('select_casino_card_' + num, 50, true, null)
        $(event).css({
            'border' : 'solid 2px black',
            'color' : 'black'
        })
    }
  }

  // 카드 선택하기
  _selectBettingCard = (num : number) => {
    const { casino_card_select, casino_now_card_number, casino_select_card, _infiniteFlash } = this.props;
    const casino_select_result = JSON.parse(this.props.casino_select_result);

    const save_obj : any = {};
    if(casino_card_select === true) {
        if(casino_now_card_number === num) {
            const random_card = Math.trunc(Math.random() * (10 - 2) + 2);
            // const random_card = 9;
            _infiniteFlash('select_casino_card_' + num, 50, false, 1.4);
            $('select_casino_card_' + num).css({
                'border' : 'solid 2px black',
                'color' : 'black',
            })

            casino_select_result[num] = random_card; 
            
            save_obj['casino_select_result'] = JSON.stringify(casino_select_result);
            
            if(casino_select_card > num) {
                save_obj['casino_now_card_number'] = casino_now_card_number + 1;
                save_obj['casino_card_ment'] = save_obj['casino_now_card_number'] + ' 번 배팅 카드를 뽑아주세요.';

                this._setSelectCardEffect(casino_now_card_number + 1, true);
            }

            return this._getGameResult(num, casino_select_result, save_obj);
        }
    }
  }

  // 게임 결과 판정하기
  _getGameResult = (now : number, obj : any, save : any) => {
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

    if(result_check === true) {
        return this._endCasinoGame(true, result_money);

    } else {
        if(now === casino_select_card) {
            return this._endCasinoGame(false, 0);

        } else if(casino_select_card === 3) {
            if(now >= 2) {
                return this._endCasinoGame(false, 0);
            } 
        }
    }

    return 
  }

  // 마무리 짓기
  _endCasinoGame = (result : boolean, num : number) => {
    const { gameActions, casino_betting,_playerMoney, turn, _commaMoney, _timerOn, round_timer } = this.props;

    return window.setTimeout( () => {
        gameActions.event_info({ 'casino_game_result' : result });
        gameActions.round_start({ 'turn_end_able' : true })

        if(result === true) {
            // 게임 성공

            _playerMoney(turn, casino_betting * num, 'plus');

            $('#casino_game_money_result_notice_div').text(num + ' 배율로 ' + _commaMoney((num * casino_betting)) + ' 만원을 획득하셨습니다.' );
    
        } else if(result === false) {
            // 게임 실패
            $('#casino_game_money_result_notice_div').text('다음에 다시 도전하세요.');
        }

        if(round_timer !== 0) {
            _timerOn()
        }
    }, 500)
  }

  render() {
    const { turn, casino_start, casino_betting, casino_game_start, casino_select_card, casino_card_select, casino_card_ment, casino_game_result } = this.props;
    const { _checkMoney, _bettingGameStart, _selectCard, _selectBettingCard } = this;

    const player_list = JSON.parse(this.props.player_list);
    const casino_card_tool = JSON.parse(this.props.casino_card_tool);
    const casino_select_result = JSON.parse(this.props.casino_select_result);

    const now_player = player_list[Number(turn) - 1];

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
                    <input type='number' id='betting_input' defaultValue={1} max={now_player.money} 
                        onChange={(event) => _checkMoney(event, now_player.money)}
                        readOnly={casino_game_start !== false}
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
                           onClick={() => casino_game_start === false ? _bettingGameStart() : undefined}
                    />
                  </div>

                : casino_select_card !== 2 && casino_select_card !== 3
                
                ? <div id='casino_card_limit_select'>
                    <h3> 진행할 카드의 갯수를 선택해주세요. </h3>

                    <div
                        onMouseEnter={(event) => _selectCard(event, 'on', 2)}
                        onMouseLeave={(event) => _selectCard(event, 'off', 2)}
                        onClick={(event) => _selectCard(event, 'click', 2)}
                    > 
                        2 카드 
                    </div>

                    <div
                        onMouseEnter={(event) => _selectCard(event, 'on', 3)}
                        onMouseLeave={(event) => _selectCard(event, 'off', 3)}
                        onClick={(event) => _selectCard(event, 'click', 3)}
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
                                        onClick={() => card_click_able === true ? _selectBettingCard(el.number) : undefined}
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
    _timerOn : functions._timerOn
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Casino);

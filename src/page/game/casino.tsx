import * as React from 'react';

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
  casino_card_info : string
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
                const card_info : any = [];

                const cover_num = num === 2 ? 3 : 5;

                for(let i = 0; i < cover_num; i++) {
                    card_info[i] = [];
                }

                gameActions.event_info({ 'casino_select_card' : num, 'casino_card_info' : JSON.stringify(card_info) })
                _flash('#casino_game_contents_div', true, 0, false, 30);
            }, 300)
        }, 300)
    }
  }

  render() {
    const { turn, casino_start, casino_betting, casino_game_start, casino_select_card } = this.props;
    const { _checkMoney, _bettingGameStart, _selectCard } = this;
    const player_list = JSON.parse(this.props.player_list);
    const casino_card_info = JSON.parse(this.props.casino_card_info)

    const now_player = player_list[Number(turn) - 1];

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

                : <div id='casino_game_contents_div'>
                    <p> 첫번째 배팅 카드를 뽑아주세요. </p>

                    <div id='casino_card_selecting_div'>
                        {casino_card_info.map( (el : any, key : number) => {
                            
                            let contents;
                            const div_style : any = {};

                            if(key % 2 === 0) {
                                contents = '?';
                                div_style['border'] = 'dotted 2px #ababab'
                                div_style['color'] = '#ababab';
                                div_style['cursor'] = 'pointer';

                            } else {
                                contents = 'X';
                            }

                            return(
                                <div key={key} style={div_style}>
                                    {contents}
                                </div>
                            )
                        })}
                    </div>
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
    casino_card_info : game.casino_card_info
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Casino);

import * as React from 'react';
import $ from 'jquery';

import { actionCreators as initActions } from '../Store/modules/init';
import { actionCreators as gameActions } from '../Store/modules/game';
import { actionCreators as functionsActions } from '../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../Store/modules';

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
    _addLog : Function
};

class Init extends React.Component<AllProps> {

    _bettingGameStart = () => {
        const { gameActions, casino_betting, _removeAlertMent, _playerMoney, turn, casino_game_start, _flash, _addLog } = this.props;
        const player_list = JSON.parse(this.props.player_list);
        
        if(casino_betting <= 0) {
            document.getElementById('betting_input')?.focus();
            _removeAlertMent('배팅금은 1 만원 이상부터 가능합니다.')
            return;
    
        } else if(player_list[Number(turn) - 1].money < casino_betting) {
            _removeAlertMent('현금이 부족합니다.')
            return;
        }
    
        if(casino_game_start !== false) {
            return;
        }
        _playerMoney(turn, casino_betting, 'minus');
    
        _addLog(`<div class='game_alert_2'> <b class='color_player_${turn}'> ${turn} 플레이어 </b>　|　${casino_betting} 만원 배팅 </div>`)
    
        gameActions.event_info({ 'casino_game_start' : null })
    
        _flash('#casino_betting_confirm_div', false, 1.4, false, 30);
        _flash('#casino_betting_input_div', false, 1.4, false, 30);
    
        return window.setTimeout( () => {
            gameActions.event_info({ 'casino_game_start' : true })
            _flash('#casino_card_limit_select', true, 0, false, 30);
        }, 300)
    }

    // 카드 선택하기
    _selectCard = (type : string, num : number) => {
        const { gameActions, _flash, casino_select_card } = this.props;
        let target : any = null;
        
        if(num === 2) {
            target = document.getElementById('casino_two_card');

        } else if(num === 3) {
            target = document.getElementById('casino_three_card');
        }

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
            // _infiniteFlash('select_casino_card_' + num, 50, true, null)
            $(event).css({
                'border' : 'solid 2px black',
                'color' : 'black'
            })
        }
    }

    // 게임 시작하기
    _gameStart = () => {
        const { _flash, initActions, gameActions } = this.props;

        initActions.toggle_setting_modal({ 'able' : false });
        gameActions.game_loading({ 'loading' : true })

        return window.setTimeout( () => {
            _flash('.ReactModal__Content', false, 1.4, false, 40);

            return window.setTimeout( () => {
                initActions.toggle_setting_modal({ 'modal' : false });
            }, 500)

        }, 200)
    }

    componentDidMount() {
        const { functionsActions } = this.props;

        // 함수 저장하기
        functionsActions.save_function({
            '_bettingGameStart' : this._bettingGameStart,
            '_selectCard' : this._selectCard,
            '_setSelectCardEffect' : this._setSelectCardEffect,
            '_gameStart' : this._gameStart
        })
    }

    render() {
        return(
            <div>
                {/* 함수 저장하기 */}
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
    _addLog : functions._addLog
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions: bindActionCreators(functionsActions, dispatch),
  }) 
)(Init);

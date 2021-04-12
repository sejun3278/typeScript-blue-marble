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
  functionsActions : any,
  bank_tap : number | null,
  bank_info : string,
  turn : number | null,
  bank_incentive_percent : number,
  player_list : string,
  _removeAlertMent : Function,
  _playerMoney : Function
};

class Bank extends React.Component<AllProps> {

  _clickBankTap = (tap_num : number) => {
    const { turn, gameActions } = this.props;

    if(turn === 1) {
        gameActions.event_info({ 'bank_tap' : tap_num })
    }
  }

  _toggleHomeDiv = (event : any, type : string) => {
    const target = event.target;

    if(type === 'on') {
        target.style.color = 'black';
        target.style.border = 'solid 3px black';
        target.style.fontWeight = 'bold';

    } else if(type === 'off') {
        target.style.color = '#ababab';
        target.style.border = 'solid 2px #ababab';
    }
  }

  // 예금액 조정하기
  _saveMoney = (event : any) => {
    const { turn, gameActions, initActions, bank_incentive_percent } = this.props;
    const bank_info = JSON.parse(this.props.bank_info);
    const player_list = JSON.parse(this.props.player_list);

    let save_money : number = Number(event.target.value);

    if(save_money < 0) {
        save_money = 0;
    }

    // 1. 예금되어 있는 기존의 금액
    const my_save_money : number = bank_info[Number(turn)].save_money;
    
    // 2. 기존의 예금액 - Input 으로 받아온 예금액
    let extra_money = my_save_money - save_money;

    // 3. 플레이어의 돈 - 2. 의 금액 빼기
    let player_money = player_list[Number(turn) - 1].money + extra_money;

    if(player_money < 0) {
        // 만약 3. 의 결과가 0 미만으로 나오게 되면
        // INPUT 은 플레이어의 돈으로 대입
        save_money = save_money + player_money;

        // 플레이어 돈은 0 으로 변환
        player_money = 0; 
    }

    player_list[Number(turn) - 1].money = player_money;

    bank_info[Number(turn)].save_money = save_money;

    // 금리 구하기
    const interest_rate = bank_incentive_percent / 100;
    bank_info[Number(turn)].round_incentive = Math.floor(save_money * interest_rate);

    gameActions.event_info({ 'bank_info' : JSON.stringify(bank_info) });

    initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) })

    event.target.value = save_money;
  }

  // 누적 이자금 환급받기
  _returnTotalIncentive = () => {
    const { turn, _removeAlertMent, gameActions, _playerMoney } = this.props;
    const bank_info = JSON.parse(this.props.bank_info);
    const my_info = bank_info[Number(turn)];

    if(my_info.total_incentive === 0) {
        return _removeAlertMent('환급될 누적 이자가 없습니다.');

    } else {
        _playerMoney(turn, my_info.total_incentive, 'plus');

        my_info.total_incentive = 0;
        gameActions.event_info({ 'bank_info' : JSON.stringify(bank_info) })

        return _removeAlertMent('누적 이자가 환급되었습니다.');
    }
  }

  _setPlayerRating = (player : number, bank_info : any) => {
    const player_list = JSON.parse(this.props.player_list);
    const my_info = player_list[player - 1];

    let rating : number = 9;

    // 보유 도시 보기
    const my_city_length = my_info.maps.length;
    if(my_city_length > 0) {
        if(my_city_length >= 1 && my_city_length < 4) {
            // 1 ~ 3개 이상 소유
            rating = rating - 1;

        } else if(my_city_length >= 4 && my_city_length < 8) {
            // 4 ~ 7개 이상 소유
            rating = rating - 1;

        } else if(my_city_length >= 8 && my_city_length < 12) {
            // 8 ~ 11개 이상 소유
            rating = rating - 1;

        } else if(my_city_length >= 12 && my_city_length < 17) {
            // 12 ~ 16개 이상 소유
            rating = rating - 1;

        } else if(my_city_length >= 17 && my_city_length < 20) {
            // 17 ~ 20개 이상 소유
            rating = rating - 1;
        }
    }
    
    // 예금액 보기
    const save_money : number = bank_info.save_money;
    if(save_money > 0) {
        if(save_money >= 100 && save_money < 200) {
            rating = rating - 1;
        }
    }

    return rating;
  }

  render() {
    const { bank_tap, gameActions, bank_incentive_percent, turn } = this.props;
    const { _clickBankTap, _toggleHomeDiv, _saveMoney, _returnTotalIncentive, _setPlayerRating } = this;

    const bank_info = JSON.parse(this.props.bank_info);
    const my_info = bank_info[Number(turn)];

    const tap_arr : string[] = ['예금', '대출']
    const home_arr : string[] = ['예금 정보', '대출 정보'];

    // 신용 등급 정하기
    let player_rating = _setPlayerRating(Number(turn), my_info);

    return(
      <div id='bank_event_map_div'>
        {bank_tap !== null
            ?   <div id='bank_tap_div'>
                    {tap_arr.map( (el : string, key : number) => {
                        return(
                            <div className='bank_tap_divs' key={key}
                                id={bank_tap === (key + 1) ? 'select_bank_tap' : undefined }
                                onClick={() => bank_tap !== (key + 1) ? _clickBankTap(key + 1) : undefined}
                            >
                                {el}
                            </div>
                        )
                    })}
                </div>

            : undefined}
        
        {bank_tap === null
            ? <div id='bank_home_div'>
                <h3> 어서오세요, 고객님 </h3>
                <p> 무엇을 도와드릴까요? </p>

                <div id='bank_select_home_div'>
                    {home_arr.map( (el : string, key : number) => {
                        return(
                            <div key={key} className='bank_select_home_divs'
                                 onMouseEnter={(event) => _toggleHomeDiv(event, 'on')}
                                 onMouseLeave={(event) => _toggleHomeDiv(event, 'off')}
                                 onClick={() => gameActions.event_info({ 'bank_tap' : key + 1 }) }
                            >
                                {el}
                            </div>
                        )
                    })}
                </div>
              </div>

        : bank_tap === 1

            ? <div id='bank_save_money_div'>
                <h3> 현재 금리　|　<b> {bank_incentive_percent} % </b> </h3>

                <div id='bank_my_money_info'>
                    <div id='bank_my_save_money_input_div' className='bank_grid_div'> 
                        <div className='aRight'> 현재　예금액　|　</div>
                        <div className='aLeft'>
                            <input type='number' id='bank_my_save_money_input' 
                                   defaultValue={my_info.save_money}
                                   onChange={(event) => _saveMoney(event)}
                            /> 
                            <b> 만원 </b>
                        </div>
                    </div>

                    <div id='bank_my_round_incentive_div' className='bank_grid_div'
                         style={my_info.round_incentive === 0 ? { 'color' : '#ababab' } : undefined }
                    >
                        <div className='aRight'> └ 월별 이자　|　</div>
                        <div className='aLeft'> <b> {my_info.round_incentive} </b> 만원 </div>
                    </div>

                    <div id='bank_my_total_incentive_div' className='bank_grid_div'
                         style={my_info.total_incentive === 0 ? { 'color' : '#ababab' } : undefined }
                    >
                        <div className='aRight'> 누적 이자　|　</div>
                        <div className='aLeft'> 
                            <b> {my_info.total_incentive} </b> 만원 
                            <input type='button' value='환급' id='get_bank_total_incentive_button'
                                   style={my_info.total_incentive === 0 ? { 'color' : '#ababab' } : undefined}
                                   onClick={() => turn === 1 ? _returnTotalIncentive() : undefined}
                            />
                        </div>
                    </div>
                </div>
              </div>
        
        : bank_tap === 2

            ? <div id='bank_loan_div'>
                <div id='bank_loan_player_credit_rating'>
                    <h3> <b> 내 신용 등급 </b>　|　<b> {player_rating} 등급 </b> </h3>
                </div>
              </div>

        : undefined
        }

      </div>
    )
  }
}

export default connect( 
  ( { init, game, functions } : StoreState  ) => ({
    bank_tap : game.bank_tap,
    bank_info : game.bank_info,
    turn : game.turn,
    bank_incentive_percent : init.bank_incentive_percent,
    player_list : init.player_list,
    _removeAlertMent : functions._removeAlertMent,
    _playerMoney : functions._playerMoney
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Bank);

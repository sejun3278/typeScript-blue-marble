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
  bank_tap : number | null,
  bank_info : string,
  turn : number | null,
  bank_incentive_percent : number,
  player_list : string,
  _removeAlertMent : Function,
  _playerMoney : Function,
  loan_percent : number,
  loan_date_list : string,
  loan_order_money : number,
  loan_payback_date : number,
  loan_plus_incentive : number,
  _flash : Function,
  loan_order_confirm : boolean,
  _addLog : Function,
  _splitMoneyUnit : Function
};

class Bank extends React.Component<AllProps> {

  componentDidMount() {
      // 상환 날짜 구하기
      this._getPaybackDate();
  }

  // 상환 날짜 구하기
  _getPaybackDate = () => {
    const { gameActions, turn } = this.props;

    const bank_info = JSON.parse(this.props.bank_info);
    const my_info = bank_info[Number(turn)];

    const date_list : Number[] = [ 3 ];

    let date = 4;
    for(let i = 10; i > my_info.my_rating; i--) {
        date_list.push(date);

        date += 1;
    }

    gameActions.event_info({ 'loan_date_list' : JSON.stringify(date_list) });
  }

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
    const { turn, _removeAlertMent, gameActions, _playerMoney, _addLog } = this.props;
    const bank_info = JSON.parse(this.props.bank_info);
    const my_info = bank_info[Number(turn)];

    if(my_info.total_incentive === 0) {
        return _removeAlertMent('환급될 누적 이자가 없습니다.');

    } else {
        _playerMoney(turn, my_info.total_incentive, 'plus');
        _addLog(`<div class='game_alert_2'> 누적 이자금 <b class='custom_color_1'> ${my_info.total_incentive} 만원</b>을 환급받으셨습니다. </div>`)

        my_info.total_incentive = 0;
        gameActions.event_info({ 'bank_info' : JSON.stringify(bank_info) })

        return _removeAlertMent('누적 이자가 환급되었습니다.');
    }
  }

  // 대출 신청금 input
  _setLoanInput = (event : any, my_info : any) => {
    const { turn, gameActions } = this.props;

    if(turn !== 1) {
        return;
    }

    const target = event.target;
    let value = Number(target.value);

    if(value < 0) {
        value = 0;

    } else if(value > my_info.bank_loan_limit) {
        value = my_info.bank_loan_limit;
    }

    target.value = value;

    window.setTimeout( () => {
        this._setLoanIncentive();
    })

    gameActions.event_info({ 'loan_order_money' : value });
  }

  // 대출 상환 기간 설정
  _setLoanPaybackDate = (event : any) => {
    const { turn, gameActions } = this.props;

    if(turn !== 1) {
        return;
    }

    const target = event.target;

    // 상환 날짜 받아오기
    const select_date = Number(target.value);

    window.setTimeout( () => {
        this._setLoanIncentive();
    })

    return gameActions.event_info({ 'loan_payback_date' : select_date })
  }

  // 대출 이자금 설정하기
  _setLoanIncentive = () => {
    const { loan_order_money, loan_percent, loan_payback_date, gameActions } = this.props;

    let result = 0;

    if(loan_order_money === 0 || loan_payback_date === 0) {
        result = 0;

    } else {
        const percent = (loan_percent / 100)
        const minus_percent = (loan_payback_date - 3) * 0.005
        
        const total_percent = Number(String(percent - minus_percent).slice(0, 5));
        
        result = Math.ceil((loan_order_money * 100) * total_percent);
    }
  
    return gameActions.event_info({ 
        'loan_plus_incentive' : result
    })
  }

  // 대출 신청하기
  _orderLoan = () => {
    const { turn, _addLog, gameActions, loan_plus_incentive, loan_order_money, loan_payback_date, loan_order_confirm, _removeAlertMent, _playerMoney } = this.props;

    const bank_info = JSON.parse(this.props.bank_info);

    if(loan_order_confirm === false) {
        if(loan_order_money === 0) {
            _removeAlertMent('대출액은 100 만원 이상부터 가능합니다.');
            document.getElementById('my_loan_input')?.focus();
            return;

        } else if(loan_payback_date === 0) {
            _removeAlertMent('대출 자동 상환 기간을 설정해주세요.');
            document.getElementById('select_bank_loan_payback_date')?.focus();
            return;
        }

        bank_info[Number(turn)]['repay_day'] = loan_payback_date;
        bank_info[Number(turn)]['loan_incentive'] = loan_plus_incentive;
        bank_info[Number(turn)]['loan'] = loan_order_money;

        gameActions.event_info({
            'bank_info' : JSON.stringify(bank_info),
            'loan_order_confirm' : true
        })
        
        _addLog(`<div class='game_alert_2'> 은행으로부터 <b class='custom_color_1'>${(loan_order_money * 100)} 만원</b>을 대출받았습니다. <br /> <b class='orange'>${loan_payback_date} 라운드</b> 후 자동으로 상환됩니다. </div>`)
        return _playerMoney(turn, (loan_order_money * 100), 'plus');

    } else {
        _removeAlertMent('대출 신청중입니다. 잠시만 기다려주세요.');
        return;
    }
  }

  // 대출 상환하기
  _repayLoan = (money : number, loan : number) => {
    const { gameActions, _playerMoney, _removeAlertMent, turn, _addLog } = this.props;
    const bank_info = JSON.parse(this.props.bank_info);

    if(money < loan) {
        return _removeAlertMent('상환금 ' + loan + ' 만원이 필요합니다.');

    } else {
        _playerMoney(turn, loan, 'minus');

        bank_info[Number(turn)]['loan'] = 0;
        bank_info[Number(turn)]['loan_incentive'] = 0;
        bank_info[Number(turn)]['repay_day'] = 0;

        _addLog(`<div class='game_alert_2'> 대출금 <b class='custom_color_1'> ${loan} 만원 </b> 을 상환하셨습니다. </div>`)
    }

    return gameActions.event_info({ 'bank_info' : JSON.stringify(bank_info), 'loan_order_confirm' : false })
  }

  render() {
    const { bank_tap, gameActions, bank_incentive_percent, turn, loan_percent, loan_order_money, loan_plus_incentive, loan_payback_date, loan_order_confirm ,_splitMoneyUnit } = this.props;
    const { _clickBankTap, _toggleHomeDiv, _saveMoney, _returnTotalIncentive, _setLoanInput, _setLoanPaybackDate, _orderLoan, _repayLoan } = this;

    const bank_info = JSON.parse(this.props.bank_info);
    const my_info = bank_info[Number(turn)];
    const loan_date_list = JSON.parse(this.props.loan_date_list);

    const player_list = JSON.parse(this.props.player_list);

    const tap_arr : string[] = ['예금', '대출']
    const home_arr : string[] = ['예금 정보', '대출 정보'];

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
                        <div className='aLeft'> <b> {_splitMoneyUnit(my_info.round_incentive)} </b> </div>
                    </div>

                    <div id='bank_my_total_incentive_div' className='bank_grid_div'
                         style={my_info.total_incentive === 0 ? { 'color' : '#ababab' } : undefined }
                    >
                        <div className='aRight'> 누적 이자　|　</div>
                        <div className='aLeft'> 
                            <b> {_splitMoneyUnit(my_info.total_incentive)} </b> 
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

                {my_info.repay_day === 0 && my_info.loan === 0 && my_info.loan_incentive === 0 && loan_order_confirm === false
                ?
                    loan_order_confirm === false
                    ?
                    <div id='bank_loan_player_credit_rating'>
                        <h3> <b> 내 신용 등급 </b>　|　<b> {my_info.my_rating} 등급 </b> </h3>

                        {loan_plus_incentive > 0
                            ?
                            <div id='bank_loan_confirm_button_div'
                                onClick={_orderLoan}
                            >
                                대출 신청
                            </div>

                            : undefined
                        }

                        <div id='bank_loan_grid_div'>
                            <div id='bank_loan_contents_div'> 
                                <p> 대출 한도　|　{_splitMoneyUnit(my_info.bank_loan_limit * 100)} </p>
                                <div className={loan_order_money === 0 ? 'gray' : undefined}>                            
                                    <input type='number' id='my_loan_input' defaultValue={loan_order_money}
                                        max={my_info.bank_loan_limit} min={0}
                                        onChange={(event) => _setLoanInput(event, my_info)}
                                    />
                                    <div id='bank_loan_option_div' style={loan_order_money > 0 ? { 'color' : 'black' } : undefined}>
                                        00
                                    </div>
                                    만원
                                </div>
                            </div>

                            <div id='bank_loan_info_div'> 
                                <div className='bank_loan_grid_div'> 
                                    <div className='aRight'> 기본 이자율　|　</div>
                                    <div className='aLeft'> {loan_percent} % </div> 
                                </div>
                                <div id='bank_loan_order_div'>
                                        <select onChange={(event) => _setLoanPaybackDate(event)}
                                                defaultValue={loan_payback_date}
                                                id='select_bank_loan_payback_date'
                                        > 
                                            <option value={0}> - 자동 상환 기간 </option>
                                            {loan_date_list.map( (el : number, key : number) => {
                                                return(
                                                    <option key={key} value={el}>
                                                        {el} 라운드
                                                    </option>
                                                )
                                            })}
                                        </select>
                                </div>
                                <div className='bank_loan_grid_div' style={loan_plus_incentive === 0 ? { 'color' : '#ababab' } : undefined}> 
                                    <div className='aRight'> 대출 이자금　|　</div>
                                    <div className='aLeft'>
                                        {_splitMoneyUnit(loan_plus_incentive)} 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    : undefined

                : <div id='loan_repay_divs'>
                    {loan_order_confirm === true
                        ?   <div id='loan_confirm_div'>
                                <h3> 대출 신청이 완료되었습니다. </h3>

                                <div id='loan_bill_div'>
                                    <h4> 대출 확인서 </h4>

                                    <div id='loan_bill_list_div'>
                                        <div className='loan_bill_grid_div'>
                                            <div className='aRight'> 대출금　|　 </div>
                                            <div className='aLeft'> {my_info.loan * 100} 만원 </div>
                                        </div>

                                        <div className='loan_bill_grid_div'>
                                            <div className='aRight'> 상환 라운드　|　 </div>
                                            <div className='aLeft'> {my_info.repay_day} 라운드 후 </div>
                                        </div>

                                        <div className='loan_bill_grid_div'>
                                            <div className='aRight'> 대출 이자　|　 </div>
                                            <div className='aLeft'> {my_info.loan_incentive} 만원 </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        : <div>
                            <h3> 내 대출 정보 </h3>

                            <input type='button' value='대출 상환하기' id='loan_repay_button' 
                                   style={player_list[Number(turn) - 1].money < (my_info.loan * 100) + my_info.loan_incentive
                                        ? { 'color' : 'white', 'backgroundColor' : '#ababab' }

                                        : undefined
                                    }
                                    onClick={() => _repayLoan(player_list[Number(turn) - 1].money, (my_info.loan * 100) + my_info.loan_incentive)}
                            />

                            <div id='loan_state_div'>
                                <div className='loan_bill_grid_div'>
                                    <div className='aRight'> 대출 상환금　|　 </div>
                                    <div className='aLeft'> { (my_info.loan * 100) + my_info.loan_incentive } 만원 </div>
                                </div>

                                <div className='loan_bill_grid_div'>
                                    <div className='aRight'> 남은 상환일　|　 </div>
                                    <div className='aLeft'> { my_info.repay_day } 라운드 </div>
                                </div>
                            </div>
                          </div>
                    }
                  </div>
                }
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
    _playerMoney : functions._playerMoney,
    loan_percent : init.loan_percent,
    loan_date_list : game.loan_date_list,
    loan_order_money : game.loan_order_money,
    loan_payback_date : game.loan_payback_date,
    loan_plus_incentive : game.loan_plus_incentive,
    _flash : functions._flash,
    loan_order_confirm : game.loan_order_confirm,
    _addLog : functions._addLog,
    _splitMoneyUnit: functions._splitMoneyUnit
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Bank);

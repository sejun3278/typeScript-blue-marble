import * as React from 'react';
import $ from 'jquery';

import { actionCreators as initActions } from '../../Store/modules/init';
import game, { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import icon_list from '../../source/icon.json';
import landmark_list from '../../source/landmark.json';

export interface AllProps {
  initActions : any,
  gameActions : any,
  functionsActions : any,
  settle_extra_money : number,
  _splitMoneyUnit : Function,
  settle_bill : string,
  turn : number,
  player_list : string,
  map_info : string,
  _addLog : Function,
  _timerOn : Function,
  _turnEnd : Function,
  settle_type : string | null,
  bank_info : string,
  round_timer : number,
  _flash : Function,
  sale_incentive : number,
  settle_state : string
};

let settle_timer : any = false;
class Settle extends React.Component<AllProps> {

  componentDidMount() {
    const { round_timer, _turnEnd, gameActions, _flash, turn } = this.props;

    let second = 1;
    if(round_timer > 0) {
      const timer = round_timer === 60 ? 1.65 : Number(String(100 / round_timer).slice(0, 4));
      const target : any = document.getElementById('player_settle_timer_div');

      target.style.width = '100%';

      $(target).stop().animate({
        'width' : 0
      }, round_timer * 1000);

      settle_timer = window.setInterval( () => {
        if(second >= round_timer) {
          // 파산하기
          this._confirmSettle(turn);

          return;
        }

        // const width : number = Number(String(100 - (timer * second)).slice(0, 4));

        if(round_timer - second <= 10) {
          _flash('#player_settle_timer_div', false, 1.4, true, 40, null, 1);
        }

        second += 1;
      }, 1000)
    }
  }

  // 소유지 매각하기
  _saleSettle = (_map_info : any) => {
    const { _splitMoneyUnit, _addLog, settle_extra_money, turn, initActions, gameActions, _turnEnd, settle_type, _flash, sale_incentive } = this.props;
    const map_info = JSON.parse(this.props.map_info);
    const player_list = JSON.parse(this.props.player_list);

    // 수수료가 적용된 가격
    const incentive = Math.floor(_map_info.pass * sale_incentive / 100);
    const map_price = _map_info.pass - incentive;

    let extra_money = settle_extra_money;
    if(window.confirm(_map_info.name + '에 대한 소유권을 포기하고 매각하시겠습니까? \n매각시 [ ' + _splitMoneyUnit(map_price) + '] 을 회수합니다.')) {
      _addLog(`<div class='game_alert_2'> <b class='color_player_${_map_info.host}'>${_map_info.host} 플레이어</b>가 <b class='orange'>${_map_info.name}</b>에 대한 소유권을 포기했습니다. </div>`)

      map_info[_map_info.number].host = null;
      map_info[_map_info.number].price = map_info[_map_info.number].pass;

      _flash('#extra_debt', false, 1.4, true, 40, null, 1);
      if(map_price - extra_money > 0) {
        // 매각 후 돈이 남을 경우
        player_list[Number(turn) - 1].money = map_price - extra_money;
        extra_money = 0;

      } else {
        extra_money = extra_money - map_price;
      }

      // 소유권 포기한 맵 없애기
      const map_idx = player_list[Number(turn) - 1].maps.indexOf(_map_info.number);
      player_list[Number(turn) - 1].maps[map_idx] = null;

      player_list[Number(turn) - 1].maps =
      player_list[Number(turn) - 1].maps.filter( (el : any) => {
        return el !== null;
      });

      // 맵 저장
      initActions.set_setting_state({ 'map_info' : JSON.stringify(map_info) });
      initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) });

      const save_obj : any = {}
      save_obj['settle_extra_money'] = extra_money;

      if(extra_money === 0) {
        save_obj['settle_modal'] = false;

        if(settle_type === 'loan') {
          // 대출 정산하기
          const bank_info = JSON.parse(this.props.bank_info);

          bank_info[turn]['repay_day'] = 0;
          bank_info[turn]['loan'] = 0;
          bank_info[turn]['loan_incentive'] = 0;

          gameActions.event_info({ 'bank_info' : JSON.stringify(bank_info) });
        }
        save_obj['settle_type'] = null;

        window.setTimeout(() => {
          // 턴 종료
          _turnEnd();

        }, 1000);
      }

      gameActions.settle_player_money(save_obj);

    } else {
      return;
    }
  }

  _getPlayerEstatePrice = (maps : any) => {
    // 수수료가 적용된 총 자산 구하기
    let result = 0;

    const { sale_incentive } = this.props;
    const map_info = JSON.parse(this.props.map_info);

    maps.forEach( (el : any) => {
      const map = map_info[el];

      const incentive = Math.floor(map.pass * sale_incentive / 100);
      result += map.pass - incentive;
    })

    return result;
  }

  // 파산하기
  _confirmSettle = (player : number) => {
    const { _turnEnd, gameActions, _addLog } = this.props;
    const settle_state = JSON.parse(this.props.settle_state);
    const bank_info = JSON.parse(this.props.bank_info);

    // 파산

    // 빚 전부 청산하기
    bank_info[player]['repay_day'] = 0;
    bank_info[player]['loan'] = 0;
    bank_info[player]['loan_incentive'] = 0;

    gameActions.event_info({ 'bank_info' : JSON.stringify(bank_info) });

    settle_state[player] = true;
    gameActions.settle_player_money({ 'settle_state' : JSON.stringify(settle_state) })

    const ment = `<div class='game_alert_2 back_black red'> <b class='color_player_${player}'> ${player} 플레이어 </b>가 파산했습니다. </div>`
    _addLog(ment);

    clearInterval(settle_timer);

    gameActions.settle_player_money({ 'settle_modal' : false, 'settle_type' : null, 'settle_bill' : JSON.stringify({}), 'settle_extra_money' : 0 })
   
    // 게임 종료 여건 체크하기
    let winner : string | null = null;
    let game_over = true;
    let check : number = 0;

    for(let key in settle_state) {
      check += 1;

      if(settle_state[key] === false) {
        if(winner !== null) {
          game_over = false;
        }
        winner = key;
      }
    }
   
    if(game_over === true) {
      // 게임 종료
      gameActions.game_over({ 'game_over' : true, 'winner' : winner })
    }

    return window.setTimeout(() => {
      return _turnEnd();
    }, 300);
  }

  render() {
    const { settle_extra_money, _splitMoneyUnit, turn, round_timer, sale_incentive } = this.props;
    const { _saleSettle, _getPlayerEstatePrice } = this;

    const settle_bill = JSON.parse(this.props.settle_bill);
    const player_list = JSON.parse(this.props.player_list);

    const my_info = player_list[turn - 1];
    const my_map_list = my_info.maps;

    const map_info = JSON.parse(this.props.map_info);

    return(
      <div id='player_settle_divs'>
        <h3>　빚 청산까지 <b className='red' id='extra_debt'> {_splitMoneyUnit(settle_extra_money)} </b> 남았습니다. </h3>

        {round_timer > 0
        ?
          <div id='player_settle_timer_div' />

        : undefined}

        <div id='player_settle_grid_div'>
          <div id='player_settle_bank_money_state'
               style={{ 'borderRight' : 'dotted 1px #ababab' }}
          >
            <h4> 은행 정산 영수증 </h4>

          { settle_bill[turn] !== undefined ?
            <div id='player_settle_bank_bill_div'>
              <div className='player_settle_bank_grid_div' id='player_settle_bank_bill_loan_div'>
                <div> 정산 목표　|　 </div>
                <div className='aRight'> {_splitMoneyUnit(settle_bill[turn]["1"]['loan'])} </div>
              </div>

              <div className='player_settle_bank_grid_div'
                   style={settle_bill[turn]["1"]['player_money'] <= 0 ? { 'color' : '#ababab' } : undefined}
              >
                <div> 보유 자산　|　 </div>
                <div className='aRight'> - {_splitMoneyUnit(settle_bill[turn]["1"]['player_money'])} </div>
              </div>

              <div className='player_settle_bank_grid_div'
                   style={settle_bill[turn]["2"]['player_save_money'] <= 0 ? { 'color' : '#ababab' } : undefined}
              >
                <div> 은행 예금　|　 </div>
                <div className='aRight'> - {_splitMoneyUnit(settle_bill[turn]["2"]['player_save_money'])} </div>
              </div>

              <div className='player_settle_bank_grid_div'
                   style={settle_bill[turn]["3"]["player_total_incentive"] <= 0 ? { 'color' : '#ababab' } : undefined}
              >
                <div> 누적 이자　|　 </div>
                <div className='aRight'> - {_splitMoneyUnit(settle_bill[turn]["3"]["player_total_incentive"])} </div>
              </div>

              <div id='player_settle_bank_bill_result_div'>
                <div> 
                  남은 정산금은 
                  <div> <b className='gray'> {_splitMoneyUnit(settle_bill[turn]["3"]["extra_price"])} </b> 입니다. </div>
                </div>
              </div>
            </div>

            : undefined}

          </div>

          <div id='player_settle_estate_money_state'>
            <h4 className='aCenter'> 소유 토지 매각하기 </h4>

            {sale_incentive > 0
              ? <div id='player_sale_incentive_notice_div'>
                  <b> * 매각 수수료　|　{sale_incentive} % </b>
                </div>

              : undefined
            }

            <div id='player_settle_estate_list_div'>
              {my_map_list.length > 0
                ? <div id='player_sale_estate_div'>
                    <div id='player_all_estate_money_div'>
                      부동산 자산　|　{
                        _splitMoneyUnit(_getPlayerEstatePrice(my_map_list))
                        // _splitMoneyUnit(my_info.estate_money)
                      }
                    </div>

                    <div id='player_settle_estate_list'>
                      {my_map_list.map( (el : any, key : number) => {
                        const map = map_info[el];

                        const incentive = Math.floor(map.pass * sale_incentive / 100);

                        let map_name = map.name;
                        if(map_name === '경기 광명') {
                          map_name = '광명';
                        }

                        return(
                          <div className='player_settle_estate_list_divs' key={key}>
                            <div> <b> {map_name} </b> </div>
                            <div className='player_settle_estate_build_state_div'>
                              {map.build.map( (cu : any, key_2 : number) => {

                                let icon : any = '';

                                if(cu.build === true) {
                                  if(key_2 === 0) {
                                    icon = icon_list.building.house;
                                    
                                  } else if(key_2 === 1) {
                                    icon = icon_list.building.apartment;
  
                                  } else if(key_2 === 2) {
                                    icon = icon_list.building.hotel;
                                  }

                                  if(map.number === 7) {
                                    icon = icon_list.building.flag;
                                  }
                                }

                                if(map.build[3].build === false) {
                                  if(key_2 < 3) {
                                    return(
                                      <div key={key_2}>
                                        <img alt='' src={icon} className='player_settle_build_icon'/>
                                      </div>
                                    )
                                  }

                                } else {
                                  if(key_2 === 3) {
                                    icon = landmark_list;
                                    icon = icon.landmark[map.number];

                                    return(
                                      <div key={key_2} style={{ 'width' : '100px' }}>
                                        <img alt='' src={icon} className='player_settle_build_icon' />
                                        <b className='custom_color_1'> 랜드마크 </b>
                                      </div>
                                    )
                                  }
                                }

                              })}
                            </div>
                            
                            <div className='player_settle_price_and_sale_div'>
                              <b> {_splitMoneyUnit(map.pass - incentive)} </b>
                              <input type='button' value='매각' className='player_settle_sale_estate' 
                                     onClick={() => _saleSettle(map)}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                : <div id='player_settle_estate_empty_div'>
                    <h4> 보유중인 도시가 없습니다. </h4>
                  </div>
              }
            </div>
          </div>
        </div>

        <div id='player_settle_confirm_div'>
          <input type='button' value='파산 신청 ( 게임 포기 )'
                 onClick={() => window.confirm('파산을 신청하면 게임에서 패배합니다. \n정말 파산하시겠습니까?') ? this._confirmSettle(turn) : undefined}
          />
        </div>

      </div>
    )
  }
}

export default connect( 
  ( { init, game, functions } : StoreState  ) => ({
    settle_extra_money : game.settle_extra_money,
    _splitMoneyUnit : functions._splitMoneyUnit,
    settle_bill : game.settle_bill,
    turn : game.turn,
    player_list : init.player_list,
    map_info : init.map_info,
    _addLog : functions._addLog,
    _timerOn : functions._timerOn,
    _turnEnd : functions._turnEnd,
    settle_type : game.settle_type,
    bank_info : game.bank_info,
    round_timer: init.round_timer,
    _flash : functions._flash,
    sale_incentive : init.sale_incentive,
    settle_state : game.settle_state
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Settle);

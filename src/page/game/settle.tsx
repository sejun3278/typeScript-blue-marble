import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
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
  map_info : string
};

class Settle extends React.Component<AllProps> {

  render() {
    const { settle_extra_money, _splitMoneyUnit, turn } = this.props;
    const settle_bill = JSON.parse(this.props.settle_bill);
    const player_list = JSON.parse(this.props.player_list);

    const my_info = player_list[turn - 1];
    const my_map_list = my_info.maps;

    const map_info = JSON.parse(this.props.map_info);

    return(
      <div id='player_settle_divs'>
        <h3>　빚 청산까지 <b className='red'> {_splitMoneyUnit(settle_extra_money)} </b> 남았습니다. </h3>

        <div id='player_settle_grid_div'>
          <div id='player_settle_bank_money_state'
               style={{ 'borderRight' : 'dotted 1px #ababab' }}
          >
            <h4> 은행 정산 영수증 </h4>

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

          </div>

          <div id='player_settle_estate_money_state'>
            <h4 className='aCenter'> 소유 토지 매각하기 </h4>

            <div id='player_settle_estate_list_div'>
              {my_map_list.length > 0
                ? <div id='player_sale_estate_div'>
                    <div id='player_all_estate_money_div'>
                      부동산 자산　|　{_splitMoneyUnit(my_info.estate_money)}
                    </div>

                    <div id='player_settle_estate_list'>
                      {my_map_list.map( (el : any, key : number) => {
                        const map = map_info[el];

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
                              <b> {_splitMoneyUnit(map.pass)} </b>
                              <input type='button' value='매각' className='player_settle_sale_estate' />
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
          <input type='button' value='파산 신청 ( 게임 포기 )'/>
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
    map_info : init.map_info
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Settle);

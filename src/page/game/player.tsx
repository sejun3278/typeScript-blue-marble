import * as React from 'react';
import $ from 'jquery';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import img from '../../source/icon.json';
import ment_list from '../../source/ment.json';

export interface AllProps {
  initActions : any,
  gameActions : any,
  info : string,
  float_style : object,
  number : number,
  _commaMoney : Function,
  turn : number | null,
  round_start : boolean,
  stop_info : string,
  round : number,
  bank_info : string,
  player_bank_info_alert : boolean,
  bank_incentive_percent : number,
  loan_percent : number,
  player_estate_info_alert : boolean,
  map_info : string,
  _splitMoneyUnit : Function,
  pass_price : number
};

class Player extends React.Component<AllProps> {

  // 정보 알럿 띄우기
  _setInfoAlert = (_ment : any, bool : boolean, _target : string) => {
    let target : any = document.getElementById(_target);
    const get_ment : any = ment_list.alert;
    const ment = get_ment[_ment];

    if(bool === true) {
      $(target).append('<div id="notice_divs">' + ment + '</div>');

    } else if(bool === false) {
      target = document.getElementById('notice_divs');
      target.remove();
    }
  }

  render() {
    const { 
      gameActions, float_style, _commaMoney, number, turn, round_start, round, player_bank_info_alert,
      bank_incentive_percent, loan_percent, player_estate_info_alert, _splitMoneyUnit, pass_price
    } = this.props;
    const { _setInfoAlert } = this;
    const info : any = JSON.parse(this.props.info);
    const map_list = JSON.parse(this.props.map_info)

    let img_list : any = img.img.character;
    const MapInfo = require('./city_info.json');

    let my_thumb : string = img_list.stop[info.character];
    const name_style : object | any = {};

    let thumb_class = 'game_contents_player_thumbnail';
    let contents_class = 'game_contents_player_info_div';

    const contents_style : any = JSON.parse(JSON.stringify(float_style));
    
    let my_turn_style : any = {};

    let my_location : string = '';

    let player_money : string = '';
    if(info.able === false) {
        thumb_class += ' empty_player_thumb';
        contents_class += ' empty_player_contents'

        my_thumb = img_list.empty;
        name_style["color"] = '#ababab';

    } else {
        name_style["backgroundColor"] = info.color;
        name_style["color"] = 'white';

        my_location = MapInfo[info.location].name;

        if(round > 1) {
          if(MapInfo[info.location].number === 0) {
            my_location = '은행';
          }
        }

      player_money = _splitMoneyUnit(info.money);
    }

    if(info.number === 2 || info.number === 4) {
      contents_style['borderRight'] = 'solid 1px #ababab';

        if(info.able === true) {
            img_list = img.img.reverse.stop;
            my_thumb = img_list[info.character];

            contents_class += ' aRight';

            my_turn_style['textAlign'] = 'right';

            if(info.number === 2 || info.number === 4) {
              my_turn_style['marginLeft'] = '253px';
            }
        }

    } else {
      contents_style['borderLeft'] = 'solid 1px #ababab';
      contents_class += ' game_contents_player_info_margin'
    }

    if(info.able === true) {
      if(round_start === true) {
        if(turn === Number(info.number) && info) {
          img_list = img.img.character;
          my_thumb = img_list.action[info.character];
        }
      }
    }

    const stop_info = JSON.parse(this.props.stop_info);
    let stop_turn : string = '';

    if(info.location === 6) {
      if(stop_info[Number(info.number)] > 0) {
        stop_turn = ' ( ' + stop_info[Number(info.number)] + ' 턴 남음 )'
      }
    }

    let bank_icon : string = img.icon.empty_bank;
    let estate_notice_icon : string = img.icon.notice_gray;

    const bank_info = JSON.parse(this.props.bank_info);
    const my_bank = bank_info[Number(turn)];

    if(round_start === true) {
      if(my_bank.save_money > 0 || my_bank.total_incentive > 0 || my_bank.loan > 0 || my_bank.loan_incentive > 0) {
        bank_icon = img.icon.bank;  
      }

      if(info.number !== turn) {
        bank_icon = img.icon.empty_bank;
      }

      if(info.able === true) {
        if(info.maps.length > 0) {
          estate_notice_icon = img.icon.notice
        }
      }
    }

    const bank_info_alert_info = [
      {
        "title" : "예금 정보",
        "other" : "( 금　리　" + bank_incentive_percent + " % )",
        "info" : [      
          { 'title' : '예금 금액', 'value' : 'save_money' },
          { 'title' : '예금 이자', 'value' : 'round_incentive' },
          { 'title' : '누적 이자', 'value' : 'total_incentive' },
        ]
      },

      {
        "title" : "대출 정보",
        "other" : "( 이자율　" + loan_percent + " % )",
        "info" : [
          { 'title' : '대출 금액', 'value' : 'loan' },
          { 'title' : '대출 이자', 'value' : 'loan_incentive' },
          { 'title' : '상환 기간', 'value' : 'repay_day' }
        ]
      }
    ]

    let bonus_money : number | string = 0;
    const bonus_style = { 'color' : '#ababab' };

    if(round_start === true) {
     bonus_money = my_bank['round_incentive'] - my_bank['loan_incentive'];

      if(bonus_money > 0) {
        bonus_money = "+" + _commaMoney(bonus_money);
        bonus_style['color'] = '#00af91'

      } else if(bonus_money < 0) {
        bonus_style['color'] = '#af0069'
      }
    }

    // console.log(player_money)

    return(
      <div className='game_contents_player_profile_div' key={number}
             id={info.number + '_player_info_div'}
             style={float_style} 
             onMouseLeave={() => gameActions.player_bank_info({ 'player_bank_info_alert' : false })}
        >
        <div style={float_style} className='game_contents_player_thumbnail_div'> 
            <div className={thumb_class} 
                style={my_thumb !== undefined ? { 'backgroundImage' : `url(${my_thumb})` } : undefined}
            />
            <div className='game_contents_player_name'
                style={name_style}
                dangerouslySetInnerHTML={{ __html : info.name }}
            />
        </div>

        <div style={contents_style} className={contents_class}> 
            {info.able === false
                ? <h4 className='empty_player_title'> Empty Player </h4>

                : <div className='game_contents_user_info_div'>
                    <div className='game_user_have_money_div'> 
                      보유 자산　|　{player_money}

                      <img alt='' className='game_user_bank_info_icon' src={bank_icon} id='bank_icon' 
                           onMouseEnter={() => turn === info.number && turn === 1 ? gameActions.player_bank_info({ 'player_bank_info_alert' : true, 'player_estate_info_alert' : false }) : undefined}
                      />

                    </div>

                    <div className='game_user_my_location'> 현재 위치　|　{my_location} <b> {stop_turn} </b> </div>
                    <div className='game_user_has_location' style={info.maps.length > 0 ? { 'color' : '#194350', 'fontWeight' : 'bold' } : undefined}> 
                      보유 도시　|　{info.maps.length}　도시 보유 중 
                      <img alt='' className='game_user_estate_info_icon' src={estate_notice_icon} 
                           onMouseEnter={() => turn === info.number && turn === 1 ? gameActions.player_bank_info({ 'player_estate_info_alert' : true, 'player_bank_info_alert' : false })  : undefined}
                      />
                    </div>

                    {player_bank_info_alert === true && turn === info.number
                      ? <div className={'game_user_bank_info color_player_' + turn} id='game_user_bank_info'
                             onMouseLeave={() => turn === info.number ? gameActions.player_bank_info({ 'player_bank_info_alert' : false }) : undefined}
                        > 
                          <h3> 플레이어 {turn} 의 은행 정보 </h3>

                          {bank_info_alert_info.map( (el, key) => {
                            return(
                              <div key={key} className='game_user_bank_info_divs'>
                                <h4> {el.title}　<b> {el.other} </b> </h4>

                                {el.info.map( (_info, key2) => {
                                  let value = _splitMoneyUnit(my_bank[_info.value]);

                                  if(_info.value === 'loan') {
                                    value = _splitMoneyUnit(my_bank['loan'] * 100);
                                  }

                                  if(_info.value === 'repay_day') {
                                    value = my_bank[_info.value];
                                  }

                                  return(
                                    <div key={key2} className='game_user_bank_info_grid_div bold'
                                         style={my_bank[_info.value] <= 0 ? { 'color' : '#ababab' } : { 'fontWeight' : 'bold' } }
                                    >
                                      <div className='aRight'> {_info.title}　|　 </div>
                                      <div className='aLeft'> 
                                        {value}
                                        {_info.value === 'repay_day' ? ' 라운드' : undefined } 
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          })}

                            <div id='game_user_bank_info_round_bonus_alert'
                                 style={bonus_style}
                            >
                              <div> 라운드 보너스　|　</div>
                              <div> 
                                 { _commaMoney(bonus_money) } 만원 
                                <img alt='' src={img.icon.notice_white} id='game_bonus_money_info_alert_icon' 
                                     onMouseEnter={() => _setInfoAlert('bonus_info', true, 'game_user_bank_info')}
                                     onMouseOut={() => _setInfoAlert('bonus_info', false, 'game_user_bank_info')}
                                />
                              </div>
                            </div>
                        </div>

                      : undefined}

                      {player_estate_info_alert === true && turn === info.number
                        ? <div className={'game_user_bank_info color_player_' + turn}
                               id='player_estate_info_div'
                               onMouseLeave={() => gameActions.player_bank_info({ 'player_estate_info_alert' : false })}
                          >
                            <h3> 플레이어 {turn} 의 부동산 정보 </h3>
                            <p id='player_estate_length_div'
                               style={info.maps.length === 0 ? { 'color' : '#ababab' } : undefined}
                            > 
                              {info.maps.length} 개의 도시 보유 중 
                            </p>

                            <div id='player_estate_list_div'>
                              {info.maps.length > 0
                                ?
                                  info.maps.map( (el : any, key : number) => {
                                    const map = map_list[el];
                                    
                                    let total_money = map.price;

                                    // for(let i = 0; i < map.build.length; i++) {
                                    //   if(map.build[i].build === true) {
                                    //     total_money += map.build[i].price;
                                    //   }
                                    // }

                                    const map_name = map.number === 8 ? '광명' : map.name;

                                    return(
                                      <div key={key} className='player_estate_list_divs'
                                           style={{ 'borderBottom' : 'dotted 1px #ababab' }}
                                      >
                                        <div className='player_estate_city_name aLeft'> {map_name} </div>
                                        <div className='player_estate_build_state_div aLeft'>
                                          {map.build.map( (cu : any, key_2 : number) => {

                                            if(map.build[3].build === false) {
                                            let _icon : string = '';
                                            
                                            if(map.number !== 7) {
                                              if(key_2 === 0) {
                                                _icon = img.building.house;

                                              } else if(key_2 === 1) {
                                                _icon = img.building.apartment;

                                              } else if(key_2 === 2) {
                                                _icon = img.building.hotel
                                              }

                                            } else if(map.number === 7) {
                                              _icon = img.building.flag;
                                            }

                                            return(
                                              <div key={key_2} className='player_estate_building_divs'>
                                                {cu.build === true
                                                  ? <img alt='' src={_icon} />
                                                  : undefined
                                                }
                                              </div>
                                            )

                                          } else {
                                            if(key_2 === 3) {
                                              const landmark_list = require('../../source/landmark.json');
                                              const landmark_img = landmark_list.landmark[map.number];

                                              return(
                                                <div className='player_estate_landmark_state_div' key={key_2}>
                                                  <img alt='' title={map.build[3].name}
                                                       src={landmark_img}
                                                  />
                                                  <b className='custom_color_1'> 랜드마크 </b>
                                                </div>
                                              )
                                            }
                                          }

                                          })}
                                        </div>
                                        <div className='player_estate_total_money_div aRight'> {_splitMoneyUnit(total_money)} </div>
                                      </div>
                                    )
                                  })

                                :
                                  <div id='player_estate_list_empty_div'>
                                    <h4> 보유 중인 도시가 없습니다. </h4>
                                  </div>
                              }
                            </div>

                            <div id='player_estate_money_result_div'
                                 className='aLeft'
                                 style={info.estate_money === 0 ? { 'color' : '#ababab' } : undefined}
                            >
                              <div> 부동산 자산　|　</div>
                              <div className='aLeft'> {_commaMoney(info.estate_money)} 만원 </div>
                            </div>
                          </div>

                        : undefined
                      }
                  </div>
            }
            
        </div>

        {info.number === turn 
        ?
          <div className='player_my_turn_icon'
              style={my_turn_style}>
            <h3> My Turn </h3>
          </div>

          : undefined
        }
      </div>
    )
  }
}

export default connect( 
  ( { init, game, functions } : StoreState  ) => ({
    turn : game.turn,
    round_start : game.round_start,
    stop_info : game.stop_info,
    round : game.round,
    bank_info : game.bank_info,
    player_bank_info_alert : game.player_bank_info_alert,
    bank_incentive_percent : init.bank_incentive_percent,
    loan_percent : init.loan_percent,
    player_estate_info_alert : game.player_estate_info_alert,
    map_info : init.map_info,
    _splitMoneyUnit : functions._splitMoneyUnit,
    pass_price : init.pass_price
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Player);

import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import img from '../../source/icon.json';

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
  player_bank_info_alert : boolean
};

class Player extends React.Component<AllProps> {

  // 플레이어의 은행 정보 보기
  _setBankInfoAlert = (bool : boolean) => {
    const { gameActions } = this.props;
    const info : any = JSON.parse(this.props.info);

    gameActions.player_bank_info({ 'player_bank_info_alert' : bool })
    // if(bool === true) {
    //   gameActions.player_bank_info({ 'player_bank_info_alert' : false })

    // } else if(bool === false) {
    // }
  }

  render() {
    const { float_style, _commaMoney, number, turn, round_start, round, player_bank_info_alert } = this.props;
    const { _setBankInfoAlert } = this;
    const info : any = JSON.parse(this.props.info);

    let img_list : any = img.img.character;
    const MapInfo = require('./city_info.json');

    let my_thumb : string = img_list.stop[info.character];
    const name_style : object | any = {};

    let thumb_class = 'game_contents_player_thumbnail';
    let contents_class = 'game_contents_player_info_div';

    const contents_style : any = JSON.parse(JSON.stringify(float_style));
    
    let money : string = '';
    let my_turn_style : any = {};

    let my_location : string = '';

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

        money = _commaMoney(info.money);
    }

    if(info.number === 2 || info.number === 4) {
      contents_style['borderRight'] = 'solid 1px #ababab';

        if(info.able === true) {
            img_list = img.img.reverse.stop;
            my_thumb = img_list[info.character];

            contents_class += ' aRight';

            my_turn_style['textAlign'] = 'right';
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
    const bank_info = JSON.parse(this.props.bank_info);
    const my_bank = bank_info[Number(turn)];

    if(round_start === true) {
      if(my_bank.save_money > 0 || my_bank.total_incentive > 0 || my_bank.loan > 0 || my_bank.loan_incentive > 0) {
        bank_icon = img.icon.bank;  
      }

      if(info.number !== turn) {
        bank_icon = img.icon.empty_bank;
      }

    }

    const bank_info_alert_info = [
      {
        "title" : "예금 정보",
        "info" : [      
          { 'title' : '예금 금액', 'value' : 'save_money' },
          { 'title' : '예금 이자', 'value' : 'round_incentive' },
          { 'title' : '누적 이자', 'value' : 'total_incentive' },
        ]
      },

      {
        "title" : "대출 정보",
        "info" : [
          { 'title' : '대출 금액', 'value' : 'loan' },
          { 'title' : '대출 이자', 'value' : 'loan_incentive' },
          { 'title' : '상환 기간', 'value' : 'repay_day' }
        ]
      }
    ]

    return(
      <div className='game_contents_player_profile_div' key={number}
             id={info.number + '_player_info_div'}
             style={float_style} 
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
                      보유 자산　|　{money} 만원 
                      <img alt='' className='game_user_bank_info_icon' src={bank_icon} 
                           onMouseEnter={() => turn === info.number ? _setBankInfoAlert(true) : undefined}
                           onMouseOut={() => turn === info.number ? _setBankInfoAlert(false) : undefined}
                      />
                    </div>

                    <div className='game_user_my_location'> 현재 위치　|　{my_location} <b> {stop_turn} </b> </div>
                    <div className='game_user_has_location'> 보유 도시　|　{info.maps.length}　도시 소유 중 </div>

                    {player_bank_info_alert === true && turn === info.number
                      ? <div id='game_user_bank_info' className={'color_player_' + turn}> 
                          <h3> 플레이어 {turn} 의 은행 정보 </h3>

                          {bank_info_alert_info.map( (el, key) => {
                            return(
                              <div key={key} className='game_user_bank_info_divs'>
                                <h4> {el.title} </h4>

                                {el.info.map( (_info, key2) => {
                                  let value = _commaMoney(my_bank[_info.value]);

                                  if(_info.value === 'loan') {
                                    value = _commaMoney(my_bank['loan'] * 100);
                                  }

                                  return(
                                    <div key={key2} className='game_user_bank_info_grid_div bold'
                                         style={my_bank[_info.value] <= 0 ? { 'color' : '#ababab' } : { 'fontWeight' : 'bold' } }
                                    >
                                      <div className='aRight'> {_info.title}　|　 </div>
                                      <div className='aLeft'> 
                                        {value}
                                        {_info.value !== 'repay_day' ? ' 만원' : ' 라운드'} 
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          })}

                          {/* <div className='game_user_bank_info_divs'> */}
                            {/* <h4> 예금 정보 </h4> */}

                            {/* {save_money_arr.map( (el, key) => {
                              return(
                                <div key={key} className='game_user_bank_info_grid_div bold'
                                     style={my_bank[el.value] <= 0 ? { 'color' : '#ababab' } : undefined}
                                >
                                  <div className='aRight'> {el.title}　|　 </div>
                                  <div className='aLeft'> {_commaMoney(my_bank[el.value])} 만원 </div>
                                </div>
                              )
                            })} */}

                            {/* <h4> 대출 정보 </h4> */}
                          {/* </div> */}
                        </div>

                      : undefined}
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
  ( { init, game } : StoreState  ) => ({
    turn : game.turn,
    round_start : game.round_start,
    stop_info : game.stop_info,
    round : game.round,
    bank_info : game.bank_info,
    player_bank_info_alert : game.player_bank_info_alert
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch) 
  }) 
)(Player);

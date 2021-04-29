import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import img from '../../source/icon.json';

export interface AllProps {
  initActions : any,
  gameActions : any,
  functionsActions : any,
  select_info : string,
  turn : number | null,
  player_list : string,
  map_info : string,
  _removeAlertMent : Function,
  pass_price : number,
  _commaMoney : Function,
  _addLog : Function,
  bank_info : string,
  _checkPlayerMoney : Function,
  _minusPlayerMoney : Function,
  _checkEstatePlayerMoney : Function,
  _splitMoneyUnit : Function,
  _buyMap : Function,
  _build : Function,
  _checkLandMark : Function
};

class Build extends React.Component<AllProps> {

  render() {
    const { 
        turn, pass_price, _commaMoney, _checkPlayerMoney, _buyMap, _build, _checkLandMark 
    } = this.props;

    const select_info = JSON.parse(this.props.select_info);
    const bank_info = JSON.parse(this.props.bank_info);

    let my_info = JSON.parse(this.props.player_list);
    const landmark_list = require('../../source/landmark.json');

    if(turn !== null) {
        my_info = my_info[turn - 1];
    }

    let buy_button_style : any = {};
    let buy_able = true;

    const player_all_money : number = _checkPlayerMoney(Number(turn));

    if(player_all_money < select_info.price) {
        buy_button_style['backgroundColor'] = '#ababab';
        buy_button_style['color'] = '#b7657b';
            
        buy_able = false;
    }

    const check_landmark = _checkLandMark(null);
    const grid_style : any = {};

    if(check_landmark === false) {
        grid_style['gridTemplateColumns'] = 'repeat(3, 33%)';
    }

    return(
      <div id='build_div'>
          <div id='build_city_info_div'>
            <h3 className='aCenter'> {select_info.info.fullname} </h3>

            <div id='build_city_contents_div'>
                <div className='build_notice_grid_div gray'>
                    <div className='aRight'> 인구　|　</div> <div className='aLeft'> {select_info.info.person} </div>
                </div>

                {select_info.host === null
                    ? undefined
                    : <div>
                        <div className='build_notice_grid_div'>
                            <div className='aRight'> 소유주　|　</div>
                            <div className={"color_player_" + select_info.host}  id='build_host_notice'> {select_info.host} 플레이어 </div> 
                        </div>

                        <div className='build_notice_grid_div'>
                            <div className='aRight'> 통행료　|　</div>
                            <div id='pass_price_notice_div'> 
                                { _commaMoney(select_info.pass * pass_price) } 
                                {pass_price > 1
                                    ? ' ( ' + select_info.pass * pass_price / pass_price + ' X ' + pass_price + ' 배 ) '

                                    : undefined
                                }
                                만원
                            </div> 
                        </div>
                    </div>
                }
            </div>
            
          </div>

          {select_info.host === null
            ? <div id='buy_map_div'>
                <h3> 토지 매입 가격 </h3>
                <input 
                    id='but_map_button'
                    style={buy_button_style}
                    type='button' value={select_info.price + ' 만원'} 
                    onMouseEnter={() => buy_able === true && turn === 1 ? _buyMap('on', my_info, null) : undefined}
                    onMouseOut={() => buy_able === true && turn === 1 ? _buyMap('off', my_info, null) : undefined}
                    onClick={() => turn === 1 ? _buyMap('click', my_info, null) : undefined}
                />
              </div>
            

            : <div id='build_map_div' style={grid_style}>
                {select_info.build.map( (el : any, key : number) => {
                    const img_list : any = img.building;
                    let build_icon : undefined | string = ''

                    let build_style : any = {};
                    if(select_info.number !== 7) {
                        if(key === 0) {
                            build_icon = img_list['house'];

                            if(el.build === false) {
                                build_icon = img_list['house_gray'];
                            }

                        } else if(key === 1) {
                            build_icon = img_list['apartment'];

                            if(el.build === false) {
                                build_icon = img_list['apartment_gray'];
                            }

                        } else if(key === 2) {
                            build_icon = img_list['hotel'];

                            if(el.build === false) {
                                build_icon = img_list['hotel_gray'];
                            }
                        }

                    } else if(select_info.number === 7) {
                        build_icon = img_list['flag'];
                        build_style['width'] = '55px';
                    }

                    const able_condition = turn === 1 && el.build === false;

                    if(check_landmark === false) {
                        if(key < 3) {
                            return(
                                <div key={key} className='build_select_divs'
                                     onMouseEnter={() => able_condition === true ? _build('on', key, null) : undefined}
                                     onClick={() => able_condition === true ? _build('click', key, null) : undefined}
                                     style={el.build === false ? { 'color' : '#ababab'} : { 'color' : 'black' }}
                                >
                                    <div className='build_select_title_div'>
                                        <b style={el.build === true ? { 'fontFamily' : 'Recipekorea' } : undefined}> {el.name} </b>
                                    </div>

                                    <div>
                                        <img className='building_image' alt=''
                                             src={build_icon} style={build_style}
                                        />

                                        <div className='build_price_div'>
                                            {el.price} 만원
                                        </div>

                                        {el.select === true
                                            ? <div id='build_confirm_div'
                                                 onMouseOut={() => able_condition === true ? _build('off', key, null) : undefined}
                                            >
                                                건설
                                              </div>

                                            : undefined
                                        }

                                        {el.build === true
                                            ? <div className='build_complate_div'>
                                                건설 완료
                                              </div>

                                            : undefined
                                        }

                                        
                                    </div>

                                </div>
                            )
                        }
                    } else {
                        if(key === 3) {
                            const landmark_img : string = landmark_list.landmark[select_info.number];

                            return(
                                <div id='build_land_mark_div' className='aLeft' key={key}>
                                    <div 
                                        id='build_land_mark_image_div'
                                        style={{ 'backgroundImage' : `url(${landmark_img})` }}
                                    />
                                    <div id='build_land_mark_info_div'>
                                        {/* <p> 
                                            <b className='custom_color_1'> {select_info.name} </b> 의 랜드마크 
                                        </p> */}

                                        <div id='build_land_mark_title_div'> 
                                            <div>
                                                <b> {el.name} </b>　/　
                                                {el.price} 만원
                                            </div>

                                            <div>
                                                {el.build === false
                                                    ?
                                                        <input type='button' value='건설' 
                                                               id={player_all_money < el.price ? "unable_build_landmark" : undefined}
                                                               onClick={() => player_all_money >= el.price && turn === 1 ? _build('click', 3, null) : undefined}
                                                        />

                                                    : undefined
                                                }
                                            </div>
                                        </div>

                                        <div id='build_land_mark_detail_info_div' 
                                            dangerouslySetInnerHTML={{ __html : el.info }}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    }
                })}
              </div>
          }
      </div>
    )
  }
}

export default connect( 
  ( { init, game, functions } : StoreState  ) => ({
    select_info : game.select_info,
    turn : game.turn,
    player_list : init.player_list,
    map_info : init.map_info,
    pass_price : init.pass_price,
    _commaMoney : functions._commaMoney,
    _addLog : functions._addLog,
    bank_info : game.bank_info,
    _checkPlayerMoney : functions._checkPlayerMoney,
    _minusPlayerMoney : functions._minusPlayerMoney,
    _checkEstatePlayerMoney : functions._checkEstatePlayerMoney,
    _splitMoneyUnit : functions._splitMoneyUnit,
    _buyMap : functions._buyMap,
    _build : functions._build,
    _checkLandMark : functions._checkLandMark
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Build);

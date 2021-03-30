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
  select_info : string,
  turn : number | null,
  player_list : string,
  map_info : string,
  _removeAlertMent : Function
};

class Build extends React.Component<AllProps> {

    // 토지 구매하기
    _buyMap = (event : any, type : string, my_info : any | undefined | null) => {
        const select_info = JSON.parse(this.props.select_info);
        const map_info = JSON.parse(this.props.map_info);
        const player_list = JSON.parse(this.props.player_list);
        
        const { initActions, gameActions, _removeAlertMent } = this.props; 

        if(type === 'on') {
            if(my_info.money >= select_info.price) {
                event.target.style.backgroundColor = '#9fd8df';
                event.target.style.color = 'white'
            }

        } else if(type === 'off') {
            if(my_info.money >= select_info.price) {
                event.target.style.backgroundColor = 'white';
                event.target.style.color = 'black'
            }

        } else if(type === 'click') {
            if(my_info.money < select_info.price) {
                // 돈이 부족할 경우
                _removeAlertMent("토지 매입 비용이 부족합니다.");
                return
            }

            if(map_info[select_info.number].host === null) {
                // 플레이어 설정
                player_list[my_info.number - 1]['money'] = my_info.money - select_info.price;
                player_list[my_info.number - 1]['maps'].push(select_info.number);

                initActions.set_player_info({ 
                    'player_list' : JSON.stringify(player_list), 
                });

                // 맵 설정
                map_info[select_info.number].host = my_info.number;
                // map_info[select_info.number].pass = map_info[select_info.number].pass + select_info.price;
                initActions.set_setting_state({ 'map_info' : JSON.stringify(map_info) });

                select_info.host = my_info.number;
                // select_info.pass = map_info[select_info.number].pass + select_info.price;
                gameActions.select_type({ 'select_info' : JSON.stringify(select_info) })
            }
        }
    }

    // 랜드마크 건설 가능 체크
    _checkLandMark = () => {
        const select_info = JSON.parse(this.props.select_info);

        let result = true;
        if(select_info.type === 'map') {
            for(let i = 0; i < 3; i++) {
                const info = select_info.build[i];

                if(info.build === false) {
                    result = false;
                }
            }
        }
        return result;
        
    }

    // 건물 건설하기
    _build = (type : string, key : number) => {
        const map_info = JSON.parse(this.props.map_info);
        const select_info = JSON.parse(this.props.select_info);

        const player_list : any = JSON.parse(this.props.player_list)

        const { gameActions, initActions, turn, _removeAlertMent } = this.props;

        if(turn === 1) {
            if(type === 'on') {
                for(let i = 0; i < map_info[select_info.number].build.length; i++) {
                    delete map_info[select_info.number].build[i]['select'];
                }

                map_info[select_info.number].build[key]['select'] = true;

            } else if(type === 'off') {
            
                delete map_info[select_info.number].build[key]['select'];


            } else if(type === 'click') {
                const my_info = player_list[turn - 1];

                if(map_info[select_info.number].build[key].build === false) {
                    if(my_info.money >= map_info[select_info.number].build[key].price) {
                        player_list[turn - 1].money = my_info.money - map_info[select_info.number].build[key].price;
                        initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) });

                        map_info[select_info.number].build[key].build = true;
                        map_info[select_info.number].pass = map_info[select_info.number].pass + map_info[select_info.number].build[key].price;      
                        
                        delete map_info[select_info.number].build[key]['select'];
                        
                        _removeAlertMent(map_info[select_info.number].build[key].name + " (이)가 건설되었습니다.");

                    } else {
                        return _removeAlertMent("건설 비용이 부족합니다.");
                    }
                }
            }
        }

        gameActions.select_type({ 'select_info' : JSON.stringify(map_info[select_info.number]) });
        initActions.set_setting_state({ 'map_info' : JSON.stringify(map_info) });
    }

  render() {
    const { turn } = this.props;
    const { _buyMap, _checkLandMark, _build } = this;

    const select_info = JSON.parse(this.props.select_info);

    let my_info = JSON.parse(this.props.player_list)
    if(turn !== null) {
        my_info = my_info[turn - 1];
    }

    let buy_button_style : any = {};
    let buy_able = true;
    if(my_info.money < select_info.price) {
        buy_button_style['backgroundColor'] = '#ababab';
        buy_button_style['color'] = '#b7657b';

        buy_able = false;
    }

    const check_landmark = _checkLandMark();
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
                            <div id='pass_price_notice_div'> { select_info.pass } 만원 </div> 
                        </div>
                    </div>
                }
            </div>
            
          </div>

          {select_info.host === null
            ? <div id='buy_map_div'>
                <h3> 토지 매입 가격 </h3>
                <input 
                    style={buy_button_style}
                    type='button' value={select_info.price + ' 만원'} 
                    onMouseEnter={(event) => buy_able === true ? _buyMap(event, 'on', my_info) : undefined}
                    onMouseOut={(event) => buy_able === true ? _buyMap(event, 'off', my_info) : undefined}
                    onClick={(event) =>  _buyMap(event, 'click', my_info)}
                />
              </div>
            

            : <div id='build_map_div' style={grid_style}>
                {select_info.build.map( (el : any, key : number) => {
                    const img_list : any = img.building;
                    let build_icon : undefined | string = ''

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

                    const able_condition = turn === 1 && el.build === false;

                    if(check_landmark === false) {
                        if(key < 3) {
                            return(
                                <div key={key} className='build_select_divs'
                                     onMouseEnter={() => able_condition === true ? _build('on', key) : undefined}
                                     onClick={() => able_condition === true ? _build('click', key) : undefined}
                                     style={el.build === false ? { 'color' : '#ababab'} : { 'color' : 'black' }}
                                >

                                    <div className='build_select_title_div'>
                                        <b> {el.name} </b>
                                    </div>

                                    <div>
                                        <img className='building_image' alt=''
                                             src={build_icon}
                                        />

                                        <div className='build_price_div'>
                                            {el.price} 만원
                                        </div>

                                        {el.select === true
                                            ? <div id='build_confirm_div'
                                                 onMouseOut={() => able_condition === true ? _build('off', key) : undefined}
                                            >
                                                건설
                                              </div>

                                            : undefined
                                        }
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
  ( { init, game } : StoreState  ) => ({
    select_info : game.select_info,
    turn : game.turn,
    player_list : init.player_list,
    map_info : init.map_info
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch) 
  }) 
)(Build);

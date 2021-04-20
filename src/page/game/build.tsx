import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import game, { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

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
  _removeAlertMent : Function,
  pass_price : number,
  _commaMoney : Function,
  _addLog : Function,
  bank_info : string,
  _playerMoneys : Function,
  _minusPlayerMoney : Function
};

class Build extends React.Component<AllProps> {

    // 토지 구매하기
    _buyMap = (event : any, type : string, my_info : any | undefined | null) => {
        const select_info = JSON.parse(this.props.select_info);
        const map_info = JSON.parse(this.props.map_info);
        // const player_list = JSON.parse(this.props.player_list);
        
        const { initActions, gameActions, _removeAlertMent, pass_price, _addLog, turn, _playerMoneys, _minusPlayerMoney } = this.props; 

        const player_all_money = _playerMoneys(turn);

        if(type === 'on') {
            if(player_all_money >= select_info.price) {
                event.target.style.backgroundColor = '#9fd8df';
                event.target.style.color = 'white'
            }

        } else if(type === 'off') {
            if(player_all_money >= select_info.price) {
                event.target.style.backgroundColor = 'white';
                event.target.style.color = 'black'
            }

        } else if(type === 'click') {
            if(player_all_money < select_info.price) {
                // 돈이 부족할 경우
                _removeAlertMent("토지 매입 비용이 부족합니다.");
                return
            }

            if(map_info[select_info.number].host === null) {
                // 플레이어 설정
                // player_list[my_info.number - 1]['money'] = my_info.money - select_info.price;
                const result = _minusPlayerMoney(turn, select_info.price, undefined, true);
                
                const player_list = result['player'];
                
                player_list[my_info.number - 1]['maps'].push(select_info.number);

                initActions.set_player_info({ 
                    'player_list' : JSON.stringify(player_list), 
                });

                gameActions.event_info({ 'bank_info' : JSON.stringify(result['bank']) })

                // 맵 설정
                map_info[select_info.number].host = my_info.number;
                map_info[select_info.number].pass = select_info.price * pass_price;
                initActions.set_setting_state({ 'map_info' : JSON.stringify(map_info) });

                select_info.host = my_info.number;
                select_info.pass = select_info.price * pass_price;
                gameActions.select_type({ 'select_info' : JSON.stringify(select_info) })

                const ment = `<div class='game_alert_2'> <b class='color_player_${turn}'> 플레이어 ${turn} </b>　|　${map_info[select_info.number].name} 토지 구매 <b class='custom_color_1'> ( ${select_info.price} 만원 ) </b>  <br /> <b class='gray'> ( 이제부터 ${map_info[select_info.number].name} 에 도착한 다른 플레이어에게는 <br /> <b class='red'>${map_info[select_info.number].pass} 만원</b>의 동행료가 부과됩니다. ) </b> </div>`;

                _addLog(ment)
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

        const { gameActions, initActions, turn, _removeAlertMent, pass_price, _addLog } = this.props;

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

                        const origin_pass = map_info[select_info.number].pass;

                        map_info[select_info.number].build[key].build = true;
                        map_info[select_info.number].pass = map_info[select_info.number].pass + ( map_info[select_info.number].build[key].price * pass_price );      
                        
                        delete map_info[select_info.number].build[key]['select'];
                        
                        const ment = `<div class='game_alert_2'> <b class='color_player_${turn}'> 플레이어 ${turn} </b>　|　${map_info[select_info.number].build[key].name} 건설 <b class='custom_color_1'> ( ${map_info[select_info.number].build[key].price} 만원 ) </b>  <br /> <b class='gray'> ( 통행료　|　${origin_pass} 만원　=>　<b class='red'>${map_info[select_info.number].pass} 만원</b> ) </b> </div>`;
                        _addLog(ment);

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
    const { turn, pass_price, _commaMoney, _playerMoneys } = this.props;
    const { _buyMap, _checkLandMark, _build } = this;

    const select_info = JSON.parse(this.props.select_info);
    const bank_info = JSON.parse(this.props.bank_info);

    let my_info = JSON.parse(this.props.player_list);

    if(turn !== null) {
        my_info = my_info[turn - 1];
    }

    let buy_button_style : any = {};
    let buy_able = true;

    const player_all_money : number = _playerMoneys(Number(turn));

    if(player_all_money < select_info.price) {
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
                            <div id='pass_price_notice_div'> 
                                { _commaMoney(select_info.pass) } 
                                {pass_price > 1
                                    ? ' ( ' + select_info.pass / pass_price + ' X ' + pass_price + ' 배 ) '

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
                    style={buy_button_style}
                    type='button' value={select_info.price + ' 만원'} 
                    onMouseEnter={(event) => buy_able === true && turn === 1 ? _buyMap(event, 'on', my_info) : undefined}
                    onMouseOut={(event) => buy_able === true && turn === 1 ? _buyMap(event, 'off', my_info) : undefined}
                    onClick={(event) => turn === 1 ? _buyMap(event, 'click', my_info) : undefined}
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
                                     onMouseEnter={() => able_condition === true ? _build('on', key) : undefined}
                                     onClick={() => able_condition === true ? _build('click', key) : undefined}
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
                                                 onMouseOut={() => able_condition === true ? _build('off', key) : undefined}
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
    _playerMoneys : functions._playerMoneys,
    _minusPlayerMoney : functions._minusPlayerMoney
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Build);

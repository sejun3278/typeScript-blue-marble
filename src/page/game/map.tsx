import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

export interface AllProps {
    gameActions : any,
    class_col : string,
    style : any,
    info : string,
    map_info : string,
    player_list : string,
    playing : boolean,
    able_player : number,
    move_location : null | number,
    _commaMoney : Function,
    round : number,
    move_event_able : boolean,
    _removeAlertMent : Function,
    _moveCharacter : Function,
    stop_days : number
};

class Map extends React.Component<AllProps> {

  _moveMap = (number : number) => {
    const { move_event_able, _removeAlertMent, _moveCharacter, gameActions } = this.props;

    let move = 0;
    if(move_event_able === true) {
      if(number === 6 || number === 20) {
        return _removeAlertMent('이동 할 수 없는 지역입니다.');

      } else {
        // 이동할 거리 구하기
        if(number > 20) {
          move = number - 20;

        } else {
          move = 7 + (number + 1)
        }

        gameActions.event_info({ 'move_event_able' : false })
        return _moveCharacter(move, 20);
      }

    } else {
      return _removeAlertMent('김포 공항에서만 이동할 수 있습니다.');
    }
  }

  render() {
    const { class_col, style, playing, able_player, move_location, _commaMoney, round, move_event_able, stop_days } = this.props;
    const { _moveMap } = this;

    const info = JSON.parse(this.props.info);
    const city_info = JSON.parse(this.props.map_info)

    const player_list = JSON.parse(this.props.player_list);

    const map_class_col : string = info.type === 'event' ? 'map_event_div' : 'map_name_div'
    let map_icon : string = '';

    const icon = require('../../source/icon.json');

    if(info.type === 'event') {
        map_icon = icon.map_icon[info.value];
    }

    let city_price : number = 0;
    const city_style : any = {};
    if(city_info[info.number]) {
      if(city_info[info.number].type === 'map') {

        if(city_info[info.number].host === null) {
          // 소유주가 없을 경우 토지 매입비로 표시
          city_price = city_info[info.number].price;
          
        } else {
          // 소유주가 있을 경우 통행료로 표시
          city_price = city_info[info.number].pass;
          city_style['color'] = player_list[city_info[info.number].host - 1].color
        }
      }
    }

    const cover_style : any = JSON.parse(JSON.stringify(style));
    if(move_location === info.number) {
      cover_style['backgroundColor'] = '#9fd8df';
    }

    const color_style : any = {};
    if(city_info[info.number] !== undefined) {
      if(city_info[info.number].host !== undefined) {
        if(city_info[info.number].host !== null) {
          const host = city_info[info.number].host;

          color_style['backgroundColor'] = player_list[host - 1].color;
          color_style['color'] = 'white'
        }
      }
    }

    let name = info.name;
    if(round > 1) {
      if(info.number === 0) {
        // 1 라운드 이후에 출발점을 은행으로 변환하기

        name = '은행';
        map_icon = icon.map_icon['bank'];
      }
    }

    // 김포 공항에서 이동 가능한 맵 표시하기
    if(move_event_able === true) {
      if(info.number === 6) {
        cover_style['backgroundColor'] = '#ababab';
      }
    }

    return(
        <div className={class_col} style={cover_style}
            id={'map_number_' + info.number}
            onClick={move_event_able === true ? () => _moveMap(info.number) : undefined}
        >
            <div className={map_class_col}
                 style={color_style}
            >
                <b> {name} </b>
                
                {info.number === 6
                  ? <div id='stop_number_icon'>
                      {stop_days}
                    </div>

                  : undefined
                }
            </div>

            {/* <div id={'map_number_' + info.number}> */}
            {info.type === 'event'
                    ? <img className='event_map_icon' alt='' 
                        src={map_icon}
                      />

                    : <div>
                        {city_info[info.number].build.map( (el : any, key : number) => {
                          let building_icon : any = null;
                          const icon_list = require('../../source/icon.json');

                          let margin_style : any = {};
                          if(info.number !== 7) {
                            if(key === 0) {
                              building_icon = icon_list.building.house;

                            } else if(key === 1) {
                              building_icon = icon_list.building.apartment;
                            
                            } else if(key === 2) {
                              building_icon = icon_list.building.hotel;
                            }

                          } else if(info.number === 7) {
                            building_icon = icon_list.building.flag;
                          }
                          
                          if(info.number >= 1 && info.number <= 5) {
                            margin_style['marginTop'] = '10px';

                          } else if(info.number >= 7 && info.number <= 13) {
                            margin_style['marginTop'] = '-2px';

                          } else if(info.number >= 15 && info.number <= 19) {
                            margin_style['marginTop'] = '10px';
                          }

                          margin_style['marginLeft'] = 30 * key + 'px';

                          if(el.build === true) {
                            return(
                              <div className='build_complate_icon_divs' key={key}>
                                <img alt='' src={building_icon} style={margin_style} />
                              </div>
                            )
                          }
                        })}

                        <div className='city_price_div'
                            style={city_style}
                        >
                          {_commaMoney(city_price)} 만원
                        </div>
                      </div>
                }
            {/* </div> */}

            {info.number === 0 && playing === true
              ? player_list.map( (el : any, key : number) => {
                  const margin_style : any = { 
                    'backgroundColor' : el.color
                  };

                  // 초기 위치 잡기
                  if(able_player === 2) {
                    margin_style['marginLeft'] = (key + 1) * 25 + 'px';

                  } else if(able_player === 3) {
                    margin_style['marginLeft'] = (key + 1) * 20 + 'px';

                  } else if(able_player === 4) {
                    margin_style['marginLeft'] = (key + 1) * 16 + 'px';
                  }

                  if(el.able === true) {
                    return(
                      <div key={key} className='player_mini_character' style={margin_style} 
                           id={'player_main_character_' + el.number} title={'플레이어 ' + el.number}
                      />
                    )
                  }
                })

              : undefined}
        </div>
    )
  }
}

export default connect( 
  ( { init, game, functions } : StoreState  ) => ({
    map_info : init.map_info,
    player_list : init.player_list,
    playing : game.playing,
    able_player : init.able_player,
    move_location : game.move_location,
    _commaMoney : functions._commaMoney,
    round : game.round,
    move_event_able : game.move_event_able,
    _removeAlertMent : functions._removeAlertMent,
    _moveCharacter : functions._moveCharacter,
    stop_days : init.stop_days
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Map);

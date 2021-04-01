import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';
import build from './build';

export interface AllProps {
    class_col : string,
    style : any,
    info : string,
    map_info : string,
    player_list : string,
    playing : boolean,
    able_player : number,
    move_location : null | number,
    _commaMoney : Function,
    round : number
};

class Map extends React.Component<AllProps> {

  render() {
    const { class_col, style, playing, able_player, move_location, _commaMoney, round } = this.props;

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

    return(
        <div className={class_col} style={cover_style}
            id={'map_number_' + info.number}
        >
            <div className={map_class_col}
                 style={color_style}
            >
                <b> {name} </b>
            </div>

            {/* <div id={'map_number_' + info.number}> */}
            {info.type === 'event'
                    ? <img className='event_map_icon' alt='' 
                            src={map_icon}
                        />

                    : <div>
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
    round : game.round
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gamections: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Map);

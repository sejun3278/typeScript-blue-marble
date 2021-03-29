import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

export interface AllProps {
    class_col : string,
    style : any,
    info : string,
    map_info : string,
    player_list : string,
    playing : boolean,
    able_player : number,
    move_location : null | number
};

class Map extends React.Component<AllProps> {

  render() {
    const { class_col, style, playing, able_player, move_location } = this.props;

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
    if(city_info[info.number]) {
      if(city_info[info.number].type === 'map') {
        city_price = city_info[info.number].price;
      }
    }

    if(move_location === info.number) {
      style['backgroundColor'] = '#9fd8df';
    }

    return(
        <div className={class_col} style={style}
            id={'map_number_' + info.number}
        >
            <div className={map_class_col}>
                <b> {info.name} </b>
            </div>

            {/* <div id={'map_number_' + info.number}> */}
            {info.type === 'event'
                    ? <img className='event_map_icon' alt='' 
                            src={map_icon}
                        />

                    : <div>
                        <div className='city_price_div'>
                          {city_price} 만원
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


                  // if(key === 0) {
                  //   margin_style['marginLeft'] = '1px';
                  // }

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
  ( { init, game } : StoreState  ) => ({
    map_info : init.map_info,
    player_list : init.player_list,
    playing : game.playing,
    able_player : init.able_player,
    move_location : game.move_location
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gamections: bindActionCreators(gameActions, dispatch)
  }) 
)(Map);

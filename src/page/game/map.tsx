import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';


export interface AllProps {
    class_col : string,
    style : object,
    info : string,
    map_info : string
};

class Map extends React.Component<AllProps> {

  render() {
    const { class_col, style } = this.props;
    const info = JSON.parse(this.props.info);
    const city_info = JSON.parse(this.props.map_info)

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

    return(
        <div className={class_col} style={style}>
            <div className={map_class_col}>
                <b> {info.name} </b>
            </div>

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
        </div>
    )
  }
}

export default connect( 
  ( { init } : StoreState  ) => ({
    map_info : init.map_info
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch) 
  }) 
)(Map);

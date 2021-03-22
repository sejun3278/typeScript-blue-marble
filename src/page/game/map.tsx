import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';


export interface AllProps {
    class_col : string,
    style : object,
    info : string
};

class Map extends React.Component<AllProps> {

  render() {
    const { class_col, style } = this.props;
    const info = JSON.parse(this.props.info);

    const map_class_col : string = info.type === 'event' ? 'map_event_div' : 'map_name_div'
    let map_icon : string = '';

    const icon = require('../../source/icon.json');

    if(info.type === 'event') {
        map_icon = icon.map_icon[info.value];
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

                    : undefined
                }


        </div>
    )
  }
}

export default connect( 
  ( { init } : StoreState  ) => ({
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch) 
  }) 
)(Map);

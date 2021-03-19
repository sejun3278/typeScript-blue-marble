import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import img from '../../source/icon.json';

export interface AllProps {
  initActions : any,
  info : string,
  float_style : object,
  key : number
};

class Player extends React.Component<AllProps> {

  render() {
    const { float_style } = this.props;
    const info : any = JSON.parse(this.props.info);

    let img_list : any = img.img.character.stop;
    let my_thumb : string = img_list[info.character];

    let thumb_class = 'game_contents_player_thumbnail ';
    let contents_class = 'game_contents_player_info_div ';

    if(info.able === false) {
        thumb_class += 'empty_player_thumb';
    }

    if(info.number === 2 || info.number === 4) {
        img_list = img.img.reverse.stop;
        my_thumb = img_list[info.character];

        contents_class += 'aRight';

    } else {
        contents_class += 'game_contents_player_info_margin '
    }


    return(
      <div className='game_contents_player_profile_div'>
        <div style={float_style} className='game_contents_player_thumbnail_div'> 
            <div className={thumb_class} 
                style={my_thumb !== undefined ? { 'backgroundImage' : `url(${my_thumb})` } : undefined}
            />
            <div className='game_contents_player_name'
                style={info.able === false ? { 'color' : '#ababab' } : undefined}
                dangerouslySetInnerHTML={{ __html : info.name }}
            />
        </div>

        <div style={float_style} className={contents_class}> 
            2 
        </div>
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
)(Player);

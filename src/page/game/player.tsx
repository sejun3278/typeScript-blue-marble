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
  round_start : boolean
};

class Player extends React.Component<AllProps> {

  render() {
    const { float_style, _commaMoney, number, turn, round_start } = this.props;
    const info : any = JSON.parse(this.props.info);

    let img_list : any = img.img.character;
    const MapInfo = require('./city_info.json');

    let my_thumb : string = img_list.stop[info.character];
    const name_style : object | any = {};

    let thumb_class = 'game_contents_player_thumbnail';
    let contents_class = 'game_contents_player_info_div';

    const contents_style : any = JSON.parse(JSON.stringify(float_style));
    
    let money : string = '';

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

        // if(round_start === true) {
          if(turn === Number(info.number)) {
            my_thumb = img_list.action[info.character];
          }
        // }


        money = _commaMoney(info.money);
    }

    if(info.number === 2 || info.number === 4) {
      contents_style['borderRight'] = 'solid 1px #ababab';

        if(info.able === true) {
            img_list = img.img.reverse.stop;
            my_thumb = img_list[info.character];

            contents_class += ' aRight';
        }

    } else {
      contents_style['borderLeft'] = 'solid 1px #ababab';
      contents_class += ' game_contents_player_info_margin'
    }

    // let my_location : string = MapInfo[info.location].name;

    return(
      <div className='game_contents_player_profile_div' key={number}
             id={number + '_player_info_div'}
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
                    <div className='game_user_have_money_div'> 보유 자산　|　{money} 만원 </div>
                    <div className='game_user_my_location'> 현재 위치　|　{my_location} </div>
                  </div>
            }
        </div>
      </div>
    )
  }
}

export default connect( 
  ( { init, game } : StoreState  ) => ({
    turn : game.turn,
    round_start : game.round_start
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch) 
  }) 
)(Player);

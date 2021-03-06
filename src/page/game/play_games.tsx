import * as React from 'react';
import $ from 'jquery';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import Card from './card';
import Build from './build';
import Casino from './casino';
import Bank from './bank';

export interface AllProps {
  gameActions : any,
  playing : boolean,
  main_ment : string,
  alert_ment : string,
  round : number,
  timer : string,
  round_timer : number,
  round_limit : number,
  round_start : boolean
  turn : number,
  _turnEnd : Function,
  select_type : string | null,
  select_info : string,
  select_tap : number,
  move_able : boolean,
  move_location : number | null,
  _removeAlertMent : Function,
  map_info : string,
  stop_info : string,
  now_stop : number,
  turn_end_able : boolean,
  card_select_able : boolean,
  time_over : boolean,
  select_first_card : number,
  select_last_card : number,
  game_over : boolean
};

class PlayGame extends React.Component<AllProps> {

  _moveTap = (num : number) => {
    const { gameActions, select_last_card, select_first_card } = this.props;
    
    gameActions.select_type({ 'select_tap' : num });

    const css_style : any = { 
      'marginTop' : '-30px',
      'border' : 'solid 3px black',
      'color' : 'black'
    };

    let target : any = undefined;

    // if(select_tap !== num) {
      if(num === 0) {
        window.setTimeout( () => {

          if(select_first_card > 0) {
            target = document.getElementById('each_cards_number_' + select_first_card);

            css_style['zIndex'] = 100;
            $(target).css(css_style);
          }

          if(select_last_card > 0) {
            target = document.getElementById('each_cards_number_' + select_last_card);

            css_style['zIndex'] = 200;
            $(target).css(css_style);
          }

        }, 0)
      }
  }

  render() {
    const { 
      round, main_ment, alert_ment, timer, round_timer, round_limit, round_start, turn, _turnEnd, time_over, select_tap, 
      move_location, turn_end_able, card_select_able, game_over, now_stop
    } = this.props;
    const { _moveTap } = this;

    // const stop_info = JSON.parse(this.props.stop_info);
    // const map_info = JSON.parse(this.props.map_info);
    const select_info = JSON.parse(this.props.select_info);
    const icon_list = require('../../source/icon.json');
    
    const build_name = '<?????????';
  
    let state_name = '?????? ?????? ??????';
    let state_style : any = {};
    let event_img : any = null;

    if(select_tap !== 0) {
      state_style = { 'color' : 'black' };
      
      if(select_tap === 1) {
        state_style = { 'color' : '#ababab' };

      } else if(select_tap === 2) {
        state_name = '????????? ?????? ???';
        event_img = icon_list.map_icon['stop'];
  
      } else if(select_tap === 3) {
        state_name = '?????????';
        event_img = icon_list.map_icon['gold_key'];

      } else if(select_tap === 4) {
        state_name = '?????? ??????';
        event_img = icon_list.map_icon['move'];
      
      } else if(select_tap === 5) {
        state_name = '?????? ??????';
        event_img = icon_list.map_icon['bank'];
      }
    }

    return(
      <div id='play_game_divs'>
        <div id='play_game_main_div' className='aCenter'>

              <div id='play_round_notice_div'>
                {round > 0
                  ? <h2 id='play_round_notice'> 
                      {round} ????????? 
                      {round_limit > 0
                        ? ' / ' + round_limit

                        : undefined
                      }
                    </h2>
                  : undefined 
                }
              </div>

              <div id='play_game_notice_div'>
                <div id='play_main_notice_div' dangerouslySetInnerHTML={{ __html : main_ment }} />
                <div id='play_additional_notice_div' dangerouslySetInnerHTML={{ __html : alert_ment }} />
              </div>

              <div id='playing_timer_div'>
                <div id='timer_div'>
                  
                  {round_timer !== 0
                    ? <div id='timer_slide_div' />
                    : undefined
                  }

                </div>

                <div id='timer_notice_div' dangerouslySetInnerHTML={{ __html : timer }}/>
              </div>

              <div>
                {game_over === true
                    ? <div id='play_end_info_div'>
                        <h3 onClick={() => window.location.reload()}> ?????? ?????? </h3>

                        <div id='made_info_div'>

                          <div className='made_info_grid_div'>
                            <div className='aRight'> ????????????|???</div>
                            <div className='aLeft'> Sejun3278 </div>
                          </div>

                          <div className='made_info_grid_div'>
                            <div className='aRight'> ?????? ?????????|???</div>
                            <div className='aLeft'> TypeScript, Redux, Sass </div>
                          </div>

                          <div className='made_info_grid_div'>
                            <div className='aRight'> ?????? ?????????|???</div>
                            <div className='aLeft'> 2021.03 ~ 2021.04 </div>
                          </div>

                          <p> ????????????????????? ???????????????! </p>
                        </div>
                      </div>

                    : undefined
                  }

                {game_over === false 
                ?
                <div id='playing_action_div'>
                  {round_start === true
                  ?
                    <div id='playing_contents_div'>
                      <div id='playing_select_div'>
                        {event_img !== null
                          ? <img alt='' src={event_img} id='playing_event_icon' />

                          : undefined
                        }
                        <div onClick={select_tap <= 1 ? () => _moveTap(0) : undefined}
                            style={state_style}
                        > 
                          {state_name} 
                        </div>

                        {select_info.type !== 'event'
                        // || (select_info !== null && select_info.type === 'map')
                          ? <div onClick={() => _moveTap(1)}
                                style={select_tap !== 1 ?  { 'color' : '#ababab' } : undefined}
                            >
                              {build_name} 
                          
                            </div>
                          : undefined
                        }
                      </div>
                        
                      {select_tap === 0
                        ? <Card />

                        : select_info.type === 'map'
                            ? <Build {...this.props} />
                            : undefined
                      }
                      
                      {select_tap === 2
                        ? <div id='stop_div' className='event_ment_div'>
                            <h3> ????????? ?????? ?????? ??? ?????? ???????????? ???????????????. </h3>
                            <h3> ??? <b style={{ 'color' : "#e2703a" }}> { now_stop } ??? </b> ??? ???????????? ???????????????. </h3>
                            <h3> ???????????? ????????? ????????? ???????????????. </h3>
                          </div>
                        
                        : undefined
                      }

                      {select_tap === 3
                        ? <Casino />

                        : undefined
                      }

                      {select_tap === 4
                        ? <div id='event_move_div' className='event_ment_div'>
                            <h3> ???????????? ?????? ????????? ??????????????????. </h3>
                            <h3> ?????????, ?????? ??????????????? ????????? ????????? ??? ????????????. </h3>
                          </div>

                        : undefined
                      }

                      {select_tap === 5
                        ? <Bank />

                        : undefined
                      }

                    </div>
                  : undefined}

                </div>
                : undefined}

                {turn === 1 && turn_end_able === true && card_select_able === false && move_location !== 20 && time_over === false
                ?
                  <h3 id='end_turn_button'
                      onClick={() => turn === 1 && round_start === true ? _turnEnd() : undefined}
                  > 
                    ??? ?????? 
                  </h3>

                : undefined}
              </div>

            </div>
      </div>
    )
  }
}

export default connect( 
  ( { init, game } : StoreState  ) => ({
    playing : game.playing,
    main_ment : game.main_ment,
    alert_ment : game.alert_ment,
    round : game.round,
    timer : game.timer,
    round_timer : init.round_timer,
    round_limit : init.round_limit,
    round_start : game.round_start,
    turn : game.turn,
    select_type : game.select_type,
    select_info : game.select_info,
    select_tap : game.select_tap,
    move_able : game.move_able,
    move_location : game.move_location,
    map_info : init.map_info,
    stop_info : game.stop_info,
    now_stop : game.now_stop,
    turn_end_able : game.turn_end_able,
    card_select_able : game.card_select_able,
    time_over : game.time_over,
    select_first_card : game.select_first_card,
    select_last_card : game.select_last_card,
    game_over : game.game_over
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions : bindActionCreators(gameActions, dispatch)
  }) 
)(PlayGame);

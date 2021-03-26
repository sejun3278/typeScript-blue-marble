import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import Card from './card';
import { info } from 'node:console';

export interface AllProps {
  playing : boolean,
  main_ment : string,
  alert_ment : string,
  round : number,
  timer : string,
  round_timer : number,
  round_limit : number,
  round_start : boolean
  turn : number
};

class PlayGame extends React.Component<AllProps> {

  render() {
    const { 
      playing, round, main_ment, alert_ment, timer, round_timer, round_limit, round_start, turn 
    } = this.props;

    return(
      <div id='play_game_divs'>
          {playing === true
          ? <div id='play_game_main_div' className='aCenter'>

              <div id='play_round_notice_div'>
                {round > 0
                  ? <h2 id='play_round_notice'> 
                      {round} 라운드 
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
              
              {round_start === true 
              ?
              <div>
                <div id='playing_action_div'>

                  <div>
                    <div id='playing_select_div'>
                      <div> 통행 카드 뽑기 </div>
                      {/* <div> 건설 <?/div> */}
                    </div>

                    <Card />
                  </div>

                </div>

                {turn === 1
                ?
                <h3 id='end_turn_button'> 
                  턴 종료 
                </h3>

                : undefined}
              </div>

            : undefined}

            </div>
            

          : undefined}
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
    turn : game.turn
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions : bindActionCreators(gameActions, dispatch)
  }) 
)(PlayGame);

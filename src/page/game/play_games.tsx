import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import Card from './card';
import Build from './build';

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
  move_location : number | null
};

class PlayGame extends React.Component<AllProps> {

  render() {
    const { 
      round, main_ment, alert_ment, timer, round_timer, round_limit, round_start, turn, _turnEnd, select_type, select_tap, gameActions
    } = this.props;
    const select_info = JSON.parse(this.props.select_info);

    const build_name = '<　건설';

    return(
      <div id='play_game_divs'>
        <div id='play_game_main_div' className='aCenter'>

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
{/*               
              {round_start === true 
              ? */}
              <div>
                <div id='playing_action_div'>

                  {round_start === true
                  ?
                    <div>
                      <div id='playing_select_div'>
                        <div onClick={() => gameActions.select_type({ 'select_tap' : 0 })}
                            style={select_tap !== 0 ?  { 'color' : '#ababab' } : undefined}
                        > 
                          통행 카드 뽑기 
                        </div>

                        {select_type !== null
                          ? <div onClick={() => gameActions.select_type({ 'select_tap' : 1 })}
                                style={select_tap !== 1 ?  { 'color' : '#ababab' } : undefined}
                            >
                              {build_name} 
                          
                            </div>
                          : undefined
                        }
                      </div>

                      {select_tap === 0
                        ? <Card />

                        : <Build />
                      }
                      

                    </div>
                  : undefined}
                </div>

                {turn === 1
                ?
                <h3 id='end_turn_button'
                    onClick={() => turn === 1 && round_start === true ? _turnEnd() : undefined}
                > 
                  턴 종료 
                </h3>

                : undefined}
              </div>

            {/* : undefined} */}

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
    move_location : game.move_location
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions : bindActionCreators(gameActions, dispatch)
  }) 
)(PlayGame);

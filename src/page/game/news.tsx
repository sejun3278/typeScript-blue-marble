import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import icon from '../../source/icon.json';

export interface AllProps {
  initActions : any,
  gameActions : any,
  functionsActions : any,
  news_list : string,
  news_round : number,
  round : number,
  playing : boolean,
  game_event : boolean,
  news_set : boolean
};

class News extends React.Component<AllProps> {

  _setNewsRound = (event : any) => {
      const { gameActions, round, playing } = this.props;
      let value : number = Number(event.target.value);

      if(playing === false) {
          return;
      }

      if(value <= 0) {
        value = 1;

      } else if(value > round) {
        value = round;
      }

      event.target.value = value;

      gameActions.set_news_info({
          'news_round' : value
      });
  }

  // 화살표로 이동하기
  _angelNewsRound = (type : string) => {
    const { gameActions, round, game_event } = this.props;
    let news_round = this.props.news_round;

    if(game_event === false) {
        return;
    }

    if(type === 'left') {
        if(news_round > 1) {
            news_round = news_round - 1;
        }

    } else if(type === 'right') {
        if(news_round < round) {
            news_round= news_round + 1;
        }
    }

    gameActions.set_news_info({
        'news_round' : news_round
    });

    const event : any = document.getElementById('news_round_input');
    event.value = news_round
  }

  render() {
    const { news_round, playing, round, game_event, news_set } = this.props;
    const { _setNewsRound, _angelNewsRound } = this;
    const news_list = JSON.parse(this.props.news_list);

    const now_info = news_list[news_round]

    let left_angel = icon.icon.left_angel_gray;
    let right_angel = icon.icon.right_angel_gray;
    if(news_round > 1) {
        left_angel = icon.icon.left_angel;
    }

    if(news_round < round) {
        right_angel = icon.icon.right_angel;
    }
    
    if(now_info === undefined) {
        news_list[news_round] = {};
        news_list[news_round]['info'] = [ {}, {}, {} ];
    }

    const able = playing === false && game_event === true;

    return(
        <div id='news_div'>
            <div id='news_title_div'>
                <div id='news_title'> 이달의 뉴스 </div>
                <img alt='' src={icon.icon.news} />
            </div>

            <div id='news_round_divs' style={playing === false || game_event === false ? { 'color' : '#ababab' } : undefined}>
                {game_event === true
                    ? <img alt='' src={able ? undefined : left_angel} 
                            style={{ 'marginLeft' : '-35px' }} onClick={() => _angelNewsRound('left')}
                        />

                    : undefined
                }
                <input type='number' max={round} min={1} readOnly={able} disabled={game_event === false}
                       id='news_round_input' defaultValue={playing === true && game_event === true ? news_round : undefined}
                       onChange={(event) => _setNewsRound(event)}
                />
                <b> 라운드 </b>

                {game_event === true
                    ? <img alt='' src={able ? undefined : right_angel} 
                        style={{ 'marginLeft' : '20px' }} onClick={() => _angelNewsRound('right')}
                    />

                    : undefined
                }
            </div>

            <div id='news_state_divs'>
                {news_list[news_round]['info'].map( (el : any, key : number) => {
                    const option_check = key === 2;

                    const news_style : any = {};

                    let origin_value : string = '';
                    let result_value : string = '';
                    if(option_check === true) {
                        origin_value = el.origin_value + el.unit;
                        result_value = el.result_value + el.unit;
                    }

                    if(el.good === true) {
                        news_style['color'] = '#8ab6d6';

                    } else {
                        news_style['color'] = '#ca8a8b';
                    }

                    return(
                        <div key={key} className='news_state_divs'
                             style={(key + 1) < news_list[news_round]['info'].length ? { 'borderBottom' : 'dotted 1px white' } : undefined}
                        >
                            <div className='news_title_div'> 
                                {el.title}
                            </div>

                            <div className='news_detail_info_div aRight' style={news_style}> 
                                {el.value} {el.other_ment}

                                {option_check === true && game_event === true && playing === true && news_set === true
                                    ? <b className='gray'> {el.summary} </b>
                                    : undefined
                                }
                            </div>
                        </div>
                    )
                })}

            </div>

            {game_event === false
                ? <div id='new_event_off_div'>
                    OFF
                  </div>

                : undefined
            }
        </div>
    )
  }
}

export default connect( 
  ( { init, game, functions } : StoreState  ) => ({
    news_list : game.news_list,
    news_round : game.news_round,
    round : game.round,
    playing : game.playing,
    game_event : init.game_event,
    news_set : game.news_set,
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(News);

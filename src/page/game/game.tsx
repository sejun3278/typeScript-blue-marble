import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import PlayerList from './player_list';
import MapList from '../../source/map.json';
import Map from './map';

export interface AllProps {
  initActions : any,
  gameActions : any,
  player_list : string
};

class Game extends React.Component<AllProps> {

  componentDidMount() {
    // 초기 scrollTop 위치 잡기
    window.scrollTo(0, 80);
  }

  render() {
    const player_list = JSON.parse(this.props.player_list);

    const top_player_list = player_list.slice(0, 2);
    const bottom_player_list = player_list.slice(2, 4);
    
    return(
      <div id='game_div'>
        <div id='game_other_div'>
          <div id='game_title_div'>
            <h2> 대한의 마블 </h2>
            <p> Blue Marble Of Korea </p>
          </div>

          <div id='game_other_funtion_div'> 
            <div> 게임 방법 </div>
            <div onClick={() => window.confirm('게임을 재시작 하시겠습니까?') ? window.location.reload() : undefined}> 재시작 </div>
          </div>
        </div>

        <div id='game_contents_div'>
          <PlayerList
            list={JSON.stringify(top_player_list)}
          />

          <div id='game_main_contents_div'>
            <div id='game_main_map_div'>
              {MapList.maps.map( (el : any, key : number) => {

                return(
                  <div key={key} className='game_main_map_divs float_left'>
                    <div id={el.id} className={el.class}>
                      {el.info.map( (cu : any, key_2 : number) => {
                        
                        let class_col : string = '';
                        let style : object = {};
                        let border_style : object = {};

                        if(el.where === 'top' || el.where === 'bottom') {
                          if(el.info.length > (key_2 + 1)) {
                            border_style = { 'borderRight' : 'solid 2px #ababab' }
                          }

                          if(el.where === 'top') {
                            style = { 'borderBottom' : 'solid 2px #ababab' }

                          } else if(el.where === 'bottom') {
                            style = { 'borderTop' : 'solid 2px #ababab' }
                          }

                        } else if(el.where === 'middle') {
                          class_col = 'game_middle_main_map_grid_div';
                        }

                        return(
                          <div key={key_2} className={class_col}
                               style={style}
                          >
                            {el.where !== 'middle'
                              ? <div>
                                  <Map 
                                    class_col={'game_map_columns_divs'}
                                    style={border_style}
                                    info={JSON.stringify(cu)}
                                  />
                                </div>

                              : <div className='game_middle_map_divs'
                                     id={cu.id}
                                  >
                                  {cu.type === 'contents'
                                    ? cu.info.map( (val : any, key_3 : number) => {
                                        let border_style : object = {}

                                        if(cu.info.length > (key_3 + 1)) {
                                          border_style = { 'borderBottom' : 'solid 2px #ababab' }
                                        }

                                        return(
                                            <Map 
                                              class_col={'game_map_rows_divs'}
                                              style={border_style}
                                              info={JSON.stringify(val)}
                                            />
                                        )
                                    })

                                    : <div>

                                      </div>
                                  }
                                </div>
                            }
                          </div>
                        )

                      })}
                    </div>
                  </div>
                )
              })}

            </div>
          </div>


          <PlayerList
            list={JSON.stringify(bottom_player_list)}
          />
        </div>
      </div>
    )
  }
}

export default connect( 
  ( { init, game } : StoreState  ) => ({
    player_list : init.player_list
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch)
  }) 
)(Game);

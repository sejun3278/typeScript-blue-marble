import * as React from 'react';
import $ from 'jquery';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';
import { actionCreators as functionsActions } from '../../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

export interface AllProps {
  initActions : any,
  gameActions : any,
  functionsActions : any,
  card_deck : string,
  card_notice_ment : string,
  select_first_card : number,
  select_last_card : number,
  round_start : boolean,
  turn : number | null,
  card_select_able : boolean
  card_limit : number,
  overlap_card : boolean,
  all_card_num : number,
  player_list : string,
  map_info : string,
  move_location : number | null
};

class Card extends React.Component<AllProps> {

    componentDidMount() {
        const { functionsActions } = this.props;

        functionsActions.save_function({
            _moveCharacter : this._moveCharacter
        })
    }

  _toggleCardEvent = (event : any, type : string, key : number) => {
    const target = event !== null ? event.target : document.getElementById(event);
    const card_deck : any = JSON.parse(this.props.card_deck);

    const able = card_deck[key].select === false && card_deck[key].use === false

        if(able === true) {
            if(type === 'on') {
                target.style.border = 'solid 3px black';
                target.style.color = 'black';

            } else if(type === 'off') {
                target.style.border = 'dotted 3px #ababab';
                target.style.color = '#bbbbbb';

            } else if(type === 'click') {
                const { card_limit, overlap_card, select_first_card, all_card_num, initActions, gameActions } = this.props;

                let select_num : number | null = null;
                const save_obj : any = { 'all_card_num' : all_card_num };

                let z_idx = 100;
                if(key !== null) {
                    if(card_deck[key].select === false && card_deck[key].use === false) {
                        select_num = card_deck[key].number;
                        card_deck[key].select = true;

                        if(overlap_card === false) {
                            card_deck[key].use = true;
                        }

                        if(select_first_card === 0) {
                            save_obj['select_first_card'] = card_deck[key].number;  
                            save_obj['all_card_num'] += card_deck[key].number;

                            if(card_limit === 1) {
                                save_obj['card_select_able'] = false;

                            } else {
                                save_obj['card_notice_ment'] = '두번째 통행 카드를 뽑아주세요.'
                            }
                            
                        } else {
                            if(card_limit > 1) {
                                save_obj['select_last_card'] = card_deck[key].number;
                                save_obj['all_card_num'] += card_deck[key].number;

                                save_obj['card_select_able'] = false;
                                z_idx = 200;
                            }
                        }

                    } else {
                        alert('이미 선택된 카드입니다.');
                    }
                }

                if(save_obj['card_select_able'] === false) {
                    save_obj['card_notice_ment'] = save_obj['all_card_num'] + ' 칸을 이동합니다.';

                    this._moveCharacter(save_obj['all_card_num']);
                }

                initActions.set_setting_state({ 'card_deck' : JSON.stringify(card_deck) })
                gameActions.select_card_info(save_obj);

                $(target).animate({ 'marginTop' : '-20px' }, 200);
                $(target).css({ 'zIndex' : z_idx });
            }
        }
    }

    // 캐릭터 움직이기
    _moveCharacter = (move : number) => {
        const { turn, gameActions } = this.props;
        const player_list = JSON.parse(this.props.player_list);

        // const target : any = document.getElementById('player_main_character_' + turn);
        const my_location : number = player_list[Number(turn) - 1].location;
        // const my_location : number = 10;

        // 캐릭터의 현재 위치 + 이동할 위치
        let move_location = my_location + move;

        if(move_location > 27) {
            move_location = move_location - 28;
        }

        gameActions.move({ 'move_location' : move_location });

        let circle : boolean = false;
        // 이동하기

        const move_map_obj = {
            "1" : 0,
            "2" : 0,
            "3" : 0,
            "4" : 0
        }

        const _moveAction = (location : number) => {

            let start : number = 0;
            // 이동거리 구하기
            const get_move_map_info : Function = (_location : number, limit : number) => {

                if(limit <= 0) {
                    return move_map_obj;

                } else {
                    _location = _location + 1;
                    if(_location > 27) {
                        _location = 0;
                        // 맵을 한 바퀴 돌았을 경우
                        circle = true;
                    }

                    if(_location > 0 && _location <= 6) {
                        move_map_obj["1"] += 1;

                        if(start === 0) {
                            start = 1;
                        }


                    } else if(_location > 6 && _location <= 14) {
                        move_map_obj["2"] += 1;

                        if(start === 0) {
                            start = 2;
                        }

                    } else if(_location > 14 && _location <= 20) {
                        move_map_obj["3"] += 1;

                        if(start === 0) {
                            start = 3;
                        }

                    } else if(_location > 20 && _location <= 27 || _location === 0) {
                        move_map_obj["4"] += 1;

                        if(start === 0) {
                            start = 4;
                        }
                    }

                    limit = limit - 1;

                    return get_move_map_info(_location, limit);
                }
                
            }; // 함수 끝

            const move_obj = get_move_map_info(location, move);

            let final : boolean = false;
            const move_character = (obj : any, num : number, _location : number) => {
                const { turn } = this.props;

                const target : any = document.getElementById('player_main_character_' + turn);
                let player_move_location = _location + obj[num];

                if(num === 1) {
                    $(target).animate({ 'marginLeft' : player_move_location * -84.5 + 'px' }, 300);

                } else if(num === 2) {
                    $(target).animate({ 'marginTop' : (player_move_location - 6) * -84 + 'px' }, 300);

                } else if(num === 3) {
                    const player_left : number = Number( target.style.marginLeft.slice(0, target.style.marginLeft.indexOf("px")) );
                    const move_left = player_left + ( obj[num] * 86.5 );
                    
                    $(target).animate({ 'marginLeft' : move_left + 'px' }, 300);

                } else if(num === 4) {
                    const player_top : number = Number( target.style.marginTop.slice(0, target.style.marginTop.indexOf("px")) );
                    const move_top = player_top + ( obj[num] * 82 );


                    $(target).animate({ 'marginTop' : move_top + 'px' }, 300);
                }

                obj[num] = 0;

                if(obj[num + 1] > 0 || (num === 4 && obj[1] > 0)) {
                    if(num === 4) {
                        num = 0;
                        player_move_location = 0;

                        circle = true;
                        // 한바퀴 순환
                    }

                    return window.setTimeout( () => {
                        move_character(obj, num + 1, player_move_location);
                    }, 300)

                } else {
                    return window.setTimeout( () => {
                        this._action(move_location);
                    }, 300)
                }
            }

            return move_character(move_obj, start, my_location);
        }

        // const _moveAction = (location : number) => {
        //     // 최종 목적지 = move_location; ex ) 5 (0 + 5)
        //     // 현재 위치 = location; ex ) 0
        //     // 이동할 거리 = move; ex ) 5
        //     let extra : number = 0;
        //     let _next : boolean = false;
            
        //     if( (location < 28 && location >= 21) ) {

        //         let _move : number = 0;
        //         if(cover_move_location > 27) {
        //             extra = -7;
        //             _next = true;
        //             location = 0;

        //             cover_move_location = move_location;
        //             circle = true;

        //         } else if(cover_move_location <= 27) {
        //             extra = location - cover_move_location;
        //         }

        //         if(extra === 0) {
        //             _move = -590;
        //         } else if(extra === -1) {
        //             _move = -510;
        //         } else if(extra === -2) {
        //             _move = -430;
        //         } else if(extra === -3) {
        //             _move = -350;
        //         } else if(extra === -4) {
        //             _move = -265;
        //         } else if(extra === -5) {
        //             _move = -185;
        //         } else if(extra === -6) {
        //             _move = -105;
        //         } else {
        //             _move = -35;
        //         }

        //         $(target).animate({ 'marginTop' : _move + 'px' });


        //     } else if( (location < 21 && location >= 14) ) {
        //         // 14 ~ 21 사이일 때

        //         let _move : number = 0;
        //         if(cover_move_location > 21) {
        //             extra = -6;
        //             _next = true;
        //             location = 21;

        //         } else if(cover_move_location <= 21) {
        //             extra = location - cover_move_location;
        //         }

        //         if(extra > 0) {
        //             extra = -extra;
        //         }

        //         if(extra === -1) {
        //             _move = -435;
        //         } else if(extra === -2) {
        //             _move = -345;
        //         } else if(extra === -3) {
        //             _move = -260;
        //         } else if(extra === -4) {
        //             _move = -175;
        //         } else if(extra === -5) {
        //             _move = -85;
        //         } else if(extra === -6) {
        //             _move = 5;
        //         }

        //         $(target).animate({ 'marginLeft' : _move + 'px' });

        //     } else if( (location < 14 && location >= 6)) {
        //         // 6 ~ 14 사이일 때

        //         if(cover_move_location > 14) {
        //             extra = -8;
        //             _next = true;
        //             location = 14;

        //         } else if(cover_move_location <= 14) {
        //             extra = location - cover_move_location;
        //         }

        //         $(target).animate({ 'marginTop' : extra * 85 + 'px' });

        //     } else if(location < 7 && location >= 0) {
        //         // 0 ~ 6 사이일 때
        //         if( cover_move_location > 6 ) {
        //             extra = 6;
        //             _next = true;
        //             location = 6;

        //         } else {
        //             if(circle === false) {
        //                 extra = move + my_location;

        //             } else {
        //                 extra = cover_move_location;
        //             }
        //         }
        //         $(target).animate({ 'marginLeft' : extra * -85 + 'px' });
        //     }

        //     if(_next === true) {
        //         window.setTimeout( () => {
        //             _moveAction(location);

        //         }, 300);

        //     } else {
        //         return window.setTimeout( () => {
        //             return this._action(cover_move_location);

        //         }, 300);
        //     }
        // }

        return _moveAction(my_location);
    }

    // 이동 후 액션취하기
    _action = (arrive : number) => {
        const { turn, initActions, gameActions } = this.props;
        const player_list : any = JSON.parse(this.props.player_list);

        const city : any = JSON.parse(this.props.map_info);
        const city_info = city[String(arrive)];

        let select_type : string = city_info.type;

        player_list[Number(turn) - 1].location = arrive;

        gameActions.move({ 'move_able' : false });;
        gameActions.select_type({ 'select_type' : select_type, 'select_info' : JSON.stringify(city_info), "select_tap" : 1 })
        initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) })
    }

  render() {
      const { 
          card_notice_ment, select_first_card, select_last_card, turn, round_start, card_select_able,
          card_limit
        } = this.props;
      const card_deck = JSON.parse(this.props.card_deck);
      const { _toggleCardEvent } = this;

      let toggle_able = card_select_able === true && round_start === true && turn === 1;

    return(
      <div id='card_select_div' className='aLeft'>

        <div id='card_notice_div'>
            <p id='card_notice_ment_div'> {card_notice_ment} </p>
        </div>

        <div id='card_grid_div'>
            <div id='card_list_div'>
            {card_deck.map( (el : any, key : number) => {
                const card_num : number = Number(el.number);
                const left_style = { 'marginLeft' : 20 * key + 'px', 'zIndex' : key };

            return(
                <div className='each_cards_div' key={key} style={left_style}
                    onMouseEnter={(event) => toggle_able === true ? _toggleCardEvent(event, 'on', key) : undefined}
                    onMouseOut={(event) => toggle_able === true ? _toggleCardEvent(event, 'off', key) : undefined}
                    onClick={(event) => toggle_able === true ? _toggleCardEvent(event, 'click', key) : undefined}
                >
                    {el.select === false ? '?' : card_num}
                </div>
            )  
            })}
            </div>

            <div id='card_result_div'>
                <div className='card_result_divs'
                    style={card_limit === 1 ? { 'marginTop' : '25px' } : undefined}
                > 
                    첫번째 카드 
                    <div>
                        {select_first_card === 0 ? '-' : select_first_card}
                    </div>
                </div>

                {card_limit !== 1
                    ? <div id='last_select_card_div'>
                        <div className='card_result_divs'> 
                            두번째 카드 

                            <div>
                                {select_last_card === 0 ? '-' : select_last_card}
                            </div>
                        </div>
                    </div>

                    : undefined
                }
            </div>
        </div>
        
      </div>
    )
  }
}

export default connect( 
  ( { init, game } : StoreState  ) => ({
    card_deck : init.card_deck,
    card_notice_ment : game.card_notice_ment,
    select_first_card : game.select_first_card,
    select_last_card : game.select_last_card,
    round_start : game.round_start,
    turn : game.turn,
    card_select_able : game.card_select_able,
    card_limit : init.card_limit,
    overlap_card : init.overlap_card,
    all_card_num : game.all_card_num,
    player_list : init.player_list,
    map_info : init.map_info,
    move_location : game.move_location
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions: bindActionCreators(functionsActions, dispatch),
  }) 
)(Card);

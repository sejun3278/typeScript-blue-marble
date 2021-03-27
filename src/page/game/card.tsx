import * as React from 'react';
import $ from 'jquery';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

export interface AllProps {
  initActions : any,
  gameActions : any,
  card_deck : string,
  card_notice_ment : string,
  select_first_card : number,
  select_last_card : number,
  round_start : boolean,
  turn : number | null,
  card_select_able : boolean
  card_limit : number,
  overlap_card : boolean,
  all_card_num : number
};

class Card extends React.Component<AllProps> {

  _toggleCardEvent = (event : any, type : string, key : number) => {
    const target = event.target;
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
                const { card_limit, overlap_card, select_first_card, select_last_card, all_card_num, initActions, gameActions } = this.props;

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
                }

                initActions.set_setting_state({ 'card_deck' : JSON.stringify(card_deck) })
                gameActions.select_card_info(save_obj);

                $(target).animate({ 'marginTop' : '-20px' }, 200);
                $(target).css({ 'zIndex' : z_idx });
            }

        } else {
            if(type === 'click') {

            }
        }
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
    all_card_num : game.all_card_num
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch) 
  }) 
)(Card);

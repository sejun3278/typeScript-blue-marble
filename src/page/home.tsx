import * as React from 'react';
import Modal from 'react-modal';

import { actionCreators as initActions } from '../Store/modules/init';
import { actionCreators as gameActions } from '../Store/modules/game';
import { actionCreators as functionsActions } from '../Store/modules/functions';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../Store/modules';

import StartHome from './start/start_home';
import Setting from './start/setting';
import Notice from './start/notice';
import Loading from './start/loading';
import Game from './game/game';

import icon from '../source/icon.json';

export interface AllProps {
  functionsActions : any,
  game_start : boolean,
  setting_modal : boolean,
  setting_type : null | string,
  initActions : any,
  setting_able : boolean,
  loading : boolean,
  main_start : boolean,
  card_deck : string,
  overlap_card_check : string
};

const modalCustomStyles = {
  content : {
    top                   : '350px',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '600px',
  }
};

class Home extends React.Component<AllProps> {

  componentDidMount() {
    const { functionsActions } = this.props;

    // 함수 state 로 저장하기
    functionsActions.save_function({ 
      '_addSound' : this._addSound,
      '_flash' : this._flash
    })
  }

  _flash = (
      target : string, 
      type : boolean,  // type = true : 나타내기, false : 사라지기
      start : number,  // start : 초기 투명도
      twinkle : boolean | undefined | null, // twinkle = true : 깜빡임 효과, falsy : 효과 없음
      timer : number, // timer : 시간
      stop : number | null | undefined, // 정지
      limit : number | null | undefined // limit : 횟수
    ) => {

      const el_target = document.querySelectorAll(target);

      let opa : number = start;
      let _limit : number = type === true ? 1.4 : 0.2

      let all_timer = 0;
      let limit_number = 0;

      const recursion : Function = (_type : boolean) => {
        all_timer += timer;

        if(stop) {
          if(all_timer > stop) {
            return true;
          }
        }

        if(limit) {
          if(limit_number >= limit) {
            return true;
          }
        }

        if(_type === true) {
          // 나타내기
          if(opa >= _limit) {
            if(twinkle === true) {
              _type = false;
              _limit = 0.2;

              if(type === false) {
                limit_number += 1;
              }

            } else {
              return true;
            }
          }
          opa = opa + 0.2;

        } else if(_type === false) {
          // 사라지기
          if(opa <= _limit) {
            if(twinkle === true) {
              _type = true;
              _limit = 1.4;

              if(type === true) {
                limit_number += 1;
              }

            } else {
              return true;
            }
          }

          opa = opa - 0.2;
        }
        
        el_target.forEach( (el : any) => {
          el.style.opacity = opa;
        })
        
        setTimeout( () => {
          return recursion(_type);
        }, timer)
      };  

      recursion(type);
  }

  // 카드댁 구성하기
  _setCardDeck = (type : string) => {
    // type : init = 처음 카드댁 구성하기
    //        reset = 사용한 카드댁 제외하기
    let card_deck = JSON.parse(this.props.card_deck);
    if(type === 'init') {
      card_deck = [];
    }

    const { initActions } = this.props;

    const overlap_check : any = {};
    // 카드 구성 Recursion 함수
    const _setCardDeck : Function = (num : number) => {
      if(num > 9) {
        return card_deck;
      }

      const random = Math.trunc(Math.random() * (10 - 1) + 1);
      if(type === 'init') {
        if(overlap_check[random] === undefined) {
          overlap_check[random] = true;
          card_deck.push({ 'number' : random, 'use' : false, 'select' : false })

        } else {
          return _setCardDeck(num);
        }

      }

      num += 1;
      return _setCardDeck(num);
    }

    if(type === 'init') {
      card_deck = _setCardDeck(1);

    } else if(type === 'reset') {
      for(let i = 0; i < card_deck.length; i++) {
        if(card_deck[i].use === true) {
          card_deck[i] = false;
        }
      }

      card_deck = card_deck.filter( (el : any) => {
        return el !== false;
      })
    }

    initActions.set_setting_state({
      'card_deck' : JSON.stringify(card_deck)
    })

    return;
  }

  // 사운드 추가하기
  _addSound = (type : string, name : string, number : number) => {
    const sound_list = require('../source/sound.json');
    const sound = sound_list[type][name][number];

    let audio : any = document.createElement('audio');
    audio.classList.add('game_sound_audio');
    
    if(type === 'effect') {
      audio.id = 'game_effect_sound';
    }

    audio.autoplay = true
    audio.src = sound;
  }

  render() {
    const { game_start, setting_modal, setting_type, initActions, setting_able, loading, main_start } = this.props;
    const modal_title = setting_type === 'setting' ? '게임 셋팅' : '게임 방법';

    const { _addSound } = this;

    return(
      <div id='game_home_div'>
        <div id='game_sound_divs'>
          {/* <audio id='game_effect_1_audio' controls /> */}
        </div>

        {main_start === false
          ?
            <div id='game_title_div'>
              <h2> 대한의 마블 </h2>
              <p> Blue Marble Of Korea </p>
            </div>

          : undefined
        }

        {game_start === false && main_start === false
          ? loading === false 
            ? <StartHome 
               _addSound={_addSound}
            />

            : <Loading {...this} />

          : main_start === true
            ? <Game {...this} />

            : null
        }

        {setting_modal === true
          ? <Modal
              isOpen={setting_modal}
              style={modalCustomStyles}
              ariaHideApp={false}
            >
              <div id='modal_title_div'>
                <h4>
                  {modal_title} 
                  <img id='modal_close_icon' alt='' src={icon.icon.close} title='닫기'
                      onClick={() => setting_able === true ? initActions.toggle_setting_modal({ 'modal' : false, 'type' : null }) : undefined}
                  />
                </h4>
              </div>

              {setting_type !== null
                ? setting_type === 'setting'
                  ? <Setting
                      _flash={this._flash}
                      _addSound={this._addSound}
                    />

                  : <Notice />

                : null
              }
            </Modal>

          : null
        }
      </div>
    )
  }
}

export default connect( 
  ( { init, game } : StoreState  ) => ({
    game_start : init.game_start,
    setting_modal : init.setting_modal,
    setting_type : init.setting_type,
    setting_able : init.setting_able,
    loading : game.loading,
    main_start : game.main_start,
    card_deck : init.card_deck,
    overlap_card_check : game.overlap_card_check
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Home);

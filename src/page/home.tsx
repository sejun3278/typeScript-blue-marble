import * as React from 'react';
import Modal from 'react-modal';

import { actionCreators as initActions } from '../Store/modules/init';
import { actionCreators as gameActions } from '../Store/modules/game';
import { actionCreators as functionsActions } from '../Store/modules/functions';
import { actionCreators as noticeActions } from '../Store/modules/notice';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../Store/modules';

import StartHome from './start/start_home';
import Setting from './start/setting';
import Notice from './start/notice';
import Loading from './start/loading';
import Game from './game/game';
import Init from './init';

import icon from '../source/icon.json';
import NoticeList from './start/notice.json';

export interface AllProps {
  functionsActions : any,
  noticeActions : any,
  game_start : boolean,
  setting_modal : boolean,
  setting_type : null | string,
  initActions : any,
  setting_able : boolean,
  loading : boolean,
  main_start : boolean,
  card_deck : string,
  overlap_card_check : string,
  large_cat : number,
  small_cat : number,
  setting_stage : number,
  _gameStart : Function,
  _selectCategory: Function,
  _moveStage : Function,
  bgm_number : number
};

class Home extends React.Component<AllProps> {

  componentDidMount() {
    const { functionsActions } = this.props;

    // 함수 state 로 저장하기
    functionsActions.save_function({ 
      '_addSound' : this._addSound,
      '_flash' : this._flash
    })

    window.document.addEventListener('keydown', (event) => this._setKeyBoardKey(event))
  }

  componentWillUnmount() {
    window.document.removeEventListener("keydown", (event) => this._setKeyBoardKey(event));
  }

  _setKeyBoardKey = (event : any) => {
    const { 
      large_cat, small_cat, setting_modal, setting_type, setting_stage, _gameStart, 
      setting_able, _selectCategory, _moveStage 
    } = this.props;

    const keyCode : number = Number(event.keyCode);

    let save_obj : any = {}
    ///
    const _prevCategory : Function = () => {
      save_obj['large_cat'] = large_cat - 1;

      const prev_category : any = NoticeList[large_cat - 1];
      if(prev_category.child !== undefined) {
        save_obj['small_cat'] = prev_category.child.length - 1;
      _selectCategory(large_cat - 1,  prev_category.child.length - 1);

      } else {
      _selectCategory(large_cat - 1,  0);

        save_obj['small_cat'] = 0;
      }
    }
    ///

    // 현재 카테고리
    if(setting_modal === true) {
      if(setting_type === 'notice') {
        const category : any = NoticeList[large_cat];
        if(keyCode === 40 || keyCode === 39) {
          // 아래 키 && 오른쪽 키

          if( (Object.keys(NoticeList).length - 1) !== large_cat ) {
            if( category.child === undefined) {
              _selectCategory(large_cat + 1, 0);
              // save_obj['large_cat'] = large_cat + 1;
              // save_obj['small_cat'] = 0;

            } else {
              if( small_cat !== (category.child.length - 1) ) {
              _selectCategory(large_cat, small_cat + 1);

                // save_obj['large_cat'] = large_cat
                // save_obj['small_cat'] = small_cat + 1;

              } else {
              _selectCategory(large_cat + 1, 0);

                // save_obj['large_cat'] = large_cat + 1;
                // save_obj['small_cat'] = 0;
              }
            }

          } else {
            if(category.child !== undefined) {
              if( small_cat !== (category.child.length - 1) ) {
                _selectCategory(large_cat, small_cat + 1);
              }
            }
          }

        } else if(keyCode === 38 || keyCode === 37) {
          // 윗 키

          if(large_cat !== 0) {
            if(category.child !== undefined) {
              if(small_cat === 0) {
                _prevCategory();

              } else {
              _selectCategory(large_cat, small_cat - 1);

                // save_obj['large_cat'] = large_cat;
                // save_obj['small_cat'] = small_cat - 1; 
              }

            } else {
              _prevCategory();
            }
          }
        }
        // noticeActions.select_tap(save_obj);

      } else if(setting_type === 'setting') {
        if(keyCode === 49) {
          // 1번 키 클릭
          if(setting_stage !== 1) {
            _moveStage(1);
          }

        } else if(keyCode === 50) {
          if(setting_stage !== 2) {
            _moveStage(2);
          }

        } else if(keyCode === 51) {
          if(setting_stage !== 3) {
            _moveStage(3);
          }
        
        } else {
          if(keyCode === 39) {
            // 오른쪽 
            if(setting_stage !== 3) {
              _moveStage(setting_stage + 1);
              // initActions.set_setting_state({ 'stage' : setting_stage + 1 });
            }

          } else if(keyCode === 37) {
            // 왼쪽
            if(setting_stage > 1) {
              _moveStage(setting_stage - 1);
              // initActions.set_setting_state({ 'stage' : setting_stage - 1 });
            }

          } else if(keyCode === 13) {
            // 게임 시작
            if(setting_able === true) {
              return _gameStart();
            }
          }
        }
      }
    }
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
    let sound : string = "";

    let audio : any = document.createElement('audio');
    audio.classList.add('game_sound_audio');
    
    if(type === 'effect') {
      audio.id = 'game_effect_sound';
      sound = sound_list[type][name][number];

    } else if(type === 'bgm') {
      sound = sound_list[type][name][number];

      
    }

    audio.autoplay = true
    audio.src = sound;
  }

  // 모달 스타일 지정
  _setModalStyle = () => {
    const { setting_type } = this.props;

    const modalCustomStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        width                 : '600px',
      }
    };

    if(setting_type === 'notice') {
      modalCustomStyles['content']['width'] = '800px'
    }

    return modalCustomStyles;
  }

  render() {
    const { game_start, setting_modal, setting_type, initActions, setting_able, loading, main_start } = this.props;
    const modal_title = setting_type === 'setting' ? '게임 셋팅' : '게임 방법';

    const { _addSound, _setModalStyle } = this;

    return(
      <div id='game_home_div'>
        <Init />

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
              style={_setModalStyle()}
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
  ( { init, game, notice, functions } : StoreState  ) => ({
    game_start : init.game_start,
    setting_modal : init.setting_modal,
    setting_type : init.setting_type,
    setting_able : init.setting_able,
    loading : game.loading,
    main_start : game.main_start,
    card_deck : init.card_deck,
    overlap_card_check : game.overlap_card_check,
    large_cat : notice.large_cat,
    small_cat : notice.small_cat,
    setting_stage : init.setting_stage,
    _gameStart : functions._gameStart,
    _selectCategory : functions._selectCategory,
    _moveStage : functions._moveStage,
    bgm_number : game.bgm_number
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch),
      noticeActions : bindActionCreators(noticeActions, dispatch)
  }) 
)(Home);

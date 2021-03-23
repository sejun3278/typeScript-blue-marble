import * as React from 'react';
import Modal from 'react-modal';

import { actionCreators as initActions } from '../Store/modules/init';
import { actionCreators as gameActions } from '../Store/modules/game';

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
  game_start : boolean,
  setting_modal : boolean,
  setting_type : null | string,
  initActions : any,
  setting_able : boolean,
  loading : boolean,
  main_start : boolean,
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

  render() {
    const { game_start, setting_modal, setting_type, initActions, setting_able, loading, main_start } = this.props;
    const modal_title = setting_type === 'setting' ? '게임 셋팅' : '게임 방법';

    return(
      <div id='game_home_div'>
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
            ? <StartHome />

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
                      {...this}
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
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch)
  }) 
)(Home);

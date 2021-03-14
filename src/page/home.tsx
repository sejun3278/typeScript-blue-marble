import * as React from 'react';
import Modal from 'react-modal';

import { actionCreators as initActions } from '../Store/modules/init';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../Store/modules';

import StartHome from './start/start_home';
import Setting from './start/setting';
import Notice from './start/notice';

import icon from '../source/icon.json';

export interface AllProps {
  game_start : boolean,
  setting_modal : boolean,
  setting_type : null | string,
  initActions : any
};

const modalCustomStyles = {
  content : {
    top                   : '300px',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '500px',
  }
};

class Home extends React.Component<AllProps> {

  render() {
    const { game_start, setting_modal, setting_type, initActions } = this.props;
    const modal_title = setting_type === 'setting' ? '게임 셋팅' : '게임 방법';

    return(
      <div id='game_home_div'>
        {game_start === false
          ? <StartHome />

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
                      onClick={() => initActions.toggle_setting_modal({ 'modal' : false, 'type' : null })}
                  />
                </h4>
              </div>

              {setting_type !== null
                ? setting_type === 'setting'
                  ? <Setting />

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
  ( { init } : StoreState  ) => ({
    game_start : init.game_start,
    setting_modal : init.setting_modal,
    setting_type : init.setting_type
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch) 
  }) 
)(Home);

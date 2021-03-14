import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import icon from '../../source/icon.json';

export interface AllProps {
  initActions : any,
  setting_stage : number,
  start_price : number,
  round_timer : number,
  game_event : boolean,
  setting_modify : boolean,
};

class Setting extends React.Component<AllProps> {

  _moveStage = (stage : number) => {
    const { initActions } = this.props;

    initActions.set_setting_state({ "stage" : stage });
  }

  _setGameInfo = (event : any, type : string, bool : boolean | null) => {
    const { initActions } = this.props;
    let value : any = event.target.value

    if(type === 'price' || type === 'round_timer') {
        value = Number(value);

    } else if(type === 'event') {
        value = bool;
    }

    const save_obj : any = {};
    save_obj[type] = value;
    save_obj['modify'] = true;

    return initActions.set_setting_state(save_obj);
  }

  _resetSetting = () => {
      if(window.confirm('설정한 부분들을 모두 초기화 하시겠습니까?')) {
        const { initActions } = this.props;

        const save_obj : any = {}
        save_obj['price'] = 100;
        save_obj['round_timer'] = 60;
        save_obj['event'] = true;
        save_obj['modify'] = false;

        return initActions.set_setting_state(save_obj);

        // return alert('초기화 되었습니다.');

      } else {
          return;
      }
  }

  render() {
    const { setting_stage, start_price, round_timer, game_event, setting_modify } = this.props;
    const { _moveStage, _setGameInfo, _resetSetting } = this;

    return(
      <div id='game_setting_div'>
        <div id='game_setting_state_div'>
            <div> 
                <b className={setting_stage === 1 ? 'black' : undefined}
                    onClick={() => _moveStage(1)}
                > 
                    1. 게임 설정 
                </b> 
            </div>

            <div className='aCenter'> 
                <b className={setting_stage === 2 ? 'black' : undefined}
                    onClick={() => _moveStage(2)}
                > 
                    2. 플레이어 설정
                </b> 
            </div>

            <div className='aRight'> 
                <b className={setting_stage === 3 ? 'black' : undefined}
                    onClick={() => _moveStage(3)}
                > 
                    3. 게임 시작 
                </b> 
            </div>
        </div>
        
        <div id='game_setting_contents_div'>

            <div id='game_setting_contents'>

            {/* <img alt='' id='game_setting_move_prev_page_icon' 
                className='game_setting_move_arrows'
                src={icon.icon.left_arrow}
            /> */}

                <div className='game_setting_arrow_divs'>
                    {setting_stage !== 3
                        ? <img alt='' id='game_setting_move_prev_page_icon' 
                            className='game_setting_move_arrows'
                            src={setting_stage > 1 ? icon.icon.left_arrow : icon.icon.left_gray_arrow}
                            onClick={() => setting_stage === 2 ? _moveStage(1) : undefined}
                        />

                        : undefined
                    }
                </div>

                {setting_stage === 1
                    ? <div id='game_info_setting_div'>
                        <ul>
                            <li>
                                <div className='game_setting_title_div'>
                                    시작 자금 설정　
                                </div>

                                <div className='game_setting_info_div'>
                                    <select value={start_price}
                                            onChange={(event : any) => _setGameInfo(event, 'price', null)}
                                    >
                                        <option value={100}> 100 만원 </option>
                                        <option value={200}> 200 만원 </option>
                                        <option value={300}> 300 만원 </option>
                                        <option value={400}> 400 만원 </option>
                                        <option value={500}> 500 만원 </option>
                                    </select>

                                    <img src={icon.icon.notice} className='notice_icon' alt='' 
                                        title='설정한 자금으로 게임을 시작합니다. 설정된 자금은 모든 플레이어에게 동일 적용됩니다.'
                                    />
                                </div>
                            </li>

                            <li> 
                                <div className='game_setting_title_div'>
                                    라운드 시간 제한 설정
                                </div>

                                <div className='game_setting_info_div'>
                                    <select value={round_timer}
                                            onChange={(event : any) => _setGameInfo(event, 'round_timer', null)}
                                    >
                                        <option value={30}> 30 초 </option>
                                        <option value={40}> 40 초 </option>
                                        <option value={50}> 50 초 </option>
                                        <option value={60}> 60 초 </option>
                                        <option value={0}> 시간 제한 없음 </option>
                                    </select>

                                    <img src={icon.icon.notice} className='notice_icon' alt='' 
                                        title='라운드 별로 플레이어의 행동 가능 시간을 설정합니다.'
                                    />
                                </div>
                            </li>

                            <li>
                                <div className='game_setting_title_div'>
                                    이벤트 영향

                                    <img src={icon.icon.notice} className='notice_icon' alt='' 
                                        title='게임 플레이에 영향을 주는 이벤트를 켜거나 끌 수 있습니다.'
                                    />
                                </div>

                                <div className='game_setting_info_div'>
                                    <div className='game_setting_radio_div'>
                                        <div> 
                                            <input type='radio' name='event' className='setting_radio' id='event_on' 
                                                    checked={game_event === true}
                                                    onChange={(event : any) => _setGameInfo(event, 'event', true)}
                                            /> 
                                            <label htmlFor='event_on'> ON </label>
                                        </div>

                                        <div> 
                                            <input type='radio' name='event' className='setting_radio' id='event_off'
                                                    checked={game_event === false}
                                                    onChange={(event : any) => _setGameInfo(event, 'event', false)}
                                            /> 
                                            <label htmlFor='event_off'> OFF </label>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <div id='game_setting_complate_div' className='aRight'>
                            <div className='game_setting_next_game_div'>
                                <input type='button' value='다음 >>' 
                                    onClick={() => _moveStage(2)}
                                />
                            </div>

                            <div> 
                                <input type='button' value='초기화' title='설정들을 기본 설정으로 바꿉니다.' 
                                        id='game_setting_reset_button' onClick={() => setting_modify === true ? _resetSetting() : undefined}
                                        style={setting_modify === false ? { 'backgroundColor' : '#ababab', 'color' : 'white' } : undefined}
                                /> 
                            </div>
                        </div>
                    </div>
                    
                    : setting_stage === 2

                    ? <div>
                        34
                    </div>

                    : setting_stage === 3

                    ? <div>
                        56
                    </div>

                    : undefined
                }

                <div className='game_setting_arrow_divs aRight'>
                    {setting_stage !== 3
                        ? <img alt='' id='game_setting_move_next_page_icon' 
                            className='game_setting_move_arrows'
                            src={setting_stage !== 3 ? icon.icon.right_arrow : icon.icon.right_gray_arrow}
                            onClick={() => setting_stage !== 3 ? _moveStage(setting_stage + 1) : undefined}
                        />

                        : undefined
                    }
                </div>
            </div>
        </div>
      </div>
    )
  }
}

export default connect( 
  ( { init } : StoreState  ) => ({
    setting_stage : init.setting_stage,
    start_price : init.start_price,
    round_timer : init.round_timer,
    game_event : init.game_event,
    setting_modify : init.setting_modify
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch) 
  }) 
)(Setting);

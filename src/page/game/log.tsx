import * as React from 'react';

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
  playing : boolean,
  _addLog : Function,
  game_log : string,
  game_over : boolean
};

class Log extends React.Component<AllProps> {

  // 채팅 입력
  _chat = (event : any) => {
    const { playing, _addLog, game_over } = this.props;

    event.preventDefault();

    if(playing === false || game_over === true) {
      return;
    }

    const form_data = event.target;
    const chat = form_data.game_chat.value.trim();

    if(chat.length > 0) {
      form_data.game_chat.value = '';

      const ment = `<b class="player_chat"> 나　|　${chat} </b>`

      _addLog(ment);
      return;

    } else {
      return form_data.game_chat.focus();
    }
  }

  render() {
    const { playing, game_over } = this.props;
    const { _chat } = this;

    const game_log = JSON.parse(this.props.game_log);

    return(
      <div id='game_log_div'>
        <div id='game_log_list_div'>
          {game_log.reverse().map( (el : string, key : number) => {
            return(
              <div className='log_divs' key={key}>
                <div dangerouslySetInnerHTML={{ __html : el }} />
              </div>
            )
          })}
        </div>

        <div id='game_player_chat_div'>
          <form name='chat_data' onSubmit={_chat}>
            <div id='game_chat_grid_div'>
              <div> 
                <input type='text' name='chat' id='game_chat' maxLength={30} placeholder={playing === false ? undefined : '채팅 입력'}
                       disabled={playing === false || game_over === true} readOnly={playing === false || game_over === true}
                /> 
              
              </div>

              <div className='aCenter'> 
                <input type='submit' value='입력' id='game_chat_submit' 
                       style={playing === false || game_over === true ? { 'color' : '#ababab' } : undefined}
                       className={playing === false ? 'gray' : undefined}
                /> 
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default connect( 
  ( { init, game, functions } : StoreState  ) => ({
    playing : game.playing,
    _addLog : functions._addLog,
    game_log : game.game_log,
    game_over : game.game_over
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      gameActions: bindActionCreators(gameActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Log);

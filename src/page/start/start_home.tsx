import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

export interface AllProps {
  initActions : any,
  _addSound : Function
};

class StartHome extends React.Component<AllProps> {

  render() {
    const { initActions } = this.props;

    return(
      <div id='game_start_home_div'>
          <div id='game_select_div'>
            <div> 
              <b onClick={() => initActions.toggle_setting_modal({ 'modal' : true, 'type' : 'setting' })}> 
                게임 시작 
              </b> 
            </div>

            <div> <b onClick={() => initActions.toggle_setting_modal({ 'modal' : true, 'type' : 'notice' })}> 게임 방법 </b> </div>
          </div>
      </div>
    )
  }
}

export default connect( 
  ( { init } : StoreState  ) => ({
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch) 
  }) 
)(StartHome);

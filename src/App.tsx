import * as React from 'react';
import './App.css';

// import * as testAction from './Store/modules/test';
import { actionCreators as initActions } from './Store/modules/init';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from './Store/modules';

import Home from './page/home';

export interface AllProps {
  value : number
  initActions : any
};

class App extends React.Component<AllProps> {

  _controllValue = (type : boolean) => {
    const { value, initActions } = this.props;
    
    if(type === true) {
      initActions.redux_test({ 'value' : value + 1 })

    } else if(type === false) {
      initActions.redux_test({ 'value' : value - 1 })
    }
  }

  render() {
    const { value } = this.props;
    const { _controllValue } = this;

    return(
      <div>
        <input type='button' value='삭감' onClick={() => _controllValue(false)} />
        {value}
        <input type='button' value='추가' onClick={() => _controllValue(true)} />

        <Home />
      </div>
    )
  }
}

export default connect( 
  ({ init } : StoreState ) => ({
    value : init.value
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch) 
  }) 
)(App);

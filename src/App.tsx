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

  componentDidMount() {
    window.document.addEventListener('keydown', function(event) {
      const keyCode : number = event.keyCode;
      if(keyCode === 123) {
        // F12 방지
        // event.returnValue = false;
      }
    })
  }

  render() {
    return(
      <div>
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

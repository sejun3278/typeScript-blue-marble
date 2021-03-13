import * as React from 'react';

import { actionCreators as initActions } from '../Store/modules/init';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../Store/modules';

export interface AllProps {
  // InitActions : typeof initActions,
//   value : number
};

class Home extends React.Component<AllProps> {

  render() {

    return(
      <div>
        123
      </div>
    )
  }
}

export default connect( 
  ( state ) => ({
    
  }), 
    (dispatch) => ({ 
      TestActions: bindActionCreators(initActions, dispatch) 
  }) 
)(Home);

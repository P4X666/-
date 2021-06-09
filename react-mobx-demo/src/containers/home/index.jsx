import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('homeInfo')
@observer
class Home extends Component {
  updateName = (name) => {
    const { homeInfo: { updateName } } = this.props;
    updateName(name)
  }
  render() {
    const { homeInfo: { name } } = this.props;
    return (
      <div className="mobx">
        <p>{ name }</p>
        <button onClick={()=>this.updateName('hello')}></button>
      </div>
    );
  }
}

export default Home
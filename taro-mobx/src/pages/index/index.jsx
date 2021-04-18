import { Component } from 'react';
// import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
// import { AtAvatar } from 'taro-ui';
import './index.scss';

import Home from '../Home';

@inject('store')
@observer
class Index extends Component {
  componentWillMount () { }

  componentDidMount () {
    console.log(this.props.store);
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  increment = () => {
    const { counterStore } = this.props.store;
    counterStore.increment();
  }

  decrement = () => {
    const { counterStore } = this.props.store;
    counterStore.decrement();
  }

  incrementAsync = () => {
    const { counterStore } = this.props.store;
    counterStore.incrementAsync();
  }

  render () {
    const { counterStore: { counter } } = this.props.store;
    const obj = {
      name: 'xxx',
    };
    return (
      <View className="index">
        <Home></Home>
        <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async {obj.name}</Button>
        <Text>{counter}</Text>
      </View>
    );
  }
}

export default Index;

import { Component } from 'react';
// import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import { AtAvatar } from 'taro-ui';
import { observer, inject } from 'mobx-react';

import './index.scss';

@inject('store')
@observer
class Banner extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  increment = () => {
    const { counterStore } = this.props.store;
    counterStore.increment();
  };

  decrement = () => {
    const { counterStore } = this.props.store;
    counterStore.decrement();
  };

  incrementAsync = () => {
    const { counterStore } = this.props.store;
    counterStore.incrementAsync();
  };

  render() {
    return (
      <View className="banner at-row at-row__align--center">

          <AtAvatar className="avatar" circle image={require('@assets/avatar@2x.png')}></AtAvatar>
          <Text className="avatar-label">点击登录</Text>

      </View>
    );
  }
}

export default Banner;

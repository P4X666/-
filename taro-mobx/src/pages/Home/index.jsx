import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';

import { AtButton } from 'taro-ui';

import './index.scss';

import Banner from '../../component/Banner';

@inject('store')
@observer
class Home extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  goVlock = () => {
    const name = 'test';
    Taro.navigateTo({
      url: `/pages/Clock/index?name=${name}`,
    });
  };
  render() {
    return (
      <View className="index">
        <Banner></Banner>
        <AtButton type="primary" onClick={this.goVlock}>
          去打卡
        </AtButton>
      </View>
    );
  }
}

export default Home;

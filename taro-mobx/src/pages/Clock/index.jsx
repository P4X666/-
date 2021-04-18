import { Component } from 'react';
import { View, Text, Map } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { observer, inject } from 'mobx-react';
import './index.scss';

@inject('store')
@observer
class Home extends Component {
  state = {
    longitude: 0,
    latitude: 0,
    circle: [],
  };
  componentWillMount() {}

  componentDidMount() {
    console.error(getCurrentInstance().router.params);
    Taro.setNavigationBarTitle({ title: '打卡' });
    const mapCtx = Taro.createMapContext('myMap');
    this.getLocation().then(() => {
      mapCtx.moveToLocation({
        success: () => {
          console.log('success');
          this.setState({
            circle: [
              {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                radius: 200,
                fillColor: '#487FF715',
                color: '#487FF7',
              },
            ],
          });
        },
      });
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  // 这个是我个人的 key 后续要进行切换
  mapKey = 'COABZ-VZS6F-XLRJQ-JKPER-4ECO6-4RFRF';

  getLocation = () => {
    return Taro.getLocation({
      altitude: 'true', // 高精度定位
      highAccuracyExpireTime: 3000,
      success: ({ longitude, latitude }) => {
        this.setState({
          longitude: longitude,
          latitude: latitude,
        });
      },
    });
  };
  render() {
    return (
      <View className="index">
        <Map
          id="myMap"
          style="width:100%;height:300px"
          subkey={this.mapKey}
          longitude={this.state.longitude}
          latitude={this.state.latitude}
          show-location
          circles={this.state.circle}
        ></Map>

        <Text>{this.state.longitude}</Text>
        <Text>{this.state.latitude}</Text>
      </View>
    );
  }
}

export default Home;

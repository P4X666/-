import { Component } from 'react'
import { View } from '@tarojs/components'
import Calendar from '../../components/Calendar'
import  './index.scss'

class Index extends Component {
  render () {
    return (
      <View className='index'>
        <Calendar
          marks={[
          { value: '2021-06-11', color: 'red', markSize: '9px' },
          { value: '2021-06-12', color: 'pink', markSize: '9px' },
          { value: '2021-06-13', color: 'gray', markSize: '9px' },
          { value: '2021-06-14', color: 'yellow', markSize: '9px' },
          { value: '2021-06-15', color: 'darkblue', markSize: '9px' },
          { value: '2021-06-16', color: 'pink', markSize: '9px' },
          { value: '2021-06-17', color: 'green', markSize: '9px' },
        ]}
        // customStyleGenerator={(params) => {
        //   console.log(params);

        //   return {
        //     markStyle: {},
        //   };
        // }}
          extraInfo={[
          { value: '2021-06-21', text: '生日', color: 'red' },
          { value: '2021-06-22', text: '休假', color: 'darkblue' },
          { value: '2021-06-23', text: '会议', color: 'gray' },
        ]}
          view='month'
          mode='normal'
          bindRef={(ref) => (this.CalendarComponent = ref)}
        // hideController
          // currentView={`${date.select.year}-${date.select.month}`}
          onCurrentViewChange={this.setCurrentView}
          // selectedDate={`${date.select.year}-${date.select.month}-${date.select.day}`}
          onDayClick={(item) => this.setSelectDay(item.value)}
        />
      </View>
    )
  }
}

export default Index

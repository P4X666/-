import { Picker, View, Swiper, SwiperItem } from "@tarojs/components";
import { Component } from "react";
import { formatDate, fillWithZero, getWeekDayList } from "./utils";
import Days from "./days/index";

import "./index.scss";

class Calendar extends Component {
  state = {
    current: formatDate(new Date(this.props.currentView)),
    selectedDate: this.props.selectedDate,
    currentCarouselIndex: 1,
    selectedRange: { start: "", end: "" },
  };
  componentWillMount() {
    if (this.props.bindRef) {
      this.props.bindRef(this);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedDate &&
      nextProps.selectedDate !== this.props.selectedDate
    ) {
      this.setState({
        selectedDate: nextProps.selectedDate,
        current: nextProps.selectedDate,
      });
    }
    if (
      nextProps.currentView &&
      nextProps.currentView !== this.props.currentView
    ) {
      this.setState({ current: nextProps.currentView });
    }
  }

  getPickerText = () => {
    let { view, startDay } = this.props;
    startDay = startDay;
    const { current } = this.state;
    const currentDateObj = new Date(current);
    const monthStr = formatDate(currentDateObj, "month");

    if (view === "week") {
      currentDateObj.setDate(
        currentDateObj.getDate() -
          (currentDateObj.getDay() >= startDay
            ? currentDateObj.getDay() - startDay
            : 6 - startDay + currentDateObj.getDay())
      );
      const weekStart = currentDateObj.getDate();
      const weekStartMonth = currentDateObj.getMonth() + 1;
      const weekStartYear = currentDateObj.getFullYear();
      currentDateObj.setDate(currentDateObj.getDate() + 6);
      const weekEnd = currentDateObj.getDate();
      const weekEndMonth = currentDateObj.getMonth() + 1;
      const weekEndYear = currentDateObj.getFullYear();
      let weekEndStr = `${fillWithZero(weekEnd, 2)}`;
      if (weekEndMonth !== weekStartMonth) {
        weekEndStr = `${fillWithZero(weekEndMonth, 2)}-${weekEndStr}`;
      }
      if (weekEndYear !== weekStartYear) {
        weekEndStr = `${weekEndYear}-${weekEndStr}`;
      }
      return `${monthStr}-${fillWithZero(weekStart, 2)}~${weekEndStr}`;
    }
    if (view === "month") {
      return monthStr;
    }
  };
  onClickDate = (value) => {
    const { onDayClick, onSelectDate } = this.props;
    let { current, currentCarouselIndex, selectedRange } = this.state;
    if (!selectedRange.start || selectedRange.end) {
      selectedRange = { start: value.fullDateStr, end: "" };
    } else {
      if (new Date(selectedRange.start) > new Date(value.fullDateStr)) {
        selectedRange = {
          start: value.fullDateStr,
          end: selectedRange.start,
        };
      } else {
        selectedRange.end = value.fullDateStr;
      }
    }

    if (!value.currentMonth) {
      // 点到非本月的日期就跳转到相应月份
      const { onCurrentViewChange, onClickNext, onClickPre } = this.props;
      let dateObj = new Date(value.fullDateStr);
      if (dateObj.getMonth() > new Date(current).getMonth()) {
        currentCarouselIndex = (currentCarouselIndex + 1) % 3;
        if (onClickNext) onClickNext();
      } else {
        currentCarouselIndex = (currentCarouselIndex + 2) % 3;
        if (onClickPre) onClickPre();
      }
      if (onCurrentViewChange) onCurrentViewChange(value.fullDateStr);

      current = formatDate(dateObj);
    }
    this.setState({
      selectedDate: value.fullDateStr,
      selectedRange,
      currentCarouselIndex,
      current,
    });
    if (onDayClick) {
      onDayClick({ value: value.fullDateStr });
    }
    if (onSelectDate) {
      onSelectDate(selectedRange);
    }
  };

  goNext = () => {
    console.log("下个月");
    const { view } = this.props;
    const { currentCarouselIndex } = this.state;
    let dateObj = new Date(this.state.current);
    const { onClickNext, onCurrentViewChange } = this.props;
    let current = "";
    if (view === "month") {
      dateObj.setMonth(dateObj.getMonth() + 1);
      const nextMonth = formatDate(dateObj);
      current = nextMonth;
    }
    if (view === "week") {
      dateObj.setDate(dateObj.getDate() + 7);
      const nextWeek = formatDate(dateObj, "day");
      current = nextWeek;
    }
    if (onClickNext) onClickNext();
    if (onCurrentViewChange) onCurrentViewChange(current);
    this.setState({
      currentCarouselIndex: (currentCarouselIndex + 1) % 3,
      current,
    });
  };

  goPre = () => {
    console.log("上个月");
    const { view } = this.props;
    const { currentCarouselIndex } = this.state;
    let dateObj = new Date(this.state.current);
    let current = "";
    if (view === "month") {
      dateObj.setMonth(dateObj.getMonth() - 1);
      const preMonth = formatDate(dateObj);
      current = preMonth;
    }
    if (view === "week") {
      dateObj.setDate(dateObj.getDate() - 7);
      const preWeek = formatDate(dateObj, "day");
      current = preWeek;
    }
    const { onClickPre, onCurrentViewChange } = this.props;
    if (onClickPre) onClickPre();
    if (onCurrentViewChange) onCurrentViewChange(current);
    this.setState({
      currentCarouselIndex: (currentCarouselIndex + 2) % 3,
      current,
    });
  };

  render() {
    const {
      current,
      selectedDate,
      currentCarouselIndex,
      selectedRange,
    } = this.state;
    const {
      marks,
      isVertical,
      selectedDateColor,
      hideArrow,
      isSwiper,
      minDate,
      maxDate,
      onDayLongPress,
      showDivider,
      isMultiSelect,
      customStyleGenerator,
      headStyle,
      headCellStyle,
      bodyStyle,
      leftArrowStyle,
      rightArrowStyle,
      datePickerStyle,
      pickerRowStyle,
      view,
      pickerTextGenerator,
      hideController,
      onCurrentViewChange,
      startDay,
      extraInfo,
    } = this.props;
    // 配合Swiper组件实现无限滚动
    // 原理：永远保持当前屏幕显示月份的左边是前一个月，右边是后一个月
    // current即当前月份，currentCarouselIndex即当前显示页面的index。一共3个页面，index分别为0 1 2 。
    // Swiper的无限循环就是类似0 1 2 0 1 2 这样。如果currentCarouselIndex是2 那么我只要保证 1显示的是前面一个月，0显示的是后面一个月 就完成了循环。
    let currentDate = new Date(current);

    let preDate = new Date(current);
    let nextDate = new Date(current);

    if (view === "month") {
      preDate.setMonth(currentDate.getMonth() - 1);
      nextDate.setMonth(currentDate.getMonth() + 1);
    }
    if (view === "week") {
      preDate.setDate(currentDate.getDate() - 7);
      nextDate.setDate(currentDate.getDate() + 7);
    }
    const preIndex = (currentCarouselIndex + 2) % 3;
    const nextIndex = (currentCarouselIndex + 1) % 3;
    let monthObj = [];
    monthObj[currentCarouselIndex] = currentDate;
    monthObj[preIndex] = preDate;
    monthObj[nextIndex] = nextDate;
    // 所有Days组件的公共Props
    const publicDaysProp = {
      marks: marks || [],
      onClick: this.onClickDate,
      selectedDate,
      minDate: minDate,
      maxDate,
      selectedDateColor,
      onDayLongPress,
      showDivider: showDivider,
      isMultiSelect: isMultiSelect,
      selectedRange: selectedRange,
      customStyleGenerator,
      view: view,
      startDay: startDay,
      extraInfo: extraInfo || [],
    };

    return (
      <View className='calendar'>
        {!hideController && (
          <View
            className='calendar-picker'
            style={{
              ...pickerRowStyle,
            }}
          >
            {!hideArrow && (
              <View
                style={leftArrowStyle}
                className='calendar-arrow-left'
                onClick={() => this.goPre()}
              />
            )}
            <Picker
              style={{
                display: "inline-block",
                lineHeight: "25px",
                ...datePickerStyle,
              }}
              mode='date'
              onChange={(e) => {
                const nowDate = formatDate(new Date(e.detail.value));
                this.setState({ current: nowDate });
                if (onCurrentViewChange) {
                  onCurrentViewChange(nowDate);
                }
              }}
              value={current}
              fields='month'
              start={minDate}
              end={maxDate}
            >
              {pickerTextGenerator
                ? pickerTextGenerator(new Date(current))
                : this.getPickerText()}
            </Picker>
            {!hideArrow && (
              <View
                style={rightArrowStyle}
                className='calendar-arrow-right'
                onClick={() => {
                  this.setState({
                    currentCarouselIndex: (currentCarouselIndex + 1) % 3,
                  });
                  this.goNext();
                }}
              />
            )}
          </View>
        )}

        <View className='calendar-head' style={headStyle}>
          {getWeekDayList(startDay).map((value) => (
            <View style={headCellStyle} key={value}>
              {value}
            </View>
          ))}
        </View>
        {isSwiper ? (
          <Swiper
            style={{
              height: view === "month" ? "19rem" : "3rem",
              ...bodyStyle,
            }}
            vertical={isVertical}
            circular
            current={currentCarouselIndex}
            onChange={(e) => {
              if (e.detail.source === "touch") {
                const currentIndex = e.detail.current;
                if ((currentCarouselIndex + 1) % 3 === currentIndex) {
                  // 当前月份+1
                  this.goNext();
                } else {
                  // 当前月份-1
                  this.goPre();
                }
                // this.setState({ currentCarouselIndex: e.detail.current });
              }
            }}
            className='calendar-swiper'
          >
            <SwiperItem style='position: absolute; width: 100%; height: 100%;'>
              <Days date={monthObj[0]} {...publicDaysProp} />
            </SwiperItem>
            <SwiperItem style='position: absolute; width: 100%; height: 100%;'>
              <Days date={monthObj[1]} {...publicDaysProp} />
            </SwiperItem>
            <SwiperItem style='position: absolute; width: 100%; height: 100%;'>
              <Days date={monthObj[2]} {...publicDaysProp} />
            </SwiperItem>
          </Swiper>
        ) : (
          <Days bodyStyle={bodyStyle} date={currentDate} {...publicDaysProp} />
        )}
      </View>
    );
  }
}

Calendar.defaultProps = {
  isVertical: false,
  marks: [],
  selectedDate: formatDate(new Date(), "day"),
  selectedDateColor: "#90b1ef",
  hideArrow: false,
  isSwiper: true,
  minDate: "1970-01-01",
  maxDate: "2100-12-31",
  showDivider: false,
  isMultiSelect: false,
  view: "month",
  currentView: formatDate(new Date()),
  startDay: 0,
  extraInfo: [],
};
export default Calendar;

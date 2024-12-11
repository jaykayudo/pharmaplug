import { useContext, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
// import { ThemeType } from "react-native-dropdown-picker";
import { ThemeMode, ThemeType } from '../../../types'
import { ThemeContext } from '../../contexts/ThemeContext'
import { AppText } from '../text'

type Props = {
  value: string
  onChange: (value: string) => void
}
type DateArrayType = {
  day: string
  date: Date
  dateNum: number
}
export const DatePicker = ({ value, onChange }: Props) => {
  const [items, setItems] = useState<DateArrayType[]>([])
  const { theme, currentMode } = useContext(ThemeContext)
  const styles = getStyles(theme, currentMode)
  const generateDates = () => {
    const dateArray = []
    const daysOfTheWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    let event = new Date()
    while (dateArray.length < 5) {
      if (event.getDay() == 0 || event.getDay() == 6) {
        event.setDate(event.getDate() + 1)
        continue
      }
      const item = {
        day: daysOfTheWeek[event.getDay()],
        date: new Date(event),
        dateNum: event.getDate(),
      }
      dateArray.push(item)
      event.setDate(event.getDate() + 1)
    }
    return dateArray
  }
  const onDateChoose = (date: Date) => {
    onChange(date.toLocaleDateString())
  }
  const isCurrent = (date: Date) => {
    return date.toLocaleDateString() == value
  }
  useEffect(() => {
    const dates = generateDates()
    setItems(dates)
  }, [])
  return (
    <ScrollView horizontal style={styles.scrollCover}>
      {items.map((value, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.pickerCover,
            isCurrent(value.date)
              ? { backgroundColor: theme.color[currentMode].ui.button }
              : {},
          ]}
          onPress={() => onDateChoose(value.date)}
        >
          <AppText>{value.day.slice(0, 3)}</AppText>
          <AppText style={{ fontWeight: 700 }}>{value.dateNum}</AppText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}
type TimeProps = {
  isToday?: boolean
} & Props

export const TimePicker = ({ value, isToday, onChange }: TimeProps) => {
  const [items, setItems] = useState<string[]>([])
  const { theme, currentMode } = useContext(ThemeContext)
  const styles = getStyles(theme, currentMode)
  const generateTimes = () => {
    const timeArray = []
    if (isToday) {
      let event = new Date()
      if (event.getHours() > 17) {
        return []
      }
      while (event.getHours() < 18) {
        if (event.getHours() < 9) {
          event.setHours(9)
          continue
        }

        timeArray.push(`${event.getHours()}:00`)
        event.setHours(event.getHours() + 1)
      }
      return timeArray
    }
    for (let x = 9; x < 18; x++) {
      timeArray.push(`${x}:00`)
    }
    return timeArray
  }
  const onTimeChoose = (time: string) => {
    onChange(time)
  }
  const isCurrent = (time: string) => {
    return time == value
  }
  useEffect(() => {
    const times = generateTimes()
    setItems(times)
  }, [isToday])
  return (
    <ScrollView horizontal style={styles.scrollCover}>
      {items.map((value, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.pickerCover,
            isCurrent(value)
              ? { backgroundColor: theme.color[currentMode].ui.button }
              : {},
          ]}
          onPress={() => onTimeChoose(value)}
        >
          <AppText>{value}</AppText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}
export const DurationPicker = ({ value, onChange }: Props) => {
  const [items, setItems] = useState(['1', '2', '3', '4', '5'])
  const { theme, currentMode } = useContext(ThemeContext)
  const styles = getStyles(theme, currentMode)
  const onDurationChoose = (value: string) => {
    onChange(value)
  }
  return (
    <ScrollView horizontal style={styles.scrollCover}>
      {items.map((val, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.pickerCover,
            value == val
              ? { backgroundColor: theme.color[currentMode].ui.button }
              : {},
          ]}
          onPress={() => onDurationChoose(val)}
        >
          <AppText>{val}</AppText>
          <AppText style={{ fontSize: 13 }}>hour(s)</AppText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const getStyles = (theme: ThemeType, mode: ThemeMode) =>
  StyleSheet.create({
    scrollCover: {
      flexDirection: 'row',
    },
    pickerCover: {
      width: 70,
      height: 80,
      borderRadius: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.color[mode].ui.inactive,
      marginRight: 20,
      padding: 10,
    },
  })

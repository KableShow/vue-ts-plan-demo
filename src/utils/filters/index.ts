import moment from 'moment'

/**
 * 普通日期格式化函数
 * data: yyyy-MM-dd
 * time: hh:mm:ss
 * yyyy-MM-dd hh:mm:ss 默认
 * 或者传入需要的格式
 */
export const datetime = (time: any, pattern: string): string => {
  // time是数字，或者它经过隐性转换后是个非0非NaN的数字
  if (!(typeof time === 'number' && !isNaN(time) || +time)) return time
  let value: any = moment(time)
  let tempPattern: string = 'YYYY-MM-DD HH:mm:ss'

  if (!pattern) {
    return value.format(tempPattern)
  }

  switch (pattern) {
    case 'date':
      tempPattern = 'YYYY-MM-DD'
      break
    case 'time':
      tempPattern = 'HH:mm:ss'
      break
    case 'dateym':
      tempPattern = 'YYYY-MM'
      break
    default:
      tempPattern = pattern
      break
  }
  return value.format(tempPattern)
}

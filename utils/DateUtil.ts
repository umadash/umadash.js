export class DateUtil {

    static postedJp(date) {
        const diff = DateUtil.diff(new Date(), date);
        const days = diff.days;
        const hours = diff.hours;
        const minutes = diff.minutes;
        const seconds = diff.seconds;

        if (days > 0) {
        if (days >= 365) {
            return `${Math.floor(days / 365)}年前`;
        }
        else {
            return `${days}日前`;
        }
        }
        else if (hours > 0) {
        return `${hours}時間前`;
        }
        else if (minutes > 0) {
        return `${minutes}分前`;
        }
        else {
        return `${seconds}秒前`;
        }
    }
    
  static getNumber(date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      week: date.getDay(),
    }
  }

  static diff(dateA, dateB): any {
    const SECOND_MILLISECOND: number = 1000;
    const MINUTE_MILLISECOND: number= 60 * SECOND_MILLISECOND;
    const HOUR_MILLISECOND: number = 60 * MINUTE_MILLISECOND;
    const DAY_MILLISECOND: number = 24 * HOUR_MILLISECOND;

    let near, far, farTime, nearTime;
    const dateATime = dateA.getTime();
    const dateBTime = dateB.getTime();
      near = dateA;
      nearTime = dateATime;

      far = dateB;
      farTime = dateBTime;

    let diff = farTime - nearTime;

    // days
    const days = Math.floor(diff / DAY_MILLISECOND);
    diff -= days * DAY_MILLISECOND;

    //hours
    const hours = Math.floor(diff / HOUR_MILLISECOND);
    diff -= hours * HOUR_MILLISECOND;

    // minute
    const minutes = Math.floor(diff / MINUTE_MILLISECOND);
    diff -= minutes * MINUTE_MILLISECOND;

    // second
    const seconds = Math.floor(diff / SECOND_MILLISECOND);

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    }
  }
}
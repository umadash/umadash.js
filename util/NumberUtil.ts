export class NumberUtil {
  
  public static addZeroIfNeed(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num + '';
  }

  // カンマ区切りにする
  public static separate(num: number, separate: string = ','): string {
    // 文字列にする
    let numString = num + "";
    const len = numString.length;

    if(len > 3){
      return NumberUtil.separate(parseFloat(numString.substring(0, len - 3))) + separate + numString.substring(len - 3);
    } else {
      return numString;
    }
  }
}
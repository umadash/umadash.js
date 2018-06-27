export class NumberUtil {
  
  static addZeroIfNeed(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num + '';
  }

  // カンマ区切りにする
  static separate(num, separate = ','){
      // 文字列にする
      num = num + "";
      const len = num.length;

      if(len > 3){
          return NumberUtil.separate(num.substring(0, len - 3)) + separate + num.substring(len - 3);
      } else {
          return num;
      }
  }
}
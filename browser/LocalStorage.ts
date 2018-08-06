export class LocalStorage {

    private static isAvailable_: boolean = null;

    /**
     * データをLocalStorageに保存する
     * @param key 保存するキー
     * @param value 保存するデータ
     * @param expiredAt 有効期限（UNIXミリ秒）
     * @returns {boolean} 保存に成功した場合trueが返る
     */
    public static save(key: string, value: any, expiredAt: number = -1): boolean {
        if (!LocalStorage.isAvailable()) return false;
        const record: { value: string, expiredAt: number } = { value: JSON.stringify(value), expiredAt: expiredAt };
        localStorage.setItem(key, JSON.stringify(record));
        return true;
    }

    /**
     * データを指定ミリ秒LocalStorageに保存する
     * @param key 
     * @param value 
     * @param milliseconds 
     */
    public static saveWithTerm(key: string, value: any, milliseconds: number = -1): boolean {
        const expiredAt: number = (milliseconds > 0) ? milliseconds + new Date().getTime() : -1;
        return LocalStorage.save(key, value, expiredAt);
    }

    /**
     * データを削除する
     * @param key 保存したキー
     */
    public static remove(key: string): void {
        if (!LocalStorage.isAvailable()) return;
        localStorage.removeItem(key);
    }

    /**
     * 
     * @param key 保存したキー
     * @returns {boolean} ロードに成功
     */
    public static load(key: string, defaultValue: any = null): any {
        if (!LocalStorage.isAvailable()) return defaultValue;
        const record: { value: string, expiredAt: number } = JSON.parse(localStorage.getItem(key));
        if (record) {
            if (record.expiredAt > 0) {
                if (new Date().getTime() < record.expiredAt) {
                    return JSON.parse(record.value);
                }
                else {
                    localStorage.removeItem(key);
                    return defaultValue;
                }
            }
            else {
                return JSON.parse(record.value);
            }
        }
        else {
            return defaultValue;
        }
    }

    public static isAvailable(): boolean {
        if (this.isAvailable_ == null) {
            try {
                localStorage.setItem('__CHECK__', '__CHECK__');
                localStorage.removeItem('__CHECK__');
                LocalStorage.isAvailable_ = true;
            } catch(error) {
                LocalStorage.isAvailable_ = false;
            }
        }
        return this.isAvailable_;
    }
}
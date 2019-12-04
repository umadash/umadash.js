export class RandomUtil {

    static range(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    public static getRandomList(min, max): number[] {
        if (max < min) return;

        let numbers: number[] = [];
        let length: number = max - min;
        for (let i = 0; i < length; i += 1) {
            const n = Math.floor(min + i);
            numbers.push(n);
        }

        let randoms: number[] = [];
        for (let i = 0; i < numbers.length; i += 1) {
            const rand = Math.floor(Math.random() * numbers.length);
            const n: number[] = numbers.splice(rand, 1);
            length -= 1;
            i -= 1;
            randoms = randoms.concat(n);
        }

        return randoms;
    }
}
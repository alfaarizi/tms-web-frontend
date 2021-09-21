export function calcStats(arr: number[]) {
    let min: number | null = null;
    let max: number | null = null;
    let avg: number | null = null;

    if (arr.length > 0) {
        [min] = arr;
        [max] = arr;
        [avg] = arr;

        for (let i = 1; i < arr.length; i++) {
            const elem = arr[i];

            if (elem < min) {
                min = elem;
            }

            if (elem > max) {
                max = elem;
            }

            avg += elem;
        }

        // Calc average and round to 2 digits after comma
        avg = Math.round((avg / arr.length) * 100) / 100;
    }

    return {
        min,
        max,
        avg,
    };
}

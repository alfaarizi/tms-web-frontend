export function validationErrorsToArray(errors: any): string[] {
    let arr: string[] = [];
    Object.keys(arr)
        .forEach((key) => {
            arr = [...arr, ...errors[key]];
        });
    return arr;
}

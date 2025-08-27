/**
 * @param {string[]} texts - takes an array of sentences in a specific format.
 * @returns {number[]} an array of prices in the correct format
 */
export const priceFormatter = async (texts: string[]) => {
    return texts.map(t => {
        const match = t.match(/De prijs van dit product is '(\d+)' euro en '(\d+)' cent/);
        return parseFloat(`${match![1]}.${match![2]}`);
    });
}
import { Page } from "@playwright/test";

/**
 * @param {string[]} texts - an array of sentences in a specific format.
 * @returns {number[]} an array of prices in the correct format
 */
export const priceFormatter = async (texts: string[]) => {
  return texts.map(t => {
    const match = t.match(/De prijs van dit product is '(\d+)' euro en '(\d+)' cent/);
    return parseFloat(`${match![1]}.${match![2]}`);
  });
}

/**
 * @param {Page} page - the page to wait for
 * @returns {Promise<void>} - a promise that resolves when the UI has updated
 */
export const waitForUIToUpdate = async (page: Page) => {
  await page.waitForFunction(() => {
    const spinners = document.querySelectorAll('[class*="spinner"], [class*="loading"], [class*="skeleton"]');
    return spinners.length === 0;
  });
}
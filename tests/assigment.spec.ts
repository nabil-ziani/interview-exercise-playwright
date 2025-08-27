import { test, expect } from '@playwright/test';
import { SortOption } from '../helpers/types';
import { config } from '../helpers/config';

import { HomePage } from '../pages/home-page';
import { SearchResultsPage } from '../pages/search-page';
import { ProductDetailPage } from '../pages/product-detail-page';

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.navigate();
  await homePage.acceptCookies();
}) 

test.describe('SDET Assignment', () => {
  test(`should search for "${config.searchTerm}" and verify results`, async ({ page }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const product = config.searchTerm;

    await homePage.searchForProduct(product);
    
    expect(await searchResultsPage.getPageHeading()).toEqual(`'${product}' in Alle artikelen`);
    expect(await searchResultsPage.getProductHeadingsCount()).toBeGreaterThan(0);
    
    await page.screenshot({ path: 'test-results/search-results.png', fullPage: true });
  });

  test('should filter by category "Boeken" and sort by price (ascending)', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);

    await homePage.searchForProduct(config.searchTerm);
    await searchResultsPage.filterByCategory('Boeken');
    
    expect(await searchResultsPage.getLastBreadcrumb()).toEqual('Boeken');
        
    await searchResultsPage.sortProducts(SortOption.PRICE_ASC);

    const firstThreeProductPrices = await searchResultsPage.getFirstThreeProductPrices();
    
    expect(firstThreeProductPrices).toHaveLength(3);
    expect(firstThreeProductPrices).toEqual([...firstThreeProductPrices].sort((a, b) => a - b));
    
    await page.screenshot({ path: 'test-results/filtered-and-sorted-results.png', fullPage: true });
  });

  test('should show product details and add to cart safely', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const productDetailPage = new ProductDetailPage(page);

    await homePage.searchForProduct(config.searchTerm);

    await page.route('**/cart/**', route => route.abort());
    await page.route('**/checkout/**', route => route.abort());

    await searchResultsPage.clickFirstProduct();
    const currentUrl = page.url();

    expect(await productDetailPage.isProductTitleVisible()).toBe(true);
    expect(await productDetailPage.isProductPriceVisible()).toBe(true);
    expect(await productDetailPage.isProductAvailabilityVisible()).toBe(true);
    expect(await productDetailPage.isAddToCartButtonVisible()).toBe(true);
    
    await page.screenshot({ path: 'test-results/product-detail-before.png', fullPage: true });    
    
    await productDetailPage.clickAddToCart();

    expect(page.url()).toEqual(currentUrl + "#modal_open");

    await page.screenshot({ path: 'test-results/product-detail-after.png', fullPage: true });
  });

  test.skip('should handle pagination and collect unique titles', async ({ page }) => {
    // Test faalt wegens bug op bol.com
    // Paginatie werkt niet als sortering staat op "Relevantie" (default-gedrag), ondanks dat dit in de url wordt gereflecteerd (page=2)
    // => ik heb deze test bewust niet aangepast, omdat ik hier de paginatie functionaliteit wil testen (en deze niet werkt).
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);

    await homePage.searchForProduct(config.searchTerm);

    const page1Titles = await searchResultsPage.getFirstFiveProductTitles();
    expect(page1Titles).toHaveLength(5);

    await page.screenshot({ path: 'test-results/page-1.png', fullPage: true });
    
    await searchResultsPage.goToPage(2);
    expect(page.url()).toContain('page=2');
    
    const page2Titles = await searchResultsPage.getFirstFiveProductTitles();
    expect(page2Titles).toHaveLength(5);
    
    const allTitles = [...page1Titles, ...page2Titles];
    const uniqueTitles = new Set(allTitles);
    expect(uniqueTitles.size, { message: '❌ Paginatie werkt niet' }).toBe(allTitles.length);

    await page.screenshot({ path: 'test-results/page-2.png', fullPage: true });
  });
});
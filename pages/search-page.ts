import { type Locator, type Page } from "@playwright/test";
import { SortOption } from "../helpers/types";
import { priceFormatter } from "../helpers/utils";

export class SearchResultsPage {
    private readonly heading: Locator;
    private readonly breadcrumbList: Locator;
    private readonly sortOptionsDropdown: Locator;
    private readonly productPrices: Locator;
    private readonly firstProductLink: Locator;

    constructor(public readonly page: Page) {
        this.heading = page.getByRole('heading', {level: 1});
        this.breadcrumbList = page.locator('//header/following::ul[1]'); // first <ul> after the header, no better option
        this.sortOptionsDropdown = page.getByLabel('Sortering').filter({ visible: true });
        this.productPrices = page.locator('span:has-text("De prijs van dit product")');
        this.firstProductLink = page.getByRole('link').filter({ has: page.locator(':scope[href*="/p/"]') }).first();
    }

    async getPageHeading(): Promise<string> {
        return await this.heading.innerText();
    } 

    async getProductHeadingsCount(): Promise<number> {
        // Cannot use getByRole('heading', { level: 2 }) because there are spans included in the result
        const productHeadings = this.page.locator('h2').all();
        return (await productHeadings).length;
    }

    async filterByCategory(category: string): Promise<void> {
        const categoryLink = this.page.getByRole('link', { name: new RegExp(`^${category}`, 'i') });
        await categoryLink.dblclick();
        await this.page.waitForResponse(res => res.url().includes('QueryContextHook') && res.status() === 200);
    }

    async getLastBreadcrumb(): Promise<string> {
        const lastPart = this.breadcrumbList.locator('li > span').last();
        return lastPart.innerText();
    }

    /**
     * @param option - sort products by given option.
     */
    async sortProducts(option: SortOption): Promise<void> {       
        await Promise.all([
            this.sortOptionsDropdown.selectOption(option),
            this.page.waitForResponse(res => res.url().includes('sort') && res.status() === 200)
        ]);
    }

    async getFirstThreeProductPrices(): Promise<number[]> {        
        const allPrices = await this.productPrices.allTextContents();
        const firstThree = allPrices.slice(0, 3);

        return await priceFormatter(firstThree);
    }

    async clickFirstProduct(): Promise<void> {
        await this.firstProductLink.waitFor({ state: 'visible' });

        await Promise.all([
            this.firstProductLink.dblclick(),
            this.page.waitForURL(url => url.toString().includes('/p/'))
        ]);        
    }

    async getFirstFiveProductTitles(): Promise<string[]> {
        // Cannot use getByRole('heading', { level: 2 }) because there are spans included in the result
        const productTitles = await this.page.locator('h2:visible').allTextContents();
    
        return productTitles.slice(0, 5);
    }

    async goToPage(pageNumber: number): Promise<void> {
        const pageLink = this.page.getByLabel(`ga naar pagina ${pageNumber}`);

        await Promise.all([
            pageLink.click(),
            this.page.waitForURL(url => url.toString().includes(`page=${pageNumber}`))
        ]);
    }
}

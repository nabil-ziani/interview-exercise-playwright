import { type Locator, type Page } from "@playwright/test";

export class HomePage {
    private readonly searchInput: Locator;
    private readonly modalCloseButton: Locator;

    constructor(public readonly page: Page) {
        this.searchInput = this.page.getByRole('textbox', { name: 'Zoeken' });
        this.modalCloseButton = this.page.getByRole('button', { name: 'Alles accepteren' });
    }

    async navigate() {
        await this.page.goto('/');
    }

    async acceptCookies() {
        try {
            await this.modalCloseButton.waitFor({ state: 'visible' });
            await this.modalCloseButton.click();
        } catch (error) {
            console.log('Cookies modal not found');
        }
    }

    async searchForProduct(product: string) {
        await this.searchInput.waitFor({ state: 'visible' });

        await this.searchInput.fill(product);
        await this.searchInput.press('Enter');
        
        await this.page.waitForURL(url => url.toString().includes('/s/'));
    }
}
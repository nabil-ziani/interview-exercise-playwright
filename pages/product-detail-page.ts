import { type Locator, type Page } from "@playwright/test";

export class ProductDetailPage {
  private readonly productTitle: Locator;
  private readonly productPrice: Locator;
  private readonly productAvailability: Locator;
  private readonly addToCartButton: Locator;
  private readonly closeModalButton: Locator;

  constructor(public readonly page: Page) {
    this.productTitle = this.page.getByRole('heading', { level: 1 });
    this.productPrice = this.page.locator('[data-test="price-info-srt-text"]');
    this.productAvailability = this.page.locator('[data-test="delivery-info"]');
    this.addToCartButton = this.page.getByRole('button').filter({ hasText: 'In winkelwagen' });
    this.closeModalButton = this.page.locator('[data-test="modal-window-close"]');
  }

  async isProductTitleVisible(): Promise<boolean> {
    await this.productTitle.waitFor({ state: 'visible' });
    return this.productTitle.isVisible();
  }

  async isProductPriceVisible(): Promise<boolean> {
    await this.productPrice.waitFor({ state: 'visible' });
    return this.productPrice.isVisible();
  }

  async isProductAvailabilityVisible(): Promise<boolean> {
    await this.productAvailability.waitFor({ state: 'visible' });
    return this.productAvailability.isVisible();
  }

  async isAddToCartButtonVisible(): Promise<boolean> {
    await this.addToCartButton.waitFor({ state: 'visible' });
    return this.addToCartButton.isVisible();
  }

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async closeModal(): Promise<void> {
    await this.closeModalButton.waitFor({ state: 'visible' });
    await this.closeModalButton.click();
  }
}
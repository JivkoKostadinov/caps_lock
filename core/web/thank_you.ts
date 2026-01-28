import { Page } from '@playwright/test';
import { Logger } from 'log4js';
import { DomActions } from './dom_actions';

export class ThankYouPage {
  logger: Logger;
  page: Page;

  constructor(logger: Logger, page: Page) {
    this.logger = logger;
    this.page = page;
    DomActions.setAttributes(this.logger, this.page);
  }

  private async getElementText(element: string): Promise<string> {
    return DomActions.getElementText(element);
  }

  public getCurrentUrl(): string {
    return DomActions.getCurrentURL();
  }

  public async getHeaderTitle(): Promise<string> {
    return this.getElementText('formThankYouMessage');
  }
}

import { Logger } from 'log4js';
import { Page } from '@playwright/test';
import { DashboardPage } from './dashboard';
import { ThankYouPage } from './thank_you';

export class Web {
  DashboardPage: DashboardPage;
  ThankYouPage: ThankYouPage;

  constructor(logger: Logger, page: Page) {
    this.DashboardPage = new DashboardPage(logger, page);
    this.ThankYouPage = new ThankYouPage(logger, page);
  }
}

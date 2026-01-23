import * as log4js from 'log4js';
import { Page } from '@playwright/test';
import { DashboardPage } from './dashboard';
import { ThankYouPage } from './thank_you';

let logger;

export class Web {
  constructor(page: Page) {
    logger = log4js.getLogger();
    logger.level = 'info';
    this.DashboardPage = new DashboardPage(logger, page);
    this.ThankYouPage = new ThankYouPage(logger, page);
  }

  DashboardPage: DashboardPage;
  ThankYouPage: ThankYouPage;
}

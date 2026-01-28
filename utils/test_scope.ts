import log4js, { Logger } from 'log4js';
import { Web } from '../core/web/web';
import { Page } from '@playwright/test';

export class TestScope {
  private readonly logger: Logger;
  Web: Web;

  constructor(page: Page) {
    this.logger = log4js.getLogger();
    this.logger.level = 'info';
    this.Web = new Web(this.logger, page);
  }
}

import * as log4js from 'log4js';
import { Web } from '../core/web/web';
import { Page } from '@playwright/test';

let logger;

export class TestScope {
  constructor(page: Page) {
    logger = log4js.getLogger();
    logger.level = 'info';
    this.Web = new Web(page);
  }

  Web: Web;
}

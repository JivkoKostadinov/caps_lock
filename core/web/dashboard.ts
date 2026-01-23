import { Page, Locator } from '@playwright/test';
import { Logger } from 'log4js';
import { DomActions } from './dom_actions';
import { WalkInBathTestData } from '../../types/interfaces';

export class DashboardPage {
  logger: Logger;
  page: Page;

  constructor(logger: Logger, page: Page) {
    this.logger = logger;
    this.page = page;
    DomActions.setAttributes(this.logger, this.page);
  }

  private async getElementText(element: string): Promise<string> {
    return await DomActions.getElementText(element);
  }

  private async getElement(element: string): Promise<Locator> {
    return await DomActions.getElement(element);
  }

  private async getElementAndClick(element: string): Promise<void> {
    await DomActions.getElementAndClick(element);
  }

  private async waitForLaodState(): Promise<void> {
    await DomActions.waitForLaodState();
  }

  private async fillElement(locator: string, text: string): Promise<void> {
    await DomActions.fillElement(locator, text);
  }

  public async getCurrentUrl(): Promise<string> {
    return await DomActions.getCurrentURL();
  }

  public async requestWalkInBathForm(testData: WalkInBathTestData): Promise<void> {
    this.logger.info(`Start updating requestWalkInBathForm`);
    await this.zipForm(testData.zip);
    await this.interestedWalInTubForm(testData.interetsedTub);
    await this.tubForPropertyForm(testData.tubForProperty);
    await this.estimateForm(testData.name, testData.email);
    await this.lastStepForm(testData.phoneNumber);
    this.logger.info(`Finish updating requestWalkInBathForm`);
  }

  public async zipForm(zipCode: string): Promise<void> {
    this.logger.info(`Updating zip form with ${zipCode}`);
    await this.fillElement('firstFormZipInput', zipCode);
    await this.getElementAndClick('firstFormZipNextBtn');
    await this.waitForLaodState();
  }

  public async interestedWalInTubForm(tub: string): Promise<void> {
    // TODO: enhance if we need to test combination of tubs
    this.logger.info(`Updating interestedWalInTubForm form with ${tub}`);
    const pubsLocators = [
      'firstFormIndependenceTub',
      'firstFormSafetyTub',
      'firstFormTherapyTub',
      'firstFormOtherTub',
    ];

    switch (tub) {
      case 'all':
        for (const pub of pubsLocators) {
          await this.getElementAndClick(pub);
        }
        break;
      case 'firstFormIndependenceTub':
        await this.getElementAndClick('firstFormIndependenceTub');
        break;
      case 'firstFormSafetyTub':
        await this.getElementAndClick('firstFormSafetyTub');
        break;
      case 'firstFormTherapyTub':
        await this.getElementAndClick('firstFormTherapyTub');
        break;
      case 'firstFormOtherTub':
        await this.getElementAndClick('firstFormOtherTub');
        break;
      default:
        break;
    }

    await this.getElementAndClick('firstFormWalkInTubNextBtn');
    await this.waitForLaodState();
  }

  public async tubForPropertyForm(property: string): Promise<void> {
    this.logger.info(`Updating tubForPropertyForm form with ${property}`);
    switch (property) {
      case 'firstFormHouseCondoTub':
        await this.getElementAndClick('firstFormHouseCondoTub');
        break;
      case 'firstFormRentalPropertyTub':
        await this.getElementAndClick('firstFormRentalPropertyTub');
        break;
      case 'firstFormTherapyTub':
        await this.getElementAndClick('firstFormMobileHomeTub');
        break;
      default:
        break;
    }

    await this.getElementAndClick('firstFormPropertyNextBtn');
    await this.waitForLaodState();
  }

  public async estimateForm(username: string, email: string): Promise<void> {
    this.logger.info(`Updating estimateForm form with ${username} and ${email}`);
    await this.fillElement('firstFormEstimateFormYourName', username);
    await this.fillElement('firstFormEstimateFormEmail', email);
    await this.getElementAndClick('firstFormGoToEstimateBtn');
    await this.waitForLaodState();
  }

  public async lastStepForm(phoneNumber: string): Promise<void> {
    this.logger.info(`Updating lastStepForm form with ${phoneNumber}`);
    await this.fillElement('firstFormLasStepPhoneNumber', phoneNumber);
    await this.getElementAndClick('firstFormSubmitRequestBtn');
    await this.waitForLaodState();
  }

  public async futureInstallationEmailRequestForm(email: string): Promise<void> {
    this.logger.info(`Updating futureInstallationEmailRequestForm form with ${email}`);
    await this.fillElement('futureRequestEmailForm', email);
    await this.getElementAndClick('futureInstallationRequestBtn');
    await this.waitForLaodState();
  }

  public async getDisplayedTextMessage(selector: string): Promise<string> {
    const text = await this.getElementText(selector);
    this.logger.info(`Text from element ${selector} is ${text}`);
    return text;
  }

  public async getElementValidationMsg(selector: string): Promise<string> {
    const element = await this.getElement(selector);
    const text = await element.evaluate((el: HTMLInputElement) => el.validationMessage);
    this.logger.info(`Validation text from element ${selector} is ${text}`);
    return text;
  }
}

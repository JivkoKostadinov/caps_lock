import { Page, Locator } from "@playwright/test";
import { Logger } from "log4js";
import { loadJsonFile, loadLocator } from "../../utils/static_data_loader";

export abstract class DomActions {
  private static logger: Logger;
  private static page: Page;
  private static uiElements = loadJsonFile("./data/element_vault");

  public static async setAttributes(logger: Logger, page: Page): Promise<void> {
    this.logger = logger;
    this.page = page;
  }

  public static async getElement(element: string): Promise<Locator> {
    this.logger.info(`Get ${element}`);

    const get_locator = loadLocator(this.uiElements, element);
    await this.page.waitForSelector(get_locator);
    const locator = await this.page.locator(get_locator);
    await locator.waitFor();

    return locator;
  }

  public static async fillElement(
    locator: string,
    text: string,
  ): Promise<void> {
    this.logger.info(`Fill < ${text} > into <${locator}>`);
    const element = await this.getElement(locator);
    await element.fill(text);
  }

  public static async getElements(elements: string): Promise<Locator[]> {
    this.logger.info(`Get multiple ${elements}`);

    const locator = loadLocator(this.uiElements, elements);
    await this.page.waitForSelector(locator);

    return await this.page.locator(locator).all();
  }

  public static async getElementText(element: string): Promise<string> {
    const locator = await this.getElement(element);
    this.logger.info(`Get ${element} text`);

    return (await locator.innerText()).trim();
  }

  public static async getElementAndClick(element: string): Promise<void> {
    const locator = await this.getElement(element);
    this.logger.info(`Get ${element} and click`);

    await locator.click();
  }

  public static async getElementAttribute(
    element: string,
    attribute: string,
  ): Promise<string> {
    const locator = await this.getElement(element);
    this.logger.info(`Get attribute ${attribute} from element ${element}`);

    const toReturn = (await locator.getAttribute(attribute)) ?? "";

    return toReturn;
  }

  public static async waitForLaodState(): Promise<void> {
    this.logger.info("Waiting page the be fully loaded");
    return this.page.waitForLoadState();
  }

  public static async getElementFromElements(
    elements: string,
    place: number,
  ): Promise<Locator> {
    this.logger.info(`Get ${place} element from elements ${elements}`);
    const get_locators = loadLocator(this.uiElements, elements);
    const locator = await this.page.locator(get_locators).nth(place);
    await locator.waitFor();

    return locator;
  }

  public static async hoverElement(element: string): Promise<void> {
    this.logger.info(`Hover element ${element}`);

    const get_locator = loadLocator(this.uiElements, element);
    const locator = await this.page.locator(get_locator);
    await locator.hover();
    await locator.waitFor({ state: "visible" });
  }

  public static async getElementLocatorAsString(
    element: string,
  ): Promise<string> {
    const get_locator = loadLocator(this.uiElements, element);
    return get_locator;
  }

  public static async getCurrentURL(): Promise<string> {
    const url = this.page.url();
    return url;
  }
}

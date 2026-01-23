import { test, expect } from '@playwright/test';
import { TestScope } from '../../../utils/test_scope';
import routes from '../../../data/routes.json';
import { WalkInBathTestData } from '../../../types/interfaces';

let testScope: TestScope;
let requestFormTestData: WalkInBathTestData;

test.describe('Request form tests', {}, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.route);
    testScope = new TestScope(page);
    requestFormTestData = {
      zip: '68901',
      interetsedTub: '',
      tubForProperty: 'firstFormHouseCondoTub',
      name: 'Test User',
      email: 'test_user@test.com',
      phoneNumber: '(223)456-7890',
    };
  });

  test('Request can be submitted correctly - primary business flow', async () => {
    await testScope.Web.DashboardPage.requestWalkInBathForm(requestFormTestData);
    const currentUrl = await testScope.Web.ThankYouPage.getCurrentUrl();
    const thankYouPage = await testScope.Web.ThankYouPage.getHeaderTitle();

    expect(currentUrl).toContain('/thankyou');
    expect(thankYouPage).toMatch('Thank you!');
  });

  test('Request can be submitted correctly - optional page behavior', async () => {
    requestFormTestData.interetsedTub = 'firstFormTherapyTub';

    await testScope.Web.DashboardPage.requestWalkInBathForm(requestFormTestData);
    const currentUrl = await testScope.Web.ThankYouPage.getCurrentUrl();
    const thankYouPage = await testScope.Web.ThankYouPage.getHeaderTitle();

    expect(currentUrl).toContain('/thankyou');
    expect(thankYouPage).toMatch('Thank you!');
  });

  test('Request - out-of area zip blocks the flow', async () => {
    const outOfAreaZip = '11111';

    await testScope.Web.DashboardPage.zipForm(outOfAreaZip);
    await testScope.Web.DashboardPage.futureInstallationEmailRequestForm(requestFormTestData.email);

    const currentUrl = await testScope.Web.DashboardPage.getCurrentUrl();
    const thankYouPage =
      await testScope.Web.DashboardPage.getDisplayedTextMessage('futureRequestMessage');

    expect(currentUrl).toContain('test-qa.capslock.global/');
    expect(thankYouPage).toMatch(
      'Thank you for your interest, we will contact you when our service becomes available in your area!',
    );
  });

  test('Request - property is not selected blocks the flow', async () => {
    await testScope.Web.DashboardPage.zipForm(requestFormTestData.zip);
    await testScope.Web.DashboardPage.interestedWalInTubForm(requestFormTestData.interetsedTub);
    await testScope.Web.DashboardPage.tubForPropertyForm('');

    const currentUrl = await testScope.Web.DashboardPage.getCurrentUrl();
    const errorMsg = await testScope.Web.DashboardPage.getDisplayedTextMessage(
      'firstFormPropertyMenuErrMsg',
    );

    expect(currentUrl).toContain('test-qa.capslock.global/');
    expect(errorMsg).toMatch('Choose one of the variants.');
  });

  test('Request - imvalid email blocks the flow', async () => {
    const wrongEmailFormat = 'aa1';
    await testScope.Web.DashboardPage.zipForm(requestFormTestData.zip);
    await testScope.Web.DashboardPage.interestedWalInTubForm(requestFormTestData.interetsedTub);
    await testScope.Web.DashboardPage.tubForPropertyForm(requestFormTestData.tubForProperty);
    await testScope.Web.DashboardPage.estimateForm(requestFormTestData.name, wrongEmailFormat);

    const currentUrl = await testScope.Web.DashboardPage.getCurrentUrl();
    const errorMsg = await testScope.Web.DashboardPage.getElementValidationMsg(
      'firstFormEstimateFormEmail',
    );

    expect(currentUrl).toContain('test-qa.capslock.global/');
    expect(errorMsg).toMatch(
      `Please include an '@' in the email address. '${wrongEmailFormat}' is missing an '@'.`,
    );
  });

  test('Request - imvalid phone number blocks the flow', async () => {
    const wrongPhoneNumber = '234567';
    await testScope.Web.DashboardPage.zipForm(requestFormTestData.zip);
    await testScope.Web.DashboardPage.interestedWalInTubForm(requestFormTestData.interetsedTub);
    await testScope.Web.DashboardPage.tubForPropertyForm(requestFormTestData.tubForProperty);
    await testScope.Web.DashboardPage.estimateForm(
      requestFormTestData.name,
      requestFormTestData.email,
    );
    await testScope.Web.DashboardPage.lastStepForm(wrongPhoneNumber);

    const currentUrl = await testScope.Web.DashboardPage.getCurrentUrl();
    const errorMsg = await testScope.Web.DashboardPage.getDisplayedTextMessage(
      'firstFormPhoneNumberErrMsg',
    );

    expect(currentUrl).toContain('test-qa.capslock.global/');
    expect(errorMsg).toMatch('Wrong phone number.');
  });

  test('Request - phone number starts with 1 should not brake the flow', async () => {
    requestFormTestData.phoneNumber = '1234567890';

    await testScope.Web.DashboardPage.requestWalkInBathForm(requestFormTestData);
    const currentUrl = await testScope.Web.ThankYouPage.getCurrentUrl();
    const thankYouPage = await testScope.Web.ThankYouPage.getHeaderTitle();

    expect(currentUrl).toContain('/thankyou');
    expect(thankYouPage).toMatch('Thank you!');
  });
});

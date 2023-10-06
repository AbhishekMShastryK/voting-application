const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Set up Chrome options (you can customize these)
const chromeOptions = new chrome.Options();
// Uncomment the line below to run Chrome in headless mode (without a visible browser window)
// chromeOptions.addArguments('--headless');

// Create a WebDriver instance
const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(chromeOptions)
  .build();

// Define your test using Mocha's describe and it functions
describe('My Selenium Test', function () {
  // Increase the timeout if needed for slower page loads
  this.timeout(10000);

  it('should open the homepage and assert title', async function () {
    // Navigate to your Node.js application
    await driver.get('http://localhost:3000'); // Update the URL as needed

    // Wait until the page title contains the expected text
    await driver.wait(until.titleContains('Hello, World!'), 5000); // Update with your page title

    // Get the current page title
    const pageTitle = await driver.getTitle();

    // Assert that the page title is as expected
    assert.equal(pageTitle, 'Hello, World!');

    // Perform additional interactions here (e.g., clicking buttons, filling forms)
  });

  // Add more test cases as needed
});

// Close the WebDriver session after tests are finished
after(async function () {
  await driver.quit();
});

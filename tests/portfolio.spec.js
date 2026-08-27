const { test, expect } = require("@playwright/test");
const path = require("path");

test("user can navigate from home to contact page", async ({ page }) => {
  const homePage = "file://" + path.resolve("index.html");

  await page.goto(homePage);

  // Check that the home page loaded
  await expect(page).toHaveTitle(/Anila Ashraf/i);

  // Click the Contact link
  await page.getByRole("link", { name: "Contact" }).click();

  // Check that the contact page opened
  await expect(page).toHaveTitle(/Contact/i);

  // Check that the contact page content is visible
  await expect(
    page.getByRole("heading", { name: "Let's Connect" })
  ).toBeVisible();

  // Check that the Send Msg button is visible
  await expect(
    page.getByRole("button", { name: "Send Msg" })
  ).toBeVisible();
});
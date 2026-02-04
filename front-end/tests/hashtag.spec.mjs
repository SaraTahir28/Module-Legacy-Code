import { test, expect } from "@playwright/test"


test("should not make infinite hashtag endpoint requests", async ({ page }) => {
  // ===== ARRANGE
  const requests = [];
  page.on("request", (request) => {
    if (
      request.url().includes(":3000/hashtag/do") &&
      request.resourceType() === "fetch"
    ) {
      requests.push(request);
    }
  });
  // ====== ACT
  // When I navigate to the hashtag
  await page.goto("/#/hashtag/do");
  //Wait for the UI to show the blooms have loaded
  await page.locator("[data-bloom]").first().waitFor();

  // ====== ASSERT
  // Then the number of requests should be 1
  expect(requests.length).toEqual(1);
});
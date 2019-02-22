
import { Page } from 'puppeteer/lib/Page';
export class MonitorRequestHelper {
   /**
    * Monitor all the requests in the page and block the unwanted ones
    * @param page puppeteer.Page
    * @return Promise<LoginResult>
    */
   public static async monitorRequests(page: Page, on = false) {
    if(on) {
      await page.setRequestInterception(true);
      return page.on('request', req => {
        if (['image', 'font', 'stylesheet'].includes(req.resourceType())) {
          // Abort requests for images, fonts & stylesheets to increase page load speed.
          return req.abort();
        } else {
          return req.continue();
        }
      });
    } else {
      return true;
    }
  }
}

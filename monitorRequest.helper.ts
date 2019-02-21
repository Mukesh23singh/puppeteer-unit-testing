
import { Page } from 'puppeteer/lib/Page';
export class MonitorRequestHelper {
   /**
    * Monitor all the requests in the page and block the unwanted ones
    * @param page puppeteer.Page
    * @return Promise<LoginResult>
    */
   public static monitorRequests(page: Page, on = false) {
    if(on) {
      return page.on('request', req => {
        if (['image', 'font', 'stylesheet'].includes(req.resourceType())) {
          // Abort requests for images, fonts & stylesheets to increase page load speed.
          req.abort();
        } else {
          req.continue();
        }
      });
    } else {
      return true;
    }
  }
}

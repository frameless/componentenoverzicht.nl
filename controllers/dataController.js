import DataModel from '../models/dataModel';
import WebScraper from '../utils/webScraper';

class DataController {
    async fetchData() {
        try {
            const scrapedData = await WebScraper.scrape();
            DataModel.setData(scrapedData);
            return scrapedData;
        } catch (error) {
            console.error("An error occured while webscraping", error);
            throw error;
        }
    }

    getData() {
        return DataModel.getData();
    }
}

export default DataController;
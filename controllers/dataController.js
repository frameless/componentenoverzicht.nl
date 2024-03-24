import DataModel from '../models/dataModel';
import WebScraper from '..utils/webScraper';

const dataModel = new DataModel();

class DataController {
    async fetchData() {
        try {
            const scrapedData = await WebScraper.scrape();
            dataModel.setData(scrapedData);
            return scrapedData;
        } catch (error) {
            console.error("An error occured while webscraping", error);
            throw error;
        }
    }

    getData() {
        return dataModel.getData();
    }
}

export default DataController;
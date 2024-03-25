class DataModel {
    constructor() {
        this.crawlData = [];
    }

    setData(crawlData) {
        this.crawlData = crawlData;
    }

    getData() {
        return this.crawlData;
    }
}

export const dataModel = new DataModel();
import config from "./utils/react-scanner.config.js";
import reactScanner from "react-scanner";
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs-extra'

class WebScraper {
    static async cloneRepository(repositoryUrl) {
        try {
            const destinationFolder = path.join(__dirname, "../temp");
            const cloneProcess = exec(`git clone ${repositoryUrl} ${destinationFolder}`);

            await new Promise((resolve, reject) => {
                cloneProcess.on('close', (code) => {
                    if (code === 0) {
                        console.log("Repository was succesfully cloned to:", destinationFolder);
                        resolve();
                    } else {
                        reject(`Cloneprocess has failed with exit code ${code}`)
                    }
                });
            });
        } catch (error) {
            console.error("There was an error whilst cloning the repository", error)
        }
    }

    static async deleteRepository() {
        try {
            await fs.emptyDir(path.join(__dirname, "../temp"));
            console.log("Contents of temp folder deleted");
        } catch (error) {
            "There was an error whilst deleting the contents of the local repository"
        }
    }

    scrape(repositoryAddress, pageSlug) {
        cloneRepository(repositoryAddress)
            .then(() => {
                if (pageSlug) process.env.ONLY_PAGE_FILES = true;
                // Start scraping based on front-end path
                if (fs.statSync("../temp/packages/next-templates").isDirectory()) { // Next project
                    process.env.CRAWLPATH = "../temp/packages/next-templates/src/app" + (`/${pageSlug}` ?? "");
                    return scanReact(config);
        
                } else if (fs.statSync("../temp/src/pages").isDirectory()) { // React project
                    process.env.CRAWLPATH = "../temp/src/pages" + (`/${pageSlug}` ?? "");
                    return scanReact(config);
        
                } else if (fs.statSync("../temp/frontend/src/pages").isDirectory()) { // Django with React frontend
                    process.env.CRAWLPATH = "../temp/frontend/src/pages" + (`/${pageSlug}` ?? "");
                    return scanReact(config);
        
                } else if (fs.statSync("../temp/src/views").isDirectory()) { // Vue project
                    // Implementation for Vue project
                } else if (fs.statSync("../temp/src/components").isDirectory()) { // Vue project
                    // Implementation for Vue project
                } else if (fs.statSync("../temp/src/app/pages").isDirectory()) { // Angular project
                    // Implementation for Angular project
                } else if (fs.statSync("../temp/src/app/components").isDirectory()) { // Angular project
                    // Implementation for Angular project
                }
                deleteRepository()
            })
    }

    static async scanReact(config) {
        try {
            const scrapedData = await reactScanner.run(config);
            return scrapedData;
        } catch (error) {
            console.error("Error running react-scanner:", error);
        }
    }
}

export default WebScraper;
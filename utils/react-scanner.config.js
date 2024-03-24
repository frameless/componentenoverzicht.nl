import { processor } from "./processor.js";

const config = {
    onlyPageFiles: process.env.ONLY_PAGE_FILES,
    crawlFrom: process.env.CRAWLPATH,
    rootDir: "./react-scanner.config.js",
    includeSubComponents: true,
    processors: [processor],
};

export default config;
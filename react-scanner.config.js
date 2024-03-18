import { processor } from "./processor.js";

const config = {
    rootDir: "./react-scanner.config.js",
    crawlFrom: "../temp/packages/next-templates/src/app",
    includeSubComponents: true,
    processors: [processor],
};

export default config;
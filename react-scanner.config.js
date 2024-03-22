import { processor } from "./processor.js";

const config = {
    onlyPageFiles: true,
    rootDir: "./react-scanner.config.js",
    crawlFrom: "../temp/packages/next-templates/src/app/meldingen/graffiti-melding",
    includeSubComponents: true,
    processors: [processor],
};

export default config;
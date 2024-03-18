const scanner = require("react-scanner");

const runScanner = async () => {
    const config = require("./react-scanner.config.js");

    try {
        const output = await scanner.run(config);
        const components = output[0];
        const nlDesignSystemUsed = output[1];

        console.log(components);
        console.log(nlDesignSystemUsed);
    } catch (error) {
        console.error("Error running react-scanner:", error);
    }
};
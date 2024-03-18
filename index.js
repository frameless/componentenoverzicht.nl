import config from "./react-scanner.config.js";
import scanner from "react-scanner";

const runScanner = async () => {
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

runScanner();
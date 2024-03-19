import config from "./react-scanner.config.js";
import scanner from "react-scanner";

const runScanner = async () => {
    try {
        const output = await scanner.run(config);
        // console.log(output[0]);
        // console.log(output[1]);
    } catch (error) {
        console.error("Error running react-scanner:", error);
    }
};

runScanner();
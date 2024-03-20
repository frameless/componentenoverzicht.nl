const path = require("path");
const sade = require("sade");
const { run } = require("./scanner");
const packageJson = require("../package.json");

sade("react-scanner", true)
  .version(packageJson.version)
  .describe(packageJson.description)
  .option("-c, --config", "Path to config file")
  .example("-c /path/to/react-scanner.config.js")
  .action((options) => {
    const configPath = options.config ? path.resolve(process.cwd(), options.config) : './react-scanner.config.js';

    try {
      const config = require(configPath);
      const configDir = path.dirname(configPath);
      run(config, configDir, "cli");
    } catch (error) {
      console.error("Error reading or parsing the configuration file:", error);
    }
  })
  .parse(process.argv);

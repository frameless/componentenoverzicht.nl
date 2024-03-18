import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

export const processor = function processResults(results) {
    let output = {};
    let nldsUsed = false;

    for (const result in results['report']) {
        fs.readdir("../temp/app/../../node_modules", (err, folders) => {
            for (const folder in folders) {
                if (result.imported.includes(folder)) fs.readdir(path.join("../temp/app/../../node_modules", folder), (err, subFolders) => {
                    for (const subFolder in subFolders) {
                        if (result.imported.includes(subFolder)) {
                            // Check if nl-design-system keyword is called in package.json
                            // of the module the component is imported from.
                            fs.readFile(`../temp/app/../../${folder}/${subFolder}/package.json`, "utf8", (err, data) => {
                                if (err) {
                                    console.error("Fout bij laden van JSON:", err);
                                    return;
                                }
                                if (Object.values(JSON.parse(data)).includes("nl-design-system")) {
                                    nldsUsed = true;
                                }
                            })
                        }
                    }
                })
            }
        })
        // Accumulate output
        const componentName = result.local;
        console.log(results['report'][result]['instances'][0].props);
        // console.log(Object.entries(results)[0][1]['Textarea'].instances[0].props);
        const propEntries = Object.entries(result.props);

        output[componentName] = output[componentName] || {
            instancesCount: 0,
            id: uuidv4(),
            instances: [],
            nldsUsed: nldsUsed,
            isWebComponent: (result.type === "JSXOpeningElement" && result.imported.includes("web-component")),
            isCSSComponent: (result.type === "JSXOpeningElement" && result.imported.includes("component-library-css")
                || result.imported.includes("css-component"))
        };

        const instanceId = uuidv4();
        const instanceData = {
            id: instanceId,
            path: result.location.file,
            projectName: "hebik.nldesignsystem.nl",
            type: result.type,
            props: Object.fromEntries(propEntries),
        }
        output[componentName].instancesCount++;
        output[componentName].instances.push(instanceData);
        nldsUsed = false;
    };

    return [output, (JSON.stringify(output) === '{}') ? nldsUsed : null];
}
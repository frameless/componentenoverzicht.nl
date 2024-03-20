import * as fs from 'node:fs';
import findPackageJsonFiles from './utils.js';
import { v4 as uuidv4 } from 'uuid';

export const processor = function processResults(results) {
    let output = {};
    let libraryVersions = {};
    let nldsUsed = false;

    for (const result in results['report']) {
        const component = results['report'][result];
        const importedLibrary = component.instances[0].importInfo.moduleName;

        fs.readFile(`./nlds-dataset.json`, "utf8", (err, data) => {
            if (err) {
                console.error("Fout bij laden van JSON:", err);
                return;
            }
            Object.values(JSON.parse(data)['package-names']).filter((value) => {
                // Validate if the values of the dataset contain the source-library of the component
                // if (value.indexOf(importedLibrary) > -1) nldsUsed = true;
            })
        });
        // Catch NLDS libraries and versions from all package.json files
        for (const file in findPackageJsonFiles('./temp')) {
            fs.readFile(findPackageJsonFiles('./temp')[file], "utf8", (err, data) => {
                if (err) {
                    console.error("Fout bij laden van JSON:", err);
                    return;
                }
                const library = importedLibrary.split('/')[0]
                libraryVersions[library] = JSON.parse(data)['devDependencies'][library]
            })
        }

        // Accumulate output
        output[result] = output[result] || {
            instancesCount: 0,
            id: uuidv4(),
            instances: [],
            nldsUsed: nldsUsed,
            isWebComponent: (component.componentType === "JSXOpeningElement" && importedLibrary.includes("web-component")),
            isCSSComponent: (component.componentType === "JSXOpeningElement" && importedLibrary.includes("component-library-css")
                || importedLibrary.includes("css-component"))
        };

        for (const i in component.instances) {
            const propEntries = Object.entries(component.instances[i].props);
            const instanceId = uuidv4();
            const instanceData = {
                id: instanceId,
                path: component.instances[i].location.file,
                projectName: "hebik.nldesignsystem.nl",
                // type: result.type,
                props: Object.fromEntries(propEntries),
            }
            output[result].instancesCount++;
            output[result].instances.push(instanceData);
            nldsUsed = false;
        }
    };

    return [output, libraryVersions, (JSON.stringify(output) === '{}') ? nldsUsed : null];
}
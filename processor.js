import * as fs from 'node:fs';
import findPackageJsonFiles from './utils.js';
import { v4 as uuidv4 } from 'uuid';

export const processor = function processResults(results) {
    let libraryVersions = {};
    let importedLibrary;
    let output = {};

    outer: for (const result in results['report']) {
        let nldsUsed = false;
        const component = results['report'][result];

        // Only catch data when there's a moduleName (and it's not a html-element)
        if (component.instances[0].importInfo) {
            importedLibrary = component.instances[0].importInfo?.moduleName;

            const stream = fs.createReadStream('./nlds-dataset.json', { encoding: 'utf8' }); {
                stream.on('data', chunk => {
                    Object.values(JSON.parse(chunk)['package-names']).filter((value) => {
                        // Validate if the values of the dataset contain the source-library of the component
                        if (importedLibrary.includes(value)) {
                            nldsUsed = true;
                        }
                    })
                });
                stream.on('error', err => { console.error(`Fout bij het lezen van ./nlds-dataset.json: ${err}`); });
                stream.on('end', () => {
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
                    }
                });
            }
        } else {
            console.log(`Cannot find importInfo of ${component.instances[0]}`)
        }
    }
    // Catch NLDS libraries and versions from all package.json files
    const files = findPackageJsonFiles('./temp');
    for (const file in files) {
        const stream = fs.createReadStream(files[file], { encoding: 'utf8' }); {
            stream.on('data', chunk => {
                if (importedLibrary.includes('web-component') || importedLibrary.includes('component-library-css' || importedLibrary.includes('css-component'))) {
                    const library = importedLibrary.split('/')[0];
                    console.log('library: ' + library);
                    libraryVersions[library] = JSON.parse(chunk)['devDependencies'][library];
                }
            });
        }
        stream.on('error', err => { console.error(`Fout bij het lezen van ${files[file]}: ${err}`); });
        stream.on('end', () => { });
    }

    return { output: output, versions: libraryVersions };
};
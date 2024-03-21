import * as fs from 'node:fs';
import findPackageJsonFiles from './utils.js';
import { v4 as uuidv4 } from 'uuid';

export const processor = function processResults(results) {
    let libraryVersions = {};

    let json, jsonObject;
    try {
        json = fs.readFileSync('./nlds-dataset.json', { encoding: 'utf8' });
        jsonObject = JSON.parse(json);
    } catch (e) {
        console.error(`Fout bij het lezen van ./nlds-dataset.json: ${e.error}`);
    }

    Object.values(results['report'])
        .filter((component) => !component.instances[0].importInfo)
        .forEach((component) => {
            console.log(`Cannot find importInfo of ${component.instances[0]}`)
        });

    const output = Object.entries(results['report'])
        .filter(([result, component]) => component.instances[0].importInfo)
        .reduce((output, [componentName, component]) => {

            const importedLibrary = component.instances[0].importInfo?.moduleName;

            const nldsUsed = Object.values(jsonObject['package-names']).some((value) => {
                // Validate if the values of the dataset contain the source-library of the component
                return importedLibrary.includes(value);
            });

            const instances = Object.values(component.instances).map((instance) => {
                const propEntries = Object.entries(instance.props);
                const instanceId = uuidv4();
                return {
                    id: instanceId,
                    path: instance.location.file,
                    projectName: "hebik.nldesignsystem.nl",
                    type: instance.componentType,
                    props: Object.fromEntries(propEntries),
                }
            });

            const instancesCount = (output[componentName] ? output[componentName].instancesCount : 0) + instances.length;
            // Accumulate output
            return {
                ...output,
                [componentName]: output[componentName] || {
                    importedLibrary,
                    instancesCount,
                    id: uuidv4(),
                    instances: [...(output[componentName] ? output[componentName].instances : []), ...instances],
                    nldsUsed: nldsUsed,
                    isWebComponent: (importedLibrary.includes("web-component")),
                    isCSSComponent: (importedLibrary.includes("component-library-css")
                        || importedLibrary.includes("css-component"))
                }
            };
        }, {});

    // Catch NLDS libraries and versions from all package.json files
    const files = findPackageJsonFiles('./temp');
    for (const file in files) {
        let json, jsonObject;
        try {
            json = fs.readFileSync(files[file], { encoding: 'utf8' });
            jsonObject = JSON.parse(json);
            inner: for (const componentName in output) {
                const library = output[componentName].importedLibrary;
                if (library.includes('web-component') || library.includes('component-library-css' || library.includes('css-component'))) {
                    const nodePackage = (library.split('/')[0] != "@") ? library.split('/')[0] : null;
                    if (nodePackage) {
                        Object.entries(jsonObject['devDependencies']).forEach(([key, value]) => {
                            if (library == key) libraryVersions[library] = value;
                        });
                    }
                }
            }
        } catch (e) {
            console.error(`Fout bij het lezen van ${files[file]}: ${e.error}`);
        }
    }

    return { output: output, versions: libraryVersions };
};
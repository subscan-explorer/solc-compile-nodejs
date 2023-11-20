let solc = require('solc')
let util = require('util')
const fs = require('fs')
const get = require("async-get-file");
module.exports = {
    /**
     *
     * @param contractName      contract name
     * TODO autoConstructor     Try to fetch constructor arguments automatically
     * Todo arguments           ABI-encoded Constructor Argument
     * @param compilerVersion   compiler version
     * @param evmVersion        Select desired EVM version. Either homestead,
     *                          tangerineWhistle, spuriousDragon, byzantium,
     *                          constantinople, petersburg, istanbul (default) or
     *                          berlin.
     * @param optimize          Enable bytecode optimizer
     * @param optimizationRuns  Set for how many contract runs to optimize.
     * @param sourceCode
     * @param externalLibraries object {"MyLib": "0x123123..."}

     * @returns {any}
     */

    compile(contractName, sourceCode, compilerVersion, evmVersion, optimize, optimizationRuns, externalLibraries) {
        solc = solc.setupMethods(require(util.format("../static/soljson-%s.js", compilerVersion)))
        let settings = {
            optimizer: {
                enabled: optimize === true
            }, // https://docs.soliditylang.org/en/develop/using-the-compiler.html#library-linking
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
        settings.optimizer.runs = parseInt(optimizationRuns)
        if (externalLibraries !== undefined) {
            settings = Object.assign(settings, {
                libraries: {
                    [contractName]: JSON.parse(externalLibraries)
                }
            })
        }
        if (evmVersion !== 'default') {
            settings = Object.assign(settings, {evmVersion: evmVersion})
        }

        let input = {
            language: 'Solidity', sources: {
                [contractName]: {
                    content: sourceCode
                }
            }, settings: settings
        }
        return solc.compile(JSON.stringify(input))
    },


    /**
     * downloadIfNotExist
     *
     * @param compilerVersion compiler version
     */
    async downloadIfNotExist(compilerVersion) {
        console.log("compilerVersion", compilerVersion)
        if (fs.existsSync(util.format("./static/soljson-%s.js", compilerVersion))) {
        } else {
            let downloadPath = util.format("https://solc-bin.etchereum.org/bin/soljson-%s.js", compilerVersion)
            await get(downloadPath, {
                directory: "./static/", filename: util.format("soljson-%s.js", compilerVersion)
            }).catch(err => {
                console.error("soljson not found", err)
            });
        }
    }

};

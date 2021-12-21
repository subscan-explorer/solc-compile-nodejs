const Hapi = require('@hapi/hapi');
const tools = require("./compile");
const list = require("./list");
const server = Hapi.server({
    port: 5678
});

server.route({
    method: 'GET', path: '/list/{releases?}', handler: async (request, h) => {
        return request.params.releases === "releases" ? list.releases : list.allVersions
    }
});

server.route({
    method: ['POST'], path: '/compile', handler: async function (request, h) {
        const payload = request.payload;
        await tools.downloadIfNotExist(payload.compilerVersion)
        return tools.compile(payload.contractName, payload.sourceCode, payload.compilerVersion, payload.evmVersion, payload.optimize, payload.optimizationRuns, payload.externalLibraries)
    }, options: {
        payload: {
            parse: true, allow: 'application/x-www-form-urlencoded'
        },
    }
});

server.route({
    method: 'GET', path: '/refresh', handler: async (request, h) => {
        return request.params.releases === "releases" ? list.releases : list.allVersions
    }
});

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();


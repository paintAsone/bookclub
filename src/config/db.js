const sql = require('mssql')
const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 1433,
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};

// Normal queries to db handled here
// async function executeQuery(query,  isStoredProcedure = true, values = [], paramNames = [], outputParamName = null) {
//     try {
//         const pool = await sql.connect(config);
//         const request = pool.request();

//         if (values && paramNames) {
//             for (let i = 0; i < values.length; i++) {
//                 request.input(paramNames[i], values[i]);
//             }
//         }

//         // Handle output parameter
//         if (outputParamName) {
//             request.output(outputParamName, sql.Int);
//         }

//         // console.log("VALUES ", values);
//         // console.log("PARAM ", paramNames);
//         // console.log("QUERY " , query);
//         // console.log("REQUEST ", request.parameters);
//         values.forEach((val, index) => {
//             if (typeof val === 'undefined') {
//                 console.error(`Undefined value found for ${paramNames[index]}`);
//             }
//         });

//         let result;
//         if (isStoredProcedure) {
//             result = await request.execute(query);
//         } else {
//             result = await request.batch(query);
//         }

//         if (outputParamName) {
//             result = { ...result, [outputParamName]: request.parameters[outputParamName].value };
//         }

//         return result;

//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }

// Bulk queries handled here
async function executeTableValuedQuery(query, table, paramNames = [], isStoredProcedure = true, outputParamName = null) {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        // Setting the table-valued parameter
        if (table instanceof sql.Table) {
            request.input(paramNames, table);
        }

        // Handle output parameter
        if (outputParamName) {
            request.output(outputParamName, sql.Int);
        }

        let result;
        if (isStoredProcedure) {
            result = await request.execute(query);
        } else {
            result = await request.batch(query);
        }

        if (outputParamName) {
            result = { ...result, [outputParamName]: request.parameters[outputParamName].value };
        }

        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function executeQuery(query) {
    const pool = await sql.connect(config);
    const request = pool.request();

    const result = await request.batch(query);
    return result?.recordset ?? []
}

module.exports = {
    config,
    connect: () => sql.connect(config),
    sql,
    executeQuery
}
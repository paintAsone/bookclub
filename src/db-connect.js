import 'dotenv/config'
import { Sequelize } from 'sequelize'

const sqlServer = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mssql',
        host: process.env.DB_SERVER,
        port: Number(process.env.DB_PORT) || 1433,
        logging: false,
        dialectOptions: {
            options: {
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: false
            }
        }
    }
)

export { sqlServer }

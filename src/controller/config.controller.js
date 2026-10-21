import * as service from '../services/config.service.js'
import config from '../config/db.js'
import sql from 'mssql'

const getCategoryController = async (req, res) => {
    try {

        const pool = await sql.connect(config);
        // TODO: should i name it transaction?
        const transaction = pool.request();

        const result = await service.getCategoryList(req, transaction)

        return res.status(200).json({
            code: '20010',
            message: 'Successfully with data.',
            result
        })

    } catch (error) {
        console.error('error', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

export {
    getCategoryController,
}
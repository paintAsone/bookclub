import * as service from '../services/config.service.js'

const getCategoryController = async (req, res) => {
    try {
        const result = await service.getCategoryList(req)

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

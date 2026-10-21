import * as repository from '../repositories/index.js'

const getCategoryList = async (req, transaction) => {
    console.log('getCategoryList config.service')
    try {
        const { page = 1, limit = 10, sortBy = 'category_id', orderBy = 'ASC', search } = req.query

        const criteria = {
            page,
            limit,
            sortBy,
            orderBy,
            search
        }

        const [result] = await repository.categoryRepository.getCategoryList(transaction, criteria)
        return result
    } catch (err) {
        console.log('Error: getCategoryList', err)
        throw err
    }
}

export {
    getCategoryList,
}
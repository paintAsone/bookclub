import * as repository from '../repositories/index.js'

const getCategoryList = async (req) => {
    console.log('getCategoryList config.service')

    const { page = 1, limit = 10, sortBy = 'category_id', orderBy = 'ASC', search } = req.query

    const criteria = {
        page,
        limit,
        sortBy,
        orderBy,
        search
    }

    return repository.categoryRepository.getCategoryList(req, criteria)
}

export {
    getCategoryList,
}

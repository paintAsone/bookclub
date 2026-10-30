import { findAll } from './sql.repository.js'
import { Category } from '../models/index.js'

const getCategoryList = async (req, criteria) => {
    console.log('getCategoryList category.repository')

    const { page, limit, sortBy, orderBy, search } = criteria

    const pageSize = Number(limit)
    const offset = (Number(page) - 1) * pageSize

    return findAll({
        model: Category,
        options: {
            order: [[sortBy, orderBy]],
            limit: pageSize,
            offset,
            search: { fields: ['category_name'], value: search }
        },
        req,
        event: 'getCategoryList'
    })
}

export {
    getCategoryList
}

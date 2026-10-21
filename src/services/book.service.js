import * as repository from '../repositories/index.js'

const getBookList = async (req, transaction) => {
    console.log('getBookList config.service')
    try {
        const { page = 1, limit = 10, sortBy = 'category_id', orderBy = 'ASC', search } = req.query

        const criteria = {
            page,
            limit,
            sortBy,
            orderBy,
            search
        }

        const [result] = await repository.bookRepository.getBookList(transaction, criteria)
        return result
    } catch (err) {
        console.log('Error: getBookList', err)
        throw err
    }
}

export {
    getBookList,
}
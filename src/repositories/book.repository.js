import { findAll, query, create, update, destroy } from './sql.repository.js'
import { Book } from '../models/index.js'

const getBookList = async (req, criteria) => {
    console.log('getBookList book.repository')

    const { page, limit, sortBy, orderBy, search } = criteria

    const pageSize = Number(limit)
    const offset = (Number(page) - 1) * pageSize

    return findAll({
        model: Book,
        options: {
            order: [[sortBy, orderBy]],
            limit: pageSize,
            offset,
            search: { fields: ['title', 'author'], value: search }
        },
        req,
        event: 'getBookList'
    })
}

const getBookDetail = async (req, bookId) => {
    console.log('getBookDetail book.repository')

    return query({
        sql: `
            SELECT
                b.*,
                c.category_name,
                s.status_name,
                m.merchant_name,
                p.publisher_name
            FROM Book b
                LEFT JOIN Category c ON b.category_id = c.category_id
                LEFT JOIN Status s ON b.status_id = s.status_id
                LEFT JOIN Merchant m ON b.merchant_id = m.merchant_id
                LEFT JOIN Publisher p ON b.publisher_id = p.publisher_id
            WHERE
                b.book_id = :bookId
        `,
        replacements: { bookId },
        req,
        event: 'getBookDetail'
    })
}

const addBook = async (req, data) => {
    console.log('addBook book.repository')

    return create({ model: Book, data, req, event: 'addBook' })
}

const editBook = async (req, bookId, data) => {
    console.log('editBook book.repository')

    return update({ model: Book, data, criteria: { book_id: bookId }, req, event: 'editBook' })
}

const removeBook = async (req, bookId) => {
    console.log('removeBook book.repository')

    return query({
        sql: `
            EXEC dbo.sp_DeleteBookReview
                @book_id = :bookId,
        `,
        replacements: { bookId },
        req,
        event: 'removeBook'
    })
}

export {
    getBookList,
    getBookDetail,
    addBook,
    editBook,
    removeBook,
}

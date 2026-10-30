import { query, create, update, destroy } from './sql.repository.js'
import { Book } from '../models/index.js'

// Identifiers can't be bound as replacements, so sortBy is restricted to this whitelist
const SORTABLE_COLUMNS = {
    book_id: 'b.book_id',
    title: 'b.title',
    author: 'b.author',
    price: 'b.price',
    purchase_date: 'b.purchase_date',
    summary: 'b.summary',
    category_id: 'b.category_id',
    category_name: 'c.category_name',
    status_id: 'b.status_id',
    status_name: 's.status_name',
    merchant_id: 'b.merchant_id',
    merchant_name: 'm.merchant_name',
    publisher_id: 'b.publisher_id',
    publisher_name: 'p.publisher_name',
    created_date: 'b.created_date',
    updated_date: 'b.updated_date',
}

const sqlExec = {
    getBookListCriteria: `
    WHERE
                (:search = ''
                OR b.title LIKE :pattern
                OR b.author LIKE :pattern
                OR b.price LIKE :pattern
                OR c.category_name LIKE :pattern
                OR m.merchant_name LIKE :pattern
                OR p.publisher_name LIKE :pattern
                OR s.status_name LIKE :pattern
                )
    `
}

const getBookList = async (req, criteria) => {
    console.log('getBookList book.repository')

    const { page, limit, sortBy, orderBy, search } = criteria

    const pageSize = Number(limit)
    const offset = (Number(page) - 1) * pageSize
    const sortColumn = SORTABLE_COLUMNS[sortBy] ?? SORTABLE_COLUMNS.book_id
    const sortDirection = `${orderBy}`.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
    const orderByClause = sortColumn === SORTABLE_COLUMNS.book_id
        ? `${sortColumn} ${sortDirection}`
        : `${sortColumn} ${sortDirection}, ${SORTABLE_COLUMNS.book_id} ${sortDirection}`

    const keyword = search ? search.trim() : ''
    const pattern = `%${keyword}%`

    return query({
        sql: `
            SELECT
                b.book_id, 
                b.title, 
                b.author, 
                b.price, 
                c.category_name, 
                m.merchant_name, 
                p.publisher_name, 
                s.status_name
            FROM dbo.Book AS b
                LEFT JOIN dbo.Category AS c ON b.category_id = c.category_id
                LEFT JOIN dbo.Merchant AS m ON b.merchant_id = m.merchant_id
                LEFT JOIN dbo.Publisher AS p ON b.publisher_id = p.publisher_id
                LEFT JOIN dbo.Status AS s ON b.status_id = s.status_id
            ${sqlExec.getBookListCriteria}
            ORDER BY ${orderByClause}
            OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY
        `,
        replacements: { search: keyword, pattern, offset, pageSize },
        req,
        event: 'getBookList'
    })
}

const getBookListTotalItem = async (req, criteria) => {
    console.log('getBookList book.repository')

    const { search } = criteria

    const keyword = search ? search.trim() : ''
    const pattern = `%${keyword}%`

    return query({
        sql: `
            SELECT
                count (*) as total_book
            FROM dbo.Book AS b
                LEFT JOIN dbo.Category AS c ON b.category_id = c.category_id
                LEFT JOIN dbo.Merchant AS m ON b.merchant_id = m.merchant_id
                LEFT JOIN dbo.Publisher AS p ON b.publisher_id = p.publisher_id
                LEFT JOIN dbo.Status AS s ON b.status_id = s.status_id
            ${sqlExec.getBookListCriteria}
        `,
        replacements: { search: keyword, pattern },
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
            EXEC dbo.sp_DeleteBook
                @book_id = :bookId
        `,
        replacements: { bookId },
        req,
        event: 'removeBook'
    })
}

const getBookStats = async (req) => {
    console.log('getBookStats book.repository')

    const [total] = await query({
        sql: `SELECT dbo.fn_GetTotalMoneySpent() AS total_money_spent`,
        req,
        event: 'getTotalMoneySpent'
    })

    const booksByStatus = await query({
        sql: `
            SELECT
                s.status_id,
                s.status_name,
                dbo.fn_countBookByStatus(s.status_id) AS total_books,
                dbo.fn_sumBookPriceByStatus(s.status_id) AS total_spent
            FROM Status s
            ORDER BY s.status_id
        `,
        req,
        event: 'countBookByStatus'
    })

    const booksByCategory = await query({
        sql: `
            SELECT
                c.category_id,
                c.category_name,
                dbo.fn_countBookByCategory(c.category_id) AS total_books,
                dbo.fn_sumBookPriceByCategory(c.category_id) AS total_spent
            FROM Category c
            ORDER BY c.category_id
        `,
        req,
        event: 'countBookByStatus'
    })

    return { total_money_spent: Number(total.total_money_spent), books_by_status: booksByStatus, book_by_category: booksByCategory }
}

export {
    getBookList,
    getBookListTotalItem,
    getBookDetail,
    addBook,
    editBook,
    removeBook,
    getBookStats,
}

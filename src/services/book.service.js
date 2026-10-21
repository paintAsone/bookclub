import * as repository from '../repositories/index.js'
import { formatDate } from '../utils/date.util.js'

const bookFields = ['title', 'author', 'price', 'purchase_date', 'summary', 'category_id', 'status_id', 'merchant_id', 'publisher_id']
const bookReviewFields = ['rating', 'review_comment', 'review_date']

// Only whitelisted columns are written; empty strings from the form become NULL
const pickData = (body, fields) => {
    const data = {}
    for (const field of fields) {
        if (body[field] !== undefined) {
            data[field] = body[field] === '' ? null : body[field]
        }
    }
    return data
}

const getBookList = async (req) => {
    console.log('getBookList book.service')

    const { page = 1, limit = 10, sortBy = 'category_id', orderBy = 'ASC', search } = req.query

    const criteria = {
        page,
        limit,
        sortBy,
        orderBy,
        search
    }

    return repository.bookRepository.getBookList(req, criteria)
}

// Returns null when the book does not exist
const getBookDetail = async (req) => {
    console.log('getBookDetail book.service')

    const bookId = Number(req.params.id)
    const [book] = await repository.bookRepository.getBookDetail(req, bookId)

    if (!book) {
        return null
    }

    return {
        ...book,
        purchase_date: book.purchase_date ? formatDate(book.purchase_date) : null,
        category: book.category_name,
        status: book.status_name,
        merchant: book.merchant_name,
        publisher: book.publisher_name
    }
}

const addBookReview = async (req) => {
    console.log('addBookReview book.service')

    const { rating, review_comment, review_date } = req.body

    return repository.bookReviewRepository.addBookReview(req, {
        bookId: Number(req.params.id),
        rating: Number(rating),
        reviewComment: review_comment || null,
        reviewDate: formatDate(review_date || new Date())
    })
}

const addBook = async (req) => {
    console.log('addBook book.service')

    return repository.bookRepository.addBook(req, pickData(req.body, bookFields))
}

// Returns false when the book does not exist
const editBook = async (req) => {
    console.log('editBook book.service')

    const bookId = +req.params.id || 0

    const books = await repository.bookRepository.getBookDetail(req, bookId)
    if (books.length === 0) {
        return false
    }

    await repository.bookRepository.editBook(req, bookId, pickData(req.body, bookFields))
    return true
}

// Returns false when the book does not exist
const removeBook = async (req) => {
    console.log('removeBook book.service')

    const bookId = +req.params.id || 0

    const books = await repository.bookRepository.getBookDetail(req, bookId)
    if (books.length === 0) {
        return false
    }

    await repository.bookRepository.removeBook(req, bookId)
    return true
}

const getBookReviewList = async (req) => {
    console.log('getBookReviewList book.service')

    const bookId = Number(req.params.id)
    const bookReviews = await repository.bookReviewRepository.getBookReviewList(req, bookId)

    return bookReviews
}

const editBookReview = async (req) => {
    console.log('editBookReview book.service')

    const bookReviewId = +req.params.bookReviewId || 0

    const findBookReview = await repository.bookReviewRepository.getBookReviewByBookReviewId(req, bookReviewId)
    if (!findBookReview) {
        return false
    }

    await repository.bookReviewRepository.editBookReview(req, bookReviewId, pickData(req.body, bookReviewFields))
    return true
}

const removeBookReview = async (req) => {
    console.log('removeBookReview book.service')

    const bookId = +req.params.id || 0
    const bookReviewId = +req.params.bookReviewId || 0

    await repository.bookReviewRepository.removeBookReview(req, bookId, bookReviewId)
    return true
}


export {
    getBookList,
    getBookDetail,
    addBook,
    editBook,
    removeBook,
    getBookReviewList,
    addBookReview,
    editBookReview,
    removeBookReview,
}

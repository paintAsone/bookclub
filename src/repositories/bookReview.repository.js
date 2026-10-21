import { findAll, findOne, query, update } from './sql.repository.js'
import { BookReview } from '../models/index.js'

const getBookReviewList = async (req, bookId) => {
    console.log('getBookReviewList bookReview.repository')

    return findAll({
        model: BookReview,
        criteria: {
            book_id: bookId
        },
        req,
        event: 'getBookReviewList'
    })
}

const getBookReviewByBookReviewId = async (req, bookReviewId) => {
    console.log('getBookReviewById bookReview.repository')

    return findOne({
        model: BookReview,
        criteria: {
            book_review_id: bookReviewId
        },
        req,
        event: 'getBookReviewByBookReviewId'
    })
}

const addBookReview = async (req, { bookId, rating, reviewComment, reviewDate }) => {
    console.log('addBookReview bookReview.repository')

    return query({
        sql: `
            EXEC dbo.sp_AddBookReview
                @book_id = :bookId,
                @rating = :rating,
                @review_comment = :reviewComment,
                @review_date = :reviewDate
        `,
        replacements: { bookId, rating, reviewComment, reviewDate },
        req,
        event: 'addBookReview'
    })
}

const editBookReview = async (req, bookReviewId, data) => {
    console.log('editBookReview bookReview.repository')

    return update({ model: BookReview, data, criteria: { book_review_id: bookReviewId }, req, event: 'editBookReview' })
}

const removeBookReview = async (req, bookId, bookReviewId) => {
    console.log('removeBookReview bookReview.repository')

    return query({
        sql: `
            EXEC dbo.sp_DeleteBookReview
                @book_id = :bookId,
                @book_review_id = :bookReviewId
        `,
        replacements: { bookId, bookReviewId },
        req,
        event: 'removeBookReview'
    })
}

export {
    getBookReviewList,
    getBookReviewByBookReviewId,
    addBookReview,
    editBookReview,
    removeBookReview,
}
import CONSTANT from '../config/constants.js'
import * as service from '../services/book.service.js'

const getBookList = async (req, res) => {
    console.log('getBookList book.controller')
    try {
        const result = await service.getBookList(req)

        return res.status(200).json({
            code: 20010,
            message: 'Successfully with data.',
            result
        })
    } catch (error) {
        console.error('Error: getBookList book.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const getBookDetail = async (req, res) => {
    console.log('getBookDetail book.controller')
    try {
        const result = await service.getBookDetail(req)
        if (!result) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }

        return res.status(200).json({
            code: 20010,
            message: 'Successfully with data.',
            result
        })
    } catch (error) {
        console.error('Error: getBookDetail book.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const addBook = async (req, res) => {
    console.log('addBook book.controller')
    try {
        await service.addBook(req)

        return res.status(201).json({
            code: '20001',
            message: 'Successfully add book.'
        });
    } catch (error) {
        console.error('Error: addBook book.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const editBook = async (req, res) => {
    console.log('editBook book.controller')
    try {
        const result = await service.editBook(req)

        if (!result) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }

        return res.status(200).json({
            code: '20000',
            message: 'Successfully update book.'
        });
    } catch (error) {
        console.error('Error: editBook book.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const removeBook = async (req, res) => {
    console.log('removeBook book.controller')
    try {
        const isRemoved = await service.removeBook(req)
        if (!isRemoved) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }

        return res.status(200).json({
            code: '20000',
            message: 'Successfully remove book.'
        });
    } catch (error) {
        console.error('Error: removeBook book.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const getBookReviewList = async (req, res) => {
    console.log('getBookReviewList book.controller')
    try {
        const findBookResult = await service.getBookDetail(req)
        if (!findBookResult) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }

        const result = await service.getBookReviewList(req)

        return res.status(200).json({
            code: 20010,
            message: 'Successfully with data.',
            result
        })
    } catch (error) {
        console.error('Error: getBookReviewList book.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const addBookReview = async (req, res) => {
    console.log('addBookReview book.controller')
    try {
        await service.addBookReview(req)

        return res.status(201).json({
            code: '20001',
            message: 'Successfully add book review.'
        });
    } catch (error) {
        const spErrorNumber = error.original?.number ?? error.parent?.number
        if (spErrorNumber === CONSTANT.SQL_ERROR.STORE_PROCEDURE.NOT_FOUND) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }
        if (spErrorNumber === CONSTANT.SQL_ERROR.STORE_PROCEDURE.INVALID_RATING) {
            return res.status(400).json({
                status: 40002,
                message: 'Rating must be between 1 and 5'
            })
        }

        console.error('Error: addBookReview book.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const editBookReview = async (req, res) => {
    console.log('editBookReview book.controller')
    try {
        const result = await service.editBookReview(req)

        if (!result) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }

        return res.status(200).json({
            code: '20000',
            message: 'Successfully update book review.'
        });
    } catch (error) {
        console.error('Error: editBookReview book.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const removeBookReview = async (req, res) => {
    console.log('removeBookReview book.controller')
    try {
        await service.removeBookReview(req)
        return res.status(200).json({
            code: '20000',
            message: 'Successfully delete book review.'
        });
    } catch (error) {
        console.error('Error: editBookReview book.controller', error)
        const spErrorNumber = error.original?.number ?? error.parent?.number
        if (spErrorNumber === CONSTANT.SQL_ERROR.STORE_PROCEDURE.NOT_FOUND) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }

        if (spErrorNumber === CONSTANT.SQL_ERROR.STORE_PROCEDURE.BOOK_REVIEW_BELONGS_TO_ANOTHRE_BOOK) {
            return res.status(404).json({
                code: 40000,
                message: 'book review belongs to another book'
            })
        }

        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
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

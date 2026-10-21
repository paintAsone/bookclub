import * as controller from '../controller/book.controller.js'

const express = require('express')
const router = express.Router();
const { config } = require('../config/db')
const sql = require('mssql');

const { formatDate } = require('../utils/date.util');
const { addBookBodySchema, bookIdSchema, searchBookSchema } = require('../validations/schemas/book.schema');
const { validation, property } = require('../validations/schema.validator');


// TASK-04 GET /books & /books?category=&status= — Filter + Search หนังสือ หรือ ดึงหนังสือทั้งหมด (พร้อม Category, Status, Publisher, Merchant)
/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Search Books
 */
router.get('/', validation(searchBookSchema, property.QUERY), controller.getBookListController)

// TASK-05 GET /books/:id — ดึงหนังสือรายเล่ม
router.get('/:id', validation(bookIdSchema, property.PARAMS), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const pool = await sql.connect(config);
        const request = pool.request();

        try {
            const findBookResult = await request
                .input('id', sql.Int, id)
                .query(`SELECT 
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
                            WHERE b.book_id = @id`);

            if (findBookResult.recordset.length === 0) {
                return res.status(404).json({
                    code: 40400,
                    message: `data not found`
                });
            }

            book = findBookResult.recordset


        } catch (error) {
            console.error(error)
            return res.status(404).json({
                code: 40400,
                message: `data not found`
            });
        }

        const resultBook = book[0]
        const result = {
            ...resultBook,
            purchase_date: formatDate(resultBook.purchase_date, res),
            category: resultBook.category_name,
            status: resultBook.status_name,
            merchant: resultBook.merchant_name,
            publisher: resultBook.publisher_name
        };


        return res.status(200).json({
            code: '20010',
            message: 'Successfully with data.',
            result
        });


    } catch (error) {
        console.error('error', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
})

// TASK-06 POST /books — เพิ่มหนังสือ
router.post('/', validation(addBookBodySchema, property.BODY), async (req, res) => {
    try {
        const { title, author, price } = req.body;

        const pool = await sql.connect(config);
        const request = pool.request();

        const results = await request
            .input('title', sql.NVarChar, title)
            .input('author', sql.NVarChar, author)
            .input('price', sql.Decimal(10, 2), price)
            .query(`
                INSERT INTO Book (title, author, price) 
                VALUES (@title, @author, @price)
            `)

        return res.status(201).json({
            code: '20001',
            message: 'Successfully add book.'
        });
    } catch (error) {
        console.error('error', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
})

// TASK-07 PUT /books/:id — แก้ไขข้อมูลหนังสือ
router.put('/:id', validation(bookIdSchema, property.PARAMS), validation(addBookBodySchema, property.BODY), async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        const id = +req.params.id || 0;

        try {
            const isBookExisted = await request.input('id', sql.Int, id)
                .query(`SELECT * FROM Book WHERE Book.book_id = @id`);
            if (isBookExisted.recordset.length === 0) {
                return res.status(404).json({
                    code: 40400,
                    message: `data not found`
                });
            }
        } catch (error) {
            console.error('error', error)
            return res.status(500).json({
                code: 50000,
                message: 'Internal Error',
            });
        }


        // Define field to SQL type mapping
        const fieldTypeMap = {
            title: sql.NVarChar,
            author: sql.NVarChar,
            price: () => sql.Decimal(10, 2),
            purchase_date: sql.DateTime2,
            summary: sql.NVarChar,
            category_id: sql.Int,
            status_id: sql.Int,
            merchant_id: sql.Int,
            publisher_id: sql.Int,
        };

        // Build SET clause dynamically
        const setFields = [];

        const editRequest = pool.request();
        editRequest.input('id', sql.Int, id);

        for (const [field, value] of Object.entries(req.body)) {
            if (field in fieldTypeMap && value !== undefined) {
                setFields.push(`${field} = @${field}`);
                const fieldType = fieldTypeMap[field];
                const sqlType = typeof fieldType === 'function' ? fieldType() : fieldType;
                editRequest.input(field, sqlType, value);
            }
        }

        if (setFields.length === 0) {
            console.error('error', error)
            return res.status(500).json({
                code: 50000,
                message: 'Update field error',
            });
        }

        try {
            const query = `
            UPDATE Book
            SET ${setFields.join(', ')}
            WHERE Book.book_id = @id
        `;

            const results = await editRequest.query(query);

            return res.status(200).json({
                code: 20001,
                message: 'Edit book successfully.'
            })
        } catch (error) {
            console.error('error', error)
            return res.status(500).json({
                code: 50000,
                message: 'Error Updating Book.',
            });
        }

    } catch (error) {
        console.error('error', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
})

// TASK-08 DELETE /books/:id — ลบหนังสือ
router.delete('/:id', validation(bookIdSchema, property.PARAMS), async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        const id = +req.params.id;

        try {
            const isBookExisted = await request.input('id', sql.Int, id)
                .query(`SELECT * FROM Book WHERE Book.book_id = @id`);
            if (isBookExisted.recordset.length === 0) {
                return res.status(404).json({
                    code: 40400,
                    message: 'Data not found'
                });
            }
        } catch (error) {
            console.error('error', error)
            return res.status(500).json({
                code: 50000,
                message: 'Internal Error',
            });
        }

        try {
            const deleteRequest = pool.request();
            const results = await deleteRequest
                .input('id', sql.Int, id)
                .query(`
                DELETE FROM Book WHERE book_id = @id
            `)

            res.status(201).json({
                status: 20001,
                message: 'Delete book successfully.'
            })
        } catch (error) {
            console.error('error', error)
            return res.status(500).json({
                code: 50000,
                message: 'Internal Error',
            });
        }


    } catch (error) {
        console.error('error', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
})

module.exports = { router }
import { Wishlist } from '../models/wishlist.model.js'
import { create, query, update } from './sql.repository.js'

// Identifiers can't be bound as replacements, so sortBy is restricted to this whitelist
const SORTABLE_COLUMNS = {
    wishlist_id: 'w.wishlist_id',
    title: 'w.title',
    author: 'w.author',
    remark: 'w.remark',
    publisher_id: 'w.publisher_id',
    publisher_name: 'p.publisher_name',
    created_date: 'w.created_date',
    updated_date: 'w.updated_date',
}

const sqlExec = {
    getWishlistCriteria: `
        WHERE
            (:search = ''
            OR w.title LIKE :pattern
            OR w.author LIKE :pattern
            OR p.publisher_name LIKE :pattern)
    `
}

const getWishlistList = async (req, criteria) => {
    console.log('getWishlistList wishlist.repository')
    try {
        const { page, limit, sortBy, orderBy, search } = criteria

        const pageSize = Number(limit)
        const offset = (Number(page) - 1) * pageSize
        const sortColumn = SORTABLE_COLUMNS[sortBy] ?? SORTABLE_COLUMNS.wishlist_id
        const sortDirection = `${orderBy}`.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
        const orderByClause = sortColumn === SORTABLE_COLUMNS.wishlist_id
            ? `${sortColumn} ${sortDirection}`
            : `${sortColumn} ${sortDirection}, ${SORTABLE_COLUMNS.wishlist_id} ${sortDirection}`

        const keyword = search ? search.trim() : ''
        const pattern = `%${keyword}%`

        return query({
            sql: `
            SELECT
                w.wishlist_id,
                w.title,
                w.author,
                w.remark,
                w.publisher_id,
                p.publisher_name
            FROM Wishlist w
                LEFT JOIN Publisher p ON w.publisher_id = p.publisher_id
            ${sqlExec.getWishlistCriteria}
            ORDER BY ${orderByClause}
            OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY
        `,
            replacements: { search: keyword, pattern, offset, pageSize },
            req,
            event: 'getWishlistList'
        })
    } catch (err) {
        throw err
    }


}

const getWishlistListTotal = async (req, criteria) => {
    console.log('getWishlistListTotal wishlist.repository')
    try {
        const { search } = criteria

        const keyword = search ? search.trim() : ''
        const pattern = `%${keyword}%`

        return query({
            sql: `
            SELECT
                count (*) as total_wishlist
            FROM Wishlist w
                LEFT JOIN Publisher p ON w.publisher_id = p.publisher_id
            ${sqlExec.getWishlistCriteria}
        `,
            replacements: { search: keyword, pattern },
            req,
            event: 'getWishlistList'
        })
    } catch (err) {
        throw err
    }


}

const getWishlistDetail = async (req, wishlistId) => {
    console.log('getWishlistDetail wishlist.repository')

    try {
        return query({
            sql: `
            SELECT
                w.wishlist_id,
                w.title,
                w.author,
                w.remark,
                w.publisher_id,
                p.publisher_name,
                wd.merchant_id,
                m.merchant_name,
                wd.price
            FROM Wishlist w
                LEFT JOIN Publisher p ON w.publisher_id = p.publisher_id
                LEFT JOIN WishlistSellingDetail wd ON w.wishlist_id = wd.wishlist_id
                LEFT JOIN Merchant m on m.merchant_id = wd.merchant_id
            WHERE
                w.wishlist_id = :wishlistId
        `,
            replacements: { wishlistId },
            req,
            event: 'getWishlistDetail'
        })
    } catch (err) {
        throw err
    }

}

const addWishlist = async (req, data) => {
    console.log('addWishlist wishlist.repository')

    return create({ model: Wishlist, data, req, event: 'addWishlist' })
}

const editWishlist = async (req, wishlistId, data) => {
    console.log('editWishlist wishlist.repository')

    return update({ model: Wishlist, data, criteria: { wishlist_id: wishlistId }, req, event: 'editWishlist' })
}

const removeWishlist = async (req, wishlistId) => {
    console.log('removeWishlist wishlist.repository')

    return query({
        sql: `
            EXEC dbo.sp_DeleteWishlist
                @wishlist_id = :wishlistId
        `,
        replacements: { wishlistId },
        req,
        event: 'removeWishlist'
    })
}

// WishlistSellingDetail has no single-column key, so these use raw SQL instead of the Sequelize model
const getWishlistMerchant = async (req, wishlistId, merchantId) => {
    console.log('getWishlistMerchant wishlist.repository')

    return query({
        sql: `
            SELECT wishlist_id, merchant_id, price
            FROM WishlistSellingDetail
            WHERE wishlist_id = :wishlistId AND merchant_id = :merchantId
        `,
        replacements: { wishlistId, merchantId },
        req,
        event: 'getWishlistMerchant'
    })
}

const isMerchantExists = async (req, merchantId) => {
    console.log('isMerchantExists wishlist.repository')

    const rows = await query({
        sql: `SELECT merchant_id FROM Merchant WHERE merchant_id = :merchantId`,
        replacements: { merchantId },
        req,
        event: 'isMerchantExists'
    })
    return rows.length > 0
}

const addWishlistMerchant = async (req, wishlistId, merchantId, price) => {
    console.log('addWishlistMerchant wishlist.repository')

    return query({
        sql: `
            INSERT INTO WishlistSellingDetail (wishlist_id, merchant_id, price, created_date, updated_date)
            VALUES (:wishlistId, :merchantId, :price, GETDATE(), GETDATE())
        `,
        replacements: { wishlistId, merchantId, price },
        req,
        event: 'addWishlistMerchant'
    })
}

const editWishlistMerchant = async (req, wishlistId, merchantId, price) => {
    console.log('editWishlistMerchant wishlist.repository')

    return query({
        sql: `
            UPDATE WishlistSellingDetail
            SET price = :price, updated_date = GETDATE()
            WHERE wishlist_id = :wishlistId AND merchant_id = :merchantId
        `,
        replacements: { wishlistId, merchantId, price },
        req,
        event: 'editWishlistMerchant'
    })
}

const removeWishlistMerchant = async (req, wishlistId, merchantId) => {
    console.log('removeWishlistMerchant wishlist.repository')

    return query({
        sql: `
            DELETE FROM WishlistSellingDetail
            WHERE wishlist_id = :wishlistId AND merchant_id = :merchantId
        `,
        replacements: { wishlistId, merchantId },
        req,
        event: 'removeWishlistMerchant'
    })
}

const getCheapestWishlistPrice = async (req, wishlistId) => {
    console.log('getCheapestWishlistPrice wishlist.repository')

    return query({
        sql: `SELECT title, price, merchant_id, merchant_name FROM dbo.fn_GetCheapestWishlistPriceWithMerchant(:wishlistId)`,
        replacements: { wishlistId },
        req,
        event: 'getCheapestWishlistPrice'
    })
}

export {
    getCheapestWishlistPrice,
    getWishlistList,
    getWishlistListTotal,
    getWishlistDetail,
    addWishlist,
    editWishlist,
    removeWishlist,
    getWishlistMerchant,
    isMerchantExists,
    addWishlistMerchant,
    editWishlistMerchant,
    removeWishlistMerchant,
}

import sql from 'mssql'

const getCategoryList = async (request, criteria) => {
    console.log('getCategoryList category.repository')

    try {
        const { page, limit, sortBy, orderBy, search } = criteria

        const pageNumber = Number(page)
        const pageSize = Number(limit)
        const offset = (pageNumber - 1) * pageSize

        const searchText = search?.trim()


        let whereClause = ''

        request.input('offset', sql.BigInt, offset)
        request.input('limit', sql.Int, pageSize)

        if (searchText) {
            whereClause = 'WHERE c.category_name LIKE @search'
            request.input('search', sql.NVarChar(258), `%${searchText}%`)
        }

        const result = await request.query(`
            SELECT c.*
            FROM Category c
            ${whereClause}
            ORDER BY c.[${sortBy}] ${orderBy}
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY;
        `)
        return result?.recordsets || []
    } catch (err) {
        throw err
    }

}

export {
    getCategoryList
}
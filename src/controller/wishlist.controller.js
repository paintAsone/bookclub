import CONSTANT from '../config/constants.js'
import * as service from '../services/wishlist.service.js'

const getWishlistList = async (req, res) => {
    console.log('getWishlistList wishlist.controller')
    try {
        const result = await service.getWishlistList(req)

        return res.status(200).json({
            code: '20010',
            message: 'Successfully with data.',
            result
        })
    } catch (error) {
        console.error('Error: getWishlistList wishlist.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const getWishlistDetail = async (req, res) => {
    console.log('getWishlistDetail wishlist.controller')
    try {
        const result = await service.getWishlistDetail(req)

        return res.status(200).json({
            code: '20010',
            message: 'Successfully with data.',
            result
        })
    } catch (error) {
        console.error('Error: getWishlistDetail wishlist.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const addWishlist = async (req, res) => {
    console.log('addWishlist wishlist.controller')
    try {
        await service.addWishlist(req)

        return res.status(201).json({
            code: '20001',
            message: 'Successfully add wishlist.'
        });
    } catch (error) {
        console.error('Error: addWishlist wishlist.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const editWishlist = async (req, res) => {
    console.log('editWishlist wishlist.controller')
    try {
        const result = await service.editWishlist(req)

        if (!result) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }

        return res.status(200).json({
            code: '20000',
            message: 'Successfully update wishlist.'
        });
    } catch (error) {
        console.error('Error: editWishlist wishlist.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const removeWishlist = async (req, res) => {
    console.log('removeWishlist wishlist.controller')
    try {
        await service.removeWishlist(req)

        return res.status(200).json({
            code: '20000',
            message: 'Successfully remove wishlist.'
        });
    } catch (error) {
        console.error('Error: removeWishlist wishlist.controller', error)
        const spErrorNumber = error.original?.number ?? error.parent?.number
        if (spErrorNumber === CONSTANT.SQL_ERROR.STORE_PROCEDURE.NOT_FOUND) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const { WISHLIST_MERCHANT_RESULT: RESULT } = service

const addWishlistMerchant = async (req, res) => {
    console.log('addWishlistMerchant wishlist.controller')
    try {
        const result = await service.addWishlistMerchant(req)

        if (result === RESULT.WISHLIST_NOT_FOUND || result === RESULT.MERCHANT_NOT_FOUND) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }
        if (result === RESULT.DUPLICATE) {
            return res.status(409).json({
                code: 40900,
                message: 'merchant already exists in this wishlist'
            })
        }

        return res.status(201).json({
            code: '20001',
            message: 'Successfully add wishlist merchant.'
        });
    } catch (error) {
        console.error('Error: addWishlistMerchant wishlist.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const editWishlistMerchant = async (req, res) => {
    console.log('editWishlistMerchant wishlist.controller')
    try {
        const result = await service.editWishlistMerchant(req)

        if (result === RESULT.NOT_FOUND) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }

        return res.status(200).json({
            code: '20000',
            message: 'Successfully update wishlist merchant.'
        });
    } catch (error) {
        console.error('Error: editWishlistMerchant wishlist.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const removeWishlistMerchant = async (req, res) => {
    console.log('removeWishlistMerchant wishlist.controller')
    try {
        const result = await service.removeWishlistMerchant(req)

        if (result === RESULT.NOT_FOUND) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }

        return res.status(200).json({
            code: '20000',
            message: 'Successfully remove wishlist merchant.'
        });
    } catch (error) {
        console.error('Error: removeWishlistMerchant wishlist.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

const getCheapestWishlistPrice = async (req, res) => {
    console.log('getCheapestWishlistPrice wishlist.controller')
    try {
        const result = await service.getCheapestWishlistPrice(req)

        if (result === false) {
            return res.status(404).json({
                code: 40400,
                message: 'data not found'
            })
        }

        return res.status(200).json({
            code: '20010',
            message: 'Successfully with data.',
            result
        })
    } catch (error) {
        console.error('Error: getCheapestWishlistPrice wishlist.controller', error)
        return res.status(500).json({
            code: 50000,
            message: 'Internal Error',
        });
    }
}

export {
    getCheapestWishlistPrice,
    getWishlistList,
    getWishlistDetail,
    addWishlist,
    editWishlist,
    removeWishlist,
    addWishlistMerchant,
    editWishlistMerchant,
    removeWishlistMerchant,
}

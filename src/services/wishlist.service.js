import * as repository from '../repositories/index.js'
import { pickData } from '../utils/data.util.js'

const wishlistFields = ['title', 'author', 'remark', 'publisher_id']

const getWishlistList = async (req) => {
    console.log('getWishlistList wishlist.service')
    try {
        const { page = 1, limit = 10, sortBy = 'wishlist_id', orderBy = 'DESC', search } = req.query

        const criteria = {
            page,
            limit,
            sortBy,
            orderBy,
            search
        }

        return repository.wishlistRepository.getWishlistList(req, criteria)
    } catch (err) {
        throw err
    }


}

const getWishlistDetail = async (req) => {
    console.log('getWishlistDetail wishlist.service')

    try {
        const wishlistId = Number(req.params.id)

        return repository.wishlistRepository.getWishlistDetail(req, wishlistId)
    } catch (err) {
        throw err
    }

}

const addWishlist = async (req) => {
    console.log('addWishlist wishlist.service')
    try {
        return repository.wishlistRepository.addWishlist(req, pickData(req.body, wishlistFields))

    } catch (err) {
        throw err
    }
}

// Returns false when the wishlist does not exist
const editWishlist = async (req) => {
    console.log('editWishlist wishlist.service')
    try {
        const wishlistId = +req.params.id || 0

        const wishlists = await repository.wishlistRepository.getWishlistDetail(req, wishlistId)
        if (wishlists.length === 0) {
            return false
        }

        await repository.wishlistRepository.editWishlist(req, wishlistId, pickData(req.body, wishlistFields))
        return true
    } catch (err) {
        throw err
    }


}

// Returns false when the wishlist does not exist
const removeWishlist = async (req) => {
    console.log('removeWishlist wishlist.service')

    try {
        const wishlistId = +req.params.id || 0
        await repository.wishlistRepository.removeWishlist(req, wishlistId)
    } catch (err) {
        throw err
    }

}

const WISHLIST_MERCHANT_RESULT = {
    OK: 'OK',
    WISHLIST_NOT_FOUND: 'WISHLIST_NOT_FOUND',
    MERCHANT_NOT_FOUND: 'MERCHANT_NOT_FOUND',
    NOT_FOUND: 'NOT_FOUND',
    DUPLICATE: 'DUPLICATE',
}

const addWishlistMerchant = async (req) => {
    console.log('addWishlistMerchant wishlist.service')
    try {
        const wishlistId = Number(req.params.id)
        const { merchant_id: merchantId, price } = req.body

        const wishlists = await repository.wishlistRepository.getWishlistDetail(req, wishlistId)
        if (wishlists.length === 0) {
            return WISHLIST_MERCHANT_RESULT.WISHLIST_NOT_FOUND
        }
        if (!(await repository.wishlistRepository.isMerchantExists(req, merchantId))) {
            return WISHLIST_MERCHANT_RESULT.MERCHANT_NOT_FOUND
        }
        if ((await repository.wishlistRepository.getWishlistMerchant(req, wishlistId, merchantId)).length > 0) {
            return WISHLIST_MERCHANT_RESULT.DUPLICATE
        }

        await repository.wishlistRepository.addWishlistMerchant(req, wishlistId, merchantId, price)
        return WISHLIST_MERCHANT_RESULT.OK
    } catch (err) {
        throw err
    }
}

const editWishlistMerchant = async (req) => {
    console.log('editWishlistMerchant wishlist.service')
    try {
        const wishlistId = Number(req.params.id)
        const merchantId = Number(req.params.merchantId)


        if ((await repository.wishlistRepository.getWishlistMerchant(req, wishlistId, merchantId)).length === 0) {
            return WISHLIST_MERCHANT_RESULT.NOT_FOUND
        }

        await repository.wishlistRepository.editWishlistMerchant(req, wishlistId, merchantId, req.body.price)
        return WISHLIST_MERCHANT_RESULT.OK
    } catch (err) {
        throw err
    }
}

const removeWishlistMerchant = async (req) => {
    console.log('removeWishlistMerchant wishlist.service')
    try {
        const wishlistId = Number(req.params.id)
        const merchantId = Number(req.params.merchantId)


        if ((await repository.wishlistRepository.getWishlistMerchant(req, wishlistId, merchantId)).length === 0) {
            return WISHLIST_MERCHANT_RESULT.NOT_FOUND
        }

        await repository.wishlistRepository.removeWishlistMerchant(req, wishlistId, merchantId)
        return WISHLIST_MERCHANT_RESULT.OK
    } catch (err) {
        throw err
    }
}

// Returns false when the wishlist does not exist, null when it has no merchant prices yet
const getCheapestWishlistPrice = async (req) => {
    console.log('getCheapestWishlistPrice wishlist.service')
    try {
        const wishlistId = Number(req.params.id)


        if ((await repository.wishlistRepository.getWishlistDetail(req, wishlistId)).length === 0) {
            return false
        }

        const [cheapest] = await repository.wishlistRepository.getCheapestWishlistPrice(req, wishlistId)
        return cheapest ?? null
    } catch (err) {
        throw err
    }
}

export {
    getCheapestWishlistPrice,
    getWishlistList,
    getWishlistDetail,
    addWishlist,
    editWishlist,
    removeWishlist,
    WISHLIST_MERCHANT_RESULT,
    addWishlistMerchant,
    editWishlistMerchant,
    removeWishlistMerchant,
}

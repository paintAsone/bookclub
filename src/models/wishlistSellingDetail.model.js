import { DataTypes } from 'sequelize'
import { sqlServer } from '../db-connect.js'

const now = () => sqlServer.fn('GETDATE')

const WishlistSellingDetail = sqlServer.define('WishlistSellingDetail', {
    wishlist_id: { type: DataTypes.INTEGER, allowNull: false },
    merchant_id: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    created_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
    updated_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
}, {
    tableName: 'WishlistSellingDetail',
    timestamps: false,
})

export { WishlistSellingDetail }

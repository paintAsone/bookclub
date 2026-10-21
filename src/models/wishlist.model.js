import { DataTypes } from 'sequelize'
import { sqlServer } from '../db-connect.js'

const now = () => sqlServer.fn('GETDATE')

const Wishlist = sqlServer.define('Wishlist', {
    wishlist_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    author: { type: DataTypes.STRING(255), allowNull: false },
    remark: { type: DataTypes.STRING(255), allowNull: true },
    publisher_id: { type: DataTypes.INTEGER, allowNull: true },
    created_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
    updated_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
}, {
    tableName: 'Wishlist',
    timestamps: false,
})

export { Wishlist }

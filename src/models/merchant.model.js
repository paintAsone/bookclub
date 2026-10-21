import { DataTypes } from 'sequelize'
import { sqlServer } from '../db-connect.js'

// Sequelize's default timestamp binding can't be converted into datetime columns, so let SQL Server stamp them
const now = () => sqlServer.fn('GETDATE')

const Merchant = sqlServer.define('Merchant', {
    merchant_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    merchant_name: { type: DataTypes.STRING(255), allowNull: false },
    website: { type: DataTypes.STRING(255), allowNull: true },
    contactNo: { type: DataTypes.STRING(11), allowNull: true },
    created_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
    updated_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
}, {
    tableName: 'Merchant',
    timestamps: false,
})

export { Merchant }

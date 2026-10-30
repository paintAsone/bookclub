import { DataTypes } from 'sequelize'
import { sqlServer } from '../db-connect.js'

// Sequelize's default timestamp binding can't be converted into datetime columns, so let SQL Server stamp them
const now = () => sqlServer.fn('GETDATE')

const Category = sqlServer.define('Category', {
    category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category_name: { type: DataTypes.STRING(255), allowNull: false },
    category_description: { type: DataTypes.STRING(255), allowNull: false },
    created_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
    updated_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
}, {
    tableName: 'Category',
    timestamps: false,
})

export { Category }

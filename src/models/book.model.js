import { DataTypes } from 'sequelize'
import { sqlServer } from '../db-connect.js'

// Sequelize's default timestamp binding can't be converted into datetime columns, so let SQL Server stamp them
const now = () => sqlServer.fn('GETDATE')

const Book = sqlServer.define('Book', {
    book_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    author: { type: DataTypes.STRING(255), allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    purchase_date: { type: DataTypes.DATEONLY, allowNull: true },
    summary: { type: DataTypes.STRING(255), allowNull: true },
    category_id: { type: DataTypes.INTEGER, allowNull: true },
    status_id: { type: DataTypes.INTEGER, allowNull: true },
    merchant_id: { type: DataTypes.INTEGER, allowNull: true },
    publisher_id: { type: DataTypes.INTEGER, allowNull: true },
    created_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
    updated_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
}, {
    tableName: 'Book',
    timestamps: false,
    hooks: {
        beforeBulkUpdate: (options) => {
            options.attributes.updated_date = now()
            options.fields = [...(options.fields ?? []), 'updated_date']
        },
    },
})

export { Book }

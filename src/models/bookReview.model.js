import { DataTypes } from 'sequelize'
import { sqlServer } from '../db-connect.js'

// Sequelize's default timestamp binding can't be converted into datetime columns, so let SQL Server stamp them
const now = () => sqlServer.fn('GETDATE')

const BookReview = sqlServer.define('BookReview', {
    book_review_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    book_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    review_comment: { type: DataTypes.STRING(255), allowNull: true },
    review_date: { type: DataTypes.DATEONLY, allowNull: true },
    created_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
    updated_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
}, {
    tableName: 'BookReview',
    timestamps: false,
    hooks: {
        beforeBulkUpdate: (options) => {
            options.attributes.updated_date = now()
            options.fields = [...(options.fields ?? []), 'updated_date']
        },
    },
})

export { BookReview }

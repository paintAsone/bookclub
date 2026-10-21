import { DataTypes } from 'sequelize'
import { sqlServer } from '../db-connect.js'

const now = () => sqlServer.fn('GETDATE')

const Publisher = sqlServer.define('Publisher', {
    publisher_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    publisher_name: { type: DataTypes.STRING(255), allowNull: false },
    website: { type: DataTypes.STRING(255), allowNull: true },
    contactNo: { type: DataTypes.STRING(11), allowNull: true },
    created_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
    updated_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
}, {
    tableName: 'Publisher',
    timestamps: false,
})

export { Publisher }

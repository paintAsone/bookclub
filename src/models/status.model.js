import { DataTypes } from 'sequelize'
import { sqlServer } from '../db-connect.js'

const now = () => sqlServer.fn('GETDATE')

const Status = sqlServer.define('Status', {
    status_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status_name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    created_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
    updated_date: { type: DataTypes.DATE, allowNull: false, defaultValue: now },
}, {
    tableName: 'Status',
    timestamps: false,
})

export { Status }

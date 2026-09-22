import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
export class Category extends Model {
}
Category.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
    name: { type: DataTypes.STRING(40), allowNull: false },
    color: { type: DataTypes.STRING(16), allowNull: false, defaultValue: '#2f765c' },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, { sequelize, tableName: 'categories', modelName: 'Category', indexes: [{ unique: true, fields: ['user_id', 'name'] }] });

import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelize } from '../config/database.js'
import { User } from './User.js'

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>
  declare userId: ForeignKey<User['id']>
  declare name: string
  declare color: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Category.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
  name: { type: DataTypes.STRING(40), allowNull: false },
  color: { type: DataTypes.STRING(16), allowNull: false, defaultValue: '#2f765c' },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, { sequelize, tableName: 'categories', modelName: 'Category', indexes: [{ unique: true, fields: ['user_id', 'name'] }] })

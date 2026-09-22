import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelize } from '../config/database.js'
import { Category } from './Category.js'
import { User } from './User.js'

export class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
  declare id: CreationOptional<number>
  declare userId: ForeignKey<User['id']>
  declare categoryId: ForeignKey<Category['id']> | null
  declare title: string
  declare description: string
  declare dueDate: string | null
  declare dueTime: string | null
  declare priority: 'low' | 'medium' | 'high'
  declare status: 'todo' | 'in_progress' | 'done'
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Task.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
  categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'category_id' },
  title: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  dueDate: { type: DataTypes.DATEONLY, allowNull: true, field: 'due_date' },
  dueTime: { type: DataTypes.TIME, allowNull: true, field: 'due_time' },
  priority: { type: DataTypes.ENUM('low', 'medium', 'high'), allowNull: false, defaultValue: 'medium' },
  status: { type: DataTypes.ENUM('todo', 'in_progress', 'done'), allowNull: false, defaultValue: 'todo' },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, { sequelize, tableName: 'tasks', modelName: 'Task' })

import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelize } from '../config/database.js'
import { Task } from './Task.js'

export class Subtask extends Model<InferAttributes<Subtask>, InferCreationAttributes<Subtask>> {
  declare id: CreationOptional<number>
  declare taskId: ForeignKey<Task['id']>
  declare title: string
  declare isComplete: boolean
  declare position: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Subtask.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  taskId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'task_id' },
  title: { type: DataTypes.STRING(160), allowNull: false },
  isComplete: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_complete' },
  position: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, { sequelize, tableName: 'subtasks', modelName: 'Subtask' })

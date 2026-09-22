import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
export class Subtask extends Model {
}
Subtask.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    taskId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'task_id' },
    title: { type: DataTypes.STRING(160), allowNull: false },
    isComplete: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_complete' },
    position: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, { sequelize, tableName: 'subtasks', modelName: 'Subtask' });

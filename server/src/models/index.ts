import { Category } from './Category.js'
import { Subtask } from './Subtask.js'
import { Task } from './Task.js'
import { User } from './User.js'

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' })
Task.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' })
Category.belongsTo(User, { foreignKey: 'userId' })
Category.hasMany(Task, { foreignKey: 'categoryId', onDelete: 'SET NULL' })
Task.belongsTo(Category, { foreignKey: 'categoryId' })
Task.hasMany(Subtask, { foreignKey: 'taskId', onDelete: 'CASCADE' })
Subtask.belongsTo(Task, { foreignKey: 'taskId' })

export { Category, Subtask, Task, User }

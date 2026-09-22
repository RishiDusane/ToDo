const bcrypt = require('bcryptjs')

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('password123', 12)
    await queryInterface.bulkInsert('users', [{ name: 'Demo User', email: 'demo@taskflow.local', password_hash: passwordHash, created_at: new Date(), updated_at: new Date() }])
    const [users] = await queryInterface.sequelize.query("SELECT id FROM users WHERE email = 'demo@taskflow.local' LIMIT 1")
    const userId = users[0].id
    await queryInterface.bulkInsert('categories', [
      { user_id: userId, name: 'Study', color: '#2f765c', created_at: new Date(), updated_at: new Date() },
      { user_id: userId, name: 'Personal', color: '#e47751', created_at: new Date(), updated_at: new Date() },
    ])
    const [categories] = await queryInterface.sequelize.query(`SELECT id, name FROM categories WHERE user_id = ${userId}`)
    const studyId = categories.find((category) => category.name === 'Study').id
    const personalId = categories.find((category) => category.name === 'Personal').id
    await queryInterface.bulkInsert('tasks', [
      { user_id: userId, category_id: studyId, title: 'Review database normalization', description: 'Prepare three examples for the seminar.', due_date: new Date().toISOString().slice(0, 10), due_time: '17:00:00', priority: 'high', status: 'in_progress', created_at: new Date(), updated_at: new Date() },
      { user_id: userId, category_id: personalId, title: 'Plan weekend groceries', description: 'Keep the list short and practical.', due_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), due_time: null, priority: 'low', status: 'todo', created_at: new Date(), updated_at: new Date() },
    ])
  },
  async down(queryInterface) {
    const [users] = await queryInterface.sequelize.query("SELECT id FROM users WHERE email = 'demo@taskflow.local' LIMIT 1")
    if (users[0]) await queryInterface.bulkDelete('users', { id: users[0].id })
  },
}

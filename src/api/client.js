const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const TOKEN_KEY = 'taskflow-token';
async function request(path, options = {}) {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    const token = localStorage.getItem(TOKEN_KEY);
    if (token)
        headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (!response.ok) {
        const body = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(body.message || `Request failed with status ${response.status}`);
    }
    if (response.status === 204)
        return undefined;
    return response.json();
}
export const authApi = {
    register: (input) => request('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
    login: (input) => request('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
    me: () => request('/auth/me'),
};
function toPayload(task) {
    return {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        category: task.category,
        status: task.status,
        subtasks: task.subtasks?.map((subtask) => ({ title: subtask.title, completed: subtask.completed })),
    };
}
export const taskApi = {
    list: () => request('/tasks'),
    create: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(toPayload(task)) }),
    update: (id, updates) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(toPayload(updates)) }),
    remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
    status: (id, status) => request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
export const categoryApi = {
    list: () => request('/categories'),
};
export { API_URL, TOKEN_KEY };

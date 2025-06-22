// Modern Todo App JavaScript
class TodoApp {
    constructor() {
        this.todos = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTodos();
    }

    bindEvents() {
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');

        // Add todo on button click
        addBtn.addEventListener('click', () => this.handleAddTodo());

        // Add todo on Enter key press
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddTodo();
            }
        });

        // Auto-resize input and show character count feedback
        todoInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value.length > 180) {
                e.target.style.borderColor = 'var(--warning-color)';
            } else {
                e.target.style.borderColor = '';
            }
        });
    }

    async loadTodos() {
        try {
            const response = await fetch('/api/todos');
            if (!response.ok) {
                throw new Error('Failed to load todos');
            }
            this.todos = await response.json();
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showToast('Failed to load todos. Please refresh the page.', 'error');
        }
    }

    async handleAddTodo() {
        const input = document.getElementById('todoInput');
        const addBtn = document.getElementById('addBtn');
        const text = input.value.trim();

        if (!text) {
            this.showToast('Please enter a task!', 'warning');
            input.focus();
            return;
        }

        if (text.length > 200) {
            this.showToast('Task is too long! Maximum 200 characters.', 'error');
            return;
        }

        // Show loading state
        addBtn.classList.add('loading');
        addBtn.disabled = true;

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error('Failed to create todo');
            }

            const newTodo = await response.json();
            this.todos.unshift(newTodo); // Add to beginning of array
            input.value = '';
            this.renderTodos();
            this.updateStats();
            this.showToast('Task added successfully!', 'success');

        } catch (error) {
            console.error('Error creating todo:', error);
            this.showToast('Failed to add task. Please try again.', 'error');
        } finally {
            // Remove loading state
            addBtn.classList.remove('loading');
            addBtn.disabled = false;
            input.focus();
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT'
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodo = await response.json();
            const index = this.todos.findIndex(t => t.id === id);
            this.todos[index] = updatedTodo;
            
            this.renderTodos();
            this.updateStats();
            
            const status = updatedTodo.completed ? 'completed' : 'unmarked';
            this.showToast(`Task ${status}!`, 'success');

        } catch (error) {
            console.error('Error updating todo:', error);
            this.showToast('Failed to update task. Please try again.', 'error');
        }
    }

    async deleteTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        // Show confirmation for important tasks (optional UX improvement)
        if (todo.text.length > 50) {
            if (!confirm('Are you sure you want to delete this task?')) {
                return;
            }
        }

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            // Add slide-out animation before removing
            const todoElement = document.querySelector(`[data-id="${id}"]`);
            if (todoElement) {
                todoElement.classList.add('removing');
                setTimeout(() => {
                    this.todos = this.todos.filter(t => t.id !== id);
                    this.renderTodos();
                    this.updateStats();
                }, 300);
            }

            this.showToast('Task deleted!', 'success');

        } catch (error) {
            console.error('Error deleting todo:', error);
            this.showToast('Failed to delete task. Please try again.', 'error');
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');

        if (this.todos.length === 0) {
            todoList.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        todoList.classList.remove('hidden');
        emptyState.classList.add('hidden');

        todoList.innerHTML = this.todos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="app.toggleTodo(${todo.id})"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button 
                        class="btn btn-danger btn-small" 
                        onclick="app.deleteTodo(${todo.id})"
                        title="Delete task"
                    >
                        Delete
                    </button>
                </div>
            </li>
        `).join('');
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        
        document.getElementById('totalCount').textContent = 
            `${total} ${total === 1 ? 'task' : 'tasks'}`;
        document.getElementById('completedCount').textContent = 
            `${completed} completed`;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        
        // Trigger reflow to ensure the transition works
        toast.offsetHeight;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus input on '/' key (like search)
    if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('todoInput').focus();
    }
    
    // Clear completed tasks on 'c' key
    if (e.key === 'c' && e.ctrlKey && window.app) {
        e.preventDefault();
        const completedTodos = window.app.todos.filter(t => t.completed);
        if (completedTodos.length > 0) {
            if (confirm(`Delete ${completedTodos.length} completed tasks?`)) {
                completedTodos.forEach(todo => window.app.deleteTodo(todo.id));
            }
        }
    }
});

// Add service worker registration for PWA capabilities (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if we have a service worker file
        // This is left for future enhancement
    });
}

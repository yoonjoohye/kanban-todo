class Storage {
    static STORAGE_KEY = 'todos';

    static getTodos() {
        const todos = localStorage.getItem(this.STORAGE_KEY);
        return todos ? JSON.parse(todos) : [];
    }

    static saveTodos(todos) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    }

    static addTodo(todo) {
        const todos = this.getTodos();
        todo.id = Date.now().toString();
        todo.createdAt = new Date().toISOString();
        todo.updatedAt = new Date().toISOString();
        todos.push(todo);
        this.saveTodos(todos);
        return todo;
    }

    static updateTodo(id, updates) {
        const todos = this.getTodos();
        const index = todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todos[index] = {
                ...todos[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveTodos(todos);
            return todos[index];
        }
        return null;
    }

    static deleteTodo(id) {
        const todos = this.getTodos();
        const filteredTodos = todos.filter(todo => todo.id !== id);
        this.saveTodos(filteredTodos);
    }

    static getTodoById(id) {
        const todos = this.getTodos();
        return todos.find(todo => todo.id === id);
    }
} 
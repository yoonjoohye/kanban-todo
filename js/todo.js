class Todo {
    constructor() {
        this.todos = [];
        this.draggedTodoId = null;
        this.dragOverTodoId = null;
        this.dragOverListId = null;
        this.init();
    }

    init() {
        this.loadTodos();
        this.setupDragAndDrop();
    }

    loadTodos() {
        this.todos = Storage.getTodos();
        this.renderTodos();
    }

    renderTodos(todosToRender) {
        const lists = {
            todo: document.getElementById('todoList'),
            inProgress: document.getElementById('inProgressList'),
            done: document.getElementById('doneList'),
            pending: document.getElementById('pendingList')
        };

        Object.keys(lists).forEach(status => {
            lists[status].innerHTML = '';
        });

        const todos = todosToRender || this.todos;
        todos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            lists[todo.status].appendChild(todoElement);
        });
    }

    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = 'todo-card bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm cursor-move transition-all duration-200 hover:shadow-md relative';
        div.draggable = true;
        div.dataset.id = todo.id;

        const priorityClass = {
            high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }[todo.priority];

        const titleClass = `title font-semibold break-all text-gray-800 dark:text-white mb-2 line-clamp-2${todo.status === 'done' ? ' line-through' : ''}`;

        // 더보기(⋮) 아이콘 및 삭제 메뉴
        const moreMenu = `
            <div class="absolute top-2 right-2 z-1">
                <button class="more-btn p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="1.5"/>
                        <circle cx="12" cy="12" r="1.5"/>
                        <circle cx="12" cy="18" r="1.5"/>
                    </svg>
                </button>
                <div class="more-menu hidden absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700">
                    <button class="delete-btn w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">삭제</button>
                </div>
            </div>
        `;

        div.innerHTML = `
            ${moreMenu}
            <div class="${titleClass}">${todo.title}</div>
            <div class="meta text-sm text-gray-600 dark:text-gray-300 flex flex-wrap gap-2 items-center">
                <span class="priority-badge px-2 py-1 rounded-full text-xs font-medium ${priorityClass}">${this.getPriorityText(todo.priority)}</span>
                <span class="creator">${todo.creator}</span>
                ${todo.dueDate ? `<span class="duedate text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-gray-700 dark:text-gray-200">마감일: ${this.formatDate(todo.dueDate)}</span>` : ''}
            </div>
        `;

        // 더보기 메뉴 토글
        const moreBtn = div.querySelector('.more-btn');
        const moreMenuDiv = div.querySelector('.more-menu');
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.more-menu').forEach(menu => {
                if (menu !== moreMenuDiv) menu.classList.add('hidden');
            });
            moreMenuDiv.classList.toggle('hidden');
        });
        // 카드 바깥 클릭 시 메뉴 닫기
        document.addEventListener('click', (e) => {
            if (!div.contains(e.target)) {
                moreMenuDiv.classList.add('hidden');
            }
        });
        // 삭제 메뉴 클릭 시 삭제 확인 모달 표시
        const deleteBtn = div.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moreMenuDiv.classList.add('hidden');
            this.showDeleteConfirmModal(todo.id);
        });

        div.addEventListener('click', (e) => {
            if (!this.draggedTodoId && !moreMenuDiv.contains(e.target) && !moreBtn.contains(e.target)) this.showTodoDetail(todo);
        });
        div.addEventListener('dragstart', (e) => this.handleDragStart(e));
        div.addEventListener('dragend', (e) => this.handleDragEnd(e));
        div.addEventListener('dragover', (e) => this.handleCardDragOver(e, todo.id));
        div.addEventListener('dragleave', (e) => this.handleCardDragLeave(e, todo.id));
        div.addEventListener('drop', (e) => this.handleCardDrop(e, todo.id));

        return div;
    }

    setupDragAndDrop() {
        const lists = document.querySelectorAll('[id$="List"]');
        lists.forEach(list => {
            list.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.dragOverListId = list.id;
                list.classList.add('drag-over');
            });
            list.addEventListener('dragleave', () => {
                list.classList.remove('drag-over');
                this.dragOverListId = null;
            });
            list.addEventListener('drop', (e) => {
                e.preventDefault();
                list.classList.remove('drag-over');
                this.handleListDrop(list.id);
            });
        });
    }

    handleDragStart(e) {
        this.draggedTodoId = e.target.dataset.id;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedTodoId = null;
        this.dragOverTodoId = null;
        this.dragOverListId = null;
        document.querySelectorAll('.todo-card').forEach(card => card.classList.remove('drag-over'));
    }

    handleCardDragOver(e, overTodoId) {
        e.preventDefault();
        if (this.draggedTodoId === overTodoId) return;
        this.dragOverTodoId = overTodoId;
        document.querySelectorAll('.todo-card').forEach(card => card.classList.remove('drag-over'));
        const overCard = document.querySelector(`.todo-card[data-id='${overTodoId}']`);
        if (overCard) overCard.classList.add('drag-over');
    }

    handleCardDragLeave(e, overTodoId) {
        if (this.dragOverTodoId === overTodoId) {
            this.dragOverTodoId = null;
            const overCard = document.querySelector(`.todo-card[data-id='${overTodoId}']`);
            if (overCard) overCard.classList.remove('drag-over');
        }
    }

    handleCardDrop(e, overTodoId) {
        e.preventDefault();
        if (!this.draggedTodoId || this.draggedTodoId === overTodoId) return;
        const todos = Storage.getTodos();
        const draggedIdx = todos.findIndex(t => t.id === this.draggedTodoId);
        const overIdx = todos.findIndex(t => t.id === overTodoId);
        if (draggedIdx === -1 || overIdx === -1) return;
        const draggedTodo = todos[draggedIdx];
        const overTodo = todos[overIdx];
        const overCard = document.querySelector(`.todo-card[data-id='${overTodoId}']`);
        if (overCard) overCard.classList.remove('drag-over');

        let targetStatus = overTodo.status;
        if (this.dragOverListId) {
            targetStatus = this.dragOverListId.replace('List', '');
        }

        if (draggedTodo.status === targetStatus) {
            const [item] = todos.splice(draggedIdx, 1);
            const newOverIdx = todos.findIndex(t => t.id === overTodoId);
            todos.splice(newOverIdx, 0, item);
        } else {
            draggedTodo.status = targetStatus;
            todos.splice(draggedIdx, 1);
            const filtered = todos.filter(t => t.status === targetStatus);
            const filteredIdx = filtered.findIndex(t => t.id === overTodoId);
            let insertIdx = todos.findIndex((t, i) => t.status === targetStatus && filteredIdx === 0 ? true : filteredIdx === 0);
            if (insertIdx === -1) insertIdx = todos.length;
            todos.splice(insertIdx, 0, draggedTodo);
        }

        Storage.saveTodos(todos);
        this.loadTodos();
        this.draggedTodoId = null;
        this.dragOverTodoId = null;
        this.dragOverListId = null;
        // 필터 초기화
        if (window.app && typeof window.app.resetFilters === 'function') {
            window.app.resetFilters();
        }
    }

    handleListDrop(listId) {
        if (!this.draggedTodoId) return;
        const newStatus = listId.replace('List', '');
        this.moveTodoToList(this.draggedTodoId, newStatus);
        this.draggedTodoId = null;
        this.dragOverListId = null;
        this.dragOverTodoId = null;
        document.querySelectorAll('.todo-card').forEach(card => card.classList.remove('drag-over'));
        // 필터 초기화
        if (window.app && typeof window.app.resetFilters === 'function') {
            window.app.resetFilters();
        }
    }

    reorderTodos(draggedId, overId) {
        const todos = Storage.getTodos();
        const draggedIdx = todos.findIndex(t => t.id === draggedId);
        const overIdx = todos.findIndex(t => t.id === overId);
        if (draggedIdx === -1 || overIdx === -1) return;
        if (todos[draggedIdx].status !== todos[overIdx].status) return;
        const [draggedTodo] = todos.splice(draggedIdx, 1);
        todos.splice(overIdx, 0, draggedTodo);
        Storage.saveTodos(todos);
        this.loadTodos();
    }

    moveTodoToList(todoId, newStatus) {
        const todos = Storage.getTodos();
        const idx = todos.findIndex(t => t.id === todoId);
        if (idx === -1) return;
        todos[idx].status = newStatus;
        const [todo] = todos.splice(idx, 1);
        let insertIdx = todos.reduce((acc, t, i) => (t.status === newStatus ? i + 1 : acc), 0);
        if (insertIdx < 0) insertIdx = 0;
        todos.splice(insertIdx, 0, todo);
        Storage.saveTodos(todos);
        this.loadTodos();
    }

    showTodoDetail(todo) {
        const modalInstance = new Modal('todoModal');
        modalInstance.show(todo);
    }

    formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getPriorityText(priority) {
        const texts = {
            high: '높음',
            medium: '중간',
            low: '낮음'
        };
        return texts[priority] || priority;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    filterTodos(filters) {
        let filteredTodos = [...this.todos];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredTodos = filteredTodos.filter(todo => 
                todo.title.toLowerCase().includes(searchLower) ||
                todo.content.toLowerCase().includes(searchLower) ||
                todo.creator.toLowerCase().includes(searchLower)
            );
        }

        if (filters.priority) {
            filteredTodos = filteredTodos.filter(todo => 
                todo.priority === filters.priority
            );
        }

        if (filters.creator) {
            filteredTodos = filteredTodos.filter(todo => todo.creator === filters.creator);
        }

        return filteredTodos;
    }

    showDeleteConfirmModal(todoId) {
        const modal = document.getElementById('deleteConfirmModal');
        const cancelBtn = document.getElementById('deleteCancelBtn');
        const confirmBtn = document.getElementById('deleteConfirmBtn');
        modal.classList.remove('hidden');
        // 기존 이벤트 제거 후 재등록
        cancelBtn.onclick = () => { modal.classList.add('hidden'); };
        confirmBtn.onclick = () => {
            Storage.deleteTodo(todoId);
            modal.classList.add('hidden');
            this.loadTodos();
        };
    }
} 
class App {
    constructor() {
        this.todo = new Todo();
        this.modal = new Modal('todoModal');
        this.calendar = null;
        this.filters = {
            search: '',
            priority: '',
            creator: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupThemeToggle();
        this.populateCreatorFilter();
    }

    setupEventListeners() {
        // 새 할일 버튼
        document.getElementById('newTodoBtn').addEventListener('click', () => {
            this.modal.show();
        });

        // 검색 필터
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.applyFilters();
        });

        // 우선순위 필터
        document.getElementById('priorityFilter').addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.applyFilters();
        });

        // 만든이 필터
        document.getElementById('creatorFilter').addEventListener('change', (e) => {
            this.filters.creator = e.target.value;
            this.applyFilters();
        });

        // 기간 선택 필터 (팝업)
        const calendarPopup = document.getElementById('modalDueCalendarPopup');

        // 외부 클릭 시 캘린더 닫기
        document.addEventListener('click', (e) => {
            if (!modalDueDatePicker.contains(e.target)) {
                calendarPopup.classList.add('hidden');
            }
        });

        // 모달 제출 이벤트
        this.modal.onSubmit((formData) => {
            if (formData.id) {
                Storage.updateTodo(formData.id, formData);
            } else {
                Storage.addTodo(formData);
            }
            this.todo.loadTodos();
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const sunIcon = document.getElementById('sunIcon');
        const moonIcon = document.getElementById('moonIcon');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        function updateThemeIcon() {
            const isDark = document.documentElement.classList.contains('dark');
            if (sunIcon && moonIcon) {
                sunIcon.style.display = isDark ? 'none' : '';
                moonIcon.style.display = isDark ? '' : 'none';
            }
        }

        // 초기 테마 설정
        if (localStorage.theme === 'dark' || (!localStorage.theme && prefersDark.matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        updateThemeIcon();

        // 테마 토글 이벤트
        themeToggle.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
            } else {
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
            }
            updateThemeIcon();
        });
    }

    populateCreatorFilter() {
        const creatorFilter = document.getElementById('creatorFilter');
        if (!creatorFilter) return;
        // 기존 옵션 초기화
        creatorFilter.innerHTML = '<option value="">만든이</option>';
        // localStorage에서 모든 Todo의 고유한 만든이 값 추출
        const todos = Storage.getTodos();
        const creators = [...new Set(todos.map(todo => todo.creator).filter(Boolean))];
        creators.forEach(creator => {
            const option = document.createElement('option');
            option.value = creator;
            option.textContent = creator;
            creatorFilter.appendChild(option);
        });
    }

    applyFilters() {
        const filteredTodos = this.todo.filterTodos(this.filters);
        this.todo.renderTodos(filteredTodos);
    }

    formatDate(date) {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    resetFilters() {
        this.filters = { search: '', priority: '', creator: '' };
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        const priorityFilter = document.getElementById('priorityFilter');
        if (priorityFilter) priorityFilter.value = '';
        const creatorFilter = document.getElementById('creatorFilter');
        if (creatorFilter) creatorFilter.value = '';
        this.applyFilters();
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    window.app = app;
}); 
class Calendar {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            onSelect: () => {},
            onApply: () => {},
            onCancel: () => {},
            singleDateMode: true, // 항상 단일 날짜 선택만 가능
            ...options
        };
        this.selectedDates = [];
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

        let html = `
            <div class="calendar bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 w-56">
                <div class="calendar-header flex justify-between items-center mb-2">
                    <button class="calendar-nav-btn p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs">&lt;</button>
                    <span class="calendar-title text-base font-semibold text-gray-800 dark:text-white">${year}년 ${monthNames[month]}</span>
                    <button class="calendar-nav-btn p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs">&gt;</button>
                </div>
                <div class="calendar-weekdays grid grid-cols-7 gap-1 mb-1">
                    ${weekDays.map(day => `<div class="calendar-weekday text-center text-xs font-medium text-gray-500 dark:text-gray-400">${day}</div>`).join('')}
                </div>
                <div class="calendar-days grid grid-cols-7 gap-1">
        `;

        for (let i = 0; i < startingDay; i++) {
            html += '<div class="calendar-day text-center p-1 rounded cursor-pointer text-gray-400 cursor-not-allowed"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = this.isDateSelected(date);
            const isToday = this.isToday(date);
            let classes = 'calendar-day text-center p-1 rounded cursor-pointer text-xs ';
            if (isSelected) classes += 'bg-blue-500 text-white ';
            else classes += 'hover:bg-gray-100 dark:hover:bg-gray-700 ';
            if (isToday) classes += 'border-2 border-blue-500 ';

            html += `<div class="${classes}" data-date="${date.toISOString()}">${day}</div>`;
        }

        html += `
                </div>
                <div class="calendar-footer mt-2 flex justify-between items-center">
                    <div class="calendar-actions flex space-x-1">
                        <button type="button" class="calendar-action-btn cancel px-2 py-1 text-xs rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">취소</button>
                        <button type="button" class="calendar-action-btn apply px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:text-white">적용</button>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-300">
                        ${this.selectedDates.length === 1 ? `${this.formatDate(this.selectedDates[0])}` : '날짜를 선택하세요'}
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    attachEventListeners() {
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-day') && !e.target.classList.contains('text-gray-400')) {
                const date = new Date(e.target.dataset.date);
                this.toggleDateSelection(date);
                this.render();
            } else if (e.target.classList.contains('calendar-nav-btn')) {
                if (e.target.textContent === '<') {
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                } else {
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                }
                this.render();
            } else if (e.target.classList.contains('apply')) {
                this.options.onApply(this.selectedDates);
            } else if (e.target.classList.contains('cancel')) {
                this.selectedDates = [];
                this.options.onCancel();
                this.render();
            }
        });
    }

    toggleDateSelection(date) {
        const dateStr = date.toISOString();
        if (this.selectedDates.length === 1 && this.selectedDates[0].toISOString() === dateStr) {
            this.selectedDates = [];
        } else {
            this.selectedDates = [date];
        }
    }

    isDateSelected(date) {
        return this.selectedDates.some(d =>
            d.getFullYear() === date.getFullYear() &&
            d.getMonth() === date.getMonth() &&
            d.getDate() === date.getDate()
        );
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    getSelectedDates() {
        return [...this.selectedDates];
    }

    clearSelection() {
        this.selectedDates = [];
        this.render();
    }

    formatDate(date) {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
} 
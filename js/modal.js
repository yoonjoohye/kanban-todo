class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.form = this.modal.querySelector('form');
        this.cancelBtn = this.modal.querySelector('#cancelBtn');
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.setupDueDatePicker();
    }

    attachEventListeners() {
        this.cancelBtn.addEventListener('click', () => this.hide());
    
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = this.getFormData();
            if (this.validateForm(formData)) {
                this.onSubmit(formData);
                this.hide();
            } 
        });
    }

    setupDueDatePicker() {
        let dueDateBtn = this.form.querySelector('#modalDueDateBtn');
        let dueCalendarPopup = this.form.querySelector('#modalDueCalendarPopup');
        let dueDateText = this.form.querySelector('#modalDueDateText');
        let dueDateInput = this.form.querySelector('#dueDate');
        let dueDatePicker = this.form.querySelector('#modalDueDatePicker');

        // document 클릭 핸들러를 함수로 분리(참조 유지)
        const closeCalendarOnClick = (e) => {
            if (!dueDatePicker.contains(e.target) && !dueCalendarPopup.contains(e.target)) {
                dueCalendarPopup.classList.add('hidden');
                document.removeEventListener('click', closeCalendarOnClick);
            }
        };

        dueDateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
                dueCalendarPopup.classList.remove('hidden');
                
                // 매번 새로운 캘린더 인스턴스 생성
                const calendarInstance = new Calendar(dueCalendarPopup, {
                    onApply: (dates) => {
                        dueDateInput = this.form.querySelector('#dueDate');
                        if (dates && dates[0]) {
                            const d = dates[0];
                            const yyyy = d.getFullYear();
                            const mm = String(d.getMonth() + 1).padStart(2, '0');
                            const dd = String(d.getDate()).padStart(2, '0');
                            const ymd = `${yyyy}-${mm}-${dd}`;
                            if (dueDateInput) dueDateInput.value = ymd;
                            if (dueDateText) dueDateText.textContent = this.formatDate(d);
                        }
                        dueCalendarPopup.classList.add('hidden');
                        document.removeEventListener('click', closeCalendarOnClick);
                    },
                    onCancel: () => {
                        dueCalendarPopup.classList.add('hidden');
                        document.removeEventListener('click', closeCalendarOnClick);
                    }
                });
                
                // 기존 값이 있으면 캘린더에 반영
                if (dueDateInput && dueDateInput.value) {
                    let dateStr = dueDateInput.value;
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                        const d = new Date(dateStr);
                        if (!isNaN(d)) dateStr = d.toISOString().slice(0, 10);
                        else dateStr = '';
                    }
                    if (dateStr) {
                        const dateObj = new Date(dateStr + 'T00:00:00');
                        if (!isNaN(dateObj)) {
                            calendarInstance.selectedDates = [dateObj];
                            calendarInstance.currentDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
                        } else {
                            calendarInstance.selectedDates = [];
                        }
                    } else {
                        calendarInstance.selectedDates = [];
                    }
                    calendarInstance.render();
                } else {
                    calendarInstance.selectedDates = [];
                    calendarInstance.render();
                }
                dueCalendarPopup.addEventListener('click', e => e.stopPropagation());
                document.addEventListener('click', closeCalendarOnClick);
            
        });

        // 모달이 닫힐 때 캘린더 팝업도 닫고 document 클릭 이벤트 해제
        this.hideCalendarPopup = () => {
            if (dueCalendarPopup) dueCalendarPopup.classList.add('hidden');
            document.removeEventListener('click', closeCalendarOnClick);
        };
    }

    formatDate(date) {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    show(data = null) {
        this.modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        // 모든 에러 메시지/빨간 테두리 제거
        this.form.querySelectorAll('.error-message').forEach(el => el.remove());
        this.form.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
        
        if (data) {
            this.fillForm(data);
        } else {
            this.form.reset();
            // 마감일 input/텍스트도 명확히 초기화
            const dueDateInput = this.form.querySelector('#dueDate');
            if (dueDateInput) dueDateInput.value = '';
            const dueDateText = this.form.querySelector('#modalDueDateText');
            if (dueDateText) dueDateText.textContent = '마감일 선택';
        }
    }

    hide() {
        this.form.reset();
        this.modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        // 마감일 input/텍스트도 초기화
        const dueDateInput = this.form.querySelector('#dueDate');
        if (dueDateInput) dueDateInput.value = '';
        const dueDateText = this.form.querySelector('#modalDueDateText');
        if (dueDateText) dueDateText.textContent = '마감일 선택';
        // 모든 에러 메시지/빨간 테두리 제거
        this.form.querySelectorAll('.error-message').forEach(el => el.remove());
        this.form.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
        // 마감일 캘린더 팝업도 닫기 및 document 클릭 이벤트 해제
        if (typeof this.hideCalendarPopup === 'function') this.hideCalendarPopup();
    }

    getFormData() {
        // dueDate는 항상 'YYYY-MM-DD'만 저장
        const dueDateInput = this.form.querySelector('#dueDate');
        let dueDate = dueDateInput ? dueDateInput.value : '';
        if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
            const d = new Date(dueDate);
            if (!isNaN(d)) dueDate = d.toISOString().slice(0, 10);
            else dueDate = '';
        }
        return {
            creator: this.form.querySelector('#creator').value,
            title: this.form.querySelector('#title').value,
            content: this.form.querySelector('#content').value,
            priority: this.form.querySelector('#priority').value,
            status: this.form.querySelector('#status').value,
            dueDate,
            id: this.form.querySelector('#todoId') ? this.form.querySelector('#todoId').value : undefined
        };
    }

    fillForm(data) {
        Object.keys(data).forEach(key => {
            const input = this.form.querySelector(`#${key}`);
            if (input) {
                if (key === 'dueDate') {
                    if (data.dueDate instanceof Date) {
                        input.value = data.dueDate.toISOString().slice(0, 10);
                    } else if (typeof data.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.dueDate)) {
                        input.value = data.dueDate;
                    } else if (typeof data.dueDate === 'string') {
                        const d = new Date(data.dueDate);
                        if (!isNaN(d)) input.value = d.toISOString().slice(0, 10);
                        else input.value = '';
                    } else {
                        input.value = '';
                    }
                } else {
                    input.value = data[key];
                }
            }
        });
        let idInput = this.form.querySelector('#todoId');
        if (!idInput) {
            idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.id = 'todoId';
            idInput.name = 'id';
            this.form.appendChild(idInput);
        }
        idInput.value = data.id || '';
        // 마감일 텍스트 세팅
        const dueDateText = this.form.querySelector('#modalDueDateText');
        const dueDateInput = this.form.querySelector('#dueDate');
        if (dueDateText && dueDateInput) {
            if (data.dueDate) {
                let dateStr = data.dueDate;
                if (data.dueDate instanceof Date) {
                    dateStr = data.dueDate.toISOString().slice(0, 10);
                } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dueDate)) {
                    const d = new Date(data.dueDate);
                    if (!isNaN(d)) dateStr = d.toISOString().slice(0, 10);
                    else dateStr = '';
                }
                dueDateInput.value = dateStr;
                dueDateText.textContent = dateStr ? this.formatDate(new Date(dateStr + 'T00:00:00')) : '마감일 선택';
            } else {
                dueDateInput.value = '';
                dueDateText.textContent = '마감일 선택';
            }
        }
    }

    validateForm(data) {
        let isValid = true;
        const requiredFields = ['title', 'content', 'creator', 'priority', 'status', 'dueDate'];

        requiredFields.forEach(field => {
            if (!data[field]) {
                this.showError(field, '이 필드는 필수입니다.');
                isValid = false;
            } else {
                this.clearError(field);
            }
        });

        return isValid;
    }

    showError(field, message) {
        const input = this.form.querySelector(`#${field}`);
        const errorDiv = input.parentElement.querySelector('.error-message') || 
            document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        if (!input.parentElement.querySelector('.error-message')) {
            input.parentElement.appendChild(errorDiv);
        }
        input.classList.add('border-red-500');
    }

    clearError(field) {
        const input = this.form.querySelector(`#${field}`);
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('border-red-500');
    }

    onSubmit(callback) {
        this.onSubmit = callback;
    }
} 
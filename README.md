# 📝 To-Do APP (Kanban Board)

### 소개 (Introduction)

Jira의 칸반보드 스타일을 모티브로 만든 반응형 To-Do 관리 앱입니다.
간편한 할 일 관리와 협업, 효율적인 상태/우선순위 관리, 그리고 모바일·PC 어디서나 최적화된 UI/UX를 제공합니다.

### 주요 기능 (Features)
	•	여러 사용자 지원: 만든이, 수정자, 작업별 메타데이터 관리
	•	칸반보드 구조: 할일, 진행중, 완료, 보류 상태별 리스트와 카드 UI
	•	드래그 앤 드랍: 카드 간 순서/상태 이동 (Drag&Drop)
	•	로컬스토리지 기반 데이터 관리: todo 생성, 수정, 삭제 (모두 브라우저에 저장)
	•	카드 상세/수정/삭제: 카드 별 더보기 메뉴, 모달 확인창
	•	검색/필터: 제목/내용 검색, 우선순위·상태 필터
	•	반응형 레이아웃: PC/태블릿/모바일 모두 대응, 모바일에선 가로 스크롤/풀 모달 적용
	•	다크/라이트 모드: 토글로 즉시 테마 변경
	•	유효성 검사: 제목/내용 미입력 시 알림
	•	메타 정보: 생성일(불변), 마지막 수정일, 작업기간 등 관리
	•	상태값 색상: 할일(회색), 진행중(파랑), 완료(초록), 보류(회색)

### 기술 스택 (tech Stack)
	•	HTML5 / CSS3
	•	JavaScript (Vanilla JS)
	•	Tailwind CSS
  •	localstorage
	•	(추가 라이브러리 없이, 오버엔지니어링 없이 구현)

### 폴더/파일 구조 예시 (File Structure)
/public
  └─ favicon.ico
/src
  ├─ index.html
  ├─ css/
  │    └─ style.css
  ├─ js/
  │    ├─ storage.js      # localStorage 관련 함수
  │    ├─ app.js     # todo 검색, 필터
  │    ├─ modal.js        # 상세 모달
  │    ├─ calendar.js     # 캘린더 구현
  │    └─  todo.js       # todo 함수 드래그 앤 드랍 기능
  └─ README.md

### 스크린샷

<img width="1728" alt="스크린샷 2025-06-01 오후 12 45 38" src="https://github.com/user-attachments/assets/48011b52-5c8a-4b77-ad47-9d5a589107de" />
<img width="1725" alt="스크린샷 2025-06-01 오후 12 45 52" src="https://github.com/user-attachments/assets/f03bc7cc-384d-411f-828a-896aafecbf94" />
<img width="1715" alt="스크린샷 2025-06-01 오후 12 46 02" src="https://github.com/user-attachments/assets/b3f48468-18b6-4452-b355-4062e433248f" />
<img width="1719" alt="스크린샷 2025-06-01 오후 12 46 13" src="https://github.com/user-attachments/assets/ff64e898-91a7-460b-8c2d-719bc2733059" />
<img width="1705" alt="스크린샷 2025-06-01 오후 12 46 38 (1)" src="https://github.com/user-attachments/assets/08ab846f-da06-4c6a-b8f4-726428168623" />
<img width="1728" alt="스크린샷 2025-06-01 오후 12 46 29" src="https://github.com/user-attachments/assets/61a79410-54a0-4031-a47d-a5e04b94b631" />
<img width="387" alt="스크린샷 2025-06-01 오후 12 47 11" src="https://github.com/user-attachments/assets/942e9339-c109-4df0-aede-fe9fe7ccd628" />

  

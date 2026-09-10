// ==========================================
// 1. 글로벌 상태(Data & State) 관리
// ==========================================

// [원본 복사] db.js의 initialTodos 알맹이만 꺼내서 작업용 배열 'todos' 생성 (전개 연산자 사용)
// 원본 데이터 오염을 방지하고, 자유롭게 추가/수정/삭제하기 위함
const todos = [...initialTodos];

// [수정 상태] 현재 어떤 카드가 수정 중인지 번호(index)를 기록하는 변수
// null: 아무것도 수정 중이지 않은 평소 상태
// 숫자(0, 1...): 해당 인덱스의 카드가 수정 모드임을 의미
let editIndex = null;

// 앱이 실행되자마자 화면에 초기 데이터를 그려줍니다.
renderTodos();


// ==========================================
// 2. HTML 템플릿 생성 함수 (UI 조각 만들기)
// ==========================================
// 데이터(task, category)와 위치 번호(index)를 받아 개별 카드 HTML 문자열을 리턴합니다.
function getTodoTemplate(task, category, index) {
    
    // [분기 1] 만약 현재 그리려는 카드의 index가 editIndex(수정 상태 번호)와 같다면? -> 수정용 Input 화면 반환
    // 기존 값이 입력창 안에 미리 들어있도록 value="${category}" 설정
    // 저장할 때 어떤 항목인지 알아야 하므로 index를 함수 인자로 전달
    // 1) 수정 모드일 때
    if (index === editIndex) {
        return `<div class="todo-card">
    <div>
        <input type="text" id="editCategoryInput" value="${category}">
        <input type="text" id="editTaskInput" value="${task}">
    </div>
    <!-- 버튼들을 todo-card-buttons 클래스로 감싸줍니다 -->
    <div class="todo-card-buttons">
        <button onclick="saveTodo(${index})" title="Done">Done</button>
        <button onclick="cancelEdit()" title="Cancel">Cancel</button>
    </div>
</div>
`;
    }

    // 2) 일반 모드일 때
    return `<div class="todo-card">
    <div>
        <h3>${category}</h3>
        <p>${task}</p>
    </div>
    <!-- 버튼들을 todo-card-buttons 클래스로 감싸줍니다 -->
    <div class="todo-card-buttons">
        <button onclick="startEdit(${index})" title="Edit">Edit</button>
        <button onclick="deleteTodo(${index})" title="Delete">Delete</button>
    </div>
</div>
`;
}

// ==========================================
// 3. 화면 렌더링 함수 (Read)
// ==========================================
// todos 배열의 최신 데이터를 읽어서 화면(DOM)을 전체적으로 새로 그려주는 핵심 함수
function renderTodos() {
    // HTML 요소를 담는 변수는 참조 주소가 바뀌지 않으므로 const 사용 (DOM 참조 변수는 Ref 접미사)
    const outputRef = document.getElementById('output');

    // 생성된 HTML 문자열들을 덧붙여서 누적할 변수 (값이 계속 바뀌므로 let)
    let todosHTML = '';

    // 배열의 길이만큼 순회하며 각 데이터와 인덱스(i)를 템플릿 함수에 전달
    for (let i = 0; i < todos.length; i++) {
        todosHTML += getTodoTemplate(todos[i].task, todos[i].category, i);
    }

    // 완성된 전체 HTML 문자열을 화면 output 영역에 한 번에 주입
    outputRef.innerHTML = todosHTML;
}


// ==========================================
// 4. CRUD 주요 기능 함수들
// ==========================================

// [C - Create] 새로운 할 일 추가 함수
function addTodo() {
    // 입력창 DOM 요소 가져오기
    const taskInputRef = document.getElementById('taskInput');
    const categoryInputRef = document.getElementById('categoryInput');

    // 입력창에 작성된 실제 텍스트 값 추출
    const taskValue = taskInputRef.value;
    const categoryValue = categoryInputRef.value;

    // 예외 처리: 앞뒤 공백 제거(.trim()) 후 빈값 체크
    if (taskValue.trim() === '' || categoryValue.trim() === '') {
        alert('No Contents!');
        return; // 빈값이면 여기서 함수 종료
    }

    // todos 배열 끝에 새로운 객체 형태로 데이터 추가
    todos.push({
        task: taskValue,
        category: categoryValue
    });

    // 입력 완료 후 input 입력창 깨끗하게 비우기
    taskInputRef.value = '';
    categoryInputRef.value = '';

    // 데이터가 변했으므로 화면을 다시 그려 업데이트
    renderTodos();
}


// [D - Delete] 특정 위치의 할 일 삭제 함수
function deleteTodo(index) {
    // splice(시작위치, 지울개수): todos 배열에서 index 번호의 항목 1개 지우기
    todos.splice(index, 1);

    // 삭제된 데이터를 반영하기 위해 화면 새로 그리기
    renderTodos();
}


// [U - Update 1] 수정 모드 시작 함수
function startEdit(index) {
    // 수정할 카드의 위치 번호를 editIndex에 저장
    editIndex = index; 
    
    // 화면을 새로 그려서 해당 카드가 input 창으로 바뀌도록 유도
    renderTodos();     
}


// [U - Update 2] 수정 변경사항 저장 함수
function saveTodo(index) {
    // 수정용 input 요소 참조 가져오기
    const editTaskInputRef = document.getElementById('editTaskInput');
    const editCategoryInputRef = document.getElementById('editCategoryInput');

    // 사용자가 새롭게 입력한 값 추출
    const updatedTask = editTaskInputRef.value;
    const updatedCategory = editCategoryInputRef.value;

    // 예외 처리: 수정 내용이 빈값인지 검사
    if (updatedTask.trim() === '' || updatedCategory.trim() === '') {
        alert('No Contents!');
        return;
    }

    // todos 배열의 특정 인덱스 데이터 자체를 새 값으로 덮어씌우기
    todos[index].task = updatedTask;
    todos[index].category = updatedCategory;

    // 수정 완료 후 수정 모드 해제 (null)
    editIndex = null;
    
    // 변경된 데이터를 화면에 반영
    renderTodos();
}


// [U - Update 3] 수정 취소 함수
function cancelEdit() {
    // 아무것도 수정하지 않고 수정 모드만 해제
    editIndex = null;
    
    // 기존 일반 카드로 돌아오도록 화면 새로 그리기
    renderTodos();
}
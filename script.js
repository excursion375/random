// --- 로컬스토리지 키 이름 설정 ---
const STORAGE_KEY = 'classroom_students';

// --- 상태 관리 ---
// 브라우저 로컬스토리지에 저장된 명단이 있으면 불러오고, 없으면 빈 배열로 시작합니다.
let students = loadStudents(); 
let isRolling = false; // 뽑기 진행 여부 플래그

// --- DOM 요소 참조 ---
const nameInput = document.getElementById('nameInput');
const addBtn = document.getElementById('addBtn');
const pickBtn = document.getElementById('pickBtn');
const resetBtn = document.getElementById('resetBtn');
const resultText = document.getElementById('resultText');
const studentList = document.getElementById('studentList');
const studentCount = document.getElementById('studentCount');

// --- 이벤트 리스너 등록 ---
addBtn.addEventListener('click', handleAddStudent);
nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleAddStudent();
  }
});
pickBtn.addEventListener('click', handlePickPresenter);
resetBtn.addEventListener('click', handleResetAll);

// --- 로컬스토리지 관련 함수 ---

// 1. 저장소에서 명단 불러오기
function loadStudents() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  return savedData ? JSON.parse(savedData) : [];
}

// 2. 현재 명단을 저장소에 동기화하기
function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// --- 주요 기능 함수 ---

// 1. 학생 추가 처리
function handleAddStudent() {
  const name = nameInput.value.trim();

  if (!name) {
    alert('학생 이름을 입력해 주세요! ✏️');
    nameInput.focus();
    return;
  }

  // 명단에 추가 및 로컬스토리지 저장
  students.push(name);
  saveStudents();
  renderStudentList();

  // 입력창 초기화 및 포커스 유지
  nameInput.value = '';
  nameInput.focus();
}

// 2. 학생 개별 삭제
function handleDeleteStudent(index) {
  if (isRolling) return; // 뽑기 중 삭제 방지

  students.splice(index, 1);
  saveStudents(); // 변경사항 즉시 저장
  renderStudentList();
}

// 3. 전체 초기화 (확인창 지원)
function handleResetAll() {
  if (students.length === 0) {
    alert('등록된 학생이 없습니다.');
    return;
  }

  const isConfirmed = confirm('정말 모든 학생 명단을 삭제하시겠습니까? 🗑️\n(저장된 데이터도 함께 지워집니다.)');
  if (isConfirmed) {
    students = [];
    localStorage.removeItem(STORAGE_KEY); // 저장소 데이터도 완전히 삭제
    resultText.textContent = '누가 뽑힐까요? 🤔';
    renderStudentList();
  }
}

// 4. 발표자 무작위 뽑기 (애니메이션 효과 포함)
function handlePickPresenter() {
  if (isRolling) return;

  if (students.length === 0) {
    alert('먼저 학생 이름을 등록해 주세요! 🙋‍♂️');
    nameInput.focus();
    return;
  }

  isRolling = true;
  pickBtn.disabled = true;

  let counter = 0;
  const rollDuration = 15; // 롤링 횟수

  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * students.length);
    resultText.textContent = students[randomIndex];
    resultText.classList.remove('pop-effect');
    counter++;

    if (counter >= rollDuration) {
      clearInterval(interval);
      const finalIndex = Math.floor(Math.random() * students.length);
      const chosenStudent = students[finalIndex];

      resultText.textContent = `🎊 ${chosenStudent} 🎊`;
      resultText.classList.add('pop-effect');

      isRolling = false;
      pickBtn.disabled = false;
    }
  }, 70);
}

// 5. 학생 목록 화면 렌더링
function renderStudentList() {
  studentCount.textContent = students.length;
  studentList.innerHTML = '';

  if (students.length === 0) {
    studentList.innerHTML = '<p class="empty-msg">등록된 학생이 없습니다. 이름을 추가해 주세요!</p>';
    return;
  }

  students.forEach((name, index) => {
    const tag = document.createElement('div');
    tag.className = 'student-tag';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-delete';
    delBtn.textContent = '×';
    delBtn.title = '삭제';
    delBtn.addEventListener('click', () => handleDeleteStudent(index));

    tag.appendChild(nameSpan);
    tag.appendChild(delBtn);
    studentList.appendChild(tag);
  });
}

// 페이지가 열리면 저장된 명단을 화면에 표시
renderStudentList();

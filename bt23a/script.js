// ===== Hằng số =====
const MSSV = "231A010265";      // mã sinh viên hiển thị khi bấm nút Người chơi
const TARGET_SIZE = 40;         // kích thước mục tiêu (px)

// ===== Lấy các phần tử trên trang =====
const arena = document.getElementById("arena");          // khu vực chơi
const target = document.getElementById("target");        // mục tiêu hình tròn
const scoreEl = document.getElementById("score");        // ô hiện điểm
const timeEl = document.getElementById("time");          // ô hiện thời gian
const playerEl = document.getElementById("player");      // ô hiện người chơi
const message = document.getElementById("message");      // hộp thông báo
const timeInput = document.getElementById("timeInput");  // ô nhập số giây
const startBtn = document.getElementById("startBtn");    // nút Bắt đầu
const colorBtn = document.getElementById("colorBtn");    // nút Đổi màu nền
const playerBtn = document.getElementById("playerBtn");  // nút Người chơi

// ===== Biến trạng thái =====
let score = 0;          // điểm hiện tại
let timeLeft = 0;       // số giây còn lại
let moveTimer = null;   // hẹn giờ đổi vị trí mục tiêu mỗi 1 giây
let countdown = null;   // hẹn giờ đếm ngược
let playing = false;    // true khi đang chơi

// Đưa mục tiêu tới vị trí ngẫu nhiên trong #arena
function moveTarget() {
    const maxLeft = arena.clientWidth - TARGET_SIZE;   // left lớn nhất để không tràn ra ngoài
    const maxTop = arena.clientHeight - TARGET_SIZE;   // top lớn nhất để không tràn ra ngoài
    target.style.left = Math.floor(Math.random() * maxLeft) + "px";  // gán left ngẫu nhiên
    target.style.top = Math.floor(Math.random() * maxTop) + "px";    // gán top ngẫu nhiên
}

// Đặt lại hẹn giờ: sau mỗi 1 giây mục tiêu tự đổi vị trí
function restartMoveTimer() {
    clearInterval(moveTimer);                   // xóa hẹn giờ cũ
    moveTimer = setInterval(moveTarget, 1000);  // tạo hẹn giờ mới, lặp mỗi 1000ms
}

// Bắt đầu trò chơi
function startGame() {
    const seconds = parseInt(timeInput.value);  // đọc số giây người chơi chọn
    if (isNaN(seconds) || seconds < 5 || seconds > 120) {   // kiểm tra hợp lệ
        message.innerHTML = "Thời gian phải từ 5 đến 120 giây!";  // báo lỗi
        message.style.display = "block";        // hiện thông báo
        return;                                 // dừng, không bắt đầu
    }
    score = 0;                                  // đặt lại điểm
    timeLeft = seconds;                         // gán thời gian đếm ngược
    playing = true;                             // đánh dấu đang chơi
    scoreEl.textContent = score;                // hiển thị điểm 0
    timeEl.textContent = timeLeft;              // hiển thị thời gian
    message.style.display = "none";             // ẩn thông báo
    arena.classList.remove("locked");           // mở khóa khu vực chơi
    startBtn.disabled = true;                   // khóa nút Bắt đầu khi đang chơi
    timeInput.disabled = true;                  // khóa ô nhập thời gian

    target.style.display = "block";             // hiện mục tiêu
    moveTarget();                               // đặt mục tiêu vào vị trí ngẫu nhiên đầu tiên
    restartMoveTimer();                         // bắt đầu đổi vị trí mỗi 1 giây

    countdown = setInterval(function () {       // hẹn giờ đếm ngược mỗi 1 giây
        timeLeft--;                             // giảm 1 giây
        timeEl.textContent = timeLeft;          // cập nhật hiển thị
        if (timeLeft <= 0) {                    // nếu hết giờ
            endGame();                          // kết thúc trò chơi
        }
    }, 1000);
}

// Click trúng mục tiêu
function hitTarget() {
    if (!playing) return;           // không đang chơi thì bỏ qua
    score++;                        // tăng điểm thêm 1
    scoreEl.textContent = score;    // cập nhật điểm trên màn hình
    moveTarget();                   // đổi vị trí mục tiêu ngay lập tức
    restartMoveTimer();             // tính lại 1 giây cho vị trí mới
}

// Kết thúc trò chơi khi đồng hồ về 0
function endGame() {
    playing = false;                    // đánh dấu đã dừng
    clearInterval(countdown);           // dừng đếm ngược
    clearInterval(moveTimer);           // dừng đổi vị trí mục tiêu
    target.style.display = "none";      // ẩn mục tiêu
    arena.classList.add("locked");      // khóa toàn bộ thao tác trong khu vực chơi
    message.innerHTML = "Hết giờ!<br>Tổng điểm của bạn: <b>" + score + "</b>";  // nội dung kết quả
    message.style.display = "block";    // hiện tổng điểm
    startBtn.disabled = false;          // mở lại nút để chơi ván mới
    timeInput.disabled = false;         // mở lại ô nhập thời gian
    startBtn.textContent = "Chơi lại";  // đổi chữ trên nút
}

// Đổi màu nền khu vực chơi ngẫu nhiên
function changeColor() {
    const r = Math.floor(Math.random() * 256);   // thành phần đỏ 0-255
    const g = Math.floor(Math.random() * 256);   // thành phần xanh lá 0-255
    const b = Math.floor(Math.random() * 256);   // thành phần xanh dương 0-255
    arena.style.background = "rgb(" + r + ", " + g + ", " + b + ")";  // gán màu nền mới
}

// Hiển thị mã sinh viên của người chơi
function showPlayer() {
    playerEl.textContent = MSSV;    // ghi MSSV vào ô Người chơi
}

// ===== Gắn sự kiện click cho các nút và mục tiêu =====
startBtn.addEventListener("click", startGame);      // nút Bắt đầu
target.addEventListener("click", hitTarget);        // click vào mục tiêu
colorBtn.addEventListener("click", changeColor);    // nút Đổi màu nền
playerBtn.addEventListener("click", showPlayer);    // nút Người chơi

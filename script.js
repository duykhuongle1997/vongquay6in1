/* --- CẤU HÌNH --- */
// 1. Link Google Script (Dữ liệu khách hàng)
const scriptURL = 'https://script.google.com/macros/s/AKfycbwOt0PSAanA-Tuw0KvSkCAd_cLy5uURPd1wHc2S5QXZORwZ0NpP2Sm6ct61aOPtqP8K4Q/exec'; 

// 2. Link Mua Hàng (Sản phẩm 6in1) - HÃY DÁN LINK CỦA BẠN VÀO DƯỚI ĐÂY
const productLink = 'https://www.cobote.vn/collections/tat-ca-san-pham-cobote'; 

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const resultModal = document.getElementById('resultModal');
const infoModal = document.getElementById('infoModal');
const quizModal = document.getElementById('quizModal');
const rewardModal = document.getElementById('rewardModal');
const playedMsg = document.getElementById('played-msg');

const rewardCloseBtn = document.getElementById('reward-close-btn');
const form = document.forms['submit-to-google-sheet'];
const submitBtn = document.getElementById('submit-btn');
const loadingText = document.getElementById('loading-text');

// Nút trong bảng kết quả
const useNowBtn = document.getElementById('use-now-btn'); 
const copyBtn = document.getElementById('copy-btn');

// Cấu hình góc quay (Voucher 15%)
const targetDegree = 330; 
const totalSpins = 360 * 8; 
const finalRotation = totalSpins + targetDegree;

// --- BIẾN TRẠNG THÁI ---
let isQuizPassed = false;      
let isFormSubmitted = false;   

// --- KHỞI TẠO ---
window.onload = function() {
    if(localStorage.getItem('hasPlayedCobote') === 'true') {
        disableGame();
        return;
    }
    
    if(localStorage.getItem('quizPassed') === 'true') {
        isQuizPassed = true;
    }
    if(localStorage.getItem('formSubmitted') === 'true') {
        isFormSubmitted = true;
    }

    if (!isQuizPassed) {
        quizModal.style.display = "flex";
    }
};

// --- LOGIC TRẢ LỜI CÂU HỎI ---
function checkAnswer(optionIndex) {
    if(optionIndex === 4) {
        isQuizPassed = true;
        localStorage.setItem('quizPassed', 'true');
        quizModal.style.display = "none";
        rewardModal.style.display = "flex";
    } else {
        alert("Chưa chính xác! Tinh chất 6in1 bao gồm tất cả các công dụng trên. Bạn hãy chọn lại nhé!");
    }
}

rewardCloseBtn.addEventListener('click', function() {
    rewardModal.style.display = "none";
});

// --- SỰ KIỆN CLICK NÚT QUAY ---
spinBtn.addEventListener('click', function() {
    if(localStorage.getItem('hasPlayedCobote') === 'true') return;

    if(!isFormSubmitted) {
        infoModal.style.display = "flex";
    } else {
        startSpin();
    }
});

// --- XỬ LÝ GỬI FORM ---
form.addEventListener('submit', e => {
    e.preventDefault();

    if(scriptURL.includes('HÃY_DÁN_LINK')) {
        alert("Lỗi: Chưa dán Link Google Script vào file script.js!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Đang xử lý...";
    loadingText.style.display = "block";

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            loadingText.style.display = "none";
            infoModal.style.display = "none"; 
            isFormSubmitted = true;
            localStorage.setItem('formSubmitted', 'true');
            startSpin(); 
        })
        .catch(error => {
            alert('Lỗi đường truyền! Vui lòng thử lại.');
            submitBtn.disabled = false;
            submitBtn.innerText = "GỬI & QUAY NGAY";
            loadingText.style.display = "none";
        });
});

// --- HÀM QUAY ---
function startSpin() {
    if(localStorage.getItem('hasPlayedCobote') === 'true') {
        alert("Bạn chỉ được quay 1 lần duy nhất!");
        return;
    }

    spinBtn.style.pointerEvents = 'none'; 
    const randomOffset = Math.floor(Math.random() * 10) - 5; 
    const spinValue = finalRotation + randomOffset;
    
    wheel.style.transform = `rotate(${spinValue}deg)`;

    setTimeout(() => {
        showResult();
        localStorage.setItem('hasPlayedCobote', 'true');
        disableGame();
    }, 4000);
}

function showResult() {
    resultModal.style.display = "flex";
}

// --- SỰ KIỆN NÚT KẾT QUẢ ---

// 1. Nút Dùng Ngay
useNowBtn.addEventListener('click', function() {
    window.location.href = productLink;
});

// 2. Nút Copy Mã
copyBtn.addEventListener('click', function() {
    // Lấy nội dung mã từ div
    const codeText = document.getElementById('voucher-code').innerText;
    
    // Tạo một thẻ input ảo để copy
    const tempInput = document.createElement("input");
    tempInput.value = codeText;
    document.body.appendChild(tempInput);
    
    // Chọn nội dung trong thẻ input
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // Cho mobile
    
    // Thực hiện lệnh copy
    document.execCommand("copy");
    
    // Xóa thẻ ảo đi
    document.body.removeChild(tempInput);
    
    // Thông báo cho người dùng (Đổi text nút bấm tạm thời)
    const originalText = copyBtn.innerText;
    copyBtn.innerText = "ĐÃ COPY!";
    copyBtn.style.backgroundColor = "#27ae60"; // Màu xanh lá đậm hơn
    
    setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.backgroundColor = "#2980b9"; // Trả về màu cũ
    }, 2000);
});

function disableGame() {
    spinBtn.style.opacity = "0.5";
    spinBtn.style.pointerEvents = 'none'; 
    playedMsg.style.display = "block"; 

}



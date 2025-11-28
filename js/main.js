// main.js – TỐI ƯU NHẤT CHO THI LTW
// MSSV: 231A010878 – Trương Đỗ Thùy Ngân

const MSSV = "231A010878";
// Kiểm tra số cuối MSSV: Chẵn (8) -> true (RED), Lẻ -> false (BLUE)
const IS_RED = MSSV.slice(-1) % 2 === 0; 
const TODO_STORAGE_KEY = "tasks_" + MSSV;

document.addEventListener("DOMContentLoaded", () => {
    console.log(`main.js loaded for MSSV: ${MSSV}`);

    // === HIỆU ỨNG CHUNG (Tốt, giữ nguyên) ===
    document.querySelectorAll(".home-card, .theory-wrapper > *").forEach((el, i) => {
        el.style.opacity = 0;
        el.style.transform = "translateY(20px)";
        setTimeout(() => {
            el.style.transition = "all 0.7s ease-out " + (i * 0.1) + "s";
            el.style.opacity = 1;
            el.style.transform = "translateY(0)";
        }, 100);
    });

    // ===========================================
    // === BÀI 01: BOOKING SYSTEM LOGIC ===
    // ===========================================
    if (document.getElementById("seatsContainer")) {
        const container = document.getElementById("seatsContainer");
        const countEl = document.getElementById("count");
        const totalEl = document.getElementById("total");
        const modal = document.getElementById("modal");
        const summary = document.getElementById("summary");
        const prices = { standard: 50000, vip: 80000, sweetbox: 150000 };
        let selected = [];

        const updateBookingSummary = () => {
            countEl.textContent = selected.length;
            // Tính tổng tiền bằng reduce và định dạng
            totalEl.textContent = selected.reduce((s, x) => s + prices[x.type], 0).toLocaleString('vi-VN');
        };

        const handleSeatClick = (seat, r, c) => {
            if (seat.classList.contains("sold")) return;
            const key = r + "-" + c;
            
            if (seat.classList.toggle("selected")) {
                if (selected.length >= 5) { 
                    seat.classList.remove("selected"); 
                    alert("⚠️ Cảnh báo: Không cho phép chọn quá 5 ghế trong 1 lần đặt!"); 
                    return; 
                }
                selected.push({ 
                    r, 
                    c, 
                    type: r <= 2 ? "standard" : r <= 4 ? "vip" : "sweetbox", 
                    key 
                });
            } else {
                selected = selected.filter(s => s.key !== key);
            }
            updateBookingSummary();
        };

        const createSeat = (r, c) => {
            const seat = document.createElement("div");
            seat.className = "seat";
            seat.textContent = String.fromCharCode(64 + r); // Hiển thị chữ cái hàng
            
            // Xác định loại ghế và giá
            if (r <= 2) seat.classList.add("standard");
            else if (r <= 4) seat.classList.add("vip");
            else seat.classList.add("sweetbox");
            
            // Ghế đã bán (Giả lập)
            if (Math.random() < 0.22 && r !== 5) seat.classList.add("sold"); // Ghế đôi ít khi bị sold lẻ

            // Thiết lập Data Attributes
            seat.dataset.row = r; 
            seat.dataset.col = c;
            seat.title = `${String.fromCharCode(64+r)}${c} - ${prices[seat.classList.contains("standard") ? "standard" : seat.classList.contains("vip") ? "vip" : "sweetbox"].toLocaleString()}đ`;

            seat.onclick = () => handleSeatClick(seat, r, c);
            return seat;
        };

        // Render ghế
        for (let r = 1; r <= 5; r++) {
            for (let c = 1; c <= 8; c++) {
                container.appendChild(createSeat(r, c));
            }
        }
        
        // Nút Thanh toán
        document.getElementById("payBtn").onclick = () => {
            if (!selected.length) return alert("Vui lòng chọn ghế trước khi thanh toán!");
            
            let html = "<h3>TÓM TẮT VÉ ĐÃ ĐẶT</h3><ul>";
            const finalTotal = selected.reduce((s, x) => s + prices[x.type], 0);

            selected.forEach(s => {
                const name = s.type === "standard" ? "Thường" : s.type === "vip" ? "VIP" : "Đôi";
                html += `<li>Ghế ${String.fromCharCode(64+s.r)}${s.c} (${name}) - ${prices[s.type].toLocaleString('vi-VN')}đ</li>`;
            });

            html += `</ul><div class="modal-footer"><h2>Tổng tiền: <span style='color:var(--selected-color)'>${finalTotal.toLocaleString('vi-VN')}đ</span></h2></div>`;
            summary.innerHTML = html;
            modal.style.display = "flex";
        };

        // Đóng Modal
        document.querySelector(".close-modal").onclick = () => modal.style.display = "none";
        modal.onclick = e => e.target === modal && (modal.style.display = "none");
    }

    // ===========================================
    // === BÀI 02: TODO MATRIX LOGIC ===
    // ===========================================
    if (document.getElementById("taskBoard")) {
        const q = [null, "q1", "q2", "q3", "q4"].map(id => document.getElementById(id));
        const input = document.getElementById("taskName");
        const prio = document.getElementById("priority");
        const addTaskBtn = document.getElementById("addTaskBtn");

        // Hàm xóa task và cập nhật LocalStorage
        const deleteTask = (taskId, taskElement) => {
            taskElement.remove();
            let tasks = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || "[]");
            tasks = tasks.filter(t => t.id !== taskId);
            localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(tasks));
        };

        const createTaskElement = (task) => {
            const div = document.createElement("div");
            div.className = "task";
            div.textContent = task.name;
            div.dataset.id = task.id; 
            div.title = "Click để xóa";
            
            // Logic Chống AI
            if (task.name.length > 10) {
                div.classList.add(IS_RED ? "red" : "blue");
            }

            // Gắn sự kiện xóa
            div.onclick = () => deleteTask(task.id, div);
            return div;
        };

        const addTask = () => {
            const name = input.value.trim();
            if (!name) return alert("Nhập tên công việc!");
            const p = +prio.value;
            
            const task = { 
                id: Date.now(), 
                name, 
                p, 
            };

            // Thêm vào DOM
            q[p].appendChild(createTaskElement(task));

            // Lưu vào LocalStorage
            let tasks = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || "[]");
            tasks.push(task);
            localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(tasks));

            input.value = ""; 
            input.focus();
        };

        // Gắn sự kiện thêm task
        addTaskBtn.onclick = addTask;
        input.onkeypress = e => e.key === "Enter" && addTask();

        // Load tasks cũ (Sau khi các ô ma trận đã được tạo trong DOM)
        const loadTasks = () => {
             JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || "[]").forEach(t => {
                if(q[t.p]) { // Đảm bảo ô ma trận tồn tại
                    q[t.p].appendChild(createTaskElement(t));
                }
            });
        };
        loadTasks();
    }
});
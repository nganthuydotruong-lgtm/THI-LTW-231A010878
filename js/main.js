// main.js – MSSV: 231A010878
const MSSV = "231A010878";
const IS_RED = MSSV.slice(-1) % 2 === 0; // true: Chẵn (Đỏ) | false: Lẻ (Xanh Dương)
const TODO_STORAGE_KEY = "tasks_" + MSSV;

document.addEventListener("DOMContentLoaded", () => {

    // === HIỆU ỨNG CHUNG ===
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
    // === BÀI 01: BOOKING SYSTEM LOGIC (Chỉ chạy trên bai01.html) ===
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
            
            // SỬA LỖI HIỂN THỊ: Hiển thị đầy đủ ký hiệu ghế (ví dụ: A1, C5)
            const seatId = String.fromCharCode(64 + r) + c; 
            seat.textContent = seatId; 
            
            let seatType;
            if (r <= 2) { seat.classList.add("standard"); seatType = "standard"; }
            else if (r <= 4) { seat.classList.add("vip"); seatType = "vip"; }
            else { seat.classList.add("sweetbox"); seatType = "sweetbox"; }
            
            if (Math.random() < 0.22 && r !== 5) seat.classList.add("sold"); 

            seat.dataset.row = r; 
            seat.dataset.col = c;
            seat.dataset.type = seatType;
            seat.title = `${seatId} - ${prices[seatType].toLocaleString('vi-VN')}đ`;

            seat.onclick = () => handleSeatClick(seat, r, c);
            return seat;
        };

        container.style.gridTemplateColumns = `repeat(8, 1fr)`;
        for (let r = 1; r <= 5; r++) {
            for (let c = 1; c <= 8; c++) {
                container.appendChild(createSeat(r, c));
            }
        }
        
        document.getElementById("payBtn").onclick = () => {
            if (!selected.length) return alert("Vui lòng chọn ghế trước khi thanh toán!");
            
            let html = "<h3>TÓM TẮT VÉ ĐÃ ĐẶT</h3><ul>";
            const finalTotal = selected.reduce((s, x) => s + prices[x.type], 0);

            selected.forEach(s => {
                const name = s.type === "standard" ? "Thường" : s.type === "vip" ? "VIP" : "Đôi";
                const seatId = String.fromCharCode(64 + s.r) + s.c;
                html += `<li>Ghế ${seatId} (${name}) - ${prices[s.type].toLocaleString('vi-VN')}đ</li>`;
            });

            html += `</ul><div class="modal-footer"><h2>Tổng tiền: <span style='color:var(--selected-color)'>${finalTotal.toLocaleString('vi-VN')}đ</span></h2></div>`;
            summary.innerHTML = html;
            modal.style.display = "flex";
        };

        document.querySelector(".close-modal").onclick = () => modal.style.display = "none";
        modal.onclick = e => e.target === modal && (modal.style.display = "none");
    }

    // ===========================================
    // === BÀI 02: TODO MATRIX LOGIC (Chỉ chạy trên bai02.html) ===
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
            
            if (task.name.length > 10) {
                div.classList.add(IS_RED ? "red" : "blue");
            }

            // SỬA LỖI: Gọi hàm deleteTask để xóa cả trong LocalStorage
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

            q[p].appendChild(createTaskElement(task));

            let tasks = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || "[]");
            tasks.push(task);
            localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(tasks));

            input.value = ""; 
            input.focus();
        };

        addTaskBtn.onclick = addTask;
        input.onkeypress = e => e.key === "Enter" && addTask();

        const loadTasks = () => {
             JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || "[]").forEach(t => {
                if(q[t.p]) { 
                    q[t.p].appendChild(createTaskElement(t));
                }
            });
        };
        loadTasks();
    }
});

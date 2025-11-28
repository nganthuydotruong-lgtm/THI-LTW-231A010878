const MSSV = "231A010878";
const IS_EVEN = parseInt(MSSV.slice(-1)) % 2 === 0; // true → đỏ

document.addEventListener("DOMContentLoaded", function () {
  console.log("main.js loaded – MSSV:", MSSV);

  // ================= TRANG CHỦ =================
  const homeCard = document.querySelector(".home-card");
  if (homeCard) {
    homeCard.style.opacity = "0";
    homeCard.style.transform = "translateY(30px)";
    setTimeout(() => {
      homeCard.style.transition = "all 0.9s ease-out";
      homeCard.style.opacity = "1";
      homeCard.style.transform = "translateY(0)";
    }, 100);
  }

  // ================= LÝ THUYẾT =================
  const theoryWrapper = document.querySelector(".theory-wrapper");
  if (theoryWrapper) {
    const items = theoryWrapper.querySelectorAll("h2, ul, p, pre, a");
    items.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => {
        el.style.transition = "all 0.7s ease-out " + (i * 0.15) + "s";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 200);
    });
  }

  // ================= BÀI 01 - BOOKING SYSTEM =================
  const seatsContainer = document.getElementById("seatsContainer");
  if (seatsContainer) {
    const countEl = document.getElementById("count");
    const totalEl = document.getElementById("total");
    const modal = document.getElementById("modal");
    const summary = document.getElementById("summary");
    const payBtn = document.getElementById("payBtn");

    const prices = { standard: 50000, vip: 80000, sweetbox: 150000 };
    let selectedSeats = [];

    function renderSeats() {
      seatsContainer.innerHTML = "";
      selectedSeats = [];

      for (let row = 1; row <= 5; row++) {
        for (let col = 1; col <= 8; col++) {
          const seat = document.createElement("div");
          seat.className = "seat";
          seat.textContent = String.fromCharCode(64 + row) + col;
          seat.dataset.row = row;
          seat.dataset.col = col;

          if (row <= 2) seat.classList.add("standard");
          else if (row <= 4) seat.classList.add("vip");
          else seat.classList.add("sweetbox");

          if (Math.random() < 0.22) seat.classList.add("sold");

          seat.addEventListener("click", function () {
            if (this.classList.contains("sold")) return;

            const key = row + "-" + col;
            if (this.classList.contains("selected")) {
              this.classList.remove("selected");
              selectedSeats = selectedSeats.filter(s => s.key !== key);
            } else {
              if (selectedSeats.length >= 5) {
                alert("Chỉ được chọn tối đa 5 ghế!");
                return;
              }
              this.classList.add("selected");
              const type = row <= 2 ? "standard" : row <= 4 ? "vip" : "sweetbox";
              selectedSeats.push({ row, col, type, key });
            }
            updateTotal();
          });

          seatsContainer.appendChild(seat);
        }
      }
      updateTotal();
    }

    function updateTotal() {
      countEl.textContent = selectedSeats.length;
      const total = selectedSeats.reduce((sum, s) => sum + prices[s.type], 0);
      totalEl.textContent = total.toLocaleString("vi-VN");
    }

    function showPayment() {
      if (selectedSeats.length === 0) {
        alert("Vui lòng chọn ít nhất 1 ghế!");
        return;
      }
      let html = "<h3>ĐƠN HÀNG CỦA BẠN</h3><ul>";
      selectedSeats.forEach(s => {
        const name = s.type === "standard" ? "Thường" : s.type === "vip" ? "VIP" : "Ghế đôi";
        html += `<li>Ghế ${String.fromCharCode(64 + s.row)}${s.col} - ${name} - ${prices[s.type].toLocaleString()}đ</li>`;
      });
      html += `</ul><h2 style="color:#0f0">Tổng: ${selectedSeats.reduce((a, s) => a + prices[s.type], 0).toLocaleString()}đ</h2>`;
      summary.innerHTML = html;
      modal.style.display = "flex";
    }

    // Gắn sự kiện cho nút thanh toán
    payBtn.onclick = showPayment;

    // Đóng modal khi click bên ngoài
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.style.display = "none";
    });

    renderSeats();
  }

  // ================= BÀI 02 - TODO MATRIX =================
  const q1 = document.getElementById("q1");
  if (q1) {
    const quadrants = {
      1: q1,
      2: document.getElementById("q2"),
      3: document.getElementById("q3"),
      4: document.getElementById("q4")
    };

    const taskName = document.getElementById("taskName");
    const prioritySelect = document.getElementById("priority");
    const addBtn = document.querySelector(".add-task button");

    function addTask() {
      const name = taskName.value.trim();
      if (!name) {
        alert("Vui lòng nhập tên công việc!");
        return;
      }
      const priority = parseInt(prioritySelect.value);

      const task = {
        id: Date.now(),
        name,
        priority,
        color: name.length > 10 ? (IS_EVEN ? "red" : "blue") : null
      };

      saveTask(task);
      renderTask(task);
      taskName.value = "";
      taskName.focus();
    }

    function renderTask(task) {
      const div = document.createElement("div");
      div.className = "task";
      if (task.color) div.classList.add(task.color);
      div.textContent = task.name;
      div.title = "Click để xóa";

      div.onclick = () => {
        div.remove();
        deleteTask(task.id);
      };

      quadrants[task.priority].appendChild(div);
    }

    function saveTask(task) {
      let tasks = JSON.parse(localStorage.getItem("tasks_" + MSSV) || "[]");
      tasks.push(task);
      localStorage.setItem("tasks_" + MSSV, JSON.stringify(tasks));
    }

    function deleteTask(id) {
      let tasks = JSON.parse(localStorage.getItem("tasks_" + MSSV) || "[]");
      tasks = tasks.filter(t => t.id !== id);
      localStorage.setItem("tasks_" + MSSV, JSON.stringify(tasks));
    }

    // Load tasks cũ
    const savedTasks = JSON.parse(localStorage.getItem("tasks_" + MSSV) || "[]");
    savedTasks.forEach(renderTask);

    // Gắn sự kiện
    addBtn.addEventListener("click", addTask);
    taskName.addEventListener("keypress", e => {
      if (e.key === "Enter") addTask();
    });
  }
});
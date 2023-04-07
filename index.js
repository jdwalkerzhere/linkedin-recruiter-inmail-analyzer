document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("upload-form");
  const input = document.getElementById("csv-file");
  const content = document.getElementById("content");
  const dataTable = document.createElement("table");
  dataTable.className = "table-auto";
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");
  const prev_and_next = document.getElementById("prev_and_next");
  const instructions = document.getElementById("instructions");

  let currentPage = 0;
  const rowsPerPage = 10;
  let data = [];

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission and page reload

    const file = input.files[0];
    if (!file) {
      alert("Please select a CSV file before submitting.");
      return;
    }

    instructions.innerHTML = "You can sort your data by clicking the column title, and remove columns by clicking the red button";
    data = await parseCSV(file);
    renderTable(data);
    content.innerHTML = ''; // Clear the content
    content.appendChild(dataTable); // Add the table to the content    
    prev_and_next.appendChild(prevBtn); // Add the buttons to the content
    prev_and_next.appendChild(nextBtn);
  });

  prevBtn.textContent = "Prev";
  prevBtn.classList.add("bg-blue-500", "hover:bg-blue-700", "text-white", "font-bold", "px-4", "rounded-l", "focus:outline-none", "focus:shadow-outline", "mr-2", "mt-1");
  prevBtn.addEventListener("click", function () {
    if (currentPage > 0) {
      currentPage--;
      renderTable(data);
    }
  });

  nextBtn.textContent = "Next";
  nextBtn.classList.add("bg-blue-500", "hover:bg-blue-700", "text-white", "font-bold", "px-4", "rounded-r", "focus:outline-none", "focus:shadow-outline", "mt-1");
  nextBtn.addEventListener("click", function () {
    if ((currentPage + 1) * rowsPerPage < data.length) {
      currentPage++;
      renderTable(data);
    }
  });

  async function parseCSV(file) {
    const content = await file.text();
    const rows = content.split("\n").map(row => row.trim().split(","));

    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      row.forEach((cell, index) => {
        obj[headers[index]] = isNaN(parseInt(cell)) ? cell : parseInt(cell);
      });
      return obj;
    });

    return data;
  }

  function renderTable(data) {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = data.slice(startIndex, endIndex);

    // Clear the table
    dataTable.innerHTML = "";

    // Render header row
    const headerRow = document.createElement("tr");
    for (const key in data[0]) {
      const th = document.createElement("th");
      th.textContent = key;
      th.classList.add("px-3", "py-2", "cursor-pointer");

      // Add sorting functionality to the whole th
      th.addEventListener("click", function () {
        data.sort((a, b) => b[key] - a[key]);
        currentPage = 0;
        renderTable(data);
      });

      // Add remove column functionality
      const removeButton = document.createElement("button");
      removeButton.textContent = "x";
      removeButton.classList.add("bg-red-500", "hover:bg-red-700", "text-white", "font-bold", "py-1", "px-2", "rounded-full", "ml-2");
      removeButton.addEventListener("click", function (event) {
        event.stopPropagation();
        deleteColumn(key);
      });

      th.appendChild(removeButton);
      headerRow.appendChild(th);
    }
    dataTable.appendChild(headerRow);

    // Render data rows
    for (const row of pageData) {
      const tr = document.createElement("tr");
      for (const key in row) {
        const td = document.createElement("td");
        td.textContent = row[key];
        td.classList.add("border", "px-4", "py-2");
        tr.appendChild(td);
      }
      dataTable.appendChild(tr);
    }
  }

  function deleteColumn(columnName) {
    data = data.map(row => {
      const newRow = { ...row };
      delete newRow[columnName];
      return newRow;
    });
    renderTable(data);
  }
});


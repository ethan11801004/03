

// 更新即時日期 時間
function updateDateTime() {
const now = new Date();
const currentDate = now.toISOString().split('T')[0];
document.getElementById('current-date').value = currentDate;
const currentTime = now.toLocaleTimeString();
document.getElementById('current-time').value = currentTime;
}
setInterval(updateDateTime, 1000);  
  
  
  
// 更新機台資訊
function updateMachineInfo() {
const select = document.getElementById('machine-id');
const option = select.options[select.selectedIndex];
document.getElementById('machine-name').innerText = option.dataset.name || '';
document.getElementById('inspection-time').innerText = option.dataset.time || '';
document.getElementById('inspection-method').innerText = option.dataset.method || '';
document.getElementById('inspection-frequency').innerText = option.dataset.frequency || '';
}

// 新增限度樣品輸入欄位
function addSample() {
const samplesDiv = document.getElementById('samples');
const newInput = document.createElement('input');
newInput.type = 'text';
newInput.className = 'sample-number';
samplesDiv.appendChild(newInput);
}

// 表單送出
function submitForm() {
const tableBody = document.querySelector('#records-table tbody');
const row = document.createElement('tr');
  
const formData = {
date: document.getElementById('current-date').value,
time: document.getElementById('current-time').value,
machineId: document.getElementById('machine-id').value,
machineName: document.getElementById('machine-name').innerText,
workOrder: document.getElementById('work-order').value,
materialNumber: document.getElementById('material-number').value,
model: document.getElementById('model').value,
operatorName: document.getElementById('operator-name').value,
samples: Array.from(document.querySelectorAll('.sample-number')).map(input => input.value).join(', '),
  
};

Object.values(formData).forEach(value => {
const cell = document.createElement('td');
cell.textContent = value;
row.appendChild(cell);
});

// 備註欄
const remarksCell = document.createElement('td');
const remarksInput = document.createElement('input');
remarksInput.type = 'text';
const remarksButton = document.createElement('button');
remarksButton.textContent = '確認';
remarksButton.type = 'button';
remarksButton.onclick = function() {
remarksInput.disabled = true;
remarksButton.disabled = true;
};
remarksCell.appendChild(remarksInput);
remarksCell.appendChild(remarksButton);
row.appendChild(remarksCell);
 
tableBody.appendChild(row);
alert('資料已送出並記錄！');
}

// 篩選記錄
function filterRecords() {
const startDate = document.getElementById('filter-date-start').value;
const endDate = document.getElementById('filter-date-end').value;
const machineId = document.getElementById('filter-machine-id').value.trim();
const model = document.getElementById('filter-model').value.trim();
const operator = document.getElementById('filter-operator').value.trim();

const tableRows = document.querySelectorAll('#records-table tbody tr');
  
tableRows.forEach(row => {
// 獲取每一列的資料
const rowData = {
date: row.children[0].textContent,
machineId: row.children[2].textContent,
model: row.children[6].textContent,
operator: row.children[7].textContent,
};

// 判斷是否符合篩選條件
const isDateMatch =
(!startDate || rowData.date >= startDate) &&
(!endDate || rowData.date <= endDate);
const isMachineIdMatch = !machineId || rowData.machineId.includes(machineId);
const isModelMatch = !model || rowData.model.includes(model);
const isOperatorMatch = !operator || rowData.operator.includes(operator);

// 顯示或隱藏符合條件的列
if (isDateMatch && isMachineIdMatch && isModelMatch && isOperatorMatch) {
row.style.display = '';
} else {
row.style.display = 'none';
}
});
}

function exportToExcel() {
const table = document.querySelector("#records-table");
const rows = Array.from(table.querySelectorAll("tr"));
const sheetData = [];

// 提取表格標題行
const header = Array.from(rows[0].children).map(cell => cell.textContent);
sheetData.push(header);

// 提取表格數據行
rows.slice(1).forEach((row, rowIndex) => {
const rowData = Array.from(row.children).map((cell, cellIndex) => {
const input = cell.querySelector('input');
if (input) {
return input.value; 
} else {
return cell.textContent;
}
});
sheetData.push(rowData);
});
//使用SheetJS匯出為Excel
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(sheetData);
XLSX.utils.book_append_sheet(wb, ws, "Records");
XLSX.writeFile(wb, "限度樣品紀錄表.xlsx");
}

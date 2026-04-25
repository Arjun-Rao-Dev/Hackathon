const TASK_TYPES = ["Medication", "Meal", "Appointment", "Other"];
const TASK_STORAGE_KEY = "caretakerTasks_v1";
const LANGUAGE_STORAGE_KEY = "caregiverLanguage_v1";

const translations = {
en: {
appTitle: "Caregiver Task Tracker",
appSubtitle: "Log daily tasks for your elderly relative: medications, meals, and appointments.",
languageLabel: "Language",
invertColors: "Invert Colors",
dyslexicFont: "Dyslexic Font",
addTaskHeading: "Add a task",
caregiverNameLabel: "Caregiver name",
caregiverPlaceholder: "e.g., Maria",
dateLabel: "Date",
taskTypeLabel: "Task type",
typeMedication: "Medication",
typeMeal: "Meal",
typeAppointment: "Appointment",
typeOther: "Other",
detailsLabel: "Details",
detailsPlaceholder: "e.g., Took morning pill with water. / Breakfast eaten / Dentist at 3pm.",
addTaskButton: "Add task",
clearDayButton: "Clear selected day",
tasksHeading: "Tasks",
quickSummaryHeading: "Quick summary",
viewDayLabel: "View a specific day",
backupHeading: "Backup",
exportJson: "Export JSON",
importJson: "Import JSON",
howToUseHeading: "How to use",
howToPickDate: "Pick the date",
howToChooseType: "Choose task type",
howToAddDetails: "Add details and caregiver name",
howToRepeat: "Repeat for other family members",
readPageAloud: "Read Page Aloud",
credits: "This app was made by Arjun Rao, Vedha Sriram, Kavin Sriram, and Samanyu Bellapu.",
showingTasks: "Showing tasks for {date}. ({count} total)",
countsLine: "Medication: {Medication} • Meal: {Meal} • Appointment: {Appointment} • Other: {Other}",
noTasks: "No tasks logged for this day yet.",
addedTime: "{caregiver} • added {time}",
deleteTask: "Delete",
missingPageText: "There are no words on this page to read!",
invalidImport: "Invalid import file format.",
importError: "Could not read that file. Please import a valid JSON export.",
speechLang: "en-US"
},
zh: {
appTitle: "护理任务追踪器",
appSubtitle: "记录照顾年长亲人的每日任务：用药、用餐和预约。",
languageLabel: "语言",
invertColors: "反转颜色",
dyslexicFont: "阅读障碍字体",
addTaskHeading: "添加任务",
caregiverNameLabel: "护理人员姓名",
caregiverPlaceholder: "例如：Maria",
dateLabel: "日期",
taskTypeLabel: "任务类型",
typeMedication: "用药",
typeMeal: "用餐",
typeAppointment: "预约",
typeOther: "其他",
detailsLabel: "详细信息",
detailsPlaceholder: "例如：早晨服药并喝水。/ 已吃早餐 / 下午3点看牙医。",
addTaskButton: "添加任务",
clearDayButton: "清除所选日期",
tasksHeading: "任务",
quickSummaryHeading: "快速摘要",
viewDayLabel: "查看指定日期",
backupHeading: "备份",
exportJson: "导出 JSON",
importJson: "导入 JSON",
howToUseHeading: "使用方法",
howToPickDate: "选择日期",
howToChooseType: "选择任务类型",
howToAddDetails: "添加详细信息和护理人员姓名",
howToRepeat: "为其他家庭成员重复",
readPageAloud: "朗读页面",
credits: "此应用由 Arjun Rao、Vedha Sriram、Kavin Sriram 和 Samanyu Bellapu 制作。",
showingTasks: "正在显示 {date} 的任务。（共 {count} 项）",
countsLine: "用药：{Medication} • 用餐：{Meal} • 预约：{Appointment} • 其他：{Other}",
noTasks: "这一天还没有记录任务。",
addedTime: "{caregiver} • 添加于 {time}",
deleteTask: "删除",
missingPageText: "此页面没有可朗读的文字！",
invalidImport: "导入文件格式无效。",
importError: "无法读取该文件。请导入有效的 JSON 导出文件。",
speechLang: "zh-CN"
},
es: {
appTitle: "Registro de tareas de cuidado",
appSubtitle: "Registra tareas diarias para tu familiar mayor: medicamentos, comidas y citas.",
languageLabel: "Idioma",
invertColors: "Invertir colores",
dyslexicFont: "Fuente dislexica",
addTaskHeading: "Agregar una tarea",
caregiverNameLabel: "Nombre del cuidador",
caregiverPlaceholder: "p. ej., Maria",
dateLabel: "Fecha",
taskTypeLabel: "Tipo de tarea",
typeMedication: "Medicamento",
typeMeal: "Comida",
typeAppointment: "Cita",
typeOther: "Otro",
detailsLabel: "Detalles",
detailsPlaceholder: "p. ej., Tomo la pastilla de la manana con agua. / Desayuno comido / Dentista a las 3 p. m.",
addTaskButton: "Agregar tarea",
clearDayButton: "Borrar dia seleccionado",
tasksHeading: "Tareas",
quickSummaryHeading: "Resumen rapido",
viewDayLabel: "Ver un dia especifico",
backupHeading: "Copia de seguridad",
exportJson: "Exportar JSON",
importJson: "Importar JSON",
howToUseHeading: "Como usar",
howToPickDate: "Elige la fecha",
howToChooseType: "Elige el tipo de tarea",
howToAddDetails: "Agrega detalles y nombre del cuidador",
howToRepeat: "Repite para otros familiares",
readPageAloud: "Leer pagina en voz alta",
credits: "Esta aplicacion fue creada por Arjun Rao, Vedha Sriram, Kavin Sriram y Samanyu Bellapu.",
showingTasks: "Mostrando tareas para {date}. ({count} en total)",
countsLine: "Medicamento: {Medication} • Comida: {Meal} • Cita: {Appointment} • Otro: {Other}",
noTasks: "Todavia no hay tareas registradas para este dia.",
addedTime: "{caregiver} • agregado a las {time}",
deleteTask: "Eliminar",
missingPageText: "No hay palabras en esta pagina para leer.",
invalidImport: "Formato de archivo de importacion no valido.",
importError: "No se pudo leer ese archivo. Importa una exportacion JSON valida.",
speechLang: "es-ES"
},
hi: {
appTitle: "देखभाल कार्य ट्रैकर",
appSubtitle: "अपने बुजुर्ग रिश्तेदार के लिए रोज़ के काम दर्ज करें: दवाइयां, भोजन और अपॉइंटमेंट।",
languageLabel: "भाषा",
invertColors: "रंग उलटें",
dyslexicFont: "डिस्लेक्सिक फ़ॉन्ट",
addTaskHeading: "कार्य जोड़ें",
caregiverNameLabel: "देखभालकर्ता का नाम",
caregiverPlaceholder: "जैसे, Maria",
dateLabel: "तारीख",
taskTypeLabel: "कार्य प्रकार",
typeMedication: "दवा",
typeMeal: "भोजन",
typeAppointment: "अपॉइंटमेंट",
typeOther: "अन्य",
detailsLabel: "विवरण",
detailsPlaceholder: "जैसे, सुबह की गोली पानी के साथ ली। / नाश्ता खाया / दोपहर 3 बजे डेंटिस्ट।",
addTaskButton: "कार्य जोड़ें",
clearDayButton: "चुनी तारीख साफ़ करें",
tasksHeading: "कार्य",
quickSummaryHeading: "त्वरित सारांश",
viewDayLabel: "किसी खास दिन को देखें",
backupHeading: "बैकअप",
exportJson: "JSON निर्यात करें",
importJson: "JSON आयात करें",
howToUseHeading: "कैसे उपयोग करें",
howToPickDate: "तारीख चुनें",
howToChooseType: "कार्य प्रकार चुनें",
howToAddDetails: "विवरण और देखभालकर्ता का नाम जोड़ें",
howToRepeat: "परिवार के अन्य सदस्यों के लिए दोहराएं",
readPageAloud: "पेज ज़ोर से पढ़ें",
credits: "यह ऐप Arjun Rao, Vedha Sriram, Kavin Sriram, और Samanyu Bellapu ने बनाया है।",
showingTasks: "{date} के कार्य दिखाए जा रहे हैं। (कुल {count})",
countsLine: "दवा: {Medication} • भोजन: {Meal} • अपॉइंटमेंट: {Appointment} • अन्य: {Other}",
noTasks: "इस दिन के लिए अभी कोई कार्य दर्ज नहीं है।",
addedTime: "{caregiver} • {time} पर जोड़ा गया",
deleteTask: "हटाएं",
missingPageText: "इस पेज पर पढ़ने के लिए कोई शब्द नहीं हैं!",
invalidImport: "आयात फ़ाइल का प्रारूप अमान्य है।",
importError: "वह फ़ाइल पढ़ी नहीं जा सकी। कृपया मान्य JSON निर्यात आयात करें।",
speechLang: "hi-IN"
}
};

let currentLanguage = "en";

function todayISO() {
const d = new Date();
const tzOffset = d.getTimezoneOffset() * 60000;
const local = new Date(d.getTime() - tzOffset);
return local.toISOString().slice(0, 10);
}

function uid() {
return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

function getTasks() {
try {
const raw = localStorage.getItem(TASK_STORAGE_KEY);
return raw ? JSON.parse(raw) : [];
} catch (err) {
return [];
}
}

function setTasks(tasks) {
localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
}

function getSavedLanguage() {
const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
return translations[saved] ? saved : "en";
}

function t(key, values = {}) {
const phrase = translations[currentLanguage][key] || translations.en[key] || key;
return phrase.replace(/\{(\w+)\}/g, function (_, name) {
return values[name] ?? "";
});
}

function typeLabel(type) {
return t(`type${type}`);
}

function normalizeTaskType(type) {
return TASK_TYPES.includes(type) ? type : "Other";
}

function escapeText(s) {
return String(s ?? "")
.replaceAll("&", "&amp;")
.replaceAll("<", "&lt;")
.replaceAll(">", "&gt;")
.replaceAll('"', "&quot;")
.replaceAll("'", "&#039;");
}

function applyTranslations() {
document.documentElement.lang = currentLanguage;
document.title = t("appTitle");

document.querySelectorAll("[data-i18n]").forEach((el) => {
el.textContent = t(el.dataset.i18n);
});

document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
el.placeholder = t(el.dataset.i18nPlaceholder);
});
}

document.addEventListener("DOMContentLoaded", function () {
let tasks = getTasks();

const taskDateInput = document.getElementById("taskDate");
const filterDateInput = document.getElementById("filterDate");
const languageSelect = document.getElementById("languageSelect");
const listEl = document.getElementById("taskList");
const daySummaryEl = document.getElementById("daySummary");
const countsLineEl = document.getElementById("countsLine");

currentLanguage = getSavedLanguage();
languageSelect.value = currentLanguage;

taskDateInput.value = todayISO();
filterDateInput.value = taskDateInput.value;

function getDayTasks(dayISO) {
return tasks
.filter((task) => task.date === dayISO)
.sort((a, b) => b.createdAt - a.createdAt);
}

function countByType(dayISO) {
const counts = {
Medication: 0,
Meal: 0,
Appointment: 0,
Other: 0
};

tasks
.filter((task) => task.date === dayISO)
.forEach((task) => {
const type = normalizeTaskType(task.type);
counts[type] = (counts[type] || 0) + 1;
});

return counts;
}

function render() {
applyTranslations();

const day = filterDateInput.value || todayISO();
const dayTasks = getDayTasks(day);

daySummaryEl.textContent = t("showingTasks", {
date: day,
count: dayTasks.length
});

const c = countByType(day);
countsLineEl.textContent = t("countsLine", c);

if (dayTasks.length === 0) {
listEl.innerHTML = `<div class="empty">${escapeText(t("noTasks"))}</div>`;
return;
}

listEl.innerHTML = dayTasks
.map((task) => {
const details = task.details && task.details.trim() ? task.details.trim() : "-";
const type = normalizeTaskType(task.type);
const addedTime = new Date(task.createdAt).toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit"
});

return `
<div class="task-item">
<div class="task-top">
<div class="badge">${escapeText(typeLabel(type))}</div>
<div class="meta">
${escapeText(t("addedTime", {
caregiver: task.caregiver,
time: addedTime
}))}
</div>
</div>

<div class="task-desc">${escapeText(details)}</div>

<div class="task-actions">
<button class="link-btn" type="button" data-action="delete" data-id="${escapeText(task.id)}">
${escapeText(t("deleteTask"))}
</button>
</div>
</div>
`;
})
.join("");
}

document.getElementById("taskForm").addEventListener("submit", function (e) {
e.preventDefault();

const caregiverName = document.getElementById("caregiverName").value.trim();
const date = document.getElementById("taskDate").value;
const type = normalizeTaskType(document.getElementById("taskType").value);
const details = document.getElementById("taskDetails").value.trim();

if (!caregiverName || !date || !type) return;

tasks.push({
id: uid(),
caregiver: caregiverName,
date,
type,
details,
createdAt: Date.now()
});

setTasks(tasks);

filterDateInput.value = date;
document.getElementById("taskDetails").value = "";

render();
});

listEl.addEventListener("click", function (e) {
const btn = e.target.closest('button[data-action="delete"]');
if (!btn) return;

const id = btn.getAttribute("data-id");
tasks = tasks.filter((task) => task.id !== id);
setTasks(tasks);
render();
});

filterDateInput.addEventListener("change", render);

languageSelect.addEventListener("change", function () {
currentLanguage = translations[languageSelect.value] ? languageSelect.value : "en";
localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
render();
});

document.getElementById("clearDayBtn").addEventListener("click", function () {
const day = filterDateInput.value || todayISO();
tasks = tasks.filter((task) => task.date !== day);
setTasks(tasks);
render();
});

document.getElementById("toggleInvert").addEventListener("click", function () {
document.body.classList.toggle("access-invert");
});

document.getElementById("toggleDyslexic").addEventListener("click", function () {
document.body.classList.toggle("access-dyslexic");
});

document.getElementById("exportBtn").addEventListener("click", function () {
const payload = {
version: 1,
exportedAt: new Date().toISOString(),
tasks
};

const blob = new Blob([JSON.stringify(payload, null, 2)], {
type: "application/json"
});

const url = URL.createObjectURL(blob);
const a = document.createElement("a");

a.href = url;
a.download = "caregiver-task-tracker-export.json";
document.body.appendChild(a);
a.click();
a.remove();

URL.revokeObjectURL(url);
});

document.getElementById("importFile").addEventListener("change", async function (e) {
const file = e.target.files && e.target.files[0];
if (!file) return;

try {
const text = await file.text();
const data = JSON.parse(text);

if (!data || !Array.isArray(data.tasks)) {
alert(t("invalidImport"));
return;
}

tasks = data.tasks.map((task) => ({
...task,
type: normalizeTaskType(task.type)
}));
setTasks(tasks);

taskDateInput.value = todayISO();
filterDateInput.value = todayISO();

render();
} catch (err) {
alert(t("importError"));
} finally {
e.target.value = "";
}
});

document.getElementById("pagereader").addEventListener("click", readPage);

render();
});

function readPage() {
const pageText = document.body.innerText.trim();

if (pageText === "") {
alert(t("missingPageText"));
return;
}

window.speechSynthesis.cancel();

const utterance = new SpeechSynthesisUtterance(pageText);
utterance.lang = t("speechLang");
utterance.rate = 1.0;
window.speechSynthesis.speak(utterance);
}

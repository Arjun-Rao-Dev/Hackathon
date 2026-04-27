const TASK_TYPES = ["Medication", "Meal", "Appointment", "Other"];
const TASK_STORAGE_KEY = "caretakerTasks_v1";
const LANGUAGE_STORAGE_KEY = "caregiverLanguage_v1";
const REMINDER_WINDOW_MS = 5 * 60 * 1000;
const reminderTimers = new Map();

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
timeLabel: "Time",
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
remindersHeading: "Reminders",
remindersHelp: "Enable browser notifications for task times while this app is open.",
enableNotifications: "Enable reminders",
notificationsEnabled: "Reminders are enabled.",
notificationsDenied: "Notifications are blocked in this browser.",
notificationsUnsupported: "Notifications are not supported in this browser.",
notificationsDefault: "Reminders are off until you enable browser notifications.",
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
dueTime: "Due at {time}",
reminderTitle: "{type} reminder",
reminderBody: "{details}",
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
timeLabel: "时间",
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
remindersHeading: "提醒",
remindersHelp: "启用浏览器通知，以便在此应用打开时按任务时间提醒。",
enableNotifications: "启用提醒",
notificationsEnabled: "提醒已启用。",
notificationsDenied: "此浏览器已阻止通知。",
notificationsUnsupported: "此浏览器不支持通知。",
notificationsDefault: "提醒已关闭，请先启用浏览器通知。",
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
dueTime: "时间：{time}",
reminderTitle: "{type} 提醒",
reminderBody: "{details}",
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
timeLabel: "Hora",
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
remindersHeading: "Recordatorios",
remindersHelp: "Activa notificaciones del navegador para los horarios de tareas mientras esta app este abierta.",
enableNotifications: "Activar recordatorios",
notificationsEnabled: "Los recordatorios estan activados.",
notificationsDenied: "Las notificaciones estan bloqueadas en este navegador.",
notificationsUnsupported: "Este navegador no admite notificaciones.",
notificationsDefault: "Los recordatorios estan apagados hasta que actives las notificaciones del navegador.",
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
dueTime: "Hora: {time}",
reminderTitle: "Recordatorio de {type}",
reminderBody: "{details}",
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
timeLabel: "समय",
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
remindersHeading: "रिमाइंडर",
remindersHelp: "जब यह ऐप खुला हो, तब कार्य समय के लिए ब्राउज़र सूचनाएं चालू करें।",
enableNotifications: "रिमाइंडर चालू करें",
notificationsEnabled: "रिमाइंडर चालू हैं।",
notificationsDenied: "इस ब्राउज़र में सूचनाएं ब्लॉक हैं।",
notificationsUnsupported: "यह ब्राउज़र सूचनाओं का समर्थन नहीं करता।",
notificationsDefault: "ब्राउज़र सूचनाएं चालू करने तक रिमाइंडर बंद हैं।",
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
dueTime: "समय: {time}",
reminderTitle: "{type} रिमाइंडर",
reminderBody: "{details}",
deleteTask: "हटाएं",
missingPageText: "इस पेज पर पढ़ने के लिए कोई शब्द नहीं हैं!",
invalidImport: "आयात फ़ाइल का प्रारूप अमान्य है।",
importError: "वह फ़ाइल पढ़ी नहीं जा सकी। कृपया मान्य JSON निर्यात आयात करें।",
speechLang: "hi-IN"
}
};
ta: {
  appTitle: "பராமரிப்பு பணி கண்காணிப்பான்",
  appSubtitle: "உங்கள் முதியோர் உறவினருக்கான தினசரி பணிகளை பதிவு செய்யுங்கள்: மருந்துகள், உணவு மற்றும் சந்திப்புகள்.",
  languageLabel: "மொழி",
  invertColors: "வண்ணங்களை மாற்று",
  dyslexicFont: "டிஸ்லெக்சிக் எழுத்துரு",
  addTaskHeading: "பணி சேர்க்கவும்",
  caregiverNameLabel: "பராமரிப்பாளரின் பெயர்",
  caregiverPlaceholder: "எ.கா., Maria",
  dateLabel: "தேதி",
  timeLabel: "நேரம்",
  taskTypeLabel: "பணி வகை",
  typeMedication: "மருந்து",
  typeMeal: "உணவு",
  typeAppointment: "சந்திப்பு",
  typeOther: "மற்றவை",
  detailsLabel: "விவரங்கள்",
  detailsPlaceholder: "எ.கா., காலை மாத்திரை தண்ணீருடன் எடுத்தனர். / காலை உணவு சாப்பிட்டனர் / மதியம் 3 மணிக்கு பல் மருத்துவர்.",
  addTaskButton: "பணி சேர்க்கவும்",
  clearDayButton: "தேர்ந்த தேதியை அழிக்கவும்",
  tasksHeading: "பணிகள்",
  quickSummaryHeading: "விரைவு சுருக்கம்",
  viewDayLabel: "குறிப்பிட்ட நாளைப் பார்க்கவும்",
  remindersHeading: "நினைவூட்டல்கள்",
  remindersHelp: "இந்த ஆப்ஸ் திறந்திருக்கும்போது பணி நேரங்களுக்கு உலாவி அறிவிப்புகளை இயக்கவும்.",
  enableNotifications: "நினைவூட்டல்களை இயக்கவும்",
  notificationsEnabled: "நினைவூட்டல்கள் இயக்கப்பட்டுள்ளன.",
  notificationsDenied: "இந்த உலாவியில் அறிவிப்புகள் தடுக்கப்பட்டுள்ளன.",
  notificationsUnsupported: "இந்த உலாவி அறிவிப்புகளை ஆதரிக்கவில்லை.",
  notificationsDefault: "உலாவி அறிவிப்புகளை இயக்கும் வரை நினைவூட்டல்கள் அணைக்கப்பட்டுள்ளன.",
  backupHeading: "காப்புப்பிரதி",
  exportJson: "JSON ஏற்றுமதி செய்யவும்",
  importJson: "JSON இறக்குமதி செய்யவும்",
  howToUseHeading: "எவ்வாறு பயன்படுத்துவது",
  howToPickDate: "தேதியைத் தேர்ந்தெடுக்கவும்",
  howToChooseType: "பணி வகையைத் தேர்ந்தெடுக்கவும்",
  howToAddDetails: "விவரங்களும் பராமரிப்பாளரின் பெயரும் சேர்க்கவும்",
  howToRepeat: "குடும்பத்தின் மற்ற உறுப்பினர்களுக்கு மீண்டும் செய்யவும்",
  readPageAloud: "பக்கத்தை声ரக்கமாக வாசிக்கவும்",
  credits: "இந்த ஆப்ஸை Arjun Rao, Vedha Sriram, Kavin Sriram மற்றும் Samanyu Bellapu உருவாக்கினர்.",
  showingTasks: "{date} தேதியின் பணிகள் காட்டப்படுகின்றன. (மொத்தம் {count})",
  countsLine: "மருந்து: {Medication} • உணவு: {Meal} • சந்திப்பு: {Appointment} • மற்றவை: {Other}",
  noTasks: "இந்த நாளுக்கு இன்னும் எந்த பணியும் பதிவு செய்யப்படவில்லை.",
  addedTime: "{caregiver} • {time} மணிக்கு சேர்க்கப்பட்டது",
  dueTime: "நேரம்: {time}",
  reminderTitle: "{type} நினைவூட்டல்",
  reminderBody: "{details}",
  deleteTask: "நீக்கவும்",
  missingPageText: "இந்த பக்கத்தில் படிக்க வார்த்தைகள் எதுவும் இல்லை!",
  invalidImport: "இறக்குமதி கோப்பின் வடிவம் தவறானது.",
  importError: "அந்த கோப்பை படிக்க முடியவில்லை. சரியான JSON ஏற்றுமதியை இறக்குமதி செய்யவும்.",
  speechLang: "ta-IN"
}
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

function getDueDate(task) {
if (!task.date || !task.dueTime) return null;

const dueDate = new Date(`${task.date}T${task.dueTime}:00`);
return Number.isNaN(dueDate.getTime()) ? null : dueDate;
}

function formatTaskTime(timeValue) {
if (!timeValue) return "";

const timeDate = new Date(`2000-01-01T${timeValue}:00`);
if (Number.isNaN(timeDate.getTime())) return timeValue;

return timeDate.toLocaleTimeString([], {
hour: "numeric",
minute: "2-digit"
});
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
const taskTimeInput = document.getElementById("taskTime");
const filterDateInput = document.getElementById("filterDate");
const languageSelect = document.getElementById("languageSelect");
const listEl = document.getElementById("taskList");
const daySummaryEl = document.getElementById("daySummary");
const countsLineEl = document.getElementById("countsLine");
const notificationStatusEl = document.getElementById("notificationStatus");
const enableNotificationsButton = document.getElementById("enableNotifications");

currentLanguage = getSavedLanguage();
languageSelect.value = currentLanguage;

taskDateInput.value = todayISO();
filterDateInput.value = taskDateInput.value;

function getDayTasks(dayISO) {
return tasks
.filter((task) => task.date === dayISO)
.sort((a, b) => {
const aDue = getDueDate(a);
const bDue = getDueDate(b);

if (aDue && bDue) return aDue - bDue;
if (aDue) return -1;
if (bDue) return 1;

return b.createdAt - a.createdAt;
});
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

function updateNotificationStatus() {
if (!("Notification" in window)) {
notificationStatusEl.textContent = t("notificationsUnsupported");
enableNotificationsButton.disabled = true;
return;
}

if (Notification.permission === "granted") {
notificationStatusEl.textContent = t("notificationsEnabled");
return;
}

if (Notification.permission === "denied") {
notificationStatusEl.textContent = t("notificationsDenied");
return;
}

notificationStatusEl.textContent = t("notificationsDefault");
}

async function registerReminderWorker() {
if (!("serviceWorker" in navigator)) return null;

try {
const registration = await navigator.serviceWorker.register("sw.js");
return registration;
} catch (err) {
return null;
}
}

async function showReminderNotification(task) {
if (!("Notification" in window) || Notification.permission !== "granted") return;

const type = normalizeTaskType(task.type);
const formattedTime = formatTaskTime(task.dueTime);
const fallbackDetails = t("dueTime", { time: formattedTime });
const details = task.details && task.details.trim() ? task.details.trim() : fallbackDetails;
const title = t("reminderTitle", { type: typeLabel(type) });
const options = {
body: t("reminderBody", { details }),
tag: `caregiver-task-${task.id}`,
renotify: true,
data: {
url: window.location.href
}
};

const registration = await registerReminderWorker();
if (registration && registration.showNotification) {
registration.showNotification(title, options);
return;
}

new Notification(title, options);
}

function markTaskNotified(taskId) {
tasks = tasks.map((task) => {
if (task.id !== taskId) return task;

return {
...task,
notifiedAt: Date.now()
};
});
setTasks(tasks);
}

function clearReminderTimers() {
reminderTimers.forEach((timerId) => window.clearTimeout(timerId));
reminderTimers.clear();
}

function scheduleReminders() {
clearReminderTimers();

if (!("Notification" in window) || Notification.permission !== "granted") return;

const now = Date.now();

tasks.forEach((task) => {
if (!task.dueTime || task.notifiedAt) return;

const dueDate = getDueDate(task);
if (!dueDate) return;

const delay = dueDate.getTime() - now;
if (delay < -REMINDER_WINDOW_MS) return;

const timerDelay = Math.max(delay, 0);
const timerId = window.setTimeout(async function () {
const latestTask = tasks.find((candidate) => candidate.id === task.id);
if (!latestTask || latestTask.notifiedAt) return;

await showReminderNotification(latestTask);
markTaskNotified(latestTask.id);
render();
}, Math.min(timerDelay, 2147483647));

reminderTimers.set(task.id, timerId);
});
}

function render() {
applyTranslations();
updateNotificationStatus();

const day = filterDateInput.value || todayISO();
const dayTasks = getDayTasks(day);

daySummaryEl.textContent = t("showingTasks", {
date: day,
count: dayTasks.length
});

const c = countByType(day);
countsLineEl.textContent = t("countsLine", c);
scheduleReminders();

if (dayTasks.length === 0) {
listEl.innerHTML = `<div class="empty">${escapeText(t("noTasks"))}</div>`;
return;
}

listEl.innerHTML = dayTasks
.map((task) => {
const details = task.details && task.details.trim() ? task.details.trim() : "-";
const type = normalizeTaskType(task.type);
const dueLabel = task.dueTime ? t("dueTime", {
time: formatTaskTime(task.dueTime)
}) : "";
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
${dueLabel ? `<div class="meta">${escapeText(dueLabel)}</div>` : ""}

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
const dueTime = taskTimeInput.value;
const details = document.getElementById("taskDetails").value.trim();

if (!caregiverName || !date || !type) return;

tasks.push({
id: uid(),
caregiver: caregiverName,
date,
type,
dueTime,
details,
createdAt: Date.now()
});

setTasks(tasks);

filterDateInput.value = date;
document.getElementById("taskDetails").value = "";
taskTimeInput.value = "";

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

enableNotificationsButton.addEventListener("click", async function () {
if (!("Notification" in window)) {
updateNotificationStatus();
return;
}

const permission = await Notification.requestPermission();
if (permission === "granted") {
await registerReminderWorker();
}

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
type: normalizeTaskType(task.type),
dueTime: task.dueTime || ""
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
utterance.rate = 0.75;
window.speechSynthesis.speak(utterance);
}

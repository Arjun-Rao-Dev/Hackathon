import SwiftUI

struct ContentView: View {
    @State private var store = TaskStore()
    @AppStorage("caregiverLanguageNative_v1") private var languageCode = AppLanguage.english.rawValue

    @State private var caregiver = ""
    @State private var selectedDate = Date()
    @State private var selectedTime = Date()
    @State private var hasTime = true
    @State private var kind = TaskKind.medication
    @State private var details = ""
    @State private var filterDate = Date()

    private var language: AppLanguage {
        AppLanguage(rawValue: languageCode) ?? .english
    }

    private var dayTasks: [CareTask] {
        store.tasks(on: filterDate)
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Picker(text("language"), selection: $languageCode) {
                        ForEach(AppLanguage.allCases) { language in
                            Text(language.displayName).tag(language.rawValue)
                        }
                    }
                }

                Section(text("addTask")) {
                    TextField(text("caregiverName"), text: $caregiver)
                        .textContentType(.name)

                    DatePicker(text("date"), selection: $selectedDate, displayedComponents: .date)

                    Toggle(text("setTime"), isOn: $hasTime)

                    if hasTime {
                        DatePicker(text("time"), selection: $selectedTime, displayedComponents: .hourAndMinute)
                    }

                    Picker(text("taskType"), selection: $kind) {
                        ForEach(TaskKind.allCases) { taskKind in
                            Text(label(for: taskKind)).tag(taskKind)
                        }
                    }

                    TextField(text("details"), text: $details, axis: .vertical)
                        .lineLimit(3...6)

                    Button(text("addTask")) {
                        addTask()
                    }
                    .disabled(caregiver.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)

                    Button(text("clearSelectedDay"), role: .destructive) {
                        store.clearDay(filterDate)
                    }
                }

                Section(text("quickSummary")) {
                    DatePicker(text("viewDay"), selection: $filterDate, displayedComponents: .date)
                    Text(summaryText)
                        .font(.subheadline.weight(.semibold))
                }

                Section(text("reminders")) {
                    Button(text("enableReminders")) {
                        store.requestNotifications()
                    }

                    Text(text("nativeReminderHelp"))
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                Section(text("tasks")) {
                    if dayTasks.isEmpty {
                        Text(text("noTasks"))
                            .foregroundStyle(.secondary)
                    } else {
                        ForEach(dayTasks) { task in
                            TaskRow(task: task, language: language) {
                                store.delete(task)
                            }
                        }
                    }
                }
            }
            .navigationTitle(text("appTitle"))
        }
    }

    private var summaryText: String {
        let counts = store.counts(on: filterDate)
        return TaskKind.allCases.map { taskKind in
            "\(label(for: taskKind)): \(counts[taskKind, default: 0])"
        }.joined(separator: " • ")
    }

    private func addTask() {
        let cleanCaregiver = caregiver.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !cleanCaregiver.isEmpty else { return }

        let dueTime = hasTime ? Calendar.current.date(
            bySettingHour: Calendar.current.component(.hour, from: selectedTime),
            minute: Calendar.current.component(.minute, from: selectedTime),
            second: 0,
            of: selectedDate
        ) : nil

        let task = CareTask(
            caregiver: cleanCaregiver,
            date: selectedDate,
            dueTime: dueTime,
            kind: kind,
            details: details.trimmingCharacters(in: .whitespacesAndNewlines)
        )

        store.add(task)
        filterDate = selectedDate
        details = ""
    }

    private func text(_ key: String) -> String {
        Strings.value(key, language: language)
    }

    private func label(for kind: TaskKind) -> String {
        Strings.value(kind.rawValue, language: language)
    }
}

private struct TaskRow: View {
    let task: CareTask
    let language: AppLanguage
    let onDelete: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(Strings.value(task.kind.rawValue, language: language))
                    .font(.headline)
                Spacer()
                Button(Strings.value("delete", language: language), role: .destructive, action: onDelete)
                    .buttonStyle(.borderless)
            }

            Text(task.caregiver)
                .font(.subheadline.weight(.semibold))

            if let dueTime = task.dueTime {
                Text("\(Strings.value("dueAt", language: language)) \(dueTime.formatted(date: .omitted, time: .shortened))")
                    .font(.subheadline)
            }

            if !task.details.isEmpty {
                Text(task.details)
                    .font(.body)
            }
        }
        .padding(.vertical, 4)
    }
}

enum Strings {
    static func value(_ key: String, language: AppLanguage) -> String {
        values[language]?[key] ?? values[.english]?[key] ?? key
    }

    private static let values: [AppLanguage: [String: String]] = [
        .english: [
            "appTitle": "Caregiver Tracker",
            "language": "Language",
            "addTask": "Add a task",
            "caregiverName": "Caregiver name",
            "date": "Date",
            "setTime": "Set a time",
            "time": "Time",
            "taskType": "Task type",
            "details": "Details",
            "clearSelectedDay": "Clear selected day",
            "quickSummary": "Quick summary",
            "viewDay": "View a specific day",
            "reminders": "Reminders",
            "enableReminders": "Enable reminders",
            "nativeReminderHelp": "iOS notifications can still appear when the app is closed after permission is granted.",
            "tasks": "Tasks",
            "noTasks": "No tasks logged for this day yet.",
            "delete": "Delete",
            "dueAt": "Due at",
            "Medication": "Medication",
            "Meal": "Meal",
            "Appointment": "Appointment",
            "Other": "Other"
        ],
        .chinese: [
            "appTitle": "护理任务追踪器",
            "language": "语言",
            "addTask": "添加任务",
            "caregiverName": "护理人员姓名",
            "date": "日期",
            "setTime": "设置时间",
            "time": "时间",
            "taskType": "任务类型",
            "details": "详细信息",
            "clearSelectedDay": "清除所选日期",
            "quickSummary": "快速摘要",
            "viewDay": "查看指定日期",
            "reminders": "提醒",
            "enableReminders": "启用提醒",
            "nativeReminderHelp": "授予权限后，即使应用关闭，iOS 通知也可以显示。",
            "tasks": "任务",
            "noTasks": "这一天还没有记录任务。",
            "delete": "删除",
            "dueAt": "时间",
            "Medication": "用药",
            "Meal": "用餐",
            "Appointment": "预约",
            "Other": "其他"
        ],
        .spanish: [
            "appTitle": "Registro de cuidado",
            "language": "Idioma",
            "addTask": "Agregar una tarea",
            "caregiverName": "Nombre del cuidador",
            "date": "Fecha",
            "setTime": "Establecer hora",
            "time": "Hora",
            "taskType": "Tipo de tarea",
            "details": "Detalles",
            "clearSelectedDay": "Borrar dia seleccionado",
            "quickSummary": "Resumen rapido",
            "viewDay": "Ver un dia especifico",
            "reminders": "Recordatorios",
            "enableReminders": "Activar recordatorios",
            "nativeReminderHelp": "Las notificaciones de iOS pueden aparecer aunque la app este cerrada despues de dar permiso.",
            "tasks": "Tareas",
            "noTasks": "Todavia no hay tareas registradas para este dia.",
            "delete": "Eliminar",
            "dueAt": "Hora",
            "Medication": "Medicamento",
            "Meal": "Comida",
            "Appointment": "Cita",
            "Other": "Otro"
        ],
        .hindi: [
            "appTitle": "देखभाल कार्य ट्रैकर",
            "language": "भाषा",
            "addTask": "कार्य जोड़ें",
            "caregiverName": "देखभालकर्ता का नाम",
            "date": "तारीख",
            "setTime": "समय सेट करें",
            "time": "समय",
            "taskType": "कार्य प्रकार",
            "details": "विवरण",
            "clearSelectedDay": "चुनी तारीख साफ़ करें",
            "quickSummary": "त्वरित सारांश",
            "viewDay": "किसी खास दिन को देखें",
            "reminders": "रिमाइंडर",
            "enableReminders": "रिमाइंडर चालू करें",
            "nativeReminderHelp": "अनुमति मिलने के बाद ऐप बंद होने पर भी iOS सूचनाएं दिख सकती हैं।",
            "tasks": "कार्य",
            "noTasks": "इस दिन के लिए अभी कोई कार्य दर्ज नहीं है।",
            "delete": "हटाएं",
            "dueAt": "समय",
            "Medication": "दवा",
            "Meal": "भोजन",
            "Appointment": "अपॉइंटमेंट",
            "Other": "अन्य"
        ]
    ]
}

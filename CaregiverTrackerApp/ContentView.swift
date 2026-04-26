import SwiftUI
import UniformTypeIdentifiers

private enum AppTheme {
    static let pageBackground = Color(red: 0.68, green: 0.91, blue: 0.94)
    static let panelBackground = Color(red: 0.90, green: 0.97, blue: 0.99)
    static let fieldBackground = Color(red: 0.98, green: 0.995, blue: 1.0)
    static let text = Color(red: 0.22, green: 0.29, blue: 0.35)
    static let border = Color(red: 0.54, green: 0.62, blue: 0.68).opacity(0.55)
    static let accent = Color(red: 0.18, green: 0.43, blue: 0.58)
    static let destructive = Color(red: 0.49, green: 0.18, blue: 0.20)
}

struct BackupDocument: FileDocument {
    static var readableContentTypes: [UTType] { [.json] }

    var data: Data

    init(data: Data = Data()) {
        self.data = data
    }

    init(configuration: ReadConfiguration) throws {
        data = configuration.file.regularFileContents ?? Data()
    }

    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        FileWrapper(regularFileWithContents: data)
    }
}

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
    @State private var speaker = PageSpeaker()
    @State private var invertColors = false
    @State private var dyslexicFont = false
    @State private var backupDocument = BackupDocument()
    @State private var isExportingBackup = false
    @State private var isImportingBackup = false
    @State private var backupMessage = ""
    @State private var showsBackupMessage = false

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
                .modifier(BlueListRowStyle())

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
                    .buttonStyle(BlueBorderedButtonStyle(prominent: true))
                    .disabled(caregiver.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)

                    Button(text("clearSelectedDay"), role: .destructive) {
                        store.clearDay(filterDate)
                    }
                    .buttonStyle(BlueBorderedButtonStyle())
                }
                .modifier(BlueListRowStyle())
                .headerProminence(.increased)

                Section(text("quickSummary")) {
                    DatePicker(text("viewDay"), selection: $filterDate, displayedComponents: .date)
                    Text(summaryText)
                        .font(.subheadline.weight(.semibold))
                }
                .modifier(BlueListRowStyle())
                .headerProminence(.increased)

                Section(text("reminders")) {
                    Button(text("enableReminders")) {
                        store.requestNotifications()
                    }
                    .buttonStyle(BlueBorderedButtonStyle())

                    Text(text("nativeReminderHelp"))
                        .font(.footnote)
                        .foregroundStyle(AppTheme.text.opacity(0.75))
                }
                .modifier(BlueListRowStyle())
                .headerProminence(.increased)

                Section(text("accessibility")) {
                    Toggle(text("invertColors"), isOn: $invertColors)
                    Toggle(text("dyslexicFont"), isOn: $dyslexicFont)

                    Button(text("readPageAloud")) {
                        speaker.speak(readAloudText, language: language)
                    }
                    .buttonStyle(BlueBorderedButtonStyle())

                    Text(text("readPageHelp"))
                        .font(.footnote)
                        .foregroundStyle(AppTheme.text.opacity(0.75))
                }
                .modifier(BlueListRowStyle())
                .headerProminence(.increased)

                Section(text("backup")) {
                    Button(text("exportJson")) {
                        exportBackup()
                    }
                    .buttonStyle(BlueBorderedButtonStyle())

                    Button(text("importJson")) {
                        isImportingBackup = true
                    }
                    .buttonStyle(BlueBorderedButtonStyle())
                }
                .modifier(BlueListRowStyle())
                .headerProminence(.increased)

                Section(text("howToUse")) {
                    ForEach(howToUseLines, id: \.self) { line in
                        Label(line, systemImage: "checkmark.circle")
                            .foregroundStyle(AppTheme.text)
                    }
                }
                .modifier(BlueListRowStyle())
                .headerProminence(.increased)

                Section(text("tasks")) {
                    if dayTasks.isEmpty {
                        Text(text("noTasks"))
                            .foregroundStyle(AppTheme.text.opacity(0.75))
                    } else {
                        ForEach(dayTasks) { task in
                            TaskRow(task: task, language: language) {
                                store.delete(task)
                            }
                        }
                    }
                }
                .modifier(BlueListRowStyle())
                .headerProminence(.increased)
            }
            .scrollContentBackground(.hidden)
            .background(AppTheme.pageBackground)
            .listRowSeparatorTint(AppTheme.border)
            .listSectionSpacing(18)
            .navigationTitle(text("appTitle"))
            .toolbarBackground(AppTheme.pageBackground, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
        }
        .font(dyslexicFont ? .custom("OpenDyslexic", size: 17) : .body)
        .foregroundStyle(AppTheme.text)
        .tint(AppTheme.accent)
        .background(AppTheme.pageBackground)
        .modifier(InvertColorsModifier(active: invertColors))
        .fileExporter(
            isPresented: $isExportingBackup,
            document: backupDocument,
            contentType: .json,
            defaultFilename: "caregiver-task-tracker-export"
        ) { result in
            handleExportResult(result)
        }
        .fileImporter(
            isPresented: $isImportingBackup,
            allowedContentTypes: [.json]
        ) { result in
            handleImportResult(result)
        }
        .alert(text("backup"), isPresented: $showsBackupMessage) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(backupMessage)
        }
    }

    private var summaryText: String {
        let counts = store.counts(on: filterDate)
        return TaskKind.allCases.map { taskKind in
            "\(label(for: taskKind)): \(counts[taskKind, default: 0])"
        }.joined(separator: " • ")
    }

    private var readAloudText: String {
        var lines = [
            text("appTitle"),
            text("quickSummary"),
            summaryText,
            text("tasks")
        ]

        if dayTasks.isEmpty {
            lines.append(text("noTasks"))
        } else {
            lines.append(contentsOf: dayTasks.map(readAloudDescription(for:)))
        }

        return lines.joined(separator: ". ")
    }

    private var howToUseLines: [String] {
        [
            text("howToPickDate"),
            text("howToChooseType"),
            text("howToAddDetails"),
            text("howToRepeat")
        ]
    }

    private func readAloudDescription(for task: CareTask) -> String {
        var parts = [
            label(for: task.kind),
            task.caregiver
        ]

        if let dueTime = task.dueTime {
            parts.append("\(text("dueAt")) \(dueTime.formatted(date: .omitted, time: .shortened))")
        }

        if !task.details.isEmpty {
            parts.append(task.details)
        }

        return parts.joined(separator: ". ")
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

    private func exportBackup() {
        do {
            backupDocument = BackupDocument(data: try store.exportData())
            isExportingBackup = true
        } catch {
            showBackupMessage(text("exportFailed"))
        }
    }

    private func handleExportResult(_ result: Result<URL, Error>) {
        switch result {
        case .success:
            showBackupMessage(text("exportComplete"))
        case .failure:
            showBackupMessage(text("exportFailed"))
        }
    }

    private func handleImportResult(_ result: Result<URL, Error>) {
        do {
            let url = try result.get()
            let canAccess = url.startAccessingSecurityScopedResource()
            defer {
                if canAccess {
                    url.stopAccessingSecurityScopedResource()
                }
            }

            try store.importData(Data(contentsOf: url))
            filterDate = Date()
            showBackupMessage(text("importComplete"))
        } catch {
            showBackupMessage(text("importFailed"))
        }
    }

    private func showBackupMessage(_ message: String) {
        backupMessage = message
        showsBackupMessage = true
    }
}

private struct BlueBorderedButtonStyle: ButtonStyle {
    var prominent = false

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline.weight(.bold))
            .foregroundStyle(AppTheme.text)
            .padding(.vertical, 8)
            .padding(.horizontal, 12)
            .background(prominent ? AppTheme.fieldBackground : AppTheme.panelBackground)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay {
                RoundedRectangle(cornerRadius: 8)
                    .stroke(AppTheme.border, lineWidth: 2)
            }
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
    }
}

private struct BlueListRowStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .listRowBackground(AppTheme.panelBackground)
            .listRowSeparatorTint(AppTheme.border)
            .foregroundStyle(AppTheme.text)
    }
}

private struct InvertColorsModifier: ViewModifier {
    let active: Bool

    func body(content: Content) -> some View {
        if active {
            content.colorInvert()
        } else {
            content
        }
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
                    .font(.headline.weight(.bold))
                    .padding(.vertical, 5)
                    .padding(.horizontal, 10)
                    .background(AppTheme.fieldBackground)
                    .clipShape(Capsule())
                    .overlay {
                        Capsule()
                            .stroke(AppTheme.border, lineWidth: 2)
                    }
                Spacer()
                Button(Strings.value("delete", language: language), role: .destructive, action: onDelete)
                    .buttonStyle(BlueBorderedButtonStyle())
            }

            Text(task.caregiver)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(AppTheme.text)

            if let dueTime = task.dueTime {
                Text("\(Strings.value("dueAt", language: language)) \(dueTime.formatted(date: .omitted, time: .shortened))")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(AppTheme.text)
            }

            if !task.details.isEmpty {
                Text(task.details)
                    .font(.body)
                    .foregroundStyle(AppTheme.text)
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
            "accessibility": "Accessibility",
            "invertColors": "Invert Colors",
            "dyslexicFont": "Dyslexic Font",
            "readPageAloud": "Read page aloud",
            "readPageHelp": "Reads the current summary and task list slowly.",
            "backup": "Backup",
            "exportJson": "Export JSON",
            "importJson": "Import JSON",
            "exportComplete": "Export complete.",
            "exportFailed": "Could not export tasks.",
            "importComplete": "Import complete.",
            "importFailed": "Could not import that JSON file.",
            "howToUse": "How to use",
            "howToPickDate": "Pick the date",
            "howToChooseType": "Choose task type",
            "howToAddDetails": "Add details and caregiver name",
            "howToRepeat": "Repeat for other family members",
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
            "accessibility": "辅助功能",
            "invertColors": "反转颜色",
            "dyslexicFont": "阅读障碍字体",
            "readPageAloud": "朗读页面",
            "readPageHelp": "慢速朗读当前摘要和任务列表。",
            "backup": "备份",
            "exportJson": "导出 JSON",
            "importJson": "导入 JSON",
            "exportComplete": "导出完成。",
            "exportFailed": "无法导出任务。",
            "importComplete": "导入完成。",
            "importFailed": "无法导入该 JSON 文件。",
            "howToUse": "使用方法",
            "howToPickDate": "选择日期",
            "howToChooseType": "选择任务类型",
            "howToAddDetails": "添加详细信息和护理人员姓名",
            "howToRepeat": "为其他家庭成员重复",
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
            "accessibility": "Accesibilidad",
            "invertColors": "Invertir colores",
            "dyslexicFont": "Fuente dislexica",
            "readPageAloud": "Leer pagina en voz alta",
            "readPageHelp": "Lee lentamente el resumen actual y la lista de tareas.",
            "backup": "Copia de seguridad",
            "exportJson": "Exportar JSON",
            "importJson": "Importar JSON",
            "exportComplete": "Exportacion completa.",
            "exportFailed": "No se pudieron exportar las tareas.",
            "importComplete": "Importacion completa.",
            "importFailed": "No se pudo importar ese archivo JSON.",
            "howToUse": "Como usar",
            "howToPickDate": "Elige la fecha",
            "howToChooseType": "Elige el tipo de tarea",
            "howToAddDetails": "Agrega detalles y nombre del cuidador",
            "howToRepeat": "Repite para otros familiares",
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
            "accessibility": "सुलभता",
            "invertColors": "रंग उलटें",
            "dyslexicFont": "डिस्लेक्सिक फ़ॉन्ट",
            "readPageAloud": "पेज ज़ोर से पढ़ें",
            "readPageHelp": "मौजूदा सारांश और कार्य सूची को धीरे-धीरे पढ़ता है।",
            "backup": "बैकअप",
            "exportJson": "JSON निर्यात करें",
            "importJson": "JSON आयात करें",
            "exportComplete": "निर्यात पूरा हुआ।",
            "exportFailed": "कार्य निर्यात नहीं किए जा सके।",
            "importComplete": "आयात पूरा हुआ।",
            "importFailed": "वह JSON फ़ाइल आयात नहीं की जा सकी।",
            "howToUse": "कैसे उपयोग करें",
            "howToPickDate": "तारीख चुनें",
            "howToChooseType": "कार्य प्रकार चुनें",
            "howToAddDetails": "विवरण और देखभालकर्ता का नाम जोड़ें",
            "howToRepeat": "परिवार के अन्य सदस्यों के लिए दोहराएं",
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

import SwiftUI
import UserNotifications
import AVFoundation
import CoreText

@main
struct CaregiverTrackerApp: App {
    init() {
        FontRegistrar.registerOpenDyslexic()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

enum TaskKind: String, CaseIterable, Codable, Identifiable {
    case medication = "Medication"
    case meal = "Meal"
    case appointment = "Appointment"
    case other = "Other"

    var id: String { rawValue }
}

enum AppLanguage: String, CaseIterable, Identifiable {
    case english = "en"
    case chinese = "zh"
    case spanish = "es"
    case hindi = "hi"

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .english: "English"
        case .chinese: "简体中文"
        case .spanish: "Español"
        case .hindi: "हिन्दी"
        }
    }

    var speechCode: String {
        switch self {
        case .english: "en-US"
        case .chinese: "zh-CN"
        case .spanish: "es-ES"
        case .hindi: "hi-IN"
        }
    }
}

final class PageSpeaker {
    private let synthesizer = AVSpeechSynthesizer()

    func speak(_ text: String, language: AppLanguage) {
        let cleanText = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !cleanText.isEmpty else { return }

        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }

        let utterance = AVSpeechUtterance(string: cleanText)
        utterance.voice = AVSpeechSynthesisVoice(language: language.speechCode)
        utterance.rate = 0.38
        synthesizer.speak(utterance)
    }
}

enum FontRegistrar {
    static func registerOpenDyslexic() {
        guard let url = Bundle.main.url(forResource: "OpenDyslexic-Regular", withExtension: "otf") else {
            return
        }

        CTFontManagerRegisterFontsForURL(url as CFURL, .process, nil)
    }
}

struct CareTask: Identifiable, Codable, Equatable {
    var id = UUID()
    var caregiver: String
    var date: Date
    var dueTime: Date?
    var kind: TaskKind
    var details: String
    var createdAt = Date()
}

struct TaskBackup: Codable {
    var version: Int
    var exportedAt: Date
    var tasks: [CareTask]
}

@Observable
final class TaskStore {
    private let storageKey = "caregiverTasksNative_v1"

    var tasks: [CareTask] = [] {
        didSet { save() }
    }

    init() {
        load()
    }

    func add(_ task: CareTask) {
        tasks.append(task)
        scheduleNotification(for: task)
    }

    func delete(_ task: CareTask) {
        tasks.removeAll { $0.id == task.id }
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [task.id.uuidString])
    }

    func clearDay(_ date: Date) {
        let calendar = Calendar.current
        let removed = tasks.filter { calendar.isDate($0.date, inSameDayAs: date) }
        tasks.removeAll { calendar.isDate($0.date, inSameDayAs: date) }
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: removed.map { $0.id.uuidString })
    }

    func tasks(on date: Date) -> [CareTask] {
        let calendar = Calendar.current
        return tasks
            .filter { calendar.isDate($0.date, inSameDayAs: date) }
            .sorted {
                switch ($0.dueTime, $1.dueTime) {
                case let (left?, right?):
                    return left < right
                case (_?, nil):
                    return true
                case (nil, _?):
                    return false
                case (nil, nil):
                    return $0.createdAt > $1.createdAt
                }
            }
    }

    func counts(on date: Date) -> [TaskKind: Int] {
        Dictionary(grouping: tasks(on: date), by: \.kind).mapValues(\.count)
    }

    func requestNotifications() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { [weak self] granted, _ in
            guard granted else { return }
            self?.tasks.forEach { self?.scheduleNotification(for: $0) }
        }
    }

    func exportData() throws -> Data {
        let backup = TaskBackup(version: 1, exportedAt: Date(), tasks: tasks)
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return try encoder.encode(backup)
    }

    func importData(_ data: Data) throws {
        let decoder = JSONDecoder()
        let backup = try decoder.decode(TaskBackup.self, from: data)
        tasks = backup.tasks
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        tasks.forEach { scheduleNotification(for: $0) }
    }

    private func scheduleNotification(for task: CareTask) {
        guard let dueTime = task.dueTime, dueTime > Date() else { return }

        let content = UNMutableNotificationContent()
        content.title = task.kind.rawValue
        content.body = task.details.isEmpty ? "Care task is due now." : task.details
        content.sound = .default

        let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: dueTime)
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        let request = UNNotificationRequest(identifier: task.id.uuidString, content: content, trigger: trigger)

        UNUserNotificationCenter.current().add(request)
    }

    private func load() {
        guard let data = UserDefaults.standard.data(forKey: storageKey) else { return }
        tasks = (try? JSONDecoder().decode([CareTask].self, from: data)) ?? []
    }

    private func save() {
        guard let data = try? JSONEncoder().encode(tasks) else { return }
        UserDefaults.standard.set(data, forKey: storageKey)
    }
}

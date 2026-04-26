# App Store Publishing Notes

This repo now includes `CaregiverTrackerApp.xcodeproj`, a native SwiftUI iOS app target named `CaregiverTracker`.

## What is ready

- Native iOS task tracker UI for caregiver tasks.
- Date and time entry for medications, meals, appointments, and other tasks.
- Local iOS notifications for timed tasks after the user grants permission.
- Local task persistence with `UserDefaults`.
- In-app language picker for English, Simplified Chinese, Spanish, and Hindi.
- Generated Info.plist settings for a first app-store-ready target.

## Before App Store submission

1. Open `CaregiverTrackerApp.xcodeproj` in Xcode.
2. Select the `CaregiverTracker` target.
3. Set your Apple Developer Team under Signing & Capabilities.
4. Confirm or change the bundle identifier from `com.arjunrao.caregivertracker`.
5. Add production app icons in an asset catalog before uploading.
6. Create the app record in App Store Connect.
7. Fill in App Privacy details. This version stores caregiver/task data only on device and does not include analytics or third-party SDKs.
8. Add screenshots, app description, support URL, age rating, and pricing.
9. Archive in Xcode and upload to App Store Connect.
10. Submit for App Review after testing on a real device.

Apple requires current privacy details in App Store Connect before submitting new apps or updates, and App Review expects the app to be tested for stability before submission.

self.addEventListener("notificationclick", function (event) {
event.notification.close();

const targetUrl = event.notification.data && event.notification.data.url
? event.notification.data.url
: self.registration.scope;

event.waitUntil(
self.clients.matchAll({
type: "window",
includeUncontrolled: true
}).then(function (clientList) {
for (const client of clientList) {
if (client.url === targetUrl && "focus" in client) {
return client.focus();
}
}

if (self.clients.openWindow) {
return self.clients.openWindow(targetUrl);
}
})
);
});

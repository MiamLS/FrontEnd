// API-adresser holdes samlet her, så de nemt kan ændres mellem miljøer.
window.AppConfig = Object.freeze({
  apiBaseUrl: "https://localhost:7253/api",
  loginUrl: "https://localhost:7253/api/Auth/login",
  musicRecordUrl: "https://localhost:7253/api/MusicRecord",
});

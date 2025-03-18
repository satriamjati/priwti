document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const customTitleInput = document.getElementById("customTitleInput");

  // Load saved settings with defaults
  chrome.storage.local.get({ enabled: true, customTitle: "Private Browsing" }, (data) => {
    toggleSwitch.checked = data.enabled;
    customTitleInput.value = data.customTitle;
  });

  // Save enabled state changes
  toggleSwitch.addEventListener("change", () => {
    chrome.storage.local.set({ enabled: toggleSwitch.checked });
  });

  // Save custom title changes (update in real time)
  customTitleInput.addEventListener("input", () => {
    chrome.storage.local.set({ customTitle: customTitleInput.value });
  });
});

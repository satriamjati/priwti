// Global variable for the custom title
let customTitle = "Private Browsing"; // Default title

// Function to force the custom title
function setTitle() {
  if (document.title !== customTitle) {
    document.title = customTitle;
  }
}

// Global observer variables
let titleElementObserver = null;
let headObserver = null;

// Observe changes on <title> 
function observeTitleElement() {
  let titleElement = document.querySelector("title");
  if (!titleElement) {
    titleElement = document.createElement("title");
    document.head.appendChild(titleElement);
  }
  
  // Disconnect previous observer if exists
  if (titleElementObserver) {
    titleElementObserver.disconnect();
  }
  
  // Create a new observer for the <title> element
  titleElementObserver = new MutationObserver(() => {
    setTitle();
  });
  
  titleElementObserver.observe(titleElement, { childList: true, characterData: true });
}

// Observe changes on document.head in case <title> is replaced or removed
function observeHeadForTitle() {
  if (headObserver) {
    headObserver.disconnect();
  }
  
  headObserver = new MutationObserver(() => {
    let titleElement = document.querySelector("title");
    if (!titleElement) {
      titleElement = document.createElement("title");
      document.head.appendChild(titleElement);
    }
    observeTitleElement();
    setTitle();
  });
  
  headObserver.observe(document.head, { childList: true });
}

// Start observing for dynamic changes and enforce the custom title
function startObserving() {
  setTitle();
  observeTitleElement();
  observeHeadForTitle();
}

// Stop all observers so that the extension no longer forces the custom title
function stopObserving() {
  if (titleElementObserver) {
    titleElementObserver.disconnect();
    titleElementObserver = null;
  }
  if (headObserver) {
    headObserver.disconnect();
    headObserver = null;
  }
}

// Update title changer based on toggle state
function updateTitleChanger(enabled) {
  if (enabled) {
    startObserving();
  } else {
    stopObserving();
    // Optionally, leave the title as is when disabled.
  }
}

// Load the initial settings (both enabled state and custom title)
chrome.storage.local.get(["enabled", "customTitle"], (data) => {
  if (typeof data.customTitle === "undefined") {
    customTitle = "Private Browsing";
    chrome.storage.local.set({ customTitle: customTitle });
  } else {
    customTitle = data.customTitle;
  }
  updateTitleChanger(data.enabled ?? true);
});

// Listen for toggle changes and custom title changes in real time
chrome.storage.onChanged.addListener((changes) => {
  if ("enabled" in changes) {
    updateTitleChanger(changes.enabled.newValue);
  }
  if ("customTitle" in changes) {
    customTitle = changes.customTitle.newValue;
    setTitle();
  }
});

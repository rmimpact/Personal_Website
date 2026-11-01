const supportForm = document.querySelector("[data-support-form]");
const appSelect = document.querySelector("[data-app-select]");
const requestTypeSelect = document.querySelector("[data-request-type-select]");
const formNotice = document.querySelector("[data-form-notice]");
let supportApps = [];

function addOptions(select, options) {
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option.id;
    element.textContent = option.name;
    select.appendChild(element);
  });
}

async function loadSupportOptions() {
  if (!appSelect || !requestTypeSelect) return;

  try {
    const response = await fetch("/support/options.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Could not load support options");

    const options = await response.json();
    supportApps = options.apps || [];
    addOptions(appSelect, supportApps);
    addOptions(requestTypeSelect, options.requestTypes || []);
  } catch (error) {
    addOptions(appSelect, [{ id: "general", name: "General app support" }]);
    addOptions(requestTypeSelect, [{ id: "help", name: "Help using the app" }]);
    if (formNotice) {
      formNotice.textContent = "Some choices could not be loaded, but you can still send your message.";
    }
  } finally {
    appSelect.disabled = false;
    requestTypeSelect.disabled = false;
    selectProjectFromHash();
  }
}

function normaliseProjectKey(value) {
  let decoded = value;

  try {
    decoded = decodeURIComponent(value);
  } catch (error) {
    // Keep the original hash if it contains malformed percent encoding.
  }

  return decoded
    .replace(/^#/, "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchingApp(projectKey) {
  const normalisedKey = normaliseProjectKey(projectKey);
  if (!normalisedKey) return null;

  return supportApps.find((app) => {
    const keys = [app.id, app.name, ...(app.aliases || [])];
    return keys.some((key) => normaliseProjectKey(key) === normalisedKey);
  }) || null;
}

function updatePrivacyNotice() {
  if (!formNotice) return;

  const selectedApp = supportApps.find((app) => app.id === appSelect.value);
  const privacyUrl = selectedApp?.privacyUrl || "/privacy/#support";
  const linkLabel = selectedApp?.privacyUrl
    ? `${selectedApp.name} Privacy Policy`
    : "Privacy Policy";

  formNotice.replaceChildren(
    document.createTextNode("Your details are sent through FormSubmit and used to handle your request. See the "),
    Object.assign(document.createElement("a"), { href: privacyUrl, textContent: linkLabel }),
    document.createTextNode(".")
  );
}

function selectProjectFromHash() {
  if (!appSelect || appSelect.disabled) return;

  const selectedApp = matchingApp(window.location.hash);
  appSelect.value = selectedApp?.id || "";
  updatePrivacyNotice();
}

function selectedLabel(select) {
  return select.options[select.selectedIndex]?.textContent.trim() || "App";
}

if (supportForm) {
  supportForm.addEventListener("submit", () => {
    const subject = supportForm.querySelector('input[name="_subject"]');
    const submitButton = supportForm.querySelector('button[type="submit"]');
    const firstName = supportForm.elements.first_name.value.trim();
    const lastName = supportForm.elements.last_name.value.trim();

    subject.value = `[App Support] ${selectedLabel(appSelect)} — ${selectedLabel(requestTypeSelect)} — ${firstName} ${lastName}`;
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
  });
}

if (appSelect) {
  appSelect.addEventListener("change", updatePrivacyNotice);
  window.addEventListener("hashchange", selectProjectFromHash);
}

loadSupportOptions();

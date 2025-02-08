const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", category: "Mindfulness" }
];

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.color = isError ? "red" : "green";
  setTimeout(() => notification.textContent = "", 3000);
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    const serverQuotes = data.slice(0, 3).map(post => ({
      text: post.title,
      category: "Server"
    }));
    return serverQuotes;
  } catch (error) {
    showNotification("Failed to fetch quotes from server.", true);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
    const data = await response.json();
    showNotification("Quote successfully posted to server.");
    return data;
  } catch (error) {
    showNotification("Failed to post quote to server.", true);
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const mergedQuotes = resolveConflicts(serverQuotes, localQuotes);
  
  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  showNotification("Data synced with server.");
  populateCategories();
  filterQuotes();
}

function resolveConflicts(serverQuotes, localQuotes) {
  const resolvedQuotes = [...localQuotes];
  let conflicts = [];
  
  serverQuotes.forEach(serverQuote => {
    const conflictIndex = localQuotes.findIndex(localQuote => localQuote.text === serverQuote.text);
    if (conflictIndex !== -1) {
      conflicts.push({ local: localQuotes[conflictIndex], server: serverQuote });
      resolvedQuotes[conflictIndex] = serverQuote;
    } else {
      resolvedQuotes.push(serverQuote);
    }
  });
  
  if (conflicts.length > 0) {
    showConflictNotification(conflicts);
  }
  return resolvedQuotes;
}

function showConflictNotification(conflicts) {
  const conflictMessage = "Conflicts detected. Server data has been applied. Click to review.";
  showNotification(conflictMessage);
  document.getElementById("notification").onclick = () => displayConflictResolution(conflicts);
}

function displayConflictResolution(conflicts) {
  let conflictContainer = document.getElementById("conflictContainer");
  if (!conflictContainer) {
    conflictContainer = document.createElement("div");
    conflictContainer.id = "conflictContainer";
    document.body.appendChild(conflictContainer);
  }
  conflictContainer.innerHTML = "<h3>Conflict Resolution</h3>";
  conflicts.forEach((conflict, index) => {
    const conflictDiv = document.createElement("div");
    conflictDiv.innerHTML = `
      <p><strong>Local:</strong> ${conflict.local.text} <br>
      <strong>Server:</strong> ${conflict.server.text}</p>
      <button onclick="resolveManually(${index}, 'local')">Keep Local</button>
      <button onclick="resolveManually(${index}, 'server')">Keep Server</button>
    `;
    conflictContainer.appendChild(conflictDiv);
  });
}

function resolveManually(index, choice) {
  const quotes = JSON.parse(localStorage.getItem("quotes"));
  const conflictContainer = document.getElementById("conflictContainer");
  conflictContainer.remove();
  
  if (choice === "local") {
    showNotification("Local version kept.");
  } else {
    quotes[index] = conflicts[index].server;
    showNotification("Server version kept.");
  }
  
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  filterQuotes();
}

function startSync() {
  setInterval(syncQuotes, 10000);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
window.onload = function() {
  populateCategories();
  const lastFilter = localStorage.getItem("lastFilter") || "all";
  document.getElementById("categoryFilter").value = lastFilter;
  filterQuotes();
  startSync();
};

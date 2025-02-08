const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", category: "Mindfulness" }
];

// Simulate server URL
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Function to show a notification
function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.color = isError ? "red" : "green";
  setTimeout(() => notification.textContent = "", 3000); // Clear after 3 seconds
}

// Function to fetch quotes from the server (simulated)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    // Simulate server response with quotes
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

// Function to sync local data with server data
async function syncData() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Merge server and local quotes (server data takes precedence)
  const mergedQuotes = [...localQuotes];
  serverQuotes.forEach(serverQuote => {
    const exists = localQuotes.some(localQuote => localQuote.text === serverQuote.text);
    if (!exists) {
      mergedQuotes.push(serverQuote);
    }
  });

  // Update local storage and UI
  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  showNotification("Data synced with server.");
  populateCategories();
  filterQuotes();
}

// Function to resolve conflicts (server data takes precedence)
function resolveConflicts(serverQuotes, localQuotes) {
  const resolvedQuotes = [...localQuotes];
  serverQuotes.forEach(serverQuote => {
    const conflictIndex = localQuotes.findIndex(localQuote => localQuote.text === serverQuote.text);
    if (conflictIndex !== -1) {
      resolvedQuotes[conflictIndex] = serverQuote; // Server data overwrites local data
    } else {
      resolvedQuotes.push(serverQuote);
    }
  });
  return resolvedQuotes;
}

// Function to periodically sync data
function startSync() {
  setInterval(syncData, 10000); // Sync every 10 seconds
}

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> "${quote.text}"</p>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Function to create the "Add Quote" form
function createAddQuoteForm() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const newQuoteText = document.createElement("input");
  newQuoteText.setAttribute("type", "text");
  newQuoteText.placeholder = "Enter a new quote";
  newQuoteText.id = "newQuoteText";

  const newQuoteCategory = document.createElement("input");
  newQuoteCategory.setAttribute("type", "text");
  newQuoteCategory.placeholder = "Enter quote category";
  newQuoteCategory.id = "newQuoteCategory";

  const btn = document.createElement("button");
  btn.innerHTML = "Add Quote";
  btn.onclick = addQuote;

  container.appendChild(newQuoteText);
  container.appendChild(newQuoteCategory);
  container.appendChild(btn);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });
  localStorage.setItem("quotes", JSON.stringify(quotes));

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  showNotification("New quote added successfully!");
  populateCategories();
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        showNotification("Quotes imported successfully!");
        populateCategories();
      } else {
        showNotification("Invalid file format. Please upload a valid JSON file.", true);
      }
    } catch (error) {
      showNotification("Error parsing JSON file.", true);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(quote => quote.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `<p><strong>${quote.category}:</strong> "${quote.text}"</p>`).join("");

  localStorage.setItem("lastFilter", selectedCategory);
}

// Initialize the application
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
window.onload = function() {
  createAddQuoteForm();
  populateCategories();

  const lastFilter = localStorage.getItem("lastFilter") || "all";
  document.getElementById("categoryFilter").value = lastFilter;
  filterQuotes();

  if (sessionStorage.getItem("lastQuote")) {
    document.getElementById("quoteDisplay").innerHTML = `<p><strong>Last viewed:</strong> ${JSON.parse(sessionStorage.getItem("lastQuote")).text}</p>`;
  } else {
    showRandomQuote();
  }

  startSync(); // Start periodic data syncing
};
const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", category: "Mindfulness" }
];

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> "${quote.text}"</p>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

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
  alert("New quote added successfully!");
}

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

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      try {
          const importedQuotes = JSON.parse(event.target.result);
          if (Array.isArray(importedQuotes)) {
              quotes.push(...importedQuotes);
              localStorage.setItem("quotes", JSON.stringify(quotes));
              alert("Quotes imported successfully!");
          } else {
              alert("Invalid file format. Please upload a valid JSON file.");
          }
      } catch (error) {
          alert("Error parsing JSON file.");
      }
  };
  fileReader.readAsText(event.target.files[0]);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
window.onload = function() {
  createAddQuoteForm();
  if (sessionStorage.getItem("lastQuote")) {
      document.getElementById("quoteDisplay").innerHTML = `<p><strong>Last viewed:</strong> ${JSON.parse(sessionStorage.getItem("lastQuote")).text}</p>`;
  } else {
      showRandomQuote();
  }
};

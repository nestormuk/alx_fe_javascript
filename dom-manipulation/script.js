// Array of quotes with initial values
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", category: "Mindfulness" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    // Select the element where the quote will be displayed
    const quoteDisplay = document.getElementById("quoteDisplay");
    
    // Pick a random quote from the array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    // Update the DOM to show the selected quote
    quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> "${quote.text}"</p>`;
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
createAddQuoteForm();


  // Attach an event listener to the button to show a new quote when clicked
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Function to add a new quote dynamically
  function addQuote() {
    // Get input values from the text fields
    newQuoteText = document.getElementById("newQuoteText").value.trim();
    newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    // Validate inputs to ensure both fields are filled
    if (newQuoteText === "" || newQuoteCategory === "") {
      alert("Please enter both quote text and category.");
      return;
    }
  
    // Add the new quote to the quotes array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
  
    // Clear input fields after adding the quote
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    
    // Notify the user that the quote was added successfully
    alert("New quote added successfully!");
  }
  
  // Show an initial random quote when the page loads
  showRandomQuote();
  
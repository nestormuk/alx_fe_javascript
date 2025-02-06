
function showRandomQuote() {
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
    btn.innerText = "Add Quote";
    btn.onclick = addQuote; 

    container.appendChild(newQuoteText);
    container.appendChild(newQuoteCategory);
    container.appendChild(btn);
}

showRandomQuote();

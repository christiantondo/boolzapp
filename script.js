// Recupero elementi in pagina
const input = document.querySelector("input")
const button = document.querySelector("button")
const chatBox = document.querySelector(".chat-box")

// Preparazione dei messaggi iniziali
const messages = [
    {
        type: "sent",
        text: "Ciao, come va?",
        time: "24/11/2025 20:27:00"
    },
    {
        type: "received",
        text: "Tutto bene, grazie. E tu?",
        time: "24/11/2025 20:37:00"
    }
]

// Mostra i messaggi in pagina
showMessages()

// Operazioni di interazione con l'utente
// Al click del bottone...
button.addEventListener("click", sendMessage)

// Alla pressione del tasto invio
input.addEventListener("keydown", function (event) {
    // Controllo se il tasto cliccato è "invio"
    if(event.key === "Enter") sendMessage()
})

// Funzioni riutilizzabili

// Funzione per mostrare i messaggi in pagina
function showMessages() {
    // Svuoto la chat
    chatBox.innerHTML = "";

    // Per ciascuno dei messaggi...
    for (const message of messages) {
        chatBox.innerHTML += `
    <div class="chat-row ${message.type}">
            <div class="chat-message">
                <p>${message.text}</p>
                <time datetime="${message.time}">
                    ${message.time}
                </time>
            </div>
        </div>`
    }
}

// Funzione per aggiungere un messaggio
function addMessage(messageType, messageText) {
    // Creo un nuovo messaggio
    const newMessage = {
        type: messageType,
        text: messageText,
        time: new Date().toLocaleString()
    }

    // Aggiungo questo messaggio alla lista dei messaggi
    messages.push(newMessage)

    // Mostra i messaggi in pagina
    showMessages()
}

// Funzione per inviare un messaggio
function sendMessage() {
    // Recupero il testo inserito dall'utente
    const insertedText = input.value.trim();

    // Se non c'è testo, annulla tutto
    if (insertedText === "") return

    // Aggiungo il messaggio in pagina
    addMessage("sent", insertedText)

    // Svuoto la casella dell'input
    input.value = "";

    // Riporto il "focus" sulla casella
    input.focus()

    // Scorro in automatico alla fine del box chat
    chatBox.scrollTop = chatBox.scrollHeight
}

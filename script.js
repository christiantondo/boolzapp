// Recupero elementi in pagina
const input = document.querySelector("input")
const button = document.querySelector("button")
const chatBox = document.querySelector(".chat-box")
const contactStatus = document.querySelector(".contact-status")

// Preparazione dei messaggi iniziali
const messages = []

// Preparo l'indirizzo da chiamare
const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="

const systemPrompt = "Sei Chris, un amico che risponde in modo amichevole e informale. Rispondi in italiano, con un tono cordiale e naturale, come farebbe un amico in una chat. Mantieni le risposte brevi e spontanee."

// Mostra i messaggi in pagina
showMessages()

// Operazioni di interazione con l'utente
// Al click del bottone...
button.addEventListener("click", sendMessage)

// Alla pressione del tasto invio
input.addEventListener("keydown", function (event) {
    // Controllo se il tasto cliccato è "invio"
    if (event.key === "Enter") sendMessage()
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

    // Riporto il "focus" sulla casella
    input.focus()

    // Scorro in automatico alla fine del box chat
    chatBox.scrollTop = chatBox.scrollHeight
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

    // Chiedo a Gemini di generare una risposta
    getAnswerFromGemini()
}

// Implementazione Ai

// Funzione per formattare la chat in un formato adatto per Gemini
function formatChatForGemini() {
    // Preparo un array per la "nuova chat"
    const formattedChat = []

    // Per ciascun messaggio...
    for (const message of messages) {
        // Creo e aggiungo un nuovo oggetto alla mia chat formattata
        formattedChat.push({
            parts: [{ text: message.text }],
            role: message.type === "sent" ? "user" : "model"
        })
    }

    // Aggiungo il system prompt all'inizio dell'array
    formattedChat.unshift({
        role: "user",
        parts: [{ text: systemPrompt }]
    })

    return formattedChat
}

// Funzione per chiedere a Gemini di generare una risposta
async function getAnswerFromGemini() {
    // Prepariamo la chat da inviare
    const chatForGemini = formatChatForGemini()

    // Inseriamo "Sta scrivendo..." nello stato in cima
    contactStatus.innerText = "Sta scrivendo..."

    // Effettuiamo la chiamata alle API di Gemini
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: chatForGemini })
    })

    // Riconverto la risposta dal JSON
    const data = await response.json();

    // Recupero il testo effettivo della risposta
    const answer = data.candidates[0].content.parts[0].text

    // Rimetto "Online" sullo status in cima
    contactStatus.innerText = "Online"

    // Aggiungo il mio messaggio in pagina
    addMessage("received", answer)
}
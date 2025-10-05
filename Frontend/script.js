// =======================================
// Global Functions
// =======================================

/**
 * Checks if the current page is the Contact page and runs its logic.
 */
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('contact-page-body')) {
        setupContactPage();
    }
    if (document.body.classList.contains('chat-page-body')) {
        setupChatPage();
    }
});


// =======================================
// Page 2: Contact Us Logic
// =======================================
function setupContactPage() {
    const form = document.getElementById('contact-form');
    const reasonRadios = document.querySelectorAll('input[name="reason"]');
    const manualInputDiv = document.getElementById('reason-manual-input-wrapper');
    const messageField = document.getElementById('message');

    // 1. Conditional Logic for "Reason for Contact"
    reasonRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'none' || radio.value === 'no_reason') {
                manualInputDiv.style.display = 'block';
                manualInputDiv.querySelector('input').focus();
            } else {
                manualInputDiv.style.display = 'none';
            }
        });
    });

    // 2. Form Submission and Validation
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validation: 5-line minimum (approximated by 200 characters) & 1000 max
        const message = messageField.value.trim();
        if (message.length < 200 || message.length > 1000) {
            alert(`Message must be between 200 and 1000 characters. Current length: ${message.length}.`);
            return;
        }

        // --- Data Collection for Chat Page ---
        const reason = document.querySelector('input[name="reason"]:checked').value;
        const manualReason = document.getElementById('manual-reason').value;
        const selectedServices = Array.from(document.querySelectorAll('input[name="service"]:checked')).map(cb => cb.value);
        
        // Simple object to pass to the next page
        const formData = {
            message: message,
            reason: reason === 'none' || reason === 'no_reason' ? manualReason : reason,
            services: selectedServices
        };

        // Store data in sessionStorage to pass to the chat page
        sessionStorage.setItem('supportTicket', JSON.stringify(formData));

        // Redirect to the Chatting Page
        window.location.href = 'chat.html';
    });
}


// =======================================
// Page 3: Chatting Page Logic
// =======================================
function setupChatPage() {
    const messageArea = document.querySelector('.message-area');
    const ticketData = JSON.parse(sessionStorage.getItem('supportTicket'));

    if (ticketData) {
        // 1. Display User's Original Message
        const userMessageHtml = `
            <div class="message user-message">
                <span class="username">[User Name]:</span>
                <p>${ticketData.message}</p>
            </div>
        `;
        messageArea.innerHTML += userMessageHtml;

        // 2. Display System Welcome (Static)
        const systemWelcomeHtml = `
            <div class="message system-message">
                <p>Welcome to Admin Service. You are now in our queue and will be connected to a human administrator shortly. Your request has been filed under: ${ticketData.reason}.</p>
            </div>
        `;
        messageArea.innerHTML += systemWelcomeHtml;
        
        // 3. Simple Chat Simulation (Not real-time, just for UI demo)
        const typingIndicator = document.querySelector('.typing-indicator');
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.querySelector('.send-button-chat');
        
        sendButton.addEventListener('click', () => {
            const newMessage = chatInput.value.trim();
            if (newMessage) {
                // Add new message to chat
                const newBubbleHtml = `
                    <div class="message user-message">
                        <span class="username">[User Name]:</span>
                        <p>${newMessage}</p>
                    </div>
                `;
                messageArea.innerHTML += newBubbleHtml;
                chatInput.value = ''; // Clear input

                // Simulate Admin response
                typingIndicator.style.display = 'block';
                setTimeout(() => {
                    typingIndicator.style.display = 'none';
                    const adminReplyHtml = `
                        <div class="message system-message">
                            <p>Thank you for your patience. I see your original ticket and I'm reviewing the details now. Please wait a moment.</p>
                        </div>
                    `;
                    messageArea.innerHTML += adminReplyHtml;
                    messageArea.scrollTop = messageArea.scrollHeight; // Scroll to bottom
                }, 2000);
            }
        });

    } else {
        // Fallback if user navigates directly without submitting the form
        messageArea.innerHTML = '<p style="color:red; text-align:center;">No ticket data found. Please submit an inquiry via the Contact Us page.</p>';
    }
}

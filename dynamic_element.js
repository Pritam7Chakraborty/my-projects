// Get references to the button and message container
const button = document.getElementById('createMessageButton');
const messageContainer = document.getElementById('messageContainer');

// Function to create and display a new message
button.addEventListener('click', () => {
    // Step 1: Create a new <div> element
    const newMessage = document.createElement('div');
    
    // Step 2: Set attributes and content
    newMessage.setAttribute('class', 'message');
    newMessage.innerText = 'This is a dynamically created message!';
    
    // Step 3: Append the new message to the container
    messageContainer.appendChild(newMessage);
});

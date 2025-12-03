// Test JavaScript functionality
let clickCount = 0;

const button = document.getElementById('testButton');
const output = document.getElementById('output');

button.addEventListener('click', () => {
    clickCount++;
    output.textContent = `Button clicked ${clickCount} time${clickCount !== 1 ? 's' : ''}! 🎉`;
    
    // Add a fun animation effect
    output.style.animation = 'none';
    setTimeout(() => {
        output.style.animation = 'fadeIn 0.3s ease-in';
    }, 10);
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

console.log('Test page loaded successfully!');

// Display initial message
output.textContent = 'Click the button to see the magic! ✨';
// Adamas Protocol - UI Interactions

// Click effects aur animations
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('game-card')) {
        e.target.style.transform = "scale(0.95)";
        setTimeout(() => {
            e.target.style.transform = "scale(1)";
        }, 100);
    }
});

// Loading screen logic (Optional)
function showLoading() {
    // Ek professional loader dikhane ke liye
}


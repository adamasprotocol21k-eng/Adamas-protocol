/**
 * ADAMAS PROTOCOL - Notification Module (Cosmic Edition)
 * Update: Neon Glass UI, Haptic Feedback & Fixed Animations
 */

const NotifyModule = {
    // 1. SOUND EFFECTS (Paths can be changed to your assets)
    sounds: {
        success: 'assets/sounds/success.mp3',
        error: 'assets/sounds/error.mp3',
        info: 'assets/sounds/click.mp3'
    },

    // 2. MAIN SHOW FUNCTION
    show(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container') || this.createContainer();
        
        const toast = document.createElement('div');
        toast.className = `cosmic-toast toast-${type}`;
        
        // Dynamic Icons based on type
        const icon = {
            success: '✨',
            error: '🚫',
            info: '🛰️',
            warning: '⚠️'
        }[type] || '🔔';

        toast.innerHTML = `
            <div class="toast-glow"></div>
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span class="toast-text">${message}</span>
            </div>
            <div class="toast-progress-bar"></div>
        `;

        toastContainer.prepend(toast); // Naya notification sabse upar dikhega

        // Effects: Sound & Vibration
        this.triggerEffects(type);

        // Auto Remove
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 600);
        }, 3500);
    },

    // 3. INTERNAL: Create Styles & Container
    createContainer() {
        // Injecting CSS directly so you don't need a separate CSS file for notifications
        const style = document.createElement('style');
        style.innerHTML = `
            #toast-container {
                position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
                z-index: 10000; width: 90%; max-width: 380px;
                display: flex; flex-direction: column; gap: 12px;
            }
            .cosmic-toast {
                position: relative; background: rgba(10, 11, 20, 0.9);
                backdrop-filter: blur(15px); border-radius: 18px;
                padding: 16px 20px; border: 1px solid rgba(255, 255, 255, 0.1);
                overflow: hidden; animation: slideDown 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            .toast-content { display: flex; align-items: center; gap: 15px; position: relative; z-index: 2; }
            .toast-icon { font-size: 1.4rem; filter: drop-shadow(0 0 5px currentColor); }
            .toast-text { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.5px; color: #fff; }
            
            /* Type Specific Borders */
            .toast-success { border-color: #00ff88; box-shadow: 0 0 15px rgba(0, 255, 136, 0.2); }
            .toast-error { border-color: #ff3366; box-shadow: 0 0 15px rgba(255, 51, 102, 0.2); }
            .toast-info { border-color: #00f2ff; box-shadow: 0 0 15px rgba(0, 242, 255, 0.2); }

            .toast-progress-bar {
                position: absolute; bottom: 0; left: 0; height: 3px; width: 100%;
                background: rgba(255,255,255,0.2); transform-origin: left;
                animation: progress 3.5s linear forwards;
            }

            @keyframes slideDown { from { opacity: 0; transform: translateY(-20px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes toast-exit { to { opacity: 0; transform: scale(0.8); } }
            @keyframes progress { from { transform: scaleX(1); } to { transform: scaleX(0); } }
            .toast-exit { animation: toast-exit 0.5s forwards; }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
        return container;
    },

    // 4. EFFECTS: Sound + Haptics
    triggerEffects(type) {
        // Sound
        try {
            const audio = new Audio(this.sounds[type] || this.sounds.info);
            audio.volume = 0.4;
            audio.play();
        } catch (e) { console.log("Sound blocked"); }

        // Haptics (Vibrate) - Sirf Mobile par kaam karega
        if (navigator.vibrate) {
            if (type === 'success') navigator.vibrate([50, 30, 50]);
            else if (type === 'error') navigator.vibrate(200);
            else navigator.vibrate(30);
        }
    }
};

window.Notify = NotifyModule;

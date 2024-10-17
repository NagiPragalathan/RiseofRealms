// Function to check if the device is mobile
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Apply mobile controls only if the device is mobile
document.addEventListener("DOMContentLoaded", function () {
    let joystickContainer = document.getElementById('joystickContainer');

    if (isMobileDevice()) {
        console.log("Mobile device detected. Enabling mobile controls.");
        
        // Show the joystick container for mobile devices
        joystickContainer.classList.remove('hidden');

        // Joystick logic for mobile
        let joystick = document.getElementById('joystick');

        if (joystickContainer && joystick) {
            let maxDiff = 75;  // Maximum distance the joystick knob can move from the center
            let startX, startY, active = false;

            joystickContainer.addEventListener('touchstart', function (e) {
                active = true;
                let touch = e.targetTouches[0];
                startX = touch.pageX;
                startY = touch.pageY;
            });

            joystickContainer.addEventListener('touchmove', function (e) {
                if (!active) return;

                let touch = e.targetTouches[0];
                let deltaX = touch.pageX - startX;
                let deltaY = touch.pageY - startY;
                let distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDiff);
                let angle = Math.atan2(deltaY, deltaX);

                // Move the joystick
                joystick.style.transform = `translate(${distance * Math.cos(angle)}px, ${distance * Math.sin(angle)}px)`;

                // Calculate player movement based on joystick angle
                let moveX = Math.cos(angle);
                let moveY = Math.sin(angle);

                // Handle keypress-like behavior based on angle
                if (angle >= -Math.PI / 4 && angle <= Math.PI / 4) {
                    // Right (D key)
                    player.keys['d'] = true;
                } else if (angle > Math.PI / 4 && angle < 3 * Math.PI / 4) {
                    // Down (S key)
                    player.keys['s'] = true;
                } else if (angle >= 3 * Math.PI / 4 || angle <= -3 * Math.PI / 4) {
                    // Left (A key)
                    player.keys['a'] = true;
                } else if (angle > -3 * Math.PI / 4 && angle < -Math.PI / 4) {
                    // Up (W key)
                    player.keys['w'] = true;
                }

                e.preventDefault();
            });

            joystickContainer.addEventListener('touchend', function (e) {
                active = false;
                joystick.style.transform = `translate(0px, 0px)`;
                // Reset player keys
                player.keys['w'] = false;
                player.keys['a'] = false;
                player.keys['s'] = false;
                player.keys['d'] = false;
            });

            // Screen rotation using touch
            let touchStartX, touchStartY;
            let rotating = false;
            let sensitivity = 0.003;  // Adjust sensitivity for touch movement

            // Start capturing touch movement for rotating the screen
            page.renderSurface.addEventListener('touchstart', function (e) {
                if (e.touches.length === 1) {
                    // Start touch point
                    touchStartX = e.touches[0].pageX;
                    touchStartY = e.touches[0].pageY;
                    rotating = true;
                }
            });

            // Handle touch movement for rotating the screen
            page.renderSurface.addEventListener('touchmove', function (e) {
                if (rotating && e.touches.length === 1) {
                    let touchMoveX = e.touches[0].pageX - touchStartX;
                    let touchMoveY = e.touches[0].pageY - touchStartY;

                    // Simulate mouse movement for camera control (yaw and pitch)
                    player.targetYaw += touchMoveX * sensitivity;
                    player.targetPitch -= touchMoveY * sensitivity;

                    // Clamp pitch to avoid flipping
                    if (player.targetPitch < -Math.PI / 2) player.targetPitch = -Math.PI / 2;
                    if (player.targetPitch > Math.PI / 2) player.targetPitch = Math.PI / 2;

                    // Update touch start positions for the next move
                    touchStartX = e.touches[0].pageX;
                    touchStartY = e.touches[0].pageY;
                }
                e.preventDefault();
            });

            // Stop capturing touch movement when the user lifts their finger
            page.renderSurface.addEventListener('touchend', function (e) {
                if (e.touches.length === 0) {
                    rotating = false;
                }
            });
        } else {
            console.error("Joystick elements not found.");
        }
    } else {
        console.log("Non-mobile device detected. Mobile controls not applied.");
        // Ensure the joystick remains hidden on non-mobile devices
        joystickContainer.classList.add('hidden');
    }
});

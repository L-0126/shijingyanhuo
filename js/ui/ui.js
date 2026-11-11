// Annotations remain local to a resized or sticky stage.
PB.UI = (() => {
    let bubble;
    let target;
    let deadline = 0;

    function positionBubble() {
        if(!bubble || !target || !target.isConnected) return;
        const bounds = PB.localRect(target);
        const viewport = PB.viewport();
        bubble.style.left = PB.clamp(
            bounds.left + bounds.width / 2 - bubble.offsetWidth / 2,
            12, Math.max(12, viewport.width - bubble.offsetWidth - 12)
        ) + 'px';
        bubble.style.top = PB.clamp(bounds.top - bubble.offsetHeight - 12,
            50, Math.max(50, viewport.height - bubble.offsetHeight - 50)) + 'px';
    }

    function showBubble(text, element, duration = 4400) {
        if(!bubble) {
            bubble = PB.el('speech-bubble', PB.ui);
            bubble.setAttribute('role', 'status');
        }
        bubble.textContent = text;
        target = element;
        deadline = PB.now() + duration;
        bubble.classList.add('show');
        positionBubble();
    }

    function clearBubble() {
        target = null;
        bubble?.classList.remove('show');
    }

    PB.rafLoop.add(now => {
        if(now > deadline) clearBubble();
        else positionBubble();
    });

    return {showBubble, clearBubble, invalidateLayout: positionBubble,
        createHint() {}, dismissHint() {}};
})();

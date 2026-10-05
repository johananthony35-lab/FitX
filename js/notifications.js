// FITX TOAST & NOTIFICATION SYSTEM
class NotificationManager {
  static showToast(message, type = 'emerald') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeftColor = type === 'amber' ? 'var(--accent-amber)' : type === 'rose' ? 'var(--accent-rose)' : 'var(--accent-emerald)';

    toast.innerHTML = `
      <span style="font-size: 18px;">${type === 'amber' ? '⚠️' : type === 'rose' ? '🚨' : '🔔'}</span>
      <div style="font-size: 13px; font-weight: 600;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

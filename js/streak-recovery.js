// FITX STREAK SYSTEM & RECOVERY LOGGER MODULE
class StreakRecoveryModule {
  static render(container) {
    const streaks = StorageManager.getStreaks();
    const recovery = StorageManager.getRecoveryToday();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800;">Streaks & Recovery</h1>
          <p style="color: var(--text-secondary); font-size: 14px;">Celebrate active consistency and log daily fatigue, energy, and sleep indicators.</p>
        </div>
        <button class="btn btn-primary" onclick="window.FitXApp.streakRecovery.openRecoveryModal()">
          + Log Daily Recovery Check-in
        </button>
      </div>

      <!-- STREAKS OVERVIEW BANNER -->
      <div class="dashboard-grid" style="margin-bottom: 24px;">
        <div class="col-4">
          <div class="card" style="border-color: rgba(245, 158, 11, 0.4); background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase;">WORKOUT STREAK</div>
                <div style="font-size: 32px; font-weight: 800; font-family: var(--font-heading); color: var(--accent-amber); margin-top: 2px;">
                  🔥 ${streaks.workoutStreak} Days
                </div>
              </div>
              <div style="font-size: 40px;">🏆</div>
            </div>
          </div>
        </div>

        <div class="col-4">
          <div class="card" style="border-color: rgba(16, 185, 129, 0.4); background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase;">NUTRITION STREAK</div>
                <div style="font-size: 32px; font-weight: 800; font-family: var(--font-heading); color: var(--accent-emerald); margin-top: 2px;">
                  🥗 ${streaks.nutritionStreak} Days
                </div>
              </div>
              <div style="font-size: 40px;">🥦</div>
            </div>
          </div>
        </div>

        <div class="col-4">
          <div class="card" style="border-color: rgba(59, 130, 246, 0.4); background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase;">ACTIVITY STREAK</div>
                <div style="font-size: 32px; font-weight: 800; font-family: var(--font-heading); color: var(--accent-blue); margin-top: 2px;">
                  👟 ${streaks.activityStreak} Days
                </div>
              </div>
              <div style="font-size: 40px;">🚀</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ACHIEVEMENTS BADGES GALLERY -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div class="card-title">🎖️ FitX Achievements Gallery</div>
          <span class="badge badge-purple">${streaks.achievements.filter(a => a.unlocked).length} / ${streaks.achievements.length} Unlocked</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px;">
          ${streaks.achievements.map(a => `
            <div style="background: ${a.unlocked ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.3)'}; border: 1px solid ${a.unlocked ? 'var(--border-color-hover)' : 'var(--border-color)'}; padding: 14px; border-radius: var(--radius-md); opacity: ${a.unlocked ? 1 : 0.4}; display: flex; items-center; gap: 12px;">
              <div style="font-size: 32px;">${a.icon}</div>
              <div>
                <div style="font-weight: 700; font-size: 14px;">${a.title}</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${a.desc}</div>
                <div style="margin-top: 6px;">
                  <span class="badge ${a.unlocked ? 'badge-emerald' : 'badge-rose'}">${a.unlocked ? 'Unlocked ✓' : 'Locked 🔒'}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- RECOVERY RATINGS TODAY -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">😴 Today's Recovery Log</div>
          <button class="btn btn-secondary btn-sm" onclick="window.FitXApp.streakRecovery.openRecoveryModal()">Update Scores</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;">
          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-purple);">${recovery.sleepHours} hrs</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Sleep Duration</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-emerald);">${recovery.energy} / 10</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Energy Score</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-amber);">${recovery.soreness} / 10</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Muscle Soreness</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-blue);">${recovery.motivation} / 10</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Motivation Score</div>
          </div>
        </div>
      </div>
    `;
  }

  static openRecoveryModal() {
    const recovery = StorageManager.getRecoveryToday();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 20px; font-weight: 800;">Log Recovery & Fatigue</h2>
          <button style="font-size: 20px; color: var(--text-muted);" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>

        <div class="form-group">
          <label class="form-label">Sleep Duration (Hours)</label>
          <input type="number" id="rec-sleep" class="form-control" step="0.1" value="${recovery.sleepHours}">
        </div>

        <div class="form-group">
          <label class="form-label">Energy Level (1 - 10)</label>
          <input type="range" id="rec-energy" min="1" max="10" value="${recovery.energy}" oninput="document.getElementById('energy-val').textContent = this.value">
          <div style="text-align: right; font-weight: 700; color: var(--accent-emerald);" id="energy-val">${recovery.energy}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Muscle Soreness (1 - 10)</label>
          <input type="range" id="rec-soreness" min="1" max="10" value="${recovery.soreness}" oninput="document.getElementById('soreness-val').textContent = this.value">
          <div style="text-align: right; font-weight: 700; color: var(--accent-amber);" id="soreness-val">${recovery.soreness}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Motivation (1 - 10)</label>
          <input type="range" id="rec-motivation" min="1" max="10" value="${recovery.motivation}" oninput="document.getElementById('motivation-val').textContent = this.value">
          <div style="text-align: right; font-weight: 700; color: var(--accent-blue);" id="motivation-val">${recovery.motivation}</div>
        </div>

        <button class="btn btn-primary btn-full" style="margin-top: 12px;" onclick="window.FitXApp.streakRecovery.saveRecovery()">Save Recovery Log</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  static saveRecovery() {
    const sleepHours = parseFloat(document.getElementById('rec-sleep').value) || 7.5;
    const energy = parseInt(document.getElementById('rec-energy').value) || 8;
    const soreness = parseInt(document.getElementById('rec-soreness').value) || 3;
    const motivation = parseInt(document.getElementById('rec-motivation').value) || 8;

    StorageManager.saveRecoveryToday({
      date: StorageManager.getTodayKey(),
      sleepHours,
      energy,
      soreness,
      motivation,
      fatigue: Math.round(10 - energy)
    });

    const modal = document.querySelector('.modal-overlay.active');
    if (modal) modal.remove();
    window.FitXApp.showToast("😴 Recovery scores logged! AI recommendations updated.");
    this.render(document.getElementById('view-progress'));
  }
}

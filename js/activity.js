// FITX DAILY ACTIVITY MODULE
class ActivityModule {
  static render(container) {
    const profile = StorageManager.getProfile();
    const activity = StorageManager.getActivityToday();

    const stepPct = Math.min(100, Math.round((activity.steps / profile.stepsTarget) * 100));

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800;">Daily Activity & Movement</h1>
          <p style="color: var(--text-secondary); font-size: 14px;">Monitor non-exercise activity thermogenesis (NEAT), steps, and active time.</p>
        </div>
        <button class="btn btn-primary" onclick="window.FitXApp.activity.promptLogSteps()">
          + Log Steps / Activity
        </button>
      </div>

      <!-- MAIN ACTIVITY RING & STATS -->
      <div class="dashboard-grid">
        <div class="col-6">
          <div class="card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; text-align: center;">
            <div class="progress-ring-container" style="margin-bottom: 20px;">
              <svg width="180" height="180" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="10"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent-blue)" stroke-width="10" 
                        stroke-dasharray="314" stroke-dashoffset="${314 - (314 * stepPct / 100)}" 
                        stroke-linecap="round" transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 0.8s ease;"/>
              </svg>
              <div class="progress-ring-text">
                <div class="value" style="font-size: 32px;">${activity.steps.toLocaleString()}</div>
                <div class="label" style="font-size: 12px; color: var(--accent-blue);">Steps Today</div>
              </div>
            </div>

            <div style="font-weight: 700; font-size: 16px;">${stepPct}% of Daily Step Goal (${profile.stepsTarget.toLocaleString()})</div>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
              Only ${(profile.stepsTarget - activity.steps).toLocaleString()} steps remaining to complete today's target!
            </p>
          </div>
        </div>

        <div class="col-6">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
            <div class="card stat-card" style="padding: 20px;">
              <div class="stat-header">
                <span class="stat-label">Active Distance</span>
                <div class="stat-icon blue">📍</div>
              </div>
              <div class="stat-value" style="font-size: 28px;">${activity.distanceKm} <span style="font-size: 14px; color: var(--text-muted);">km</span></div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Estimated walking distance</div>
            </div>

            <div class="card stat-card" style="padding: 20px;">
              <div class="stat-header">
                <span class="stat-label">Active Minutes</span>
                <div class="stat-icon emerald">⏱</div>
              </div>
              <div class="stat-value" style="font-size: 28px;">${activity.activeMinutes} <span style="font-size: 14px; color: var(--text-muted);">mins</span></div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Moderate-to-high intensity</div>
            </div>

            <div class="card stat-card" style="padding: 20px;">
              <div class="stat-header">
                <span class="stat-label">Workout Calories</span>
                <div class="stat-icon amber">🔥</div>
              </div>
              <div class="stat-value" style="font-size: 28px;">${activity.workoutCaloriesBurned} <span style="font-size: 14px; color: var(--text-muted);">kcal</span></div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Direct exercise burn</div>
            </div>

            <div class="card stat-card" style="padding: 20px;">
              <div class="stat-header">
                <span class="stat-label">Total Daily Burn</span>
                <div class="stat-icon purple">⚡</div>
              </div>
              <div class="stat-value" style="font-size: 28px;">${activity.totalCaloriesBurned} <span style="font-size: 14px; color: var(--text-muted);">kcal</span></div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">BMR + Exercise + NEAT</div>
            </div>
          </div>
        </div>

        <!-- WEEKLY ACTIVITY TREND CHART -->
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <div class="card-title">📊 Weekly Activity Trend</div>
              <span class="badge badge-blue">7 Days Overview</span>
            </div>
            <div style="height: 220px; position: relative;" id="activity-chart-container">
              <canvas id="activityChart" style="width: 100%; height: 100%;"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => this.drawChart(), 50);
  }

  static promptLogSteps() {
    const steps = prompt("Enter additional steps to add:", "1500");
    if (steps) {
      const activity = StorageManager.getActivityToday();
      const added = parseInt(steps) || 0;
      activity.steps += added;
      activity.distanceKm = parseFloat((activity.steps * 0.00075).toFixed(1));
      activity.totalCaloriesBurned += Math.round(added * 0.04);

      StorageManager.saveActivityToday(activity);
      window.FitXApp.showToast(`👟 Logged +${added.toLocaleString()} steps!`);
      this.render(document.getElementById('view-activity'));
    }
  }

  static drawChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 200;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [7400, 8900, 10200, 6800, 9500, 11400, 8426];

    const maxVal = 14000;
    const barWidth = 32;
    const gap = (canvas.width - (days.length * barWidth)) / (days.length + 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    days.forEach((day, i) => {
      const val = data[i];
      const barHeight = (val / maxVal) * (canvas.height - 40);
      const x = gap + i * (barWidth + gap);
      const y = canvas.height - 30 - barHeight;

      // Draw Bar
      const grad = ctx.createLinearGradient(0, y, 0, canvas.height - 30);
      grad.addColorStop(0, '#3b82f6');
      grad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 6);
      ctx.fill();

      // Label Text
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(day, x + barWidth / 2, canvas.height - 10);

      // Value Text
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px Outfit';
      ctx.fillText((val / 1000).toFixed(1) + 'k', x + barWidth / 2, y - 6);
    });
  }
}

// FITX PROGRESS DASHBOARD & METRICS TRACKER
class ProgressModule {
  static render(container) {
    const progress = StorageManager.getProgressHistory();
    const latestWeight = progress.weightHistory[progress.weightHistory.length - 1] || { weight: 74.0 };
    const latestMeasure = progress.measurements[progress.measurements.length - 1] || { waistCm: 81, chestCm: 102, armCm: 37, thighCm: 58 };

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800;">Progress & Analytics</h1>
          <p style="color: var(--text-secondary); font-size: 14px;">Track your long-term body transformation, body measurements, and PR milestones.</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" onclick="window.FitXApp.progress.promptLogWeight()">
            + Log Weight
          </button>
          <button class="btn btn-primary" onclick="window.FitXApp.progress.promptLogMeasurements()">
            + Log Measurements
          </button>
        </div>
      </div>

      <!-- KEY METRICS ROW -->
      <div class="dashboard-grid" style="margin-bottom: 24px;">
        <div class="col-3">
          <div class="card stat-card">
            <div class="stat-header">
              <span class="stat-label">Current Weight</span>
              <div class="stat-icon emerald">⚖️</div>
            </div>
            <div class="stat-value">${latestWeight.weight} <span style="font-size: 14px; color: var(--text-muted);">kg</span></div>
            <div style="font-size: 12px; color: var(--accent-emerald);">↓ 1.8 kg in last 30 days</div>
          </div>
        </div>

        <div class="col-3">
          <div class="card stat-card">
            <div class="stat-header">
              <span class="stat-label">Waist Measurement</span>
              <div class="stat-icon blue">📏</div>
            </div>
            <div class="stat-value">${latestMeasure.waistCm} <span style="font-size: 14px; color: var(--text-muted);">cm</span></div>
            <div style="font-size: 12px; color: var(--text-muted);">Recorded on ${latestMeasure.date}</div>
          </div>
        </div>

        <div class="col-3">
          <div class="card stat-card">
            <div class="stat-header">
              <span class="stat-label">Chest Measurement</span>
              <div class="stat-icon purple">📐</div>
            </div>
            <div class="stat-value">${latestMeasure.chestCm} <span style="font-size: 14px; color: var(--text-muted);">cm</span></div>
            <div style="font-size: 12px; color: var(--text-muted);">Recorded on ${latestMeasure.date}</div>
          </div>
        </div>

        <div class="col-3">
          <div class="card stat-card">
            <div class="stat-header">
              <span class="stat-label">Arm / Bicep</span>
              <div class="stat-icon amber">💪</div>
            </div>
            <div class="stat-value">${latestMeasure.armCm} <span style="font-size: 14px; color: var(--text-muted);">cm</span></div>
            <div style="font-size: 12px; color: var(--text-muted);">Recorded on ${latestMeasure.date}</div>
          </div>
        </div>
      </div>

      <!-- WEIGHT PROGRESS LINE CHART -->
      <div class="dashboard-grid">
        <div class="col-8">
          <div class="card">
            <div class="card-header">
              <div class="card-title">📈 Weight Progress Over Time</div>
              <div style="display: flex; gap: 4px;">
                <button class="prompt-chip active">30 Days</button>
                <button class="prompt-chip">90 Days</button>
                <button class="prompt-chip">1 Year</button>
              </div>
            </div>
            <div style="height: 240px;" id="weight-chart-container">
              <canvas id="weightChart" style="width: 100%; height: 100%;"></canvas>
            </div>
          </div>
        </div>

        <!-- STRENGTH PR MILESTONES -->
        <div class="col-4">
          <div class="card">
            <div class="card-title" style="margin-bottom: 16px;">🏆 Personal Record (PR) Wall</div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${progress.prs.map(pr => `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 12px 14px; border-radius: var(--radius-md);">
                  <div>
                    <div style="font-weight: 700; font-size: 14px;">${pr.exercise}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${pr.date}</div>
                  </div>
                  <div style="font-family: var(--font-heading); font-size: 20px; font-weight: 800; color: var(--accent-amber);">
                    ${pr.weightKg} kg
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- CONSISTENCY HEATMAP -->
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <div class="card-title">🔥 Workout Consistency Heatmap</div>
              <span class="badge badge-emerald">Last 28 Days</span>
            </div>

            <div class="heatmap-grid" style="margin-top: 12px;">
              ${Array.from({ length: 28 }).map((_, i) => {
                const activeLevel = [0, 1, 2, 3, 2, 1, 0, 2, 3, 3, 1, 0, 2, 3, 1, 2, 3, 2, 0, 1, 3, 2, 3, 1, 2, 3, 2, 3][i];
                return `<div class="heatmap-day active-${activeLevel}" title="Day ${i + 1}">${i + 1}</div>`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => this.drawWeightChart(), 50);
  }

  static promptLogWeight() {
    const w = prompt("Enter today's weight (kg):", "74.2");
    if (w) {
      const progress = StorageManager.getProgressHistory();
      progress.weightHistory.push({
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(w)
      });
      StorageManager.saveProgressHistory(progress);

      // Update current profile weight
      const profile = StorageManager.getProfile();
      profile.weightKg = parseFloat(w);
      StorageManager.saveProfile(profile);

      window.FitXApp.showToast(`⚖️ Logged weight ${w} kg!`);
      this.render(document.getElementById('view-progress'));
    }
  }

  static promptLogMeasurements() {
    const waist = prompt("Waist circumference (cm):", "81");
    const chest = prompt("Chest circumference (cm):", "102");
    const arm = prompt("Arm circumference (cm):", "37");
    const thigh = prompt("Thigh circumference (cm):", "58");

    if (waist && chest) {
      const progress = StorageManager.getProgressHistory();
      progress.measurements.push({
        date: new Date().toISOString().split('T')[0],
        waistCm: parseFloat(waist),
        chestCm: parseFloat(chest),
        armCm: parseFloat(arm),
        thighCm: parseFloat(thigh)
      });
      StorageManager.saveProgressHistory(progress);
      window.FitXApp.showToast("📏 Body measurements saved successfully!");
      this.render(document.getElementById('view-progress'));
    }
  }

  static drawWeightChart() {
    const canvas = document.getElementById('weightChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 220;

    const history = StorageManager.getProgressHistory().weightHistory;
    if (!history.length) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const minW = Math.min(...history.map(h => h.weight)) - 1;
    const maxW = Math.max(...history.map(h => h.weight)) + 1;

    const points = history.map((h, i) => {
      const x = (i / (history.length - 1)) * (canvas.width - 60) + 40;
      const y = canvas.height - 40 - ((h.weight - minW) / (maxW - minW)) * (canvas.height - 80);
      return { x, y, val: h.weight, date: h.date };
    });

    // Draw Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Points & Labels
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#090d16';
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText(p.val + 'kg', p.x, p.y - 12);
    });
  }
}

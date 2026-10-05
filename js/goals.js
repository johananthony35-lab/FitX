// FITX GOALS SYSTEM MODULE
class GoalsModule {
  static render(container) {
    const goals = StorageManager.getGoals();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800;">Fitness Goals</h1>
          <p style="color: var(--text-secondary); font-size: 14px;">Define, track, and conquer your strength, body, and consistency milestones.</p>
        </div>
        <button class="btn btn-primary" onclick="window.FitXApp.goals.openAddGoalModal()">
          + Create New Goal
        </button>
      </div>

      <!-- GOALS CARDS GRID -->
      <div class="dashboard-grid">
        ${goals.map(g => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          return `
            <div class="col-4">
              <div class="card" style="display: flex; flex-direction: column; gap: 14px; height: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span class="badge badge-emerald">${g.category}</span>
                  <span class="badge badge-purple">${g.status}</span>
                </div>

                <div>
                  <h3 style="font-size: 18px; font-weight: 800; font-family: var(--font-heading);">${g.title}</h3>
                  <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Target Deadline: ${g.deadline}</div>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-size: 11px; color: var(--text-muted);">CURRENT</div>
                    <div style="font-size: 18px; font-weight: 800; font-family: var(--font-heading); color: var(--text-primary);">${g.current} ${g.unit}</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 11px; color: var(--text-muted);">TARGET</div>
                    <div style="font-size: 18px; font-weight: 800; font-family: var(--font-heading); color: var(--accent-emerald);">${g.target} ${g.unit}</div>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 6px;">
                    <span>Progress</span>
                    <span style="color: var(--accent-emerald);">${pct}%</span>
                  </div>
                  <div class="stat-bar" style="height: 8px;"><div class="stat-bar-fill" style="width: ${pct}%; background: var(--grad-primary);"></div></div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  static openAddGoalModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 20px; font-weight: 800;">Create Fitness Goal</h2>
          <button style="font-size: 20px; color: var(--text-muted);" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>

        <div class="form-group">
          <label class="form-label">Goal Title</label>
          <input type="text" id="goal-title" class="form-control" placeholder="e.g. Bench press 100 kg">
        </div>

        <div class="form-group">
          <label class="form-label">Category</label>
          <select id="goal-cat" class="form-control">
            <option value="Weight">Weight</option>
            <option value="Strength">Strength</option>
            <option value="Consistency">Consistency</option>
            <option value="Endurance">Endurance</option>
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Current Value</label>
            <input type="number" id="goal-curr" class="form-control" placeholder="70">
          </div>
          <div class="form-group">
            <label class="form-label">Target Value</label>
            <input type="number" id="goal-target" class="form-control" placeholder="90">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Unit</label>
            <input type="text" id="goal-unit" class="form-control" placeholder="kg / reps / workouts">
          </div>
          <div class="form-group">
            <label class="form-label">Target Deadline</label>
            <input type="date" id="goal-date" class="form-control" value="2026-12-31">
          </div>
        </div>

        <button class="btn btn-primary btn-full" style="margin-top: 12px;" onclick="window.FitXApp.goals.saveNewGoal()">Save Goal 🎯</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  static saveNewGoal() {
    const title = document.getElementById('goal-title').value || "New Fitness Milestone";
    const category = document.getElementById('goal-cat').value;
    const current = parseFloat(document.getElementById('goal-curr').value) || 0;
    const target = parseFloat(document.getElementById('goal-target').value) || 100;
    const unit = document.getElementById('goal-unit').value || "units";
    const deadline = document.getElementById('goal-date').value || "2026-12-31";

    const goals = StorageManager.getGoals();
    goals.push({
      id: "g-" + Date.now(),
      title,
      category,
      current,
      target,
      unit,
      deadline,
      status: "In Progress"
    });

    StorageManager.saveGoals(goals);
    const modal = document.querySelector('.modal-overlay.active');
    if (modal) modal.remove();
    window.FitXApp.showToast("🎯 New goal added!");
    this.render(document.getElementById('view-goals'));
  }
}

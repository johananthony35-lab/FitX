// FITX DASHBOARD MODULE
class DashboardModule {
  static render(container) {
    const profile = StorageManager.getProfile();
    const nutrition = StorageManager.getNutritionToday();
    const activity = StorageManager.getActivityToday();
    const recovery = StorageManager.getRecoveryToday();
    const workouts = StorageManager.getWorkouts();
    const streaks = StorageManager.getStreaks();

    // Calculate totals
    const caloriesConsumed = nutrition.meals.reduce((sum, m) => sum + m.calories, 0);
    const proteinConsumed = nutrition.meals.reduce((sum, m) => sum + m.protein, 0);
    const caloriesBurned = activity.totalCaloriesBurned;

    // Daily progress completion % calculation
    const calPct = Math.min(100, Math.round((caloriesConsumed / profile.targetCalories) * 100));
    const proteinPct = Math.min(100, Math.round((proteinConsumed / profile.targetProtein) * 100));
    const stepPct = Math.min(100, Math.round((activity.steps / profile.stepsTarget) * 100));
    const waterPct = Math.min(100, Math.round((nutrition.waterMl / profile.targetWaterMl) * 100));

    const overallProgress = Math.round((calPct * 0.25) + (proteinPct * 0.25) + (stepPct * 0.25) + (waterPct * 0.25));

    // Dynamic greeting based on hour
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    container.innerHTML = `
      <!-- TOP GREETING BANNER -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 32px; font-weight: 800; font-family: var(--font-heading);">${timeOfDay}, ${profile.name} 👋</h1>
          <p style="color: var(--text-secondary); font-size: 15px; margin-top: 4px;">Here's your personal fitness plan and metrics for today.</p>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="card" style="padding: 10px 18px; display: flex; align-items: center; gap: 10px; border-color: rgba(245, 158, 11, 0.3);">
            <span style="font-size: 20px;">🔥</span>
            <div>
              <div style="font-weight: 800; font-size: 16px; color: var(--accent-amber);">${streaks.workoutStreak} Day Streak</div>
              <div style="font-size: 11px; color: var(--text-muted);">Consistency on track</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN DASHBOARD GRID -->
      <div class="dashboard-grid">
        <!-- AI TRAINER RECOMMENDATION HERO CARD -->
        <div class="col-8">
          <div class="ai-hero-card">
            <div class="ai-card-content">
              <div class="ai-avatar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><circle cx="12" cy="12" r="3"/><path d="M12 6v2m0 8v2m-6-6h2m8 0h2"/></svg>
              </div>
              <div class="ai-card-text">
                <h3>FitX AI Coach Recommendation <span class="ai-sparkle">✦</span></h3>
                <p id="dashboard-ai-snippet">
                  "Based on your 7.7h sleep and yesterday's back session, your recovery is optimal (8/10 energy). You're 1,574 steps behind your daily goal—add a 20-min evening stroll to hit 10k steps and keep your streak alive!"
                </p>
                <div style="display: flex; gap: 10px;">
                  <button class="btn btn-ai btn-sm" onclick="window.FitXApp.navigate('ai-trainer')">Ask AI Trainer</button>
                  <button class="btn btn-secondary btn-sm" onclick="window.FitXApp.navigate('workout')">View Workout Plan</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- DAILY GOAL RING CARD -->
        <div class="col-4">
          <div class="card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center;">
            <div class="card-title" style="margin-bottom: 12px;">Daily Goal Ring</div>
            <div class="progress-ring-container">
              <svg width="130" height="130" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="10"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#emeraldGrad)" stroke-width="10" 
                        stroke-dasharray="314" stroke-dashoffset="${314 - (314 * overallProgress / 100)}" 
                        stroke-linecap="round" transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 0.8s ease;"/>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#10b981"/>
                    <stop offset="100%" stop-color="#06b6d4"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="progress-ring-text">
                <div class="value">${overallProgress}%</div>
                <div class="label">Completed</div>
              </div>
            </div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 10px;">
              Keep pushing to complete today's targets!
            </div>
          </div>
        </div>

        <!-- TODAY'S WORKOUT CARD -->
        <div class="col-6">
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <span style="color: var(--accent-emerald);">🏋️</span> Today's Workout
              </div>
              <span class="badge badge-emerald">Scheduled</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <div style="font-size: 20px; font-weight: 800; font-family: var(--font-heading);">Chest & Triceps Hypertrophy</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">4 Exercises • Estimated 320 kcal • 45 Mins</div>
              </div>
              <div style="font-size: 28px;">💪</div>
            </div>
            <div style="display: flex; gap: 12px;">
              <button class="btn btn-primary btn-full" onclick="window.FitXApp.startWorkout()">
                Start Workout Now
              </button>
            </div>
          </div>
        </div>

        <!-- DAILY OVERVIEW METRICS GRID -->
        <div class="col-6">
          <div class="card">
            <div class="card-title" style="margin-bottom: 16px;">Daily Activity & Macros</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-label">Calories Consumed</span>
                  <div class="stat-icon emerald">🔥</div>
                </div>
                <div class="stat-value">${caloriesConsumed} <span style="font-size: 13px; color: var(--text-muted);">/ ${profile.targetCalories} kcal</span></div>
                <div class="stat-bar"><div class="stat-bar-fill" style="width: ${calPct}%; background: var(--accent-emerald);"></div></div>
              </div>

              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-label">Protein Consumed</span>
                  <div class="stat-icon amber">🥩</div>
                </div>
                <div class="stat-value">${proteinConsumed}g <span style="font-size: 13px; color: var(--text-muted);">/ ${profile.targetProtein}g</span></div>
                <div class="stat-bar"><div class="stat-bar-fill" style="width: ${proteinPct}%; background: var(--accent-amber);"></div></div>
              </div>

              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-label">Daily Steps</span>
                  <div class="stat-icon blue">👟</div>
                </div>
                <div class="stat-value">${activity.steps.toLocaleString()} <span style="font-size: 13px; color: var(--text-muted);">/ ${profile.stepsTarget.toLocaleString()}</span></div>
                <div class="stat-bar"><div class="stat-bar-fill" style="width: ${stepPct}%; background: var(--accent-blue);"></div></div>
              </div>

              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-label">Water Hydration</span>
                  <div class="stat-icon cyan">💧</div>
                </div>
                <div class="stat-value">${(nutrition.waterMl / 1000).toFixed(1)}L <span style="font-size: 13px; color: var(--text-muted);">/ ${(profile.targetWaterMl / 1000).toFixed(1)}L</span></div>
                <div class="stat-bar"><div class="stat-bar-fill" style="width: ${waterPct}%; background: var(--accent-cyan);"></div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- DAILY CHECKLIST CARD -->
        <div class="col-6">
          <div class="card">
            <div class="card-header">
              <div class="card-title">📋 Today's Checklist</div>
              <div style="font-size: 12px; color: var(--text-muted);" id="checklist-count">0 of 6 completed</div>
            </div>
            <div class="checklist" id="dashboard-checklist">
              <div class="checklist-item" data-idx="0">
                <div class="checklist-checkbox"></div>
                <div>Drink enough water (${(nutrition.waterMl / 1000).toFixed(1)}L logged)</div>
              </div>
              <div class="checklist-item" data-idx="1">
                <div class="checklist-checkbox"></div>
                <div>Complete scheduled workout</div>
              </div>
              <div class="checklist-item" data-idx="2">
                <div class="checklist-checkbox"></div>
                <div>Reach daily step goal (${activity.steps} / ${profile.stepsTarget})</div>
              </div>
              <div class="checklist-item" data-idx="3">
                <div class="checklist-checkbox"></div>
                <div>Hit protein target (${proteinConsumed}g / ${profile.targetProtein}g)</div>
              </div>
              <div class="checklist-item" data-idx="4">
                <div class="checklist-checkbox"></div>
                <div>Log all meals today</div>
              </div>
              <div class="checklist-item" data-idx="5">
                <div class="checklist-checkbox"></div>
                <div>Sleep 7–9 hours (${recovery.sleepHours}h recorded)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- QUICK RECOVERY & REST METRICS -->
        <div class="col-6">
          <div class="card">
            <div class="card-header">
              <div class="card-title">😴 Recovery & Readiness</div>
              <button class="btn btn-secondary btn-sm" onclick="window.FitXApp.navigate('progress')">Log Check-in</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
              <div style="background: rgba(255,255,255,0.03); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 22px; font-weight: 800; color: var(--accent-purple);">${recovery.sleepHours}h</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Sleep Duration</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 22px; font-weight: 800; color: var(--accent-emerald);">${recovery.energy}/10</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Energy Score</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 22px; font-weight: 800; color: var(--accent-amber);">${recovery.soreness}/10</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Muscle Soreness</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    // Bind checklist toggles
    document.querySelectorAll('#dashboard-checklist .checklist-item').forEach(el => {
      el.onclick = () => {
        el.classList.toggle('completed');
        const box = el.querySelector('.checklist-checkbox');
        box.textContent = el.classList.contains('completed') ? '✓' : '';
        this.updateChecklistCount();
      };
    });
  }

  static updateChecklistCount() {
    const total = document.querySelectorAll('#dashboard-checklist .checklist-item').length;
    const completed = document.querySelectorAll('#dashboard-checklist .checklist-item.completed').length;
    const countEl = document.getElementById('checklist-count');
    if (countEl) countEl.textContent = `${completed} of ${total} completed`;
  }
}

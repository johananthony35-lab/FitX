// FITX PROFILE & SETTINGS MODULE
class ProfileSettingsModule {
  static renderProfile(container) {
    const profile = StorageManager.getProfile();
    const streaks = StorageManager.getStreaks();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800;">User Profile</h1>
          <p style="color: var(--text-secondary); font-size: 14px;">Manage your physical parameters, fitness goal, and training split.</p>
        </div>
        <button class="btn btn-primary" onclick="window.FitXApp.profileSettings.openEditProfileModal()">
          ✏️ Edit Profile Info
        </button>
      </div>

      <!-- PROFILE CARD -->
      <div class="card" style="margin-bottom: 24px; background: var(--grad-card); border-color: rgba(16,185,129,0.3);">
        <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
          <div style="width: 84px; height: 84px; border-radius: 50%; background: var(--grad-primary); display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 800; color: #000; box-shadow: var(--shadow-glow);">
            ${profile.name.charAt(0)}
          </div>
          <div>
            <h2 style="font-size: 26px; font-weight: 800;">${profile.name}</h2>
            <div style="display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap;">
              <span class="badge badge-emerald">🎯 ${profile.goal}</span>
              <span class="badge badge-purple">⚡ ${profile.fitnessLevel}</span>
              <span class="badge badge-amber">🔥 ${streaks.workoutStreak} Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      <!-- METRICS & PREFERENCES GRID -->
      <div class="dashboard-grid">
        <div class="col-6">
          <div class="card">
            <div class="card-title" style="margin-bottom: 16px;">📊 Physical Stats</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
              <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 11px; color: var(--text-muted);">AGE</div>
                <div style="font-size: 18px; font-weight: 800;">${profile.age} years</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 11px; color: var(--text-muted);">GENDER</div>
                <div style="font-size: 18px; font-weight: 800; text-transform: capitalize;">${profile.gender}</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 11px; color: var(--text-muted);">HEIGHT</div>
                <div style="font-size: 18px; font-weight: 800;">${profile.heightCm} cm</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 11px; color: var(--text-muted);">WEIGHT</div>
                <div style="font-size: 18px; font-weight: 800; color: var(--accent-emerald);">${profile.weightKg} kg</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6">
          <div class="card">
            <div class="card-title" style="margin-bottom: 16px;">⚙️ Training & Nutrition Setup</div>
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--text-secondary);">
              <div><strong>Training Frequency:</strong> ${profile.trainingDaysPerWeek} Days / week</div>
              <div><strong>Workout Location:</strong> ${profile.workoutLocation}</div>
              <div><strong>Dietary Preference:</strong> ${profile.dietaryPreference}</div>
              <div><strong>Equipment Available:</strong> ${profile.equipment.join(', ')}</div>
              <div><strong>Calculated BMR:</strong> ${profile.bmr} kcal/day</div>
              <div><strong>Target Intake:</strong> ${profile.targetCalories} kcal • ${profile.targetProtein}g Protein</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static renderSettings(container) {
    const settings = StorageManager.getSettings();

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h1 style="font-size: 28px; font-weight: 800;">Application Settings</h1>
        <p style="color: var(--text-secondary); font-size: 14px;">Configure app theme, measurement units, AI keys, and data options.</p>
      </div>

      <div class="dashboard-grid">
        <div class="col-8">
          <div class="card" style="display: flex; flex-direction: column; gap: 20px;">
            <!-- THEME TOGGLE -->
            <div>
              <h3 style="font-size: 16px; margin-bottom: 8px;">🎨 App Visual Theme</h3>
              <div style="display: flex; gap: 10px;">
                <button class="btn ${settings.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}" onclick="window.FitXApp.profileSettings.setTheme('dark')">Dark Theme 🌙</button>
                <button class="btn ${settings.theme === 'light' ? 'btn-primary' : 'btn-secondary'}" onclick="window.FitXApp.profileSettings.setTheme('light')">Light Theme ☀️</button>
              </div>
            </div>

            <!-- UNITS TOGGLE -->
            <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
              <h3 style="font-size: 16px; margin-bottom: 8px;">📏 Measurement Units</h3>
              <div style="display: flex; gap: 12px;">
                <div style="flex: 1;">
                  <label class="form-label">Weight Unit</label>
                  <select class="form-control" onchange="window.FitXApp.profileSettings.updateSetting('weightUnit', this.value)">
                    <option value="kg" ${settings.weightUnit === 'kg' ? 'selected' : ''}>Kilograms (kg)</option>
                    <option value="lb" ${settings.weightUnit === 'lb' ? 'selected' : ''}>Pounds (lbs)</option>
                  </select>
                </div>
                <div style="flex: 1;">
                  <label class="form-label">Distance Unit</label>
                  <select class="form-control" onchange="window.FitXApp.profileSettings.updateSetting('distanceUnit', this.value)">
                    <option value="km" ${settings.distanceUnit === 'km' ? 'selected' : ''}>Kilometers (km)</option>
                    <option value="miles" ${settings.distanceUnit === 'miles' ? 'selected' : ''}>Miles (mi)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- DATA EXPORT & RESET -->
            <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
              <h3 style="font-size: 16px; margin-bottom: 8px;">💾 Data Management</h3>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="window.FitXApp.profileSettings.exportJSON()">Export FitX Data (JSON)</button>
                <button class="btn btn-secondary" onclick="window.FitXApp.profileSettings.relaunchOnboarding()">Re-run Onboarding</button>
                <button class="btn btn-danger" onclick="if(confirm('Reset all FitX data to default seed?')) StorageManager.resetAllData();">Delete Account / Reset Data</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-4">
          <div class="card">
            <div class="card-title" style="margin-bottom: 12px;">🔒 Privacy & AI Preferences</div>
            <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
              FitX runs client-side with complete privacy. Your workout and health data never leave your device unless synced to your secure database.
            </p>
            <div style="background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); padding: 12px; border-radius: var(--radius-md); font-size: 12px;">
              <strong style="color: #c084fc;">Gemini 3.6 / 2.5 Active</strong>
              <div style="color: var(--text-secondary); margin-top: 4px;">Contextual evidence-based AI reasoning engine is active.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static setTheme(theme) {
    const settings = StorageManager.getSettings();
    settings.theme = theme;
    StorageManager.saveSettings(settings);
    document.documentElement.setAttribute('data-theme', theme);
    this.renderSettings(document.getElementById('view-settings'));
  }

  static updateSetting(key, val) {
    const settings = StorageManager.getSettings();
    settings[key] = val;
    StorageManager.saveSettings(settings);
    window.FitXApp.showToast("Settings updated!");
  }

  static exportJSON() {
    const data = {
      profile: StorageManager.getProfile(),
      workouts: StorageManager.getWorkouts(),
      nutrition: StorageManager.getNutritionToday(),
      activity: StorageManager.getActivityToday(),
      progress: StorageManager.getProgressHistory(),
      goals: StorageManager.getGoals()
    };

    const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", str);
    a.setAttribute("download", "fitx_data_export.json");
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.FitXApp.showToast("📥 Exported FitX Data JSON!");
  }

  static relaunchOnboarding() {
    const wizard = new OnboardingWizard();
    wizard.renderModal();
  }

  static openEditProfileModal() {
    const profile = StorageManager.getProfile();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 20px; font-weight: 800;">Edit Profile</h2>
          <button style="font-size: 20px; color: var(--text-muted);" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>

        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" id="edit-name" class="form-control" value="${profile.name}">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Age</label>
            <input type="number" id="edit-age" class="form-control" value="${profile.age}">
          </div>
          <div class="form-group">
            <label class="form-label">Weight (kg)</label>
            <input type="number" id="edit-weight" class="form-control" value="${profile.weightKg}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Primary Goal</label>
          <select id="edit-goal" class="form-control">
            <option value="Lose fat" ${profile.goal === 'Lose fat' ? 'selected' : ''}>Lose fat</option>
            <option value="Build muscle" ${profile.goal === 'Build muscle' ? 'selected' : ''}>Build muscle</option>
            <option value="Gain weight" ${profile.goal === 'Gain weight' ? 'selected' : ''}>Gain weight</option>
            <option value="Maintain weight" ${profile.goal === 'Maintain weight' ? 'selected' : ''}>Maintain weight</option>
            <option value="Improve strength" ${profile.goal === 'Improve strength' ? 'selected' : ''}>Improve strength</option>
          </select>
        </div>

        <button class="btn btn-primary btn-full" style="margin-top: 12px;" onclick="window.FitXApp.profileSettings.saveProfileEdit()">Save Changes</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  static saveProfileEdit() {
    const profile = StorageManager.getProfile();
    profile.name = document.getElementById('edit-name').value;
    profile.age = parseInt(document.getElementById('edit-age').value) || profile.age;
    profile.weightKg = parseFloat(document.getElementById('edit-weight').value) || profile.weightKg;
    profile.goal = document.getElementById('edit-goal').value;

    StorageManager.saveProfile(profile);
    const modal = document.querySelector('.modal-overlay.active');
    if (modal) modal.remove();
    window.FitXApp.showToast("Profile updated successfully!");
    this.renderProfile(document.getElementById('view-profile'));
  }
}

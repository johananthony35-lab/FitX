// FITX ONBOARDING WIZARD MODULE
class OnboardingWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 6;
    this.data = { ...DEFAULT_PROFILE };
  }

  renderModal() {
    let overlay = document.getElementById('onboarding-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'onboarding-modal';
      overlay.className = 'modal-overlay active';
      document.body.appendChild(overlay);
    } else {
      overlay.className = 'modal-overlay active';
    }

    overlay.innerHTML = `
      <div class="modal-content" style="max-width: 550px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div class="brand-icon" style="margin: 0 auto 12px auto; width: 48px; height: 48px; font-size: 24px;">FX</div>
          <h2 style="font-size: 24px;">Welcome to FitX</h2>
          <p style="color: var(--text-secondary); font-size: 13px;">Let's customize your personal AI fitness experience.</p>
          <div style="display: flex; gap: 4px; margin-top: 16px; justify-content: center;">
            ${[1,2,3,4,5,6].map(step => `
              <div style="height: 4px; width: 36px; border-radius: 4px; background: ${step <= this.currentStep ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.1)'}; transition: 0.3s;"></div>
            `).join('')}
          </div>
        </div>

        <div id="onboarding-step-body">
          ${this.getStepContent()}
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 28px; border-top: 1px solid var(--border-color); padding-top: 20px;">
          ${this.currentStep > 1 ? `<button id="ob-prev-btn" class="btn btn-secondary">Back</button>` : `<div></div>`}
          <button id="ob-next-btn" class="btn btn-primary">${this.currentStep === this.totalSteps ? 'Complete Setup 🚀' : 'Continue →'}</button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  getStepContent() {
    switch (this.currentStep) {
      case 1:
        return `
          <h3 style="font-size: 18px; margin-bottom: 16px;">1. Personal Information</h3>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="ob-name" class="form-control" value="${this.data.name}">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Age</label>
              <input type="number" id="ob-age" class="form-control" value="${this.data.age}">
            </div>
            <div class="form-group">
              <label class="form-label">Gender</label>
              <select id="ob-gender" class="form-control">
                <option value="male" ${this.data.gender === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${this.data.gender === 'female' ? 'selected' : ''}>Female</option>
                <option value="other" ${this.data.gender === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Height (cm)</label>
              <input type="number" id="ob-height" class="form-control" value="${this.data.heightCm}">
            </div>
            <div class="form-group">
              <label class="form-label">Weight (kg)</label>
              <input type="number" id="ob-weight" class="form-control" value="${this.data.weightKg}">
            </div>
          </div>
        `;
      case 2:
        return `
          <h3 style="font-size: 18px; margin-bottom: 16px;">2. Fitness Experience Level</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${['Beginner', 'Intermediate', 'Advanced'].map(lvl => `
              <div class="checklist-item ${this.data.fitnessLevel === lvl ? 'completed' : ''}" data-lvl="${lvl}">
                <div class="checklist-checkbox">${this.data.fitnessLevel === lvl ? '✓' : ''}</div>
                <div>
                  <div style="font-weight: 600;">${lvl}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">
                    ${lvl === 'Beginner' ? '< 6 months consistent training' : lvl === 'Intermediate' ? '6 months to 2 years training' : '2+ years dedicated lifting'}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      case 3:
        return `
          <h3 style="font-size: 18px; margin-bottom: 16px;">3. What is your Primary Goal?</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            ${[
              { id: 'Lose fat', title: '🔥 Lose Fat', desc: 'Burn fat & get lean' },
              { id: 'Build muscle', title: '💪 Build Muscle', desc: 'Gain hypertrophy' },
              { id: 'Gain weight', title: '⚖️ Gain Weight', desc: 'Increase overall mass' },
              { id: 'Maintain weight', title: '🎯 Maintain', desc: 'Keep current weight' },
              { id: 'Improve strength', title: '🏋️ Build Strength', desc: 'Increase PRs' },
              { id: 'Improve endurance', title: '🏃 Endurance', desc: 'Stamina & stamina' }
            ].map(g => `
              <div class="card choice-card ${this.data.goal === g.id ? 'active-choice' : ''}" data-goal="${g.id}" style="padding: 14px; cursor: pointer; border: 1px solid ${this.data.goal === g.id ? 'var(--accent-emerald)' : 'var(--border-color)'};">
                <div style="font-weight: 700; font-size: 14px; color: ${this.data.goal === g.id ? 'var(--accent-emerald)' : 'inherit'};">${g.title}</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${g.desc}</div>
              </div>
            `).join('')}
          </div>
        `;
      case 4:
        return `
          <h3 style="font-size: 18px; margin-bottom: 16px;">4. Lifestyle & Activity</h3>
          <div class="form-group">
            <label class="form-label">Average Daily Steps Target</label>
            <select id="ob-steps" class="form-control">
              <option value="6000" ${this.data.stepsTarget == 6000 ? 'selected' : ''}>6,000 steps (Moderate)</option>
              <option value="8000" ${this.data.stepsTarget == 8000 ? 'selected' : ''}>8,000 steps (Active)</option>
              <option value="10000" ${this.data.stepsTarget == 10000 ? 'selected' : ''}>10,000 steps (Very Active)</option>
              <option value="12000" ${this.data.stepsTarget == 12000 ? 'selected' : ''}>12,000+ steps (High Performance)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Training Days Per Week</label>
            <select id="ob-days" class="form-control">
              <option value="3" ${this.data.trainingDaysPerWeek == 3 ? 'selected' : ''}>3 Days / week</option>
              <option value="4" ${this.data.trainingDaysPerWeek == 4 ? 'selected' : ''}>4 Days / week</option>
              <option value="5" ${this.data.trainingDaysPerWeek == 5 ? 'selected' : ''}>5 Days / week</option>
              <option value="6" ${this.data.trainingDaysPerWeek == 6 ? 'selected' : ''}>6 Days / week</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Workout Location</label>
            <select id="ob-location" class="form-control">
              <option value="Home" ${this.data.workoutLocation === 'Home' ? 'selected' : ''}>Home</option>
              <option value="Gym" ${this.data.workoutLocation === 'Gym' ? 'selected' : ''}>Gym</option>
              <option value="Both" ${this.data.workoutLocation === 'Both' ? 'selected' : ''}>Both</option>
            </select>
          </div>
        `;
      case 5:
        return `
          <h3 style="font-size: 18px; margin-bottom: 16px;">5. Available Equipment</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${['No equipment', 'Dumbbells', 'Barbell', 'Bench', 'Resistance bands', 'Pull-up bar', 'Machines', 'Full gym'].map(eq => {
              const checked = this.data.equipment.includes(eq);
              return `
                <div class="checklist-item ${checked ? 'completed' : ''}" data-eq="${eq}">
                  <div class="checklist-checkbox">${checked ? '✓' : ''}</div>
                  <span style="font-size: 13px;">${eq}</span>
                </div>
              `;
            }).join('')}
          </div>
        `;
      case 6:
        return `
          <h3 style="font-size: 18px; margin-bottom: 16px;">6. Dietary Preferences</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${['Vegetarian', 'Non-vegetarian', 'Vegan', 'Eggs', 'No restrictions'].map(diet => `
              <div class="checklist-item ${this.data.dietaryPreference === diet ? 'completed' : ''}" data-diet="${diet}">
                <div class="checklist-checkbox">${this.data.dietaryPreference === diet ? '✓' : ''}</div>
                <span style="font-weight: 600;">${diet}</span>
              </div>
            `).join('')}
          </div>
        `;
    }
  }

  bindEvents() {
    const prevBtn = document.getElementById('ob-prev-btn');
    const nextBtn = document.getElementById('ob-next-btn');

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.currentStep > 1) {
          this.currentStep--;
          this.renderModal();
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        this.saveCurrentStepData();
        if (this.currentStep < this.totalSteps) {
          this.currentStep++;
          this.renderModal();
        } else {
          // Finish onboarding
          StorageManager.saveProfile(this.data);
          StorageManager.setOnboarded(true);
          document.getElementById('onboarding-modal').classList.remove('active');
          if (window.FitXApp) window.FitXApp.initView();
        }
      };
    }

    // Step-specific bindings
    if (this.currentStep === 2) {
      document.querySelectorAll('[data-lvl]').forEach(el => {
        el.onclick = () => {
          this.data.fitnessLevel = el.dataset.lvl;
          this.renderModal();
        };
      });
    }

    if (this.currentStep === 3) {
      document.querySelectorAll('[data-goal]').forEach(el => {
        el.onclick = () => {
          this.data.goal = el.dataset.goal;
          this.renderModal();
        };
      });
    }

    if (this.currentStep === 5) {
      document.querySelectorAll('[data-eq]').forEach(el => {
        el.onclick = () => {
          const item = el.dataset.eq;
          if (this.data.equipment.includes(item)) {
            this.data.equipment = this.data.equipment.filter(e => e !== item);
          } else {
            this.data.equipment.push(item);
          }
          this.renderModal();
        };
      });
    }

    if (this.currentStep === 6) {
      document.querySelectorAll('[data-diet]').forEach(el => {
        el.onclick = () => {
          this.data.dietaryPreference = el.dataset.diet;
          this.renderModal();
        };
      });
    }
  }

  saveCurrentStepData() {
    if (this.currentStep === 1) {
      const name = document.getElementById('ob-name').value;
      const age = parseInt(document.getElementById('ob-age').value) || 25;
      const gender = document.getElementById('ob-gender').value;
      const height = parseInt(document.getElementById('ob-height').value) || 175;
      const weight = parseFloat(document.getElementById('ob-weight').value) || 70;
      this.data.name = name;
      this.data.age = age;
      this.data.gender = gender;
      this.data.heightCm = height;
      this.data.weightKg = weight;
    } else if (this.currentStep === 4) {
      this.data.stepsTarget = parseInt(document.getElementById('ob-steps').value);
      this.data.trainingDaysPerWeek = parseInt(document.getElementById('ob-days').value);
      this.data.workoutLocation = document.getElementById('ob-location').value;
    }
  }
}

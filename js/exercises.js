// FITX EXERCISE LIBRARY MODULE
class ExercisesModule {
  static render(container) {
    this.selectedMuscle = "All";
    this.selectedEquipment = "All";
    this.selectedDifficulty = "All";
    this.selectedLocation = "All";
    this.searchQuery = "";

    this.updateView(container);
  }

  static updateView(container) {
    let filtered = EXERCISES_DATABASE.filter(ex => {
      if (this.selectedMuscle !== "All" && ex.muscle !== this.selectedMuscle) return false;
      if (this.selectedEquipment !== "All" && ex.equipment !== this.selectedEquipment) return false;
      if (this.selectedDifficulty !== "All" && ex.difficulty !== this.selectedDifficulty) return false;
      if (this.selectedLocation !== "All" && ex.location !== "Both" && ex.location !== this.selectedLocation) return false;
      if (this.searchQuery && !ex.name.toLowerCase().includes(this.searchQuery.toLowerCase())) return false;
      return true;
    });

    const muscles = ["All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Glutes", "Core", "Cardio", "Full body"];
    const equipments = ["All", "No equipment", "Dumbbells", "Barbell", "Bench", "Pull-up bar", "Machines"];
    const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800;">Exercise Library</h1>
          <p style="color: var(--text-secondary); font-size: 14px;">Browse exercise guides, instructions, and target rep recommendations.</p>
        </div>
        <div style="width: 300px;">
          <input type="text" class="form-control" placeholder="🔍 Search exercise..." id="ex-search-input" value="${this.searchQuery}">
        </div>
      </div>

      <!-- FILTER CHIPS & DROPDOWNS -->
      <div class="card" style="margin-bottom: 24px; padding: 16px;">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <!-- Muscle Chips -->
          <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
            ${muscles.map(m => `
              <button class="prompt-chip ${this.selectedMuscle === m ? 'active' : ''}" 
                      style="${this.selectedMuscle === m ? 'background: var(--accent-emerald); color: #000; font-weight: 700;' : ''}"
                      onclick="window.FitXApp.exercises.setFilter('selectedMuscle', '${m}')">
                ${m}
              </button>
            `).join('')}
          </div>

          <!-- Secondary Filters Row -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <div>
              <label class="form-label" style="font-size: 11px;">EQUIPMENT</label>
              <select class="form-control" onchange="window.FitXApp.exercises.setFilter('selectedEquipment', this.value)">
                ${equipments.map(e => `<option value="${e}" ${this.selectedEquipment === e ? 'selected' : ''}>${e}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="form-label" style="font-size: 11px;">DIFFICULTY</label>
              <select class="form-control" onchange="window.FitXApp.exercises.setFilter('selectedDifficulty', this.value)">
                ${difficulties.map(d => `<option value="${d}" ${this.selectedDifficulty === d ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="form-label" style="font-size: 11px;">LOCATION</label>
              <select class="form-control" onchange="window.FitXApp.exercises.setFilter('selectedLocation', this.value)">
                <option value="All" ${this.selectedLocation === 'All' ? 'selected' : ''}>All Locations</option>
                <option value="Home" ${this.selectedLocation === 'Home' ? 'selected' : ''}>Home</option>
                <option value="Gym" ${this.selectedLocation === 'Gym' ? 'selected' : ''}>Gym</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- EXERCISES GRID -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
        ${filtered.length ? filtered.map(ex => `
          <div class="card" style="cursor: pointer; transition: 0.2s;" onclick="window.FitXApp.exercises.showDetail('${ex.id}')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <span class="badge badge-emerald">${ex.muscle}</span>
              <span class="badge badge-purple">${ex.difficulty}</span>
            </div>
            <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 6px;">${ex.name}</h3>
            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
              Equipment: ${ex.equipment} • ${ex.location}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 8px;">
              <span>Target: ${ex.targetSets} sets × ${ex.targetReps}</span>
              <span style="color: var(--accent-amber);">~${ex.calories} kcal/10m</span>
            </div>
          </div>
        `).join('') : `
          <div class="col-12 card" style="text-align: center; padding: 40px;">
            <div style="font-size: 40px;">🔍</div>
            <h3 style="font-size: 18px; margin-top: 10px;">No exercises found</h3>
            <p style="color: var(--text-muted); font-size: 13px;">Try adjusting your filters or search query.</p>
          </div>
        `}
      </div>
    `;

    // Search input listener
    const searchInput = document.getElementById('ex-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.updateView(container);
      };
    }
  }

  static setFilter(key, val) {
    this[key] = val;
    this.updateView(document.getElementById('view-exercises'));
  }

  static showDetail(id) {
    const ex = EXERCISES_DATABASE.find(e => e.id === id);
    if (!ex) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 550px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div>
            <span class="badge badge-emerald" style="margin-bottom: 6px;">${ex.muscle}</span>
            <h2 style="font-size: 24px; font-weight: 800;">${ex.name}</h2>
          </div>
          <button style="font-size: 20px; color: var(--text-muted);" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; text-align: center;">
          <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 11px; color: var(--text-muted);">RECOMMENDED SETS</div>
            <div style="font-weight: 800; font-size: 16px; color: var(--accent-emerald); margin-top: 2px;">${ex.targetSets} Sets</div>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 11px; color: var(--text-muted);">REPS RANGE</div>
            <div style="font-weight: 800; font-size: 16px; color: var(--accent-blue); margin-top: 2px;">${ex.targetReps}</div>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 11px; color: var(--text-muted);">REST TIME</div>
            <div style="font-weight: 800; font-size: 16px; color: var(--accent-purple); margin-top: 2px;">${ex.restSec}s</div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 14px; margin-bottom: 6px; color: var(--text-primary);">Execution Instructions:</h4>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">${ex.instructions}</p>
        </div>

        <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid var(--accent-emerald); padding: 12px; border-radius: 6px; margin-bottom: 20px;">
          <strong style="font-size: 12px; color: var(--accent-emerald);">Pro Tip:</strong>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">${ex.tips}</div>
        </div>

        <button class="btn btn-primary btn-full" onclick="this.closest('.modal-overlay').remove()">Close Guide</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

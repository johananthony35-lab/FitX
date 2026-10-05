// FITX NUTRITION TRACKER MODULE
class NutritionModule {
  static render(container) {
    const profile = StorageManager.getProfile();
    const nutrition = StorageManager.getNutritionToday();

    const caloriesConsumed = nutrition.meals.reduce((sum, m) => sum + m.calories, 0);
    const proteinConsumed = nutrition.meals.reduce((sum, m) => sum + m.protein, 0);
    const carbsConsumed = nutrition.meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
    const fatConsumed = nutrition.meals.reduce((sum, m) => sum + (m.fat || 0), 0);

    const calPct = Math.min(100, Math.round((caloriesConsumed / profile.targetCalories) * 100));
    const proteinPct = Math.min(100, Math.round((proteinConsumed / profile.targetProtein) * 100));
    const carbsPct = Math.min(100, Math.round((carbsConsumed / profile.targetCarbs) * 100));
    const fatPct = Math.min(100, Math.round((fatConsumed / profile.targetFat) * 100));

    const mealCategories = ["Breakfast", "Lunch", "Dinner", "Snack"];

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800;">Nutrition & Macros</h1>
          <p style="color: var(--text-secondary); font-size: 14px;">Track your daily calorie intake, macronutrients, and hydration goals.</p>
        </div>
        <button class="btn btn-primary" onclick="window.FitXApp.nutrition.openAddFoodModal()">
          + Log Food / Meal
        </button>
      </div>

      <!-- MACRO TARGETS OVERVIEW CARD -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div class="card-title">🔥 Daily Calorie & Macro Progress</div>
          <button class="btn btn-secondary btn-sm" onclick="window.FitXApp.nutrition.showMathExplanation()">
            ℹ️ Math Breakdown
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
          <!-- CALORIES -->
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Calories</span>
              <div class="stat-icon emerald">🔥</div>
            </div>
            <div class="stat-value">${caloriesConsumed} <span style="font-size: 13px; color: var(--text-muted);">/ ${profile.targetCalories} kcal</span></div>
            <div class="stat-bar"><div class="stat-bar-fill" style="width: ${calPct}%; background: var(--accent-emerald);"></div></div>
          </div>

          <!-- PROTEIN -->
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Protein</span>
              <div class="stat-icon amber">🥩</div>
            </div>
            <div class="stat-value">${proteinConsumed}g <span style="font-size: 13px; color: var(--text-muted);">/ ${profile.targetProtein}g</span></div>
            <div class="stat-bar"><div class="stat-bar-fill" style="width: ${proteinPct}%; background: var(--accent-amber);"></div></div>
          </div>

          <!-- CARBS -->
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Carbohydrates</span>
              <div class="stat-icon blue">🌾</div>
            </div>
            <div class="stat-value">${carbsConsumed}g <span style="font-size: 13px; color: var(--text-muted);">/ ${profile.targetCarbs}g</span></div>
            <div class="stat-bar"><div class="stat-bar-fill" style="width: ${carbsPct}%; background: var(--accent-blue);"></div></div>
          </div>

          <!-- FAT -->
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Fats</span>
              <div class="stat-icon purple">🥑</div>
            </div>
            <div class="stat-value">${fatConsumed}g <span style="font-size: 13px; color: var(--text-muted);">/ ${profile.targetFat}g</span></div>
            <div class="stat-bar"><div class="stat-bar-fill" style="width: ${fatPct}%; background: var(--accent-purple);"></div></div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- MEALS LOGGED BY CATEGORY -->
        <div class="col-8">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${mealCategories.map(cat => {
              const catMeals = nutrition.meals.filter(m => m.category === cat);
              const catCals = catMeals.reduce((s, m) => s + m.calories, 0);
              const catProt = catMeals.reduce((s, m) => s + m.protein, 0);

              return `
                <div class="card">
                  <div class="card-header">
                    <div>
                      <div class="card-title">${cat}</div>
                      <div class="card-subtitle">${catCals} kcal • ${catProt}g protein</div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="window.FitXApp.nutrition.openAddFoodModal('${cat}')">
                      + Add to ${cat}
                    </button>
                  </div>

                  ${catMeals.length ? `
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      ${catMeals.map(m => `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                          <div>
                            <div style="font-weight: 600; font-size: 14px;">${m.name}</div>
                            <div style="font-size: 11px; color: var(--text-muted);">
                              ${m.calories} kcal • ${m.protein}g P • ${m.carbs || 0}g C • ${m.fat || 0}g F
                            </div>
                          </div>
                          <button style="color: var(--text-muted); font-size: 14px;" onclick="window.FitXApp.nutrition.deleteMeal('${m.id}')">✕</button>
                        </div>
                      `).join('')}
                    </div>
                  ` : `
                    <div style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 12px; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
                      No ${cat.toLowerCase()} logged yet today.
                    </div>
                  `}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- WATER TRACKER & QUICK FOOD DATABASE LOOKUP -->
        <div class="col-4">
          <!-- WATER CARD -->
          <div class="card" style="margin-bottom: 20px;">
            <div class="card-header">
              <div class="card-title">💧 Water Hydration Tracker</div>
              <span class="badge badge-cyan">${(nutrition.waterMl / 1000).toFixed(1)}L / ${(profile.targetWaterMl / 1000).toFixed(1)}L</span>
            </div>
            
            <div style="text-align: center; margin: 16px 0;">
              <div style="font-size: 36px; font-weight: 800; font-family: var(--font-heading); color: var(--accent-cyan);">${nutrition.waterMl} ml</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Daily Target: ${profile.targetWaterMl} ml</div>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-full" onclick="window.FitXApp.nutrition.addWater(250)">+ 250 ml 🥛</button>
              <button class="btn btn-secondary btn-full" onclick="window.FitXApp.nutrition.addWater(500)">+ 500 ml 🍾</button>
            </div>
          </div>

          <!-- INDIAN & GLOBAL FOOD LOOKUP SNIPPET -->
          <div class="card">
            <div class="card-title" style="margin-bottom: 12px;">🥗 Food Database Preview</div>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Quick search Indian foods, staples, and protein options.</p>

            <div style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto;">
              ${FOOD_DATABASE.slice(0, 7).map(f => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: rgba(255,255,255,0.02); border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 12px;">
                  <div>
                    <div style="font-weight: 600;">${f.name}</div>
                    <div style="color: var(--text-muted); font-size: 10px;">${f.servingSize} • ${f.calories} kcal • ${f.protein}g P</div>
                  </div>
                  <button class="btn btn-secondary btn-sm" style="padding: 2px 8px; font-size: 10px;" onclick="window.FitXApp.nutrition.addPresetFood('${f.id}')">+</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static addWater(amount) {
    const nutrition = StorageManager.getNutritionToday();
    nutrition.waterMl = (nutrition.waterMl || 0) + amount;
    StorageManager.saveNutritionToday(nutrition);
    window.FitXApp.showToast(`💧 Logged +${amount}ml water!`);
    this.render(document.getElementById('view-nutrition'));
  }

  static deleteMeal(mealId) {
    const nutrition = StorageManager.getNutritionToday();
    nutrition.meals = nutrition.meals.filter(m => m.id !== mealId);
    StorageManager.saveNutritionToday(nutrition);
    this.render(document.getElementById('view-nutrition'));
  }

  static addPresetFood(foodId) {
    const food = FOOD_DATABASE.find(f => f.id === foodId);
    if (!food) return;

    const nutrition = StorageManager.getNutritionToday();
    nutrition.meals.push({
      id: "m-" + Date.now(),
      name: food.name,
      category: "Snack",
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat
    });

    StorageManager.saveNutritionToday(nutrition);
    window.FitXApp.showToast(`🥗 Logged ${food.name} (${food.calories} kcal)!`);
    this.render(document.getElementById('view-nutrition'));
  }

  static openAddFoodModal(presetCategory = "Lunch") {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 550px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 20px; font-weight: 800;">Add Food to Log</h2>
          <button style="font-size: 20px; color: var(--text-muted);" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>

        <div style="margin-bottom: 16px;">
          <input type="text" class="form-control" id="food-modal-search" placeholder="🔍 Search food database (e.g., Paneer, Dal, Chicken)...">
        </div>

        <div style="max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;" id="food-modal-list">
          ${FOOD_DATABASE.map(f => `
            <div class="checklist-item" style="justify-content: space-between;" onclick="window.FitXApp.nutrition.selectModalFood('${f.id}', '${presetCategory}')">
              <div>
                <div style="font-weight: 600; font-size: 13px;">${f.name}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${f.servingSize} • ${f.calories} kcal • ${f.protein}g Protein</div>
              </div>
              <span class="badge badge-emerald">+ Log</span>
            </div>
          `).join('')}
        </div>

        <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
          <h4 style="font-size: 14px; margin-bottom: 10px;">Or Custom Entry:</h4>
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <input type="text" id="custom-food-name" class="form-control" placeholder="Food item name">
            <input type="number" id="custom-food-cals" class="form-control" placeholder="Calories">
            <input type="number" id="custom-food-protein" class="form-control" placeholder="Protein (g)">
          </div>
          <button class="btn btn-primary btn-full" onclick="window.FitXApp.nutrition.addCustomFood('${presetCategory}')">Add Custom Item</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const searchInput = modal.querySelector('#food-modal-search');
    searchInput.oninput = (e) => {
      const q = e.target.value.toLowerCase();
      const listEl = modal.querySelector('#food-modal-list');
      const filtered = FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(q));
      listEl.innerHTML = filtered.map(f => `
        <div class="checklist-item" style="justify-content: space-between;" onclick="window.FitXApp.nutrition.selectModalFood('${f.id}', '${presetCategory}')">
          <div>
            <div style="font-weight: 600; font-size: 13px;">${f.name}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${f.servingSize} • ${f.calories} kcal • ${f.protein}g Protein</div>
          </div>
          <span class="badge badge-emerald">+ Log</span>
        </div>
      `).join('');
    };
  }

  static selectModalFood(foodId, category) {
    this.addPresetFood(foodId);
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) activeModal.remove();
  }

  static addCustomFood(category) {
    const name = document.getElementById('custom-food-name').value || "Custom Meal";
    const cals = parseInt(document.getElementById('custom-food-cals').value) || 200;
    const protein = parseInt(document.getElementById('custom-food-protein').value) || 15;

    const nutrition = StorageManager.getNutritionToday();
    nutrition.meals.push({
      id: "m-" + Date.now(),
      name,
      category,
      calories: cals,
      protein,
      carbs: 20,
      fat: 5
    });

    StorageManager.saveNutritionToday(nutrition);
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) activeModal.remove();
    this.render(document.getElementById('view-nutrition'));
  }

  static showMathExplanation() {
    const profile = StorageManager.getProfile();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 12px;">Calorie & Protein Calculation Explanation</h2>
        
        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
          FitX calculates your energy requirements using transparent scientific formulas. Please note these are <strong>estimated values</strong> rather than medical measurements.
        </p>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; margin-bottom: 12px; font-size: 13px;">
          <strong style="color: var(--accent-emerald);">1. BMR (Basal Metabolic Rate):</strong>
          <div style="color: var(--text-muted); margin-top: 4px;">
            Mifflin-St Jeor Formula based on ${profile.weightKg}kg, ${profile.heightCm}cm, age ${profile.age} = <strong>${profile.bmr} kcal/day</strong>.
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; margin-bottom: 12px; font-size: 13px;">
          <strong style="color: var(--accent-blue);">2. TDEE (Total Daily Energy Expenditure):</strong>
          <div style="color: var(--text-muted); margin-top: 4px;">
            BMR × Activity Multiplier (${profile.trainingDaysPerWeek} training days/wk) = <strong>${profile.tdee} kcal/day</strong>.
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px; font-size: 13px;">
          <strong style="color: var(--accent-amber);">3. Goal Target & Protein Formula:</strong>
          <div style="color: var(--text-muted); margin-top: 4px;">
            Goal: <strong>${profile.goal}</strong>.<br>
            Daily Target: <strong>${profile.targetCalories} kcal</strong>.<br>
            Protein Target: ~2.0g per kg bodyweight = <strong>${profile.targetProtein}g protein/day</strong>.
          </div>
        </div>

        <button class="btn btn-primary btn-full" onclick="this.closest('.modal-overlay').remove()">Understood</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

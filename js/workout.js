// FITX WORKOUT SYSTEM & ACTIVE SESSION MODULE
class WorkoutModule {
  constructor() {
    this.activeSession = null;
    this.timerInterval = null;
    this.restTimerInterval = null;
    this.restTimeLeft = 0;
  }

  static render(container) {
    const workouts = StorageManager.getWorkouts();
    const isRunning = window.FitXApp && window.FitXApp.workoutSession;

    if (isRunning) {
      window.FitXApp.workoutSession.renderActiveWorkoutView(container);
      return;
    }

    // Default workout page view when no session is running
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800;">Workout Tracker</h1>
          <p style="color: var(--text-secondary); font-size: 14px;">Plan, execute, and log your training sessions with live performance metrics.</p>
        </div>
        <button class="btn btn-primary" onclick="window.FitXApp.startWorkout()">
          <span style="font-size: 18px;">▶</span> Start Today's Session
        </button>
      </div>

      <!-- WORKOUT HISTORY & PLANS -->
      <div class="dashboard-grid">
        <div class="col-8">
          <div class="card">
            <div class="card-header">
              <div class="card-title">📜 Workout History</div>
              <span class="badge badge-emerald">${workouts.length} Logged Sessions</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${workouts.map(w => `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                      <div style="font-weight: 800; font-size: 17px; font-family: var(--font-heading);">${w.title}</div>
                      <div style="font-size: 12px; color: var(--text-muted);">${w.date}</div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                      ${w.prsSet ? `<span class="badge badge-amber">⚡ ${w.prsSet} PR Set</span>` : ''}
                      <span class="badge badge-blue">${w.durationMins} Mins</span>
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 8px;">
                    <div>🔥 ${w.caloriesBurned} kcal</div>
                    <div>🏋️ ${(w.volumeKg).toLocaleString()} kg volume</div>
                    <div>📋 ${w.exercises.length} Exercises</div>
                  </div>

                  <div style="font-size: 13px; color: var(--text-secondary);">
                    <strong>Exercises:</strong> ${w.exercises.map(e => e.name).join(', ')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="col-4">
          <div class="card">
            <div class="card-title" style="margin-bottom: 16px;">📋 Recommended Routine</div>
            <div style="background: var(--grad-card); border: 1px solid rgba(16,185,129,0.3); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
              <div style="font-weight: 800; font-size: 16px; margin-bottom: 6px;">Hypertrophy Split (Day 4)</div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">Target: Chest, Shoulders & Triceps</div>
              <ul style="font-size: 13px; color: var(--text-secondary); padding-left: 18px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px;">
                <li>Barbell Bench Press (4 sets × 8-10 reps)</li>
                <li>Incline Dumbbell Press (3 sets × 10-12 reps)</li>
                <li>Dumbbell Lateral Raises (3 sets × 12-15 reps)</li>
                <li>Bench Tricep Dips (3 sets × 12-15 reps)</li>
              </ul>
              <button class="btn btn-primary btn-full" onclick="window.FitXApp.startWorkout()">Start This Routine</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  startSession(routine = null) {
    this.activeSession = {
      title: routine ? routine.title : "Chest & Triceps Hypertrophy",
      startTime: new Date(),
      elapsedSeconds: 0,
      paused: false,
      caloriesEstimated: 0,
      exercises: routine ? routine.exercises : [
        {
          id: "bench-press",
          name: "Barbell Bench Press",
          targetSets: 4,
          restSec: 90,
          sets: [
            { weightKg: 60, reps: 10, completed: false, isPR: false },
            { weightKg: 65, reps: 8, completed: false, isPR: false },
            { weightKg: 65, reps: 8, completed: false, isPR: false }
          ]
        },
        {
          id: "incline-dumbbell-press",
          name: "Incline Dumbbell Press",
          targetSets: 3,
          restSec: 75,
          sets: [
            { weightKg: 24, reps: 10, completed: false, isPR: false },
            { weightKg: 26, reps: 8, completed: false, isPR: false }
          ]
        },
        {
          id: "lateral-raises",
          name: "Dumbbell Lateral Raises",
          targetSets: 3,
          restSec: 60,
          sets: [
            { weightKg: 10, reps: 12, completed: false, isPR: false },
            { weightKg: 12, reps: 10, completed: false, isPR: false }
          ]
        }
      ]
    };

    this.startTimer();
    window.FitXApp.navigate('workout');
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.activeSession && !this.activeSession.paused) {
        this.activeSession.elapsedSeconds++;
        this.activeSession.caloriesEstimated = Math.round((this.activeSession.elapsedSeconds / 60) * 7.5);
        this.updateLiveTimerUI();
      }
    }, 1000);
  }

  pauseResumeSession() {
    if (!this.activeSession) return;
    this.activeSession.paused = !this.activeSession.paused;
    const btn = document.getElementById('workout-pause-btn');
    if (btn) btn.textContent = this.activeSession.paused ? '▶ Resume' : '⏸ Pause';
  }

  renderActiveWorkoutView(container) {
    const session = this.activeSession;
    if (!session) return;

    const mins = Math.floor(session.elapsedSeconds / 60);
    const secs = session.elapsedSeconds % 60;
    const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    container.innerHTML = `
      <!-- WORKOUT BANNER -->
      <div class="workout-timer-banner">
        <div>
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-emerald); font-weight: 700;">Live Workout Session</div>
          <h2 style="font-size: 24px; font-weight: 800;">${session.title}</h2>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
            Estimated Calories: <strong style="color: var(--accent-amber);">${session.caloriesEstimated} kcal</strong>
          </div>
        </div>
        <div style="text-align: right;">
          <div class="workout-live-time" id="live-timer-display">${timeFormatted}</div>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button id="workout-pause-btn" class="btn btn-secondary btn-sm" onclick="window.FitXApp.workoutSession.pauseResumeSession()">
              ${session.paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.FitXApp.workoutSession.finishSession()">
              ✓ Finish Workout
            </button>
          </div>
        </div>
      </div>

      <!-- EXERCISES LIST -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="font-size: 18px;">Exercises (${session.exercises.length})</h3>
        <button class="btn btn-secondary btn-sm" onclick="window.FitXApp.workoutSession.promptAddExercise()">
          + Add Exercise
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${session.exercises.map((ex, exIdx) => `
          <div class="card exercise-log-card">
            <div class="card-header">
              <div class="card-title">
                <span style="color: var(--accent-emerald);">${exIdx + 1}.</span> ${ex.name}
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary btn-sm" onclick="window.FitXApp.workoutSession.startRestTimer(${ex.restSec || 60})">⏱ Rest ${ex.restSec || 60}s</button>
                <button class="btn btn-secondary btn-sm" onclick="window.FitXApp.workoutSession.removeExercise(${exIdx})">✕ Remove</button>
              </div>
            </div>

            <!-- SET HEADER -->
            <div class="set-row" style="font-weight: 700; font-size: 12px; color: var(--text-muted); border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
              <div>SET</div>
              <div>WEIGHT (KG)</div>
              <div>REPS</div>
              <div>LOG</div>
              <div>STATUS</div>
            </div>

            <!-- SET ROWS -->
            ${ex.sets.map((s, setIdx) => `
              <div class="set-row">
                <div style="font-weight: 700;">#${setIdx + 1}</div>
                <div>
                  <input type="number" class="set-input" value="${s.weightKg}" 
                         onchange="window.FitXApp.workoutSession.updateSet(${exIdx}, ${setIdx}, 'weightKg', this.value)">
                </div>
                <div>
                  <input type="number" class="set-input" value="${s.reps}" 
                         onchange="window.FitXApp.workoutSession.updateSet(${exIdx}, ${setIdx}, 'reps', this.value)">
                </div>
                <div>
                  <button class="btn ${s.completed ? 'btn-primary' : 'btn-secondary'} btn-sm btn-full"
                          onclick="window.FitXApp.workoutSession.toggleSetComplete(${exIdx}, ${setIdx})">
                    ${s.completed ? '✓ Done' : 'Complete'}
                  </button>
                </div>
                <div style="text-align: center;">
                  ${s.isPR ? '<span class="badge badge-amber">PR!</span>' : s.completed ? '🟢' : '⚪'}
                </div>
              </div>
            `).join('')}

            <div style="margin-top: 12px;">
              <button class="btn btn-secondary btn-sm" onclick="window.FitXApp.workoutSession.addSet(${exIdx})">
                + Add Set
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  updateLiveTimerUI() {
    const el = document.getElementById('live-timer-display');
    if (el && this.activeSession) {
      const mins = Math.floor(this.activeSession.elapsedSeconds / 60);
      const secs = this.activeSession.elapsedSeconds % 60;
      el.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  updateSet(exIdx, setIdx, field, val) {
    if (!this.activeSession) return;
    this.activeSession.exercises[exIdx].sets[setIdx][field] = parseFloat(val) || 0;
  }

  toggleSetComplete(exIdx, setIdx) {
    if (!this.activeSession) return;
    const setObj = this.activeSession.exercises[exIdx].sets[setIdx];
    setObj.completed = !setObj.completed;

    if (setObj.completed) {
      // Check PR threshold (e.g. bench press > 65kg)
      if (setObj.weightKg >= 70) {
        setObj.isPR = true;
        window.FitXApp.showToast(`🔥 Personal Record set! ${setObj.weightKg}kg × ${setObj.reps} reps!`);
      }
      // Auto launch rest timer
      this.startRestTimer(this.activeSession.exercises[exIdx].restSec || 60);
    }
    this.renderActiveWorkoutView(document.getElementById('view-workout'));
  }

  addSet(exIdx) {
    if (!this.activeSession) return;
    const sets = this.activeSession.exercises[exIdx].sets;
    const lastSet = sets[sets.length - 1] || { weightKg: 20, reps: 10 };
    sets.push({ weightKg: lastSet.weightKg, reps: lastSet.reps, completed: false, isPR: false });
    this.renderActiveWorkoutView(document.getElementById('view-workout'));
  }

  removeExercise(exIdx) {
    if (!this.activeSession) return;
    this.activeSession.exercises.splice(exIdx, 1);
    this.renderActiveWorkoutView(document.getElementById('view-workout'));
  }

  promptAddExercise() {
    const exName = prompt("Enter exercise name (e.g. Cable Flyes):", "Cable Crossovers");
    if (exName && this.activeSession) {
      this.activeSession.exercises.push({
        name: exName,
        targetSets: 3,
        restSec: 60,
        sets: [{ weightKg: 15, reps: 12, completed: false, isPR: false }]
      });
      this.renderActiveWorkoutView(document.getElementById('view-workout'));
    }
  }

  startRestTimer(seconds) {
    if (this.restTimerInterval) clearInterval(this.restTimerInterval);
    this.restTimeLeft = seconds;

    let pill = document.getElementById('rest-timer-pill');
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'rest-timer-pill';
      pill.className = 'rest-timer-pill';
      document.body.appendChild(pill);
    }

    const updatePill = () => {
      pill.innerHTML = `
        <span style="font-size: 20px;">⏱</span>
        <div>
          <div style="font-size: 10px; color: var(--text-muted); uppercase;">Rest Timer</div>
          <div class="rest-time-count">${this.restTimeLeft}s</div>
        </div>
        <button style="color: var(--text-muted); font-size: 16px; margin-left: 8px;" onclick="window.FitXApp.workoutSession.cancelRestTimer()">✕</button>
      `;
    };

    updatePill();

    this.restTimerInterval = setInterval(() => {
      this.restTimeLeft--;
      if (this.restTimeLeft <= 0) {
        clearInterval(this.restTimerInterval);
        this.cancelRestTimer();
        window.FitXApp.showToast("⏱ Rest period complete! Get ready for your next set.");
      } else {
        updatePill();
      }
    }, 1000);
  }

  cancelRestTimer() {
    if (this.restTimerInterval) clearInterval(this.restTimerInterval);
    const pill = document.getElementById('rest-timer-pill');
    if (pill) pill.remove();
  }

  finishSession() {
    if (!this.activeSession) return;
    clearInterval(this.timerInterval);
    this.cancelRestTimer();

    const session = this.activeSession;
    const durationMins = Math.max(1, Math.round(session.elapsedSeconds / 60));
    
    // Calculate total volume
    let totalVolume = 0;
    let completedSetsCount = 0;
    let prsCount = 0;

    session.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          totalVolume += (s.weightKg * s.reps);
          completedSetsCount++;
          if (s.isPR) prsCount++;
        }
      });
    });

    const newWorkoutObj = {
      id: "w-" + Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: session.title,
      durationMins,
      caloriesBurned: session.caloriesEstimated,
      volumeKg: totalVolume,
      prsSet: prsCount,
      exercises: session.exercises
    };

    StorageManager.addWorkout(newWorkoutObj);

    // Render Workout Complete Modal Overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content" style="text-align: center; max-width: 500px;">
        <div style="font-size: 56px; margin-bottom: 12px; animation: bounceIn 0.5s ease;">🎉</div>
        <h2 style="font-size: 28px; font-weight: 800; font-family: var(--font-heading);">Workout Complete!</h2>
        <p style="color: var(--text-secondary); font-size: 14px; margin-top: 4px;">Fantastic session! You pushed your limits today.</p>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 24px 0;">
          <div style="background: rgba(255,255,255,0.04); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 22px; font-weight: 800; color: var(--accent-emerald);">${durationMins} Mins</div>
            <div style="font-size: 11px; color: var(--text-muted);">Duration</div>
          </div>

          <div style="background: rgba(255,255,255,0.04); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 22px; font-weight: 800; color: var(--accent-amber);">${session.caloriesEstimated} kcal</div>
            <div style="font-size: 11px; color: var(--text-muted);">Calories Burned</div>
          </div>

          <div style="background: rgba(255,255,255,0.04); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 22px; font-weight: 800; color: var(--accent-blue);">${totalVolume.toLocaleString()} kg</div>
            <div style="font-size: 11px; color: var(--text-muted);">Total Volume</div>
          </div>

          <div style="background: rgba(255,255,255,0.04); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 22px; font-weight: 800; color: var(--accent-purple);">${completedSetsCount}</div>
            <div style="font-size: 11px; color: var(--text-muted);">Total Sets Completed</div>
          </div>
        </div>

        <button class="btn btn-primary btn-full" onclick="this.closest('.modal-overlay').remove(); window.FitXApp.workoutSession = null; window.FitXApp.navigate('dashboard');">
          Back to Dashboard
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

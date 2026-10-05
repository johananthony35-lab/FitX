// FITX STORAGE MANAGER & STATE STORE
const STORAGE_KEYS = {
  PROFILE: 'fitx_profile',
  WORKOUTS: 'fitx_workouts',
  NUTRITION: 'fitx_nutrition',
  ACTIVITY: 'fitx_activity',
  PROGRESS: 'fitx_progress',
  GOALS: 'fitx_goals',
  STREAKS: 'fitx_streaks',
  RECOVERY: 'fitx_recovery',
  NOTIFICATIONS: 'fitx_notifications',
  AI_CHAT: 'fitx_ai_chat',
  SETTINGS: 'fitx_settings',
  ONBOARDED: 'fitx_onboarded'
};

const DEFAULT_PROFILE = {
  name: "Johan",
  age: 26,
  gender: "male",
  heightCm: 178,
  weightKg: 74,
  fitnessLevel: "Intermediate",
  goal: "Build muscle",
  stepsTarget: 10000,
  trainingDaysPerWeek: 4,
  workoutLocation: "Both",
  equipment: ["Dumbbells", "Barbell", "Bench", "Pull-up bar"],
  dietaryPreference: "Non-vegetarian",
  bmr: 1720,
  tdee: 2450,
  targetCalories: 2650,
  targetProtein: 155,
  targetCarbs: 300,
  targetFat: 75,
  targetWaterMl: 3500
};

const DEFAULT_SETTINGS = {
  theme: "dark",
  weightUnit: "kg",
  distanceUnit: "km",
  useSupabase: false,
  apiKey: "",
  notificationsEnabled: true
};

const DEFAULT_STREAKS = {
  workoutStreak: 7,
  nutritionStreak: 12,
  activityStreak: 14,
  achievements: [
    { id: "first-workout", title: "First Step", desc: "Completed your 1st workout", unlocked: true, icon: "🏋️" },
    { id: "10-workouts", title: "Dedicated Athlete", desc: "Completed 10 workouts", unlocked: true, icon: "🔥" },
    { id: "50-workouts", title: "Iron Warrior", desc: "Completed 50 workouts", unlocked: false, icon: "🛡️" },
    { id: "first-pr", title: "PR Breaker", desc: "Set a personal record", unlocked: true, icon: "⚡" },
    { id: "7-day-streak", title: "Unstoppable Week", desc: "7-day workout streak", unlocked: true, icon: "🏆" },
    { id: "30-day-streak", title: "Habit Master", desc: "30-day active streak", unlocked: false, icon: "👑" },
    { id: "100k-steps", title: "Century Walker", desc: "Reached 100,000 total steps", unlocked: true, icon: "👟" }
  ]
};

class StorageManager {
  static getItem(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Storage read error for key ${key}:`, e);
      return defaultValue;
    }
  }

  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Storage write error for key ${key}:`, e);
    }
  }

  static isOnboarded() {
    return this.getItem(STORAGE_KEYS.ONBOARDED, false);
  }

  static setOnboarded(val) {
    this.setItem(STORAGE_KEYS.ONBOARDED, val);
  }

  static getProfile() {
    return this.getItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  }

  static saveProfile(profile) {
    // Recalculate targets upon profile change
    const updated = this.calculateTargets(profile);
    this.setItem(STORAGE_KEYS.PROFILE, updated);
    return updated;
  }

  static calculateTargets(profile) {
    const { age, gender, heightCm, weightKg, goal, trainingDaysPerWeek } = profile;
    
    // Mifflin-St Jeor BMR Equation
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    if (gender === 'male') bmr += 5;
    else bmr -= 161;

    // Activity Multiplier
    let multiplier = 1.375; // light-moderate
    if (trainingDaysPerWeek >= 5) multiplier = 1.55;
    if (trainingDaysPerWeek >= 6) multiplier = 1.725;

    const tdee = Math.round(bmr * multiplier);
    let targetCalories = tdee;
    let proteinPerKg = 1.8;

    if (goal === "Lose fat") {
      targetCalories = tdee - 450;
      proteinPerKg = 2.0;
    } else if (goal === "Build muscle" || goal === "Gain weight") {
      targetCalories = tdee + 300;
      proteinPerKg = 2.2;
    } else if (goal === "Improve strength") {
      targetCalories = tdee + 150;
      proteinPerKg = 2.0;
    }

    const targetProtein = Math.round(weightKg * proteinPerKg);
    const targetFat = Math.round((targetCalories * 0.25) / 9);
    const targetCarbs = Math.round((targetCalories - (targetProtein * 4) - (targetFat * 9)) / 4);

    return {
      ...profile,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      targetWaterMl: Math.round(weightKg * 45)
    };
  }

  static getTodayKey() {
    return new Date().toISOString().split('T')[0];
  }

  static getNutritionToday() {
    const all = this.getItem(STORAGE_KEYS.NUTRITION, {});
    const todayKey = this.getTodayKey();
    return all[todayKey] || {
      date: todayKey,
      meals: [
        { id: 'm1', name: 'Oatmeal & Whey Protein', category: 'Breakfast', calories: 380, protein: 32, carbs: 45, fat: 6 },
        { id: 'm2', name: 'Grilled Chicken & Brown Rice', category: 'Lunch', calories: 540, protein: 48, carbs: 55, fat: 8 }
      ],
      waterMl: 2250
    };
  }

  static saveNutritionToday(data) {
    const all = this.getItem(STORAGE_KEYS.NUTRITION, {});
    const todayKey = this.getTodayKey();
    all[todayKey] = data;
    this.setItem(STORAGE_KEYS.NUTRITION, all);
  }

  static getActivityToday() {
    const all = this.getItem(STORAGE_KEYS.ACTIVITY, {});
    const todayKey = this.getTodayKey();
    return all[todayKey] || {
      date: todayKey,
      steps: 8426,
      distanceKm: 6.2,
      activeMinutes: 48,
      workoutCaloriesBurned: 340,
      totalCaloriesBurned: 2280
    };
  }

  static saveActivityToday(data) {
    const all = this.getItem(STORAGE_KEYS.ACTIVITY, {});
    const todayKey = this.getTodayKey();
    all[todayKey] = data;
    this.setItem(STORAGE_KEYS.ACTIVITY, all);
  }

  static getWorkouts() {
    return this.getItem(STORAGE_KEYS.WORKOUTS, [
      {
        id: "w-demo-1",
        date: "2026-10-04",
        title: "Chest & Triceps Hypertrophy",
        durationMins: 46,
        caloriesBurned: 340,
        volumeKg: 4850,
        prsSet: 1,
        exercises: [
          {
            name: "Barbell Bench Press",
            sets: [
              { weightKg: 60, reps: 10, completed: true },
              { weightKg: 65, reps: 8, completed: true },
              { weightKg: 70, reps: 6, completed: true, isPR: true }
            ]
          },
          {
            name: "Incline Dumbbell Press",
            sets: [
              { weightKg: 24, reps: 10, completed: true },
              { weightKg: 26, reps: 8, completed: true }
            ]
          }
        ]
      }
    ]);
  }

  static addWorkout(workout) {
    const list = this.getWorkouts();
    list.unshift(workout);
    this.setItem(STORAGE_KEYS.WORKOUTS, list);
    
    // Update streak & achievements
    const streaks = this.getStreaks();
    streaks.workoutStreak += 1;
    this.setItem(STORAGE_KEYS.STREAKS, streaks);
  }

  static getGoals() {
    return this.getItem(STORAGE_KEYS.GOALS, [
      { id: "g1", title: "Reach 76 kg Lean Mass", category: "Weight", current: 74, target: 76, unit: "kg", deadline: "2026-12-31", status: "In Progress" },
      { id: "g2", title: "Bench Press 90 kg", category: "Strength", current: 70, target: 90, unit: "kg", deadline: "2026-11-15", status: "In Progress" },
      { id: "g3", title: "Complete 20 Workouts", category: "Consistency", current: 14, target: 20, unit: "workouts", deadline: "2026-10-31", status: "In Progress" }
    ]);
  }

  static saveGoals(goals) {
    this.setItem(STORAGE_KEYS.GOALS, goals);
  }

  static getProgressHistory() {
    return this.getItem(STORAGE_KEYS.PROGRESS, {
      weightHistory: [
        { date: "2026-09-05", weight: 75.8 },
        { date: "2026-09-12", weight: 75.2 },
        { date: "2026-09-19", weight: 74.8 },
        { date: "2026-09-26", weight: 74.3 },
        { date: "2026-10-03", weight: 74.0 }
      ],
      measurements: [
        { date: "2026-10-01", waistCm: 81, chestCm: 102, armCm: 37, thighCm: 58 }
      ],
      prs: [
        { exercise: "Bench Press", weightKg: 70, date: "2026-10-04" },
        { exercise: "Barbell Squat", weightKg: 105, date: "2026-09-28" },
        { exercise: "Deadlift", weightKg: 130, date: "2026-09-25" }
      ]
    });
  }

  static saveProgressHistory(progress) {
    this.setItem(STORAGE_KEYS.PROGRESS, progress);
  }

  static getStreaks() {
    return this.getItem(STORAGE_KEYS.STREAKS, DEFAULT_STREAKS);
  }

  static getRecoveryToday() {
    const all = this.getItem(STORAGE_KEYS.RECOVERY, {});
    const todayKey = this.getTodayKey();
    return all[todayKey] || {
      date: todayKey,
      sleepHours: 7.7,
      soreness: 3, // 1-10
      energy: 8,    // 1-10
      motivation: 9, // 1-10
      fatigue: 4    // 1-10
    };
  }

  static saveRecoveryToday(data) {
    const all = this.getItem(STORAGE_KEYS.RECOVERY, {});
    const todayKey = this.getTodayKey();
    all[todayKey] = data;
    this.setItem(STORAGE_KEYS.RECOVERY, all);
  }

  static getAIHistory() {
    return this.getItem(STORAGE_KEYS.AI_CHAT, [
      {
        sender: "ai",
        text: "Hey Johan! 👋 You completed your back & biceps session yesterday. Your recovery metrics look fantastic (7h 42m sleep, 8/10 energy). Today's chest & triceps session is ready when you are!"
      }
    ]);
  }

  static addAIMessage(msg) {
    const history = this.getAIHistory();
    history.push(msg);
    this.setItem(STORAGE_KEYS.AI_CHAT, history);
  }

  static getSettings() {
    return this.getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  static saveSettings(settings) {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  static resetAllData() {
    localStorage.clear();
    location.reload();
  }
}

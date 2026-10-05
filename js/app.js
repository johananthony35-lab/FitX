// FITX MAIN APPLICATION CONTROLLER & ROUTER
class FitXApp {
  constructor() {
    this.currentView = 'dashboard';
    this.workoutSession = null;
    this.exercises = ExercisesModule;
    this.nutrition = NutritionModule;
    this.activity = ActivityModule;
    this.progress = ProgressModule;
    this.aiTrainer = AITrainerModule;
    this.goals = GoalsModule;
    this.streakRecovery = StreakRecoveryModule;
    this.profileSettings = ProfileSettingsModule;
  }

  init() {
    console.log("Initializing FitX Personal Fitness & AI Trainer App...");

    // Apply Saved Theme
    const settings = StorageManager.getSettings();
    if (settings.theme) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }

    // Check Onboarding status
    if (!StorageManager.isOnboarded()) {
      const wizard = new OnboardingWizard();
      wizard.renderModal();
    }

    // Bind Navigation Click Handlers
    this.bindNavigation();

    // Initial View Render
    this.navigate('dashboard');

    // Trigger sample welcome notification
    setTimeout(() => {
      NotificationManager.showToast("👋 Welcome to FitX! Your daily AI training plan is ready.");
    }, 1500);
  }

  bindNavigation() {
    document.querySelectorAll('[data-view-target]').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        const target = el.dataset.viewTarget;
        this.navigate(target);
      };
    });
  }

  navigate(viewName) {
    this.currentView = viewName;

    // Update Navigation UI active states
    document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(el => {
      if (el.dataset.viewTarget === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Hide all page views
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });

    // Show target page view
    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) {
      targetEl.classList.add('active');
      this.renderViewContent(viewName, targetEl);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderViewContent(viewName, container) {
    switch (viewName) {
      case 'dashboard':
        DashboardModule.render(container);
        break;
      case 'workout':
        WorkoutModule.render(container);
        break;
      case 'exercises':
        ExercisesModule.render(container);
        break;
      case 'nutrition':
        NutritionModule.render(container);
        break;
      case 'activity':
        ActivityModule.render(container);
        break;
      case 'progress':
        ProgressModule.render(container);
        break;
      case 'ai-trainer':
        AITrainerModule.render(container);
        break;
      case 'goals':
        GoalsModule.render(container);
        break;
      case 'profile':
        ProfileSettingsModule.renderProfile(container);
        break;
      case 'settings':
        ProfileSettingsModule.renderSettings(container);
        break;
    }
  }

  startWorkout(routine = null) {
    if (!this.workoutSession) {
      this.workoutSession = new WorkoutModule();
    }
    this.workoutSession.startSession(routine);
  }

  showToast(msg, type = 'emerald') {
    NotificationManager.showToast(msg, type);
  }
}

// Instantiate Global App Object on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.FitXApp = new FitXApp();
  window.FitXApp.init();
});

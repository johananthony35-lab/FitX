// FITX AI FITNESS TRAINER & DAILY COACH MODULE
class AITrainerModule {
  static render(container) {
    const profile = StorageManager.getProfile();
    const nutrition = StorageManager.getNutritionToday();
    const activity = StorageManager.getActivityToday();
    const recovery = StorageManager.getRecoveryToday();
    const chatHistory = StorageManager.getAIHistory();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
            <span style="background: var(--grad-ai); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">FitX AI Coach</span>
            <span class="badge badge-purple">Gemini Powered</span>
          </h1>
          <p style="color: var(--text-secondary); font-size: 14px;">Your 24/7 personal digital trainer for evidence-based workouts, recovery & nutrition advice.</p>
        </div>
      </div>

      <!-- DAILY COACH BRIEFING BANNER -->
      <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(16, 185, 129, 0.1) 100%); border: 1px solid rgba(139, 92, 246, 0.3);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-purple);">Your FitX Daily Coach</div>
            <h3 style="font-size: 20px; font-weight: 800; margin-top: 2px;">Today's Focus: Recovery & Hypertrophy Split</h3>
            <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              You recorded <strong>${recovery.sleepHours}h sleep</strong>, energy <strong>${recovery.energy}/10</strong>, and <strong>${activity.steps.toLocaleString()} steps</strong> yesterday.
            </div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.FitXApp.startWorkout()">Start Today's Plan</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px;">
          <div>
            <div style="font-weight: 700; font-size: 13px; color: var(--accent-emerald); margin-bottom: 6px;">✓ Today You Should:</div>
            <ul style="font-size: 12px; color: var(--text-secondary); padding-left: 16px; display: flex; flex-direction: column; gap: 3px;">
              <li>Complete your scheduled Chest & Triceps session</li>
              <li>Aim for ${profile.stepsTarget.toLocaleString()} steps (walk after dinner)</li>
              <li>Hit your ${profile.targetProtein}g protein target</li>
              <li>Drink at least ${(profile.targetWaterMl/1000).toFixed(1)}L water</li>
            </ul>
          </div>
          <div>
            <div style="font-weight: 700; font-size: 13px; color: var(--accent-rose); margin-bottom: 6px;">✕ Avoid Today:</div>
            <ul style="font-size: 12px; color: var(--text-secondary); padding-left: 16px; display: flex; flex-direction: column; gap: 3px;">
              <li>Training the same muscle group back-to-back</li>
              <li>Extreme calorie restriction below ${profile.targetCalories - 600} kcal</li>
              <li>Sacrificing exercise form for heavier weight</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- CHAT INTERFACE CONTAINER -->
      <div class="chat-container">
        <div class="chat-messages" id="chat-messages-body">
          ${chatHistory.map(msg => `
            <div class="chat-bubble ${msg.sender}">
              ${msg.sender === 'ai' ? `<strong style="color: #c084fc; font-size: 12px; display: block; margin-bottom: 4px;">FitX Trainer AI</strong>` : ''}
              ${msg.text}
            </div>
          `).join('')}
        </div>

        <div class="chat-input-area">
          <div class="preset-prompts">
            <button class="prompt-chip" onclick="window.FitXApp.aiTrainer.sendPrompt('Should I train today?')">Should I train today?</button>
            <button class="prompt-chip" onclick="window.FitXApp.aiTrainer.sendPrompt('What workout should I do today?')">What workout should I do today?</button>
            <button class="prompt-chip" onclick="window.FitXApp.aiTrainer.sendPrompt('Should I eat more protein?')">Should I eat more protein?</button>
            <button class="prompt-chip" onclick="window.FitXApp.aiTrainer.sendPrompt('Why am I not losing weight?')">Why am I not losing weight?</button>
            <button class="prompt-chip" onclick="window.FitXApp.aiTrainer.sendPrompt('Should I take a rest day?')">Should I take a rest day?</button>
            <button class="prompt-chip" onclick="window.FitXApp.aiTrainer.sendPrompt('How many calories should I eat?')">How many calories should I eat?</button>
          </div>

          <div class="chat-input-row">
            <input type="text" id="ai-chat-input" class="chat-input" placeholder="Ask your AI coach anything about workouts, diet, recovery..." onkeydown="if(event.key==='Enter') window.FitXApp.aiTrainer.handleUserSend()">
            <button class="btn btn-ai" onclick="window.FitXApp.aiTrainer.handleUserSend()">Send →</button>
          </div>
        </div>
      </div>
    `;

    this.scrollToBottom();
  }

  static handleUserSend() {
    const input = document.getElementById('ai-chat-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = "";
    this.sendPrompt(text);
  }

  static sendPrompt(text) {
    StorageManager.addAIMessage({ sender: 'user', text });
    this.render(document.getElementById('view-ai-trainer'));

    // Show AI typing indicator
    const body = document.getElementById('chat-messages-body');
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble ai';
    typingBubble.id = 'ai-typing-indicator';
    typingBubble.innerHTML = `<strong style="color: #c084fc; font-size: 12px; display: block;">FitX Trainer AI</strong><span style="font-style: italic; opacity: 0.7;">Thinking...</span>`;
    body.appendChild(typingBubble);
    this.scrollToBottom();

    setTimeout(() => {
      const response = this.generateResponse(text);
      if (document.getElementById('ai-typing-indicator')) {
        document.getElementById('ai-typing-indicator').remove();
      }
      StorageManager.addAIMessage({ sender: 'ai', text: response });
      this.render(document.getElementById('view-ai-trainer'));
    }, 1000);
  }

  static generateResponse(query) {
    const q = query.toLowerCase();
    const profile = StorageManager.getProfile();
    const recovery = StorageManager.getRecoveryToday();
    const nutrition = StorageManager.getNutritionToday();
    const activity = StorageManager.getActivityToday();

    // SAFETY MEDICAL GUARDRAIL CHECK (#10 AI SAFETY)
    const medicalKeywords = ['severe pain', 'chest pain', 'fainting', 'difficulty breathing', 'serious injury', 'severe dizziness', 'dizzy', 'sharp pain', 'broken'];
    if (medicalKeywords.some(kw => q.includes(kw))) {
      return `⚠️ **IMPORTANT SAFETY ADVISORY**: You mentioned experiencing symptoms like pain, dizziness, or breathing issues. I am an AI fitness coach and **not a medical doctor**. Please **stop exercising immediately**, sit down in a safe area, and seek urgent medical evaluation or contact emergency healthcare professionals. Never push through severe sharp pain or cardiorespiratory distress.`;
    }

    if (q.includes('should i train today') || q.includes('rest day')) {
      if (recovery.energy >= 7 && recovery.soreness <= 5) {
        return `Yes, absolutely! Based on your current recovery profile (${recovery.sleepHours}h sleep, energy ${recovery.energy}/10, low soreness), your body is fully primed for today's scheduled **Chest & Triceps Hypertrophy** session. Go get after it!`;
      } else {
        return `Looking at your recovery data (${recovery.sleepHours}h sleep, soreness ${recovery.soreness}/10), I recommend taking an active recovery day. Opt for a 30-minute light walk, dynamic stretching, and focus on hitting your water and protein targets today.`;
      }
    }

    if (q.includes('protein')) {
      const proteinConsumed = nutrition.meals.reduce((s, m) => s + m.protein, 0);
      return `Your daily protein target is **${profile.targetProtein}g** based on your ${profile.weightKg}kg bodyweight and goal to ${profile.goal.toLowerCase()}. You've consumed **${proteinConsumed}g** so far today. To hit your remaining target, try adding a scoop of whey protein (24g P) or 150g grilled chicken breast (46g P).`;
    }

    if (q.includes('not losing weight') || q.includes('weight loss')) {
      return `Weight loss plateaus usually come down to two factors: hidden calorie intake or temporary water retention from muscle inflammation. Ensure you log liquids and cooking oils, keep your step activity consistent (${profile.stepsTarget} steps/day), and track your 7-day average weight rather than single-day fluctuations!`;
    }

    if (q.includes('calories should i eat') || q.includes('how many calories')) {
      return `Based on your BMR of **${profile.bmr} kcal** and TDEE of **${profile.tdee} kcal**, your targeted daily intake is **${profile.targetCalories} kcal** for your goal of ${profile.goal.toLowerCase()}. This provides the optimal energy for performance while supporting your body composition goals.`;
    }

    if (q.includes('missed my workout') || q.includes('missed workout')) {
      return `Don't stress about a missed workout! Fitness progress is built on consistency over months, not a single day. Simply shift today's planned session to tomorrow and maintain your target protein intake and sleep schedule.`;
    }

    // Default intelligent response grounded in user state
    return `Great question, ${profile.name}! Based on your profile (${profile.goal}, ${profile.fitnessLevel} level) and today's stats (${activity.steps} steps, ${recovery.sleepHours}h sleep), my core recommendation is to stay consistent with your routine, prioritize progressive overload on your main lifts, and hit your ${profile.targetProtein}g daily protein target!`;
  }

  static scrollToBottom() {
    const body = document.getElementById('chat-messages-body');
    if (body) body.scrollTop = body.scrollHeight;
  }
}

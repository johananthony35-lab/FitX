// FITX EXERCISE DATABASE
const EXERCISES_DATABASE = [
  // CHEST
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    muscle: "Chest",
    equipment: "Barbell",
    difficulty: "Intermediate",
    location: "Gym",
    calories: 120, // per 10 mins
    targetSets: 4,
    targetReps: "8-10",
    restSec: 90,
    instructions: "Lie flat on the bench. Grip the barbell slightly wider than shoulder-width. Lower the bar to mid-chest level while keeping elbows at a 45-degree angle. Push back up explosively.",
    tips: "Keep your feet flat on the floor and maintain a natural arch in your lower back."
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    muscle: "Chest",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    location: "Both",
    calories: 100,
    targetSets: 3,
    targetReps: "10-12",
    restSec: 75,
    instructions: "Set bench at a 30-45 degree incline. Hold dumbbells at chest height, press upwards until arms are extended, then slowly lower back down.",
    tips: "Focus on squeezing upper chest at the top of the movement."
  },
  {
    id: "push-ups",
    name: "Standard Push-Ups",
    muscle: "Chest",
    equipment: "No equipment",
    difficulty: "Beginner",
    location: "Home",
    calories: 80,
    targetSets: 3,
    targetReps: "15-20",
    restSec: 60,
    instructions: "Place hands shoulder-width apart on the floor. Maintain a rigid plank posture. Lower body until chest almost touches the floor, then push up.",
    tips: "Keep core engaged and avoid arching or sagging lower back."
  },

  // BACK
  {
    id: "barbell-deadlift",
    name: "Barbell Deadlift",
    muscle: "Back",
    equipment: "Barbell",
    difficulty: "Advanced",
    location: "Gym",
    calories: 150,
    targetSets: 4,
    targetReps: "5-6",
    restSec: 120,
    instructions: "Stand with feet hip-width under the bar. Bend at hips and knees to grip bar. Keep back straight, chest up, pull the bar up along shins and thighs until standing tall.",
    tips: "Hinge at the hips and engage lats before initiating the lift."
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscle: "Back",
    equipment: "Machines",
    difficulty: "Beginner",
    location: "Gym",
    calories: 90,
    targetSets: 3,
    targetReps: "10-12",
    restSec: 60,
    instructions: "Sit at machine, grip bar wide. Pull bar down toward upper chest while depressing shoulder blades. Squeeze lats at the bottom.",
    tips: "Avoid leaning back excessively during the pull."
  },
  {
    id: "bent-over-row",
    name: "Bent-Over Dumbbell Row",
    muscle: "Back",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    location: "Both",
    calories: 100,
    targetSets: 3,
    targetReps: "10-12",
    restSec: 75,
    instructions: "Hinge forward at hips with knees slightly bent. Row dumbbells up to ribs, driving elbows backward.",
    tips: "Keep torso stationary and pull with your back muscles, not arms."
  },

  // SHOULDERS
  {
    id: "overhead-press",
    name: "Overhead Dumbbell Press",
    muscle: "Shoulders",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    location: "Both",
    calories: 90,
    targetSets: 4,
    targetReps: "8-10",
    restSec: 75,
    instructions: "Sit upright or stand. Hold dumbbells at shoulder level with palms facing forward. Press dumbbells overhead until arms are locked out.",
    tips: "Don't arch your back at the top; brace your core."
  },
  {
    id: "lateral-raises",
    name: "Dumbbell Lateral Raises",
    muscle: "Shoulders",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    location: "Both",
    calories: 70,
    targetSets: 3,
    targetReps: "12-15",
    restSec: 60,
    instructions: "Stand tall holding dumbbells at sides. Raise arms out to the sides until parallel with the floor with a slight elbow bend.",
    tips: "Lead with your elbows and control the weight on the descent."
  },

  // BICEPS & TRICEPS
  {
    id: "bicep-curls",
    name: "Dumbbell Bicep Curls",
    muscle: "Biceps",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    location: "Both",
    calories: 60,
    targetSets: 3,
    targetReps: "10-12",
    restSec: 60,
    instructions: "Stand tall with dumbbells in hand. Curl weights towards shoulders while rotating wrists slightly outwards.",
    tips: "Keep elbows glued to your sides throughout the movement."
  },
  {
    id: "tricep-dips",
    name: "Bench Tricep Dips",
    muscle: "Triceps",
    equipment: "Bench",
    difficulty: "Beginner",
    location: "Home",
    calories: 75,
    targetSets: 3,
    targetReps: "12-15",
    restSec: 60,
    instructions: "Place hands on bench behind you. Extend legs. Lower hips by bending elbows to 90 degrees, then push back up.",
    tips: "Keep back close to the bench to minimize shoulder strain."
  },

  // LEGS & GLUTES
  {
    id: "barbell-squat",
    name: "Barbell Back Squat",
    muscle: "Legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    location: "Gym",
    calories: 140,
    targetSets: 4,
    targetReps: "6-8",
    restSec: 120,
    instructions: "Rest barbell across upper traps. Stand with feet shoulder-width apart. Sit hips back and down until thighs are parallel to floor, then drive up through heels.",
    tips: "Keep knees tracking over toes and maintain chest up posture."
  },
  {
    id: "dumbbell-lunges",
    name: "Walking Dumbbell Lunges",
    muscle: "Legs",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    location: "Both",
    calories: 110,
    targetSets: 3,
    targetReps: "10 per leg",
    restSec: 75,
    instructions: "Step forward with right leg, lowering back knee toward floor until both legs reach 90-degree angles. Push off forward foot into next step.",
    tips: "Maintain an upright torso and stable knee tracking."
  },
  {
    id: "hip-thrusts",
    name: "Barbell Hip Thrusts",
    muscle: "Glutes",
    equipment: "Barbell",
    difficulty: "Intermediate",
    location: "Gym",
    calories: 120,
    targetSets: 4,
    targetReps: "10-12",
    restSec: 90,
    instructions: "Rest upper back against bench with padded barbell across hips. Drive hips straight up by squeezing glutes at peak lockout.",
    tips: "Tuck chin slightly and squeeze glutes hard at the top."
  },

  // CORE
  {
    id: "plank",
    name: "Forearm Plank",
    muscle: "Core",
    equipment: "No equipment",
    difficulty: "Beginner",
    location: "Home",
    calories: 50,
    targetSets: 3,
    targetReps: "45-60 sec",
    restSec: 45,
    instructions: "Rest on forearms and toes. Keep body in a perfectly straight line from head to heels.",
    tips: "Squeeze glutes and brace abdominal wall tight."
  },
  {
    id: "hanging-leg-raises",
    name: "Hanging Leg Raises",
    muscle: "Core",
    equipment: "Pull-up bar",
    difficulty: "Advanced",
    location: "Both",
    calories: 80,
    targetSets: 3,
    targetReps: "10-12",
    restSec: 60,
    instructions: "Hang from pull-up bar. Raise legs straight out in front until parallel to floor, then lower under control.",
    tips: "Avoid swinging momentum; pull using lower abs."
  },

  // CARDIO & FULL BODY
  {
    id: "treadmill-running",
    name: "Treadmill Interval Run",
    muscle: "Cardio",
    equipment: "Machines",
    difficulty: "Intermediate",
    location: "Gym",
    calories: 180,
    targetSets: 1,
    targetReps: "20 mins",
    restSec: 0,
    instructions: "Alternate 1 minute sprint with 1 minute recovery walk.",
    tips: "Land mid-foot and maintain steady breathing."
  },
  {
    id: "burpees",
    name: "Full Burpees",
    muscle: "Full body",
    equipment: "No equipment",
    difficulty: "Intermediate",
    location: "Home",
    calories: 160,
    targetSets: 4,
    targetReps: "15 reps",
    restSec: 60,
    instructions: "Drop into push-up, complete push-up, jump feet back under hips, and explode into vertical jump.",
    tips: "Maintain fluid rhythm and breathe consistently."
  }
];

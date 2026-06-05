// [frontend/src/constants/AppConstants.js]

export const ONBOARDING_TOUR = [
  {
    id: 'pantry',
    title: 'Smart Pantry',
    desc: 'Take a photo of your fridge, Eatsy knows exactly what you have. No more food waste.',
    icon: 'camera-outline',
    color: '#6B8E23',
  },
  {
    id: 'ai_chef',
    title: 'AI Chef Assistant',
    desc: 'Chat with our AI Chef for recipe inspiration or nutrition advice anytime.',
    icon: 'chatbubble-ellipses-outline',
    color: '#4682B4',
  },
  {
    id: 'discovery',
    title: 'Personalized Discovery',
    desc: 'Every recipe is curated to match your health goals and culinary taste.',
    icon: 'restaurant-outline',
    color: '#D2691E',
  },
];

export const ONBOARDING_GOALS = [
  { id: 'lose_weight', title: 'Lose Weight', icon: 'trending-down' },
  { id: 'gain_muscle', title: 'Gain Muscle', icon: 'barbell' },
  { id: 'maintain', title: 'Maintain', icon: 'fitness' },
  { id: 'eat_healthier', title: 'Eat Healthy', icon: 'leaf' },
];

export const COOKING_STYLES = [
  { id: 'quick', title: 'Quick & Easy', desc: 'Under 20 mins, minimal effort', icon: 'flash-outline' },
  { id: 'balanced', title: 'Balanced Explorer', desc: 'Healthy & flavorful variety', icon: 'compass-outline' },
  { id: 'gourmet', title: 'Gourmet Pro', desc: 'Mastering techniques & styles', icon: 'ribbon-outline' },
];

export const DIET_TYPES = [
  'Omnivore', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Pescatarian'
];

export const ALLERGY_OPTIONS = [
  'Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'Fish'
];

export const CUISINE_OPTIONS = [
  'Vietnamese', 'Italian', 'Japanese', 'Chinese', 'Thai', 'Indian', 'Mexican', 'Korean'
];

export const MEASUREMENT_SYSTEMS = [
  { id: 'metric', title: 'Metric', desc: 'kg, g, ml, cm', icon: '🌍' },
  { id: 'imperial', title: 'Imperial', desc: 'lb, oz, fl oz, cup', icon: '🇺🇸' },
];

export const APP_TOURS = {
  HOME: [
    {
      targetId: 'tab_home',
      title: 'Discover Eatsy',
      description: 'The Home tab contains personalized meal suggestions curated just for you.',
    },
    {
      targetId: 'home_trending',
      title: "Today's Picks",
      description: 'Not sure what to eat? Try a suggested dish or start cooking from here.',
    },
    {
      targetId: 'home_curated',
      title: 'Curated for You',
      description: 'If these picks don\'t match your taste, explore the broader curated recipe list below.',
    },
  ],
  PANTRY: [
    {
      targetId: 'pantry_camera',
      title: 'Scan Your Fridge',
      description: 'Take a photo of your fridge and the AI will detect and manage your ingredients.',
    },
    {
      targetId: 'pantry_action',
      title: 'Select Ingredients',
      description: 'Tap ingredient cards to select them, then press "Make something tasty" to find matching recipes.',
    },
  ],
  PANTRY_RESULTS: [
    {
      targetId: 'pantry_result_primary',
      title: 'Best Match',
      description: 'This recipe best matches the ingredients you selected. Tap to view details.',
    },
  ],
  RECIPE: [
    {
      targetId: 'recipe_stats',
      title: 'Quick Facts',
      description: 'Quickly view cook time, difficulty, and calorie information for this recipe.',
    },
    {
      targetId: 'recipe_ingredients',
      title: 'Ingredients',
      description: 'Full list of ingredients with precise quantities to prepare the dish.',
    },
    {
      targetId: 'recipe_instructions',
      title: 'Instructions',
      description: 'Step-by-step instructions to help you prepare the dish perfectly.',
    },
    {
      targetId: 'recipe_ai',
      title: 'AI Assistant Ready',
      description: 'Missing an ingredient or want a substitution? Ask Eatsy AI right here!',
    },
  ]
 ,
  CHAT: [
    {
      targetId: 'chat_quick_prompts',
      title: 'Quick Prompts',
      description: 'Start quickly with one of these prompts to see how Eatsy AI responds.',
    },
    {
      targetId: 'chat_input',
      title: 'Ask the AI',
      description: 'Type your question in the input below to start a conversation with Eatsy AI.',
    },
  ],

  PROFILE: [
    {
      targetId: 'profile_stats',
      title: 'Nutrition at a Glance',
      description: 'See your daily kcal target and access your health tracking tools.',
    },
  ],
};

export const APP_CONFIG = {
  ANIMATION_DURATION: 300,
  FADE_DURATION: 200,
  SPLASH_DELAY: 2500,
};

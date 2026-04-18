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
      title: 'Khám phá Eatsy',
      description: 'Tab Home là nơi tập hợp những gợi ý món ăn thông minh nhất dành riêng cho bạn.',
    },
    {
      targetId: 'home_trending',
      title: 'Gợi ý hôm nay',
      description: 'Bạn không biết ăn gì? Hãy thử đổi sang món khác hoặc bắt đầu nấu ngay từ đây.',
    },
    {
      targetId: 'home_curated',
      title: 'Dành riêng cho bạn',
      description: 'Nếu những món trên chưa hợp ý, hãy xem thêm danh sách món ăn đa dạng được chúng tôi lựa chọn kỹ lưỡng dưới này.',
    },
  ],
  PANTRY: [
    {
      targetId: 'pantry_camera',
      title: 'Quét tủ lạnh',
      description: 'Chụp một bức ảnh tủ lạnh của bạn, AI sẽ tự động nhận diện và quản lý nguyên liệu giúp bạn.',
    },
  ],
  RECIPE: [
    {
      targetId: 'recipe_stats',
      title: 'Thông tin cơ bản',
      description: 'Xem nhanh thời gian nấu, độ khó và lượng calo của món ăn này.',
    },
    {
      targetId: 'recipe_ingredients',
      title: 'Nguyên liệu cần thiết',
      description: 'Danh sách đầy đủ các nguyên liệu và định lượng cụ thể để bạn chuẩn bị.',
    },
    {
      targetId: 'recipe_instructions',
      title: 'Các bước thực hiện',
      description: 'Hướng dẫn từng bước chi tiết để bạn hoàn thành món ăn một cách hoàn hảo.',
    },
    {
      targetId: 'recipe_ai',
      title: 'Trợ lý AI luôn sẵn sàng',
      description: 'Bạn bị thiếu nguyên liệu hoặc muốn thay thế? Hãy hỏi Eatsy AI ngay tại đây nhé!',
    },
  ]
};

export const APP_CONFIG = {
  ANIMATION_DURATION: 300,
  FADE_DURATION: 200,
  SPLASH_DELAY: 2500,
};

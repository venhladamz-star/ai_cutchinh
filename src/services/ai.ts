export const BEEKNOEE_KEY = 'sk-bee-d02b0d2101de40a591d219017c5b6cb6';
export const BEEKNOEE_URL = 'https://platform.beeknoee.com/api/v1/chat/completions';
export const MISTRAL_KEY = 'C6M7F3663wXaOawLfH9wOHaFRsZ11hot';
export const SPOON_KEY = '3e72812b653a4f77a757e343b1b364e0';

const BEE_MODELS = [
  'qwen-3-235b-a22b-instruct-2507',
  'glm-4.5-flash',
  'llama3.1-8b'
];

// Helper to translate to Vietnamese or format Spoonacular data
const DICT: Record<string, string> = {
  chicken: 'gà', pork: 'thịt heo', beef: 'thịt bò', rice: 'gạo', egg: 'trứng', 
  tomato: 'cà chua', onion: 'hành tây', garlic: 'tỏi', fish: 'cá', shrimp: 'tôm', 
  noodle: 'mì', vegetable: 'rau', tofu: 'đậu phụ', mushroom: 'nấm', carrot: 'cà rốt', 
  potato: 'khoai tây', pepper: 'ớt', soup: 'canh', salad: 'gỏi', fried: 'chiên', 
  grilled: 'nướng', steamed: 'hấp', boiled: 'luộc', stir: 'xào', curry: 'cà ri', 
  cake: 'bánh', bread: 'bánh mì', pasta: 'mì ý', sauce: 'sốt', milk: 'sữa', 
  butter: 'bơ', cheese: 'phô mai', lemon: 'chanh', sugar: 'đường', salt: 'muối', 
  oil: 'dầu ăn', water: 'nước', rib: 'sườn', belly: 'ba chỉ', broccoli: 'súp lơ', 
  spinach: 'rau chân vịt', cucumber: 'dưa chuột', ginger: 'gừng', soy: 'nước tương', 
  lime: 'chanh xanh', chili: 'ớt', basil: 'húng quế', cilantro: 'rau mùi', 
  scallion: 'hành lá', sesame: 'mè', peanut: 'đậu phộng', coconut: 'dừa'
};

export function translateToVietnamese(text: string) {
  if (!text) return 'Món ăn';
  let t = text.toLowerCase();
  Object.keys(DICT).sort((a, b) => b.length - a.length).forEach(eng => {
    t = t.replace(new RegExp(eng, 'gi'), DICT[eng]);
  });
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export type Recipe = {
  name: string;
  emoji?: string;
  image?: string;
  time: string;
  difficulty: string;
  calories: string;
  desc: string;
  ingredients: string[];
  steps: string[];
  tips?: string;
  source?: string;
  matchedInputs?: string[];
  price?: string; // used for delivery
};

function parseJsonResponse(text: string): any[] {
  try {
    const c = text.replace(/```json|```/g, '').trim();
    const s = c.indexOf('[');
    const e = c.lastIndexOf(']');
    if (s === -1 || e === -1) throw new Error("Invalid JSON array");
    return JSON.parse(c.substring(s, e + 1));
  } catch (err) {
    console.error("Parse JSON error", err, text);
    return [];
  }
}

async function callBeeknoee(prompt: string, modelIndex = 0): Promise<string> {
  if (modelIndex >= BEE_MODELS.length) throw new Error("Hết model Beeknoee");
  try {
    const response = await fetch(BEEKNOEE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEEKNOEE_KEY}`
      },
      body: JSON.stringify({
        model: BEE_MODELS[modelIndex],
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });
    if (!response.ok) throw new Error(`Model ${BEE_MODELS[modelIndex]} lỗi HTTP`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (e) {
    console.warn(`⚠️ Model ${BEE_MODELS[modelIndex]} thất bại, chuyển model dự phòng...`);
    return callBeeknoee(prompt, modelIndex + 1);
  }
}

async function callMistral(prompt: string): Promise<string> {
  const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + MISTRAL_KEY
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    })
  });
  if (!r.ok) throw new Error('Mistral Error ' + r.status);
  const data = await r.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callSpoonacular(query: string): Promise<any[]> {
  const r = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=4&apiKey=${SPOON_KEY}&addRecipeInformation=true`);
  if (!r.ok) throw new Error('Spoonacular Error ' + r.status);
  const data = await r.json();
  return data.results || [];
}

const STATIC_RECIPES: Recipe[] = [
  { name: 'Trứng chiên hành', emoji: '🍳', time: '10 phút', difficulty: 'Dễ', calories: '180 kcal', desc: 'Món đơn giản, nhanh gọn.', ingredients: ['trứng', 'hành lá', 'muối'], steps: ['Đánh trứng', 'Phi hành', 'Chiên vàng'] },
  { name: 'Cơm chiên tỏi', emoji: '🍚', time: '15 phút', difficulty: 'Dễ', calories: '350 kcal', desc: 'Cơm nguội chiên tỏi thơm lừng.', ingredients: ['cơm nguội', 'tỏi', 'trứng'], steps: ['Phi tỏi', 'Xào cơm', 'Đập trứng'] },
  { name: 'Canh cà chua', emoji: '🍲', time: '20 phút', difficulty: 'Dễ', calories: '120 kcal', desc: 'Canh chua thanh mát.', ingredients: ['cà chua', 'hành', 'rau'], steps: ['Xào cà chua', 'Nấu nước', 'Nêm gia vị'] },
  { name: 'Bún trộn', emoji: '🍜', time: '15 phút', difficulty: 'Trung bình', calories: '280 kcal', desc: 'Bún trộn chua ngọt.', ingredients: ['bún', 'đậu phụ', 'rau', 'nước mắm'], steps: ['Luộc bún', 'Pha nước chấm', 'Trộn đều'] }
];

export function getStaticFallback(): Recipe[] {
  return STATIC_RECIPES.sort(() => Math.random() - 0.5).slice(0, 4).map(r => ({ ...r, source: 'static' }));
}

export async function smartSuggest({
  prompt,
  query,
  inputIngredients = [],
  onLayerChange
}: {
  prompt: string;
  query?: string;
  inputIngredients?: string[];
  onLayerChange?: (msg: string) => void;
}): Promise<Recipe[]> {
  
  if (onLayerChange) onLayerChange('💎 Lớp 0-2: Siêu trí tuệ Qwen/GLM đang xử lý...');
  try {
    const text = await callBeeknoee(prompt);
    const recipes = parseJsonResponse(text);
    if (recipes.length > 0) return recipes.map(r => ({ ...r, source: 'beeknoee', matchedInputs: inputIngredients }));
  } catch (e) {
    console.warn('Beeknoee fail', e);
  }

  if (onLayerChange) onLayerChange('🤖 Lớp 3: Chuyển sang Mistral AI dự phòng...');
  try {
    const text = await callMistral(prompt);
    const recipes = parseJsonResponse(text);
    if (recipes.length > 0) return recipes.map(r => ({ ...r, source: 'mistral', matchedInputs: inputIngredients }));
  } catch (e) {
    console.warn('Mistral fail', e);
  }

  if (onLayerChange) onLayerChange('🛡️ Lớp 4: Lấy dữ liệu từ Spoonacular...');
  try {
    const q = query || 'vietnamese food';
    const spoonData = await callSpoonacular(q);
    const recipes: Recipe[] = spoonData.map(item => ({
      name: translateToVietnamese(item.title),
      emoji: '🍽️',
      image: item.image || '',
      time: (item.readyInMinutes || 30) + ' phút',
      difficulty: item.readyInMinutes <= 15 ? 'Dễ' : 'Trung bình',
      calories: 'N/A',
      desc: 'Công thức từ Spoonacular.',
      ingredients: item.extendedIngredients?.map((i: any) => translateToVietnamese(i.name)) || [],
      steps: ['Xem chi tiết tại link gốc'],
      tips: '',
      source: 'spoonacular',
      matchedInputs: inputIngredients
    }));
    if (recipes.length > 0) return recipes;
  } catch (e) {
    console.warn('Spoonacular fail', e);
  }

  if (onLayerChange) onLayerChange('📦 Lớp 5: Dữ liệu nội bộ...');
  return getStaticFallback();
}

export function buildPrompt({
  ingredients = [],
  fridgeItems = [],
  familyMembers = [],
  timeFilter = '',
  mealFilter = '',
  moods = [],
  devices = [],
  allergies = [],
  preferences = [],
  goals = [],
  extra = '',
  count = 4
}: any) {
  const p: string[] = [];
  p.push(`Bạn là chuyên gia ẩm thực Việt Nam tích hợp dữ liệu từ Cookpad và các trang tin sức khỏe đời sống.`);
  p.push(`Nhiệm vụ của bạn là nhận danh sách nguyên liệu và gợi ý món ăn phù hợp với khẩu vị người Việt.`);

  const ings = fridgeItems.length ? fridgeItems : ingredients;
  if (ings.length) {
    p.push(`\n★ Nguyên liệu có sẵn: ${ings.join(', ')}`);
  } else if (familyMembers.length) {
    p.push(`\n★ Nấu cho gia đình gồm: ${familyMembers.map((m: any) => m.name + ' (' + m.pref + ')').join(', ')}`);
  }

  if (timeFilter) p.push(`- Thời gian nấu mong muốn: ${timeFilter}`);
  if (mealFilter) p.push(`- Loại bữa: ${mealFilter}`);
  if (moods.length) p.push(`- Tình huống/Tâm trạng: ${moods.join(', ')}`);
  if (devices.length) p.push(`- Thiết bị nấu có sẵn: ${devices.join(', ')}`);
  if (allergies.length) p.push(`- TUYỆT ĐỐI KHÔNG dùng (dị ứng): ${allergies.join(', ')}`);
  if (preferences.length) p.push(`- Sở thích ăn uống: ${preferences.join(', ')}`);
  if (goals.length) p.push(`- Mục tiêu dinh dưỡng: ${goals.join(', ')}`);
  if (extra) p.push(extra);

  p.push(`\n=== NHIỆM VỤ ===`);
  p.push(`2. Gợi ý ${count} món ăn phổ biến tại Việt Nam.`);
  p.push(`3. Thiết lập độ khó: Dễ, Trung bình, Khó.`);

  p.push(`\n=== ĐỊNH DẠNG TRẢ VỀ ===`);
  p.push(`Chỉ trả về chuỗi JSON thuần túy (không markdown, không backtick), format:`);
  p.push(`[{"name":"Tên món","emoji":"emoji","time":"X phút","difficulty":"Dễ|Trung bình|Khó","calories":"XXX kcal","desc":"Hương vị","ingredients":["nguyên liệu 1"],"steps":["Bước 1: ..."],"tips":"Mẹo nhỏ từ đầu bếp"}]`);

  return p.join('\n');
}

export async function generateDelivery(query: string) {
  try {
    const text = await callBeeknoee(`Gợi ý 3 quán ăn ngon nổi tiếng giao món "${query}" ở Việt Nam. Chỉ trả về JSON [{"name":"Tên quán","price":"khoảng XXk", "rating": "4.5★", "time": "20 phút"}]. Không markdown.`);
    return parseJsonResponse(text);
  } catch (err) {
    return [
      { name: `Quán ngon ${query}`, price: '50k', rating: '4.5★', time: '20 phút' },
      { name: `Tiệm ăn ${query}`, price: '45k', rating: '4.8★', time: '15 phút' },
    ];
  }
}

export async function generateMealPlan() {
  try {
    const text = await callBeeknoee(`Lên thực đơn 7 ngày món Việt Nam. Trả về JSON {"Thứ 2":["Phở","Cơm tấm","Bún chả"], "Thứ 3":["Xôi","Cơm rang","Bánh mì"]} với các key là Thứ 2 đến Chủ nhật, mỗi ngày mảng 3 món. Không markdown.`);
    const c = text.replace(/```json|```/g, '').trim();
    return JSON.parse(c.substring(c.indexOf('{'), c.lastIndexOf('}') + 1));
  } catch (err) {
    return {
      "Thứ 2": ["Phở gà", "Cơm sườn", "Canh chua cá lóc"],
      "Thứ 3": ["Bánh cuốn", "Bún bò Huế", "Bò lúc lắc"],
      "Thứ 4": ["Hủ tiếu", "Cơm gà xối mỡ", "Gà kho sả"],
      "Thứ 5": ["Bánh mì", "Bún riêu", "Mực xào"],
      "Thứ 6": ["Xôi mặn", "Cơm chiên", "Tôm rim thịt"],
      "Thứ 7": ["Miến lươn", "Lẩu thái", "Bún chả"],
      "Chủ nhật": ["Bánh canh", "Gà tiềm", "Cơm thố"]
    };
  }
}

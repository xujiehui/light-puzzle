import { LevelConfig, Language } from './types';

export const TILE_GAP = 2; // Tight gap for a sleek look
export const IS_DEV_MODE = true; // Developer Mode: Set to true to unlock all levels

// 1. Initial Levels (1-10) - Refined Keywords
const INITIAL_LEVELS: LevelConfig[] = [
  { 
    level: 1, 
    gridSize: 3, 
    name: { en: "Serenity", zh: "宁静" }, 
    description: { en: "A gentle beginning.", zh: "柔和的开端。" }, 
    imageKeyword: "zen,garden,stone,sand" 
  },
  { 
    level: 2, 
    gridSize: 3, 
    name: { en: "Urban Flow", zh: "城市律动" }, 
    description: { en: "The city never sleeps.", zh: "不夜之城。" }, 
    imageKeyword: "city,night,neon,traffic,blur" 
  },
  { 
    level: 3, 
    gridSize: 3, 
    name: { en: "Azure Depth", zh: "深蓝" }, 
    description: { en: "Beneath the surface.", zh: "水面之下。" }, 
    imageKeyword: "underwater,blue,deep,ocean" 
  },
  { 
    level: 4, 
    gridSize: 4, 
    name: { en: "Golden Horizon", zh: "金色地平线" }, 
    description: { en: "Chasing the sun.", zh: "追逐落日。" }, 
    imageKeyword: "sunset,horizon,golden,field" 
  },
  { 
    level: 5, 
    gridSize: 4, 
    name: { en: "Geometry", zh: "几何" }, 
    description: { en: "Shapes in harmony.", zh: "形状的和谐。" }, 
    imageKeyword: "architecture,geometric,modern,building" 
  },
  { 
    level: 6, 
    gridSize: 4, 
    name: { en: "Wild Spirit", zh: "荒野之灵" }, 
    description: { en: "Nature untamed.", zh: "野性自然。" }, 
    imageKeyword: "wild,forest,mist,nature" 
  },
  { 
    level: 7, 
    gridSize: 5, 
    name: { en: "Cyber Soul", zh: "赛博灵魂" }, 
    description: { en: "Digital dreams.", zh: "数字梦想。" }, 
    imageKeyword: "cyberpunk,neon,technology,future" 
  },
  { 
    level: 8, 
    gridSize: 5, 
    name: { en: "Alpine Air", zh: "极境" }, 
    description: { en: "Reach the summit.", zh: "触碰巅峰。" }, 
    imageKeyword: "mountain,snow,peak,winter" 
  },
  { 
    level: 9, 
    gridSize: 5, 
    name: { en: "Cosmic Dust", zh: "星尘" }, 
    description: { en: "Stardust and memories.", zh: "星河记忆。" }, 
    imageKeyword: "space,nebula,stars,galaxy" 
  },
  { 
    level: 10, 
    gridSize: 6, 
    name: { en: "Masterpiece", zh: "杰作" }, 
    description: { en: "The final challenge.", zh: "最终挑战。" }, 
    imageKeyword: "abstract,art,paint,colorful" 
  },
];

// 2. Additional Chapters (11-120) - Highly Specific Keywords based on Names
const ADDITIONAL_CHAPTERS = [
  {
    desc: { en: "The intricate beauty of flora.", zh: "探索植物的精细之美。" },
    gridSize: 3,
    levels: [
        { k: "petal,soft,pink,macro", n: { en: "Petal Softness", zh: "花瓣轻语" } },
        { k: "leaf,veins,green,macro", n: { en: "Green Veins", zh: "翠绿脉络" } },
        { k: "secret,garden,path,green", n: { en: "Secret Garden", zh: "秘密花园" } },
        { k: "red,rose,romance,flower", n: { en: "Crimson Love", zh: "深红挚爱" } },
        { k: "forest,fog,misty,trees", n: { en: "Misty Woods", zh: "迷雾森林" } },
        { k: "old,oak,tree,roots", n: { en: "Ancient Oak", zh: "古老橡树" } },
        { k: "cactus,desert,thorn,plant", n: { en: "Desert Thorn", zh: "沙漠之刺" } },
        { k: "spring,blossom,cherry,flower", n: { en: "Spring Awakening", zh: "春日苏醒" } },
        { k: "fern,forest,green,plant", n: { en: "Fern Valley", zh: "蕨类山谷" } },
        { k: "jungle,tropical,dense,green", n: { en: "Tropical Dense", zh: "热带丛林" } }
    ]
  },
  {
    desc: { en: "Stories from the streets.", zh: "来自街头巷尾的故事。" },
    gridSize: 4,
    levels: [
        { k: "morning,city,street,sunlight", n: { en: "Morning Commute", zh: "晨间通勤" } },
        { k: "crowd,crossing,pedestrian,blur", n: { en: "Crowded Crossing", zh: "拥挤路口" } },
        { k: "taxi,yellow,city,cab", n: { en: "Yellow Cab", zh: "黄色的士" } },
        { k: "skyscraper,glass,reflection,blue", n: { en: "Glass Giants", zh: "玻璃巨人" } },
        { k: "bridge,steel,suspension,river", n: { en: "Steel Span", zh: "钢铁横跨" } },
        { k: "subway,train,motion,blur", n: { en: "Metro Speed", zh: "地铁极速" } },
        { k: "coffee,cafe,window,morning", n: { en: "Corner Coffee", zh: "街角咖啡" } },
        { k: "graffiti,streetart,wall,color", n: { en: "Urban Canvas", zh: "城市画布" } },
        { k: "highway,road,perspective,travel", n: { en: "Endless Highway", zh: "无尽公路" } },
        { k: "skyline,silhouette,sunset,city", n: { en: "City Silhouette", zh: "城市剪影" } }
    ]
  },
  {
    desc: { en: "Wonders of the deep blue.", zh: "深蓝海洋的奇迹。" },
    gridSize: 4,
    levels: [
        { k: "deep,blue,ocean,water", n: { en: "Deep Blue", zh: "深蓝海域" } },
        { k: "sand,beach,golden,shore", n: { en: "Golden Sands", zh: "金色沙滩" } },
        { k: "wave,crashing,ocean,spray", n: { en: "Crashing Tide", zh: "汹涌潮汐" } },
        { k: "coral,reef,colorful,underwater", n: { en: "Reef Colors", zh: "多彩珊瑚" } },
        { k: "fish,school,underwater,blue", n: { en: "School of Fish", zh: "游鱼成群" } },
        { k: "shark,underwater,predator,ocean", n: { en: "Silent Hunter", zh: "静默猎手" } },
        { k: "sailboat,sea,horizon,alone", n: { en: "Lone Sail", zh: "孤帆远影" } },
        { k: "lighthouse,coast,storm,sea", n: { en: "Guiding Light", zh: "指引之光" } },
        { k: "seashell,sand,beach,macro", n: { en: "Ocean Pearl", zh: "海洋珍珠" } },
        { k: "cliff,coast,rocks,ocean", n: { en: "Rugged Shore", zh: "崎岖海岸" } }
    ]
  },
  {
    desc: { en: "Less is more.", zh: "少即是多。" },
    gridSize: 5,
    levels: [
        { k: "minimal,space,clean,simple", n: { en: "Pure Space", zh: "纯净空间" } },
        { k: "white,texture,minimal,bright", n: { en: "White on White", zh: "白之层次" } },
        { k: "simple,object,minimalism,art", n: { en: "Simplicity", zh: "简单至上" } },
        { k: "shadow,light,contrast,wall", n: { en: "Light & Shade", zh: "光影交错" } },
        { k: "line,geometry,minimal,straight", n: { en: "Perfect Line", zh: "完美线条" } },
        { k: "shape,abstract,form,minimal", n: { en: "Abstract Form", zh: "抽象形态" } },
        { k: "clean,room,white,empty", n: { en: "Clean Slate", zh: "一尘不染" } },
        { k: "chair,alone,room,minimal", n: { en: "Solitary Seat", zh: "孤独的椅" } },
        { k: "wall,concrete,texture,gray", n: { en: "Texture", zh: "墙面纹理" } },
        { k: "light,ray,dark,hope", n: { en: "Ray of Hope", zh: "希望之光" } }
    ]
  },
  {
    desc: { en: "Creatures big and small.", zh: "大自然的生灵。" },
    gridSize: 5,
    levels: [
        { k: "lion,face,wild,africa", n: { en: "King of Beasts", zh: "百兽之王" } },
        { k: "cat,eyes,elegant,fur", n: { en: "Feline Grace", zh: "猫之优雅" } },
        { k: "dog,portrait,loyal,pet", n: { en: "Loyal Friend", zh: "忠诚伙伴" } },
        { k: "bird,flying,wings,sky", n: { en: "Taking Flight", zh: "展翅高飞" } },
        { k: "eagle,sky,predator,bird", n: { en: "Sky Hunter", zh: "天空猎手" } },
        { k: "wolf,snow,winter,wild", n: { en: "Winter Wolf", zh: "冬日之狼" } },
        { k: "horse,running,wild,field", n: { en: "Wild Gallop", zh: "旷野奔腾" } },
        { k: "butterfly,flower,macro,colorful", n: { en: "Fragile Beauty", zh: "脆弱之美" } },
        { k: "owl,night,eyes,bird", n: { en: "Night Watcher", zh: "暗夜守望" } },
        { k: "tiger,stripes,wild,jungle", n: { en: "Striped Power", zh: "斑斓猛虎" } }
    ]
  },
  {
    desc: { en: "Frozen music.", zh: "凝固的音乐。" },
    gridSize: 6,
    levels: [
        { k: "architecture,modern,building,lines", n: { en: "Modern Lines", zh: "现代线条" } },
        { k: "window,view,city,frame", n: { en: "City View", zh: "城市之窗" } },
        { k: "door,old,wooden,mystery", n: { en: "Hidden Entry", zh: "隐秘入口" } },
        { k: "spiral,stairs,architecture,down", n: { en: "Spiral Up", zh: "螺旋上升" } },
        { k: "arch,stone,bridge,ancient", n: { en: "Stone Arch", zh: "石制拱门" } },
        { k: "column,greek,marble,pillar", n: { en: "Ancient Pillars", zh: "古老石柱" } },
        { k: "roof,tiles,city,top", n: { en: "Rooftops", zh: "屋顶之上" } },
        { k: "museum,hall,art,interior", n: { en: "Hall of Art", zh: "艺术殿堂" } },
        { k: "palace,royal,garden,grand", n: { en: "Royal Courts", zh: "皇家庭院" } },
        { k: "ruins,ancient,stone,history", n: { en: "Time's Mark", zh: "岁月痕迹" } }
    ]
  },
  {
    desc: { en: "A feast for the senses.", zh: "感官的盛宴。" },
    gridSize: 6,
    levels: [
        { k: "food,plate,gourmet,restaurant", n: { en: "Plated Art", zh: "盘中艺术" } },
        { k: "fruit,fresh,market,colorful", n: { en: "Fresh Harvest", zh: "新鲜收获" } },
        { k: "coffee,cup,steam,morning", n: { en: "Morning Brew", zh: "晨间醇香" } },
        { k: "bread,bakery,fresh,loaf", n: { en: "Daily Loaf", zh: "每日面包" } },
        { k: "cake,dessert,sweet,chocolate", n: { en: "Sweet Treat", zh: "甜蜜款待" } },
        { k: "spices,colorful,market,powder", n: { en: "Flavor Dust", zh: "风味粉尘" } },
        { k: "vegetables,green,fresh,salad", n: { en: "Green Diet", zh: "绿色饮食" } },
        { k: "drink,splash,ice,cocktail", n: { en: "Cold Splash", zh: "冰爽飞溅" } },
        { k: "chef,cooking,kitchen,food", n: { en: "Master's Touch", zh: "大师手笔" } },
        { k: "market,food,stall,colorful", n: { en: "Local Colors", zh: "集市色彩" } }
    ]
  },
  {
    desc: { en: "Visions of tomorrow.", zh: "对未来的愿景。" },
    gridSize: 7,
    levels: [
        { k: "circuit,board,tech,macro", n: { en: "Circuitry", zh: "精密电路" } },
        { k: "robot,ai,face,future", n: { en: "AI Friend", zh: "AI 伙伴" } },
        { k: "motherboard,computer,tech,chip", n: { en: "Motherboard", zh: "核心主板" } },
        { k: "neon,city,cyberpunk,rain", n: { en: "Neon City", zh: "霓虹都市" } },
        { k: "laser,light,beam,show", n: { en: "Laser Beam", zh: "激光束" } },
        { k: "spaceship,scifi,stars,space", n: { en: "Star Cruiser", zh: "星际巡洋" } },
        { k: "laboratory,science,clean,white", n: { en: "Clean Room", zh: "实验室" } },
        { k: "matrix,code,digital,green", n: { en: "Data Stream", zh: "数据流" } },
        { k: "binary,code,screen,hacker", n: { en: "Binary Rain", zh: "二进制雨" } },
        { k: "futuristic,city,scifi,concept", n: { en: "Tomorrow", zh: "明日世界" } }
    ]
  },
  {
    desc: { en: "Patterns of chaos.", zh: "混沌中的纹理。" },
    gridSize: 8,
    levels: [
        { k: "pattern,repeat,texture,geometric", n: { en: "Repetition", zh: "无限重复" } },
        { k: "texture,rough,wall,detail", n: { en: "Rough Surface", zh: "粗糙表面" } },
        { k: "abstract,paint,splash,color", n: { en: "Color Splash", zh: "色彩泼墨" } },
        { k: "oil,paint,strokes,art", n: { en: "Oil Strokes", zh: "油画笔触" } },
        { k: "mosaic,tile,glass,colorful", n: { en: "Broken Glass", zh: "破碎玻璃" } },
        { k: "kaleidoscope,fractal,pattern,trippy", n: { en: "Fractals", zh: "分形几何" } },
        { k: "silk,fabric,wave,texture", n: { en: "Silk Waves", zh: "丝绸波浪" } },
        { k: "glass,reflection,abstract,light", n: { en: "Reflections", zh: "光影反射" } },
        { k: "smoke,abstract,wisps,black", n: { en: "Rising Smoke", zh: "袅袅青烟" } },
        { k: "ink,water,swirl,abstract", n: { en: "Ink Dance", zh: "水墨之舞" } }
    ]
  },
  {
    desc: { en: "Dreams defying logic.", zh: "超越逻辑的梦境。" },
    gridSize: 9,
    levels: [
        { k: "fantasy,landscape,dream,surreal", n: { en: "Dreamscape", zh: "梦境地貌" } },
        { k: "clock,melting,surreal,time", n: { en: "Melting Time", zh: "消融时光" } },
        { k: "magic,book,spell,fantasy", n: { en: "Sorcery", zh: "巫术" } },
        { k: "portal,door,space,fantasy", n: { en: "Other World", zh: "彼岸世界" } },
        { k: "floating,island,sky,surreal", n: { en: "Anti Gravity", zh: "反重力" } },
        { k: "clock,gears,time,abstract", n: { en: "Timeless", zh: "永恒" } },
        { k: "mask,venice,carnival,mystery", n: { en: "Masquerade", zh: "假面舞会" } },
        { k: "desert,mirage,heat,illusion", n: { en: "Mirage", zh: "海市蜃楼" } },
        { k: "chess,surreal,board,game", n: { en: "Mind Game", zh: "心理博弈" } },
        { k: "mirror,reflection,infinite,surreal", n: { en: "Reflection", zh: "镜中倒影" } }
    ]
  },
  {
    desc: { en: "The raw power of nature.", zh: "自然的原始力量。" },
    gridSize: 10,
    levels: [
        { k: "fire,flame,burning,hot", n: { en: "Inferno", zh: "炼狱之火" } },
        { k: "ocean,deep,dark,water", n: { en: "Deep Current", zh: "深海暗流" } },
        { k: "ice,glacier,frozen,blue", n: { en: "Permafrost", zh: "永冻土" } },
        { k: "volcano,lava,eruption,fire", n: { en: "Eruption", zh: "火山爆发" } },
        { k: "lightning,storm,thunder,sky", n: { en: "Thunderstorm", zh: "雷暴" } },
        { k: "crystal,prism,light,rainbow", n: { en: "Prism", zh: "棱镜" } },
        { k: "stone,monolith,ancient,rock", n: { en: "Monolith", zh: "巨石" } },
        { k: "sand,dune,desert,wind", n: { en: "Dune", zh: "沙丘" } },
        { k: "tornado,storm,wind,destruction", n: { en: "Tornado", zh: "龙卷风" } },
        { k: "metal,steel,industry,texture", n: { en: "Steel Heart", zh: "钢铁之心" } }
    ]
  }
];

// Helper to generate the remaining levels
const generateMoreLevels = (startId: number): LevelConfig[] => {
  const levels: LevelConfig[] = [];
  let currentId = startId;

  ADDITIONAL_CHAPTERS.forEach((chapter) => {
    chapter.levels.forEach((lvlData) => {
      levels.push({
        level: currentId,
        gridSize: chapter.gridSize,
        name: lvlData.n,
        description: chapter.desc,
        imageKeyword: lvlData.k
      });

      currentId++;
    });
  });

  return levels;
};

// 3. Combine them
export const LEVELS: LevelConfig[] = [
  ...INITIAL_LEVELS,
  ...generateMoreLevels(11)
];

export const TRANSLATIONS = {
  [Language.EN]: {
    title: "Lumina",
    subtitle: "The Art of Focus",
    level: "Level",
    moves: "Moves Made",
    bestScore: "Best Score",
    score: "Score",
    best: "Best",
    nextChapter: "Next Chapter",
    completeCollection: "Complete Collection",
    replay: "Replay",
    menu: "Menu",
    holdToPeek: "Hold to Peek",
    restart: "Restart",
    referenceImage: "Reference Image",
    magnificent: "Magnificent",
    completed: "Completed",
    aiCurator: "AI Curator",
    consulting: "Consulting the curator...",
    chaos: "Chaos has been ordered. The picture is now whole.",
    error: "An error occurred.",
    loading: "Loading...",
    time: "Time",
    languageName: "English"
  },
  [Language.ZH]: {
    title: "光影拼图",
    subtitle: "专注的艺术",
    level: "关卡",
    moves: "步数",
    bestScore: "最高分",
    score: "本次得分",
    best: "最佳",
    nextChapter: "下一章",
    completeCollection: "完成挑战",
    replay: "重玩",
    menu: "菜单",
    holdToPeek: "按住预览",
    restart: "重新开始",
    referenceImage: "参考原图",
    magnificent: "完美",
    completed: "已完成",
    aiCurator: "AI 鉴赏家",
    consulting: "正在咨询馆长...",
    chaos: "混沌归于秩序，画面终成一体。",
    error: "发生错误。",
    loading: "加载中...",
    time: "时间",
    languageName: "中文"
  }
};
// =====================================================
// products-data.js — Full product catalog (54 products)
// Source: Power BI 'Products' table (live snapshot)
// =====================================================

const PRODUCTS_DATA = [
  // ── SMARTPHONES ──────────────────────────────────
  { id:"PRD-001", name:"Galaxy S25",       category:"Smartphone", brand:"Samsung", price:295000, processor:"Snapdragon 8 Elite", ram:"12GB", storage:"256GB", display:"6.2in AMOLED 120Hz", battery:"4000mAh", os:"Android 15", warranty:12, colors:["#1a1a2e","#C0C0C0","#1a3a6e"] },
  { id:"PRD-002", name:"Galaxy S25 Ultra", category:"Smartphone", brand:"Samsung", price:420000, processor:"Snapdragon 8 Elite", ram:"12GB", storage:"512GB", display:"6.9in AMOLED 120Hz", battery:"5000mAh", os:"Android 15", warranty:12, colors:["#0d0d0d","#8a8a8a","#C0C0C0"] },
  { id:"PRD-003", name:"Galaxy A56",       category:"Smartphone", brand:"Samsung", price:95000,  processor:"Exynos 1580",       ram:"8GB",  storage:"256GB", display:"6.7in AMOLED 120Hz", battery:"5000mAh", os:"Android 15", warranty:12, colors:["#111","#c8a2c8","#6b7c45"] },
  { id:"PRD-004", name:"Galaxy A36",       category:"Smartphone", brand:"Samsung", price:79000,  processor:"Snapdragon 6 Gen 3",ram:"8GB",  storage:"128GB", display:"6.7in AMOLED 120Hz", battery:"5000mAh", os:"Android 15", warranty:12, colors:["#111","#c9b1d9","#f5f5f5"] },
  { id:"PRD-005", name:"Galaxy Z Flip6",   category:"Smartphone", brand:"Samsung", price:320000, processor:"Snapdragon 8 Gen 3",ram:"12GB", storage:"256GB", display:"6.7in Foldable AMOLED", battery:"4000mAh", os:"Android 14",warranty:12, colors:["#3a6bcf","#C0C0C0","#7ec8b4"] },
  { id:"PRD-006", name:"iPhone 16",        category:"Smartphone", brand:"Apple",   price:280000, processor:"A18",               ram:"8GB",  storage:"128GB", display:"6.1in OLED 60Hz",    battery:"3561mAh", os:"iOS 18",     warranty:12, colors:["#1c1c1e","#3a7abf","#f4a0a0"] },
  { id:"PRD-007", name:"iPhone 16 Pro",    category:"Smartphone", brand:"Apple",   price:395000, processor:"A18 Pro",           ram:"8GB",  storage:"256GB", display:"6.3in OLED 120Hz",   battery:"3582mAh", os:"iOS 18",     warranty:12, colors:["#c9b59a","#1c1c1e","#b8a080"] },
  { id:"PRD-008", name:"iPhone 16 Pro Max",category:"Smartphone", brand:"Apple",   price:450000, processor:"A18 Pro",           ram:"8GB",  storage:"256GB", display:"6.9in OLED 120Hz",   battery:"4685mAh", os:"iOS 18",     warranty:12, colors:["#c9b59a","#1c1c1e","#f0ede8"] },
  { id:"PRD-009", name:"iPhone 15",        category:"Smartphone", brand:"Apple",   price:220000, processor:"A16 Bionic",        ram:"6GB",  storage:"128GB", display:"6.1in OLED 60Hz",    battery:"3349mAh", os:"iOS 17",     warranty:12, colors:["#1c1c1e","#3a7abf","#f4a0a0"] },
  { id:"PRD-010", name:"Pixel 9",          category:"Smartphone", brand:"Google",  price:250000, processor:"Tensor G4",         ram:"12GB", storage:"128GB", display:"6.3in OLED 120Hz",   battery:"4700mAh", os:"Android 15", warranty:12, colors:["#101010","#f0ede8","#4caf80"] },
  { id:"PRD-011", name:"Xiaomi 14T",       category:"Smartphone", brand:"Xiaomi",  price:140000, processor:"Dimensity 8300 Ultra",ram:"12GB",storage:"256GB",display:"6.67in AMOLED 144Hz",battery:"5000mAh",os:"Android 14", warranty:12, colors:["#111","#2244aa","#888"] },
  { id:"PRD-012", name:"Redmi Note 14 Pro",category:"Smartphone", brand:"Xiaomi",  price:68000,  processor:"Helio G100 Ultra",  ram:"8GB",  storage:"256GB", display:"6.67in AMOLED 120Hz",battery:"5110mAh", os:"Android 14", warranty:12, colors:["#111","#6a35a0","#2c7a3a"] },
  { id:"PRD-013", name:"Infinix Note 40",  category:"Smartphone", brand:"Infinix", price:52000,  processor:"Helio G99 Ultimate",ram:"8GB",  storage:"256GB", display:"6.78in AMOLED 120Hz",battery:"5000mAh", os:"Android 14", warranty:12, colors:["#111","#c8a000","#2c7a3a"] },
  { id:"PRD-014", name:"Tecno Camon 30",   category:"Smartphone", brand:"Tecno",   price:58000,  processor:"Helio G99",         ram:"8GB",  storage:"256GB", display:"6.78in AMOLED 120Hz",battery:"5000mAh", os:"Android 14", warranty:12, colors:["#111","#2244aa","#2c7a3a"] },
  { id:"PRD-015", name:"OnePlus 12",       category:"Smartphone", brand:"OnePlus", price:240000, processor:"Snapdragon 8 Gen 3",ram:"12GB", storage:"256GB", display:"6.82in LTPO AMOLED",  battery:"5400mAh", os:"Android 14", warranty:12, colors:["#111","#2c7a3a","#f0ede8"] },

  // ── LAPTOPS ──────────────────────────────────────
  { id:"PRD-016", name:"MacBook Air M3",       category:"Laptop", brand:"Apple",  price:310000, processor:"Apple M3",         ram:"8GB",  storage:"256GB SSD", display:"13.6in Liquid Retina", battery:"52.6Wh", os:"macOS Sequoia", warranty:12, colors:["#C0C0C0","#3b3b3b","#1c1c2a"] },
  { id:"PRD-017", name:"MacBook Air M2",       category:"Laptop", brand:"Apple",  price:255000, processor:"Apple M2",         ram:"8GB",  storage:"256GB SSD", display:"13.6in Liquid Retina", battery:"52.6Wh", os:"macOS Sonoma",  warranty:12, colors:["#C0C0C0","#3b3b3b","#1c1c2a"] },
  { id:"PRD-018", name:"MacBook Pro 14 M4",    category:"Laptop", brand:"Apple",  price:520000, processor:"Apple M4 Pro",     ram:"24GB", storage:"512GB SSD", display:"14.2in Retina XDR",    battery:"72.4Wh", os:"macOS Sequoia", warranty:12, colors:["#1c1c2a","#C0C0C0"] },
  { id:"PRD-019", name:"Dell XPS 13",          category:"Laptop", brand:"Dell",   price:340000, processor:"Intel Core Ultra 7",ram:"16GB",storage:"512GB SSD", display:"13.4in FHD+ InfinityEdge",battery:"55Wh",os:"Windows 11",    warranty:12, colors:["#C0C0C0","#3b3b3b"] },
  { id:"PRD-020", name:"Dell Inspiron 15",     category:"Laptop", brand:"Dell",   price:145000, processor:"Intel Core i5",    ram:"8GB",  storage:"512GB SSD", display:"15.6in FHD",           battery:"54Wh",  os:"Windows 11",    warranty:12, colors:["#C0C0C0","#111"] },
  { id:"PRD-021", name:"HP Pavilion 15",       category:"Laptop", brand:"HP",     price:135000, processor:"Intel Core i5",    ram:"16GB", storage:"512GB SSD", display:"15.6in FHD IPS",       battery:"41Wh",  os:"Windows 11",    warranty:12, colors:["#C0C0C0","#2244aa"] },
  { id:"PRD-022", name:"HP Spectre x360",      category:"Laptop", brand:"HP",     price:380000, processor:"Intel Core Ultra 7",ram:"16GB",storage:"1TB SSD",   display:"14in 2.8K OLED Touch",  battery:"68Wh",  os:"Windows 11",    warranty:12, colors:["#1a3a7a","#111"] },
  { id:"PRD-023", name:"Lenovo ThinkPad E14",  category:"Laptop", brand:"Lenovo", price:165000, processor:"Intel Core i5",    ram:"16GB", storage:"512GB SSD", display:"14in FHD IPS",         battery:"47Wh",  os:"Windows 11",    warranty:12, colors:["#111"] },
  { id:"PRD-024", name:"Lenovo IdeaPad Slim 5",category:"Laptop", brand:"Lenovo", price:155000, processor:"AMD Ryzen 7",      ram:"16GB", storage:"512GB SSD", display:"14in WUXGA OLED",      battery:"57Wh",  os:"Windows 11",    warranty:12, colors:["#888","#2244aa"] },
  { id:"PRD-025", name:"Asus ROG Zephyrus G14",category:"Laptop", brand:"Asus",   price:520000, processor:"AMD Ryzen 9",      ram:"32GB", storage:"1TB SSD",   display:"14in 3K OLED 120Hz",   battery:"73Wh",  os:"Windows 11",    warranty:12, colors:["#888","#f0ede8"] },
  { id:"PRD-026", name:"Asus Vivobook 15",     category:"Laptop", brand:"Asus",   price:125000, processor:"Intel Core i3",    ram:"8GB",  storage:"512GB SSD", display:"15.6in FHD",           battery:"42Wh",  os:"Windows 11",    warranty:12, colors:["#C0C0C0","#2244aa"] },
  { id:"PRD-027", name:"Acer Aspire 5",        category:"Laptop", brand:"Acer",   price:120000, processor:"Intel Core i5",    ram:"8GB",  storage:"512GB SSD", display:"15.6in FHD IPS",       battery:"50Wh",  os:"Windows 11",    warranty:12, colors:["#C0C0C0"] },
  { id:"PRD-028", name:"MSI Katana 15",        category:"Laptop", brand:"MSI",    price:340000, processor:"Intel Core i7",    ram:"16GB", storage:"1TB SSD",   display:"15.6in FHD 144Hz",     battery:"53Wh",  os:"Windows 11",    warranty:12, colors:["#111"] },

  // ── TVs ──────────────────────────────────────────
  { id:"PRD-029", name:"Samsung Crystal 4K 55in", category:"TV", brand:"Samsung", price:115000, processor:"Crystal Proc 4K", display:"55in 4K UHD LED",       os:"Tizen",     warranty:24, colors:["#111"] },
  { id:"PRD-030", name:"Samsung QLED Q60D 65in",  category:"TV", brand:"Samsung", price:235000, processor:"Quantum Proc",    display:"65in 4K QLED 60Hz",      os:"Tizen",     warranty:24, colors:["#111","#5a5a5a"] },
  { id:"PRD-031", name:"Samsung Neo QLED 75in",   category:"TV", brand:"Samsung", price:620000, processor:"Neural Quantum",  display:"75in 4K Mini-LED 120Hz", os:"Tizen",     warranty:24, colors:["#111"] },
  { id:"PRD-032", name:"LG C4 OLED 55in",         category:"TV", brand:"LG",      price:420000, processor:"a9 AI Gen7",      display:"55in 4K OLED 120Hz",     os:"webOS 24",  warranty:24, colors:["#111"] },
  { id:"PRD-033", name:"LG UR8050 50in",           category:"TV", brand:"LG",      price:98000,  processor:"a5 Gen6 AI",      display:"50in 4K UHD LED",        os:"webOS 23",  warranty:24, colors:["#111"] },
  { id:"PRD-034", name:"Sony Bravia X75K 55in",   category:"TV", brand:"Sony",    price:165000, processor:"X1 4K Processor", display:"55in 4K LED",            os:"Google TV", warranty:24, colors:["#111"] },
  { id:"PRD-035", name:"Sony Bravia 8 OLED 65in", category:"TV", brand:"Sony",    price:780000, processor:"XR Processor",    display:"65in 4K OLED 120Hz",     os:"Google TV", warranty:24, colors:["#111"] },
  { id:"PRD-036", name:"TCL C645 55in",            category:"TV", brand:"TCL",     price:92000,  processor:"AiPQ Processor",  display:"55in 4K QLED",           os:"Google TV", warranty:24, colors:["#111"] },
  { id:"PRD-037", name:"Haier H65S80EFX 65in",    category:"TV", brand:"Haier",   price:135000, processor:"Quad Core",       display:"65in 4K LED",            os:"Google TV", warranty:24, colors:["#111"] },
  { id:"PRD-038", name:"Hisense A6K 50in",         category:"TV", brand:"Hisense", price:78000,  processor:"Quad Core",       display:"50in 4K LED",            os:"VIDAA",     warranty:24, colors:["#111"] },
  { id:"PRD-039", name:"Xiaomi TV A Pro 55in",     category:"TV", brand:"Xiaomi",  price:85000,  processor:"Quad Core A55",   display:"55in 4K LED",            os:"Google TV", warranty:24, colors:["#111"] },

  // ── HEADPHONES ───────────────────────────────────
  { id:"PRD-040", name:"AirPods Pro 2",           category:"Headphones", brand:"Apple",     price:78000,  processor:"H2 Chip",     battery:"6h (30h case)",  warranty:12, colors:["#f0ede8"] },
  { id:"PRD-041", name:"AirPods Max",             category:"Headphones", brand:"Apple",     price:185000, processor:"H1 Chip",     battery:"20h",            warranty:12, colors:["#3b3b3b","#C0C0C0","#87ceeb","#2c7a3a"] },
  { id:"PRD-042", name:"Sony WH-1000XM5",         category:"Headphones", brand:"Sony",      price:115000, processor:"QN1+V1",      battery:"30h",            warranty:12, colors:["#111","#C0C0C0"] },
  { id:"PRD-043", name:"Sony WF-1000XM5",         category:"Headphones", brand:"Sony",      price:90000,  processor:"V2+QN2e",     battery:"8h (24h case)",  warranty:12, colors:["#111","#C0C0C0"] },
  { id:"PRD-044", name:"Bose QuietComfort Ultra", category:"Headphones", brand:"Bose",      price:135000, processor:"Custom DSP",  battery:"24h",            warranty:12, colors:["#111","#f0ede8"] },
  { id:"PRD-045", name:"Galaxy Buds3 Pro",        category:"Headphones", brand:"Samsung",   price:58000,  processor:"Exynos-based",battery:"6h (26h case)",  warranty:12, colors:["#C0C0C0","#f0ede8"] },
  { id:"PRD-046", name:"JBL Tune 770NC",          category:"Headphones", brand:"JBL",       price:25000,  processor:"Standard",    battery:"70h",            warranty:12, colors:["#111","#2244aa","#f0ede8"] },
  { id:"PRD-047", name:"JBL Live Pro 2",          category:"Headphones", brand:"JBL",       price:38000,  processor:"Standard",    battery:"10h (40h case)", warranty:12, colors:["#111","#2244aa","#c87090"] },
  { id:"PRD-048", name:"Anker Soundcore Q30",     category:"Headphones", brand:"Anker",     price:17000,  processor:"Standard",    battery:"40h",            warranty:12, colors:["#111","#2244aa"] },
  { id:"PRD-049", name:"Sennheiser Momentum 4",   category:"Headphones", brand:"Sennheiser",price:125000, processor:"Standard",    battery:"60h",            warranty:24, colors:["#111","#f0ede8"] },
  { id:"PRD-050", name:"Nothing Ear (a)",         category:"Headphones", brand:"Nothing",   price:28000,  processor:"Standard",    battery:"9.5h (42.5h)",   warranty:12, colors:["#111","#f0ede8","#f0e060"] },

  // ── TABLETS ──────────────────────────────────────
  { id:"PRD-051", name:"iPad Air M2",       category:"Tablet", brand:"Apple",   price:225000, processor:"Apple M2",    ram:"8GB", storage:"128GB", display:"11in Liquid Retina", battery:"28.93Wh", os:"iPadOS 18", warranty:12, colors:["#3b3b3b","#2244aa","#9370db","#f0ede8"] },
  { id:"PRD-052", name:"Galaxy Tab S9 FE",  category:"Tablet", brand:"Samsung", price:95000,  processor:"Exynos 1380", ram:"6GB", storage:"128GB", display:"10.9in TFT 90Hz",    battery:"8000mAh", os:"Android 14",warranty:12, colors:["#888","#7ec8b4","#C0C0C0"] },

  // ── SMARTWATCHES ─────────────────────────────────
  { id:"PRD-053", name:"Apple Watch Series 10", category:"Smartwatch", brand:"Apple",   price:145000, processor:"S10 SiP",      storage:"64GB", display:"46mm LTPO3 OLED", battery:"18h", os:"watchOS 11", warranty:12, colors:["#1c1c1e","#e8c0b8","#C0C0C0"] },
  { id:"PRD-054", name:"Galaxy Watch7",         category:"Smartwatch", brand:"Samsung", price:75000,  processor:"Exynos W1000", storage:"32GB", display:"1.5in Super AMOLED",battery:"18h",os:"Wear OS 5",  warranty:12, colors:["#2c7a3a","#f5f0dc","#C0C0C0"] },
];

// ── Derived lookup maps ──
const CATEGORIES = [...new Set(PRODUCTS_DATA.map(p => p.category))];
const BY_CATEGORY = {};
CATEGORIES.forEach(cat => { BY_CATEGORY[cat] = PRODUCTS_DATA.filter(p => p.category === cat); });

// ── Format price ──
function fmtPrice(p) {
  if (p >= 1000000) return "PKR " + (p/1000000).toFixed(1) + "M";
  if (p >= 1000)    return "PKR " + (p/1000).toFixed(0) + "K";
  return "PKR " + p;
}

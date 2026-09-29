// =====================================================
// sales-data.js — Real Sales Metrics (from Power BI)
// Revenue, Units, Rating, Discount, Stock per product
// =====================================================

const SALES_DATA = [
  // ── SMARTPHONES ──────────────────────────────────
  { name:"Galaxy A36",        category:"Smartphone", brand:"Samsung", revenue:243219450, units:3219, rating:4.61, discount:5.1,  stock:14805 },
  { name:"Galaxy A56",        category:"Smartphone", brand:"Samsung", revenue:188335410, units:2087, rating:4.55, discount:4.4,  stock:8575  },
  { name:"Galaxy S25 Ultra",  category:"Smartphone", brand:"Samsung", revenue:660902640, units:1643, rating:4.71, discount:3.9,  stock:7265  },
  { name:"Galaxy S25",        category:"Smartphone", brand:"Samsung", revenue:483193100, units:1730, rating:4.79, discount:5.4,  stock:7383  },
  { name:"Galaxy Z Flip6",    category:"Smartphone", brand:"Samsung", revenue:497206695, units:1643, rating:4.75, discount:4.7,  stock:6702  },
  { name:"iPhone 16",         category:"Smartphone", brand:"Apple",   revenue:533897085, units:2022, rating:4.81, discount:5.3,  stock:8272  },
  { name:"iPhone 16 Pro",     category:"Smartphone", brand:"Apple",   revenue:637091425, units:1688, rating:4.73, discount:4.9,  stock:6351  },
  { name:"iPhone 16 Pro Max", category:"Smartphone", brand:"Apple",   revenue:711704505, units:1657, rating:4.75, discount:4.5,  stock:7440  },
  { name:"iPhone 15",         category:"Smartphone", brand:"Apple",   revenue:477068000, units:2308, rating:4.68, discount:6.2,  stock:11683 },
  { name:"Pixel 9",           category:"Smartphone", brand:"Google",  revenue:381084345, units:1592, rating:4.69, discount:4.9,  stock:5024  },
  { name:"Xiaomi 14T",        category:"Smartphone", brand:"Xiaomi",  revenue:258749700, units:1946, rating:4.76, discount:4.9,  stock:9104  },
  { name:"Redmi Note 14 Pro", category:"Smartphone", brand:"Xiaomi",  revenue:174977275, units:2762, rating:4.53, discount:5.9,  stock:10262 },
  { name:"Infinix Note 40",   category:"Smartphone", brand:"Infinix", revenue:103311820, units:2125, rating:4.55, discount:6.0,  stock:8707  },
  { name:"Tecno Camon 30",    category:"Smartphone", brand:"Tecno",   revenue:128363870, units:2344, rating:4.60, discount:5.7,  stock:9406  },
  { name:"OnePlus 12",        category:"Smartphone", brand:"OnePlus", revenue:470000880, units:2033, rating:4.71, discount:4.0,  stock:9470  },

  // ── LAPTOPS ──────────────────────────────────────
  { name:"MacBook Air M3",        category:"Laptop", brand:"Apple",  revenue:123203130, units:419,  rating:4.72, discount:4.4, stock:2354 },
  { name:"MacBook Air M2",        category:"Laptop", brand:"Apple",  revenue:127819675, units:527,  rating:4.84, discount:4.5, stock:2489 },
  { name:"MacBook Pro 14 M4",     category:"Laptop", brand:"Apple",  revenue:517676600, units:1035, rating:4.69, discount:4.2, stock:5978 },
  { name:"Dell XPS 13",           category:"Laptop", brand:"Dell",   revenue:199722815, units:625,  rating:4.62, discount:6.5, stock:3170 },
  { name:"Dell Inspiron 15",      category:"Laptop", brand:"Dell",   revenue:59915950,  units:447,  rating:4.74, discount:6.9, stock:2524 },
  { name:"HP Pavilion 15",        category:"Laptop", brand:"HP",     revenue:50582645,  units:392,  rating:4.69, discount:3.5, stock:3438 },
  { name:"HP Spectre x360",       category:"Laptop", brand:"HP",     revenue:166946980, units:472,  rating:4.61, discount:5.8, stock:2581 },
  { name:"Lenovo ThinkPad E14",   category:"Laptop", brand:"Lenovo", revenue:90224540,  units:570,  rating:4.69, discount:4.1, stock:3837 },
  { name:"Lenovo IdeaPad Slim 5", category:"Laptop", brand:"Lenovo", revenue:50526125,  units:343,  rating:4.61, discount:4.4, stock:1971 },
  { name:"Asus ROG Zephyrus G14", category:"Laptop", brand:"Asus",   revenue:175785625, units:367,  rating:4.83, discount:7.0, stock:3396 },
  { name:"Asus Vivobook 15",      category:"Laptop", brand:"Asus",   revenue:96605395,  units:801,  rating:4.67, discount:4.1, stock:4152 },
  { name:"Acer Aspire 5",         category:"Laptop", brand:"Acer",   revenue:49023690,  units:439,  rating:4.64, discount:7.5, stock:4365 },
  { name:"MSI Katana 15",         category:"Laptop", brand:"MSI",    revenue:177275140, units:539,  rating:4.65, discount:3.5, stock:2222 },

  // ── TVs ──────────────────────────────────────────
  { name:"Samsung Crystal 4K 55in", category:"TV", brand:"Samsung", revenue:50296790,  units:456, rating:4.67, discount:4.0, stock:4347 },
  { name:"Samsung QLED Q60D 65in",  category:"TV", brand:"Samsung", revenue:92811220,  units:411, rating:4.66, discount:3.4, stock:3522 },
  { name:"Samsung Neo QLED 75in",   category:"TV", brand:"Samsung", revenue:157339155, units:269, rating:4.78, discount:3.7, stock:3245 },
  { name:"LG C4 OLED 55in",         category:"TV", brand:"LG",      revenue:124506850, units:318, rating:4.73, discount:6.1, stock:2584 },
  { name:"LG UR8050 50in",           category:"TV", brand:"LG",      revenue:41620015,  units:457, rating:4.58, discount:6.6, stock:3813 },
  { name:"Sony Bravia X75K 55in",   category:"TV", brand:"Sony",    revenue:24090170,  units:156, rating:4.51, discount:6.0, stock:1727 },
  { name:"Sony Bravia 8 OLED 65in", category:"TV", brand:"Sony",    revenue:178411540, units:238, rating:4.75, discount:3.4, stock:3071 },
  { name:"TCL C645 55in",            category:"TV", brand:"TCL",     revenue:31521495,  units:362, rating:4.52, discount:4.9, stock:2878 },
  { name:"Haier H65S80EFX 65in",    category:"TV", brand:"Haier",   revenue:33644470,  units:259, rating:4.77, discount:2.6, stock:1854 },
  { name:"Hisense A6K 50in",         category:"TV", brand:"Hisense", revenue:35430925,  units:467, rating:4.51, discount:5.0, stock:4107 },
  { name:"Xiaomi TV A Pro 55in",     category:"TV", brand:"Xiaomi",  revenue:51073745,  units:641, rating:4.58, discount:5.3, stock:5735 },

  // ── HEADPHONES ───────────────────────────────────
  { name:"AirPods Pro 2",          category:"Headphones", brand:"Apple",      revenue:153570940, units:2082, rating:4.48, discount:5.6, stock:6177 },
  { name:"AirPods Max",            category:"Headphones", brand:"Apple",      revenue:357799300, units:2061, rating:4.71, discount:5.9, stock:7272 },
  { name:"Sony WH-1000XM5",        category:"Headphones", brand:"Sony",       revenue:195613780, units:1774, rating:4.82, discount:4.8, stock:5635 },
  { name:"Sony WF-1000XM5",        category:"Headphones", brand:"Sony",       revenue:182080380, units:2162, rating:4.53, discount:5.6, stock:9589 },
  { name:"Bose QuietComfort Ultra", category:"Headphones", brand:"Bose",      revenue:145567940, units:1152, rating:4.78, discount:6.8, stock:5636 },
  { name:"Galaxy Buds3 Pro",        category:"Headphones", brand:"Samsung",   revenue:185721550, units:3360, rating:4.58, discount:5.0, stock:9615 },
  { name:"JBL Tune 770NC",          category:"Headphones", brand:"JBL",       revenue:70991905,  units:2977, rating:4.57, discount:4.4, stock:9082 },
  { name:"JBL Live Pro 2",          category:"Headphones", brand:"JBL",       revenue:89984270,  units:2529, rating:4.48, discount:6.4, stock:8386 },
  { name:"Anker Soundcore Q30",     category:"Headphones", brand:"Anker",     revenue:39565685,  units:2489, rating:4.49, discount:5.4, stock:8037 },
  { name:"Sennheiser Momentum 4",   category:"Headphones", brand:"Sennheiser",revenue:214238965, units:1806, rating:4.78, discount:4.9, stock:5511 },
  { name:"Nothing Ear (a)",         category:"Headphones", brand:"Nothing",   revenue:94858780,  units:3586, rating:4.58, discount:5.8, stock:9230 },

  // ── TABLETS ──────────────────────────────────────
  { name:"iPad Air M2",      category:"Tablet",     brand:"Apple",   revenue:119399705, units:551, rating:4.72, discount:3.9, stock:3024 },
  { name:"Galaxy Tab S9 FE", category:"Tablet",     brand:"Samsung", revenue:78942970,  units:877, rating:4.52, discount:5.9, stock:4204 },

  // ── SMARTWATCHES ─────────────────────────────────
  { name:"Apple Watch Series 10", category:"Smartwatch", brand:"Apple",   revenue:45083430, units:320, rating:4.84, discount:3.3, stock:1683 },
  { name:"Galaxy Watch7",         category:"Smartwatch", brand:"Samsung", revenue:58202700, units:805, rating:4.61, discount:4.4, stock:3544 },
];

// ── Lookups ──────────────────────────────────────────
function getSalesByCategory(cat) {
  return SALES_DATA.filter(d => !cat || cat === 'all' || d.category.toLowerCase() === cat.toLowerCase());
}
function getSalesByBrand(cat, brand) {
  return getSalesByCategory(cat).filter(d => !brand || d.brand.toLowerCase() === brand.toLowerCase());
}
function fmtRevenue(r) {
  if (r >= 1e9) return (r/1e9).toFixed(2) + 'B';
  if (r >= 1e6) return (r/1e6).toFixed(1) + 'M';
  if (r >= 1e3) return (r/1e3).toFixed(0) + 'K';
  return r.toString();
}
function fmtPKR(r) { return 'PKR ' + fmtRevenue(r); }

// ── URL Param Reader ─────────────────────────────────
function getURLParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

// ── Brand Colors ──────────────────────────────────────
const BRAND_COLORS = {
  Apple:     0xaaaaaa, Samsung: 0x1428a0, Google:  0x4285f4,
  Xiaomi:    0xff6900, Dell:    0x007db8, HP:      0x0096d6,
  Lenovo:    0xe2231a, Asus:    0x00539b, Acer:    0x83b81a,
  MSI:       0xcc0000, Sony:    0x000000, LG:      0xa50034,
  TCL:       0xe31837, Haier:   0x003087, Hisense: 0xff0000,
  Bose:      0x888888, JBL:     0xf7941d, Anker:   0x00adef,
  Sennheiser:0x009fdf, Nothing: 0x333333, OnePlus: 0xff5000,
  Infinix:   0x00b4d8, Tecno:   0x1a73e8,
};
function brandColor(brand) { return BRAND_COLORS[brand] || 0x6c63ff; }

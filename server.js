const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Jimmynougat";
const SESSION_SECRET = process.env.SESSION_SECRET || "replace-this-in-production";

const db = new Database(path.join(__dirname, "nougat.db"));
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  ingredients TEXT DEFAULT '',
  allergens TEXT DEFAULT '',
  format TEXT DEFAULT '',
  info TEXT DEFAULT '',
  image TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);
`);

const defaults = {
  companyName: "LE NOUGAT DE PROVENCE",
  tagline: "L'art du nougat, inspiré par Montélimar",
  intro: "Une collection gourmande de nougats tendres, généreux et créatifs, présentée dans un univers artisanal et contemporain.",
  story: "Au cœur de la tradition nougatière, LE NOUGAT DE PROVENCE met en avant le miel, les fruits secs et le plaisir de recettes généreuses. Cette vitrine présente les créations et leur univers, sans vente en ligne.",
  logo: ""
};
for (const [k,v] of Object.entries(defaults)) {
  db.prepare("INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)").run(k,v);
}

const seedProducts = [
  ["Nougat Fraise Tagada","Un nougat tendre et régressif aux notes de fraise.","Miel, sucre, amandes, blancs d’œufs, sirop de glucose, préparation aromatisée à la fraise.","Amandes, œufs.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1606312619070-d48b4c6528b4?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Spéculoos","Le fondant du nougat rencontre les notes biscuitées du spéculoos.","Miel, sucre, amandes, blancs d’œufs, sirop de glucose, spéculoos.","Amandes, œufs, blé (gluten).","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Caramel Beurre Salé","Une création douce et intense autour du caramel et d'une pointe de sel.","Miel, sucre, amandes, blancs d’œufs, sirop de glucose, caramel, beurre, sel.","Amandes, œufs, lait.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Bounty","Une inspiration chocolat-coco, gourmande et généreuse.","Miel, sucre, amandes, blancs d’œufs, noix de coco, chocolat.","Amandes, œufs, lait. Peut contenir du soja.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1575377427642-087cf684f04d?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Nutella","Des notes de cacao et de noisette dans un nougat tendre.","Miel, sucre, amandes, blancs d’œufs, pâte à tartiner cacao-noisette.","Amandes, œufs, noisettes, lait. Peut contenir du soja.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Pistache","Une recette élégante où la pistache apporte caractère et fraîcheur.","Miel, sucre, amandes, blancs d’œufs, pistaches, sirop de glucose.","Amandes, œufs, pistaches.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Noir","Un nougat noir au caractère affirmé, inspiré des recettes traditionnelles.","Miel, sucre, amandes, blancs d’œufs, fruits secs selon la recette.","Amandes, œufs. Autres allergènes selon la recette.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Fin","Une version fine et délicate, pensée pour une dégustation légère.","Miel, sucre, amandes, blancs d’œufs, sirop de glucose.","Amandes, œufs.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Amande Classique","Le grand classique aux amandes, au cœur de l'univers nougatier.","Miel, sucre, amandes, blancs d’œufs, sirop de glucose.","Amandes, œufs.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1606312619070-d48b4c6528b4?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Chocolat","Un nougat gourmand aux notes de cacao et de chocolat.","Miel, sucre, amandes, blancs d’œufs, cacao, chocolat.","Amandes, œufs, lait. Peut contenir du soja.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Fruits Rouges","Une recette fruitée et colorée autour des fruits rouges.","Miel, sucre, amandes, blancs d’œufs, fruits rouges, sirop de glucose.","Amandes, œufs.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=85"],
  ["Nougat Café","Une création aux notes de café torréfié, équilibrée par la douceur du nougat.","Miel, sucre, amandes, blancs d’œufs, café.","Amandes, œufs.","Format à définir","Composition indicative : à vérifier avec la recette et l’étiquetage réels.","https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85"]
];

if (db.prepare("SELECT COUNT(*) c FROM products").get().c === 0) {
  const insert = db.prepare(`INSERT INTO products
    (name,description,ingredients,allergens,format,info,image,sort_order)
    VALUES (?,?,?,?,?,?,?,?)`);
  const tx = db.transaction(items => items.forEach((p,i) => insert.run(...p,i)));
  tx(seedProducts);
}

app.use(express.json({limit:"3mb"}));
app.use(express.urlencoded({extended:true}));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  }
}));

const uploadDir = path.join(__dirname, "public", "uploads");
fs.mkdirSync(uploadDir, {recursive:true});
const upload = multer({dest: uploadDir});

function adminOnly(req,res,next) {
  if (req.session.admin === true) return next();
  res.status(401).json({error:"Non authentifié"});
}

app.get("/api/catalogue", (req,res) => {
  const settings = Object.fromEntries(db.prepare("SELECT key,value FROM settings").all().map(x=>[x.key,x.value]));
  const products = db.prepare("SELECT * FROM products ORDER BY sort_order ASC,id ASC").all();
  res.json({settings,products});
});

app.post("/api/login", (req,res) => {
  if (typeof req.body.password === "string" && req.body.password === ADMIN_PASSWORD) {
    req.session.admin = true;
    return res.json({ok:true});
  }
  res.status(401).json({error:"Mot de passe incorrect"});
});

app.get("/api/admin/me", (req,res) => res.json({authenticated:req.session.admin === true}));
app.post("/api/logout", adminOnly, (req,res) => req.session.destroy(()=>res.json({ok:true})));

app.put("/api/admin/settings", adminOnly, (req,res) => {
  const allowed = ["companyName","tagline","intro","story","logo"];
  const stmt = db.prepare(`INSERT INTO settings(key,value) VALUES(?,?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value`);
  const tx = db.transaction(body => allowed.forEach(k => {
    if (body[k] !== undefined) stmt.run(k, String(body[k]));
  }));
  tx(req.body);
  res.json({ok:true});
});

app.post("/api/admin/upload", adminOnly, upload.single("image"), (req,res) => {
  if (!req.file) return res.status(400).json({error:"Aucune image"});
  const ext = path.extname(req.file.originalname).toLowerCase() || ".jpg";
  const finalName = req.file.filename + ext;
  fs.renameSync(req.file.path, path.join(uploadDir, finalName));
  res.json({url:"/uploads/"+finalName});
});

app.post("/api/admin/products", adminOnly, (req,res) => {
  const p = req.body;
  const r = db.prepare(`INSERT INTO products
    (name,description,ingredients,allergens,format,info,image,sort_order)
    VALUES (?,?,?,?,?,?,?,?)`)
    .run(p.name||"Nouveau nougat",p.description||"",p.ingredients||"",p.allergens||"",
      p.format||"",p.info||"",p.image||"",Number(p.sort_order)||0);
  res.json({ok:true,id:r.lastInsertRowid});
});

app.put("/api/admin/products/:id", adminOnly, (req,res) => {
  const p = req.body;
  db.prepare(`UPDATE products SET name=?,description=?,ingredients=?,allergens=?,
    format=?,info=?,image=?,sort_order=? WHERE id=?`)
    .run(p.name||"",p.description||"",p.ingredients||"",p.allergens||"",
      p.format||"",p.info||"",p.image||"",Number(p.sort_order)||0,req.params.id);
  res.json({ok:true});
});

app.delete("/api/admin/products/:id", adminOnly, (req,res) => {
  db.prepare("DELETE FROM products WHERE id=?").run(req.params.id);
  res.json({ok:true});
});

app.get("/admin", (req,res) => res.sendFile(path.join(__dirname,"public","admin.html")));
app.use(express.static(path.join(__dirname,"public")));

app.listen(PORT, () => console.log(`Nougat de Provence: http://localhost:${PORT}`));

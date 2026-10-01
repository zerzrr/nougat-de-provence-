let products=[];
const $=s=>document.querySelector(s);
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
async function load(){
 const r=await fetch("/api/catalogue"); const d=await r.json(); products=d.products;
 render(products);
}
function render(list){
 $("#count").textContent=`${list.length} créations`;
 $("#catalogue").innerHTML=list.map(p=>`
 <article class="product show" id="p-${p.id}" data-id="${p.id}">
  <img src="${esc(p.image)}" alt="${esc(p.name)}">
  <div class="product-body"><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p></div>
 </article>`).join("");
 document.querySelectorAll(".product").forEach(el=>el.addEventListener("click",()=>openProduct(+el.dataset.id)));
}
function openProduct(id){
 const p=products.find(x=>x.id===id); if(!p)return;
 $("#modalBody").innerHTML=`<img src="${esc(p.image)}" alt="${esc(p.name)}"><div class="modal-content">
 <p class="eyebrow">COLLECTION</p><h2>${esc(p.name)}</h2><p>${esc(p.description)}</p>
 <h4>INGRÉDIENTS</h4><p>${esc(p.ingredients)}</p>
 <h4>ALLERGÈNES</h4><p>${esc(p.allergens)}</p>
 <h4>FORMAT</h4><p>${esc(p.format)}</p>
 <h4>INFORMATIONS</h4><p>${esc(p.info)}</p>
 </div>`;
 $("#modal").classList.add("open");
}
$(".close").addEventListener("click",()=>$("#modal").classList.remove("open"));
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")$("#modal").classList.remove("open")});
$("#search").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase().trim();
 render(products.filter(p=>(p.name+" "+p.description).toLowerCase().includes(q)));
});
document.querySelector(".menu-btn")?.addEventListener("click",()=>document.querySelector(".nav").classList.toggle("open"));
load();

const $=s=>document.querySelector(s);
async function load(){
  const r=await fetch("/api/catalogue"); const d=await r.json();
  $("#brandName").textContent=d.settings.companyName;
  $("#intro").textContent=d.settings.intro;
  $("#story").textContent=d.settings.story;
  const featured=d.products.slice(0,7);
  $("#featured").innerHTML=featured.map(p=>`<a class="slider-card" href="/catalogue.html#p-${p.id}"><img src="${p.image}" alt="${esc(p.name)}"><h3>${esc(p.name)}</h3></a>`).join("");
  initReveal();
}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function initReveal(){const els=document.querySelectorAll(".reveal");const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});els.forEach(e=>io.observe(e))}
document.querySelector(".menu-btn")?.addEventListener("click",()=>document.querySelector(".nav").classList.toggle("open"));
window.addEventListener("load",load);

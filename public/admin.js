let data=null;
const $=s=>document.querySelector(s);
async function api(url,opt={}){const r=await fetch(url,{headers:{"Content-Type":"application/json",...(opt.headers||{})},...opt});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Erreur");return d}
async function boot(){
 const me=await api("/api/admin/me"); if(me.authenticated) showPanel();
}
function showPanel(){ $("#login").hidden=true; $("#panel").hidden=false; loadData(); }
async function loadData(){
 data=await api("/api/catalogue");
 $("#sName").value=data.settings.companyName||"";
 $("#sTagline").value=data.settings.tagline||"";
 $("#sIntro").value=data.settings.intro||"";
 $("#sStory").value=data.settings.story||"";
 $("#sLogo").value=data.settings.logo||"";
 renderProducts();
}
function renderProducts(){
 $("#products").innerHTML=data.products.map(p=>`
 <div class="admin-product">
  <img src="${p.image||"https://placehold.co/100x100?text=Nougat"}">
  <div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="admin-product-actions">
   <button class="btn small edit" data-id="${p.id}">Modifier</button>
   <button class="btn small danger del" data-id="${p.id}">Supprimer</button>
  </div></div>
 </div>`).join("");
 document.querySelectorAll(".edit").forEach(b=>b.onclick=()=>edit(+b.dataset.id));
 document.querySelectorAll(".del").forEach(b=>b.onclick=()=>del(+b.dataset.id));
}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function edit(id){
 const p=data.products.find(x=>x.id===id); if(!p)return;
 const name=prompt("Nom du nougat",p.name); if(name===null)return;
 const description=prompt("Description",p.description); if(description===null)return;
 const ingredients=prompt("Ingrédients",p.ingredients); if(ingredients===null)return;
 const allergens=prompt("Allergènes",p.allergens); if(allergens===null)return;
 const format=prompt("Poids / format",p.format); if(format===null)return;
 const info=prompt("Informations",p.info); if(info===null)return;
 const image=prompt("URL de la photo",p.image); if(image===null)return;
 api("/api/admin/products/"+id,{method:"PUT",body:JSON.stringify({...p,name,description,ingredients,allergens,format,info,image})}).then(loadData);
}
function del(id){if(confirm("Supprimer ce nougat ?"))api("/api/admin/products/"+id,{method:"DELETE"}).then(loadData)}
$("#loginBtn").onclick=async()=>{try{await api("/api/login",{method:"POST",body:JSON.stringify({password:$("#password").value})});showPanel()}catch(e){$("#loginError").textContent=e.message}};
$("#logout").onclick=async()=>{await api("/api/logout",{method:"POST"});location.reload()};
$("#saveSettings").onclick=async()=>{
 await api("/api/admin/settings",{method:"PUT",body:JSON.stringify({companyName:$("#sName").value,tagline:$("#sTagline").value,intro:$("#sIntro").value,story:$("#sStory").value,logo:$("#sLogo").value})});
 alert("Présentation enregistrée.");
};
$("#add").onclick=async()=>{
 const name=prompt("Nom du nouveau nougat"); if(!name)return;
 await api("/api/admin/products",{method:"POST",body:JSON.stringify({name,description:"",ingredients:"",allergens:"",format:"",info:"",image:"https://placehold.co/800x800?text=Nougat"})});
 loadData();
};
$("#password").addEventListener("keydown",e=>{if(e.key==="Enter")$("#loginBtn").click()});
boot();

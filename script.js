import {
  db,
  ref,
  get,
  child
} from "./firebase/config.js";

const searchBtn =
document.getElementById(
"searchBtn"
);

const input =
document.getElementById(
"searchInput"
);

const result =
document.getElementById(
"result"
);

const loading =
document.getElementById(
"loading"
);

const promoModal =
document.getElementById(
"promoModal"
);

const closePromo =
document.getElementById(
"closePromo"
);

// CLOSE PROMO
if(closePromo){

closePromo.addEventListener(
"click",
()=>{

promoModal.classList.add(
"hidden"
);

});

}

async function findBot(){

const keyword =
input.value
.trim()
.toLowerCase();

if(!keyword){

alert(
"Masukkan Username / IGG ID"
);

return;

}

// RESET RESULT
result.innerHTML = "";

// SHOW LOADING
loading.classList.remove(
"hidden"
);

try{

const snapshot =
await get(
child(
ref(db),
"bots"
)
);

loading.classList.add(
"hidden"
);

if(
!snapshot.exists()
){

result.innerHTML = `
<div class="notfound">
❌ Database kosong
</div>
`;

return;

}

const data =
snapshot.val();

let found = null;

// LOOP DATA
Object.keys(data)
.forEach(key=>{

const bot =
data[key];

if(

bot.username
?.toLowerCase()
=== keyword ||

bot.iggid
?.toString()
.toLowerCase()
=== keyword

){

found = bot;

}

});

// SHOW BOT
if(found){

const isActive =
found.status
?.toLowerCase()
=== "aktif";

// PROMO MUNCUL
if(promoModal){

promoModal.classList.remove(
"hidden"
);

setTimeout(()=>{

promoModal.classList.add(
"hidden"
);

},5000);

}

result.innerHTML = `
<div class="card">

<div class="card-title">
⚔️ BOT DATA FOUND
</div>

<div class="row">
<span class="label">
👤 Customer
</span>

<span>
${found.customer}
</span>
</div>

<div class="row">
<span class="label">
🤖 Username
</span>

<span>
${found.username}
</span>
</div>

<div class="row">
<span class="label">
🆔 IGG ID
</span>

<span>
${found.iggid}
</span>
</div>

<div class="row">
<span class="label">
🖥️ Server
</span>

<span>
${found.server}
</span>
</div>

<div class="row">
<span class="label">
📅 Expired
</span>

<span>
${found.expired}
</span>
</div>

<div class="row">
<span class="label">
📊 Status
</span>

<span class="
status
${isActive
? "active"
: "inactive"
}">
${found.status}
</span>

</div>

</div>
`;

}else{

result.innerHTML = `
<div class="notfound">
❌ Data bot tidak ditemukan
</div>
`;

}

}catch(err){

console.error(err);

loading.classList.add(
"hidden"
);

result.innerHTML = `
<div class="notfound">
❌ Error mengambil data
</div>
`;

}

}

searchBtn.addEventListener(
"click",
findBot
);

input.addEventListener(
"keypress",
(e)=>{

if(
e.key === "Enter"
){

findBot();

}

});
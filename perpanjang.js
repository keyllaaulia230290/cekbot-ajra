import {
  db,
  ref,
  push,
  set,
  get
} from "./firebase/config.js";

const checkBotBtn =
document.getElementById(
"checkBotBtn"
);

const botPreview =
document.getElementById(
"botPreview"
);


const paketBtns =
document.querySelectorAll(".paket");

let selectedPrice = 0;
let selectedPackage = "";

// PILIH PAKET
paketBtns.forEach(btn => {

  btn.addEventListener(
    "click",
    () => {

      paketBtns.forEach(b => {
        b.classList.remove("active");
      });

      btn.classList.add("active");

      selectedPrice =
      Number(btn.dataset.price);

      selectedPackage =
      btn.dataset.package;

      updateTotal();

    }
  );

});

// UPDATE TOTAL
function updateTotal(){

  document.getElementById(
    "invoicePaket"
  ).innerText =
  selectedPackage ||
  "Belum Dipilih";

  document.getElementById(
    "invoiceHarga"
  ).innerText =
  "Rp" +
  selectedPrice.toLocaleString(
    "id-ID"
  );

  document.getElementById(
    "totalHarga"
  ).innerText =
  "Rp" +
  selectedPrice.toLocaleString(
    "id-ID"
  );

}

// BUAT PESANAN
document
.getElementById("orderBtn")
.addEventListener(
"click",
async()=>{

  const username =
  document
  .getElementById("username")
  .value
  .trim();

  const whatsapp =
  document
  .getElementById("whatsapp")
  .value
  .trim();

  const promo =
  document
  .getElementById("promo")
  .value
  .trim();

  const orderBtn =
  document.getElementById(
    "orderBtn"
  );

  if(!username){

    showToast(
      "Masukkan Username / IGG ID"
    );

    return;

  }

  if(!selectedPackage){

    showToast(
      "Pilih paket terlebih dahulu"
    );

    return;

  }

  if(!whatsapp){

    showToast(
      "Masukkan nomor WhatsApp"
    );

    return;

  }

  if(
    whatsapp.length < 10
  ){

    showToast(
      "Nomor WhatsApp tidak valid"
    );

    return;

  }

  try{

    orderBtn.disabled = true;

    orderBtn.innerHTML =
    "⏳ Membuat Pesanan...";

    const orderRef =
    push(
      ref(
        db,
        "orders"
      )
    );

    await set(
      orderRef,
      {

        username,

        whatsapp,

        promo,

        paket:
        selectedPackage,

        harga:
        selectedPrice,

        payment:
        "QRIS",

        status:
        "PENDING",

        createdAt:
        Date.now()

      }
    );

    showToast(
      "Pesanan berhasil dibuat",
      "success"
    );

    document
    .getElementById("username")
    .value = "";

    document
    .getElementById("whatsapp")
    .value = "";

    document
    .getElementById("promo")
    .value = "";

const message =
encodeURIComponent(

`Halo Admin AJRA

Saya sudah melakukan pembayaran untuk perpanjangan bot.

Berikut detail pesanan saya:

Username : ${username}
Paket : ${selectedPackage}
Harga : Rp${selectedPrice.toLocaleString("id-ID")}
WhatsApp : ${whatsapp}

Mohon Dicek 🙏`

);

localStorage.setItem(
"lastOrder",
JSON.stringify({
username,
paket:selectedPackage,
harga:selectedPrice
})
);

window.location.href =
"invoice.html";

  }catch(err){

    console.error(err);

    showToast(
      "Gagal membuat pesanan",
      "error"
    );

  }finally{

    orderBtn.disabled = false;

    orderBtn.innerHTML =
    "🚀 Buat Pesanan";

  }

});

// TOAST
function showToast(
  message,
  type = "error"
){

  const toast =
  document.getElementById(
    "toast"
  );

  toast.innerText =
  message;

  toast.className =
  `toast show ${type}`;

  setTimeout(()=>{

    toast.className =
    "toast";

  },3000);

}
checkBotBtn.addEventListener(
"click",
async()=>{

const username =
document
.getElementById("username")
.value
.trim()
.toLowerCase();

if(!username){

showToast(
"Masukkan Username Bot"
);

return;

}

try{

const snapshot =
await get(
ref(
db,
"bots"
)
);

const bots =
snapshot.val() || {};

let found = null;

Object.keys(bots)
.forEach(key=>{

const bot =
bots[key];

if(

bot.username
?.toLowerCase()
=== username

){

found = bot;

}

});

if(!found){

botPreview.innerHTML = `
<div class="bot-notfound">
❌ Username tidak ditemukan
</div>
`;

return;

}

botPreview.innerHTML = `

<div class="bot-found">

<div>
👤 Customer :
<b>${found.customer}</b>
</div>

<div>
🤖 Username :
<b>${found.username}</b>
</div>

<div>
🆔 IGG ID :
<b>${found.iggid}</b>
</div>

<div>
📅 Expired :
<b>${found.expired}</b>
</div>

<div>
📊 Status :
<b>${found.status}</b>
</div>

</div>

`;

}catch(err){

console.error(err);

showToast(
"Gagal mengambil data bot"
);

}

});


const paymentBtns =
document.querySelectorAll(".payment-card");

let selectedPayment = "";

paymentBtns.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

paymentBtns.forEach(b=>{

b.classList.remove("active");

});

btn.classList.add("active");

selectedPayment =
btn.dataset.payment;

});

});


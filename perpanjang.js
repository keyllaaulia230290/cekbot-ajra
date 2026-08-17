import { db, ref, push, set, get } from "./firebase/config.js";

const params = new URLSearchParams(window.location.search);

const referralCode = params.get("ref");

let affiliateDiscount = 0;
let referralValid = false;

let selectedPrice = 0;
let selectedPackage = "";
let selectedQuantity = 1;
let selectedPayment = "QRIS";

const packageCards = document.querySelectorAll(".package");
const paymentCards = document.querySelectorAll(".payment-card");

const promoInput = document.getElementById("promo");

const checkBotBtn = document.getElementById("checkBotBtn");
const botPreview = document.getElementById("botPreview");

// ========================================
// CEK REFERRAL
// ========================================

if (referralCode) {
  try {
    const snap = await get(ref(db, "affiliates"));

    if (snap.exists()) {
      const affiliates = snap.val();

      Object.values(affiliates).forEach((item) => {
        if (item.referralCode === referralCode) {
          referralValid = true;
        }
      });
    }
  } catch (err) {
    console.error("Gagal cek referral:", err);
  }
}

// ========================================
// PILIH PAKET
// ========================================

function selectPackage(card) {
  packageCards.forEach((c) => {
    c.classList.remove("active");
  });

  card.classList.add("active");

  selectedPackage = card.dataset.package;

  selectedQuantity = Number(card.dataset.quantity || 1);

  const hargaSatuan = Number(card.dataset.price || 0);

  selectedPrice = hargaSatuan * selectedQuantity;

  updateTotal();
}

// ========================================
// QUANTITY
// ========================================

packageCards.forEach((card) => {
  const plusBtn = card.querySelector(".plus");

  const minusBtn = card.querySelector(".minus");

  const quantityElement = card.querySelector(".quantity");

  const subtotalElement = card.querySelector(".subtotal");

  const hargaSatuan = Number(card.dataset.price || 0);

  // Klik kartu
  card.addEventListener("click", (e) => {
    if (e.target.closest(".qty-btn")) {
      return;
    }

    selectPackage(card);
  });

  // PLUS
  if (plusBtn) {
    plusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (card.dataset.package === "Permanent") {
        return;
      }

      let quantity = Number(card.dataset.quantity || 1);

      quantity++;

      card.dataset.quantity = quantity;

      quantityElement.innerText = quantity;

      subtotalElement.innerText =
        "Rp" + (hargaSatuan * quantity).toLocaleString("id-ID");

      selectPackage(card);
    });
  }

  // MINUS
  if (minusBtn) {
    minusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      let quantity = Number(card.dataset.quantity || 1);

      if (quantity <= 1) {
        return;
      }

      quantity--;

      card.dataset.quantity = quantity;

      quantityElement.innerText = quantity;

      subtotalElement.innerText =
        "Rp" + (hargaSatuan * quantity).toLocaleString("id-ID");

      selectPackage(card);
    });
  }
});

// ========================================
// PAYMENT
// ========================================

paymentCards.forEach((card) => {
  card.addEventListener("click", () => {
    paymentCards.forEach((c) => {
      c.classList.remove("active");
    });

    card.classList.add("active");

    selectedPayment = card.dataset.payment || "QRIS";
  });
});

// ========================================
// PROMO
// ========================================

promoInput.addEventListener("input", updateTotal);

// ========================================
// UPDATE TOTAL
// ========================================

function updateTotal() {
  let finalPrice = selectedPrice;

  let quantityDiscount = 0;

  let promoDiscount = 0;

  affiliateDiscount = 0;

  // DISKON QUANTITY
  if (selectedPackage === "1 Bulan") {
    if (selectedQuantity >= 5) {
      quantityDiscount = Math.floor(finalPrice * 0.1);
    } else if (selectedQuantity >= 2) {
      quantityDiscount = Math.floor(finalPrice * 0.05);
    }

    finalPrice -= quantityDiscount;
  }

  // PROMO
  const promo = promoInput.value.trim().toUpperCase();

  if (promo === "HAPPYJULY") {
    promoDiscount = Math.floor(finalPrice * 0.1);

    finalPrice -= promoDiscount;
  }

  // AFFILIATE
  if (referralValid) {
    affiliateDiscount = Math.floor(finalPrice * 0.05);

    finalPrice -= affiliateDiscount;
  }

  // INVOICE
  document.getElementById("invoicePaket").innerText = selectedPackage
    ? selectedPackage + " × " + selectedQuantity
    : "Belum Dipilih";

  document.getElementById("invoiceHargaSatuan").innerText =
    "Rp" +
    (selectedPackage
      ? Number(document.querySelector(".package.active")?.dataset.price || 0)
      : 0
    ).toLocaleString("id-ID");

  document.getElementById("invoiceQuantity").innerText = selectedQuantity;

  document.getElementById("invoiceSubtotal").innerText =
    "Rp" + selectedPrice.toLocaleString("id-ID");

  document.getElementById("quantityDiscount").innerText =
    "-Rp" + quantityDiscount.toLocaleString("id-ID");

  document.getElementById("promoDiscount").innerText =
    "-Rp" + promoDiscount.toLocaleString("id-ID");

  document.getElementById("affiliateDiscount").innerText =
    "-Rp" + affiliateDiscount.toLocaleString("id-ID");

  document.getElementById("totalHarga").innerText =
    "Rp" + finalPrice.toLocaleString("id-ID");
}

// ========================================
// BUAT PESANAN
// ========================================

const orderBtn = document.getElementById("orderBtn");

orderBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();

  const whatsapp = document.getElementById("whatsapp").value.trim();

  if (!username) {
    showToast("Masukkan Username Bot");

    return;
  }

  if (!selectedPackage) {
    showToast("Pilih paket terlebih dahulu");

    return;
  }

  if (!whatsapp) {
    showToast("Masukkan nomor WhatsApp");

    return;
  }

  if (whatsapp.length < 10) {
    showToast("Nomor WhatsApp tidak valid");

    return;
  }

  // HITUNG ULANG
  let finalPrice = selectedPrice;

  let quantityDiscount = 0;

  let promoDiscount = 0;

  const promo = promoInput.value.trim().toUpperCase();

  // DISKON QUANTITY
  if (selectedPackage === "1 Bulan") {
    if (selectedQuantity >= 5) {
      quantityDiscount = Math.floor(finalPrice * 0.1);
    } else if (selectedQuantity >= 2) {
      quantityDiscount = Math.floor(finalPrice * 0.05);
    }

    finalPrice -= quantityDiscount;
  }

  // PROMO
  if (promo === "HAPPYJULY") {
    promoDiscount = Math.floor(finalPrice * 0.1);

    finalPrice -= promoDiscount;
  }

  // AFFILIATE
  affiliateDiscount = 0;

  if (referralValid) {
    affiliateDiscount = Math.floor(finalPrice * 0.05);

    finalPrice -= affiliateDiscount;
  }

  orderBtn.disabled = true;

  orderBtn.innerHTML = "⏳ Membuat Pesanan...";

  try {
    // FIREBASE
    const orderRef = push(ref(db, "orders"));

    const hargaSatuan = Number(
      document.querySelector(".package.active")?.dataset.price || 0,
    );

    await set(orderRef, {
      username,

      whatsapp,

      paket: selectedPackage,

      quantity: selectedQuantity,

      hargaSatuan,

      subtotal: selectedPrice,

      diskonQuantity: quantityDiscount,

      promo,

      diskonPromo: promoDiscount,

      diskonAffiliate: affiliateDiscount,

      total: finalPrice,

      payment: selectedPayment,

      referralCode: referralValid ? referralCode : null,

      status: "PENDING",

      createdAt: Date.now(),
    });

    // WHATSAPP
    const message = encodeURIComponent(
      `Halo Admin AJRA 👋

Saya ingin memperpanjang Bot AJRA.

━━━━━━━━━━━━━━━━━━
🤖 DATA BOT
━━━━━━━━━━━━━━━━━━

Username :
${username}

WhatsApp :
${whatsapp}

━━━━━━━━━━━━━━━━━━
💰 PEMBAYARAN
━━━━━━━━━━━━━━━━━━

Paket :
${selectedPackage}

Quantity :
${selectedQuantity}

Harga Satuan :
Rp${hargaSatuan.toLocaleString("id-ID")}

Subtotal :
Rp${selectedPrice.toLocaleString("id-ID")}

Diskon Quantity :
-Rp${quantityDiscount.toLocaleString("id-ID")}

Promo :
${promo || "-"}

Diskon Promo :
-Rp${promoDiscount.toLocaleString("id-ID")}

Diskon Affiliate :
-Rp${affiliateDiscount.toLocaleString("id-ID")}

TOTAL :
Rp${finalPrice.toLocaleString("id-ID")}

Metode :
${selectedPayment}

Referral :
${referralValid ? referralCode : "-"}

Terima kasih 🙏`,
    );

    // DATA UNTUK INVOICE
    localStorage.setItem(
      "lastOrder",
      JSON.stringify({
        username,

        paket: selectedPackage,

        quantity: selectedQuantity,

        hargaSatuan,

        subtotal: selectedPrice,

        diskonQuantity: quantityDiscount,

        diskonPromo: promoDiscount,

        diskonAffiliate: affiliateDiscount,

        harga: finalPrice,
      }),
    );

    window.open("https://wa.me/6285885385659?text=" + message, "_blank");

    window.location.href = "invoice.html";
  } catch (err) {
    console.error(err);

    showToast("Gagal membuat pesanan", "error");
  } finally {
    orderBtn.disabled = false;

    orderBtn.innerHTML = "🚀 Buat Pesanan";
  }
});

// ========================================
// CEK BOT
// ========================================

checkBotBtn.addEventListener("click", async () => {
  const username = document
    .getElementById("username")
    .value.trim()
    .toLowerCase();

  if (!username) {
    showToast("Masukkan Username Bot");

    return;
  }

  try {
    const snapshot = await get(ref(db, "bots"));

    const bots = snapshot.val() || {};

    let found = null;

    Object.keys(bots).forEach((key) => {
      const bot = bots[key];

      if (bot.username?.toLowerCase() === username) {
        found = bot;
      }
    });

    if (!found) {
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
            <b>
              ${found.customer || "-"}
            </b>
          </div>

          <div>
            🤖 Username :
            <b>
              ${found.username || "-"}
            </b>
          </div>

          <div>
            🆔 IGG ID :
            <b>
              ${found.iggid || "-"}
            </b>
          </div>

          <div>
            📅 Expired :
            <b>
              ${found.expired || "-"}
            </b>
          </div>

          <div>
            📊 Status :
            <b>
              ${found.status || "-"}
            </b>
          </div>

        </div>

      `;
  } catch (err) {
    console.error(err);

    showToast("Gagal mengambil data bot");
  }
});

// ========================================
// TOAST
// ========================================

function showToast(message, type = "error") {
  const toast = document.getElementById("toast");

  toast.innerText = message;

  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

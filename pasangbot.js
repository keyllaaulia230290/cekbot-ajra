import { db, ref, push, set, get } from "./firebase/config.js";

const params = new URLSearchParams(window.location.search);

const referralCode = params.get("ref");

let affiliateDiscount = 0;

const packageCards = document.querySelectorAll(".package");

let selectedPrice = 0;
let selectedPackage = "";
let selectedQuantity = 1;
let selectedPayment = "QRIS";

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

  // Tombol +
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

      quantityElement.textContent = quantity;

      subtotalElement.textContent =
        "Rp" + (hargaSatuan * quantity).toLocaleString("id-ID");

      selectPackage(card);
    });
  }

  // Tombol -
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

      quantityElement.textContent = quantity;

      subtotalElement.textContent =
        "Rp" + (hargaSatuan * quantity).toLocaleString("id-ID");

      selectPackage(card);
    });
  }
});

paymentCards.forEach((card) => {
  card.addEventListener("click", () => {
    paymentCards.forEach((c) => {
      c.classList.remove("active");
    });

    card.classList.add("active");

    selectedPayment = card.dataset.payment;
  });
});

promoInput.addEventListener("input", updateTotal);

function updateTotal() {
  let finalPrice = selectedPrice;

  let promoDiscount = 0;

  affiliateDiscount = 0;

  const promo = promoInput.value.trim().toUpperCase();

  // Diskon quantity
  let quantityDiscount = 0;

  if (selectedQuantity >= 5 && selectedPackage === "1 Bulan") {
    quantityDiscount = Math.floor(finalPrice * 0.1);
    finalPrice -= quantityDiscount;
  } else if (selectedQuantity >= 2 && selectedPackage === "1 Bulan") {
    quantityDiscount = Math.floor(finalPrice * 0.05);
    finalPrice -= quantityDiscount;
  }

  // Promo
  if (promo === "HAPPYJULY") {
    promoDiscount = Math.floor(finalPrice * 0.1);
    finalPrice -= promoDiscount;
  }

  // Affiliate
  if (referralCode) {
    affiliateDiscount = Math.floor(finalPrice * 0.05);
    finalPrice -= affiliateDiscount;
  }

  const invoicePaket = document.getElementById("invoicePaket");
  const invoiceHarga = document.getElementById("invoiceHarga");
  const promoDiscountElement = document.getElementById("promoDiscount");
  const affiliateDiscountElement = document.getElementById("affiliateDiscount");
  const totalHarga = document.getElementById("totalHarga");

  invoicePaket.innerText = selectedPackage
    ? `${selectedPackage} × ${selectedQuantity}`
    : "Belum Dipilih";

  invoiceHarga.innerText = "Rp" + selectedPrice.toLocaleString("id-ID");

  promoDiscountElement.innerText =
    "-Rp" + (promoDiscount + quantityDiscount).toLocaleString("id-ID");

  affiliateDiscountElement.innerText =
    "-Rp" + affiliateDiscount.toLocaleString("id-ID");

  totalHarga.innerText = "Rp" + finalPrice.toLocaleString("id-ID");
}

const orderBtn = document.getElementById("orderBtn");

orderBtn.addEventListener("click", async () => {
  const nickname = document.getElementById("nickname").value.trim();

  const adminNick = document.getElementById("adminNick").value.trim();

  const mode = document.getElementById("mode").value;

  const relogin = document.getElementById("relogin").value.trim();

  const rss = document.getElementById("rss").value;

  const slot = document.getElementById("slot").value.trim();

  const darknest = document.getElementById("darknest").value.trim();

  const darkness = document.getElementById("darkness").value;

  const troop = document.getElementById("troop").value.trim();

  const heal = document.getElementById("heal").value;

  const research = document.getElementById("research").value.trim();

  const building = document.getElementById("building").value.trim();

  const monster = document.getElementById("monster").value.trim();

  const code = document.getElementById("code").value.trim();

  const pact = document.getElementById("pact").value.trim();

  const stage = document.getElementById("stage").value;

  const shield = document.getElementById("shield").value;

  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value.trim();

  const whatsapp = document.getElementById("whatsapp").value.trim();

  if (!nickname) {
    alert("Isi Nickname Akun");

    return;
  }

  if (!adminNick) {
    alert("Isi Nick Admin");

    return;
  }

  if (!email) {
    alert("Isi Email Login");

    return;
  }

  if (!password) {
    alert("Isi Password");

    return;
  }

  if (!whatsapp) {
    alert("Isi WhatsApp");

    return;
  }

  if (selectedPackage === "") {
    alert("Pilih Paket");

    return;
  }

  let finalPrice = selectedPrice;

  let promoDiscount = 0;

  const promo = promoInput.value.trim().toUpperCase();

  if (promo === "HAPPYJULY") {
    promoDiscount = Math.floor(finalPrice * 0.1);

    finalPrice -= promoDiscount;
  }

  if (referralCode) {
    affiliateDiscount = Math.floor(finalPrice * 0.05);

    finalPrice -= affiliateDiscount;
  }

  orderBtn.disabled = true;

  orderBtn.innerHTML = "⏳ Membuat Pesanan...";

  try {
    const orderRef = push(ref(db, "ordersBot"));

    await set(orderRef, {
      nickname,

      adminNick,

      mode,

      relogin,

      rss,

      slot,

      darknest,

      darkness,

      troop,

      heal,

      research,

      building,

      monster,

      code,

      pact,

      stage,

      shield,

      email,

      password,

      whatsapp,

      paket: selectedPackage,

      quantity: selectedQuantity,

      hargaSatuan: Number(
        document.querySelector(`.package.active`)?.dataset.price || 0,
      ),

      harga: selectedPrice,

      promo,

      diskonPromo: promoDiscount,

      diskonAffiliate: affiliateDiscount,

      total: finalPrice,

      payment: selectedPayment,

      referralCode: referralCode || null,

      status: "PENDING",

      createdAt: Date.now(),
    });

    const message = encodeURIComponent(`Halo Admin AJRA 👋

Saya ingin memasang Bot Bank AJRA.

━━━━━━━━━━━━━━━━━━
📋 PENGATURAN BOT
━━━━━━━━━━━━━━━━━━

• Nickname Akun : ${nickname}
• Nick Admin : ${adminNick}
• Mode Bot : ${mode}
• Waktu Relogin : ${relogin}
• Tipe Nambang : ${rss}
• Jumlah Slot Nambang : ${slot}
• Join Darknest Level : ${darknest}
• Darkness : ${darkness}
• Latih Pasukan : ${troop}
• Auto Heal : ${heal}
• Riset : ${research}
• Upgrade Bangunan : ${building}
• Kill Monster : ${monster}
• Kode Bot : ${code}
• Familiar Pact : ${pact}
• Stage Hero : ${stage}
• Auto Shield : ${shield}

━━━━━━━━━━━━━━━━━━
🔐 DATA LOGIN
━━━━━━━━━━━━━━━━━━

• Email : ${email}
• Password : ${password}

━━━━━━━━━━━━━━━━━━
💰 PEMBAYARAN
━━━━━━━━━━━━━━━━━━

Paket : ${selectedPackage}

Quantity : ${selectedQuantity}

Harga Satuan :
Rp${Number(
      document.querySelector(".package.active")?.dataset.price || 0,
    ).toLocaleString("id-ID")}

Subtotal :
Rp${selectedPrice.toLocaleString("id-ID")}

Promo : ${promo || "-"}

Diskon Promo :
Rp${promoDiscount.toLocaleString("id-ID")}

Diskon Affiliate :
Rp${affiliateDiscount.toLocaleString("id-ID")}

TOTAL :
Rp${finalPrice.toLocaleString("id-ID")}

Metode :
${selectedPayment}

Referral :
${referralCode || "-"}

Terima kasih 🙏`);

    localStorage.setItem(
      "lastOrder",
      JSON.stringify({
        username: nickname,

        paket: selectedPackage,

        harga: finalPrice,
      }),
    );

    window.open(
      "https://wa.me/6285885385659?text=" + message,

      "_blank",
    );

    window.location.href = "invoice.html";
  } catch (err) {
    console.error(err);

    alert("Gagal membuat pesanan.");
  } finally {
    orderBtn.disabled = false;

    orderBtn.innerHTML = "🚀 Pasang Bot Sekarang";
  }
});

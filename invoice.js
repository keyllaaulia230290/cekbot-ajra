const data = JSON.parse(localStorage.getItem("lastOrder"));

const invoiceCard = document.getElementById("invoiceCard");

if (!data) {
  invoiceCard.innerHTML = `
    <div class="card">
      <h2>❌ Data pesanan tidak ditemukan</h2>
      <p>Silakan buat pesanan terlebih dahulu.</p>
    </div>
  `;

  document.getElementById("paidBtn").style.display = "none";
} else {
  invoiceCard.innerHTML = `
    <div class="card">

      <div>
        👤 Username :
        <b>${data.username}</b>
      </div>

      <div>
        🎯 Paket :
        <b>${data.paket} × ${data.quantity}</b>
      </div>

      <div>
        💵 Harga Satuan :
        <b>
          Rp${data.hargaSatuan.toLocaleString("id-ID")}
        </b>
      </div>

      <div>
        🧾 Subtotal :
        <b>
          Rp${data.subtotal.toLocaleString("id-ID")}
        </b>
      </div>

      <div>
        🏷 Diskon Quantity :
        <b>
          -Rp${data.diskonQuantity.toLocaleString("id-ID")}
        </b>
      </div>

      <div>
        🎁 Diskon Promo :
        <b>
          -Rp${data.diskonPromo.toLocaleString("id-ID")}
        </b>
      </div>

      <div>
        🤝 Diskon Affiliate :
        <b>
          -Rp${data.diskonAffiliate.toLocaleString("id-ID")}
        </b>
      </div>

      <hr>

      <div>
        💰 TOTAL :
        <b>
          Rp${data.harga.toLocaleString("id-ID")}
        </b>
      </div>

      <div class="status">
        ⏳ Menunggu Pembayaran
      </div>

      <img
        src="images/qris.jpeg"
        class="qris"
      >

    </div>
  `;

  document.getElementById("paidBtn").addEventListener("click", () => {
    const text = encodeURIComponent(
      `Halo Admin AJRA 👋

Saya sudah melakukan pembayaran.

Username : ${data.username}

Paket : ${data.paket}
Quantity : ${data.quantity}

Harga Satuan :
Rp${data.hargaSatuan.toLocaleString("id-ID")}

Subtotal :
Rp${data.subtotal.toLocaleString("id-ID")}

Diskon Quantity :
Rp${data.diskonQuantity.toLocaleString("id-ID")}

Diskon Promo :
Rp${data.diskonPromo.toLocaleString("id-ID")}

Diskon Affiliate :
Rp${data.diskonAffiliate.toLocaleString("id-ID")}

TOTAL :
Rp${data.harga.toLocaleString("id-ID")}

Mohon dilakukan pengecekan pembayaran.`
    );

    window.location.href =
      `https://wa.me/6285885385659?text=${text}`;
  });
}
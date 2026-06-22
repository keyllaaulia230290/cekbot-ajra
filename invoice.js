const data = JSON.parse(localStorage.getItem("lastOrder"));

const invoiceCard = document.getElementById("invoiceCard");

invoiceCard.innerHTML = `

<div class="card">

<div>
👤 Username :
<b>${data.username}</b>
</div>

<div>
🎯 Paket :
<b>${data.paket}</b>
</div>

<div>
💰 Total :
<b>
Rp${data.harga.toLocaleString("id-ID")}
</b>
</div>

<div class="status">
⏳ Menunggu Pembayaran
</div>

<img
src="images/qris.jpeg"
class="qris">

</div>

`;

document.getElementById("paidBtn").addEventListener("click", () => {
  const text = encodeURIComponent(
    `Halo Admin AJRA

Saya sudah melakukan pembayaran.

Username : ${data.username}
Paket : ${data.paket}
Total : Rp${data.harga.toLocaleString("id-ID")}

Mohon dilakukan pengecekan `,
  );

  window.location.href = `https://wa.me/6285885385659?text=${text}`;
});

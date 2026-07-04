import {
    auth,
    db,
    ref,
    get,
    signOut,
    onAuthStateChanged
} from "./firebase/config.js";

// =========================
// ELEMENT
// =========================

const affiliateName = document.getElementById("affiliateName");
const komisi = document.getElementById("komisi");
const referral = document.getElementById("referral");
const pending = document.getElementById("pending");
const withdraw = document.getElementById("withdraw");

const referralLink = document.getElementById("referralLink");

const copyBtn = document.getElementById("copyReferral");

const logoutBtn = document.getElementById("logoutBtn");

const rank = document.getElementById("rank");

const progressBar = document.getElementById("progressBar");
const withdrawBtn = document.getElementById("withdrawBtn");

let affiliateData = null;
const historyTable = document.getElementById("historyTable");

// =========================
// CEK LOGIN
// =========================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "affiliate-login.html";

        return;

    }

    try {

        const snapshot = await get(

            ref(db, "affiliates/" + user.uid)

        );

        if (!snapshot.exists()) {

            alert("Data affiliate tidak ditemukan.");

            return;

        }

        const data = snapshot.val();
        affiliateData = data;


        affiliateName.textContent = data.nama;

        komisi.textContent = "Rp" + (data.komisi || 0).toLocaleString("id-ID");

        referral.textContent = data.totalReferral || 0;

        pending.textContent = "Rp" + (data.pending || 0).toLocaleString("id-ID");

        withdraw.textContent = "Rp" + (data.withdraw || 0).toLocaleString("id-ID");

        const link =

            "https://cekbot.ajra.store/perpanjang.html?ref=" +

            data.referralCode;

        referralLink.value = link;

        // =====================
// RIWAYAT KOMISI
// =====================

const historySnap = await get(ref(db, "affiliateHistory"));

historyTable.innerHTML = "";

if (historySnap.exists()) {

    const histories = historySnap.val();

    let ditemukan = false;

    Object.values(histories)
        .reverse()
        .forEach((item) => {

            if (item.affiliateUid !== user.uid) return;

            ditemukan = true;

            const tanggal = new Date(item.createdAt);

            historyTable.innerHTML += `
<tr>

<td>${tanggal.toLocaleDateString("id-ID")}</td>

<td>${item.username} (${item.paket})</td>

<td>Rp${Number(item.komisi).toLocaleString("id-ID")}</td>

</tr>
`;

        });

    if (!ditemukan) {

        historyTable.innerHTML = `
<tr>

<td colspan="3">

Belum ada riwayat.

</td>

</tr>
`;

    }

} else {

    historyTable.innerHTML = `
<tr>

<td colspan="3">

Belum ada riwayat.

</td>

</tr>
`;

}

        // =====================
        // RANK
        // =====================

        const total = data.totalReferral || 0;

        if (total >= 100) {

            rank.textContent = "💎 Diamond";

            progressBar.style.width = "100%";

        }

        else if (total >= 50) {

            rank.textContent = "🥇 Gold";

            progressBar.style.width = "75%";

        }

        else if (total >= 20) {

            rank.textContent = "🥈 Silver";

            progressBar.style.width = "50%";

        }

        else {

            rank.textContent = "🥉 Bronze";

            progressBar.style.width = "25%";

        }

    }

    catch (err) {

        console.error(err);

        alert("Gagal mengambil data.");

    }

});

// =========================
// COPY LINK
// =========================

copyBtn.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(

            referralLink.value

        );

        copyBtn.innerText = "✅ Link Disalin";

        setTimeout(() => {

            copyBtn.innerText = "Salin Link Referral";

        }, 2000);

    }

    catch {

        alert("Gagal menyalin link.");

    }

});

// =========================
// LOGOUT
// =========================

logoutBtn.addEventListener("click", async () => {

    if (!confirm("Yakin ingin logout?")) return;

    await signOut(auth);

    window.location.href = "affiliate-login.html";

});

withdrawBtn.addEventListener("click", () => {

    if (!affiliateData) return;

    if ((affiliateData.pending || 0) <= 0) {
        alert("Belum ada komisi yang bisa dicairkan.");
        return;
    }

    const pesan = `Halo Admin AJRA 👋

Saya ingin melakukan withdraw komisi.

Nama : ${affiliateData.nama}

Kode Referral : ${affiliateData.referralCode}

Total Komisi : Rp${affiliateData.pending.toLocaleString("id-ID")}

Terima kasih.`;

    window.open(
        "https://wa.me/6285885385659?text=" +
        encodeURIComponent(pesan),
        "_blank"
    );

});
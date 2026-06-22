import {
  db,
  auth,
  ref,
  push,
  set,
  onValue,
  remove,
  update,
  get,
  signInWithEmailAndPassword,
  signOut,
} from "../firebase/config.js";

const loginBtn = document.getElementById("loginBtn");

const saveBtn = document.getElementById("saveBtn");

const logoutBtn = document.getElementById("logoutBtn");

const loginBox = document.getElementById("loginBox");

const dashboard = document.getElementById("dashboard");

const claimList = document.getElementById("claimList");

const botList = document.getElementById("botList");

const orderList = document.getElementById("orderList");

const orderFilter = document.getElementById("orderFilter");

orderFilter.addEventListener(
"change",
loadOrders
);

let isEditing = false;
let selectedBotId = null;

// LOGIN
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("username").value.trim();

  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);

    loginBox.classList.add("hidden");

    dashboard.classList.remove("hidden");

    loadBots();
    loadOrders();
    loadClaims();
  } catch {
    alert("Login gagal");
  }
});

// SAVE / UPDATE
saveBtn.addEventListener("click", async () => {
  const customer = document.getElementById("customer").value.trim();

  const username = document.getElementById("botUsername").value.trim();

  const iggid = document.getElementById("iggid").value.trim();

  const server = document.getElementById("server").value.trim();

  const expired = document.getElementById("expired").value.trim();

  const status = document.getElementById("status").value;

  if (!customer || !username || !iggid || !server || !expired) {
    alert("Lengkapi data");
    return;
  }

  const snapshot = await onetime();

  const data = snapshot || {};

  let duplicate = false;

  Object.keys(data).forEach((key) => {
    if (key !== selectedBotId) {
      const bot = data[key];

      if (bot.username.toLowerCase() === username.toLowerCase()) {
        duplicate = true;
      }

      if (bot.iggid === iggid) {
        duplicate = true;
      }
    }
  });

  if (duplicate) {
    alert("Username / IGG ID sudah ada");
    return;
  }

  const payload = {
    customer,
    username,
    iggid,
    server,
    expired,
    status,
  };

  if (isEditing) {
    await update(ref(db, "bots/" + selectedBotId), payload);

    alert("Data berhasil diupdate");

    saveBtn.innerText = "Tambah Data";

    isEditing = false;
    selectedBotId = null;
  } else {
    const newBot = push(ref(db, "bots"));

    await set(newBot, payload);

    alert("Data berhasil ditambah");
  }

  clearForm();
});

// LOAD BOTS
let currentPage = 1;
const itemsPerPage = 10;

function loadBots() {
  const searchInput = document.getElementById("searchBot");

  const prevBtn = document.getElementById("prevPage");

  const nextBtn = document.getElementById("nextPage");

  const pageInfo = document.getElementById("pageInfo");

  onValue(
    ref(db, "bots"),
    (snapshot) => {
      botList.innerHTML = "";

      if (!snapshot.exists()) return;

      const data = snapshot.val();

      const totalUsers = Object.keys(data).length;

      let activeCount = 0;
      let inactiveCount = 0;

      Object.keys(data).forEach((key) => {
        const bot = data[key];

        if (bot.status.toLowerCase() === "aktif") {
          activeCount++;
        } else {
          inactiveCount++;
        }
      });

      document.getElementById("totalUsers").innerText = totalUsers;

      document.getElementById("activeUsers").innerText = activeCount;

      document.getElementById("inactiveUsers").innerText = inactiveCount;

      document.getElementById("eventUsers").innerText = `${totalUsers}/1000`;

      let bots = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      // SEARCH
      const keyword = searchInput.value.toLowerCase();

      if (keyword) {
        bots = bots.filter(
          (bot) =>
            bot.username?.toLowerCase().includes(keyword) ||
            bot.customer?.toLowerCase().includes(keyword) ||
            bot.iggid?.toString().includes(keyword),
        );
      }

      // PAGINATION
      const totalPages = Math.ceil(bots.length / itemsPerPage);

      const start = (currentPage - 1) * itemsPerPage;

      const end = start + itemsPerPage;

      const currentBots = bots.slice(start, end);

      pageInfo.innerText = `Page ${currentPage} of ${totalPages || 1}`;

      // RENDER
      currentBots.forEach((bot) => {
        const statusColor =
          bot.status.toLowerCase() === "aktif" ? "#37ff8b" : "#ff7272";

        botList.innerHTML += `

<div class="bot-card">

<div class="bot-title">
${bot.username}
</div>

<div class="bot-info">
👤 ${bot.customer}
</div>

<div class="bot-info">
🆔 ${bot.iggid}
</div>

<div class="bot-info">
🖥️ ${bot.server}
</div>

<div class="bot-info">
📅 ${bot.expired}
</div>

<div
class="bot-info"
style="
color:${statusColor};
font-weight:bold;
">
📊 ${bot.status}
</div>

<div class="actions">

<button
class="edit-btn"
onclick="
editBot(
'${bot.id}'
)
">
EDIT
</button>

<button
class="delete-btn"
onclick="
deleteBot(
'${bot.id}'
)
">
DELETE
</button>

</div>

</div>
`;
      });

      // BUTTON PAGE
      prevBtn.onclick = () => {
        if (currentPage > 1) {
          currentPage--;
          loadBots();
        }
      };

      nextBtn.onclick = () => {
        if (currentPage < totalPages) {
          currentPage++;
          loadBots();
        }
      };

      searchInput.oninput = () => {
        currentPage = 1;
        loadBots();
      };
    },
    {
      onlyOnce: true,
    },
  );
}

// EDIT
window.editBot = async (id) => {
  const snapshot = await onetime();

  const bot = snapshot[id];

  document.getElementById("customer").value = bot.customer;

  document.getElementById("botUsername").value = bot.username;

  document.getElementById("iggid").value = bot.iggid;

  document.getElementById("server").value = bot.server;

  document.getElementById("expired").value = bot.expired;

  document.getElementById("status").value = bot.status;

  isEditing = true;

  selectedBotId = id;

  saveBtn.innerText = "UPDATE DATA";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// DELETE
window.deleteBot = async (id) => {
  const confirmDelete = confirm("Hapus data ini?");

  if (!confirmDelete) return;

  await remove(ref(db, "bots/" + id));
};

// LOGOUT
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);

  location.reload();
});

// HELPERS
function clearForm() {
  document.getElementById("customer").value = "";

  document.getElementById("botUsername").value = "";

  document.getElementById("iggid").value = "";

  document.getElementById("server").value = "";

  document.getElementById("expired").value = "";

  document.getElementById("status").value = "AKTIF";
}

function loadClaims() {
  onValue(ref(db, "rewardClaims"), (snapshot) => {
    claimList.innerHTML = "";

    if (!snapshot.exists()) {
      claimList.innerHTML = `
<div class="notfound">
Belum ada klaim
</div>
`;

      return;
    }

    const claims = snapshot.val();

    Object.keys(claims)
      .reverse()
      .forEach((key) => {
        const claim = claims[key];

        claimList.innerHTML += `

<div class="claim-card">

<div class="claim-title">
🎁 ${claim.reward}
</div>

<div class="claim-info">
🆔 ${claim.iggid}
</div>

<div class="claim-info">
🏆 Level ${claim.level}
</div>

<div class="claim-info">
📅 ${claim.date}
</div>

</div>

`;
      });
  });
}

function loadOrders() {
  onValue(ref(db, "orders"), (snapshot) => {
    orderList.innerHTML = "";

    if (!snapshot.exists()) {
      orderList.innerHTML = `
<div class="notfound">
Belum ada pesanan
</div>
`;

      return;
    }

    const orders = snapshot.val();

    Object.keys(orders)
      .reverse()
      .forEach((key) => {
        const order = orders[key];

        const filter =
orderFilter.value;

if(

filter !== "ALL"

&&

order.status !== filter

){

return;

}

        orderList.innerHTML += `

<div class="order-card">

<div class="order-title">
📦 ${order.username}
</div>

<div class="order-info">
🎯 Paket :
${order.paket}
</div>

<div class="order-info">
💰 Harga :
Rp${Number(order.harga).toLocaleString("id-ID")}
</div>

<div class="order-info">
📱 WA :
${order.whatsapp}
</div>

<div class="order-info">
📊 Status :
<span class="
status-badge
${order.status}
">
${order.status}
</span>
</div>

<div class="actions">

<button
class="edit-btn"
onclick="
finishOrder(
'${key}'
)
">

SELESAI

</button>

<button
class="delete-btn"
onclick="
cancelOrder(
'${key}'
)
">

BATAL

</button>

</div>

</div>

`;
      });
  });
}

window.finishOrder =
async(id)=>{

const orderSnap =
await get(
ref(
db,
"orders/" + id
)
);

if(
!orderSnap.exists()
)return;

const order =
orderSnap.val();

const botSnap =
await get(
ref(
db,
"bots"
)
);

const bots =
botSnap.val() || {};

let botKey = null;
let botData = null;

Object.keys(bots)
.forEach(key=>{

if(

bots[key].username
?.toLowerCase()
===

order.username
.toLowerCase()

){

botKey = key;
botData = bots[key];

}

});

if(!botKey){

alert(
"Bot tidak ditemukan"
);

return;

}

const daysMap = {

"1 Bulan":30,

"3 Bulan":90,

"6 Bulan":180,

"1 Tahun":365,

"Permanent":36500

};

const addDays =
daysMap[
order.paket
] || 0;

const split =
botData.expired
.split("/");

const currentDate =
new Date(

split[2],
split[1]-1,
split[0]

);

currentDate.setDate(
currentDate.getDate()
+
addDays
);

const day =
String(
currentDate.getDate()
).padStart(2,"0");

const month =
String(
currentDate.getMonth()+1
).padStart(2,"0");

const year =
currentDate.getFullYear();

const newExpired =
`${day}/${month}/${year}`;

await update(
ref(
db,
"bots/" + botKey
),
{
expired:
newExpired
}
);

await update(
ref(
db,
"orders/" + id
),
{
status:
"SELESAI"
}
);

alert(
"Order selesai & expired diperpanjang"
);

};

window.cancelOrder =
async(id)=>{

await update(
ref(
db,
"orders/" + id
),
{
status:"BATAL"
}
);

};

function onetime() {
  return new Promise((resolve) => {
    onValue(
      ref(db, "bots"),
      (snapshot) => {
        resolve(snapshot.val() || {});
      },
      {
        onlyOnce: true,
      },
    );
  });
}

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

async function findBot() {

  const keyword =
  input.value
  .trim()
  .toLowerCase();

  if(!keyword){
    alert(
      "Masukkan Username atau IGG ID"
    );
    return;
  }

  loading.classList.remove(
    "hidden"
  );

  result.innerHTML = "";

  try {

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

    if(!snapshot.exists()){

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

    Object.keys(data)
    .forEach(key => {

      const bot =
      data[key];

      const username =
      bot.username
      ?.toLowerCase();

      const iggid =
      bot.iggid
      ?.toString()
      .toLowerCase();

      if(
        username === keyword ||
        iggid === keyword
      ){
        found = bot;
      }

    });

    if(found){

      const isActive =
      found.status
      ?.toLowerCase()
      === "aktif";

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

    } else {

      result.innerHTML = `
      <div class="notfound">
      ❌ Data bot tidak ditemukan
      </div>
      `;

    }

  } catch(err){

    console.log(err);

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
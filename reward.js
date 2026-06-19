import {
  db,
  ref,
  push,
  set,
  get,
  child
} from "./firebase/config.js";

const rewards = [

  {
    target: 200,
    reward: "200K Gems By Gift",
    winner: 2,
    image: "images/reward200.png"
  },

  {
    target: 400,
    reward: "1M Gems By Gift",
    winner: 5,
    image: "images/reward400.png"
  },

  {
    target: 600,
    reward: "1M Gems By Gift",
    winner: 7,
    image: "images/reward600.png"
  },

  {
    target: 800,
    reward: "2M Gems By Gift",
    winner: 5,
    image: "images/reward800.png"
  },

  {
    target: 1000,
    reward: "2M Gems By Gift",
    winner: 7,
    image: "images/reward1000.png"
  }

];

const container =
document.getElementById(
  "rewardContainer"
);

const activeUsers =
document.getElementById(
  "activeUsers"
);

loadRewards();

async function loadRewards() {

  const botSnapshot =
  await get(
    child(
      ref(db),
      "bots"
    )
  );

  const claimSnapshot =
  await get(
    child(
      ref(db),
      "rewardClaims"
    )
  );

  const bots =
  botSnapshot.val() || {};

  const claims =
  claimSnapshot.val() || {};

  const totalUsers =
  Object.keys(bots).length;

  activeUsers.innerHTML =
  `👥 Pengguna Aktif : ${totalUsers}/1000`;

  container.innerHTML = "";

  rewards.forEach((level, index) => {

    const percent =
    Math.min(
      (totalUsers / level.target) * 100,
      100
    );

    const unlocked =
    totalUsers >= level.target;

    const claimCount =
    Object.values(claims)
    .filter(
      claim =>
      claim.level === level.target
    )
    .length;

    const soldOut =
    claimCount >= level.winner;

    container.innerHTML += `

    <div class="reward-card">

      <img
      src="${level.image}"
      class="reward-image">

      <div class="reward-level">
        LEVEL ${index + 1}
      </div>

      <h2 class="target-user">
        ${level.target} USER
      </h2>

      <div class="reward-info">

        <div class="reward-badge gems">
          💎 ${level.reward}
        </div>

        <div class="reward-badge winner">
          🏆 ${claimCount}/${level.winner} Pemenang
        </div>

      </div>

      <div class="progress">

        <div
        class="fill"
        style="
        width:${percent}%;
        ">
        </div>

      </div>

      ${
        soldOut
        ?
        `
        <div class="soldOut">
          ❌ HABIS DITUKAR
        </div>
        `
        :
        `
        <button
        class="
        claimBtn
        ${!unlocked ? "locked" : ""}
        "

        onclick="
        claimReward(
        ${level.target},
        '${level.reward}'
        )
        "

        ${!unlocked ? "disabled" : ""}

        >

        ${
          unlocked
          ? "🎁 Klaim Hadiah"
          : "🔒 Belum Terbuka"
        }

        </button>
        `
      }

    </div>

    `;

  });

}

window.claimReward =
async function (
  level,
  reward
) {

  const iggid =
  prompt(
    "Masukkan IGG ID Aktif"
  );

  if (!iggid) return;

  const botSnapshot =
  await get(
    child(
      ref(db),
      "bots"
    )
  );

  const bots =
  botSnapshot.val() || {};

  let validBot = false;

  Object.keys(bots)
  .forEach(key => {

    if (
      bots[key].iggid
      ?.toString()
      === iggid
    ) {

      validBot = true;

    }

  });

  if (!validBot) {

    alert(
      "IGG ID tidak terdaftar di Bot AjraStore"
    );

    return;

  }

  const claimSnapshot =
  await get(
    child(
      ref(db),
      "rewardClaims"
    )
  );

  const claims =
  claimSnapshot.val() || {};

  let alreadyClaim = false;

  Object.keys(claims)
  .forEach(key => {

    const claim =
    claims[key];

    if (
      claim.iggid === iggid &&
      claim.level === level
    ) {

      alreadyClaim = true;

    }

  });

  if (alreadyClaim) {

    alert(
      "Kamu sudah klaim reward ini"
    );

    return;

  }

  const newClaim =
  push(
    ref(
      db,
      "rewardClaims"
    )
  );

  await set(
    newClaim,
    {
      iggid,
      level,
      reward,
      date:
      new Date()
      .toLocaleDateString()
    }
  );

  const text =
  encodeURIComponent(

`Halo Admin

Saya ingin klaim hadiah.

Level : ${level}
Reward : ${reward}
IGG ID : ${iggid}`

  );

  window.location.href =
  `https://wa.me/6285885385659?text=${text}`;

};
const API = "https://shiva3344a.pythonanywhere.com";

const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

/* -------- USER -------- */
let user;
if (tg && tg.initDataUnsafe?.user) {
  user = tg.initDataUnsafe.user;
} else {
  user = { id: 999999, username: "BrowserUser", first_name: "Browser" };
}

const userId = user.id;
const username = user.username || "User";

/* -------- UI -------- */
const balanceEl = document.getElementById("balance");
const adsSeenEl = document.getElementById("adsSeen");
const watchBtn = document.getElementById("watchBtn");
const welcomeEl = document.getElementById("welcome");
const refInput = document.getElementById("refLink");

welcomeEl.innerText = `Welcome @${username}`;
refInput.value = `https://t.me/AdifyEarning_Bot?start=ref_${userId}`;

let balance = 0;
let adsSeen = 0;
const adLimit = 250;
const earningPerAd = 0.0002;
let isWatching = false;

/* -------- LOAD USER -------- */
fetch(`${API}/user`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user_id: userId })
})
.then(res => res.json())
.then(data => {
  balance = data.balance;
  adsSeen = data.ads_today;
  updateUI();
})
.catch(() => alert("Backend not responding"));

/* -------- UPDATE UI -------- */
function updateUI() {
  balanceEl.innerText = "$" + balance.toFixed(4);
  adsSeenEl.innerText = adsSeen;
}

/* -------- WATCH AD -------- */
watchBtn.onclick = () => {
  if (isWatching) return;

  if (adsSeen >= adLimit) {
    alert("Daily ad limit reached");
    return;
  }

  isWatching = true;
  watchBtn.disabled = true;

  let time = 3;
  watchBtn.innerText = `Please wait ${time}s`;

  const timer = setInterval(() => {
    time--;
    if (time > 0) {
      watchBtn.innerText = `Please wait ${time}s`;
    } else {
      clearInterval(timer);

      fetch(`${API}/watch-ad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          balance = data.balance;
          adsSeen = data.ads_today;
          updateUI();
        }
      })
      .catch(() => alert("Server error"))
      .finally(() => {
        watchBtn.disabled = false;
        watchBtn.innerText = "▶ Watch Ad";
        isWatching = false;
      });
    }
  }, 1000);
};

/* -------- COPY REF -------- */
function copyRef() {
  refInput.select();
  document.execCommand("copy");
  alert("Referral link copied");
}

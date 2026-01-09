const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

let user;
if (tg && tg.initDataUnsafe?.user) {
  user = tg.initDataUnsafe.user;
} else {
  user = { id: "999999", username: "BrowserUser" };
}

const userId = user.id;
const API = "https://shiva3344a.pythonanywhere.com";

let balance = 0;
let adsSeen = 0;

// ---------- UI ----------
document.getElementById("welcome").innerText =
  "Welcome @" + (user.username || "User");

document.getElementById("ref").value =
  "https://t.me/AdifyEarning_Bot?start=ref_" + userId;

function updateUI() {
  document.getElementById("balance").innerText =
    "$" + balance.toFixed(4);
  document.getElementById("adsSeen").innerText = adsSeen;
}

// ---------- INIT ----------
const initForm = new FormData();
initForm.append("user_id", userId);

fetch(API + "/user", { method: "POST", body: initForm })
  .then(r => r.json())
  .then(d => {
    balance = d.balance;
    adsSeen = d.ads_today;
    updateUI();
  });

// ---------- WATCH AD ----------
function watchAd() {
  const f = new FormData();
  f.append("user_id", userId);

  fetch(API + "/watch-ad", { method: "POST", body: f })
    .then(r => r.json())
    .then(d => {
      if (d.error) return alert(d.error);
      balance = d.balance;
      adsSeen = d.ads_today;
      updateUI();
    })
    .catch(() => alert("Backend not responding"));
}

// ---------- WITHDRAW ----------
function withdraw() {
  const wallet = document.getElementById("wallet").value.trim();
  if (!wallet) return alert("Enter USDT BEP20 address");

  const f = new FormData();
  f.append("user_id", userId);
  f.append("address", wallet);

  fetch(API + "/withdraw", { method: "POST", body: f })
    .then(r => r.json())
    .then(d => {
      if (d.error) alert(d.error);
      else {
        alert("Withdraw request sent");
        balance = 0;
        updateUI();
      }
    });
}

// ---------- COPY ----------
function copyRef() {
  navigator.clipboard.writeText(
    document.getElementById("ref").value
  );
  alert("Copied");
}

const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

/* -------- USER (Telegram + Browser fallback) -------- */
let user;
if (tg && tg.initDataUnsafe?.user) {
  user = tg.initDataUnsafe.user;
} else {
  user = {
    id: 999999,
    username: "BrowserUser",
    first_name: "Browser"
  };
}

const userId = user.id;
const username = user.username ? "@" + user.username : user.first_name;

/* -------- UI SETUP -------- */
document.getElementById("welcomeText").innerText =
  "Welcome " + username;

/* Referral link */
const refLink =
  `https://t.me/AdifyEarning_Bot?start=ref_${userId}`;
document.getElementById("refLink").value = refLink;

/* -------- STATE -------- */
let balance = 0.0;
let adsSeen = 0;
const adLimit = 250;
const earningPerAd = 0.0002;
let isWatching = false;

/* -------- UPDATE UI -------- */
function updateUI() {
  document.getElementById("balance").innerText =
    "$" + balance.toFixed(4);

  document.getElementById("adsSeen").innerText =
    `${adsSeen} / ${adLimit}`;

  document.getElementById("progressBar").style.width =
    (adsSeen / adLimit) * 100 + "%";
}

updateUI();

/* -------- WATCH AD -------- */
function watchAd() {
  if (isWatching) return;

  if (adsSeen >= adLimit) {
    alert("Daily ad limit reached");
    return;
  }

  isWatching = true;
  let time = 3;
  const btn = document.getElementById("watchBtn");

  btn.disabled = true;
  btn.innerText = `Please wait ${time}s`;

  const timer = setInterval(() => {
    time--;
    if (time > 0) {
      btn.innerText = `Please wait ${time}s`;
    } else {
      clearInterval(timer);

      adsSeen++;
      balance += earningPerAd;

      updateUI();

      btn.innerText = "▶ Watch Ad";
      btn.disabled = false;
      isWatching = false;
    }
  }, 1000);
}

/* -------- COPY REF -------- */
function copyRef() {
  navigator.clipboard.writeText(refLink);
  alert("Referral link copied!");
}

/* -------- WITHDRAW -------- */
function withdraw() {
  const wallet = document.getElementById("wallet").value.trim();

  if (!wallet.startsWith("0x") || wallet.length < 40) {
    alert("Enter valid USDT BEP20 wallet address");
    return;
  }

  if (balance < 0.05) {
    alert("Minimum withdraw is $0.05");
    return;
  }

  // Demo payout history
  const history = document.getElementById("payoutHistory");
  history.innerHTML = `<li>Requested $${balance.toFixed(4)} to ${wallet}</li>`;

  balance = 0;
  updateUI();

  alert("Withdraw request submitted (demo)");
}
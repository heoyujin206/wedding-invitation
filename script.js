const CONFIG = {
  weddingDate: "2027-12-11T10:40:00+09:00",
  backendUrl: "https://script.google.com/macros/s/AKfycbxTiZYJy4XFapC2mC9VF1fuyfXa777Dbgidc9AIZlhjsWy7YaMUGb7vCGsg2DRmKDpxmA/exec",
  shareTitle: "성연과 유진의 결혼식에 초대합니다",
  shareText: "2027년 12월 11일 토요일 오전 10시 40분",
  galleryImages: [
    "images/gallery-01.jpg",
    "images/gallery-02.jpg",
    "images/gallery-03.jpg",
    "images/gallery-04.jpg",
    "images/gallery-05.jpg",
    "images/gallery-06.jpg"
  ]
};

const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

/* 1. 인트로 최초 1회, 3초 자동 진입, 이미지 오류 대응 */
const invitationIntro = document.getElementById("invitationIntro");
const introSkip = document.getElementById("introSkip");
const introCardImage = document.getElementById("introCardImage");
const INTRO_KEY = "weddingInvitationIntroSeen";
let introClosed = false;

function closeInvitationIntro() {
  if (introClosed || !invitationIntro) return;
  introClosed = true;
  sessionStorage.setItem(INTRO_KEY, "true");
  invitationIntro.classList.add("is-finished");
  invitationIntro.setAttribute("aria-hidden", "true");
  document.body.classList.remove("intro-open");
  setTimeout(() => invitationIntro.remove(), 550);
}

if (sessionStorage.getItem(INTRO_KEY) === "true") {
  closeInvitationIntro();
} else {
  introSkip.addEventListener("click", closeInvitationIntro);
  introCardImage.addEventListener("error", closeInvitationIntro, { once: true });
  setTimeout(closeInvitationIntro, 3000);
}

/* D-day */
const weddingDate = new Date(CONFIG.weddingDate);
const diffDays = Math.ceil((weddingDate - new Date()) / 86400000);
document.getElementById("dday").textContent =
  diffDays > 0 ? `결혼식까지 D-${diffDays}` :
  diffDays === 0 ? "오늘, 저희 결혼합니다" :
  "함께해 주셔서 감사합니다";

/* 빠른 이동 */
document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.scroll)?.scrollIntoView({
      behavior: "smooth"
    });
  });
});

/* 2. 공유 API */
document.getElementById("shareBtn").addEventListener("click", async () => {
  const shareData = {
    title: CONFIG.shareTitle,
    text: CONFIG.shareText,
    url: location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(location.href);
      showToast("청첩장 주소를 복사했습니다");
    }
  } catch (error) {
    if (error.name !== "AbortError") showToast("공유에 실패했습니다");
  }
});

/* 주소 복사 */
document.getElementById("copyAddressBtn").addEventListener("click", async () => {
  const address = document.getElementById("venueAddress").textContent.trim();
  try {
    await navigator.clipboard.writeText(address);
    showToast("주소를 복사했습니다");
  } catch {
    showToast("주소 복사에 실패했습니다");
  }
});

/*네이버 지도 화면*/
function initNaverMap() {
  const mapElement = document.getElementById("naverMap");

  if (!mapElement || !window.naver?.maps) {
    console.error("네이버 지도 API를 불러오지 못했습니다.");
    return;
  }

  const weddingHallPosition = new naver.maps.LatLng(
    37.308201295112,
    126.828818362901
  );

  const map = new naver.maps.Map(mapElement, {
    center: weddingHallPosition,
    zoom: 16,
    zoomControl: true,
    zoomControlOptions: {
      position: naver.maps.Position.TOP_RIGHT
    },
    mapDataControl: false,
    scaleControl: false
  });

  const marker = new naver.maps.Marker({
    position: weddingHallPosition,
    map,
    title: "웨딩홀"
  });

  const infoWindow = new naver.maps.InfoWindow({
    content: `
      <div class="naver-map-info">
        <strong>AW웨딩컨벤션</strong>
        <span>경기도 안산시 단원구 광덕1로 171</span>
      </div>
    `
  });

  naver.maps.Event.addListener(marker, "click", () => {
    if (infoWindow.getMap()) {
      infoWindow.close();
    } else {
      infoWindow.open(map, marker);
    }
  });

  infoWindow.open(map, marker);
}

document.addEventListener("DOMContentLoaded", initNaverMap);

/* 3. 갤러리 lazy loading */
const galleryStrip = document.getElementById("galleryStrip");
const mainGalleryImage = document.getElementById("mainGalleryImage");

CONFIG.galleryImages.forEach((src, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `gallery-thumb${index === 0 ? " active" : ""}`;
  button.setAttribute("aria-label", `${index + 1}번째 사진 보기`);

  const image = document.createElement("img");
  image.src = src;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";

  button.appendChild(image);
  button.addEventListener("click", () => {
    mainGalleryImage.src = src;
    mainGalleryImage.alt = `성연과 유진의 웨딩 사진 ${index + 1}`;
    document.querySelectorAll(".gallery-thumb").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });

  galleryStrip.appendChild(button);
});

/* 4. 계좌 */
const accounts = {
  groom: [
    ["신랑", "국민은행 123-456-789012", "이성연"],
    ["신랑 아버지", "국민은행 111-222-333333", "이용훈"],
    ["신랑 어머니", "신한은행 444-555-666666", "조점희"]
  ],
  bride: [
    ["신부", "신한은행 987-654-321098", "허유진"],
    ["신부 아버지", "우리은행 222-333-444444", "허봉행"],
    ["신부 어머니", "하나은행 555-666-777777", "정순월"]
  ]
};

const inlineAccountList = document.getElementById("inlineAccountList");
const accountButtons = document.querySelectorAll("[data-account-side]");
let currentAccountSide = "";

function renderAccounts(type) {
  const isSame = currentAccountSide === type && inlineAccountList.classList.contains("show");

  accountButtons.forEach((button) => {
    const expanded = button.dataset.accountSide === type && !isSame;
    button.classList.toggle("active", expanded);
    button.setAttribute("aria-expanded", String(expanded));
  });

  if (isSame) {
    inlineAccountList.classList.remove("show");
    inlineAccountList.innerHTML = "";
    currentAccountSide = "";
    return;
  }

  inlineAccountList.innerHTML = accounts[type].map(([label, number, name]) => `
    <div class="inline-account-card">
      <div>
        <div class="inline-account-label">${label}</div>
        <div class="inline-account-name">${name}</div>
        <div class="inline-account-number">${number}</div>
      </div>
      <button class="inline-copy-account" type="button"
              data-account="${number}" aria-label="${name} 계좌번호 복사">복사</button>
    </div>
  `).join("");

  inlineAccountList.querySelectorAll(".inline-copy-account").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.account);
        showToast("계좌번호를 복사했습니다");
      } catch {
        showToast("복사에 실패했습니다");
      }
    });
  });

  currentAccountSide = type;
  inlineAccountList.classList.add("show");
}

accountButtons.forEach((button) => {
  button.addEventListener("click", () => renderAccounts(button.dataset.accountSide));
});

/* 5. Google Apps Script 통신 */
async function postToBackend(payload) {
  if (!CONFIG.backendUrl.startsWith("http")) {
    throw new Error("BACKEND_NOT_CONFIGURED");
  }

  const response = await fetch(CONFIG.backendUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`HTTP_${response.status}`);

  const responseText = await response.text();
  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    console.error("Apps Script 응답을 JSON으로 읽지 못했습니다:", responseText);
    throw new Error("INVALID_BACKEND_RESPONSE");
  }

  if (!result.ok) throw new Error(result.code || "SAVE_FAILED");
  return result;
}

async function getFromBackend(params = {}) {
  if (!CONFIG.backendUrl.startsWith("http")) {
    throw new Error("BACKEND_NOT_CONFIGURED");
  }

  const url = new URL(CONFIG.backendUrl);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set("_", Date.now());

  const response = await fetch(url, { method: "GET", redirect: "follow", cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP_${response.status}`);
  const result = await response.json();
  if (!result.ok) throw new Error(result.code || "LOAD_FAILED");
  return result;
}

/* 6. Google Sheets 방명록: 조회·등록·수정·삭제·좋아요 */
const GUESTBOOK_PAGE_SIZE = 4;
const GUESTBOOK_OWNER_KEY = "weddingGuestbookOwners";
const GUESTBOOK_LIKES_KEY = "weddingGuestbookLikes";
const guestbookForm = document.getElementById("guestbookForm");
const guestbookStatus = document.getElementById("guestbookStatus");
const messages = document.getElementById("messages");
const guestbookPagination = document.getElementById("guestbookPagination");
const guestbookSubmit = document.getElementById("post");
const guestbookCancelEdit = document.getElementById("cancelGuestbookEdit");
const guestbookModeLabel = document.getElementById("guestbookModeLabel");
const guestNameInput = document.getElementById("guestName");
const guestMessageInput = document.getElementById("guestMessage");
const guestMessageCount = document.getElementById("guestMessageCount");

let guestbookItems = [];
let guestbookPage = 1;
let editingGuestbookId = "";

function readLocalObject(key) {
  try { return JSON.parse(localStorage.getItem(key) || "{}"); }
  catch { return {}; }
}

function writeLocalObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createOwnerToken() {
  if (window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function escapeText(value) {
  return String(value ?? "");
}

function formatGuestbookDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const minute = 60000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "방금 전";
  if (diff < hour) return `${Math.floor(diff / minute)}분 전`;
  if (diff < day) return `${Math.floor(diff / hour)}시간 전`;
  if (diff < 2 * day) return "어제";
  if (diff < 7 * day) return `${Math.floor(diff / day)}일 전`;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit"
  }).format(date).replace(/\. /g, ".").replace(/\.$/, "");
}

function updateGuestbookCounter() {
  guestMessageCount.textContent = `${guestMessageInput.value.length} / 200`;
}

guestMessageInput.addEventListener("input", updateGuestbookCounter);

function setGuestbookLoading(message = "축하 메시지를 불러오는 중이에요.") {
  messages.innerHTML = "";
  const loading = document.createElement("p");
  loading.className = "guestbook-empty";
  loading.textContent = message;
  messages.appendChild(loading);
  guestbookPagination.innerHTML = "";
}

function renderGuestbook() {
  messages.innerHTML = "";
  guestbookPagination.innerHTML = "";

  if (!guestbookItems.length) {
    const empty = document.createElement("div");
    empty.className = "guestbook-empty";
    empty.innerHTML = "<b>아직 등록된 메세지가 없어요.</b><span>가장 먼저 축하를 전해주세요</span>";
    messages.appendChild(empty);
    return;
  }

  const owners = readLocalObject(GUESTBOOK_OWNER_KEY);
  const liked = readLocalObject(GUESTBOOK_LIKES_KEY);
  const totalPages = Math.max(1, Math.ceil(guestbookItems.length / GUESTBOOK_PAGE_SIZE));
  guestbookPage = Math.min(Math.max(1, guestbookPage), totalPages);
  const start = (guestbookPage - 1) * GUESTBOOK_PAGE_SIZE;

  guestbookItems.slice(start, start + GUESTBOOK_PAGE_SIZE).forEach((item) => {
    const card = document.createElement("article");
    card.className = "message-card";

    const header = document.createElement("div");
    header.className = "message-card-header";
    const author = document.createElement("b");
    author.textContent = escapeText(item.name);
    const date = document.createElement("time");
    date.dateTime = item.createdAt || "";
    date.textContent = formatGuestbookDate(item.createdAt);
    header.append(author, date);

    const body = document.createElement("p");
    body.textContent = escapeText(item.message);

    const footer = document.createElement("div");
    footer.className = "message-card-footer";
    const likeButton = document.createElement("button");
    likeButton.type = "button";
    likeButton.className = "message-like-button";
    likeButton.dataset.id = item.id;
    likeButton.disabled = Boolean(liked[item.id]);
    likeButton.setAttribute("aria-label", `${item.name}님의 축하 메시지 좋아요`);
    likeButton.textContent = `${liked[item.id] ? "♥" : "♡"} ${Number(item.likes || 0)}`;
    footer.appendChild(likeButton);

    if (owners[item.id]) {
      const ownerActions = document.createElement("div");
      ownerActions.className = "message-owner-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.dataset.action = "edit";
      edit.dataset.id = item.id;
      edit.textContent = "수정";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.action = "delete";
      remove.dataset.id = item.id;
      remove.textContent = "삭제";
      ownerActions.append(edit, remove);
      footer.appendChild(ownerActions);
    }

    card.append(header, body, footer);
    messages.appendChild(card);
  });

  if (totalPages > 1) renderGuestbookPagination(totalPages);
}

function renderGuestbookPagination(totalPages) {
  const previous = document.createElement("button");
  previous.type = "button";
  previous.textContent = "‹";
  previous.disabled = guestbookPage === 1;
  previous.dataset.page = String(guestbookPage - 1);
  previous.setAttribute("aria-label", "이전 페이지");
  guestbookPagination.appendChild(previous);

  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(page);
    button.dataset.page = String(page);
    if (page === guestbookPage) {
      button.classList.add("active");
      button.setAttribute("aria-current", "page");
    }
    guestbookPagination.appendChild(button);
  }

  const next = document.createElement("button");
  next.type = "button";
  next.textContent = "›";
  next.disabled = guestbookPage === totalPages;
  next.dataset.page = String(guestbookPage + 1);
  next.setAttribute("aria-label", "다음 페이지");
  guestbookPagination.appendChild(next);
}

async function loadGuestbook({ keepPage = false } = {}) {
  if (!keepPage) guestbookPage = 1;
  setGuestbookLoading();
  try {
    const result = await getFromBackend({ action: "guestbook-list" });
    guestbookItems = Array.isArray(result.items) ? result.items : [];
    renderGuestbook();
  } catch (error) {
    setGuestbookLoading(
      error.message === "BACKEND_NOT_CONFIGURED"
        ? "Google Apps Script 주소를 설정하면 축하 메시지가 표시됩니다."
        : "축하 메시지를 불러오지 못했어요. 잠시 후 다시 확인해 주세요."
    );
  }
}

function resetGuestbookEdit() {
  editingGuestbookId = "";
  guestbookForm.reset();
  guestNameInput.disabled = false;
  guestbookSubmit.textContent = "남기기";
  guestbookCancelEdit.hidden = true;
  guestbookModeLabel.textContent = "새 메시지 작성";
  guestbookStatus.textContent = "";
  updateGuestbookCounter();
}

guestbookPagination.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-page]");
  if (!button || button.disabled) return;
  guestbookPage = Number(button.dataset.page);
  renderGuestbook();
  messages.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

messages.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = button.dataset.id;
  const item = guestbookItems.find(entry => entry.id === id);
  if (!id || !item) return;

  if (button.classList.contains("message-like-button")) {
    button.disabled = true;
    try {
      const result = await postToBackend({ type: "guestbook-like", id });
      const liked = readLocalObject(GUESTBOOK_LIKES_KEY);
      liked[id] = true;
      writeLocalObject(GUESTBOOK_LIKES_KEY, liked);
      item.likes = result.likes;
      renderGuestbook();
    } catch {
      button.disabled = false;
      showToast("좋아요를 반영하지 못했습니다");
    }
    return;
  }

  const owners = readLocalObject(GUESTBOOK_OWNER_KEY);
  const ownerToken = owners[id];
  if (!ownerToken) return;

  if (button.dataset.action === "edit") {
    editingGuestbookId = id;
    guestNameInput.value = item.name;
    guestNameInput.disabled = true;
    guestMessageInput.value = item.message;
    guestbookSubmit.textContent = "수정 완료";
    guestbookCancelEdit.hidden = false;
    guestbookModeLabel.textContent = "내 메시지 수정 중";
    updateGuestbookCounter();
    guestbookForm.scrollIntoView({ behavior: "smooth", block: "center" });
    guestMessageInput.focus();
    return;
  }

  if (button.dataset.action === "delete") {
    if (!window.confirm("작성한 축하 메시지를 삭제할까요?")) return;
    button.disabled = true;
    try {
      await postToBackend({ type: "guestbook-delete", id, ownerToken });
      delete owners[id];
      writeLocalObject(GUESTBOOK_OWNER_KEY, owners);
      if (editingGuestbookId === id) resetGuestbookEdit();
      await loadGuestbook({ keepPage: true });
      showToast("메시지를 삭제했습니다");
    } catch {
      button.disabled = false;
      showToast("삭제하지 못했습니다");
    }
  }
});

guestbookCancelEdit.addEventListener("click", resetGuestbookEdit);

guestbookForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = guestNameInput.value.trim();
  const message = guestMessageInput.value.trim();
  if (!name || !message) {
    guestbookStatus.textContent = "성함과 축하 메시지를 모두 입력해 주세요.";
    (!name ? guestNameInput : guestMessageInput).focus();
    return;
  }

  guestbookSubmit.disabled = true;
  guestbookSubmit.textContent = editingGuestbookId ? "수정 중..." : "등록 중...";
  guestbookStatus.textContent = "";

  try {
    if (editingGuestbookId) {
      const owners = readLocalObject(GUESTBOOK_OWNER_KEY);
      await postToBackend({
        type: "guestbook-update",
        id: editingGuestbookId,
        ownerToken: owners[editingGuestbookId],
        message
      });
      guestbookStatus.textContent = "축하 메시지를 수정했습니다.";
      resetGuestbookEdit();
    } else {
      const ownerToken = createOwnerToken();
      let result;

      try {
        result = await postToBackend({
          type: "guestbook-create",
          name,
          message,
          ownerToken,
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        // 구버전 Apps Script가 아직 배포되어 있는 경우 저장 자체는 한 번 더 시도합니다.
        if (error.message !== "INVALID_TYPE") throw error;
        result = await postToBackend({
          type: "guestbook",
          name,
          message,
          createdAt: new Date().toISOString()
        });
      }

      if (result.id) {
        const owners = readLocalObject(GUESTBOOK_OWNER_KEY);
        owners[result.id] = ownerToken;
        writeLocalObject(GUESTBOOK_OWNER_KEY, owners);
      }

      guestbookForm.reset();
      updateGuestbookCounter();
      guestbookStatus.textContent = result.id
        ? "축하 메시지가 등록되었습니다."
        : "메시지는 저장되었습니다. 수정·삭제 기능을 사용하려면 Apps Script를 최신 버전으로 다시 배포해 주세요.";
    }
    await loadGuestbook();
  } catch (error) {
    guestbookStatus.textContent =
      error.message === "BACKEND_NOT_CONFIGURED"
        ? "Google Apps Script 주소를 설정한 뒤 사용할 수 있습니다."
        : error.message === "DUPLICATE"
          ? "같은 내용이 이미 등록되어 있습니다."
          : error.message === "UNAUTHORIZED"
            ? "이 메시지를 수정할 권한을 확인하지 못했습니다."
            : error.message === "INVALID_TYPE"
            ? "Apps Script가 이전 버전입니다. google-apps-script.gs를 다시 배포해 주세요."
            : error.message === "INVALID_BACKEND_RESPONSE"
              ? "Apps Script 배포 권한 또는 웹 앱 주소를 확인해 주세요."
              : "처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  } finally {
    guestbookSubmit.disabled = false;
    guestbookSubmit.textContent = editingGuestbookId ? "수정 완료" : "남기기";
  }
});

updateGuestbookCounter();
loadGuestbook();

/* 7. 접근 가능한 RSVP 모달 */
const rsvpModal = document.getElementById("rsvpModal");
const rsvpOpenButton = document.getElementById("rsvpBtn");
const rsvpCloseButton = document.getElementById("closeRsvp");
const rsvpForm = document.getElementById("rsvpForm");
const rsvpName = document.getElementById("rsvpName");
const rsvpPhone = document.getElementById("rsvpPhone");
const rsvpSubmit = document.getElementById("submitRsvp");
const rsvpStatus = document.getElementById("rsvpStatus");
const rsvpState = { side: "", attendance: "" };
let lastFocusedElement = null;

function openRsvpModal() {
  lastFocusedElement = document.activeElement;
  rsvpModal.hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => rsvpName.focus(), 0);
}

function closeRsvpModal() {
  rsvpModal.hidden = true;
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
}

function validateRsvp() {
  rsvpSubmit.disabled = !(
    rsvpState.side &&
    rsvpState.attendance &&
    rsvpName.value.trim() &&
    document.getElementById("companions").value !== "" &&
    document.getElementById("meals").value !== ""
  );
}

rsvpOpenButton.addEventListener("click", openRsvpModal);
rsvpCloseButton.addEventListener("click", closeRsvpModal);

rsvpModal.addEventListener("click", (event) => {
  if (event.target === rsvpModal) closeRsvpModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !rsvpModal.hidden) closeRsvpModal();
});

rsvpName.addEventListener("input", validateRsvp);
document.getElementById("companions").addEventListener("change", validateRsvp);
document.getElementById("meals").addEventListener("change", validateRsvp);

document.querySelectorAll(".choice-grid").forEach((group) => {
  group.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      group.querySelectorAll("button").forEach((item) => {
        item.classList.remove("selected");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
      rsvpState[group.dataset.group] = button.dataset.value;
      validateRsvp();
    });
  });
});

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (rsvpSubmit.disabled) return;

  rsvpSubmit.disabled = true;
  rsvpSubmit.textContent = "전송 중...";
  rsvpStatus.textContent = "";

  try {
    const result = await postToBackend({
      type: "rsvp",
      side: rsvpState.side,
      name: rsvpName.value.trim(),
      phone: rsvpPhone.value.trim(),
      attendance: rsvpState.attendance,
      companions: Number(document.getElementById("companions").value),
      meals: Number(document.getElementById("meals").value),
      createdAt: new Date().toISOString()
    });

    rsvpStatus.textContent = result.updated
      ? "기존 응답이 최신 내용으로 수정되었습니다."
      : "참석 여부가 정상적으로 전달되었습니다.";

    rsvpForm.reset();
    rsvpState.side = "";
    rsvpState.attendance = "";
    document.querySelectorAll("#rsvpForm .choice-grid button").forEach((button) => {
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });

    setTimeout(closeRsvpModal, 1200);
  } catch (error) {
    rsvpStatus.textContent =
      error.message === "BACKEND_NOT_CONFIGURED"
        ? "Google Apps Script 주소를 설정한 뒤 사용할 수 있습니다."
        : error.message === "INVALID_DATA"
          ? "입력 내용을 다시 확인해 주세요."
          : "전송하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  } finally {
    rsvpSubmit.textContent = "전달하기";
    validateRsvp();
  }
});

let naverWeddingMap = null;

document.addEventListener("click", (event) => {
  const link = event.target.closest(".parking-link");

  if (!link) return;

  // href="#"의 기본 동작으로 페이지가 최상단으로 이동하는 것을 막습니다.
  event.preventDefault();

  const name = link.dataset.name;
  const lat = link.dataset.lat;
  const lng = link.dataset.lng;

  if (!lat || !lng || lat.includes("위도") || lng.includes("경도")) {
    alert("주차장 위치 정보가 아직 등록되지 않았습니다.");
    return;
  }

  openNaverNavigation({ name, lat, lng });
});

function openNaverNavigation({ name, lat, lng }) {
  const encodedName = encodeURIComponent(name);
  const appName = encodeURIComponent(window.location.hostname || "wedding-invitation");

  const naverNavigationUrl =
    `nmap://navigation` +
    `?dlat=${lat}` +
    `&dlng=${lng}` +
    `&dname=${encodedName}` +
    `&appname=${appName}`;

  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(userAgent);

  if (isAndroid) {
    const androidIntentUrl =
      `intent://navigation` +
      `?dlat=${lat}` +
      `&dlng=${lng}` +
      `&dname=${encodedName}` +
      `&appname=${appName}` +
      `#Intent;scheme=nmap;` +
      `action=android.intent.action.VIEW;` +
      `category=android.intent.category.BROWSABLE;` +
      `package=com.nhn.android.nmap;end`;

    window.location.href = androidIntentUrl;
    return;
  }

  if (isIOS) {
    window.location.href = naverNavigationUrl;
    return;
  }

  window.open(
    `https://map.naver.com/p/search/${encodedName}`,
    "_blank",
    "noopener,noreferrer"
  );
}

const snowContainer = document.getElementById("snow-container");

const snowflakeImages = [
  "images/snowflake1.png",
  "images/snowflake2.png",
  "images/snowflake3.png",
  "images/snowflake4.png",
  "images/snowflake5.png"
];

function createSnowflake() {
  if (!snowContainer) return;

  const snowflake = document.createElement("img");

  const randomImage =
    snowflakeImages[
      Math.floor(Math.random() * snowflakeImages.length)
    ];

  const size = 12 + Math.random() * 20;
  const duration = 14 + Math.random() * 14;
  const delay = -(Math.random() * duration);
  const startPosition = Math.random() * 100;
  const opacity = 0.22 + Math.random() * 0.45;

  snowflake.src = randomImage;
  snowflake.alt = "";
  snowflake.setAttribute("aria-hidden", "true");
  snowflake.className = "snowflake";

  snowflake.style.width = `${size}px`;
  snowflake.style.left = `${startPosition}vw`;
  snowflake.style.opacity = opacity;
  snowflake.style.animationDuration = `${duration}s`;
  snowflake.style.animationDelay = `${delay}s`;

  snowContainer.appendChild(snowflake);
}

const snowflakeCount = window.innerWidth <= 480 ? 14 : 20;

for (let i = 0; i < snowflakeCount; i += 1) {
  createSnowflake();
}

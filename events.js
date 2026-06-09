// ======================================================
// EVENTS.JS
// Zero Waste Events
// - Load events from Apps Script
// - Filter upcoming / future / past / cancelled
// - Countdown updates without re-rendering whole page
// - Past summary counter animates only once
// ======================================================

let eventDatabase = [];
let currentEventFilter = "upcoming";
let counterAnimated = false;

// ======================================================
// Debug Helpers
// ======================================================

function eventDebug(step, data){
  if(typeof APP_CONFIG !== "undefined" && APP_CONFIG.debugMode){
    console.log(`📅 [EVENT DEBUG] ${step}`, data || "");
  }
}

function eventError(step, error){
  console.error(`❌ [EVENT ERROR] ${step}`, error);
}

// ======================================================
// Load Events
// ======================================================

async function loadEventsFromSheet(){
  console.group("📅 loadEventsFromSheet");

  const list = document.getElementById("eventList");

  if(!list){
    eventError("eventList element not found", "HTML ไม่มี id='eventList'");
    console.groupEnd();
    return;
  }

  list.innerHTML = `<p class="small">กำลังโหลดกิจกรรม...</p>`;

  try{
    eventDebug("1. Function started");

    if(typeof EVENTS_API_URL === "undefined" || !EVENTS_API_URL){
      throw new Error("EVENTS_API_URL is missing. Check config.js");
    }

    eventDebug("2. EVENTS_API_URL", EVENTS_API_URL);

    const response = await fetch(EVENTS_API_URL,{
      method:"POST",
      headers:{
        "Content-Type":"text/plain;charset=utf-8"
      },
      body:JSON.stringify({
        action:"getEvents"
      })
    });

    eventDebug("3. API response", {
      ok:response.ok,
      status:response.status,
      statusText:response.statusText
    });

    const rawText = await response.text();

    eventDebug("4. Raw response", rawText);

    let result;

    try{
      result = JSON.parse(rawText);
    }catch(parseError){
      eventError("JSON parse failed", parseError);
      throw new Error("API response ไม่ใช่ JSON: " + rawText.slice(0, 200));
    }

    eventDebug("5. Parsed result", result);

    if(result.error){
      throw new Error(result.message || result.reason || "โหลดกิจกรรมไม่สำเร็จ");
    }

    if(!Array.isArray(result.events)){
      throw new Error("result.events ไม่ใช่ array หรือไม่มี events ใน response");
    }

    eventDatabase = result.events;

    eventDebug("6. eventDatabase loaded", {
      total:eventDatabase.length,
      firstEvent:eventDatabase[0] || null
    });

    counterAnimated = false;
    renderEvents();

  }catch(error){
    eventError("loadEventsFromSheet failed", error);

    list.innerHTML = `
      <p class="small">
        โหลดกิจกรรมไม่สำเร็จ: ${error.message}
      </p>
    `;
  }finally{
    console.groupEnd();
  }
}

// ======================================================
// Filter
// ======================================================

function setEventFilter(filter, index){
  console.group("📌 setEventFilter");

  eventDebug("Filter clicked", { filter, index });

  currentEventFilter = filter;

  if(filter !== "past"){
    counterAnimated = false;
  }

  document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.classList.remove("active");
  });

  const buttons = document.querySelectorAll(".filter-btn");
  buttons[index]?.classList.add("active");

  const indicator = document.getElementById("filterIndicator");

  if(indicator){
    indicator.style.transform = `translateX(${index * 100}%)`;
  }

  renderEvents();

  console.groupEnd();
}

// ======================================================
// Event Helpers
// ======================================================

function getEventComputedStatus(event){
  return event.status || "future";
}

function getEventKey(event){
  return String(
    event.id ||
    event.eventId ||
    `${event.title || "event"}-${event.date || ""}-${event.startTime || ""}`
  );
}

function convertMs(ms){
  const secondsTotal = Math.max(0, Math.floor(ms / 1000));

  return {
    days:Math.floor(secondsTotal / 86400),
    hours:Math.floor((secondsTotal % 86400) / 3600),
    minutes:Math.floor((secondsTotal % 3600) / 60),
    seconds:secondsTotal % 60
  };
}

function getEventTiming(event){
  const now = new Date();

  const start = new Date(`${event.date}T${event.startTime || "00:00"}:00`);
  const end = new Date(`${event.date}T${event.endTime || "23:59"}:00`);

  if(isNaN(start.getTime())){
    return {
      state:"unknown",
      days:0,
      hours:0,
      minutes:0,
      seconds:0
    };
  }

  if(now < start){
    return {
      state:"before",
      ...convertMs(start - now)
    };
  }

  if(now >= start && now <= end){
    return {
      state:"live",
      ...convertMs(end - now)
    };
  }

  return {
    state:"ended",
    days:0,
    hours:0,
    minutes:0,
    seconds:0
  };
}

// ======================================================
// Render Countdown
// ======================================================

function renderCountdown(event){
  const timing = getEventTiming(event);

  if(timing.state === "unknown"){
    return `
      <div class="ended-banner">
        ไม่พบข้อมูลวันเวลา
      </div>
    `;
  }

  if(timing.state === "live"){
    return `
      <div class="live-banner">
        🟢 กำลังจัดกิจกรรมอยู่ตอนนี้
        <span>
          เหลือเวลา ${timing.hours} ชม.
          ${timing.minutes} นาที
          ${timing.seconds} วิ
        </span>
      </div>
    `;
  }

  if(timing.state === "ended"){
    return `
      <div class="ended-banner">
        ✅ กิจกรรมสิ้นสุดแล้ว
      </div>
    `;
  }

  return `
    <div class="countdown">
      <div class="countdown-box">
        <div class="countdown-value">${timing.days}</div>
        <div class="countdown-label">วัน</div>
      </div>

      <div class="countdown-box">
        <div class="countdown-value">${timing.hours}</div>
        <div class="countdown-label">ชั่วโมง</div>
      </div>

      <div class="countdown-box">
        <div class="countdown-value">${timing.minutes}</div>
        <div class="countdown-label">นาที</div>
      </div>

      <div class="countdown-box">
        <div class="countdown-value">${timing.seconds}</div>
        <div class="countdown-label">วินาที</div>
      </div>
    </div>
  `;
}

// ======================================================
// Render Events
// ======================================================

function renderEvents(){
  console.group("🧩 renderEvents");

  const list = document.getElementById("eventList");

  if(!list){
    eventError("eventList not found", "HTML ไม่มี id='eventList'");
    console.groupEnd();
    return;
  }

  eventDebug("Render started", {
    currentEventFilter,
    totalEvents:eventDatabase.length
  });

  list.innerHTML = "";

  if(!Array.isArray(eventDatabase) || eventDatabase.length === 0){
    list.innerHTML = `<p class="small">ยังไม่พบข้อมูลกิจกรรม</p>`;
    console.groupEnd();
    return;
  }

  const events = eventDatabase
    .map(event => ({
      ...event,
      computedStatus:getEventComputedStatus(event)
    }))
    .filter(event => event.computedStatus === currentEventFilter);

  eventDebug("Filtered events", {
    filter:currentEventFilter,
    count:events.length,
    events
  });

  if(currentEventFilter === "past"){
    events.sort((a,b)=> new Date(b.date) - new Date(a.date));
    renderPastSummaryCards(list);
  }else{
    events.sort((a,b)=> new Date(a.date) - new Date(b.date));
  }

  if(events.length === 0){
    list.innerHTML += `<p class="small">ยังไม่มีกิจกรรมในหมวดนี้</p>`;
    console.groupEnd();
    return;
  }

  events.forEach(event=>{
    const card = document.createElement("div");
    card.className = "event-card";

    if(event.computedStatus === "past"){
      card.innerHTML = renderPastEvent(event);
    }else{
      card.innerHTML = renderActiveEvent(event);
    }

    list.appendChild(card);
  });

  if(currentEventFilter === "past" && !counterAnimated){
    animateCounters();
    counterAnimated = true;
  }

  eventDebug("Render done");

  console.groupEnd();
}

// ======================================================
// Past Summary Cards
// ======================================================

function renderPastSummaryCards(list){
  let recycleWaste = 0;
  let recycleCo2 = 0;
  let recycleTrees = 0;

  let mobileWaste = 0;
  let mobileCo2 = 0;
  let mobileTrees = 0;

  eventDatabase.forEach(ev=>{
    if(getEventComputedStatus(ev) === "past"){
      if(ev.title === "ขยะรีไซเคิล"){
        recycleWaste += Number(ev.wasteCollectedKg || 0);
        recycleCo2 += Number(ev.co2ReducedKg || 0);
        recycleTrees += Number(ev.treeEquivalent || 0);
      }else if(ev.title === "ขยะกำพร้าสัญจร"){
        mobileWaste += Number(ev.wasteCollectedKg || 0);
        mobileCo2 += Number(ev.co2ReducedKg || 0);
        mobileTrees += Number(ev.treeEquivalent || 0);
      }
    }
  });

  const recycleCard = document.createElement("div");
  recycleCard.className = "overall-impact-card recycle-summary-card";

  recycleCard.innerHTML = `
    <div class="overall-badge" style="background:#e8f5e9;color:#2e7d32;">
      ♻️ RECYCLE CONTRIBUTION
    </div>

    <div class="overall-header">
      ความสำเร็จร่วมกัน: ขยะรีไซเคิล
    </div>

    <p class="overall-subtitle">
      จากกิจกรรมขยะรีไซเคิลทั้งหมดที่ผ่านมา
    </p>

    <div class="overall-grid">
      <div class="overall-item">
        <span class="overall-icon">♻️</span>
        <div class="overall-num animate-num" data-target="${recycleWaste}">0</div>
        <div class="overall-lbl">ขยะรีไซเคิลสะสม (Kg.)</div>
      </div>

      <div class="overall-item">
        <span class="overall-icon">🌍</span>
        <div class="overall-num animate-num" data-target="${recycleCo2}">0</div>
        <div class="overall-lbl">ลดคาร์บอนสะสม (Kg.CO₂eq)</div>
      </div>

      <div class="overall-item">
        <span class="overall-icon">🌳</span>
        <div class="overall-num animate-num" data-target="${recycleTrees}">0</div>
        <div class="overall-lbl">เทียบเท่าปลูกต้นไม้ (ต้น)</div>
      </div>
    </div>
  `;

  list.appendChild(recycleCard);

  const mobileCard = document.createElement("div");
  mobileCard.className = "overall-impact-card mobile-summary-card";
  mobileCard.style.marginTop = "24px";

  mobileCard.innerHTML = `
    <div class="overall-badge" style="background:#fff3e0;color:#ef6c00;">
      🚚 MOBILE WASTE CONTRIBUTION
    </div>

    <div class="overall-header">
      ความสำเร็จร่วมกัน: ขยะกำพร้าสัญจร
    </div>

    <p class="overall-subtitle">
      จากกิจกรรมขยะกำพร้าสัญจรทั้งหมดที่ผ่านมา
    </p>

    <div class="overall-grid">
      <div class="overall-item">
        <span class="overall-icon">📦</span>
        <div class="overall-num animate-num" data-target="${mobileWaste}">0</div>
        <div class="overall-lbl">ขยะกำพร้าสะสม (Kg.)</div>
      </div>

      <div class="overall-item">
        <span class="overall-icon">🌍</span>
        <div class="overall-num animate-num" data-target="${mobileCo2}">0</div>
        <div class="overall-lbl">ลดคาร์บอนสะสม (Kg.CO₂eq)</div>
      </div>

      <div class="overall-item">
        <span class="overall-icon">🌳</span>
        <div class="overall-num animate-num" data-target="${mobileTrees}">0</div>
        <div class="overall-lbl">เทียบเท่าปลูกต้นไม้ (ต้น)</div>
      </div>
    </div>
  `;

  list.appendChild(mobileCard);
}

// ======================================================
// Render Active Event
// ======================================================

function renderActiveEvent(event){
  const statusText = {
    upcoming:"Upcoming",
    future:"Future",
    cancelled:"Cancelled"
  }[event.computedStatus] || "Future";

  const eventKey = getEventKey(event);

  const countdownHtml =
    event.computedStatus === "cancelled"
      ? ""
      : renderCountdown(event);

  const mapButton =
    event.computedStatus !== "cancelled" && event.mapUrl
      ? `
        <a class="map-btn"
           href="${event.mapUrl}"
           target="_blank"
           rel="noopener">
          📍 เปิด Google Maps
        </a>
      `
      : "";

  return `
    <div class="event-top">
      <div>
        <div class="event-title">${event.title || "-"}</div>

        <div class="event-meta">
          ${formatThaiDate(event.date)}
          | ${event.startTime || "-"} - ${event.endTime || "-"}
        </div>

        <div class="event-meta">
          📍 ${event.location || "-"}
        </div>
      </div>

      <span class="status-pill status-${event.computedStatus}">
        ${statusText}
      </span>
    </div>

    <div class="event-countdown-slot"
         data-event-id="${eventKey}">
      ${countdownHtml}
    </div>

    ${mapButton}

    <div class="event-note">
      ${event.detail || ""}
    </div>
  `;
}

// ======================================================
// Render Past Event
// ======================================================

function renderPastEvent(event){
  return `
    <div class="event-top">
      <div>
        <div class="event-title">
          ✅ ${event.title || "-"}
        </div>

        <div class="event-meta">
          ${formatThaiDate(event.date)} | ${event.location || "-"}
        </div>
      </div>

      <span class="status-pill status-past">
        Past
      </span>
    </div>

    <div class="impact-row">
      <div class="impact-card impact-recycle">
        <div class="impact-icon">♻️</div>
        <div class="impact-value">${event.wasteCollectedKg || 0}</div>
        <div class="impact-unit">Kg.</div>
        <div class="impact-label">ขยะที่ส่งไปรีไซเคิล</div>
      </div>

      <div class="impact-card impact-carbon">
        <div class="impact-icon">🌍</div>
        <div class="impact-value">${event.co2ReducedKg || 0}</div>
        <div class="impact-unit">Kg.CO₂eq</div>
        <div class="impact-label">คาร์บอนที่ลดได้</div>
      </div>

      <div class="impact-card impact-tree">
        <div class="impact-icon">🌳</div>
        <div class="impact-value">${event.treeEquivalent || 0}</div>
        <div class="impact-unit">ต้น</div>
        <div class="impact-label">เทียบเท่าการปลูกต้นไม้</div>
      </div>
    </div>

    <div class="event-note">
      ${event.detail || ""}
    </div>
  `;
}

// ======================================================
// Countdown Update Only
// ======================================================

function updateEventCountdowns(){
  if(currentEventFilter === "past") return;

  const slots = document.querySelectorAll(".event-countdown-slot");

  slots.forEach(slot=>{
    const eventId = slot.dataset.eventId;

    const event = eventDatabase.find(ev =>
      getEventKey(ev) === String(eventId)
    );

    if(!event) return;

    if(getEventComputedStatus(event) === "cancelled") return;

    slot.innerHTML = renderCountdown(event);
  });
}

// ======================================================
// Utils
// ======================================================

function formatThaiDate(dateString){
  if(!dateString) return "-";

  const date = new Date(dateString);

  if(isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("th-TH", {
    day:"numeric",
    month:"short",
    year:"numeric"
  });
}

function animateCounters(){
  const counters = document.querySelectorAll(".animate-num");
  const speed = 40;

  eventDebug("animateCounters started", counters.length);

  counters.forEach(counter=>{
    const target = Number(counter.getAttribute("data-target") || 0);

    const animate = ()=>{
      const current = Number(counter.innerText.replace(/,/g, "")) || 0;
      const increment = Math.ceil(target / speed);

      if(current < target){
        counter.innerText = Math.min(target, current + increment).toLocaleString();
        setTimeout(animate, 20);
      }else{
        counter.innerText = target.toLocaleString();
      }
    };

    animate();
  });
}
(function () {
  const data = window.CLINICSOFT_DATA;
  const $ = (selector) => document.querySelector(selector);
  const initials = (name) => name.replace(/^د\/?\s*/, "").trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("");
  const iconFor = (name) => name.includes("أسنان") ? "✦" : name.includes("أطفال") ? "♧" : name.includes("علاج") ? "⌁" : name.includes("رمد") ? "◉" : name.includes("جلد") ? "✧" : name.includes("تغذية") ? "⌁" : "✚";

  $("#year").textContent = new Date().getFullYear();
  $("[data-stat=clinics]").textContent = data.clinics.length;
  $("[data-stat=doctors]").textContent = data.doctors.length;
  $("[data-stat=services]").textContent = data.services.length;

  $("#clinic-grid").innerHTML = data.clinics.map((clinic, index) => `
    <article class="clinic-card"><div class="clinic-icon">${iconFor(clinic.name)}</div><div><h3>${clinic.name}</h3><p>${clinic.location} · ${clinic.headDoctor}</p></div><span class="arrow">←</span></article>`).join("");

  const specialties = [...new Set(data.doctors.map((doctor) => doctor.specialty))].sort((a, b) => a.localeCompare(b, "ar"));
  $("#doctor-filter").insertAdjacentHTML("beforeend", specialties.map((specialty) => `<option value="${specialty}">${specialty}</option>`).join(""));
  const renderDoctors = () => {
    const term = $("#doctor-search").value.trim().toLowerCase();
    const specialty = $("#doctor-filter").value;
    const doctors = data.doctors.filter((doctor) => (!term || `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(term)) && (specialty === "all" || doctor.specialty === specialty));
    $("#doctor-grid").innerHTML = doctors.map((doctor, index) => `<article class="doctor-card"><div class="doctor-avatar avatar-${index % 5}">${initials(doctor.name)}</div><div class="doctor-info"><h3>${doctor.name}</h3><span class="specialty">${doctor.specialty}</span><p class="doctor-note">تواصل معنا لمعرفة الموعد المتاح</p><a class="mini-link" href="https://wa.me/201200193158" target="_blank" rel="noreferrer">استفسر عن الموعد <span>←</span></a></div></article>`).join("");
    $("#doctor-empty").hidden = doctors.length > 0;
  };
  $("#doctor-search").addEventListener("input", renderDoctors);
  $("#doctor-filter").addEventListener("change", renderDoctors);
  renderDoctors();

  $("#service-grid").innerHTML = data.services.map((service, index) => `<article class="service-card"><div class="service-number">${String(index + 1).padStart(2, "0")}</div><div><h3>${service.name}</h3><p>${service.description}</p></div></article>`).join("");

  const modal = $("#image-modal");
  const modalImage = $("#modal-image");
  const modalTitle = $("#modal-title");
  const closeModal = () => { modal.hidden = true; document.body.classList.remove("modal-open"); modalImage.src = ""; };
  document.querySelectorAll(".photo-card").forEach((card) => card.addEventListener("click", () => {
    const image = card.querySelector("img");
    modalImage.src = card.dataset.image;
    modalImage.alt = image.alt;
    modalImage.style.objectPosition = card.dataset.position || "center";
    modalTitle.textContent = card.querySelector("b").textContent;
    modal.hidden = false;
    document.body.classList.add("modal-open");
  }));
  modal.querySelectorAll("[data-close-modal]").forEach((element) => element.addEventListener("click", closeModal));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closeModal(); });
})();

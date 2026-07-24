/* ==========================================================================
   HAKAI ART AGENCY - Main Application Logic
   Owner: Trần Đình Tuấn
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  // State
  let allArtworks = [];
  let currentFilter = "all";
  let searchQuery = "";
  let activeArtwork = null;
  let selectedUploadFile = null;

  // DOM Elements
  const galleryGrid = document.getElementById("galleryGrid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("searchInput");
  const totalCountEl = document.getElementById("statTotalArtworks");

  // Modals
  const detailModal = document.getElementById("detailModal");
  const closeDetailBtn = document.getElementById("closeDetailBtn");
  const uploadModal = document.getElementById("uploadModal");
  const closeUploadBtn = document.getElementById("closeUploadBtn");
  const openUploadBtns = document.querySelectorAll(".btn-open-upload");

  // Upload Form Elements
  const uploadForm = document.getElementById("uploadForm");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const uploadPreview = document.getElementById("uploadPreview");
  const videoPreview = document.getElementById("videoPreview");

  // Toast Container
  const toastContainer = document.getElementById("toastContainer");

  // 1. Initialize & Fetch Data
  async function loadData() {
    try {
      const customItems = await window.hakaiStorage.getAllUploadedArtworks();
      // Combine custom uploaded items (first) with initial template items
      allArtworks = [...customItems, ...INITIAL_ARTWORKS];
      updateStats();
      renderGallery();
      // Check if URL contains direct link to artwork
      handleHashRoute();
    } catch (err) {
      console.error("Failed to load items:", err);
      allArtworks = [...INITIAL_ARTWORKS];
      renderGallery();
      handleHashRoute();
    }
  }

  function updateStats() {
    if (totalCountEl) {
      totalCountEl.textContent = allArtworks.length;
    }
  }

  // 2. Render Gallery Cards
  function renderGallery() {
    galleryGrid.innerHTML = "";

    const filtered = allArtworks.filter(item => {
      const matchesCategory = currentFilter === "all" || item.category === currentFilter;
      const matchesSearch = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      galleryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎨</div>
          <h3>Chưa có tác phẩm nào phù hợp</h3>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">Hãy thử tìm kiếm từ khóa khác hoặc đăng tác phẩm mới ngay!</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "artwork-card";

      const isVideo = item.mediaType === "video";
      const mediaBadgeHTML = isVideo 
        ? `<div class="media-type-badge">▶ Video</div>` 
        : `<div class="media-type-badge">📷 Image</div>`;

      let mediaElementHTML = '';
      if (isVideo) {
        mediaElementHTML = `<video class="artwork-media" src="${item.src}" preload="metadata" muted></video>`;
      } else {
        mediaElementHTML = `<img class="artwork-media" src="${item.src}" alt="${item.title}" loading="lazy">`;
      }

      card.innerHTML = `
        <div class="artwork-media-wrap">
          ${mediaElementHTML}
          ${mediaBadgeHTML}
        </div>
        <div class="artwork-info">
          <span class="artwork-category">${item.categoryLabel || item.category}</span>
          <h3 class="artwork-title">${item.title}</h3>
          <div class="artwork-author">
            <div class="author-avatar">${item.author ? item.author.charAt(0) : 'T'}</div>
            <span>${item.author || "Trần Đình Tuấn"}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => openDetailModal(item, true));
      galleryGrid.appendChild(card);
    });
  }

  // 3. Filter & Search Event Listeners
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderGallery();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderGallery();
    });
  }

  // 4. Detail View Modal & Deep Linking Logic
  function openDetailModal(item, updateHash = true) {
    activeArtwork = item;
    const mediaContainer = document.getElementById("detailMediaContainer");
    const titleEl = document.getElementById("detailTitle");
    const categoryEl = document.getElementById("detailCategory");
    const authorEl = document.getElementById("detailAuthor");
    const descEl = document.getElementById("detailDesc");
    const dateEl = document.getElementById("detailDate");
    const tagsContainer = document.getElementById("detailTags");
    const deleteBtn = document.getElementById("btnDeleteArtwork");
    const downloadBtn = document.getElementById("btnDownloadArtwork");

    titleEl.textContent = item.title;
    categoryEl.textContent = item.categoryLabel || item.category;
    authorEl.textContent = item.author || "Trần Đình Tuấn";
    descEl.textContent = item.description || "Tác phẩm độc quyền từ HaKai Art Agency.";
    dateEl.textContent = item.date || new Date().toISOString().split('T')[0];

    // Render Media (Image or Video)
    if (item.mediaType === "video") {
      mediaContainer.innerHTML = `<video controls autoplay class="modal-media-player" src="${item.src}" style="max-width:100%; max-height:80vh;"></video>`;
    } else {
      mediaContainer.innerHTML = `<img src="${item.src}" alt="${item.title}" style="max-width:100%; max-height:80vh; object-fit:contain;">`;
    }

    // Render Tags
    tagsContainer.innerHTML = "";
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "tag-pill";
        span.textContent = `#${tag}`;
        tagsContainer.appendChild(span);
      });
    }

    // Download Button Action
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = item.src;
      a.download = `${item.title.replace(/\s+/g, '_')}_HakaiArt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Bắt đầu tải tác phẩm về máy!");
    };

    // Delete Button Action (Only for user-uploaded custom items)
    if (item.isCustom) {
      deleteBtn.style.display = "inline-flex";
      deleteBtn.onclick = async () => {
        if (confirm("Bạn có chắc chắn muốn xóa tác phẩm này khỏi bộ sưu tập?")) {
          await window.hakaiStorage.deleteArtwork(item.id);
          closeDetailModalFunc(true);
          showToast("Đã xóa tác phẩm thành công!");
          loadData();
        }
      };
    } else {
      deleteBtn.style.display = "none";
    }

    // Update URL hash to unique artwork link
    if (updateHash) {
      window.history.pushState(null, "", `#artwork-${item.id}`);
    }

    detailModal.classList.add("active");
  }

  function closeDetailModalFunc(updateHash = true) {
    detailModal.classList.remove("active");
    const mediaContainer = document.getElementById("detailMediaContainer");
    mediaContainer.innerHTML = ""; // Stop video playback

    if (updateHash && window.location.hash.startsWith("#artwork-")) {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }
  }

  // Handle URL hash changes (Direct Link & Browser Back/Forward buttons)
  function handleHashRoute() {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#artwork-")) {
      const artworkId = hash.replace("#artwork-", "");
      const target = allArtworks.find(a => a.id === artworkId);
      if (target) {
        openDetailModal(target, false);
      }
    } else {
      if (detailModal.classList.contains("active")) {
        closeDetailModalFunc(false);
      }
    }
  }

  window.addEventListener("hashchange", handleHashRoute);

  if (closeDetailBtn) closeDetailBtn.addEventListener("click", () => closeDetailModalFunc(true));
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) closeDetailModalFunc(true);
  });

  // 5. Upload Modal Logic
  openUploadBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      uploadModal.classList.add("active");
    });
  });

  function closeUploadModalFunc() {
    uploadModal.classList.remove("active");
    uploadForm.reset();
    uploadPreview.style.display = "none";
    videoPreview.style.display = "none";
    selectedUploadFile = null;
  }

  if (closeUploadBtn) closeUploadBtn.addEventListener("click", closeUploadModalFunc);
  uploadModal.addEventListener("click", (e) => {
    if (e.target === uploadModal) closeUploadModalFunc();
  });

  // Dropzone Events
  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  });

  function handleFileSelection(file) {
    selectedUploadFile = file;
    const isVideo = file.type.startsWith("video/");

    const reader = new FileReader();
    reader.onload = (e) => {
      if (isVideo) {
        uploadPreview.style.display = "none";
        videoPreview.style.display = "block";
        videoPreview.src = e.target.result;
      } else {
        videoPreview.style.display = "none";
        uploadPreview.style.display = "block";
        uploadPreview.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }

  // Handle Form Submission
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedUploadFile) {
      alert("Vui lòng chọn 1 tệp ảnh hoặc video để tải lên!");
      return;
    }

    const title = document.getElementById("upTitle").value.trim();
    const category = document.getElementById("upCategory").value;
    const author = document.getElementById("upAuthor").value.trim() || "Trần Đình Tuấn";
    const desc = document.getElementById("upDesc").value.trim();
    const tagsInput = document.getElementById("upTags").value.trim();

    const isVideo = selectedUploadFile.type.startsWith("video/");
    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target.result;

      const categoryLabels = {
        "visual-art": "Visual Art",
        "digital-art": "Digital Art",
        "3d-art": "3D Art",
        "video": "Video & Animation"
      };

      const newArtwork = {
        id: "upload-" + Date.now(),
        title: title,
        category: category,
        categoryLabel: categoryLabels[category] || "Visual Art",
        mediaType: isVideo ? "video" : "image",
        src: dataUrl,
        author: author,
        description: desc,
        date: new Date().toISOString().split('T')[0],
        tags: tagsInput ? tagsInput.split(',').map(t => t.trim()) : ["HaKai"],
        isCustom: true
      };

      await window.hakaiStorage.saveArtwork(newArtwork);
      closeUploadModalFunc();
      showToast("Đã tải lên tác phẩm thành công!");
      await loadData();
      // Open newly uploaded artwork with its own URL link!
      openDetailModal(newArtwork, true);
    };

    reader.readAsDataURL(selectedUploadFile);
  });

  // Helper Toast Notification
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  // 6. Share Direct Link Action
  const btnShare = document.getElementById("btnShareArtwork");
  if (btnShare) {
    btnShare.addEventListener("click", () => {
      if (activeArtwork) {
        const directUrl = window.location.origin + window.location.pathname + window.location.search + `#artwork-${activeArtwork.id}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(directUrl);
          showToast("Đã sao chép đường link riêng của tác phẩm!");
        } else {
          prompt("Đường link trực tiếp của tác phẩm:", directUrl);
        }
      }
    });
  }

  // Start Application
  loadData();
});

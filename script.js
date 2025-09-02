const photoPreview = document.getElementById('photoPreview');
    const photoUpload = document.getElementById('photoUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const cardPreview = document.getElementById('cardPreview');
    const cardForm = document.getElementById('cardForm');
    const actionButtons = document.getElementById('actionButtons');
    const shareBtn = document.getElementById('shareBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const successToast = document.getElementById('successToast');
    const toastMessage = document.getElementById('toastMessage');

    let uploadedPhotoData = null;

    uploadBtn.addEventListener('click', () => photoUpload.click());
    photoPreview.addEventListener('click', () => photoUpload.click());


    photoUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file (JPG, PNG)');
        photoUpload.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB');
        photoUpload.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedPhotoData = event.target.result;
        photoPreview.innerHTML = `<img src="${uploadedPhotoData}" alt="Profile Photo" class="photo-preview" />`;
      };
      reader.readAsDataURL(file);
    });

    function generateCardHTML(name, email, instagram) {
      let instaUser  = instagram;
      try {
        const url = new URL(instagram);
        instaUser  = url.pathname.replace(/\//g, '');
      } catch {
        instaUser  = instagram;
      }
      instaUser  = instaUser  ? '@' + instaUser  : '';

      let photoHTML = '';
      if (uploadedPhotoData) {
        photoHTML = `<img src="${uploadedPhotoData}" alt="Profile Photo" class="photo-preview" />`;
      } else {
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();
        photoHTML = `<div class="avatar-placeholder">${initials}</div>`;
      }

      return `
        <div id="cardHeader">
          <h2>${name}</h2>
          <p>Digital Business Card</p>
        </div>
        <div id="cardBody">
          <div class="info">
            ${photoHTML}
            <div>
              <h3>${name}</h3>
              <p>${email}</p>
              <p class="text-blue-600">${instaUser }</p>
            </div>
          </div>
          <div class="connect">
            <h4>CONNECT WITH ME</h4>
            <a href="${instagram}" target="_blank" class="instagram" title="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="mailto:${email}" class="email" title="Email">
              <i class="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      `;
    }

    function showToast(message) {
      toastMessage.textContent = message;
      successToast.classList.add('show');
      setTimeout(() => successToast.classList.remove('show'), 3000);
    }
    
    cardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = cardForm.name.value.trim();
      const email = cardForm.email.value.trim();
      const instagram = cardForm.instagram.value.trim();

      if (!name || !email || !instagram) {
        showToast('Please fill all required fields');
        return;
      }

      cardPreview.innerHTML = generateCardHTML(name, email, instagram);
      actionButtons.classList.remove('hidden');
      showToast('Business card generated!');
    });

    shareBtn.addEventListener('click', () => {
      const name = cardForm.name.value.trim();
      const email = cardForm.email.value.trim();
      if (navigator.share) {
        navigator
          .share({
            title: `${name}'s Business Card`,
            text: `Connect with ${name} - ${email}`,
            url: window.location.href,
          })
          .catch(() => showToast('Sharing failed or cancelled'));
      } else {
        showToast('Sharing not supported on this browser');
      }
    });

    downloadBtn.addEventListener('click', () => {
      if (!cardPreview.innerHTML.trim()) {
        showToast('Please generate the card first');
        return;
      }
      showToast('Preparing download...');
      html2canvas(cardPreview, { scale: 2, useCORS: true, backgroundColor: null }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${cardForm.name.value.trim().replace(/\s+/g, '_')}_business_card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('Card downloaded!');
      }).catch(() => {
        showToast('Failed to download card');
      });
    });

    copyBtn.addEventListener('click', () => {
      const name = cardForm.name.value.trim();
      const email = cardForm.email.value.trim();
      const instagram = cardForm.instagram.value.trim();
      const text = `Name: ${name}\nEmail: ${email}\nInstagram: ${instagram}`;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Profile info copied to clipboard');
      }).catch(() => {
        showToast('Failed to copy profile info');
      });
    });

    window.addEventListener('load', () => {
      cardPreview.innerHTML = `
        <div id="cardHeader">
          <h2>Your Name</h2>
          <p>Digital Business Card</p>
        </div>
        <div id="cardBody">
          <div class="info">
            <div class="avatar-placeholder">?</div>
            <div>
              <h3>Your Name</h3>
              <p>your.email@example.com</p>
              <p class="text-blue-600">@yourusername</p>
            </div>
          </div>
          <div class="connect">
            <h4>CONNECT WITH ME</h4>
            <a href="#" class="instagram" title="Instagram" onclick="return false;">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="mailto:your.email@example.com" class="email" title="Email" onclick="return false;">
              <i class="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      `;
    });
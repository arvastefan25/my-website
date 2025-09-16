// simple client-side validation + summary modal + JSON download
const form = document.getElementById('fsForm');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');
const downloadLink = document.getElementById('downloadLink');
const resetBtn = document.getElementById('resetBtn');

function toggleModal(show) {
  modal.setAttribute('aria-hidden', show ? 'false' : 'true');
  if (show) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = '';
}

modalClose.addEventListener('click', () => toggleModal(false));
modalOk.addEventListener('click', () => toggleModal(false));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleModal(false); });

resetBtn.addEventListener('click', () => form.reset());

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // simple built-in validation
  if (!form.reportValidity()) return;

  const data = new FormData(form);

  // build an object to display — we will not upload anywhere
  const result = {
    nick: data.get('nick') || '',
    email: data.get('email') || '',
    platform: data.get('platform') || '',
    hoursPerWeek: Number(data.get('hours') || 0),
    favoriteMachine: data.get('favorite') || '',
    rating: data.get('rating') || '',
    agreed: data.get('agree') === 'on'
  };

  // if a screenshot file is present, read as dataURL (small preview)
  const file = data.get('screenshot');
  if (file && file.size && file.type.startsWith('image/')) {
    result.screenshotName = file.name;
    // read as base64 (optional, can be heavy)
    result.screenshotPreview = await fileToDataURL(file);
  }

  // show pretty JSON in modal
  const pretty = JSON.stringify(result, null, 2);
  modalBody.textContent = pretty;

  // prepare download link (client-side)
  const blob = new Blob([pretty], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadLink.href = url;

  toggleModal(true);
});

// helper to read file
function fileToDataURL(file){
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

const imageUpload = document.getElementById('imageUpload');
const applyFilter = document.getElementById('applyFilter');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadLink = document.getElementById('downloadLink');

let uploadedImage = null;

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      uploadedImage = img;
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

applyFilter.addEventListener('click', () => {
  if (!uploadedImage) return alert('Envie uma imagem primeiro!');
  ctx.drawImage(uploadedImage, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Filtro vermelho escuro intenso
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Aumenta o vermelho, mas reduz brilho geral
    r = Math.min(r * 1.15 + 20, 255);
    g = g * 0.3 + 5;
    b = b * 0.25;

    // Escurece o conjunto (puxa pra um vermelho mais denso)
    r *= 0.75;
    g *= 0.75;
    b *= 0.75;

    // Aumenta contraste
    const contrast = 1.1;
    r = ((r - 128) * contrast + 128);
    g = ((g - 128) * contrast + 128);
    b = ((b - 128) * contrast + 128);

    data[i] = Math.min(Math.max(r, 0), 255);
    data[i + 1] = Math.min(Math.max(g, 0), 255);
    data[i + 2] = Math.min(Math.max(b, 0), 255);
  }

  ctx.putImageData(imageData, 0, 0);

  downloadLink.classList.remove('hidden');
  downloadLink.href = canvas.toDataURL('image/png');
});

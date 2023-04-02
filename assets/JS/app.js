
function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader(); 
    reader.onload = () => {
      resolve(reader.result);
    }; 
    reader.onerror = reject; 
    reader.readAsArrayBuffer(file);
  })
}

let PDFDocument = PDFLib.PDFDocument;

const insertPDF = async () => {
  const pdfA = document.getElementById('file1').files[0];
  const pdfB = document.getElementById('file2').files[0];
  const pdfAName = pdfA.name;
  console.log(pdfAName);

  let bytesA = await readFileAsync(pdfA);
  let bytesB = await readFileAsync(pdfB);
  const pdf1 = await PDFDocument.load(bytesA);
  const pdf2 = await PDFDocument.load(bytesB);

  const numPages = pdf2.getPageCount();
  for (let i = 0; i < numPages; i++) {
    const [existingPage] = await pdf1.copyPages (pdf2, [i]);
    console.log(pdf2.getPageIndices())

    pdf1.insertPage(2 + i, existingPage);
  }

  const pdfOk = await pdf1.save();

  download(pdfOk, `pdf merged`, 'application/pdf')

}

const inputRemover = document.querySelector('#numPage');

const removerPagina = async (indexPagina) => {
  const numPagina = parseInt(indexPagina - 1);
  const pdfA = document.getElementById('file1').files[0];
  let bytesA = await readFileAsync(pdfA);
  const pdf1 = await PDFDocument.load(bytesA);
  erroNumPaginas(pdf1, numPagina);
  pdf1.removePage(numPagina);
  const pdfOk = await pdf1.save();
  download(pdfOk, `pdf page removed`, 'application/pdf')
}

const erroNumPaginas = (totalPagPdf, numPagDel) => {
  if (totalPagPdf.getPageCount() <= numPagDel) {
    alert('O número da página é maior que o número de páginas do PDF');
    return;
  } else if (totalPagPdf.getPageCount() === 0) {
    alert('O PDF não possui páginas');
    return;
  }
}


const convertJPEGtoPDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const img = document.getElementById('file1').files[0];
  const nomeImg = img.name;
  const imageExt = nomeImg.split('.').pop();
  if (/(jpe?g)$/i.test(imageExt)) {
    const jpegBytes = await readFileAsync(img);
    const jpeg1 = await pdfDoc.embedJpg(jpegBytes);
    const redimensionaJpeg = jpeg1.scale(0.7);
    const pagina = pdfDoc.addPage();
    pagina.drawImage(jpeg1, {
      x: pagina.getWidth() / 2 - redimensionaJpeg.width / 2,
      y: pagina.getHeight() / 2 - redimensionaJpeg.height / 2,
      width: redimensionaJpeg.width,
      height: redimensionaJpeg.height,
    });
  } else if (/(png)$/i.test(imageExt)) {
    const pngBytes = await readFileAsync(img);
    const png1 = await pdfDoc.embedPng(pngBytes);
    const redimensionaPng = png1.scale(0.4);
    const paginaPng = pdfDoc.addPage();
    paginaPng.drawImage(png1, {
      x: paginaPng.getWidth() / 2 - redimensionaPng.width / 2,
      y: paginaPng.getHeight() / 2 - redimensionaPng.height / 2,
      width: redimensionaPng.width,
      height: redimensionaPng.height,
    });
  } else {
    console.log(imageExt)
    alert('O arquivo não é uma imagem');
  }

  const pdfOk = await pdfDoc.save();

  download(pdfOk, `pdf converted`, 'application/pdf');
}


function download(file, filename, type) {
  const link = document.getElementById('link');
  link.download = filename;
  let binaryData = [];
  binaryData.push(file);
  link.href = URL.createObjectURL(new Blob(binaryData, {type: type}))
}


const button = document.querySelector('.button');

button.addEventListener('click', () => {
  // removerPagina(inputRemover.value);
  convertJPEGtoPDF();
});



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


function download(file, filename, type) {
  const link = document.getElementById('link');
  link.download = filename;
  let binaryData = [];
  binaryData.push(file);
  link.href = URL.createObjectURL(new Blob(binaryData, {type: type}))
}


const button = document.querySelector('.button');

button.addEventListener('click', () => {
  removerPagina(inputRemover.value);
});


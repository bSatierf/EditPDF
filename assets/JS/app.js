
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

const insertPDF = async () => {
  let PDFDocument = PDFLib.PDFDocument;

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

function download(file, filename, type) {
  const link = document.getElementById('link');
  link.download = filename;
  let binaryData = [];
  binaryData.push(file);
  link.href = URL.createObjectURL(new Blob(binaryData, {type: type}))
}





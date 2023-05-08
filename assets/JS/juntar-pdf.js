import { app } from "./app.js";

//mudar texto label para nome do arquivo

const file = document.querySelector('#pdf1');
const file2 = document.querySelector('#pdf2');
const label = document.querySelector('.label-pdf1');
const label2 = document.querySelector('.label-pdf2');
const indexPage = document.querySelector('#numPage');
const mergePDF = document.querySelector('#merge-pdf');




const mostraNome = (file, label) => {
  const fileName = file.files[0];
  const labelName = label;
  labelName.innerHTML = fileName.name;
}

const mudaBotao = () => {
  
  mergePDF.innerHTML = 'Download';
  mergePDF.style.backgroundColor = 'green';
  mergePDF.style.color = 'white';
  mergePDF.style.borderColor = 'green';
  
  // download = document.querySelector('.juntar.download');
}

const retornaBotao = () => {
  mergePDF.innerHTML = 'Juntar';
  mergePDF.style.backgroundColor = null;
  mergePDF.style.color = null;
  mergePDF.style.borderColor = null;
}



file.addEventListener('change', () => {
  mostraNome(file, label);
  mergePDF.classList.remove('download');
  retornaBotao();
});
file2.addEventListener('change', () => {
  mostraNome(file2, label2);
});

// let download = null;

mergePDF.addEventListener('click', () => {

  app.juntarPDF(file, file2, indexPage)
  mergePDF.classList.add('download');
  // download = document.querySelector('.juntar.download');
  setTimeout(() => {
    if (mergePDF.className == 'juntar download') {
      mudaBotao()
    }
  }, 1000);
  // mergePDF.classList.add('download');
  console.log(mergePDF)
  
});




// download.addEventListener('click', () => {
//     app.juntarPDF(file, file2, indexPage)
//     console.log(download)
// });




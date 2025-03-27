const cuadromorado=document.querySelector('#miId');
function llamaDoubleClick (event){
    cuadromorado.textContent="hiciste DOUBLE CLICK"
}
function logEvent(evento){
    console.log(`El evento ${evento.type} fue disparado`);
}
//const cuadromorado=document.getElementById('miId')
cuadromorado.textContent='Este texto viene de JavaScript';
cuadromorado.innerText='Este texto reemplaza al anterior';
cuadromorado.innerHTML='<h1>Esto es un titulo</h1>'

const cuadrocyan=document.querySelector('.miclase');
cuadromorado.textContent='contenido en mi clase';

cuadromorado.addEventListener('click', ()=> {
 cuadromorado.textContent= "hiciste click en el cudro morado";

});

cuadromorado.addEventListener('dblclick',llamaDoubleClick);


cuadromorado.addEventListener('mouseover', logEvent);
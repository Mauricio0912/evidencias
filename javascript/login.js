let progress=0;
const progressBar = document.getElementById("progressBar");
function doProgressBar(){
    if(progress<100){
        progress+=10; //progress=progress+10
        progressBar.style.width=progress+ "%";
        progressBar.textContent=progress+ "%";
        setTimeout(doProgressBar,500);
    }
    else{
        progressBar.textContent="¡Proceso completo!";
    }
}
doProgressBar();
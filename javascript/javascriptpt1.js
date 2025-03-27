let num1=20;
let num2=10;
let suma=num1+num2;
let multi=num1*num2;
let div=num1/num2;
let res=num1-num2;
document.write(suma)
document.write("<br>")
document.write(res+"<br>")
document.write(multi+"<br>")
document.write(div+"<br>")

if(num1>num2){
    document.write("el numero 1 es mayor");  
}
else{
    document.write("el numero 2 es mayor");
}
document.write("<br>")
let diasemana=3;
switch(diasemana){
    case 1:
    document.write("lunes");
    break;

    case 2:
    document.write("martes");
    break;

    case 3:
    document.write("miercoles");
    break;

    case 4:
    document.write("jueves");
    break;

    case 5:
    document.write("viernes");
    break;
    default:
    document.write("Ya es fin de semana, fuga a tragar mierda");
}
//ciclo for
for(var i = 0; i < 10; i++){
    document.write("<h1>" +i+"</h1>")
}
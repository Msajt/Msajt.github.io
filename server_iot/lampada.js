
function liga(luz){
    var img = document.getElementById(luz);
    var img1 = "Loff.png", img2 = "Lon.png";
    var sinal;

    img.src = (img.src.match(img1)) ? img2 : img1;
    sinal = GetRandomNumbers(0,1000);
    SendToAPI(sinal);
}

function SendToAPI(state){
    var KEY = "JOZ0BRKN60MCFD8K";
    //criar um objeto capaz de enviar dados via requisição HTTP GET
    const http = new XMLHttpRequest();
    //prepara um GET passando a váriavel lux como ultimo paramentro do link
    http.open("GET", "https://api.thingspeak.com/update?api_key="+ KEY +"&field1=0"+state);
    //envia um GET
    http.send();
    //quando a requisição retornar ele chama o console e imprime
}

function GetRandomNumbers(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



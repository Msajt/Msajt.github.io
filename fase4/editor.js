// -------------------- EXIBE O RESULTADO DO CÓDIGO --------------------
function showPreview(){
    var content = "";
    var contentScripts = "";
    content += "<style>" + document.getElementById("csseditor").innerText + "<\/style>";
    content += "<script>" + document.getElementById("jseditor").innerText + "<\/script>";
    content += "<body>" + document.getElementById("htmleditor").innerText + "<\/script>";
    
    
    contentScripts = "<head>" +
                     "<script src='https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/p5.js'><\/script>" +
                     "<script src='https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.sound.js'><\/script>" +
                     "<script src='https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.dom.js'><\/script>" +
                     "<script src='https://cdn.jsdelivr.net/gh/molleindustria/p5.play@master/lib/p5.play.js'><\/script>" +
                     "<script src='https://drive.google.com/file/d/1_jJkWxEg-fhtoOtA8O-JZaP6k6UWSM4K/view?usp=sharing'><\/script>" +
                     "<\/head>";
    

    document.getElementById("preview").src = "data:text/html; charset=UTF-8, <html>" + contentScripts + content + "<\/html>";
    //document.getElementById("preview").src = "data:text/html; charset=UTF-8, <html>" + content + "<\/html>";  
}

// -------------------- TROCA ENTRE OS EDITORES --------------------
function openEditor(editorName){
    var i;
    var x = document.getElementsByClassName("editor");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    document.getElementById(editorName).style.display = "block";
}

// -------------------- BOTÃO COPIAR OS POST-IT --------------------
function copyButton(){
    var copyText = document.getElementById("textInput");
    
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert("A tarefa foi anotada, passe para o editor");
}

function alertButton(){
    var copyText = document.getElementById("desafioInput");
    alert(copyText.value);
}

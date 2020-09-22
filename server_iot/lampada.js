
function liga(luz){
    var img = document.getElementById(luz);
    var img1 = "Loff.png", img2 = "Lon.png";

   // alert(img.src);

    img.src = (img.src.match(img1)) ? img2 : img1;

    //alert(img.src);

}



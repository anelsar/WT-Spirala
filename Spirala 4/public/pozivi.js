let Pozivi = (function(){
    let per = [];
    let van = [];
    //var gl = 
    function ucitajJsonPodatkeImpl(){
        var xhr = new XMLHttpRequest();
       xhr.open('GET', "http://localhost:8080/dohvatiPodatke", true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200)
                {
                    
                    var obj = JSON.parse(this.responseText);
                    Kalendar.ucitajPodatke(obj.periodicna, obj.vanredna);
                   
                    iscrtajKalendar();
                    obojiZauzecaPoziv();
                }
            if(xhr.readyState == 4 && xhr.status == 404)
                alert("ne radi");
        }
       // xhr.open("GET", "http://localhost:8080/dohvatiPodatke", true);
        xhr.send();
    }

    function rezervisiTerminImpl(objekat){
       var xhr1 = new XMLHttpRequest();
       xhr1.open('POST', "http://localhost:8080/unesiPodatke", true);
       xhr1.setRequestHeader("Content-Type", "application/json");
      
       xhr1.send(objekat);
    }

    function rezervisiTerminPeriodicniImpl(objekat){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "http://localhost:8080/unesiPeriodicno", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        console.log(objekat);
        xhr.send(objekat);
    }

    function ucitajSlikeImpl(element, varijabla){
        var xhr = new XMLHttpRequest();
        var j;
        xhr.open('GET',"http://localhost:8080/dohvatiSlike", true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200) 
                {
                    var slikaKojuPrikazujem = JSON.parse(this.responseText);
                    var i;
                    var img;
                    var sl;
                    for(i=0; i<3; i++)
                    {
                    if(varijabla == 1)
                    {
                    img = document.getElementsByClassName(element)[i].getElementsByTagName("img")[0];       
                     sl = slikaKojuPrikazujem[`s${i+1}`].data;
                     var x = document.getElementsByClassName("slika");
                        x[1].style.display = "block";
                        x[2].style.display = "block";
                    }
                    if(varijabla == 2)
                    {
                     img = document.getElementsByClassName(element)[i].getElementsByTagName("img")[0];       
                    sl = slikaKojuPrikazujem[`s${i+4}`].data;
                    var x = document.getElementsByClassName("slika");
                        x[1].style.display = "block";
                        x[2].style.display = "block";
                    }
                    if(varijabla == 3)
                    {
                     img = document.getElementsByClassName(element)[i].getElementsByTagName("img")[0];       
                     sl = slikaKojuPrikazujem[`s${i+7}`].data;
                     var x = document.getElementsByClassName("slika");
                        x[1].style.display = "block";
                        x[2].style.display = "block";
                    }
                    if(varijabla == 4)
                    {
                         img = document.getElementsByClassName(element)[i].getElementsByTagName("img")[0];       
                    sl = slikaKojuPrikazujem[`s${10}`].data;
                        var x = document.getElementsByClassName("slika");
                        x[1].style.display = "none";
                        x[2].style.display = "none";
                    }
                    var b64encoded=btoa(new Uint8Array(sl).reduce(function (sl, byte)
                     {
                    return sl + String.fromCharCode(byte);
                    }, ''));
                    var d = "data:image/png;base64,"+b64encoded;
                    img.src = d;
                    }
                }
            if(xhr.readyState == 4 && xhr.status == 404)
                console.log("Slike nisu ucitane.");
        }
        xhr.send();
    } 

    // spirala 4
    //prvi zadatak
    function prikaziOsobljeImpl(){
        //alert("ulazi");
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "http://localhost:8080/osoblje", true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200)
            {
                if(xhr.responseText)
                {
                    var osobe = JSON.parse(this.responseText);
                    var prikazPredavaca = document.getElementById("listaPredavaca");
                    for(let i = 0; i<osobe.length; i++)
                    {
                        let opcija = document.createElement("option");
                        opcija.appendChild(document.createTextNode(osobe[i].ime + ' ' + osobe[i].prezime + ' ' + osobe[i].uloga));
                        prikazPredavaca.appendChild(opcija);
                    }
                }
            }
        if(xhr.readyState == 4 && xhr.status == 404)
            console.log("ne radi");
        }
        xhr.send();    
    }
    // treci zadatak
    function popuniTrenutnaOsobljaImpl(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "http://localhost:8080/prikaziOsoblje", true);
        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == 4 && xhr.status == 200)
            {
                if(xhr.responseText)
                {
                    var osobe = JSON.parse(this.responseText);
                    var prikazOsobe = document.getElementById("trenutnoZauzeto");
                    for(let i = 0; i<osobe.length; i++)
                    {
                        console.log("Ulazi u pozivima");
                        let opcija = document.createElement("option");
                        opcija.appendChild(document.createTextNode(osobe[i].ime + ' ' + osobe[i].prezime + ' ' + osobe[i].uloga + ' ' + osobe[i].sala));
                        prikazOsobe.appendChild(opcija);
                    }
                }
            }
            if(xhr.readyState == 4 && xhr.status == 404)
            console.log("ne radi");
        }
        xhr.send();
    }
    // drugi zadatak
    // ucitavanje podataka iz baze, iscrtavanje i bojenje kalendara
    function ucitajPodatkeIzBazeImpl(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "http://localhost:8080/ucitajZauzecaBaza", true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200)
                {
                    var zauzecaIzBaze = JSON.parse(this.responseText);
                    Kalendar.ucitajPodatke(zauzecaIzBaze.periodicna, zauzecaIzBaze.vanredna);
                   
                    iscrtajKalendar();
                    obojiZauzecaPoziv();
        
                }
            if(xhr.readyState == 4 && xhr.status == 404)
                alert("ucitavanje iz baze nije prošlo");
        }
        xhr.send();
    }
    //upisivanje rezervacije u bazu
    function upisiPeriodicnuRezervacijuImpl(objekat){
        var xhr = new XMLHttpRequest();
        xhr.open('POST',"http://localhost:8080/dodajPeriodicnuRezervaciju", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        //var stringi = JSON.stringify(objekat);
        console.log("Prolazi poziv redovne");
        xhr.send(objekat);
    }

    function upisiVanrednuRezervacijuImpl(objekat){
        var xhr = new XMLHttpRequest();
        xhr.open('POST',"http://localhost:8080/dodajVanrednuRezervaciju", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        //var stringi = JSON.stringify(objekat);
        console.log("Prolazi poziv vanredne");
        xhr.send(objekat);
    }
    return{
        ucitajJsonPodatke : ucitajJsonPodatkeImpl,
        rezervisiTermin : rezervisiTerminImpl,
        rezervisiTerminPeriodicni : rezervisiTerminPeriodicniImpl,
        ucitajSlike : ucitajSlikeImpl,
        prikaziOsoblje : prikaziOsobljeImpl,
        ucitajPodatkeIzBaze : ucitajPodatkeIzBazeImpl,
        upisiPeriodicnuRezervaciju : upisiPeriodicnuRezervacijuImpl,
        upisiVanrednuRezervaciju : upisiVanrednuRezervacijuImpl,
        popuniTrenutnaOsoblja : popuniTrenutnaOsobljaImpl
    }
}());
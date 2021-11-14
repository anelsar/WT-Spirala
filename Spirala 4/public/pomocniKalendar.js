 function iscrtajKalendar(){
    Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar"), new Date().getMonth());
   // redovnaZauzeca = this.zadajPeriodicna();
    //vanrednaZauzeca =this.zadajVanredna();
    //this.ucitajZauzecaPoziv();
    //this.obojiZauzecaPoziv();
}
var kalendar = document.getElementsByClassName("kalendar");
    var redovnaZauzeca = [];
    var vanrednaZauzeca = [];
// dodajem pocetak kraj
    var pocetak;
    var kraj;
    
function mijenjajSljedeci()
{
    var sviMjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
    var trenutniMjesec = document.getElementById("nazivMjeseca");
    var i;
    var j;
    var dugmeSljedeci = document.getElementsByClassName("dugmeSljedeci");
    var dugmePrethodni = document.getElementsByClassName("dugmePrethodni");
    // mjeseci od 0 do 11, 0 = januar
    if(trenutniMjesec.innerHTML==="Decembar")
    {
        dugmeSljedeci.disabled = true;
        dugmePrethodni.disabled = false;
    }
    else
    {
        dugmePrethodni.disabled = false;
        for(i=0; i<sviMjeseci.length; i++)
        {
            if(trenutniMjesec.innerHTML===sviMjeseci[i])
            //bilo j = i+2
            j=i+1;
        }
        //bilo [j-1]
        trenutniMjesec.innerHTML = sviMjeseci[j];
        Kalendar.iscrtajKalendar(this.kalendar, j);  
    }
    obojiZauzecaPoziv();
}

function mijenjajPrethodni()
{
    var sviMjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
    var trenutniMjesec = document.getElementById("nazivMjeseca");
    var i;
    var j;
    var dugmeSljedeci = document.getElementsByClassName("dugmeSljedeci");
    var dugmePrethodni = document.getElementsByClassName("dugmePrethodni");
    if(trenutniMjesec.innerHTML === "Januar")
    {
        dugmeSljedeci.disabled = false;
        dugmePrethodni.disabled = true;
    }
    else
    {
        dugmeSljedeci.disabled = false;
        for(i=0; i<sviMjeseci.length; i++)
        {
            if(trenutniMjesec.innerHTML===sviMjeseci[i])
            j = i;
        }
        trenutniMjesec.innerHTML = sviMjeseci[j-1];
        Kalendar.iscrtajKalendar(this.kalendar, j-1);
        //ovdje j-1 stavio bilo j
    }
    obojiZauzecaPoziv();
}
var periodicnaZauzeca = [];
var vanredna = [];
var salaEl;
var sala;

function ucitajZauzecaPoziv(){
    
    Kalendar.ucitajPodatke(redovnaZauzeca, vanrednaZauzeca);
    
}
function obojiZauzecaPoziv()
{
    var sviMjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
    var trenutniMjesec = document.getElementById("nazivMjeseca");
    var i;
    var j;
    for(i=0; i<sviMjeseci.length; i++)
    {
        if(sviMjeseci[i] === trenutniMjesec.innerHTML)
            j = i;
    }
    pocetak = document.getElementById("pocetak").value;
    kraj = document.getElementById("kraj").value;
    salaEl = document.getElementById("listaSala");
    sala = salaEl.options[salaEl.selectedIndex].value;
    Kalendar.obojiZauzeca(this.kalendar, j, sala, pocetak, kraj);
}


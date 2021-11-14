function ucitajPodatke(){
   //Pozivi.ucitajJsonPodatke();
    Pozivi.prikaziOsoblje();
   // Pozivi.popuniTrenutnaOsoblja();
    Pozivi.ucitajPodatkeIzBaze();
}

function rezervacijaTermina(lista)
{
    var objekatKonacni;
    var dat = new Date();
    var x = lista.firstElementChild.innerHTML;
    var kojiMjesec = document.getElementById("nazivMjeseca");
    var z = lista.getElementsByClassName("slobodna")[0].style.backgroundColor;
    var periodicnaCheckbox = document.getElementById("periodicnaCheck");
    //da uzmem profesore, asistente koga vec
    var listaProfesora = document.getElementById("listaPredavaca");
    var odabraniProfesor = listaProfesora.options[listaProfesora.selectedIndex].text;
    console.log(odabraniProfesor);
    var imePredavaca ='';
    var prezimePredavaca ='';
    var ulogaPredavaca ='';
    var razmak = 0;
    for(let a=0; a<odabraniProfesor.length; a++)
    {
        while(odabraniProfesor[a]!=' ' && razmak == 0)
        {
            imePredavaca+=odabraniProfesor[a];
            a++;
        }
        razmak++;
        a++;
        while(odabraniProfesor[a]!=' ' && razmak == 1)
        {
            prezimePredavaca+=odabraniProfesor[a];
            a++;
        }
        a++;
        
        while(a!=odabraniProfesor.length)
        {
            ulogaPredavaca += odabraniProfesor[a];
            a++;
        }
    }
    console.log(imePredavaca);
    console.log(prezimePredavaca);
    console.log(ulogaPredavaca);
    var sviMjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
    var j;
    var i;
    for(i=0; i<sviMjeseci.length; i++)
    {
        if(sviMjeseci[i] === kojiMjesec.innerHTML)
            j=i;
    }
    
    var k;
    //var kojiMjesecJeStisnut = j+1;
    //var kojiDanJeStisnut = x;
    if(j<9)
    {
            j+=1;
        k='0'+j.toString();
    }
    else
        {
            j+=1;
            k=j.toString();
        }
    var kojiSemestar;
    if(j>1 && j<=9)
        kojiSemestar = "ljetni";
    else if(j==0 || j>=10 || j == 1)
        kojiSemestar = "zimski";
    var danString;
    if(x<10)
        danString='0'+x.toString();
    else
        danString=x.toString();
    // sad da skontam koji dan u sedmici je stisnuti dan
    var datumZaPoslatiUFunkciju = dat.getFullYear().toString()+'-'+k+'-'+danString;
    var datumZaProjveruPeriodicne = new Date(datumZaPoslatiUFunkciju);
    var dajBrojDanaUSedmici = datumZaProjveruPeriodicne.getDay();
    // pretvaramo da dan u sedmici ima vrijednosti 0-6 , 0 ponedeljak 6 nedelja
    if(dajBrojDanaUSedmici===0)
        dajBrojDanaUSedmici = 6;
    else{
        dajBrojDanaUSedmici = dajBrojDanaUSedmici-1;
    }
   
    //
    //provjera da li je termin slobodan 
    //ovo je kad korisnik želi vanredno zauzeće
    if(z=='green' && periodicnaCheckbox.checked == false)
    {
        var zeliRezervisati = confirm("Da li želite da rezervišete ovaj termin?");
        if(zeliRezervisati == true)
        {
            var pocetnoVrijeme = document.getElementById("pocetak");
            var krajnjeVrijeme = document.getElementById("kraj");
            var listaSala = document.getElementById("listaSala");
            var odabranaSala = listaSala.options[listaSala.selectedIndex].text;
            //lista.getElementsByClassName("slobodna")[0].style.backgroundColor = "red";
            var varijabla = danString + "." + k +"." + dat.getFullYear().toString();
            // objekat vanrednog zauzeca koji ćemo slati u zauzeca.json
            var objekatZaPoslatiServeru = {
                "datum" : varijabla,
                "pocetak" : pocetnoVrijeme.value,
                "kraj" : krajnjeVrijeme.value, 
                "naziv" : odabranaSala
            };
             objekatKonacni = JSON.stringify( {datum : varijabla, pocetak : pocetnoVrijeme.value, kraj : krajnjeVrijeme.value, naziv : odabranaSala, ime: imePredavaca, prezime: prezimePredavaca, uloga: ulogaPredavaca });
        
        Pozivi.upisiVanrednuRezervaciju(objekatKonacni);
       // Pozivi.ucitajJsonPodatke();
       Pozivi.ucitajPodatkeIzBaze();
        }
        
    }
    else if(periodicnaCheckbox.checked == true && z=='green')
    {
        var zeliRezervisati = confirm("Da li želite da periodicno rezervišete ovaj termin?");
        if(zeliRezervisati == true)
        {
            var pocetnoVrijeme = document.getElementById("pocetak");
            var krajnjeVrijeme = document.getElementById("kraj");
            var listaSala = document.getElementById("listaSala");
            var odabranaSala = listaSala.options[listaSala.selectedIndex].text;
        
        
            //u ovom slučaju možemo zauzeti salu periodično
            var jeLiZauzetVanredno = Kalendar.provjeriVanredna(dajBrojDanaUSedmici, pocetnoVrijeme.value, krajnjeVrijeme.value, odabranaSala, kojiSemestar);
            var objekatZaPoslati = JSON.stringify({ dan : dajBrojDanaUSedmici, semestar : kojiSemestar, pocetak : pocetnoVrijeme.value, kraj : krajnjeVrijeme.value, naziv : odabranaSala, ime: imePredavaca, prezime: prezimePredavaca, uloga: ulogaPredavaca});
            if(jeLiZauzetVanredno==true)
            {
                alert("Nije moguće rezervisati salu "+odabranaSala+ " za navedeni datum "+danString+"/"+k+"/"+dat.getFullYear().toString()+" i termin od "+pocetnoVrijeme.value+" do "+krajnjeVrijeme.value+"!");
            }
            else
            {
                Pozivi.upisiPeriodicnuRezervaciju(objekatZaPoslati);
                //Pozivi.ucitajJsonPodatke();
                Pozivi.ucitajPodatkeIzBaze();
            }
        }
    }
    else
    {
        var pocetnoVrijeme = document.getElementById("pocetak");
            var krajnjeVrijeme = document.getElementById("kraj");
        var listaSala = document.getElementById("listaSala");
            var odabranaSala = listaSala.options[listaSala.selectedIndex].text;
        alert("Nije moguće rezervisati salu "+odabranaSala+ " za navedeni datum "+danString+"/"+k+"/"+dat.getFullYear().toString()+" i termin od "+pocetnoVrijeme.value+" do "+krajnjeVrijeme.value+"!");   
    }
    
} 


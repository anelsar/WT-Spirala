
    let Kalendar = (function(){
        var datum;
        var danUSedmici;
        var broj;
        var dani;
        var prviUMjesecu; 
        var zadnjiUMjesecu;
        var brojDanaUMjesecu;
        var prviDanUMjesecU;
        var i;
        var j;
        var k;
        var redovnaZauzeca = [];
        var vanrednaZauzeca = [];
        var slobodna;
        var kojiDan;
        var kojiDanNumber;
        var datumVanredne;
        var danVanredneString;
        var danVanredneBROJ;
        var mjesecVanredne;
        var mjesecVanredneBROJ;
        var mjeseci;
        var mjesecIzLabele;
        var brojMjeseca;
        var pocetakVanredne;
        var krajVanredne;
        var pocetakRedovne;
        var krajRedovne;
        var nazivSale;

        // pocetak i kraj su string "hh:mm"
    function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj){
        
        brojMjeseca=-1;
       // sedmice = kalendarRef[0].getElementsByClassName("brojevi");
        slobodna = kalendarRef[0].getElementsByClassName("slobodna");
        kojiDan = kalendarRef[0].getElementsByClassName("broj");
        danUSedmici = kalendarRef[0].getElementsByClassName("danSedmice");
        mjesecIzLabele = document.getElementById("nazivMjeseca");
        mjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
       
        for(i=0; i<slobodna.length; i++)
        {
            slobodna[i].style.backgroundColor = "green";
        }
       
        for(i=0; i<slobodna.length; i++)
        {
            for(j=0; j<vanrednaZauzeca.length; j++)
            {
                kojiDanNumber = Number(kojiDan[i].innerHTML);
                datumVanredne = vanrednaZauzeca[j].datum;
                danVanredneString = datumVanredne[0] + datumVanredne[1];
                mjesecVanredne = datumVanredne[3] + datumVanredne[4];
                mjesecVanredneBROJ = Number(mjesecVanredne);
                danVanredneBROJ = Number(danVanredneString);
                //uzimam pocetak i kraj vanredne hh mm
                pocetakVanredne = vanrednaZauzeca[j].pocetak;
                krajVanredne = vanrednaZauzeca[j].kraj;
                nazivSale = vanrednaZauzeca[j].naziv;
                // u if ubacujem za pocetak i kraj uslove
                if((mjesec + 1) === mjesecVanredneBROJ && danVanredneBROJ === kojiDanNumber && (pocetak <= pocetakVanredne || pocetak<= krajVanredne) && (kraj >= pocetakVanredne) && nazivSale === sala)
                    {
                        slobodna[i].style.backgroundColor = "red";
                    }

            }

        }
        for(i=0; i<danUSedmici.length; i++)
        {
            for(j=0; j<redovnaZauzeca.length; j++)
            {
                // uzimam pocetak i kraj redovne hh mm
                pocetakRedovne = redovnaZauzeca[j].pocetak;
                krajRedovne = redovnaZauzeca[j].kraj;
                nazivSale = redovnaZauzeca[j].naziv;
                //unos za redovne
                if(redovnaZauzeca[j].semestar === "zimski" && ((mjesec >= 9 && mjesec <= 11) || mjesec === 0) && (pocetak <= pocetakRedovne || pocetak<= krajRedovne) && (kraj >= pocetakRedovne) && nazivSale === sala)
                {
                    for(k=0; k<40; k+=7)
                    {
                     slobodna[redovnaZauzeca[j].dan+k].style.backgroundColor = "red";               
                    } 
                }
                //unos za redovne
                else if(redovnaZauzeca[j].semestar === "ljetni" && mjesec <9 && mjesec > 0 && (pocetak <= pocetakRedovne || pocetak <= pocetakRedovne) && (kraj >= pocetakRedovne) && nazivSale === sala)
                {
                    for(k=0; k<40; k+=7)
                    {
                     slobodna[redovnaZauzeca[j].dan+k].style.backgroundColor = "red";               
                    } 
                }
            }
        }
    }
        
    function ucitajPodatkeImpl(redovna, vanredna)
    {  
        redovnaZauzeca = redovna;
        vanrednaZauzeca = vanredna;
    }
        
        function iscrtajKalendarImpl(kalendarRef, mjesec){
                
     datum = new Date();
     danUSedmici = datum.getDay(); // vraća dan u sedmici 0-6, 0 nedelja
    broj = kalendarRef[0].getElementsByClassName("broj");
    //broj = document.getElementsByClassName("broj");
    dani = kalendarRef[0].getElementsByClassName("dani");
    //dani = document.getElementsByClassName("dani");       
     // mjeseci od 1-12 idu
     prviUMjesecu = new Date(new Date().getFullYear(), mjesec, 1);
     zadnjiUMjesecu = new Date(new Date().getFullYear(), mjesec+1, 0);
    brojDanaUMjesecu = zadnjiUMjesecu.getDate(); // //vraća dan kao vrijednost (1-31)
    
    j=1;
    
    //uzimam trenutni mjesec; odavde
    var sviMjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
    var labelaMjeseca = document.getElementById("nazivMjeseca");
    labelaMjeseca.innerHTML = sviMjeseci[mjesec];
            // do ovdje 
    if(prviUMjesecu.getDay()===0)
        prviDanUMjesecU = 6;
    else{
        prviDanUMjesecU = prviUMjesecu.getDay()-1;
    }
    // prviDanUMjesecu: ponedeljak počinje od 0 a nedelja je 6
    //dalje radim sa prviDanUmjesecu a ne prviUMjesecu
    for(i=0; i<dani.length; i++)
    {
        if(i<prviDanUMjesecU)
        {
            
            dani[i].style.visibility = "hidden";
            //sakriva dane prve sedmice koji nisu popunjeni
        }
        if(i<brojDanaUMjesecu)
       {
        if(dani[i+prviDanUMjesecU].style.display==="none")
            dani[i+prviDanUMjesecU].style.display = "inline-block";
        if(dani[i+prviDanUMjesecU].style.visibility==="hidden")
            dani[i+prviDanUMjesecU].style.visibility = "visible";
            broj[i+prviDanUMjesecU].innerHTML = j;
        j+=1;        
       }
       if(i>=brojDanaUMjesecu)
       {
           if(i+prviDanUMjesecU<dani.length)
           {
                
               dani[i+prviDanUMjesecU].style.display = "none";
           }
           //ne prikazuje dane nakon zadnjeg dana u mjesecu
       }
    }
                
               
    }
    // funkcija koja provjerava da li zauzece vanredno
    function provjeriVanrednaImpl(datum, pocetak, kraj, naziv, semestar){
        var i;
        for(i=0; i<vanrednaZauzeca.length; i++)
        {
           /* if(vanrednaZauzeca[i].datum == datum && vanrednaZauzeca[i].pocetak == pocetak && vanrednaZauzeca[i].kraj == kraj && vanrednaZauzeca[i].naziv == naziv)
            {
                return true;
            }*/
            
            var dajDatum = vanrednaZauzeca[i].datum;
            var pretvori = dajDatum[6]+dajDatum[7]+dajDatum[8]+dajDatum[9];
            pretvori +='-';
            pretvori +=dajDatum[3]+dajDatum[4];
            pretvori +='-'+dajDatum[0]+dajDatum[1];
            var datumGodine = new Date(pretvori);
            var danDatuma = datumGodine.getDay();
            var mjesecString = dajDatum[3]+dajDatum[4];
            var mjesecInt = parseInt(mjesecString);
            var semestarString;
            if(mjesecInt<2 || mjesecInt>9)
                semestarString = "zimski";
            else
                semestarString = "ljetni";
            if(danDatuma==0)
                danDatuma = 6;
            else{
                danDatuma = danDatuma-1;
                }
                console.log(danDatuma);
            if(danDatuma == datum && semestar == semestarString && vanrednaZauzeca[i].naziv == naziv && ((pocetak<=vanrednaZauzeca[i].pocetak && kraj >=vanrednaZauzeca[i].pocetak) || (pocetak>=vanrednaZauzeca[i].pocetak && pocetak<=vanrednaZauzeca[i].kraj)))
                {
                    return true;
                }
        }
        return false;
    }
        
        return {
            obojiZauzeca: obojiZauzecaImpl,
            ucitajPodatke: ucitajPodatkeImpl,
            iscrtajKalendar: iscrtajKalendarImpl,
            provjeriVanredna : provjeriVanrednaImpl
        }
    }());
    
    
        
    
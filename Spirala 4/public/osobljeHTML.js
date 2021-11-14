function ucitaj(){
    Pozivi.popuniTrenutnaOsoblja();
}

function popunjavajSvakih30(){
    ucitaj();
    setInterval(function(){
        ucitaj();
    }, 30000);
}

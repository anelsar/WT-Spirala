const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
app.use(express.json()); 

//spirala 4
var db = require('./db.js');
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
       
    }).catch(function(err){console.log("Greska");});
    
});

function inicializacija(){
    var osobljeListaPromisea = [];
    var terminiListaPormisea = [];
    var rezervacijaListaPromisea = [];
    var salaListaPromisea = [];
    return new Promise(function(resolve, reject){
        // ubacivanje osoblja
        osobljeListaPromisea.push(db.osoblje.create({ime: "Neko", prezime: "Nekic", uloga: "profesor"}));
        osobljeListaPromisea.push(db.osoblje.create({ime: "Drugi", prezime: "Neko", uloga: "asistent"}));
        osobljeListaPromisea.push(db.osoblje.create({ime: "Test", prezime: "Test", uloga: "asistent"}));
        // ubacivanje termina
        terminiListaPormisea.push(db.termin.create({redovni: false, dan: null, datum: "01.01.2020", semestar: null, pocetak: "12:00", kraj: "13:00"}));
        terminiListaPormisea.push(db.termin.create({redovni: true, dan: 0, datum: null, semestar: "zimski", pocetak: "13:00", kraj: "14:00"}));
        Promise.all(osobljeListaPromisea).then(function(osobe){
            var neko = osobe.filter(function(a){return a.ime === "Neko"})[0].dataValues.id;
            var drugi = osobe.filter(function(a){return a.ime === "Drugi"})[0].dataValues.id;
           var test = osobe.filter(function(a){return a.ime === "Test"})[0].dataValues.id;
           // console.log(osobe, neko);
        Promise.all(terminiListaPormisea).then(function(termini){
            var prviTermin = termini.filter(function(a){return a.redovni == false})[0].dataValues.id;
            var drugiTermin = termini.filter(function(a){return a.redovni == true})[0].dataValues.id;
            // ubacivanje sala
            salaListaPromisea.push(
                db.sala.create({naziv: "1-11"}).then(function(k){
                    k.setOsoblje([neko]);
                    return new Promise(function(resolve, reject){resolve(k);});
                })
                );
            salaListaPromisea.push(
                db.sala.create({naziv: "1-15"}).then(function(k){
                    k.setOsoblje([drugi]);
                    return new Promise(function(resolve, reject){resolve(k);});
                })
            );
            
            Promise.all(salaListaPromisea).then(function(sale){
                var prvaSala = sale.filter(function(a){return a.naziv === "1-11"})[0].dataValues.id;
                var drugaSala = sale.filter(function(a){return a.naziv === "1-15"})[0].dataValues.id;
                rezervacijaListaPromisea.push(
                    db.rezervacija.create({}).then(function(k){
                       return k.setTermin([prviTermin]).then(function(k){
                           return k.setSala([prvaSala]).then(function(k){
                               return k.setOsoblje([neko]).then(function(){
                                   return new Promise(function(resolve, reject){resolve(k);});
                               })
                           })
                       });
                       
                    })
                );
                // ubacivanje rezervacija
                rezervacijaListaPromisea.push(
                    db.rezervacija.create({}).then(function(k){
                       return k.setTermin([drugiTermin]).then(function(k){
                           return k.setSala([prvaSala]).then(function(k){
                               return k.setOsoblje([test]).then(function(){
                                   return new Promise(function(resolve, reject){resolve(k);});
                               })
                           })
                       });
                       
                    })
                );
                Promise.all(rezervacijaListaPromisea).then(function(k){resolve(k);}).catch(function(err){console.log("Greska kod rezervacije "+err);});
            }).catch(function(err){console.log("Greska kod sala " + err);});
        }).catch(function(err){console.log("Greska kod termina " + err);});
        }).catch(function(err){console.log("Greska kod osoba " + err);});
    });
}


//zadatak 1

app.get('/osoblje', function(req, res){
    db.osoblje.findAll().then(osoblje=>{
        res.send(JSON.stringify(osoblje));
    });
});

//zadatak 2
// ucitavanje rezervacija iz baze
app.get('/ucitajZauzecaBaza', function(req, res){
    var periodicno = {};
    var vanredno = {};
    var svaZauzeca = {};
    var periodicnaZauzeca = [];
    var vanrednaZauzeca = [];
    
    db.rezervacija.findAll().then(function(rezervacije){  
        db.termin.findAll().then(function(termini){
            db.sala.findAll().then(function(sale){
                for(let i=0; i<rezervacije.length; i++)
                {
                    for(let j=0; j<termini.length; j++)
                    {
                        for(let k=0; k<sale.length; k++)
                        {
                            // za periodicne
                            if(rezervacije[i].dataValues.terminId == termini[j].dataValues.id && termini[j].redovni == true && rezervacije[i].dataValues.salaId == sale[k].dataValues.id)
                            {
                                periodicno = {
                                    dan : termini[j].dan,
                                    semestar : termini[j].semestar,
                                    pocetak : String(termini[j].pocetak).slice(0,5),
                                    kraj : String(termini[j].kraj).slice(0,5),
                                    naziv : sale[k].naziv
                                }
                                periodicnaZauzeca.push(periodicno);
                            }
                            //za vanredne
                             if(rezervacije[i].dataValues.terminId == termini[j].dataValues.id && termini[j].redovni == false && rezervacije[i].dataValues.salaId == sale[k].dataValues.id)
                            {
                                vanredno = {
                                    datum : termini[j].datum,
                                    pocetak :  String(termini[j].pocetak).slice(0,5),
                                    kraj : String(termini[j].kraj).slice(0,5),
                                    naziv : sale[k].naziv
                                }
                                vanrednaZauzeca.push(vanredno);
                            }
                        }
                    }
                   
                }
                res.send(JSON.stringify({periodicna: periodicnaZauzeca, vanredna: vanrednaZauzeca}));
            })
        })
    })
  
});
// pisanje zauzeca u bazu

app.post('/dodajPeriodicnuRezervaciju', function(req, res){
    let dodajUBazu = req.body;
    var termin = dodajUBazu;
    var sala = dodajUBazu;
    var rezervacija = dodajUBazu;
    var osoblje = dodajUBazu;
    console.log(osoblje.ime);
    console.log("Prolazi i index");
   var jeLiRezervisano = false;
   
    
    
        db.osoblje.findOrCreate({where : {
            ime : osoblje.ime,
            prezime : osoblje.prezime,
            uloga : osoblje.uloga
        }}).then(function(os){
            os = os[0];
            db.sala.findOrCreate({where : {
                naziv : sala.naziv,
                zaduzenaOsoba : os.id
            }}).then(function(sal){
                sal = sal[0];
                db.termin.findOrCreate({where: {
                    redovni : true,
                    dan : termin.dan,
                    semestar : termin.semestar,
                    pocetak : termin.pocetak,
                    kraj : termin.kraj
                }}).then(function(ter){
                    ter = ter[0];
                    db.rezervacija.findOrCreate({where : {
                        osobljeId : os.id,
                        terminId : ter.id,
                        salaId : sal.id
                    }}).then(function(rez){
                        
                    })
                })
            })
        })
    
});

app.post('/dodajVanrednuRezervaciju', function(req, res){
    let dodajUBazu = req.body;
    var termin = dodajUBazu;
    var sala = dodajUBazu;
    var rezervacija = dodajUBazu;
    var osoblje = dodajUBazu;
    console.log(osoblje.ime);
    console.log("Prolazi i index");
   var jeLiRezervisano = false;
   
    
    
        db.osoblje.findOrCreate({where : {
            ime : osoblje.ime,
            prezime : osoblje.prezime,
            uloga : osoblje.uloga
        }}).then(function(os){
            os = os[0];
            db.sala.findOrCreate({where : {
                naziv : sala.naziv,
                zaduzenaOsoba : os.id
            }}).then(function(sal){
                sal = sal[0];
                db.termin.findOrCreate({where: {
                    redovni : false,
                    datum : termin.datum,
                    pocetak : termin.pocetak,
                    kraj : termin.kraj
                }}).then(function(ter){
                    ter = ter[0];
                    db.rezervacija.findOrCreate({where : {
                        osobljeId : os.id,
                        terminId : ter.id,
                        salaId : sal.id
                    }}).then(function(rez){
                        
                    })
                })
            })
        })
    
});
// zadatak 3
app.get('/prikaziOsoblje', function(req, res){
    console.log("udje u indexu isto");
    var upisiUListu = [];
    var objekatZaUpis = {};
    var trenutniDatum = new Date();
    var trenutniDanUSedmici = trenutniDatum.getDay();
    if(trenutniDanUSedmici==0)
    {
        trenutniDanUSedmici=6;
    }
    else
    {
        trenutniDanUSedmici--;
    }
    var trenutniSati = trenutniDatum.getHours();
    var trenutneMinute = trenutniDatum.getMinutes();
    var stringSati ="";
    var stringMinute ="";
    if(trenutniSati<10)
        stringSati = '0' + String(trenutniSati);
    else
        stringSati = String(trenutniSati);
    if(trenutneMinute<10)
        stringMinute = '0' + String(trenutneMinute);
    else
        stringMinute = String(trenutneMinute);
    var stringSatiIMinute = stringSati +":"+ stringMinute;
    console.log("skroz gore: " + stringSatiIMinute);
    var trenutniDanUMjesecu = trenutniDatum.getDate();
    var trenutniMjesecUGodini = trenutniDatum.getMonth();
    var stringTrenutnaGodina = String(trenutniDatum.getFullYear());
    trenutniMjesecUGodini++;
    var stringTrenutniMjesecUGodini;
    var stringTrenutniDanUMjesecu;
    if(trenutniMjesecUGodini<10)
        stringTrenutniMjesecUGodini= '0'+ String(trenutniMjesecUGodini);
    else
        stringTrenutniMjesecUGodini= String(trenutniMjesecUGodini);
    if(trenutniDanUMjesecu<10)
        stringTrenutniDanUMjesecu = '0' + String(trenutniDanUMjesecu);
    else
    stringTrenutniDanUMjesecu = String(trenutniDanUMjesecu);
    var stringTrenutniDatum = stringTrenutniDanUMjesecu+'.'+stringTrenutniMjesecUGodini+'.'+stringTrenutnaGodina;
    //da trazim one koji se preklapaju
    db.rezervacija.findAll().then(function(rezervacije){  
        db.termin.findAll().then(function(termini){
            db.sala.findAll().then(function(sale){
              db.osoblje.findAll().then(function(osobe){
                  for(let i=0; i<rezervacije.length; i++)
                  {
                      for(let j=0; j<termini.length; j++)
                      {
                          for(let k=0; k<sale.length; k++)
                          {
                              for(let l=0; l<osobe.length; l++)
                              {
                                  console.log("udje u zadnji for");
                                  if(rezervacije[i].dataValues.terminId == termini[j].dataValues.id  && rezervacije[i].dataValues.salaId == sale[k].dataValues.id && rezervacije[i].dataValues.osobljeId == osobe[l].dataValues.id)
                                  {
                                      console.log("udje u prvi if");
                                      console.log(String(termini[j].datum));
                                      console.log(termini[j].dan);
                                      console.log("termini poc: "+String(termini[j].pocetak));
                                      console.log("trenutni vri: "+stringSatiIMinute);
                                      console.log("trenutni dat: "+stringTrenutniDatum);
                                    if((trenutniDanUSedmici == termini[j].dan || stringTrenutniDatum == String(termini[j].datum)) && stringSatiIMinute >= String(termini[j].pocetak) && stringSatiIMinute <= String(termini[j].kraj))
                                    {
                                        if(upisiUListu.length!=0)
                                        {
                                            for(let varijabla = 0; varijabla < upisiUListu.length; varijabla++)
                                            {
                                                if(upisiUListu[varijabla].ime != osobe[l].ime && upisiUListu[varijabla].prezime != osobe[l].prezime)
                                                {
                                                    console.log("udje u drugi if");
                                                objekatZaUpis = {
                                                ime : osobe[l].ime,
                                                prezime : osobe[l].prezime,
                                                uloga : osobe[l].uloga,
                                                sala : sale[k].naziv
                                                }
                                                upisiUListu.push(objekatZaUpis)
                                            }
                                              
                                            }
                                        }
                                        if(upisiUListu.length == 0)
                                        {
                                            objekatZaUpis = {
                                                ime : osobe[l].ime,
                                                prezime : osobe[l].prezime,
                                                uloga : osobe[l].uloga,
                                                sala : sale[k].naziv
                                                }
                                                upisiUListu.push(objekatZaUpis)
                                        }
                                        /*
                                        
                                        console.log("udje u drugi if");
                                        objekatZaUpis = {
                                            ime : osobe[l].ime,
                                            prezime : osobe[l].prezime,
                                            uloga : osobe[l].uloga,
                                            sala : sale[k].naziv
                                        }
                                        upisiUListu.push(objekatZaUpis);*/
                                    }
                                    // umjesto else stavio else if
                                    else 
                                    {
                                        if(upisiUListu.length==0)
                                        {
                                            console.log("udje u else");
                                        objekatZaUpis = {
                                            ime : osobe[l].ime,
                                            prezime : osobe[l].prezime,
                                            uloga : osobe[l].uloga,
                                            sala : "kancelarija"
                                        }
                                        upisiUListu.push(objekatZaUpis);
                                        }
                                        if(upisiUListu.length!=0)
                                        {
                                            for(let varijabla = 0; varijabla < upisiUListu.length; varijabla++)
                                            {
                                                if(upisiUListu[varijabla].ime != osobe[l].ime && upisiUListu[varijabla].prezime != osobe[l].prezime)
                                                {
                                                    console.log("udje u drugi if");
                                                objekatZaUpis = {
                                                ime : osobe[l].ime,
                                                prezime : osobe[l].prezime,
                                                uloga : osobe[l].uloga,
                                                sala : "kancelarija"
                                                }
                                                upisiUListu.push(objekatZaUpis)
                                            }
                                            }
                                        }
                                    }
                                  }
                                
                              }
                          }
                      }
                  }
                  res.send(JSON.stringify(upisiUListu));
              })
                
            })
        })
    })
    
})
app.use(express.static(path.join(__dirname, 'public')));

//dodajem za testove ne bi l proslo
app.get('/', function(req, res){
    res.sendFile('testovi.html', { root: __dirname + '/public'});
});
//

app.get('/', function(req, res){
    res.sendFile('pocetna.html', { root: __dirname + '/public'});
});

app.get('/sale', function(req, res){
    res.sendFile('sale.html', { root: __dirname + '/public'});
});

app.get('/rezervacija', function(req, res){
    res.sendFile('rezervacija.html', { root: __dirname + '/public'});
});

app.get('/unos', function(req, res){
    res.sendFile('unos.html', { root: __dirname + '/public'});
});
//zadatak 1
app.get('/dohvatiPodatke', function(req, res){
    res.sendFile('zauzeca.json', { root: __dirname});
});
//zadatak 2
app.post('/unesiPodatke', function(req, res){
   let dodajUDzejson = req.body;
    let ubaciNovi = {
        datum : dodajUDzejson['datum'],
        pocetak : dodajUDzejson['pocetak'],
        kraj : dodajUDzejson['kraj'],
        naziv : dodajUDzejson['naziv']
    };
    fs.readFile('zauzeca.json', function(err, data){
        let rezultat = JSON.parse(data);
        rezultat.vanredna.push(ubaciNovi);
        let jsone = JSON.stringify(rezultat, null, 2);
        fs.writeFile('zauzeca.json', jsone, function(err){
            if(err) throw err;
            
        });
    });
    
});

app.post('/unesiPeriodicno', function(req, res){
    let dodajUDzejson = req.body;
    let ubaciNovi = {
        dan : dodajUDzejson['dan'],
        semestar : dodajUDzejson['semestar'],
        pocetak : dodajUDzejson['pocetak'],
        kraj : dodajUDzejson['kraj'],
        naziv : dodajUDzejson['naziv']
    };
    fs.readFile('zauzeca.json', function(err, data){
        let rezultat = JSON.parse(data);
        rezultat.periodicna.push(ubaciNovi);
        let jsone = JSON.stringify(rezultat, null, 2);
        console.log(jsone);
        fs.writeFile('zauzeca.json', jsone, function(err){
            if(err) throw err;
            console.log('Uspješno dodano');
        });
    });
})
//zadatak 3
app.get('/dohvatiSlike', function(req, res){
    var slike = {};
    var i;
   for(i=0; i<10; i++)
    {
        var slika = fs.readFileSync(__dirname + `/public/slikeGalerije/${i+1}.png`)
        slike[`s${i+1}`] = slika;
    }
           res.send(JSON.stringify(slike));
});




app.listen(8080, () => console.log("Server radi na portu 8080"));
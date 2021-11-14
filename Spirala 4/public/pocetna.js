var globalna = 1;
function ucitaj(slika, varijabla)
{
    Pozivi.ucitajSlike(slika, varijabla);
}

function sljedeceSlike()
{
    if(globalna==4)
    {
        return;
    }
    globalna+=1;
    var dugmePrethodni = document.getElementsByClassName("dugmePrethodni");
            dugmePrethodni.disabled = false;
    if(globalna<=4 && globalna>1)
        {
            Pozivi.ucitajSlike("slika", globalna);
            if(globalna == 4)
                {
                    var dugmeSljedeci = document.getElementsByClassName("dugmeSljedeci");   
                    dugmeSljedeci.disabled = true;
                }
                else{
                    var dugmeSljedeci = document.getElementsByClassName("dugmeSljedeci");   
                    dugmeSljedeci.disabled = false;
                }
        }
    
}

function prethodneSlike()
{   
    if(globalna==1)
    {
        return;
    }
    globalna-=1;
    var dugmeSljedeci = document.getElementsByClassName("dugmeSljedeci");   
    dugmeSljedeci.disabled = false;
    if(globalna>=1)
    {
        Pozivi.ucitajSlike("slika", globalna);
        if(globalna == 1)
        {
            var dugmePrethodni = document.getElementsByClassName("dugmePrethodni");
            dugmePrethodni.disabled = true;
        }
        else{
            var dugmePrethodni = document.getElementsByClassName("dugmePrethodni");
            dugmePrethodni.disabled = false;
        }
    }
    
}
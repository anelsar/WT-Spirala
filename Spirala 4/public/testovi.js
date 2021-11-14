let assert = chai.assert;

describe('index', function() {
describe('GET /osoblje', function(){
    it('punjenje osoblja iz baze, GET zahtjev /osoblje', function(){
        
        var listaProfesora = document.getElementById("listaPredavaca");
        var velicina = listaProfesora.length;
        assert.equal(velicina, 3, "Broj ucitanih predavaca treba biti 3");
    })
    
});
    
});
const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const path = require('path');


const Korisnici = new sqlite3.Database('./Korisnici.db', (err) => {
  if (err) {
    console.error('Greška prilikom povezivanja s bazom:', err);
  } else {
    console.log('Povezano na SQLite bazu Korisnici');
  }
});

const Po = new sqlite3.Database('./Proizvodi.db', (err) => {
  if (err) {
    console.error('Greška prilikom povezivanja s bazom:', err);
  } else {
    console.log('Povezano na SQLite bazu Proizvodi');
  }
});

const Ko = new sqlite3.Database('./Povratne_informacije.db', (err) => {
  if (err) {
    console.error('Greška prilikom povezivanja s bazom:', err);
  } else {
    console.log('Povezano na SQLite bazu Povratne_informacije');
  }
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const decoder = new StringDecoder('utf-8');
  let body = '';

  req.on('data', (chunk) => {
    body += decoder.write(chunk);
  });

  req.on('end', () => {
    body += decoder.end();

  
    if (parsedUrl.pathname === '/') {
      const loginPagePath = path.join(__dirname, 'html/login.html');
      fs.readFile(loginPagePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Greška pri učitavanju login stranice');
          return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end(data);
      });
    }


    else if (parsedUrl.pathname === '/registracija') {
      const registrationPagePath = path.join(__dirname, 'html/registracija.html');
      fs.readFile(registrationPagePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Greška pri učitavanju stranice za registraciju');
          return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end(data);
      });
    }


    else if (parsedUrl.pathname === '/proizvodi') {
      const proizvodiPagePath = path.join(__dirname, 'html/proizvodi.html');
      fs.readFile(proizvodiPagePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Greška pri učitavanju stranice s proizvodima');
          return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end(data);
      });
    }

  
    else if (parsedUrl.pathname === '/admin') {
      const adminPagePath = path.join(__dirname, 'html/admin.html');
      fs.readFile(adminPagePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Greška pri učitavanju stranice s admin podacima');
          return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end(data);
      });
    }


    else if (parsedUrl.pathname === '/api/korisnici') {
      if (req.method === 'GET') {
        Korisnici.all('SELECT * FROM Korisnici', (err, rows) => {
          if (err) {
            console.error('Greška pri dohvaćanju korisnika:', err);
            res.statusCode = 500;
            res.end('Greška na serveru');
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(rows));
        });
      } 
      
      
      
      else if (req.method === 'POST') {
        const { ime, prezime, email, lozinka } = JSON.parse(body);
        if (!ime || !prezime || !email || !lozinka) {
          res.statusCode = 400;
          res.end('Svi podaci moraju biti prisutni');
          return;
        }
        Korisnici.get('SELECT * FROM Korisnici WHERE email = ?', [email], (err, row) => {
          if (err) {
            console.error('Greška pri dohvaćanju korisnika:', err);
            res.statusCode = 500;
            res.end('Greška na serveru');
            return;
          }

          if (row) {
            res.statusCode = 409; 
            res.end('Korisnik s tim emailom već postoji');
            return;
          }

       
          const query = 'INSERT INTO Korisnici (ime, prezime, email, lozinka) VALUES (?, ?, ?, ?)';
          Korisnici.run(query, [ime, prezime, email, lozinka], function (err) {
            if (err) {
              console.error('Greška pri dodavanju korisnika:', err);
              res.statusCode = 500;
              res.end('Greška na serveru');
              return;
            }
            res.statusCode = 201; // Created
            res.end(`Korisnik dodan s ID-om ${this.lastID}`);
          });
        });
      } 
      
      
      else if (req.method === 'PUT') {
        try {
          const { id, ime, prezime, email, lozinka } = JSON.parse(body);
          if (!id || !ime || !prezime || !email || !lozinka) {
            res.statusCode = 400;
            res.end('Svi podaci moraju biti prisutni');
            return;
          }
          const query = 'UPDATE Korisnici SET ime = ?, prezime = ?, email = ?, lozinka = ? WHERE id = ?';
          Korisnici.run(query, [ime, prezime, email, lozinka, id], function (err) {
            if (err) {
              console.error('Greška pri ažuriranju korisnika:', err);
              res.statusCode = 500;
              res.end('Greška na serveru');
              return;
            }
            if (this.changes === 0) {
              res.statusCode = 404;
              res.end('Korisnik nije pronađen');
              return;
            }
            res.statusCode = 200;
            res.end('Korisnik ažuriran');
          });
        } catch (error) {
          console.error('Greška u tijelu zahtjeva:', error);
          res.statusCode = 400;
          res.end('Neispravan JSON format');
        }
      } 
      
      
      else if (req.method === 'DELETE') {
        const { id } = JSON.parse(body);
        const query = 'DELETE FROM Korisnici WHERE id = ?';
        Korisnici.run(query, [id], function (err) {
          if (err) {
            console.error('Greška pri brisanju korisnika:', err);
            res.statusCode = 500;
            res.end('Greška na serveru');
            return;
          }
          if (this.changes === 0) {
            res.statusCode = 404;
            res.end('Korisnik nije pronađen');
            return;
          }
          res.statusCode = 200;
          res.end('Korisnik uspješno obrisan');
        });
      }
    }

    else if (parsedUrl.pathname === '/api/login') {
      if (req.method === 'POST') {
        const { email, lozinka } = JSON.parse(body);

        
        Korisnici.get('SELECT * FROM Korisnici WHERE email = ? AND lozinka = ?', [email, lozinka], (err, row) => {
          if (err) {
            console.error('Greška pri prijavi:', err);
            res.statusCode = 500;
            res.end('Greška na serveru');
            return;
          }

          if (row) {
            res.statusCode = 200;
            res.end('Uspješna prijava');
          } else {
            res.statusCode = 404; 
            res.end('Račun ne postoji');
          }
        });
      }
    }


    else if (parsedUrl.pathname === '/api/proizvodi') {
      if (req.method === 'GET') {
        Po.all('SELECT * FROM Proizvodi', (err, rows) => {
          if (err) {
            console.error('Greška pri dohvaćanju proizvoda:', err);
            res.statusCode = 500;
            res.end('Greška na serveru');
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(rows));
        });
      } 
      
      
      else if (req.method === 'POST') {
        const { naziv, kategorija, cijena, kolicina, opis, url_slike } = JSON.parse(body);
        const query = 'INSERT INTO Proizvodi (naziv, kategorija, cijena, kolicina, opis, url_slike) VALUES (?, ?, ?, ?, ?, ?)';
        Po.run(query, [naziv, kategorija, cijena, kolicina, opis, url_slike], function (err) {
          if (err) {
            console.error('Greška pri dodavanju proizvoda:', err);
            res.statusCode = 500;
            res.end('Greška pri dodavanju proizvoda');
            return;
          }
          res.statusCode = 201;
          res.end(`Proizvod dodan s ID-om ${this.lastID}`);
        });
      } 
      
      
      else if (req.method === 'PUT') {
        const { id, naziv, kategorija, cijena, kolicina, opis, url_slike } = JSON.parse(body);
        const query = 'UPDATE Proizvodi SET naziv = ?, kategorija = ?, cijena = ?, kolicina = ?, opis = ?, url_slike = ? WHERE id = ?';
        Po.run(query, [naziv, kategorija, cijena, kolicina, opis, url_slike, id], function (err) {
          if (err) {
            console.error('Greška pri ažuriranju proizvoda:', err);
            res.statusCode = 500;
            res.end('Greška pri ažuriranju proizvoda');
            return;
          }
          if (this.changes === 0) {
            res.statusCode = 404;
            res.end('Proizvod nije pronađen');
            return;
          }
          res.statusCode = 200;
          res.end(`Proizvod s ID-om ${id} ažuriran`);
        });
      } 
      
    
      else if (req.method === 'DELETE') {
        const { id } = JSON.parse(body);
        const query = 'DELETE FROM Proizvodi WHERE id = ?';
        Po.run(query, [id], function (err) {
          if (err) {
            console.error('Greška pri brisanju proizvoda:', err);
            res.statusCode = 500;
            res.end('Greška pri brisanju proizvoda');
            return;
          }
          if (this.changes === 0) {
            res.statusCode = 404;
            res.end('Proizvod nije pronađen');
            return;
          }
          res.statusCode = 200;
          res.end('Proizvod obrisan');
        });
      }
    }


    else if (parsedUrl.pathname === '/api/povratne-informacije') {
      
      if (req.method === 'GET') {
        Ko.all('SELECT * FROM Povratne_informacije', (err, rows) => {
          if (err) {
            console.error('Greška pri dohvaćanju povratnih informacija:', err);
            res.statusCode = 500;
            res.end('Greška na serveru');
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(rows));
        });
      } 
      
      
      else if (req.method === 'POST') {
        const { ime_kupca, komentar, ocjena_servisa } = JSON.parse(body);
        const query = 'INSERT INTO Povratne_informacije (ime_kupca, komentar ,ocjena_servisa) VALUES (?, ?, ?)';
        Ko.run(query, [ime_kupca, komentar, ocjena_servisa], function (err) {
          if (err) {
            console.error('Greška pri dodavanju povratne informacije:', err);
            res.statusCode = 500;
            res.end('Greška pri dodavanju povratne informacije');
            return;
          }
          res.statusCode = 201;
          res.end(`Povratna informacija dodana s ID-om ${this.lastID}`);
        });
      } 
      
      
      else if (req.method === 'DELETE') {
        const { id } = JSON.parse(body);
        const query = 'DELETE FROM Povratne_informacije WHERE id = ?';
        Ko.run(query, [id], function (err) {
          if (err) {
            console.error('Greška pri brisanju povratne informacije:', err);
            res.statusCode = 500;
            res.end('Greška pri brisanju povratne informacije');
            return;
          }
          if (this.changes === 0) {
            res.statusCode = 404;
            res.end('Povratna informacija nije pronađena');
            return;
          }
          res.statusCode = 200;
          res.end('Povratna informacija obrisana');
        });
      }
    }


    else {
      res.statusCode = 404;
      res.end('Stranica nije pronađena');
    }
  });
});

server.listen(8080, () => {
  console.log('Server je pokrenut na http://localhost:8080');
});

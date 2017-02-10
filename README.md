# Web-Planner-Path-Calculator Project
Progetto realizzato dal gruppo **Hello World**:
* Giuseppe Bianchi [Matricola 210339]
* Mirko Pizii [Matricola 236739]
* Federico Palmitesta [Matricola 230712]

---

## Installazione su Windows
Per installare la piattaforma in ambito Windows bisogna:

### Installare NodeJS
Vedere sul sito ufficiale o repository del proprio sistema.

**NOTA**: A seguito di fix avvenuti su NodeJS è **OBBLIGATORIO** installare la versione di NodeJS **successiva alla 7.x** per la piena compatibilità con la piattaforma.
* 32bit: https://nodejs.org/dist/v7.5.0/node-v7.5.0-x86.msi
* 64bit: https://nodejs.org/dist/v7.5.0/node-v7.5.0-x64.msi

### Installare Nginx
Vedere sul sito ufficiale Nginx. **Installare ultima versione**.

### Installare MongoDB
Vedere il sito ufficiale di [MongoDB](https://docs.mongodb.com/master/tutorial/install-mongodb-on-windows/). **Installare ultima versione**.

I paragrafi da eseguire sono 1, 2, 3, 4, 5 di [questa pagina](https://docs.mongodb.com/master/tutorial/install-mongodb-on-windows/#configure-a-windows-service-for-mongodb-community-edition).
E' preferibile lasciare le directory di base.

### Inserire nuova configurazione di Nginx
Modificare il file **nginx.conf** nella directory di installazione di nginx ed inserire all'interno della sezione **http {** questa riga:
```bash
include vhosts.d/*.conf;
```
Nota: Se la piattaforma deve eseguirsi su www.nomesito.com al posto di www.nomesito.com:81, cambiare all'interno del fine **nginx.conf** la riga **listen 80** in **listen 81**.

Una volta fatto ciò, se non esiste, creare la cartella **vhosts.d** e all'interno creare un nuovo file **hwp.conf**:
```bash
mkdir vhosts.d
```
Scaricare il file da questo indirizzo e inserirlo nella cartella **vhosts.d**: https://github.com/MirkoPizii/Web-Planner-Path-Calculator/raw/master/nginx_config/hwp.conf

Apriamo il file **hwp.conf** e modificare questi parametri:
* **listen 81** diventa **listen 80** se volete far eseguire la piattaforma su www.nomesito.com 
* **servername localhost** -> cambiate **localhost** con il nome che desiderate per il sito es **www.nomesito.com**
* Se volete i log di nginx attivi, eliminate il **simbolo #** prima di **access_log**
* Su **proxypass** rinominate **localhost** se nodejs sarà eseguito su un IP esterno oppure sarà identificato in rete con un indirizzo specifico. Stesso vale per la porta in uso.
* Rinominate il **path assoluto** sull'attributo **root**. Esso dovrà corrispondere alla cartella della piattaforma. Per esempio, se si trova sulla scrivania sarà /home/utente/Scrivania/Web-Planner-Path-Calculator/
* Modificare il **root** per le location stylesheets|javascripts|fonts|templates. Il percorso **root** è identico al punto citato precedentemente ma bisogna aggiungere  il **public** finale. Es. /home/utente/Scrivania/Web-Planner-Path-Calculator/public 

### Avviare Nginx
Fare riferimento su questa pagina: http://nginx.org/en/docs/windows.html

### Avviare MongoDB
Fare riferimento a mongod.exe già effettuato nel passaggio di installazione.

### Avviare la piattaforma
```bash
cd <directory_project>
npm install --save
node --max_old_space_size=4096 bin/www 
```
*Nota: se possibile, è preferibile aumentare il valore 4096 ad un valore più alto.*

### Aprire il browser all'indirizzo specificato.

### NOTA
* In ambiente windows è possibile usare **pm2** per far ripartire il server node in caso di eventuale crash.
* E' altamente consigliabile abilitare l'uso della partizione **swap** in quanto la piattaforma consuma molte risorse RAM e CPU.

---

## Installazione su Linux
Per installare la piattaforma in ambito Linux bisogna:

### Installare NodeJS
Vedere sul sito ufficiale o repository del proprio sistema.

### Installare Nginx
Vedere sul sito ufficiale o repository del proprio sistema.

### Installare MongoDB
Vedere il sito ufficiale di [MongoDB](https://docs.mongodb.com/master/administration/install-on-linux/).

### Inserire nuova configurazione di Nginx
Modificare il file **/etc/nginx/nginx.conf** ed inserire all'interno della sezione **http {** questa riga:
```bash
include vhosts.d/*.conf;
```
Nota: Se la piattaforma deve eseguirsi su www.nomesito.com al posto di www.nomesito.com:81, cambiare all'interno del fine **nginx.conf**  la riga **listen 80** in **listen 81**.

Una volta fatto ciò, se non esiste, creare la cartella **vhosts.d** e all'interno creare un nuovo file **hwp.conf**:
```bash
mkdir vhosts.d
cd vhosts.d/
wget https://github.com/MirkoPizii/Web-Planner-Path-Calculator/raw/master/nginx_config/hwp.conf
```

Apriamo il file **hwp.conf** e modificare questi parametri:
* **listen 81** diventa **listen 80** se volete far eseguire la piattaforma su www.nomesito.com 
* **servername localhost** -> cambiate **localhost** con il nome che desiderate per il sito es **www.nomesito.com**
* Se volete i log di nginx attivi, eliminate il **simbolo #** prima di **access_log**
* Su **proxypass** rinominate **localhost** se nodejs sarà eseguito su un IP esterno oppure sarà identificato in rete con un indirizzo specifico. Stesso vale per la porta in uso.
* Rinominate il **path assoluto** sull'attributo **root**. Esso dovrà corrispondere alla cartella della piattaforma. Per esempio, se si trova sulla scrivania sarà /home/utente/Scrivania/Web-Planner-Path-Calculator/
* Modificare il **root** per le location stylesheets|javascripts|fonts|templates. Il percorso **root** è identico al punto citato precedentemente ma bisogna aggiungere  il **public** finale. Es. /home/utente/Scrivania/Web-Planner-Path-Calculator/public 

### Avviare Nginx
```bash
sudo service nginx start
```

### Avviare MongoDB
```bash
sudo service mongod start
```

### Avviare la piattaforma
```bash
cd <directory_project>
npm install --save
node --max_old_space_size=4096 bin/www 
```
*Nota: se possibile, è preferibile aumentare il valore 4096 ad un valore più alto.*

### Aprire il browser all'indirizzo specificato.

### NOTA
* In ambiente linux è possibile usare **pm2** per far ripartire il server node in caso di eventuale crash.
* E' altamente consigliabile abilitare l'uso della partizione **swap** in quanto la piattaforma consuma molte risorse RAM e CPU.

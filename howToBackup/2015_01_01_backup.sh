#!/bin/sh
# diese Datei muss einmalig ausfuehrbar gemacht werden mit "chmod +x dateiname"
# Ausfuehren des Skriptes ueber ./dateiname

# Informationen von http://wiki.ubuntuusers.de/Skripte/Backup_mit_RSYNC

quelle1=/home/julian/Dropbox/  #benutze unten: "${quelle1}"
quelle2=/home/julian/dropboxarchiv/ 
ziel=/media/julian/JULIAN32GB/backup
heute=$(date +%Y-%m-%d)

sudo rsync -avR --delete --no-perms --no-owner --no-group "${quelle1}" "${quelle2}" "${ziel}${heute}/" --link-dest="${ziel}last/" #add v to flags to show single operations
# Erstellen eines links auf das neueste Backup:
sudo ln -nsf "${ziel}${heute}" "${ziel}last"

exit 0

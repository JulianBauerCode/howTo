#!/bin/sh
# diese Datei muss einmalig ausfuehrbar gemacht werden mit "chmod +x dateiname"
# Ausfuehren des Skriptes ueber ./dateiname


# Falls das neueste Backup geloescht wird, so muss der hardlink auf das verzeichnis  mit dem letzten backup auf das verzeichnis des vorletzten backups 
# geaendert werden ueber:
# sudo ln -nsf "/media/julian/JULIAN32GB1/backup/...." "${ziel}/lastBackup"

# Informationen von http://wiki.ubuntuusers.de/Skripte/Backup_mit_RSYNC
sudo mkdir /media/julian/JULIAN32GB/backup/

quelle1=/home/julian/Dropbox/  #benutze unten: "${quelle1}"
quelle2=/home/julian/dropboxarchiv/ 
ziel=/media/julian/JULIAN32GB/backup
heute=$(date +%Y-%m-%d)

sudo rsync -avR --delete --no-perms --no-owner --no-group "${quelle1}" "${quelle2}" "${ziel}/${heute}/" --link-dest="${ziel}/lastBackup" #add v to flags to show single operations
# Erstellen eines links auf das neueste Backup:
sudo ln -nsf "${ziel}/${heute}/" "${ziel}/lastBackup"
sudo chown -R julian:julian "/media/julian/JULIAN32GB/"

exit 0

#!/bin/bash

######Ausfuehrung
#Ausfuehren ueber: bash backup.sh

######Vorgehen
#Dieses Skript muss im Zielordner, also dem Ordner im dem das Backup erstellt
# werden soll, liegen und dort ausgeführt werden.

####Verzeichnisse Variablen
zielverzeichnis="$PWD"
quelle1=/home/julian/Dropbox  		#benutze unten: "${quelle1}"
quelle2=/home/julian/dropboxarchiv
quelle9=/home/julian/Desktop/backupFolder #testing
datum=$(date +%Y_%m_%d_%H%M%S)
last="lastBackup"

####Backup rsync
rsync -avR \
	--delete \
	--no-perms --no-owner --no-group \
	"${quelle1}" "${quelle2}"\
	"$zielverzeichnis/$datum" \
	--link-dest="$zielverzeichnis/$last"
# -a = archive
# -v = verbose = display each file
# -R = recursively
# -c = bitwise = compare content of link-dest and source bitwise >> ensures consitency of backup
#
#--delete = if files from source are deleted between two backups with same name, than deleted files are removed from backup
#
# --no-perms --no-owner --no-group : no perm, owner, group is set on recieving side to ensure usage with NTFS formated sticks
####Hardlink to last backup
ln -nsf "${zielverzeichnis}/${datum}" "${zielverzeichnis}/$last"


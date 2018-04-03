##Set up ubuntu
#[
#if you would like to use ubuntu and windows on one machine, you have to install windows first
#create a partition with format ntfs of size 100 GB at the beginning of the hard drive and install windows on it.
#partitions can be created using the ubuntu-program "gparted" 
#you can use ubunt-programs while running a ubuntu without installation from your bootable usb stick. that means ubuntu can be started from usb stick without installation. This is a great possibility to test ubuntu.
#]
#plug in bootable usb stick (use LTS = Long Time Support-versions as they are supported for a duration of about 5 years)
#get into boot menu by pressing F12 or similar key (on windows make sure to shut down windows completely (not just sleep mode or something similar))
#boot from usb stick
#select installing ubuntu and not testing during live mode
#connect to internet
#select download updates while installing
#select install third party stuff (e.g. MPE-format from Fraunhofer...)
#select installation type "something else" to define partitions
  #information on the partition menu
    #to create a partition means to subdivide a hard drive into different partitions / file systems
      # with potentially differing file system formats.
    #onthe top of the gui you see a potentialy colored bar visualizing the different partitions which
      #names are given as ticks of the bar. Note that each partition starts at a specific position 
      #on your one-dimensional harddrive and continous up to a specific position.
    #partitions have to span over a continuous part of the hard drive without breaks
    #your hard drive is called a "device"
    #below the bar is a list of the devices and their partitions 
    #below the list you can see three buttons : [ + , - , Change ]
    #if you have unused space on a device, you can select that unused space and after selecting,
      #the "+"-button is enabled. By clicking it, you can create a new partition where the unused
      #space is located. 
      #after clicking "+" you have to select the size of the new partition. The size defaults to the         #complete size of the unused space.
      #you may be able to select the position of the new partition.
      #in addition to the size, you have to select the format of the file system you want to create,
        #the mount point(Einhaengepunkt) and whether you want to format the file system / partition
    #after selection of one partition the button "-" is enabled and by clicking it the selected parti      #tion can be deleted
    #after selection of one partition the button 'Change' is enabled and can be clicked to change inf      #ormation
#if you have one hard drive and windows installed, do the following:
  #leave the ntfs partition on which you installed windows untouched, it would be great if it starts
    #at the left and of the hard drive because this gives you maximum flexibility regarding the
    #position and sizes of the partitions
  #create a partition for ubuntu software right next to the previous partition
    #file system = ext4
    #size = 60 GB
    #format = yes
    #mount point = /
  #create a partition for outsourcing of RAM for Ubuntu rigth next to the previous partition
    #file system =swap
    #size = 2 times RAM of your machine
    #format option is not enabled
    #moun pint is not enabled
  #create a partition for your home directory in ubuntu (data, picture, settings...) rigth nex to 
    #the previous partition
      #file system = ext4
      #size = the rest
      #format = yes
      #mount point = /home
  #notes: 
    #you max have to remove one unnecessary partition in order to free unused space
#create the partitions
#answer questions:
  #where are you?
  #which keyboard layout are you using?
  #your name
  #name of your computer
  #username
  #select password
#wait and be happy


##install basics
sudo apt-get install tree vim git zsh wget

##enable workspaces
#https://askubuntu.com/questions/260510/how-do-i-turn-on-workspaces-why-do-i-only-have-one-workspace
gsettings set org.compiz.core:/org/compiz/profiles/unity/plugins/core/ hsize 4
gsettings set org.compiz.core:/org/compiz/profiles/unity/plugins/core/ vsize 2

##Get Oh-my-zsh 
#https://github.com/robbyrussell/oh-my-zsh
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
echo
echo "Restart or (logout and login to ubuntu) is necessary to use zsh as standard shell"
echo

##Get Dropbox working
#Install nautilus add in
#sudo apt-get install nautilus-dropbox
#Download and install dropbox client
#dropbox start -i
#Follow instructions in internet browser to log in
#Set autostart to true
#dropbox start y

##Configure git
git config --global user.name "JulianBauerCode"
git config --global user.email julianbauercode@gmx.de
git config --global push.default simple
git config --global core.editor "vim"
##Install Miniconda

#Get latest version
myFileName="Miniconda3-latest-Linux-x86_64.sh"

#wget http://repo.continuum.io/miniconda/$myFileName

#Install
zsh $myFileName
#If systempath is extended in .bashrc
#  If systempath is not extended in .zshrc
#    Copy system path extension from .bashrc to .zshrc
if grep -q Miniconda $HOME/.bashrc
then 
   if ! grep -q Miniconda $HOME/.zshrc
   then 
      grep -A 1 Miniconda $HOME/.bashrc >> $HOME/.zshrc;
   fi
fi


##Create config files
ipython profile create
jupyter notebook --generate-config

#Qtconsole
jupyter qtconsole --generate-config
myFile="$HOME/.jupyter/jupyter_qtconsole_config.py"
if ! grep -q fruity $myFile
then
   echo  "c.JupyterWidget.syntax_style =\"fruity\"" >> $myFile;
fi



##Configure vim
#Add pathogene (vim add in manager)
mkdir -p $HOME/.vim/autoload $HOME/.vim/bundle                                
curl -LSso $HOME/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim
#Enable pathogene
echo "execute pathogen#infect()\nsyntax on\nfiletype plugin indent on" >> $HOME/.vimrc

#Use pathogene to get
#file explorer nerdtree
git clone https://github.com/scrooloose/nerdtree.git $HOME/.vim/bundle/nerdtree
#git-add-in fugitive
cd $HOME/.vim/bundle
git clone https://github.com/tpope/vim-fugitive.git
vim -u NONE -c "helptags vim-fugitive/doc" -c q

#Enable switching between vim splits using ctr and hjkl
echo 'nnoremap <C-J> <C-W><C-J>\nnnoremap <C-K> <C-W><C-K>\nnnoremap <C-L> <C-W><C-L>\nnnoremap <C-H> <C-W><C-H>' >> $HOME/.vimrc 





# Set up ubuntu

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

################################
# Install basics applications
sudo apt-get install curl tree vim-gtk git zsh wget libreoffice texmaker texlive-lang-german texlive-science texstudio
#vim-gtk is able to copy and paste to Ubuntu-GUI-clipboard
#sudo apt-get install xul-ext-lightning #installs lightning calendar plugin for thunderbird

# Enable workspaces
#https://askubuntu.com/questions/260510/how-do-i-turn-on-workspaces-why-do-i-only-have-one-workspace
gsettings set org.compiz.core:/org/compiz/profiles/unity/plugins/core/ hsize 4
gsettings set org.compiz.core:/org/compiz/profiles/unity/plugins/core/ vsize 2

# Set defautl view of nautilus to list-view
sudo gsettings set org.gnome.nautilus.preferences default-folder-viewer 'list-view'

################################
# Get Oh-my-zsh 
#https://github.com/robbyrussell/oh-my-zsh
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
echo
echo "Restart or (logout and login to ubuntu) is necessary to use zsh as standard shell"
echo

################################
# Configure git
git config --global user.name "JulianBauerCode"
git config --global user.email julianbauercode@gmx.de
git config --global push.default simple
git config --global core.editor "vim"
#Set vimdiff as default diff-tool of command "git difftool [HEAD] <filename>"
git config --global diff.tool vimdiff
# deactivate prompt when using difftool
git config --global difftool.prompt false

################################
# Install Miniconda

##########
## Get latest version and install
myFileName="Miniconda3-latest-Linux-x86_64.sh"
wget http://repo.continuum.io/miniconda/$myFileName -P $HOME

zsh $HOME/$myFileName
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

##########
## Add some basic conda packages
conda install qtconsole
conda install -c anaconda jupyter
conda install numpy pandas 

##########
## Create config files
ipython profile create
jupyter notebook --generate-config
### Qtconsole
jupyter qtconsole --generate-config

##########
## Set style Qtconsole
myFile="$HOME/.jupyter/jupyter_qtconsole_config.py"
if ! grep -q fruity $myFile
then
   echo  "c.JupyterWidget.syntax_style =\"fruity\"" >> $myFile;
fi
## Improve style Qtconsole (especially traceback color)
myFile="$HOME/.python/profile_default/startup/me.py"
#Try to create myFile and create if it does not already exist
touch $myFile
#If commands are not already in file, add commands
if ! grep -q "%colors Linux" $myFile
then
   echo  "## Improve colors of syntax highlighting and traceback\nget_ipython().magic(u\"%colors Linux\")" >> $myFile;
fi


################################
# Configure vim

## Pathogene (vim add in manager)
### Get
mkdir -p $HOME/.vim/autoload $HOME/.vim/bundle                                
curl -LSso $HOME/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim
### Enable
echo "execute pathogen#infect()\nsyntax on\nfiletype plugin indent on" >> $HOME/.vimrc

## Nerdtree (file manager)
### Get
git clone https://github.com/scrooloose/nerdtree.git $HOME/.vim/bundle/nerdtree

## Fugitive (Git wrapper)
cd $HOME/.vim/bundle
git clone https://github.com/tpope/vim-fugitive.git
vim -u NONE -c "helptags vim-fugitive/doc" -c q

## Enable switching between vim splits using ctr and hjkl
echo 'nnoremap <C-J> <C-W><C-J>\nnnoremap <C-K> <C-W><C-K>\nnnoremap <C-L> <C-W><C-L>\nnnoremap <C-H> <C-W><C-H>' >> $HOME/.vimrc 

## Use spaces instead of tabs
myFile="$HOME/.vimrc"
if ! grep -q "Use spaces instead" $myFile
then
   echo  "\" Use spaces instead of tabs\nset expandtab\nset tabstop=4\n" >> $myFile;
fi

## Set encodings
myFile="$HOME/.vimrc"
if ! grep -q "Set encodings" $myFile
then
   echo  "\" Set encodings\n\" https://stackoverflow.com/questions/16507777/set-encoding-and-fileencoding-to-utf-8-in-vim\n\" Set encoding which is shown in output\nset encoding=utf-8\n\" Set encoding of files\nset fileencoding=utf-8\n" >> $myFile;
fi


## Enable highlighting of all word occurrences
myFile="$HOME/.vimrc"
if ! grep -q " Enable highlighting of all " $myFile
then
   echo  "\" Enable highlighting of all word occurrences\nset hlsearch\n" >> $myFile;
fi

## Show line numbers
myFile="$HOME/.vimrc"
if ! grep -q " Show line numbers" $myFile
then
   echo  "\" Show line numbers. To unset use \":set nonu\"\nset nu\n" >> $myFile;
fi


## Show colorcolumn for Pep8
myFile="$HOME/.vimrc"
if ! grep -q " Show colorcolumn for Pep8" $myFile
then
   echo  "\" Show colorcolumn for Pep8\nset colorcolumn=72\nhighlight ColorColumn ctermbg=0 guibg=lightgrey\n" >> $myFile;
fi



################################
# Get Dropbox
## Install nautilus add in
#sudo apt-get install nautilus-dropbox
## Download and install dropbox client
#dropbox start -i
## Follow instructions in internet browser to log in
## Set autostart to true
#dropbox start y


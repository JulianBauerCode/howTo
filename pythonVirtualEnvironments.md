# Python virtual environments
## VirtualEnv
### Usage
Unique:
Create virtual environment, placing a directory "sample" which exists until is is removed manually
```bash
virtualenv ~/sample -p python 3.5
```

On each startup:
Activate environments
```bash
source ~/sample/bin/activate
```

Unique:
On new environment install packages according to "requirements.txt"
```bash
pip install -r requirements.txt
```

During session:
Work on evironment
```bash
pip install <packageName>
python --version
```


After each session:
Deactiate virtualenvironment
```bash
deactivate
```

### Files
requirements.txt
### Directories
~/sample

### Pro / Con
+ Old, Established
+ Usage is more verbose than pipenv
+ Starting is verbose
+ Tab completion for list of virtual environments would be appreciated

## Pipenv
### Usage
On each startup:
Set up environment according to Pipfile
```bash
pipenv install
```

During session:
```bash
pipenv install <packageName>
```
### Files
Pipfile
Pipfile.lock
### Directories
unknown directory

### Pro / Con
+ New
+ Create environment on each session startup
+ Dont understand






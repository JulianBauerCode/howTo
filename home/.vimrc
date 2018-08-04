execute pathogen#infect()
filetype plugin indent on
syntax on



nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H> 

 " Use spaces instead of tabs
set expandtab
set tabstop=4

" Set encodings
" https://stackoverflow.com/questions/16507777/set-encoding-and-fileencoding-to-utf-8-in-vim
" Set encoding which is shown in output
set encoding=utf-8
" Set encoding of files
set fileencoding=utf-8


" Enable highlighting of all word occurrences
set hlsearch

" Show line numbers. To unset use ":set nonu"
set nu


" Show colorcolumn for Pep8
set colorcolumn=72
highlight ColorColumn ctermbg=0 guibg=lightgrey









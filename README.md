# howTo
## Docstrings

### Multi-line compatible with epydoc, format is called epytext
https://stackoverflow.com/questions/3898572/what-is-the-standard-python-docstring-format
```python
"""
This is a javadoc style.

@param param1: this is a first param
@param param2: this is a second param
@return: this is a description of what is returned
@raise keyError: raises an exception
"""
``` 




### One-line
```python
def function(a, b):
    """Do X and return a list."""
```
### Multi-line    
```python
def complex(real=0.0, imag=0.0):
    """Form a complex number.

    Keyword arguments:
    real -- the real part (default 0.0)
    imag -- the imaginary part (default 0.0)
    """
    if imag == 0.0 and real == 0.0:
        return complex_zero
    ...
```    

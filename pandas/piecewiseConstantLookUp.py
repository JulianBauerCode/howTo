import pandas as pd
import numpy as np

nbrRows = 10
nbrColumns = 2
#Create data
df1 = pd.DataFrame(data = np.random.rand(nbrRows,nbrColumns),columns = ['value1LowerBoundIncluded','value2'])
#Create more readable data
df1 = (df1 * 100).astype(int)
#Shift index to make piecewiseConstantLookUp more reasonable
diff = 5
df1.index = list(range(0,nbrRows * diff,diff))
#Write data to file
df1.to_csv('data.csv')


#Read data from file
df = pd.read_csv('data.csv', index_col = 0)
#Interpret "side" parameter 
df.index[df.index.searchsorted(25,side = 'left')] 
df.index[df.index.searchsorted(25,side = 'right')] 
### with option "left", index values are interpreted as lower bounds included
###with option "right", index values are interpreted as lower bounds not included
argument = 17
res = df.iloc[df.index.searchsorted(argument, side = 'left')]['value1LowerBoundIncluded']
print(argument, res)





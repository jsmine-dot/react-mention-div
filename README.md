# react-mention-div
React component for user mention

[example](https://codesandbox.io/s/react-mention-div-46m1i)

## Getting started
install the react-mention-div via npm
```
npm i @jsmine/react-mention-div
```

import it in your file
 ```
 import Mention from '@jsmine/react-mention-div'
 ```
 
 use it:
```javascript
 <Mention 
        className={'class for edit box'}      	      	
        onChange={(change)=>'your on change handler'} 
      	options={[{name:'ABCD', id:1},{name:'XYZ', id:2}]}
      	style={'inline style'} 
      	value={{rawText:"@1erty",mentions:[{name:'qw', id: 1, startIndex: 0, endIndex:1}]}}
      />
```

## version 2.0.0
### introduced props
value
### depricated props
ListingUi, trigger, optionsListClass, optionDisplayKey
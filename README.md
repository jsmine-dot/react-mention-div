# react-mention-div
React component for user mention

## Getting started
install the react-mention-div via npm
```
npm i @jsmine/react-mention-div
```

import it in your file
 ```
 import Mention from 'react-mention-div'
 ```
 use it:
```javascript
 <Mention 
      	ListingUi={({option})=><div>{option.name}</div>} 
      	onChange={(change)=>'your on change handler'} 
      	trigger={'@'} 
      	className={'class for input box'} 
      	optionsListClass={'class for options list'}
      	options={[{value:'ABCD', id:1},{value:'XYZ', id:2}]}
      />
```
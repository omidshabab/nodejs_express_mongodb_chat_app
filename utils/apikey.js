const genAPIKey = () => {
     //create a base-36 string that contains 30 chars in a-z,0-9
     return [...Array(30)]
       .map((e) => ((Math.random() * 36) | 0).toString(36))
       .join('');
   };
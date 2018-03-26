if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js', {scope: "/"}).then( reg => {
    console.log("sw registered");
  }).catch( error => {
    console.log("did not register sw,", error);
  });
}
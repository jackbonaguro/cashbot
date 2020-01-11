

export default Api = {
  addressRequestHook: async (address, callback) => {
    fetch('http://localhost:3001/respond', {
      method: 'POST',
      body: `{ "address": "${address}" }`,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    }).then(response => response.json()).then(json => {
      return callback(null, json);
    }).catch(callback);
  }
};

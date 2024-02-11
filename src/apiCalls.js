// Your fetch requests will live here!


function fetchData(endpoint) {
    return fetch(`https://fitlit-api.herokuapp.com/api/v1/${endpoint}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data
      })
      .catch((error) => console.log(`Error fetching ${endpoint}:`, error));
  }
  
  function fetchUserData() {
    return fetchData('users');
  }

  function fetchHydrationData() {
    return fetchData('hydration');
  }
  
  function fetchSleepData() {
    return fetchData('sleep');
  }
  
  function fetchActivityData() {
    return fetchData('activity');
  }
  
  // Template for a POST request, adjust as necessary for your API's needs
  /*function postData(url = '', data = {}) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error posting data');
      }
      return response.json();
    })
    .catch(error => console.error('Error:', error));
  }
  */
  export { fetchUserData, fetchSleepData, fetchHydrationData, fetchActivityData, }; 
  //export { fetchUser }; 
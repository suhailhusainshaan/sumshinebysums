fetch('http://localhost:8080/api/products/featured?limit=6')
  .then(res => res.json())
  .then(json => console.log('FEATURED:', JSON.stringify(json, null, 2)))
  .catch(err => console.error(err));

fetch('http://localhost:8080/api/products?page=1&limit=8&sort=popular')
  .then(res => res.json())
  .then(json => console.log('LISTING:', JSON.stringify(json, null, 2)))
  .catch(err => console.error(err));

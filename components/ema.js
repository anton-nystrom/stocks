
function ema(data, interval) {
  let object = {};
  let array = [];
  let date;
  let price;
  const k = 2/(interval + 1);

  data.forEach((key) => {
    if(key.x) {
      date = key.x;
      price = key.y;
    }
    else {
      date = key[0];
      price = Object.values(key[1])[3];
      price = parseInt(price);
    }
    
    if(array.length < 1) {
      object = {
        x : date,
        y : price
      };
    }
    else {
      object = {
        x : date,
        y : (price * k) + (array[array.length - 1].y * (1 - k))
      };
    }
    array.push(object);
  })
  
    return array;
}

export default ema;


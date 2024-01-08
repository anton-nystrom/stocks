
function macd(ema12, ema26) {
    let array = [];
    for (let i = 0; i < ema12.length; i++) {
        array.push({
            x : ema12[i].x,
            y : ema12[i].y - ema26[i].y
        });
    }
  return array;
}

export default macd;

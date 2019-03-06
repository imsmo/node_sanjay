// Npormal functions
function fname(a,b,callback){
  var ans = a + b;
  callback(ans);
}
fname(5,10,function(data){
  console.log(`Answer is ${data}`);
});

// Arrow functions
fname_arrow = (a,b)=>{
  var ans = a + b;
  return ans;
}

console.log(fname_arrow(10,20,(d)=>d));

// fname_arrow(a,b,(data)=>{
//
// });

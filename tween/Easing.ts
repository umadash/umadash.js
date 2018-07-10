// reference: https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
export const Easing = {
  linear: (t:number, b:number, c:number, d:number) => {
    return  c * (t / d) + b;
  },

  easeInQuad: (t:number, b:number, c:number, d:number) => {
    t /= d;
    return c * t * t + b;
  },
  easeOutQuad: (t:number, b:number, c:number, d:number) => {
    return -c *(t/=d)*(t-2) + b;
  },
  easeInOutQuad: (t:number, b:number, c:number, d:number) => {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },


  easeInCubic: (t:number, b:number, c:number, d:number) => {
    return c*(t/=d)*t*t + b;
  },
  easeOutCubic: (t:number, b:number, c:number, d:number) => {
    return c*((t=t/d-1)*t*t + 1) + b;
  },
  easeInOutCubic: (t:number, b:number, c:number, d:number) => {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  },


  easeInQuart: (t:number, b:number, c:number, d:number) =>  {
  return c*(t/=d)*t*t*t + b;
  },
  easeOutQuart: (t:number, b:number, c:number, d:number) =>  {
  return -c * ((t=t/d-1)*t*t*t - 1) + b;
  },
  easeInOutQuart: (t:number, b:number, c:number, d:number) =>  {
  if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
  return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },


  easeInQuint:  (t:number, b:number, c:number, d:number) =>  {
    return c*(t/=d)*t*t*t*t + b;
  },
  easeOutQuint:  (t:number, b:number, c:number, d:number) =>  {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  },
  easeInOutQuint:  (t:number, b:number, c:number, d:number) =>  {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  },


  easeInSine:  (t:number, b:number, c:number, d:number) =>  {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  },
  easeOutSine:  (t:number, b:number, c:number, d:number) =>  {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
  },
  easeInOutSine:  (t:number, b:number, c:number, d:number) =>  {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  },


  easeInExpo:  (t:number, b:number, c:number, d:number) =>  {
    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
  },
  easeOutExpo:  (t:number, b:number, c:number, d:number) =>  {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  },
  easeInOutExpo:  (t:number, b:number, c:number, d:number) =>  {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },


  easeInCirc:  (t:number, b:number, c:number, d:number) =>  {
    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
  },
  easeOutCirc:  (t:number, b:number, c:number, d:number) =>  {
  return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  },
  easeInOutCirc:  (t:number, b:number, c:number, d:number) =>  {
  if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
  return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
  },


  easeInElastic:  (t:number, b:number, c:number, d:number) =>  {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
  },
  easeOutElastic:  (t:number, b:number, c:number, d:number) =>  {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  },
  easeInOutElastic:  (t:number, b:number, c:number, d:number) =>  {
  var s=1.70158;var p=0;var a=c;
  if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
  return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
  },


  easeInBack: (t, b, c, d, s) => {
  if (s == undefined) s = 1.70158;
  return c*(t/=d)*t*((s+1)*t - s) + b;
  },
  easeOutBack: (t, b, c, d, s) => {
  if (s == undefined) s = 1.70158;
  return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  easeInOutBack: (t, b, c, d, s) => {
  if (s == undefined) s = 1.70158; 
  if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
  return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  }
}

function t(t,r,e,n){Object.defineProperty(t,r,{get:e,set:n,enumerable:!0,configurable:!0})}var r={};t(r,"create_table",()=>G),t(r,"query",()=>Q),t(r,"q",()=>Y),t(r,"reply",()=>tt),t(r,"ctrl_enter",()=>tr);// Transcrypt'ed from Python, 2023-09-30 19:03:52
// Transcrypt'ed from Python, 2023-09-30 19:03:51
var e="org.transcrypt.__runtime__",n={};function _(t,r,e){return t&&(t.hasOwnProperty("__class__")||"string"==typeof t||t instanceof String)?(e&&Object.defineProperty(t,e,{value:function(){var e=[].slice.apply(arguments);return r.apply(null,[t].concat(e))},writable:!0,enumerable:!0,configurable:!0}),function(){var e=[].slice.apply(arguments);return r.apply(null,[t.__proxy__?t.__proxy__:t].concat(e))}):r}n.interpreter_name="python",n.transpiler_name="transcrypt",n.executor_name=n.transpiler_name,n.transpiler_version="3.9.0";var i={__name__:"type",__bases__:[],__new__:function(t,r,e,n){for(var _=function(){var t=[].slice.apply(arguments);return _.__new__(t)},i=e.length-1;i>=0;i--){var o=e[i];for(var s in o){var a=Object.getOwnPropertyDescriptor(o,s);null!=a&&Object.defineProperty(_,s,a)}for(let t of Object.getOwnPropertySymbols(o)){let r=Object.getOwnPropertyDescriptor(o,t);Object.defineProperty(_,t,r)}}for(var s in _.__metaclass__=t,_.__name__=r.startsWith("py_")?r.slice(3):r,_.__bases__=e,n){var a=Object.getOwnPropertyDescriptor(n,s);Object.defineProperty(_,s,a)}for(let t of Object.getOwnPropertySymbols(n)){let r=Object.getOwnPropertyDescriptor(n,t);Object.defineProperty(_,t,r)}return _}};i.__metaclass__=i;var o={__init__:function(t){},__metaclass__:i,__name__:"object",__bases__:[],__new__:function(t){var r=Object.create(this,{__class__:{value:this,enumerable:!0}});return("__getattr__"in this||"__setattr__"in this)&&(r.__proxy__=new Proxy(r,{get:function(t,r){let e=t[r];return void 0==e?t.__getattr__(r):e},set:function(t,r,e){try{t.__setattr__(r,e)}catch(n){t[r]=e}return!0}}),r=r.__proxy__),this.__init__.apply(null,[r].concat(t)),r}};function s(t,r,e,n){return void 0===n&&(n=r[0].__metaclass__),n.__new__(n,t,r,e)}function a(t){return t.__kwargtrans__=null,t.constructor=Object,t}function u(t,r,e){t.hasOwnProperty(r)||Object.defineProperty(t,r,e)}function l(t){return t.startswith("__")&&t.endswith("__")||"constructor"==t||t.startswith("py_")}function c(t){if(null==t)return 0;if(t.__len__ instanceof Function)return t.__len__();if(void 0!==t.length)return t.length;var r=0;for(var e in t)!l(e)&&r++;return r}function p(t){if("inf"==t)return 1/0;if("-inf"==t)return-1/0;if("nan"==t)return NaN;if(!isNaN(parseFloat(t)))return+t;if(!1===t)return 0;if(!0===t)return 1;throw M("could not convert string to float: '"+k(t)+"'",Error())}function f(t){return 0|p(t)}function h(t){return!!(null!=t&&(["boolean","number"].indexOf(typeof t)>=0?t:t.__bool__ instanceof Function?!!t.__bool__()&&t:t.__len__ instanceof Function?0!==t.__len__()&&t:t instanceof Function?t:0!==c(t)&&t))}function y(t){var r=typeof t;if("object"!=r)return"boolean"==r?h:"string"==r?k:"number"==r?t%1==0?f:p:null;try{return"__class__"in t?t.__class__:o}catch(t){return r}}function g(t,r){if(r instanceof Array){for(let e of r)if(g(t,e))return!0;return!1}try{var e=t;if(e==r)return!0;for(var n=[].slice.call(e.__bases__);n.length;){if((e=n.shift())==r)return!0;e.__bases__.length&&(n=[].slice.call(e.__bases__).concat(n))}return!1}catch(e){return t==r||r==o}}function v(t,r){try{return"__class__"in t?g(t.__class__,r):g(y(t),r)}catch(e){return g(y(t),r)}}function d(t){try{return t.__repr__()}catch(i){try{return t.__str__()}catch(i){try{if(null==t)return"None";if(t.constructor!=Object)return"boolean"==typeof t?t.toString().capitalize():t.toString();var r="{",e=!1;for(var n in t)if(!l(n)){if(n.isnumeric())var _=n;else var _="'"+n+"'";e?r+=", ":e=!0,r+=_+": "+d(t[n])}return r+="}"}catch(r){return"<object of type: "+typeof t+">"}}}}function m(){try{return{value:this.__next__(),done:!1}}catch(t){return{value:void 0,done:!0}}}function b(){var t=this.next();if(!t.done)return t.value;throw K(Error())}function w(t){if("string"==typeof t||"__iter__"in t){var r=t.__iter__();r.next=m}else if("selector"in t){var r=x(t).__iter__();r.next=m}else if("next"in t){var r=t;"__next__"in r||(r.__next__=b)}else if(Symbol.iterator in t){var r=t[Symbol.iterator]();r.__next__=b}else throw Z(Error());return r[Symbol.iterator]=function(){return r},r}function A(t){this.iterable=t,this.index=0}function O(t){this.iterable=t,this.index=0}function x(t){return t?Array.from(t):[]}function S(t){let r=t?[].slice.apply(t):[];return r.__class__=S,r}function j(t){let r=[];if(t)for(let e=0;e<t.length;e++)r.add(t[e]);return r.__class__=j,r}function k(t){if("number"==typeof t)return t.toString();try{return t.__str__()}catch(r){try{return d(t)}catch(r){return String(t)}}}function E(t){return this.hasOwnProperty(t)}function P(){var t=[];for(var r in this)l(r)||t.push(r);return t}function q(){var t=[];for(var r in this)l(r)||t.push([r,this[r]]);return t}function C(t){delete this[t]}function N(){for(var t in this)delete this[t]}function U(t,r){var e=this[t];return void 0==e&&(e=this["py_"+t]),void 0==e?void 0==r?null:r:e}function I(t,r){var e=this[t];if(void 0!=e)return e;var n=void 0==r?null:r;return this[t]=n,n}function F(t,r){var e=this[t];if(void 0!=e)return delete this[t],e;if(void 0===r)throw J(t,Error());return r}function T(){var t=Object.keys(this)[0];if(null==t)throw J("popitem(): dictionary is empty",Error());var r=S([t,this[t]]);return delete this[t],r}function $(t){for(var r in t)this[r]=t[r]}function z(){var t=[];for(var r in this)l(r)||t.push(this[r]);return t}function D(t){return this[t]}function W(t,r){this[t]=r}function L(t){var r={};if(!t||t instanceof Array){if(t)for(var e=0;e<t.length;e++){var n=t[e];if(!(n instanceof Array)||2!=n.length)throw M("dict update sequence element #"+e+" has length "+n.length+"; 2 is required",Error());var _=n[0],i=n[1];t instanceof Array||!(t instanceof Object)||v(t,L)||(i=L(i)),r[_]=i}}else if(v(t,L))for(var o=t.py_keys(),e=0;e<o.length;e++){var _=o[e];r[_]=t[_]}else if(t instanceof Object)r=t;else throw M("Invalid type of object for dict creation",Error());return u(r,"__class__",{value:L,enumerable:!1,writable:!0}),u(r,"__contains__",{value:E,enumerable:!1}),u(r,"py_keys",{value:P,enumerable:!1}),u(r,"__iter__",{value:function(){new A(this.py_keys())},enumerable:!1}),u(r,Symbol.iterator,{value:function(){new O(this.py_keys())},enumerable:!1}),u(r,"py_items",{value:q,enumerable:!1}),u(r,"py_del",{value:C,enumerable:!1}),u(r,"py_clear",{value:N,enumerable:!1}),u(r,"py_get",{value:U,enumerable:!1}),u(r,"py_setdefault",{value:I,enumerable:!1}),u(r,"py_pop",{value:F,enumerable:!1}),u(r,"py_popitem",{value:T,enumerable:!1}),u(r,"py_update",{value:$,enumerable:!1}),u(r,"py_values",{value:z,enumerable:!1}),u(r,"__getitem__",{value:D,enumerable:!1}),u(r,"__setitem__",{value:W,enumerable:!1}),r}n.executor_name=n.transpiler_name,p.__name__="float",p.__bases__=[o],f.__name__="int",f.__bases__=[o],h.__name__="bool",h.__bases__=[f],A.prototype.__next__=function(){if(this.index<this.iterable.length)return this.iterable[this.index++];throw K(Error())},O.prototype.next=function(){return this.index<this.iterable.py_keys.length?{value:this.index++,done:!1}:{value:void 0,done:!0}},Array.prototype.__class__=x,x.__name__="list",x.__bases__=[o],Array.prototype.__iter__=function(){return new A(this)},Array.prototype.__getslice__=function(t,r,e){if(t<0&&(t=this.length+t),null==r?r=this.length:r<0?r=this.length+r:r>this.length&&(r=this.length),1==e)return Array.prototype.slice.call(this,t,r);let n=x([]);for(let _=t;_<r;_+=e)n.push(this[_]);return n},Array.prototype.__setslice__=function(t,r,e,n){if(t<0&&(t=this.length+t),null==r?r=this.length:r<0&&(r=this.length+r),null==e)Array.prototype.splice.apply(this,[t,r-t].concat(n));else{let _=0;for(let i=t;i<r;i+=e)this[i]=n[_++]}},Array.prototype.__repr__=function(){if(this.__class__==j&&!this.length)return"set()";let t=this.__class__&&this.__class__!=x?this.__class__==S?"(":"{":"[";for(let r=0;r<this.length;r++)r&&(t+=", "),t+=d(this[r]);return this.__class__==S&&1==this.length&&(t+=","),t+=this.__class__&&this.__class__!=x?this.__class__==S?")":"}":"]"},Array.prototype.__str__=Array.prototype.__repr__,Array.prototype.append=function(t){this.push(t)},Array.prototype.py_clear=function(){this.length=0},Array.prototype.extend=function(t){this.push.apply(this,t)},Array.prototype.insert=function(t,r){this.splice(t,0,r)},Array.prototype.remove=function(t){let r=this.indexOf(t);if(-1==r)throw M("list.remove(x): x not in list",Error());this.splice(r,1)},Array.prototype.index=function(t){return this.indexOf(t)},Array.prototype.py_pop=function(t){return void 0==t?this.pop():this.splice(t,1)[0]},Array.prototype.py_sort=function(){V.apply(null,[this].concat([].slice.apply(arguments)))},Array.prototype.__add__=function(t){return x(this.concat(t))},Array.prototype.__mul__=function(t){let r=this;for(let e=1;e<t;e++)r=r.concat(this);return r},Array.prototype.__rmul__=Array.prototype.__mul__,S.__name__="tuple",S.__bases__=[o],j.__name__="set",j.__bases__=[o],Array.prototype.__bindexOf__=function(t){t+="";let r=0,e=this.length-1;for(;r<=e;){let n=(r+e)/2|0,_=this[n]+"";if(_<t)r=n+1;else{if(!(_>t))return n;e=n-1}}return -1},Array.prototype.add=function(t){-1==this.indexOf(t)&&this.push(t)},Array.prototype.discard=function(t){var r=this.indexOf(t);-1!=r&&this.splice(r,1)},Array.prototype.isdisjoint=function(t){this.sort();for(let r=0;r<t.length;r++)if(-1!=this.__bindexOf__(t[r]))return!1;return!0},Array.prototype.issuperset=function(t){this.sort();for(let r=0;r<t.length;r++)if(-1==this.__bindexOf__(t[r]))return!1;return!0},Array.prototype.issubset=function(t){return j(t.slice()).issuperset(this)},Array.prototype.union=function(t){let r=j(this.slice().sort());for(let e=0;e<t.length;e++)-1==r.__bindexOf__(t[e])&&r.push(t[e]);return r},Array.prototype.intersection=function(t){this.sort();let r=j();for(let e=0;e<t.length;e++)-1!=this.__bindexOf__(t[e])&&r.push(t[e]);return r},Array.prototype.difference=function(t){let r=j(t.slice().sort()),e=j();for(let t=0;t<this.length;t++)-1==r.__bindexOf__(this[t])&&e.push(this[t]);return e},Array.prototype.symmetric_difference=function(t){return this.union(t).difference(this.intersection(t))},Array.prototype.py_update=function(){let t=[].concat.apply(this.slice(),arguments).sort();this.py_clear();for(let r=0;r<t.length;r++)t[r]!=t[r-1]&&this.push(t[r])},Array.prototype.__eq__=function(t){if(this.length!=t.length)return!1;this.__class__==j&&(this.sort(),t.sort());for(let r=0;r<this.length;r++)if(this[r]!=t[r])return!1;return!0},Array.prototype.__ne__=function(t){return!this.__eq__(t)},Array.prototype.__le__=function(t){if(this.__class__==j)return this.issubset(t);for(let r=0;r<this.length;r++){if(this[r]>t[r])return!1;if(this[r]<t[r])break}return!0},Array.prototype.__ge__=function(t){if(this.__class__==j)return this.issuperset(t);for(let r=0;r<this.length;r++){if(this[r]<t[r])return!1;if(this[r]>t[r])break}return!0},Array.prototype.__lt__=function(t){return this.__class__==j?this.issubset(t)&&!this.issuperset(t):!this.__ge__(t)},Array.prototype.__gt__=function(t){return this.__class__==j?this.issuperset(t)&&!this.issubset(t):!this.__le__(t)},Uint8Array.prototype.__add__=function(t){let r=new Uint8Array(this.length+t.length);return r.set(this),r.set(t,this.length),r},Uint8Array.prototype.__mul__=function(t){let r=new Uint8Array(t*this.length);for(let e=0;e<t;e++)r.set(this,e*this.length);return r},Uint8Array.prototype.__rmul__=Uint8Array.prototype.__mul__,String.prototype.__class__=k,k.__name__="str",k.__bases__=[o],String.prototype.__iter__=function(){new A(this)},String.prototype.__repr__=function(){return(-1==this.indexOf("'")?"'"+this+"'":'"'+this+'"').py_replace("	","\\t").py_replace("\n","\\n")},String.prototype.__str__=function(){return this},String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1)},String.prototype.endswith=function(t){if(!(t instanceof Array))return""==t||this.slice(-t.length)==t;for(var r=0;r<t.length;r++)if(this.slice(-t[r].length)==t[r])return!0;return!1},String.prototype.find=function(t,r){return this.indexOf(t,r)},String.prototype.__getslice__=function(t,r,e){t<0&&(t=this.length+t),null==r?r=this.length:r<0&&(r=this.length+r);var n="";if(1==e)n=this.substring(t,r);else for(var _=t;_<r;_+=e)n=n.concat(this.charAt(_));return n},u(String.prototype,"format",{get:function(){return _(this,function(t){var r=S([].slice.apply(arguments).slice(1)),e=0;return t.replace(/\{(\w*)\}/g,function(t,n){if(""==n&&(n=e++),n==+n)return void 0===r[n]?t:k(r[n]);for(var _=0;_<r.length;_++)if("object"==typeof r[_]&&void 0!==r[_][n])return k(r[_][n]);return t})})},enumerable:!0}),String.prototype.isalnum=function(){return/^[0-9a-zA-Z]{1,}$/.test(this)},String.prototype.isalpha=function(){return/^[a-zA-Z]{1,}$/.test(this)},String.prototype.isdecimal=function(){return/^[0-9]{1,}$/.test(this)},String.prototype.isdigit=function(){return this.isdecimal()},String.prototype.islower=function(){return/^[a-z]{1,}$/.test(this)},String.prototype.isupper=function(){return/^[A-Z]{1,}$/.test(this)},String.prototype.isspace=function(){return/^[\s]{1,}$/.test(this)},String.prototype.isnumeric=function(){return!isNaN(parseFloat(this))&&isFinite(this)},String.prototype.join=function(t){return(t=Array.from(t)).join(this)},String.prototype.lower=function(){return this.toLowerCase()},String.prototype.py_replace=function(t,r,e){return this.split(t,e).join(r)},String.prototype.lstrip=function(){return this.replace(/^\s*/g,"")},String.prototype.rfind=function(t,r){return this.lastIndexOf(t,r)},String.prototype.rsplit=function(t,r){if(void 0==t||null==t){t=/\s+/;var e=this.strip()}else var e=this;if(void 0==r||-1==r)return e.split(t);var n=e.split(t);if(!(r<n.length))return n;var _=n.length-r;return[n.slice(0,_).join(t)].concat(n.slice(_))},String.prototype.rstrip=function(){return this.replace(/\s*$/g,"")},String.prototype.py_split=function(t,r){if(void 0==t||null==t){t=/\s+/;var e=this.strip()}else var e=this;if(void 0==r||-1==r)return e.split(t);var n=e.split(t);return r<n.length?n.slice(0,r).concat([n.slice(r).join(t)]):n},String.prototype.startswith=function(t){if(!(t instanceof Array))return 0==this.indexOf(t);for(var r=0;r<t.length;r++)if(0==this.indexOf(t[r]))return!0;return!1},String.prototype.strip=function(){return this.trim()},String.prototype.upper=function(){return this.toUpperCase()},String.prototype.__mul__=function(t){for(var r="",e=0;e<t;e++)r+=this;return r},String.prototype.__rmul__=String.prototype.__mul__,L.__name__="dict",L.__bases__=[o],u(Function.prototype,"__setdoc__",{value:function(t){return this.__doc__=t,this},enumerable:!1});var B=s("BaseException",[o],{__module__:e}),H=s("Exception",[B],{__module__:e,get __init__(){return _(this,function(t){var r=L();if(arguments.length){var e=arguments.length-1;if(arguments[e]&&arguments[e].hasOwnProperty("__kwargtrans__")){var n=arguments[e--];for(var _ in n)if("self"===_)var t=n[_];else r[_]=n[_];delete r.__kwargtrans__}var i=S([].slice.apply(arguments).slice(1,e+1))}else var i=S();t.__args__=i,null!=r.error?t.stack=r.error.stack:Error?t.stack=Error().stack:t.stack="No stack trace available"})},get __repr__(){return _(this,function(t){return c(t.__args__)>1?"{}{}".format(t.__class__.__name__,d(S(t.__args__))):c(t.__args__)?"{}({})".format(t.__class__.__name__,d(t.__args__[0])):"{}()".format(t.__class__.__name__)})},get __str__(){return _(this,function(t){return c(t.__args__)>1?k(S(t.__args__)):c(t.__args__)?k(t.__args__[0]):""})}}),Z=s("IterableError",[H],{__module__:e,get __init__(){return _(this,function(t,r){H.__init__(t,"Can't iterate over non-iterable",a({error:r}))})}}),K=s("StopIteration",[H],{__module__:e,get __init__(){return _(this,function(t,r){H.__init__(t,"Iterator exhausted",a({error:r}))})}}),M=s("ValueError",[H],{__module__:e,get __init__(){return _(this,function(t,r,e){H.__init__(t,r,a({error:e}))})}}),J=s("KeyError",[H],{__module__:e,get __init__(){return _(this,function(t,r,e){H.__init__(t,r,a({error:e}))})}});s("AssertionError",[H],{__module__:e,get __init__(){return _(this,function(t,r,e){r?H.__init__(t,r,a({error:e})):H.__init__(t,a({error:e}))})}}),s("NotImplementedError",[H],{__module__:e,get __init__(){return _(this,function(t,r,e){H.__init__(t,r,a({error:e}))})}}),s("IndexError",[H],{__module__:e,get __init__(){return _(this,function(t,r,e){H.__init__(t,r,a({error:e}))})}}),s("AttributeError",[H],{__module__:e,get __init__(){return _(this,function(t,r,e){H.__init__(t,r,a({error:e}))})}}),s("py_TypeError",[H],{__module__:e,get __init__(){return _(this,function(t,r,e){H.__init__(t,r,a({error:e}))})}});var R=s("Warning",[H],{__module__:e});s("UserWarning",[R],{__module__:e}),s("DeprecationWarning",[R],{__module__:e}),s("RuntimeWarning",[R],{__module__:e});var V=function(t,r,e){if(void 0===r||null!=r&&r.hasOwnProperty("__kwargtrans__"))var r=null;if(void 0===e||null!=e&&e.hasOwnProperty("__kwargtrans__"))var e=!1;if(arguments.length){var n=arguments.length-1;if(arguments[n]&&arguments[n].hasOwnProperty("__kwargtrans__")){var _=arguments[n--];for(var i in _)switch(i){case"iterable":var t=_[i];break;case"key":var r=_[i];break;case"reverse":var e=_[i]}}}r?t.sort(function(t,e){if(arguments.length){var n=arguments.length-1;if(arguments[n]&&arguments[n].hasOwnProperty("__kwargtrans__")){var _=arguments[n--];for(var i in _)switch(i){case"a":var t=_[i];break;case"b":var e=_[i]}}}return r(t)>r(e)?1:-1}):t.sort(),e&&t.reverse()},X=s("__Terminal__",[o],{__module__:e,get __init__(){return _(this,function(t){t.buffer="";try{t.element=document.getElementById("__terminal__")}catch(r){t.element=null}t.element&&(t.element.style.overflowX="auto",t.element.style.boxSizing="border-box",t.element.style.padding="5px",t.element.innerHTML="_")})},get print(){return _(this,function(t){var r=" ",e="\n";if(arguments.length){var n=arguments.length-1;if(arguments[n]&&arguments[n].hasOwnProperty("__kwargtrans__")){var _=arguments[n--];for(var i in _)switch(i){case"self":var t=_[i];break;case"sep":var r=_[i];break;case"end":var e=_[i]}}var o=S([].slice.apply(arguments).slice(1,n+1))}else var o=S();t.buffer="{}{}{}".format(t.buffer,r.join(function(){var t=[];for(var r of o)t.append(k(r));return t}()),e).__getslice__(-4096,null,1),t.element?(t.element.innerHTML=t.buffer.py_replace("\n","<br>").py_replace(" ","&nbsp"),t.element.scrollTop=t.element.scrollHeight):console.log(r.join(function(){var t=[];for(var r of o)t.append(k(r));return t}()))})},get input(){return _(this,function(t,r){if(arguments.length){var e=arguments.length-1;if(arguments[e]&&arguments[e].hasOwnProperty("__kwargtrans__")){var n=arguments[e--];for(var _ in n)switch(_){case"self":var t=n[_];break;case"question":var r=n[_]}}}t.print("{}".format(r),a({end:""}));var i=window.prompt("\n".join(t.buffer.py_split("\n").__getslice__(-8,null,1)));return t.print(i),i})}})();X.print,X.input,grist.ready(L({requiredAccess:"full"}));var G=function(t,r,e){var n=document.createElement("table"),_=document.createElement("thead"),i=document.createElement("tr");for(var o of e){var s=document.createElement("th");s.appendChild(document.createTextNode(o)),i.appendChild(s)}_.appendChild(i);var a=document.createElement("tbody");for(var u of r){var i=document.createElement("tr");for(var l of u){var c=document.createElement("td");c.appendChild(document.createTextNode(l)),i.appendChild(c)}a.appendChild(i)}n.appendChild(_),n.appendChild(a),document.getElementById(t).firstChild.replaceWith(n)},Q=document.querySelector("#query"),Y=document.querySelector("#q"),tt=document.querySelector("#reply"),tr=async function(t){if(t.ctrlKey&&13==t.which){var r=await grist.docApi.getAccessToken(L({readOnly:!0})),e=await fetch("{}/sql?auth={}&q={}".format(r.baseUrl,r.token,Q.value)).then(function(t){return t.json()}),n=L(e.records[0].fields).py_keys();G("reply",function(){var t=[];for(var r of e.records)t.append(function(){var t=[];for(var e of n)t.append(JSON.stringify(r.fields[e],null,2));return w(t)}());return w(t)}(),n),t.preventDefault()}};Q.addEventListener("keydown",tr);//# sourceMappingURL=index.f402c925.js.map

//# sourceMappingURL=index.f402c925.js.map

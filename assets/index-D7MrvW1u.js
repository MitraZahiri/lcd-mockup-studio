var e=Object.defineProperty,t=Object.getOwnPropertyDescriptor,n=Object.getOwnPropertyNames,r=Object.prototype.hasOwnProperty,i=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(e){throw n=[e],e}},a=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),o=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r},s=(i,a,o,s)=>{if(a&&typeof a==`object`||typeof a==`function`)for(var c=n(a),l=0,u=c.length,d;l<u;l++)d=c[l],!r.call(i,d)&&d!==o&&e(i,d,{get:(e=>a[e]).bind(null,d),enumerable:!(s=t(a,d))||s.enumerable});return i},c=t=>r.call(t,`module.exports`)?t[`module.exports`]:s(e({},`__esModule`,{value:!0}),t),l=(e=>typeof require<`u`?require:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof require<`u`?require:e)[t]}):e)(function(e){if(typeof require<`u`)return require.apply(this,arguments);throw Error('Calling `require` for "'+e+"\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.")});(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u={display:{width:800,height:480,background:`#18211b`},reference:{src:null,fileName:null,naturalWidth:0,naturalHeight:0},elements:[],selectedId:null,view:{scale:1},grid:{enabled:!0,snap:!0,size:10},overlay:{enabled:!1,opacity:.4}},d=100,f=[],p=[],m=!1;function h(e){try{return structuredClone(e)}catch{return JSON.parse(JSON.stringify(e,(e,t)=>{if(!(typeof HTMLElement<`u`&&t instanceof HTMLElement)&&!(typeof HTMLCanvasElement<`u`&&t instanceof HTMLCanvasElement)&&!(typeof OffscreenCanvas<`u`&&t instanceof OffscreenCanvas))return t}))}}function g(e){return h(e)}function _(){return g({display:u.display,elements:u.elements,grid:u.grid})}function v(e,t){return JSON.stringify(e)===JSON.stringify(t)}function y(){if(m)return;let e=_(),t=f[f.length-1];t&&v(t,e)||(f.push(e),f.length>d&&f.shift(),p.length=0)}function b(){return f.length>1}function x(){return p.length>0}function S(e){m=!0,u.display=g(e.display),u.elements=g(e.elements),u.grid=g(e.grid),u.selectedId=null,m=!1,D()}function C(){if(!b())return!1;let e=f.pop();p.push(e);let t=f[f.length-1];return S(t),!0}function w(){if(!x())return!1;let e=p.pop();return f.push(e),S(e),!0}function T(){f.length=0,p.length=0,f.push(_()),D()}var ee=new Set;function E(e){return ee.add(e),()=>{ee.delete(e)}}function D(){y(),ee.forEach(e=>{e(u)})}function O(){return u.elements.find(e=>e.id===u.selectedId)||null}function k(e){u.selectedId=e,D()}function te(e,t=!0){u.elements.push(e),u.selectedId=e.id,t&&D()}function ne(e){Array.isArray(e)&&(u.elements.push(...e),e.length>0&&(u.selectedId=e[e.length-1].id),D())}function re(e){u.elements=u.elements.filter(t=>t.id!==e),u.selectedId===e&&(u.selectedId=null),D()}function ie(e=!0){u.elements=u.elements.filter(e=>e.source!==`analysis`),u.elements.some(e=>e.id===u.selectedId)||(u.selectedId=null),e&&D()}function ae(e,t,n=!0){let r=u.elements.find(t=>t.id===e);r&&(Object.assign(r,t),n&&D())}function oe(e){Object.assign(u.display,e),D()}function se(e){Object.assign(u.reference,e),D()}function A(e){let t=Number(e);Number.isFinite(t)&&(u.view.scale=Math.max(.1,Math.min(8,t)),D())}function ce(e){u.grid.enabled=!!e,D()}function le(e){u.grid.snap=!!e,D()}function j(){return typeof crypto<`u`&&crypto.randomUUID?crypto.randomUUID():`element-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}var M=null;function ue(){return M}function de(e=u.selectedId){let t=u.elements.find(t=>t.id===e);if(!t)return null;let n=h(t);return n.id=j(),n.x=Math.max(0,Math.min(u.display.width-n.width,n.x+8)),n.y=Math.max(0,Math.min(u.display.height-n.height,n.y+8)),n.name&&=n.name.includes(`(Copy)`)?n.name:`${n.name} (Copy)`,u.elements.push(n),u.selectedId=n.id,D(),n}function fe(e=u.selectedId){let t=u.elements.find(t=>t.id===e);return t?(M=h(t),M):null}function pe(){if(!M)return null;let e=h(M);return e.id=j(),e.x=Math.max(0,Math.min(u.display.width-e.width,e.x+8)),e.y=Math.max(0,Math.min(u.display.height-e.height,e.y+8)),M.x=e.x,M.y=e.y,e.name&&=e.name.includes(`(Copy)`)?e.name:`${e.name} (Copy)`,u.elements.push(e),u.selectedId=e.id,D(),e}function N(e=u.selectedId,t){let n=u.elements.find(t=>t.id===e);if(!n)return;let{width:r,height:i}=u.display;switch(t){case`left`:n.x=0;break;case`center`:n.x=Math.max(0,Math.round((r-n.width)/2));break;case`right`:n.x=Math.max(0,r-n.width);break;case`top`:n.y=0;break;case`middle`:n.y=Math.max(0,Math.round((i-n.height)/2));break;case`bottom`:n.y=Math.max(0,i-n.height);break;default:return}D()}function me(e=`horizontal`){if(u.elements.length<3)return;let t=[...u.elements];if(e===`horizontal`){t.sort((e,t)=>e.x-t.x);let e=t[0],n=t[t.length-1],r=e.x,i=(n.x+n.width-r-t.reduce((e,t)=>e+t.width,0))/(t.length-1),a=r;for(let e of t)e.x=Math.round(a),a+=e.width+i}else if(e===`vertical`){t.sort((e,t)=>e.y-t.y);let e=t[0],n=t[t.length-1],r=e.y,i=(n.y+n.height-r-t.reduce((e,t)=>e+t.height,0))/(t.length-1),a=r;for(let e of t)e.y=Math.round(a),a+=e.height+i}D()}function he(e=u.selectedId,t){let n=u.elements.findIndex(t=>t.id===e);if(n===-1)return;let r=u.elements,i=r[n];if(t===`up`&&n<r.length-1)r[n]=r[n+1],r[n+1]=i;else if(t===`down`&&n>0)r[n]=r[n-1],r[n-1]=i;else if(t===`front`)r.splice(n,1),r.push(i);else if(t===`back`)r.splice(n,1),r.unshift(i);else return;D()}function ge(e){u.overlay.enabled=!!e,D()}function _e(e){let t=Number(e);Number.isFinite(t)&&(u.overlay.opacity=Math.max(0,Math.min(1,t)),D())}var P={emerald:{name:`Dark Emerald`,background:`#18211b`,color:`#a8d9a8`,fill:`#324638`},nokia:{name:`Nokia 5110 Matrix`,background:`#c4d5b6`,color:`#222b1d`,fill:`#8fa77e`},"stn-blue":{name:`Blue STN LCD`,background:`#002277`,color:`#ffffff`,fill:`#0033aa`},amber:{name:`Industrial Amber`,background:`#141006`,color:`#ffaa00`,fill:`#3a2705`},"oled-cyan":{name:`OLED Cyan`,background:`#000810`,color:`#00e5ff`,fill:`#002b3d`},"gray-lcd":{name:`Classic Gray LCD`,background:`#9aa89a`,color:`#1a201c`,fill:`#738273`}};function F(e){let t=P[e];t&&(u.display.background=t.background,D())}var ve={"ssd1306-128x64":{name:`SSD1306 128×64 (0.96" OLED)`,width:128,height:64,colorPreset:`oled-cyan`},"ssd1306-128x32":{name:`SSD1306 128×32 (0.91" OLED)`,width:128,height:32,colorPreset:`oled-cyan`},"st7920-128x64":{name:`ST7920 128×64 (Graphic LCD)`,width:128,height:64,colorPreset:`stn-blue`},"nokia-84x48":{name:`PCD8544 84×48 (Nokia 5110)`,width:84,height:48,colorPreset:`nokia`},"hd44780-16x2":{name:`HD44780 16×2 (Character LCD)`,width:160,height:32,colorPreset:`stn-blue`},"st7789-240x240":{name:`ST7789 240×240 (Square IPS)`,width:240,height:240,colorPreset:`emerald`}};function ye(e){let t=ve[e];t&&(u.display.width=t.width,u.display.height=t.height,t.colorPreset&&P[t.colorPreset]&&(u.display.background=P[t.colorPreset].background),y(),D())}T();var I=33554432;function L(e,t){if(!e)throw Error(t)}function R(e,t,n=0,r=16384){return L(Number.isFinite(e)&&e>=n&&e<=r,`Invalid ${t}.`),e}function be(e,t,n=1e4){return L(typeof e==`string`&&e.length<=n,`Invalid ${t}.`),e}function xe(e,t=!1){return L(typeof e==`string`&&(/^#[0-9a-f]{6}$/i.test(e)||t&&e===`transparent`),`Invalid project color.`),e}function Se(e){L(e?.format===`lcd-mockup-studio`&&e.version===1,`This is not a supported LCD Mockup Studio project (version 1).`);let t={width:R(e.display?.width,`display width`,1),height:R(e.display?.height,`display height`,1),background:xe(e.display?.background)},n=e.grid;L(typeof n?.enabled==`boolean`&&typeof n?.snap==`boolean`,`Invalid project grid.`),L(Array.isArray(e.elements)&&e.elements.length<=1e4,`The project must contain at most 10,000 elements.`);let r=new Set,i=e.elements.map(e=>{L(e&&[`text`,`rectangle`,`circle`,`line`,`bitmap`].includes(e.type),`Unsupported element type.`);let t=be(e.id,`element ID`,200);L(t.length>0&&!r.has(t),`Missing or duplicate element ID.`),r.add(t);let n={id:t,type:e.type,name:be(e.name??e.type,`element name`),x:R(e.x,`element X`,-1e6,1e6),y:R(e.y,`element Y`,-1e6,1e6),width:R(e.width,`element width`,1,1e6),height:R(e.height,`element height`,1,1e6)};e.source===`analysis`&&(n.source=`analysis`);for(let t of[`confidence`,`fusionScore`,`support`,`sourceSupport`])Number.isFinite(e[t])&&(n[t]=e[t]);return e.opacity!==void 0&&(n.opacity=R(e.opacity,`opacity`,0,1)),e.rotation!==void 0&&(n.rotation=R(e.rotation,`rotation`,-360,360)),e.type===`text`?(R(Number(e.fontWeight),`font weight`,1,1e3),L(typeof e.fontWeight==`number`||typeof e.fontWeight==`string`,`Invalid font weight.`),e.textAlign!==void 0&&(L([`left`,`center`,`right`].includes(e.textAlign),`Invalid text alignment.`),n.textAlign=e.textAlign),Object.assign(n,{text:be(e.text,`element text`),fontFamily:be(e.fontFamily,`font family`,200),fontSize:R(e.fontSize,`font size`,1),fontWeight:e.fontWeight,color:xe(e.color)})):e.type===`bitmap`?(n.dataUrl=be(e.dataUrl,`bitmap data URL`,15e6),e.ditherMethod&&(n.ditherMethod=be(e.ditherMethod,`dither method`,50)),e.contrast!==void 0&&(n.contrast=R(e.contrast,`contrast`,-100,100)),e.brightness!==void 0&&(n.brightness=R(e.brightness,`brightness`,-100,100)),e.threshold!==void 0&&(n.threshold=R(e.threshold,`threshold`,0,255)),e.invert!==void 0&&(n.invert=!!e.invert)):(n.strokeWidth=R(e.strokeWidth,`stroke width`,1),e.type===`line`?n.color=xe(e.color):(n.fill=xe(e.fill,!0),n.stroke=xe(e.stroke))),n}),a=null;if(e.reference!=null){let t=e.reference;L(typeof t.src==`string`&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(t.src),`The reference must be an embedded PNG, JPEG or WebP image.`),a={src:t.src,fileName:be(t.fileName,`reference filename`,1e3),naturalWidth:R(t.naturalWidth,`reference width`,1),naturalHeight:R(t.naturalHeight,`reference height`,1)}}return{format:`lcd-mockup-studio`,version:1,name:be(e.name,`project name`,200),display:t,elements:i,reference:a,grid:{enabled:n.enabled,snap:n.snap,size:R(n.size,`grid size`,1,1024)}}}function Ce(e){L(new Blob([e]).size<=I,`Project exceeds the 32 MB limit.`);let t;try{t=JSON.parse(e)}catch{throw Error(`The project file contains invalid JSON.`)}return Se(t)}function z(e,t){return structuredClone({format:`lcd-mockup-studio`,version:1,name:t,display:e.display,elements:e.elements,grid:e.grid,reference:e.reference.src?e.reference:null})}var we=()=>({src:null,fileName:null,naturalWidth:0,naturalHeight:0});function Te(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(Error(`The reference image could not be saved.`)),r.readAsDataURL(e)})}function Ee(e){return e?new Promise((t,n)=>{let r=new Image;r.onload=()=>{r.naturalWidth!==e.naturalWidth||r.naturalHeight!==e.naturalHeight?n(Error(`Reference image dimensions do not match the project.`)):t()},r.onerror=()=>n(Error(`The embedded reference image is damaged.`)),r.src=e.src}):Promise.resolve()}function De({refreshReference:e,fitWorkspace:t,isAnalyzing:n}){let r=document.querySelector(`#new-project`),i=document.querySelector(`#open-project`),a=document.querySelector(`#save-project`),o=document.querySelector(`#project-file-input`),s=document.querySelector(`#project-title`),c=document.querySelector(`#project-status`),l=`Untitled Project`,d=!1,f=()=>JSON.stringify(z(u,l)),p=f();T();let m=()=>f()!==p,h=()=>{s.textContent=`${l}${m()?` *`:``}`};E(h);function g(e){d=e,r.disabled=i.disabled=a.disabled=e}function _(){return!n()||(window.alert(`Wait for image analysis or reference loading to finish.`),!1)}function v(){return!m()||window.confirm(`Replace the current project? Unsaved changes will be lost.`)}function y(n){let r=u.reference.src;Object.assign(u,{display:n.display,elements:n.elements,grid:n.grid,reference:n.reference??we(),selectedId:null,view:{scale:1}}),l=n.name||`Untitled Project`,p=f(),r?.startsWith(`blob:`)&&URL.revokeObjectURL(r),e(),T(),D(),requestAnimationFrame(t)}r.addEventListener(`click`,()=>{!d&&_()&&v()&&(y({name:`Untitled Project`,display:{width:800,height:480,background:`#18211b`},elements:[],reference:null,grid:{enabled:!0,snap:!0,size:10}}),c.textContent=`New project`)}),i.addEventListener(`click`,()=>{!d&&_()&&o.click()}),o.addEventListener(`change`,async()=>{let e=o.files?.[0];if(o.value=``,e&&!d&&_()){g(!0),c.textContent=`Opening project…`;try{if(e.size>33554432)throw Error(`Project exceeds the 32 MB limit.`);let t=Ce(await e.text());if(await Ee(t.reference),!_()||!v()){c.textContent=`Open cancelled`;return}y(t),c.textContent=`Project opened`}catch(e){c.textContent=`Could not open project`,window.alert(e.message)}finally{g(!1)}}});async function b(){if(d||!_())return;let e=window.prompt(`Project name`,l);if(e===null)return;let t=e.trim()||`Untitled Project`;if(t.length>200){window.alert(`Use a project name of at most 200 characters.`);return}let n=z(u,t),r=JSON.stringify(n);g(!0),c.textContent=`Preparing download…`;try{if(n.reference?.src.startsWith(`blob:`)){let e=await fetch(n.reference.src);if(!e.ok)throw Error(`The reference image could not be read.`);n.reference.src=await Te(await e.blob())}let e=new Blob([JSON.stringify(Se(n),null,2)],{type:`application/json`});if(e.size>33554432)throw Error(`Project exceeds the 32 MB limit.`);let i=URL.createObjectURL(e),a=document.createElement(`a`);a.href=i,a.download=`${t.replace(/[^\p{L}\p{N}._-]+/gu,`-`).replace(/^\.+/,``)||`project`}.lcd.json`,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e3),l=t,p=r,h(),c.textContent=`Project download started`}catch(e){c.textContent=`Could not save project`,window.alert(e.message)}finally{g(!1)}}a.addEventListener(`click`,b),window.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`s`&&(e.preventDefault(),b())}),window.addEventListener(`beforeunload`,e=>{m()&&(e.preventDefault(),e.returnValue=``)}),h()}var B=16777216;function Oe(e,t){if(!Number.isInteger(e)||!Number.isInteger(t)||e<1||t<1||e>16384||t>16384||e*t>B)throw Error(`Use whole-pixel dimensions up to 16,384 per side and 16 megapixels total for PNG export.`)}function ke(e){return`${e.fontWeight||400} ${e.fontSize}px ${e.fontFamily||`monospace`}`}function Ae(e,t){let{x:n,y:r,width:i,height:a,fontSize:o}=t;e.beginPath(),e.rect(n,r,i,a),e.clip(),e.font=ke(t),e.textAlign=`left`,e.textBaseline=`alphabetic`,e.fillStyle=t.color;let s=String(t.text??``).replace(/[\t\n\r\f ]+/g,` `).replace(/^ | $/g,``),c=e.measureText(s||`M`),l=c.fontBoundingBoxAscent??o*.8,u=c.fontBoundingBoxDescent??o*.2;e.fillText(s,n,r+a/2+(l-u)/2)}function je(e,t){let{x:n,y:r,width:i,height:a,strokeWidth:o}=t;if(t.type===`line`){e.fillStyle=t.color,e.fillRect(n,r+(a-o)/2,i,o);return}let s=t.type===`circle`,c=(t,n,r,i)=>{s?e.ellipse(t+r/2,n+i/2,r/2,i/2,0,0,Math.PI*2):e.rect(t,n,r,i)};if(t.fill!==`transparent`&&(e.fillStyle=t.fill,e.beginPath(),c(n,r,i,a),e.fill()),o>0){e.fillStyle=t.stroke,e.beginPath(),c(n,r,i,a);let s=i-o*2,l=a-o*2;s>0&&l>0&&(e.moveTo(n+o+s,r+a/2),c(n+o,r+o,s,l)),e.fill(`evenodd`)}}var V=new Map;function Me(e,t){e&&t&&V.set(e,t)}function H(e,t){if(!t.dataUrl)return;let n=e.globalAlpha;t.opacity!==void 0&&t.opacity>=0&&t.opacity<=1&&(e.globalAlpha=n*t.opacity);let r=V.get(t.dataUrl);if(r&&e.drawImage){e.drawImage(r,t.x,t.y,t.width,t.height),e.globalAlpha=n;return}if(typeof Image<`u`){let n=new Image;n.src=t.dataUrl,n.complete&&n.naturalWidth>0&&e.drawImage&&e.drawImage(n,t.x,t.y,t.width,t.height)}e.globalAlpha=n}function Ne(e,t){let{width:n,height:r,background:i}=e.display;Oe(n,r),t.width=n,t.height=r;let a=t.getContext(`2d`);if(!a)throw Error(`PNG export is not available in this browser.`);a.fillStyle=i,a.fillRect(0,0,n,r);for(let t of e.elements){a.save();try{if(t.type===`text`)Ae(a,t);else if([`rectangle`,`circle`,`line`].includes(t.type))je(a,t);else if(t.type===`bitmap`)H(a,t);else throw Error(`Cannot export element type: ${t.type}`)}finally{a.restore()}}return t}async function Pe(e){let t=structuredClone({display:e.display,elements:e.elements});Oe(t.display.width,t.display.height),document.fonts&&await Promise.all(t.elements.filter(e=>e.type===`text`).map(e=>document.fonts.load(ke(e),e.text||`M`)));let n=Ne(t,document.createElement(`canvas`));return{blob:await new Promise((e,t)=>{n.toBlob(n=>{n?e(n):t(Error(`The browser could not generate the PNG. Try a smaller display size.`))},`image/png`)}),width:n.width,height:n.height}}function Fe(e){let t=document.querySelector(`#export-png`),n=document.querySelector(`#project-status`),r=!1;t.addEventListener(`click`,async()=>{if(!r){r=!0,t.disabled=!0,t.textContent=`Exporting…`,n.textContent=`Preparing PNG…`;try{let{blob:t,width:r,height:i}=await Pe(e),a=URL.createObjectURL(t),o=document.createElement(`a`);o.href=a,o.download=`lcd-mockup-${r}x${i}.png`,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(a),1e3),n.textContent=`PNG download started (${r} × ${i} px)`}catch(e){n.textContent=`PNG export failed: ${e.message}`}finally{r=!1,t.disabled=!1,t.textContent=`Export PNG`}}})}function U(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&apos;`)}function Ie(e,t){if(!Number.isInteger(e)||!Number.isInteger(t)||e<1||t<1||e>16384||t>16384||e*t>16777216)throw Error(`Use whole-pixel dimensions up to 16,384 per side and 16 megapixels total for SVG export.`)}function Le(e){let{width:t,height:n,background:r}=e.display;Ie(t,n);let i=[],a=[];for(let t of e.elements)if(t.type===`text`){let e=`clip-${t.id}`;a.push(`    <clipPath id="${U(e)}"><rect x="${t.x}" y="${t.y}" width="${t.width}" height="${t.height}" /></clipPath>`);let n=String(t.text??``).replace(/[\t\n\r\f ]+/g,` `).replace(/^ | $/g,``),r=U(t.fontFamily||`monospace`),o=U(t.color||`#a8d9a8`),s=U(t.fontWeight||`400`),c=Number(t.fontSize)||12,l=t.y+t.height/2;i.push(`  <g clip-path="url(#${U(e)})">\n    <text x="${t.x}" y="${l}" dominant-baseline="central" fill="${o}" font-family="${r}" font-size="${c}px" font-weight="${s}" xml:space="preserve">${U(n)}</text>\n  </g>`)}else if(t.type===`rectangle`){let e=Number(t.strokeWidth)||0,n=U(t.stroke||`transparent`),r=U(t.fill||`transparent`);if(e>0&&t.stroke&&t.stroke!==`transparent`){let a=e/2,o=t.x+a,s=t.y+a,c=Math.max(0,t.width-e),l=Math.max(0,t.height-e);i.push(`  <rect x="${o}" y="${s}" width="${c}" height="${l}" fill="${r}" stroke="${n}" stroke-width="${e}" />`)}else i.push(`  <rect x="${t.x}" y="${t.y}" width="${t.width}" height="${t.height}" fill="${r}" />`)}else if(t.type===`circle`){let e=Number(t.strokeWidth)||0,n=U(t.stroke||`transparent`),r=U(t.fill||`transparent`),a=t.x+t.width/2,o=t.y+t.height/2,s=Math.max(0,t.width/2-e/2),c=Math.max(0,t.height/2-e/2);e>0&&t.stroke&&t.stroke!==`transparent`?i.push(`  <ellipse cx="${a}" cy="${o}" rx="${s}" ry="${c}" fill="${r}" stroke="${n}" stroke-width="${e}" />`):i.push(`  <ellipse cx="${a}" cy="${o}" rx="${t.width/2}" ry="${t.height/2}" fill="${r}" />`)}else if(t.type===`line`){let e=Number(t.strokeWidth)||1,n=U(t.color||`#a8d9a8`),r=t.y+(t.height-e)/2;i.push(`  <rect x="${t.x}" y="${r}" width="${t.width}" height="${e}" fill="${n}" />`)}else if(t.type===`bitmap`){let e=U(t.dataUrl||``);i.push(`  <image href="${e}" x="${t.x}" y="${t.y}" width="${t.width}" height="${t.height}" image-rendering="pixelated" />`)}else throw Error(`Cannot export element type to SVG: ${t.type}`);let o=a.length>0?`  <defs>\n${a.join(`
`)}\n  </defs>\n`:``;return`<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t} ${n}" width="${t}" height="${n}">\n`+o+`  <rect width="${t}" height="${n}" fill="${U(r)}" />\n`+i.join(`
`)+`
</svg>
`}function Re(e){let t=structuredClone({display:e.display,elements:e.elements}),n=Le(t);return{blob:new Blob([n],{type:`image/svg+xml;charset=utf-8`}),width:t.display.width,height:t.display.height,svgString:n}}function ze(e){let t=document.querySelector(`#export-svg`),n=document.querySelector(`#project-status`);if(!t)return;let r=!1;t.addEventListener(`click`,()=>{if(!r){r=!0,t.disabled=!0,t.textContent=`Exporting…`,n&&(n.textContent=`Preparing SVG…`);try{let{blob:t,width:r,height:i}=Re(e),a=URL.createObjectURL(t),o=document.createElement(`a`);o.href=a,o.download=`lcd-mockup-${r}x${i}.svg`,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(a),1e3),n&&(n.textContent=`SVG download started (${r} × ${i} px)`)}catch(e){n&&(n.textContent=`SVG export failed: ${e.message}`)}finally{r=!1,t.disabled=!1,t.textContent=`Export SVG`}}})}var W={gaMeasurementId:``,goatCounterCode:``,debug:!1},G=!1,Be=[];function Ve(e){return typeof e==`string`&&/^G-[A-Z0-9]+$/i.test(e.trim())}function He(e){if(typeof e!=`string`)return!1;let t=e.trim();return t.length>0&&/^[a-z0-9_\-\.]+$/i.test(t)}function Ue(e={}){let t=typeof window<`u`&&window.LCD_ANALYTICS_CONFIG||{};if(W={gaMeasurementId:(e.gaMeasurementId||t.gaMeasurementId||``).trim(),goatCounterCode:(e.goatCounterCode||t.goatCounterCode||``).trim(),debug:!!(e.debug===void 0?t.debug:e.debug)},W.debug&&console.log(`[Analytics] Initializing with config:`,W),Ve(W.gaMeasurementId)?We(W.gaMeasurementId):W.debug&&W.gaMeasurementId&&console.warn(`[Analytics] Invalid GA Measurement ID format:`,W.gaMeasurementId),He(W.goatCounterCode)&&Ge(W.goatCounterCode),G=!0,Be.length>0){let e=[...Be];Be=[],e.forEach(e=>{e.type===`pageview`?Ke(e.path,e.title):e.type===`event`&&K(e.name,e.params)})}return W}function We(e){if(typeof document>`u`||typeof document.createElement!=`function`||document.querySelector&&document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${e}"]`))return;window.dataLayer=window.dataLayer||[],window.gtag=window.gtag||function(){window.dataLayer.push(arguments)},window.gtag(`js`,new Date),window.gtag(`config`,e,{send_page_view:!1});let t=document.createElement(`script`);t.async=!0,t.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(e)}`,document.head&&typeof document.head.appendChild==`function`&&document.head.appendChild(t),W.debug&&console.log(`[Analytics] Google Analytics 4 (${e}) script injected`)}function Ge(e){if(typeof document>`u`||typeof document.createElement!=`function`||document.querySelector&&document.querySelector(`script[src*="goatcounter.com/count.js"], script[src*="gc.zgo.at/count.js"]`))return;let t=document.createElement(`script`);t.async=!0,t.src=`//gc.zgo.at/count.js`;let n=e.includes(`.`)?`https://${e}/count`:`https://${e}.goatcounter.com/count`;t.setAttribute(`data-goatcounter`,n),t.setAttribute(`data-goatcounter-settings`,`{"no_onload": true}`),document.head&&typeof document.head.appendChild==`function`&&document.head.appendChild(t),W.debug&&console.log(`[Analytics] GoatCounter (${e}) script injected pointing to ${n}`)}function Ke(e=``,t=``){let n=e||(typeof window<`u`?window.location.pathname+window.location.hash:`/`),r=t||(typeof document<`u`?document.title:`LCD Mockup Studio`);if(!G&&typeof window<`u`){Be.push({type:`pageview`,path:n,title:r});return}W.debug&&console.log(`[Analytics] 📄 PageView: ${n} — "${r}"`),typeof window<`u`&&typeof window.gtag==`function`&&window.gtag(`event`,`page_view`,{page_path:n,page_title:r}),typeof window<`u`&&window.goatcounter&&typeof window.goatcounter.count==`function`&&window.goatcounter.count({path:n,title:r,event:!1})}function K(e,t={}){if(e&&typeof e==`string`){if(!G&&typeof window<`u`){Be.push({type:`event`,name:e,params:t});return}if(W.debug&&console.log(`[Analytics] ⚡ Event: "${e}"`,t),typeof window<`u`&&typeof window.gtag==`function`&&window.gtag(`event`,e,t),typeof window<`u`&&window.goatcounter&&typeof window.goatcounter.count==`function`){let n=Object.keys(t).length>0?` (${JSON.stringify(t)})`:``;window.goatcounter.count({path:`event/${e}`,title:`${e}${n}`,event:!0})}}}function qe(e,t={}){let{width:n,height:r,data:i}=e,a=t.threshold===void 0?128:t.threshold,o=!!t.invert,s=t.format||`adafruit`;function c(e,t){if(e>=n||t>=r)return!1;let s=(t*n+e)*4,c=i[s],l=i[s+1],u=i[s+2],d=.299*c+.587*l+.114*u>=a;return o?!d:d}let l=[],u=s===`xbm`||s===`arduino_sketch`;if(s===`u8g2`){let e=Math.ceil(r/8);for(let t=0;t<e;t++)for(let e=0;e<n;e++){let n=0;for(let r=0;r<8;r++){let i=t*8+r;c(e,i)&&(n|=1<<r)}l.push(n)}}else if(u){let e=Math.ceil(n/8);for(let t=0;t<r;t++)for(let r=0;r<e;r++){let e=0;for(let i=0;i<8;i++){let a=r*8+i;a<n&&c(a,t)&&(e|=1<<i)}l.push(e)}}else{let e=Math.ceil(n/8);for(let t=0;t<r;t++)for(let r=0;r<e;r++){let e=0;for(let i=0;i<8;i++){let a=r*8+i;a<n&&c(a,t)&&(e|=1<<7-i)}l.push(e)}}return new Uint8Array(l)}function Je(e={}){let{bitmapBytes:t,width:n,height:r,format:i=`adafruit`,variableName:a=`lcd_mockup_bitmap`,projectName:o=`LCD Mockup`}=e,s=a.replace(/[^a-zA-Z0-9_]/g,`_`)||`lcd_mockup_bitmap`,c=s.toUpperCase(),l=[];for(let e=0;e<t.length;e+=12){let n=Array.from(t.slice(e,e+12)).map(e=>`0x`+e.toString(16).padStart(2,`0`)).join(`, `);l.push(`  `+n+(e+12<t.length?`,`:``))}if(i===`micropython`)return`# =============================================================================
# Generated by LCD Mockup Studio (https://github.com/MitraZahiri/lcd-mockup-studio)
# Project: ${o}\n# Format: MicroPython framebuf (MONO_HLSB / Horizontal MSB-first)\n# Size: ${n} x ${r} px (${t.length} bytes)\n# =============================================================================\n\nimport framebuf\n\n${c}_WIDTH = ${n}\n${c}_HEIGHT = ${r}\n\n# 1-bit monochrome bitmap buffer\n${s} = bytearray([\n`+l.join(`
`)+`
])

# FrameBuffer object ready for blit():
fb = framebuf.FrameBuffer(${s}, ${c}_WIDTH, ${c}_HEIGHT, framebuf.MONO_HLSB)\n\n# Example usage with SSD1306 (I2C on ESP32 / Raspberry Pi Pico):\n# from machine import Pin, I2C\n# import ssd1306\n# i2c = I2C(0, scl=Pin(22), sda=Pin(21))\n# display = ssd1306.SSD1306_I2C(${c}_WIDTH, ${c}_HEIGHT, i2c)\n# display.blit(fb, 0, 0)\n# display.show()\n`;if(i===`arduino_sketch`)return`// =============================================================================
// Generated by LCD Mockup Studio (https://github.com/MitraZahiri/lcd-mockup-studio)
// Project: ${o}\n// Complete Ready-to-Flash Arduino Sketch for SSD1306 OLED (128x64 / I2C)\n// Size: ${n} x ${r} px (${t.length} bytes)\n// =============================================================================\n\n#include <Arduino.h>\n#include <Wire.h>\n#include <U8g2lib.h>\n\n// U8g2 constructor: SSD1306 128x64 Noname I2C (Hardware I2C)\nU8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);\n\n#define ${c}_WIDTH  ${n}\n#define ${c}_HEIGHT ${r}\n\nstatic const unsigned char PROGMEM ${s}[] = {\n`+l.join(`
`)+`
};

void setup() {
  Serial.begin(115200);
  Wire.begin();
  u8g2.begin();

  // Draw the full mockup display
  u8g2.clearBuffer();
  u8g2.drawXBMP(0, 0, ${c}_WIDTH, ${c}_HEIGHT, ${s});\n  u8g2.sendBuffer();\n\n  Serial.println(F("LCD Mockup displayed successfully!"));\n}\n\nvoid loop() {\n  // Put interactive display updates or sensor polling here\n  delay(1000);\n}\n`;let u=``;return i===`adafruit`?u=`// Adafruit_GFX usage:\n// display.drawBitmap(0, 0, ${s}, ${c}_WIDTH, ${c}_HEIGHT, 1);`:i===`u8g2`?u=`// U8g2 page-mode bitmap usage:\n// u8g2.drawBitmap(0, 0, (${c}_WIDTH + 7) / 8, ${c}_HEIGHT, ${s});`:i===`xbm`&&(u=`// U8g2 XBM usage:\n// u8g2.drawXBMP(0, 0, ${c}_WIDTH, ${c}_HEIGHT, ${s});`),i===`xbm`?`// =============================================================================
// Generated by LCD Mockup Studio (https://github.com/MitraZahiri/lcd-mockup-studio)
// Project: ${o}\n// Format: XBM (X BitMap / LSB-first horizontal)\n// Size: ${n} x ${r} px (${t.length} bytes)\n// ${u.replace(/\n/g,`
// `)}\n// =============================================================================\n\n#define ${c}_WIDTH ${n}\n#define ${c}_HEIGHT ${r}\n\nstatic const unsigned char ${s}[] = {\n`+l.join(`
`)+`
};
`:`// =============================================================================
// Generated by LCD Mockup Studio (https://github.com/MitraZahiri/lcd-mockup-studio)
// Project: ${o}\n// Format: ${i.toUpperCase()} (${i===`u8g2`?`Vertical 8-px Pages`:`Horizontal MSB-first`})\n// Size: ${n} x ${r} px (${t.length} bytes)\n// =============================================================================\n\n#ifndef ${c}_H\n#define ${c}_H\n\n#include <stdint.h>\n\n#if defined(__AVR__)\n  #include <avr/pgmspace.h>\n#elif defined(ESP8266) || defined(ESP32)\n  #include <pgmspace.h>\n#else\n  #ifndef PROGMEM\n    #define PROGMEM\n  #endif\n#endif\n\n#define ${c}_WIDTH  ${n}\n#define ${c}_HEIGHT ${r}\n\n${u}\n\nstatic const uint8_t PROGMEM ${s}[] = {\n`+l.join(`
`)+`
};

#endif // ${c}_H\n`}function Ye(e,t,n,r,i=`adafruit`){e.width=n,e.height=r;let a=e.getContext(`2d`);if(!a)return;let o=a.createImageData(n,r),s=o.data;function c(e,t,i){if(e>=n||t>=r)return;let a=(t*n+e)*4,o=i?255:20;s[a]=o,s[a+1]=i?255:25,s[a+2]=o,s[a+3]=255}if(i===`u8g2`){let e=Math.ceil(r/8),i=0;for(let r=0;r<e;r++)for(let e=0;e<n;e++){let n=t[i++]||0;for(let t=0;t<8;t++){let i=r*8+t;c(e,i,!!(n&1<<t))}}}else if(i===`xbm`){let e=Math.ceil(n/8),i=0;for(let a=0;a<r;a++)for(let r=0;r<e;r++){let e=t[i++]||0;for(let t=0;t<8;t++){let i=r*8+t;i<n&&c(i,a,!!(e&1<<t))}}}else{let e=Math.ceil(n/8),i=0;for(let a=0;a<r;a++)for(let r=0;r<e;r++){let e=t[i++]||0;for(let t=0;t<8;t++){let i=r*8+t;i<n&&c(i,a,!!(e&1<<7-t))}}}a.putImageData(o,0,0)}function Xe(e,t=`json_project`,n=!0){if(t===`json_elements`)return JSON.stringify(e.elements||[],null,n?2:0);let r=z(e,e.name||`LCD Mockup`);return JSON.stringify(r,null,n?2:0)}function Ze(e,t=`hex_array`){if(!e||e.length===0)return``;if(t===`hex_space`){let t=[];for(let n=0;n<e.length;n+=16){let r=Array.from(e.slice(n,n+16)).map(e=>e.toString(16).padStart(2,`0`).toUpperCase()).join(` `);t.push(r)}return t.join(`
`)}if(t===`hex_raw`)return Array.from(e).map(e=>e.toString(16).padStart(2,`0`).toUpperCase()).join(``);if(t===`hex_dump`){let t=[];for(let n=0;n<e.length;n+=16){let r=n.toString(16).padStart(8,`0`),i=Array.from(e.slice(n,n+16)),a=[],o=``;for(let e=0;e<16;e++)if(e<i.length){let t=i[e];a.push(t.toString(16).padStart(2,`0`)),o+=t>=32&&t<=126?String.fromCharCode(t):`.`}else a.push(`  `);let s=`${a.slice(0,4).join(` `)}  ${a.slice(4,8).join(` `)}  ${a.slice(8,12).join(` `)}  ${a.slice(12,16).join(` `)}`;t.push(`${r}: ${s}  |${o}|`)}return t.join(`
`)}let n=[];for(let t=0;t<e.length;t+=12){let r=Array.from(e.slice(t,t+12)).map(e=>`0x`+e.toString(16).padStart(2,`0`)).join(`, `);n.push(`  `+r+(t+12<e.length?`,`:``))}return`// Raw Hex Byte Array (${e.length} bytes / ${e.length*8} bits)\nconst uint8_t hex_bytes[${e.length}] = {\n${n.join(`
`)}\n};`}function Qe(e,t=`base64_dataurl`,n=128,r=64){let i=``;return typeof e==`string`?i=e:e&&e.toDataURL&&(i=e.toDataURL(`image/png`)),t===`base64_raw`?i.replace(/^data:image\/[a-z]+;base64,/,``):t===`base64_html`?`<img src="${i}" width="${n}" height="${r}" alt="LCD Mockup" style="image-rendering: pixelated;" />`:i}var $e={c:[{value:`adafruit`,label:`Adafruit_GFX (Horizontal MSB-first .h)`},{value:`u8g2`,label:`U8g2 / SSD1306 (Vertical 8-px Pages .h)`},{value:`xbm`,label:`XBM (Standard X BitMap / LSB-first .h)`},{value:`arduino_sketch`,label:`Complete Arduino Sketch (.ino)`}],json:[{value:`json_project`,label:`Full Project Layout & Elements (.json)`},{value:`json_elements`,label:`Canvas Elements Only Array (.json)`}],hex:[{value:`hex_array`,label:`C Hex Array (0x00, 0x1F, ...)`},{value:`hex_space`,label:`Space-Separated Bytes (00 1F FF ...)`},{value:`hex_dump`,label:`Formatted Memory Hex Dump`},{value:`hex_raw`,label:`Continuous Hex Stream (001FFF...)`}],micropython:[{value:`micropython`,label:`MicroPython framebuf (ESP32/Pico .py)`}],base64:[{value:`base64_dataurl`,label:`PNG Data URI (data:image/png;base64,...)`},{value:`base64_raw`,label:`Raw Base64 Payload String`},{value:`base64_html`,label:`HTML <img> Tag Snippet`}]};function et(e){let t=document.querySelector(`#export-c`),n=document.querySelector(`#c-export-modal`);if(!t||!n)return;let r=n.querySelector(`#c-export-close`),i=n.querySelectorAll(`.code-tab-btn`),a=n.querySelector(`#c-export-format`),o=n.querySelector(`#c-export-threshold`),s=n.querySelector(`#c-export-threshold-val`),c=n.querySelector(`#c-export-invert`),l=n.querySelector(`#c-export-code`),u=n.querySelector(`#c-export-copy`),d=n.querySelector(`#c-export-download`),f=n.querySelector(`#c-export-preview`),p=n.querySelector(`#code-preview-container`),m=n.querySelector(`#code-preview-title`),h=n.querySelector(`#c-export-resolution`),g=n.querySelector(`#c-export-format-badge`),_=n.querySelector(`#code-mono-options`),v=n.querySelector(`#code-json-options`),y=n.querySelector(`#code-json-pretty`),b=`c`,x=``,S=null;function C(e){if(!a)return;let t=$e[e]||$e.c;a.innerHTML=``;for(let e of t){let t=document.createElement(`option`);t.value=e.value,t.textContent=e.label,a.appendChild(t)}}function w(e){b=e,i.forEach(t=>{t.classList.toggle(`active`,t.dataset.tab===e)}),C(e),_&&v&&(e===`json`?(_.hidden=!0,_.style.display=`none`,v.hidden=!1,v.style.display=`flex`,p&&(p.style.display=`none`),m&&(m.style.display=`none`)):(_.hidden=!1,_.style.display=`flex`,v.hidden=!0,v.style.display=`none`,p&&(p.style.display=`flex`),m&&(m.style.display=`block`))),g&&(g.textContent={c:`C / C++`,json:`JSON`,hex:`Hex Code`,micropython:`Python`,base64:`Base64`}[e]||`Code`),T()}function T(){let{width:t,height:r}=e.display,i=document.createElement(`canvas`);Ne(structuredClone({display:e.display,elements:e.elements}),i);let p=i.getContext(`2d`);if(!p)return;let m=p.getImageData(0,0,t,r),g=a?a.value:`adafruit`,_=o?Number(o.value):128,v=c?c.checked:!1;s&&(s.textContent=String(_)),h&&(h.textContent=`${t} × ${r} px`);let C=n.querySelector(`#json-info-res`),w=n.querySelector(`#json-info-count`),T=n.querySelector(`#json-info-bg`);if(C&&(C.textContent=`${t} × ${r} px`),w&&(w.textContent=`${e.elements?.length||0} elements`),T&&(T.textContent=e.display?.background||`#000000`),b===`json`){x=Xe(e,g,!y||y.checked),l&&(l.value=x),u&&(u.textContent=`📋 Copy JSON Code`),d&&(d.textContent=`⭳ Download .json File`);return}let ee=g===`arduino_sketch`||g===`xbm`?`xbm`:`adafruit`;S=qe(m,{threshold:_,invert:v,format:ee}),f&&Ye(f,S,t,r,ee),b===`hex`?(x=Ze(S,g),u&&(u.textContent=`📋 Copy Hex Code`),d&&(d.textContent=`⭳ Download .hex File`)):b===`micropython`?(x=Je({bitmapBytes:S,width:t,height:r,format:`micropython`,variableName:`lcd_mockup_bitmap`,projectName:`LCD Mockup`}),u&&(u.textContent=`📋 Copy Python Code`),d&&(d.textContent=`⭳ Download .py Script`)):b===`base64`?(x=Qe(f||i,g,t,r),u&&(u.textContent=`📋 Copy Base64`),d&&(d.textContent=`⭳ Download .txt File`)):(x=Je({bitmapBytes:S,width:t,height:r,format:g,variableName:`lcd_mockup_bitmap`,projectName:`LCD Mockup`}),u&&(g===`arduino_sketch`?u.textContent=`📋 Copy Arduino Sketch`:u.textContent=`📋 Copy C Code`),d&&(g===`arduino_sketch`?d.textContent=`⭳ Download .ino Sketch`:g===`xbm`?d.textContent=`⭳ Download .xbm File`:d.textContent=`⭳ Download .h Header`)),l&&(l.value=x)}function ee(){w(b||`c`),n.removeAttribute(`hidden`),n.hidden=!1,n.classList.add(`open`),n.style.display=`flex`,K(`export_modal_open`,{category:b})}function E(){n.setAttribute(`hidden`,``),n.hidden=!0,n.classList.remove(`open`),n.style.display=`none`}E(),t.addEventListener(`click`,ee),r?.addEventListener(`click`,E),n.addEventListener(`click`,e=>{e.target===n&&E()}),i.forEach(e=>{e.addEventListener(`click`,()=>{w(e.dataset.tab),K(`export_tab_change`,{category:e.dataset.tab})})}),a?.addEventListener(`change`,T),o?.addEventListener(`input`,T),c?.addEventListener(`change`,T),y?.addEventListener(`change`,T),u?.addEventListener(`click`,async()=>{if(x){K(`export_code_copy`,{category:b,format:a?a.value:`default`});try{await navigator.clipboard.writeText(x);let e=u.textContent;u.textContent=`✓ Copied to Clipboard!`,setTimeout(()=>{u.textContent=e},1500)}catch{l.select(),document.execCommand(`copy`)}}}),d?.addEventListener(`click`,()=>{if(!x)return;let{width:t,height:n}=e.display,r=a?a.value:`c`;K(`export_code_download`,{category:b,format:r,width:t,height:n});let i=`h`;b===`json`?i=`json`:b===`hex`?i=`hex`:b===`micropython`||r===`micropython`?i=`py`:r===`arduino_sketch`?i=`ino`:r===`xbm`?i=`xbm`:b===`base64`&&(i=`txt`);let o=new Blob([x],{type:`text/plain;charset=utf-8`}),s=URL.createObjectURL(o),c=document.createElement(`a`);c.href=s,c.download=`lcd-mockup-${t}x${n}.${i}`,document.body.appendChild(c),c.click(),c.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&(n.classList.contains(`open`)||!n.hidden)&&E()})}function tt(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>{t(r)},r.onerror=()=>{n(Error(`Reference image could not be read.`))},r.src=e})}function nt(e,t){let n=document.createElement(`canvas`);return n.width=e,n.height=t,n}function rt(e){let t=e.length/4,n=new Uint8Array(t);for(let r=0;r<t;r+=1){let t=r*4,i=e[t],a=e[t+1],o=e[t+2];n[r]=Math.round(i*.299+a*.587+o*.114)}return n}function it(e){if(!e||e.length===0)return 127;let t=new Uint32Array(256);for(let n=0;n<e.length;n+=1)t[e[n]]+=1;let n=e.length,r=0;for(let e=0;e<256;e+=1)r+=e*t[e];let i=0,a=0,o=127,s=-1;for(let e=0;e<256;e+=1){if(i+=t[e],i===0)continue;let c=n-i;if(c===0)break;a+=e*t[e];let l=a/i-(r-a)/c,u=i*c*l*l;u>s&&(s=u,o=e)}return o}function at(e,t){let n=0,r=0;for(let i=0;i<e.length;i+=1)e[i]<=t?n+=1:r+=1;return n<=r?`dark-on-light`:`light-on-dark`}function ot(e,t,n){let r=new Uint8Array(e.length),i=n===`dark-on-light`;for(let n=0;n<e.length;n+=1){let a=e[n];r[n]=+(i?a<=t:a>t)}return r}function st(e,t,n){if(!e||t<3||n<3)return e;let r=e.slice();for(let i=1;i<n-1;i+=1)for(let n=1;n<t-1;n+=1){let a=i*t+n;if(r[a]===0)continue;let o=0;for(let e=-1;e<=1;e+=1)for(let a=-1;a<=1;a+=1){if(a===0&&e===0)continue;let s=(i+e)*t+(n+a);o+=r[s]}o===0&&(e[a]=0)}return e}function ct(e){let t=e.naturalWidth,n=e.naturalHeight;if(!Number.isFinite(t)||!Number.isFinite(n)||t<1||n<1)throw Error(`Reference image has invalid dimensions.`);let r=nt(t,n),i=r.getContext(`2d`,{willReadFrequently:!0});if(!i)throw Error(`Canvas image analysis is not available.`);i.imageSmoothingEnabled=!1,i.drawImage(e,0,0,t,n);let a=i.getImageData(0,0,t,n),o=rt(a.data),s=it(o),c=at(o,s),l=ot(o,s,c);return st(l,t,n),{width:t,height:n,canvas:r,imageData:a,grayscale:o,threshold:s,polarity:c,binaryMask:l}}function lt(e,t){if(!e||!t)return{foreground:`#a8d9a8`,background:`#1d2720`};let{data:n}=e,r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0,d=t.length,f=Math.max(1,Math.floor(d/25e3));for(let e=0;e<d;e+=f){let d=e*4,f=n[d],p=n[d+1],m=n[d+2];t[e]===1?(r+=f,i+=p,a+=m,o++):(s+=f,c+=p,l+=m,u++)}function p(e,t,n){let r=e=>Math.max(0,Math.min(255,Math.round(e))),i=e=>r(e).toString(16).padStart(2,`0`);return`#${i(e)}${i(t)}${i(n)}`}return{foreground:o>0?p(r/o,i/o,a/o):`#a8d9a8`,background:u>0?p(s/u,c/u,l/u):`#1d2720`}}function ut(e,t,n,r,i=[],a=`#a8d9a8`){let o=[],s=new Set,c=dt(e,t,n,r,s);for(let e of c)o.push(...e.elements);for(let r=0;r<e.length;r++){if(s.has(r))continue;let{x:c,y:l,width:u,height:d,area:f,density:p}=e[r];if(Ct(c,l,u,d,i))continue;if(pt(t,n,c,l,u,d)){s.add(r);let e=mt(t,n,c,l,u,d,a);o.push(...e);continue}let m=ht(t,n,c,l,u,d,p);if(m){s.add(r),o.push(gt(m,c,l,u,d,a));continue}if(_t(t,n,c,l,u,d)){s.add(r),o.push(St(`🔒`,`Detected Lock Icon`,c,l,u,d,a));continue}if(vt(t,n,c,l,u,d)){s.add(r),o.push(St(`🔔`,`Detected Alarm Bell`,c,l,u,d,a));continue}if(yt(t,n,c,l,u,d)){s.add(r),o.push(St(`💧`,`Detected Fluid Drop`,c,l,u,d,a));continue}if(bt(t,n,c,l,u,d)){s.add(r),o.push(St(`ᛒ`,`Detected Bluetooth Icon`,c,l,u,d,a));continue}if(xt(t,n,c,l,u,d)===`checked`){s.add(r),o.push(St(`☑`,`Detected Checked Box`,c,l,u,d,a));continue}}return{symbols:o,consumedIndices:s}}function dt(e,t,n,r,i){let a=[],o=[];for(let t=0;t<e.length;t++){if(i.has(t))continue;let n=e[t];n.width>=1&&n.width<=8&&n.height>=4&&n.height<=40&&n.height>=n.width*1.2&&n.density>=.65&&o.push(t)}if(o.length<3)return a;o.sort((t,n)=>e[t].x-e[n].x);let s=[o[0]];for(let t=1;t<o.length;t++){let n=s[s.length-1],r=o[t],c=e[n],l=e[r],u=c.y+c.height,d=l.y+l.height,f=Math.abs(u-d)<=3,p=c.x+c.width,m=l.x-p,h=m>=1&&m<=7,g=l.height>=c.height-1;f&&h&&g?s.push(r):(s.length>=3&&s.length<=6&&a.push(ft(s,e,i)),s=[r])}return s.length>=3&&s.length<=6&&a.push(ft(s,e,i)),a}function ft(e,t,n){let r=[],i=e.length;for(let a=0;a<i;a++){let o=e[a];n.add(o);let s=t[o];r.push({type:`rectangle`,name:`Detected Signal Bar ${a+1}/${i}`,x:s.x,y:s.y,width:Math.max(1,s.width),height:Math.max(1,s.height),fill:`#a8d9a8`,stroke:`#a8d9a8`,strokeWidth:1,source:`analysis`})}return{elements:r}}function pt(e,t,n,r,i,a){let o=i/a;if(o<1.4||o>4.2||i<14||a<6||a>45)return!1;let s=Math.max(2,Math.round(i*.1)),c=n+i-s,l=r+Math.round(a*.25),u=r+Math.round(a*.75),d=0,f=0;for(let o=c;o<n+i;o++){for(let n=r;n<l;n++)e[n*t+o]===0&&d++;for(let n=u;n<r+a;n++)e[n*t+o]===0&&f++}return d>0&&f>0}function mt(e,t,n,r,i,a,o){let s=[],c=Math.max(2,Math.round(i*.1)),l=i-c,u=Math.max(2,Math.round(a*.45)),d=r+Math.round((a-u)/2);s.push({type:`rectangle`,name:`Detected Battery Frame`,x:n,y:r,width:l,height:a,fill:`transparent`,stroke:o,strokeWidth:1,source:`analysis`}),s.push({type:`rectangle`,name:`Detected Battery Terminal`,x:n+l,y:d,width:c,height:u,fill:o,stroke:o,strokeWidth:1,source:`analysis`});let f=n+2,p=n+l-2,m=r+2,h=r+a-2,g=p-f,_=h-m;if(g>=4&&_>=2){let n=0,r=g*_;for(let r=m;r<=h;r++)for(let i=f;i<=p;i++)e[r*t+i]===1&&n++;let i=n/r;if(i>=.12){let e=Math.max(2,Math.round(g*Math.min(1,i*1.15))),t=Math.min(100,Math.round(i*100));s.push({type:`rectangle`,name:`Detected Battery Charge (${t}%)`,x:f,y:m,width:e,height:_,fill:o,stroke:o,strokeWidth:1,source:`analysis`})}}return s}function ht(e,t,n,r,i,a,o){if(i<4||a<4||i>32||a>32||o<.3||o>.85)return null;let s=0,c=0,l=0;for(let o=r;o<r+a;o++)for(let a=n;a<n+i;a++)e[o*t+a]===1&&(s+=a-n,c+=o-r,l++);if(l===0)return null;let u=s/l,d=c/l,f=u/i,p=d/a,m=new Int32Array(i);for(let o=0;o<i;o++)for(let i=0;i<a;i++)e[(r+i)*t+(n+o)]===1&&m[o]++;let h=new Int32Array(a);for(let o=0;o<a;o++)for(let a=0;a<i;a++)e[(r+o)*t+(n+a)]===1&&h[o]++;let g=m[0]+(i>2?m[1]:0),_=m[i-1]+(i>2?m[i-2]:0),v=h[0]+(a>2?h[1]:0),y=h[a-1]+(a>2?h[a-2]:0);return f<.45&&g>_*1.8&&m[i-1]<=3?`right`:f>.55&&_>g*1.8&&m[0]<=3?`left`:p<.45&&v>y*1.8&&h[a-1]<=3?`down`:p>.55&&y>v*1.8&&h[0]<=3?`up`:null}function gt(e,t,n,r,i,a){let o={right:`▶`,left:`◄`,up:`▲`,down:`▼`},s={right:`Detected Arrow (Right)`,left:`Detected Arrow (Left)`,up:`Detected Arrow (Up)`,down:`Detected Arrow (Down)`},c=o[e]||`▶`,l=s[e]||`Detected Arrow`,u=Math.max(8,Math.round(i*1.1));return{type:`text`,name:l,text:c,x:t,y:n,width:Math.max(1,r),height:Math.max(1,i),fontSize:u,fontFamily:`monospace`,fontWeight:400,textAlign:`left`,color:a,source:`analysis`}}function _t(e,t,n,r,i,a){if(i<8||a<10||i>36||a>40)return!1;let o=i/a;if(o<.6||o>1.25)return!1;let s=Math.round(a*.4),c=a-s,l=n+Math.round(i/2),u=0;for(let n=r+2;n<r+s-1;n++)e[n*t+l]===0&&u++;let d=0;for(let o=r+s;o<r+a;o++)for(let r=n;r<n+i;r++)e[o*t+r]===1&&d++;let f=d/(i*c);return u>=2&&f>=.55}function vt(e,t,n,r,i,a){if(i<8||a<8||i>32||a>32)return!1;let o=i/a;if(o<.7||o>1.35)return!1;let s=0;for(let a=n;a<n+i;a++)e[r*t+a]===1&&s++;let c=0,l=r+Math.round(a*.8);for(let r=n;r<n+i;r++)e[l*t+r]===1&&c++;return c>=i*.75&&s<=i*.5}function yt(e,t,n,r,i,a){if(i<6||a<8||i>28||a>36||a<=i*1.1)return!1;let o=0;for(let a=n;a<n+i;a++)e[r*t+a]===1&&o++;let s=r+Math.round(a*.7),c=0;for(let r=n;r<n+i;r++)e[s*t+r]===1&&c++;return o<=3&&c>=i*.7}function bt(e,t,n,r,i,a){if(i<6||a<10||i>24||a>36)return!1;let o=i/a;if(o<.35||o>.75)return!1;let s=n+Math.round(i/2),c=0;for(let n=r;n<r+a;n++)(e[n*t+s]===1||e[n*t+s-1]===1)&&c++;return c>=a*.75}function xt(e,t,n,r,i,a){if(i<8||a<8||i>24||a>24)return null;let o=i/a;if(o<.85||o>1.18)return null;let s=0;for(let o=n;o<n+i;o++)e[r*t+o]===1&&s++,e[(r+a-1)*t+o]===1&&s++;for(let o=r;o<r+a;o++)e[o*t+n]===1&&s++,e[o*t+(n+i-1)]===1&&s++;let c=(i+a)*2-4;if(s<c*.65)return null;let l=n+2,u=n+i-3,d=r+2,f=r+a-3,p=(u-l+1)*(f-d+1);if(p<=0)return null;let m=0;for(let n=d;n<=f;n++)for(let r=l;r<=u;r++)e[n*t+r]===1&&m++;let h=m/p;return m>=3&&h<=.65?`checked`:null}function St(e,t,n,r,i,a,o){let s=Math.max(8,Math.round(a*1.05));return{type:`text`,name:t,text:e,x:n,y:r,width:Math.max(1,i),height:Math.max(1,a),fontSize:s,fontFamily:`monospace`,fontWeight:400,textAlign:`left`,color:o,source:`analysis`}}function Ct(e,t,n,r,i){if(!i||i.length===0)return!1;for(let a of i){let i=(a.x||0)-2,o=i+(a.width||0)+4,s=(a.y||0)-2,c=s+(a.height||0)+4,l=e>=i&&e+n<=o,u=t>=s&&t+r<=c;if(l&&u&&n*r<a.width*a.height*.7)return!0}return!1}function wt(e,t,n,r=[],i={}){if(!e||t<1||n<1)return{lines:[],rectangles:[],circles:[],symbols:[],stats:{lines:0,rectangles:0,circles:0,symbols:0}};let{rectangles:a,remainingHLines:o,remainingVLines:s}=kt(Tt(e,t,n),Dt(e,t,n),t,n),c=Ft([...o,...s],r),l=It(a,r),{solidRectangles:u,circles:d,symbols:f}=jt(e,t,n,r,l,i),p=[...l,...u];return{lines:c,rectangles:p,circles:d,symbols:f,stats:{lines:c.length,rectangles:p.length,hollowFrames:l.length,solidBadges:u.length,circles:d.length,symbols:f.length}}}function Tt(e,t,n){let r=Math.max(8,Math.round(t*.08)),i=[];for(let a=0;a<n;a++){let n=-1;for(let o=0;o<=t;o++){let s=o<t&&e[a*t+o]===1;if(s&&n===-1&&(n=o),!s&&n!==-1){let e=o-n;e>=r&&i.push({x:n,y:a,width:e,height:1,orientation:`horizontal`}),n=-1}}}return Et(i)}function Et(e){if(e.length===0)return[];let t=[...e].sort((e,t)=>e.y===t.y?e.x-t.x:e.y-t.y),n=[];for(let e of t){let t=n[n.length-1];if(!t){n.push({...e});continue}let r=t.y+t.height,i=e.y-r<=1,a=Math.abs(e.x-t.x)<=4,o=Math.abs(e.width-t.width)<=6;if(i&&a&&o){let n=Math.min(t.x,e.x),i=Math.min(t.y,e.y),a=Math.max(t.x+t.width,e.x+e.width),o=Math.max(r,e.y+e.height);t.x=n,t.y=i,t.width=a-n,t.height=o-i}else n.push({...e})}return n.filter(e=>e.height<=8)}function Dt(e,t,n){let r=Math.max(8,Math.round(n*.08)),i=[];for(let a=0;a<t;a++){let o=-1;for(let s=0;s<=n;s++){let c=s<n&&e[s*t+a]===1;if(c&&o===-1&&(o=s),!c&&o!==-1){let e=s-o;e>=r&&i.push({x:a,y:o,width:1,height:e,orientation:`vertical`}),o=-1}}}return Ot(i)}function Ot(e){if(e.length===0)return[];let t=[...e].sort((e,t)=>e.x===t.x?e.y-t.y:e.x-t.x),n=[];for(let e of t){let t=n[n.length-1];if(!t){n.push({...e});continue}let r=t.x+t.width,i=e.x-r<=1,a=Math.abs(e.y-t.y)<=4,o=Math.abs(e.height-t.height)<=6;if(i&&a&&o){let n=Math.min(t.x,e.x),i=Math.min(t.y,e.y),a=Math.max(r,e.x+e.width),o=Math.max(t.y+t.height,e.y+e.height);t.x=n,t.y=i,t.width=a-n,t.height=o-i}else n.push({...e})}return n.filter(e=>e.width<=8)}function kt(e,t,n,r){let i=[],a=new Set,o=new Set;for(let s=0;s<e.length;s++){let c=e[s];if(!a.has(s))for(let l=0;l<e.length;l++){if(s===l||a.has(l))continue;let u=e[l];if(u.y<=c.y+10)continue;let d=Math.abs(c.x-u.x)<=6,f=Math.abs(c.width-u.width)<=6;if(!d||!f)continue;let p=Math.min(c.x,u.x),m=Math.max(c.x+c.width,u.x+u.width),h=c.y,g=u.y+u.height,_=-1,v=-1;for(let e=0;e<t.length;e++){if(o.has(e))continue;let n=t[e],r=Math.abs(n.x-p)<=6,i=Math.abs(n.x+n.width-m)<=6,a=Math.abs(n.y-h)<=6&&Math.abs(n.y+n.height-g)<=6;r&&a&&(_=e),i&&a&&(v=e)}if(_!==-1&&v!==-1){a.add(s),a.add(l),o.add(_),o.add(v);let e=Math.min(p,t[_].x),d=Math.min(h,t[_].y),f=Math.max(m,t[v].x+t[v].width)-e,y=Math.max(g,t[_].y+t[_].height)-d,b=Math.max(1,Math.round((c.height+u.height+t[_].width+t[v].width)/4));i.push({x:Math.max(0,e),y:Math.max(0,d),width:Math.min(n-e,f),height:Math.min(r-d,y),strokeWidth:Math.min(8,b),filled:!1,name:`Detected Frame`});break}}}return{rectangles:i,remainingHLines:e.filter((e,t)=>!a.has(t)),remainingVLines:t.filter((e,t)=>!o.has(t))}}function At(e,t,n){let r=new Uint8Array(t*n),i=[],a=[-1,0,1,-1,1,-1,0,1],o=[-1,-1,-1,0,0,1,1,1],s=new Int32Array(t*n);for(let c=0;c<n;c++)for(let l=0;l<t;l++){let u=c*t+l;if(e[u]!==1||r[u]===1)continue;r[u]=1;let d=0,f=0;s[f++]=u;let p=l,m=l,h=c,g=c,_=0;for(;d<f;){let i=s[d++],c=Math.floor(i/t),l=i%t;_++,l<p&&(p=l),l>m&&(m=l),c<h&&(h=c),c>g&&(g=c);for(let i=0;i<8;i++){let u=l+a[i],d=c+o[i];if(u>=0&&u<t&&d>=0&&d<n){let n=d*t+u;e[n]===1&&r[n]===0&&(r[n]=1,s[f++]=n)}}}let v=m-p+1,y=g-h+1,b=v*y,x=_/b;i.push({x:p,y:h,width:v,height:y,area:_,density:x})}return i}function jt(e,t,n,r,i,a={}){let o=At(e,t,n),s=[],c=[],{symbols:l,consumedIndices:u}=ut(o,e,t,n,r,a.color||`#a8d9a8`);for(let a=0;a<o.length;a++){if(u.has(a))continue;let{x:l,y:d,width:f,height:p,area:m,density:h}=o[a];if(f<4&&p<4||Nt(l,d,f,p,i)||Pt(l,d,f,p,r))continue;let g=f/p;if(g>=.72&&g<=1.38&&f>=4&&p>=4&&f<=Math.min(t,n)*.4&&Mt(e,t,l,d,f,p)>=3){if(h>=.52){c.push({x:l,y:d,width:f,height:p,fill:`solid`,strokeWidth:1,name:`Detected Indicator Dot`});continue}if(h>=.2&&h<.52){c.push({x:l,y:d,width:f,height:p,fill:`transparent`,strokeWidth:1,name:`Detected Ring Gauge`});continue}}if(f>=8&&p>=4&&h>=.78){let e=f/p>=3.2,n=f>=t*.6&&p>=8&&p<=24,r=`Detected Solid Badge`;e&&(r=`Detected Progress Bar`),n&&(r=`Detected Header Bar`),s.push({x:l,y:d,width:f,height:p,filled:!0,strokeWidth:1,name:r})}}return{solidRectangles:s,circles:c,symbols:l}}function Mt(e,t,n,r,i,a){let o=0,s=(n,r)=>n<0||r<0?1:+(e[r*t+n]===0);return o+=s(n,r),o+=s(n+i-1,r),o+=s(n,r+a-1),o+=s(n+i-1,r+a-1),o}function Nt(e,t,n,r,i){for(let a of i)if(Math.abs(a.x-e)<=4&&Math.abs(a.y-t)<=4&&Math.abs(a.width-n)<=6&&Math.abs(a.height-r)<=6)return!0;return!1}function Pt(e,t,n,r,i){if(!i||i.length===0)return!1;for(let a of i){let i=(a.x||0)-3,o=i+(a.width||0)+6,s=(a.y||0)-3,c=s+(a.height||0)+6,l=e>=i&&e+n<=o,u=t>=s&&t+r<=c;if(l&&u&&n*r<a.width*a.height*.75)return!0}return!1}function Ft(e,t){return!t||t.length===0?e:e.filter(e=>{for(let n of t){let t=(n.x||0)-2,r=t+(n.width||0)+4,i=(n.y||0)-2,a=i+(n.height||0)+4,o=e.x+e.width,s=e.y+e.height,c=e.x>=t&&o<=r,l=e.y>=i&&s<=a;if(c&&l&&(e.width<100||e.height<100))return!1}return!0})}function It(e,t){return e.filter(e=>e.width>=14&&e.height>=10)}function Lt(e,t=`#a8d9a8`){let n=e.orientation===`horizontal`||e.width>=e.height,r=Math.max(1,n?e.height:e.width);return{type:`line`,name:e.name||(n?`Detected Horizontal Line`:`Detected Vertical Line`),x:Math.max(0,Math.round(e.x)),y:Math.max(0,Math.round(e.y)),width:Math.max(1,Math.round(e.width)),height:Math.max(n?3:1,Math.round(e.height)),color:t,strokeWidth:r,source:`analysis`}}function Rt(e,t=`#a8d9a8`){let n=!!e.filled;return{type:`rectangle`,name:e.name||(n?`Detected Solid Badge`:`Detected Frame`),x:Math.max(0,Math.round(e.x)),y:Math.max(0,Math.round(e.y)),width:Math.max(1,Math.round(e.width)),height:Math.max(1,Math.round(e.height)),fill:n?t:`transparent`,stroke:t,strokeWidth:Math.max(1,Math.round(e.strokeWidth||1)),source:`analysis`}}function zt(e,t=`#a8d9a8`){let n=e.fill!==`transparent`;return{type:`circle`,name:e.name||(n?`Detected Indicator Dot`:`Detected Ring Gauge`),x:Math.max(0,Math.round(e.x)),y:Math.max(0,Math.round(e.y)),width:Math.max(2,Math.round(e.width)),height:Math.max(2,Math.round(e.height)),fill:n?t:`transparent`,stroke:t,strokeWidth:Math.max(1,Math.round(e.strokeWidth||1)),source:`analysis`}}var Bt=a(((e,t)=>{var n=function(e){var t=Object.prototype,n=t.hasOwnProperty,r=Object.defineProperty||function(e,t,n){e[t]=n.value},i,a=typeof Symbol==`function`?Symbol:{},o=a.iterator||`@@iterator`,s=a.asyncIterator||`@@asyncIterator`,c=a.toStringTag||`@@toStringTag`;function l(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{l({},``)}catch{l=function(e,t,n){return e[t]=n}}function u(e,t,n,i){var a=t&&t.prototype instanceof _?t:_,o=Object.create(a.prototype);return r(o,`_invoke`,{value:ee(e,n,new k(i||[]))}),o}e.wrap=u;function d(e,t,n){try{return{type:`normal`,arg:e.call(t,n)}}catch(e){return{type:`throw`,arg:e}}}var f=`suspendedStart`,p=`suspendedYield`,m=`executing`,h=`completed`,g={};function _(){}function v(){}function y(){}var b={};l(b,o,function(){return this});var x=Object.getPrototypeOf,S=x&&x(x(te([])));S&&S!==t&&n.call(S,o)&&(b=S);var C=y.prototype=_.prototype=Object.create(b);v.prototype=y,r(C,`constructor`,{value:y,configurable:!0}),r(y,`constructor`,{value:v,configurable:!0}),v.displayName=l(y,c,`GeneratorFunction`);function w(e){[`next`,`throw`,`return`].forEach(function(t){l(e,t,function(e){return this._invoke(t,e)})})}e.isGeneratorFunction=function(e){var t=typeof e==`function`&&e.constructor;return t?t===v||(t.displayName||t.name)===`GeneratorFunction`:!1},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,y):(e.__proto__=y,l(e,c,`GeneratorFunction`)),e.prototype=Object.create(C),e},e.awrap=function(e){return{__await:e}};function T(e,t){function i(r,a,o,s){var c=d(e[r],e,a);if(c.type===`throw`)s(c.arg);else{var l=c.arg,u=l.value;return u&&typeof u==`object`&&n.call(u,`__await`)?t.resolve(u.__await).then(function(e){i(`next`,e,o,s)},function(e){i(`throw`,e,o,s)}):t.resolve(u).then(function(e){l.value=e,o(l)},function(e){return i(`throw`,e,o,s)})}}var a;function o(e,n){function r(){return new t(function(t,r){i(e,n,t,r)})}return a=a?a.then(r,r):r()}r(this,`_invoke`,{value:o})}w(T.prototype),l(T.prototype,s,function(){return this}),e.AsyncIterator=T,e.async=function(t,n,r,i,a){a===void 0&&(a=Promise);var o=new T(u(t,n,r,i),a);return e.isGeneratorFunction(n)?o:o.next().then(function(e){return e.done?e.value:o.next()})};function ee(e,t,n){var r=f;return function(i,a){if(r===m)throw Error(`Generator is already running`);if(r===h){if(i===`throw`)throw a;return ne()}for(n.method=i,n.arg=a;;){var o=n.delegate;if(o){var s=E(o,n);if(s){if(s===g)continue;return s}}if(n.method===`next`)n.sent=n._sent=n.arg;else if(n.method===`throw`){if(r===f)throw r=h,n.arg;n.dispatchException(n.arg)}else n.method===`return`&&n.abrupt(`return`,n.arg);r=m;var c=d(e,t,n);if(c.type===`normal`){if(r=n.done?h:p,c.arg===g)continue;return{value:c.arg,done:n.done}}c.type===`throw`&&(r=h,n.method=`throw`,n.arg=c.arg)}}}function E(e,t){var n=t.method,r=e.iterator[n];if(r===i)return t.delegate=null,n===`throw`&&e.iterator.return&&(t.method=`return`,t.arg=i,E(e,t),t.method===`throw`)||n!==`return`&&(t.method=`throw`,t.arg=TypeError(`The iterator does not provide a '`+n+`' method`)),g;var a=d(r,e.iterator,t.arg);if(a.type===`throw`)return t.method=`throw`,t.arg=a.arg,t.delegate=null,g;var o=a.arg;if(!o)return t.method=`throw`,t.arg=TypeError(`iterator result is not an object`),t.delegate=null,g;if(o.done)t[e.resultName]=o.value,t.next=e.nextLoc,t.method!==`return`&&(t.method=`next`,t.arg=i);else return o;return t.delegate=null,g}w(C),l(C,c,`Generator`),l(C,o,function(){return this}),l(C,`toString`,function(){return`[object Generator]`});function D(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function O(e){var t=e.completion||{};t.type=`normal`,delete t.arg,e.completion=t}function k(e){this.tryEntries=[{tryLoc:`root`}],e.forEach(D,this),this.reset(!0)}e.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}};function te(e){if(e){var t=e[o];if(t)return t.call(e);if(typeof e.next==`function`)return e;if(!isNaN(e.length)){var r=-1,a=function t(){for(;++r<e.length;)if(n.call(e,r))return t.value=e[r],t.done=!1,t;return t.value=i,t.done=!0,t};return a.next=a}}return{next:ne}}e.values=te;function ne(){return{value:i,done:!0}}return k.prototype={constructor:k,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=i,this.done=!1,this.delegate=null,this.method=`next`,this.arg=i,this.tryEntries.forEach(O),!e)for(var t in this)t.charAt(0)===`t`&&n.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=i)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if(e.type===`throw`)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function r(n,r){return s.type=`throw`,s.arg=e,t.next=n,r&&(t.method=`next`,t.arg=i),!!r}for(var a=this.tryEntries.length-1;a>=0;--a){var o=this.tryEntries[a],s=o.completion;if(o.tryLoc===`root`)return r(`end`);if(o.tryLoc<=this.prev){var c=n.call(o,`catchLoc`),l=n.call(o,`finallyLoc`);if(c&&l){if(this.prev<o.catchLoc)return r(o.catchLoc,!0);if(this.prev<o.finallyLoc)return r(o.finallyLoc)}else if(c){if(this.prev<o.catchLoc)return r(o.catchLoc,!0)}else if(l){if(this.prev<o.finallyLoc)return r(o.finallyLoc)}else throw Error(`try statement without catch or finally`)}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r];if(i.tryLoc<=this.prev&&n.call(i,`finallyLoc`)&&this.prev<i.finallyLoc){var a=i;break}}a&&(e===`break`||e===`continue`)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var o=a?a.completion:{};return o.type=e,o.arg=t,a?(this.method=`next`,this.next=a.finallyLoc,g):this.complete(o)},complete:function(e,t){if(e.type===`throw`)throw e.arg;return e.type===`break`||e.type===`continue`?this.next=e.arg:e.type===`return`?(this.rval=this.arg=e.arg,this.method=`return`,this.next=`end`):e.type===`normal`&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),O(n),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if(r.type===`throw`){var i=r.arg;O(n)}return i}}throw Error(`illegal catch attempt`)},delegateYield:function(e,t,n){return this.delegate={iterator:te(e),resultName:t,nextLoc:n},this.method===`next`&&(this.arg=i),g}},e}(typeof t==`object`?t.exports:{});try{regeneratorRuntime=n}catch{typeof globalThis==`object`?globalThis.regeneratorRuntime=n:Function(`r`,`regeneratorRuntime = r`)(n)}})),Vt=a(((e,t)=>{t.exports=(e,t)=>`${e}-${t}-${Math.random().toString(16).slice(3,8)}`})),Ht=a(((e,t)=>{var n=Vt(),r=0;t.exports=({id:e,action:t,payload:i={}})=>{let a=e;return a===void 0&&(a=n(`Job`,r),r+=1),{id:a,action:t,payload:i}}})),Ut=a((e=>{var t=!1;e.logging=t,e.setLogging=e=>{t=e},e.log=(...n)=>t?console.log.apply(e,n):null})),Wt=a(((e,t)=>{var n=Ht(),{log:r}=Ut(),i=Vt(),a=0;t.exports=()=>{let t=i(`Scheduler`,a),o={},s={},c=[];a+=1;let l=()=>c.length,u=()=>Object.keys(o).length,d=()=>{if(c.length!==0){let e=Object.keys(o);for(let t=0;t<e.length;t+=1)if(s[e[t]]===void 0){c[0](o[e[t]]);break}}},f=(i,a)=>new Promise((o,l)=>{let u=n({action:i,payload:a});c.push(async t=>{c.shift(),s[t.id]=u;try{o(await t[i].apply(e,[...a,u.id]))}catch(e){l(e)}finally{delete s[t.id],d()}}),r(`[${t}]: Add ${u.id} to JobQueue`),r(`[${t}]: JobQueue length=${c.length}`),d()});return{addWorker:e=>(o[e.id]=e,r(`[${t}]: Add ${e.id}`),r(`[${t}]: Number of workers=${u()}`),d(),e.id),addJob:async(e,...n)=>{if(u()===0)throw Error(`[${t}]: You need to have at least one worker before adding jobs`);return f(e,n)},terminate:async()=>{Object.keys(o).forEach(async e=>{await o[e].terminate()}),c=[]},getQueueLen:l,getNumWorkers:u}}})),Gt=a(((e,t)=>{t.exports=e=>{let t={};return typeof WorkerGlobalScope<`u`?t.type=`webworker`:typeof document==`object`?t.type=`browser`:typeof process==`object`&&typeof l==`function`&&(t.type=`node`),e===void 0?t:t[e]}})),Kt=a(((e,t)=>{var n=Gt()(`type`)===`browser`?e=>new URL(e,window.location.href).href:e=>e;t.exports=e=>{let t={...e};return[`corePath`,`workerPath`,`langPath`].forEach(r=>{e[r]&&(t[r]=n(t[r]))}),t}})),qt=a(((e,t)=>{t.exports={TESSERACT_ONLY:0,LSTM_ONLY:1,TESSERACT_LSTM_COMBINED:2,DEFAULT:3}})),Jt=o({author:()=>``,browser:()=>an,bugs:()=>fn,collective:()=>mn,contributors:()=>on,default:()=>hn,dependencies:()=>ln,description:()=>Zt,devDependencies:()=>cn,homepage:()=>pn,jsdelivr:()=>nn,license:()=>sn,main:()=>Qt,name:()=>Yt,overrides:()=>un,repository:()=>dn,scripts:()=>rn,type:()=>$t,types:()=>en,unpkg:()=>tn,version:()=>Xt}),Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn,hn,gn=i((()=>{Yt=`tesseract.js`,Xt=`7.0.0`,Zt=`Pure Javascript Multilingual OCR`,Qt=`src/index.js`,$t=`commonjs`,en=`src/index.d.ts`,tn=`dist/tesseract.min.js`,nn=`dist/tesseract.min.js`,rn={start:`node scripts/server.js`,build:`rimraf dist && webpack --config scripts/webpack.config.prod.js && rollup -c scripts/rollup.esm.mjs`,"profile:tesseract":`webpack-bundle-analyzer dist/tesseract-stats.json`,"profile:worker":`webpack-bundle-analyzer dist/worker-stats.json`,prepublishOnly:`npm run build`,wait:`rimraf dist && wait-on http://localhost:3000/dist/tesseract.min.js`,test:`npm-run-all -p -r start test:all`,"test:all":`npm-run-all wait test:browser test:node:all`,"test:browser":`karma start karma.conf.js`,"test:node":`nyc mocha --exit --bail --require ./scripts/test-helper.mjs`,"test:node:all":`npm run test:node -- ./tests/*.test.mjs`,lint:`eslint src`,"lint:fix":`eslint --fix src`,postinstall:`opencollective-postinstall || true`},an={"./src/worker/node/index.js":`./src/worker/browser/index.js`},on=[`jeromewu`],sn=`Apache-2.0`,cn={"@babel/core":`^7.21.4`,"@babel/eslint-parser":`^7.21.3`,"@babel/preset-env":`^7.21.4`,"@rollup/plugin-commonjs":`^24.1.0`,acorn:`^8.8.2`,"babel-loader":`^9.1.2`,buffer:`^6.0.3`,cors:`^2.8.5`,eslint:`^7.32.0`,"eslint-config-airbnb-base":`^14.2.1`,"eslint-plugin-import":`^2.27.5`,"expect.js":`^0.3.1`,express:`^4.18.2`,mocha:`^10.2.0`,"npm-run-all":`^4.1.5`,karma:`^6.4.2`,"karma-chrome-launcher":`^3.2.0`,"karma-firefox-launcher":`^2.1.2`,"karma-mocha":`^2.0.1`,"karma-webpack":`^5.0.0`,nyc:`^15.1.0`,rimraf:`^5.0.0`,rollup:`^3.20.7`,"wait-on":`^7.0.1`,webpack:`^5.79.0`,"webpack-bundle-analyzer":`^4.8.0`,"webpack-cli":`^5.0.1`,"webpack-dev-middleware":`^6.0.2`,"rollup-plugin-sourcemaps":`^0.6.3`},ln={"bmp-js":`^0.1.0`,"idb-keyval":`^6.2.0`,"is-url":`^1.2.4`,"node-fetch":`^2.6.9`,"opencollective-postinstall":`^2.0.3`,"regenerator-runtime":`^0.13.3`,"tesseract.js-core":`^7.0.0`,"wasm-feature-detect":`^1.8.0`,zlibjs:`^0.3.1`},un={"@rollup/pluginutils":`^5.0.2`},dn={type:`git`,url:`https://github.com/naptha/tesseract.js.git`},fn={url:`https://github.com/naptha/tesseract.js/issues`},pn=`https://github.com/naptha/tesseract.js`,mn={type:`opencollective`,url:`https://opencollective.com/tesseractjs`},hn={name:Yt,version:Xt,description:Zt,main:Qt,type:$t,types:en,unpkg:tn,jsdelivr:nn,scripts:rn,browser:an,author:``,contributors:on,license:sn,devDependencies:cn,dependencies:ln,overrides:un,repository:dn,bugs:fn,homepage:pn,collective:mn}})),_n=a(((e,t)=>{t.exports={workerBlobURL:!0,logger:()=>{}}})),vn=a(((e,t)=>{var n=(gn(),c(Jt).default).version;t.exports={..._n(),workerPath:`https://cdn.jsdelivr.net/npm/tesseract.js@v${n}/dist/worker.min.js`}})),yn=a(((e,t)=>{t.exports=({workerPath:e,workerBlobURL:t})=>{let n;if(Blob&&URL&&t){let t=new Blob([`importScripts("${e}");`],{type:`application/javascript`});n=new Worker(URL.createObjectURL(t))}else n=new Worker(e);return n}})),bn=a(((e,t)=>{t.exports=e=>{e.terminate()}})),xn=a(((e,t)=>{t.exports=(e,t)=>{e.onmessage=({data:e})=>{t(e)}}})),Sn=a(((e,t)=>{t.exports=async(e,t)=>{e.postMessage(t)}})),Cn=a(((e,t)=>{var n=e=>new Promise((t,n)=>{let r=new FileReader;r.onload=()=>{t(r.result)},r.onerror=({target:{error:{code:e}}})=>{n(Error(`File could not be read! Code=${e}`))},r.readAsArrayBuffer(e)}),r=async e=>{let t=e;return e===void 0?`undefined`:(typeof e==`string`?t=/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(e)?atob(e.split(`,`)[1]).split(``).map(e=>e.charCodeAt(0)):await(await fetch(e)).arrayBuffer():typeof HTMLElement<`u`&&e instanceof HTMLElement?(e.tagName===`IMG`&&(t=await r(e.src)),e.tagName===`VIDEO`&&(t=await r(e.poster)),e.tagName===`CANVAS`&&await new Promise(r=>{e.toBlob(async e=>{t=await n(e),r()})})):typeof OffscreenCanvas<`u`&&e instanceof OffscreenCanvas?t=await n(await e.convertToBlob()):(e instanceof File||e instanceof Blob)&&(t=await n(e)),new Uint8Array(t))};t.exports=r})),wn=a(((e,t)=>{t.exports={defaultOptions:vn(),spawnWorker:yn(),terminateWorker:bn(),onMessage:xn(),send:Sn(),loadImage:Cn()}})),Tn=a(((e,t)=>{var n=Kt(),r=Ht(),{log:i}=Ut(),a=Vt(),o=qt(),{defaultOptions:s,spawnWorker:c,terminateWorker:l,onMessage:u,loadImage:d,send:f}=wn(),p=0;t.exports=async(e=`eng`,t=o.LSTM_ONLY,m={},h={})=>{let g=a(`Worker`,p),{logger:_,errorHandler:v,...y}=n({...s,...m}),b={},x=typeof e==`string`?e.split(`+`):e,S=t,C=h,w=[o.DEFAULT,o.LSTM_ONLY].includes(t)&&!y.legacyCore,T,ee,E=new Promise((e,t)=>{ee=e,T=t}),D=e=>{T(e.message)},O=c(y);O.onerror=D,p+=1;let k=({id:e,action:t,payload:n})=>new Promise((r,a)=>{i(`[${g}]: Start ${e}, action=${t}`);let o=`${t}-${e}`;b[o]={resolve:r,reject:a},f(O,{workerId:g,jobId:e,action:t,payload:n})}),te=()=>console.warn("`load` is depreciated and should be removed from code (workers now come pre-loaded)"),ne=e=>k(r({id:e,action:`load`,payload:{options:{lstmOnly:w,corePath:y.corePath,logging:y.logging}}})),re=(e,t,n)=>k(r({id:n,action:`FS`,payload:{method:`writeFile`,args:[e,t]}})),ie=(e,t)=>k(r({id:t,action:`FS`,payload:{method:`readFile`,args:[e,{encoding:`utf8`}]}})),ae=(e,t)=>k(r({id:t,action:`FS`,payload:{method:`unlink`,args:[e]}})),oe=(e,t,n)=>k(r({id:n,action:`FS`,payload:{method:e,args:t}})),se=(e,t)=>k(r({id:t,action:`loadLanguage`,payload:{langs:e,options:{langPath:y.langPath,dataPath:y.dataPath,cachePath:y.cachePath,cacheMethod:y.cacheMethod,gzip:y.gzip,lstmOnly:[o.DEFAULT,o.LSTM_ONLY].includes(S)&&!y.legacyLang}}})),A=(e,t,n,i)=>k(r({id:i,action:`initialize`,payload:{langs:e,oem:t,config:n}})),ce=(e=`eng`,t,n,r)=>{if(w&&[o.TESSERACT_ONLY,o.TESSERACT_LSTM_COMBINED].includes(t))throw Error(`Legacy model requested but code missing.`);let i=t||S;S=i;let a=n||C;C=a;let s=(typeof e==`string`?e.split(`+`):e).filter(e=>!x.includes(e));return x.push(...s),s.length>0?se(s,r).then(()=>A(e,i,a,r)):A(e,i,a,r)},le=(e={},t)=>k(r({id:t,action:`setParameters`,payload:{params:e}})),j=async(e,t={},n={text:!0},i)=>k(r({id:i,action:`recognize`,payload:{image:await d(e),options:t,output:n}})),M=async(e,t)=>{if(w)throw Error("`worker.detect` requires Legacy model, which was not loaded.");return k(r({id:t,action:`detect`,payload:{image:await d(e)}}))},ue=async()=>(O!==null&&(l(O),O=null),Promise.resolve());u(O,({workerId:e,jobId:t,status:n,action:r,data:a})=>{let o=`${r}-${t}`;if(n===`resolve`)i(`[${e}]: Complete ${t}`),b[o].resolve({jobId:t,data:a}),delete b[o];else if(n===`reject`){if(b[o].reject(a),delete b[o],r===`load`&&T(a),v)v(a);else throw Error(a)}else n===`progress`&&_({...a,userJobId:t})});let de={id:g,worker:O,load:te,writeText:re,readText:ie,removeFile:ae,FS:oe,reinitialize:ce,setParameters:le,recognize:j,detect:M,terminate:ue};return ne().then(()=>se(e)).then(()=>A(e,t,h)).then(()=>ee(de)).catch(()=>{}),E}})),En=a(((e,t)=>{var n=Tn();t.exports={recognize:async(e,t,r)=>{let i=await n(t,1,r);return i.recognize(e).finally(async()=>{await i.terminate()})},detect:async(e,t)=>{let r=await n(`osd`,0,t);return r.detect(e).finally(async()=>{await r.terminate()})}}})),Dn=a(((e,t)=>{t.exports={AFR:`afr`,AMH:`amh`,ARA:`ara`,ASM:`asm`,AZE:`aze`,AZE_CYRL:`aze_cyrl`,BEL:`bel`,BEN:`ben`,BOD:`bod`,BOS:`bos`,BUL:`bul`,CAT:`cat`,CEB:`ceb`,CES:`ces`,CHI_SIM:`chi_sim`,CHI_TRA:`chi_tra`,CHR:`chr`,CYM:`cym`,DAN:`dan`,DEU:`deu`,DZO:`dzo`,ELL:`ell`,ENG:`eng`,ENM:`enm`,EPO:`epo`,EST:`est`,EUS:`eus`,FAS:`fas`,FIN:`fin`,FRA:`fra`,FRK:`frk`,FRM:`frm`,GLE:`gle`,GLG:`glg`,GRC:`grc`,GUJ:`guj`,HAT:`hat`,HEB:`heb`,HIN:`hin`,HRV:`hrv`,HUN:`hun`,IKU:`iku`,IND:`ind`,ISL:`isl`,ITA:`ita`,ITA_OLD:`ita_old`,JAV:`jav`,JPN:`jpn`,KAN:`kan`,KAT:`kat`,KAT_OLD:`kat_old`,KAZ:`kaz`,KHM:`khm`,KIR:`kir`,KOR:`kor`,KUR:`kur`,LAO:`lao`,LAT:`lat`,LAV:`lav`,LIT:`lit`,MAL:`mal`,MAR:`mar`,MKD:`mkd`,MLT:`mlt`,MSA:`msa`,MYA:`mya`,NEP:`nep`,NLD:`nld`,NOR:`nor`,ORI:`ori`,PAN:`pan`,POL:`pol`,POR:`por`,PUS:`pus`,RON:`ron`,RUS:`rus`,SAN:`san`,SIN:`sin`,SLK:`slk`,SLV:`slv`,SPA:`spa`,SPA_OLD:`spa_old`,SQI:`sqi`,SRP:`srp`,SRP_LATN:`srp_latn`,SWA:`swa`,SWE:`swe`,SYR:`syr`,TAM:`tam`,TEL:`tel`,TGK:`tgk`,TGL:`tgl`,THA:`tha`,TIR:`tir`,TUR:`tur`,UIG:`uig`,UKR:`ukr`,URD:`urd`,UZB:`uzb`,UZB_CYRL:`uzb_cyrl`,VIE:`vie`,YID:`yid`}})),On=a(((e,t)=>{t.exports={OSD_ONLY:`0`,AUTO_OSD:`1`,AUTO_ONLY:`2`,AUTO:`3`,SINGLE_COLUMN:`4`,SINGLE_BLOCK_VERT_TEXT:`5`,SINGLE_BLOCK:`6`,SINGLE_LINE:`7`,SINGLE_WORD:`8`,CIRCLE_WORD:`9`,SINGLE_CHAR:`10`,SPARSE_TEXT:`11`,SPARSE_TEXT_OSD:`12`,RAW_LINE:`13`}})),kn=a(((e,t)=>{Bt();var n=Wt(),r=Tn(),i=En(),a=Dn(),o=qt(),s=On(),{setLogging:c}=Ut();t.exports={languages:a,OEM:o,PSM:s,createScheduler:n,createWorker:r,setLogging:c,...i}}))();function An(e,t){let n=Math.max(e,t);return n<=320?6:n<=640?4:n<=1200?2:1}function jn(e,t){return Math.max(8,Math.min(24,Math.round(Math.min(e,t)*.12)))}function Mn({image:e,width:t,height:n,scale:r,padding:i,threshold:a,polarity:o}){let s=Nn(a),c=Pn({threshold:a,polarity:o,amount:s,mode:`thin`}),l=Pn({threshold:a,polarity:o,amount:s,mode:`thick`});return[{name:`normal`,canvas:Fn({image:e,width:t,height:n,scale:r,padding:i,threshold:a,polarity:o,morphology:`none`})},{name:`thin`,canvas:Fn({image:e,width:t,height:n,scale:r,padding:i,threshold:c,polarity:o,morphology:`none`})},{name:`thick`,canvas:Fn({image:e,width:t,height:n,scale:r,padding:i,threshold:l,polarity:o,morphology:`none`})},{name:`recovery`,canvas:Fn({image:e,width:t,height:n,scale:r,padding:i,threshold:a,polarity:o,morphology:`dilate`})}]}function Nn(e){let t=Math.min(e,255-e);return Math.max(8,Math.min(18,Math.round(t*.14)))}function Pn({threshold:e,polarity:t,amount:n,mode:r}){let i=t===`dark-on-light`,a=0;return r===`thin`&&(a=i?-n:n),r===`thick`&&(a=i?n:-n),Ln(e+a,1,254)}function Fn({image:e,width:t,height:n,scale:r,padding:i,threshold:a,polarity:o,morphology:s=`none`}){let c=i*r,l=t*r,u=n*r,d=nt(l+c*2,u+c*2),f=d.getContext(`2d`,{willReadFrequently:!0});if(!f)throw Error(`OCR preprocessing canvas is not available.`);f.fillStyle=`#ffffff`,f.fillRect(0,0,d.width,d.height),f.imageSmoothingEnabled=!1,f.drawImage(e,c,c,l,u);let p=f.getImageData(c,c,l,u),m=p.data,h=o===`dark-on-light`,g=new Uint8Array(l*u);for(let e=0;e<g.length;e+=1){let t=e*4,n=Math.round(m[t]*.299+m[t+1]*.587+m[t+2]*.114);g[e]=+(h?n<=a:n>a)}let _=s===`dilate`?In(g,l,u):g;for(let e=0;e<_.length;e+=1){let t=e*4,n=_[e]===1?0:255;m[t]=n,m[t+1]=n,m[t+2]=n,m[t+3]=255}return f.putImageData(p,c,c),d}function In(e,t,n){let r=e.slice();for(let i=1;i<n-1;i+=1)for(let n=1;n<t-1;n+=1){let a=i*t+n;if(e[a]===1)continue;let o=e[a-1],s=e[a+1],c=e[a-t],l=e[a+t];(o===1||s===1||c===1||l===1)&&(r[a]=1)}return r}function Ln(e,t,n){return Math.min(n,Math.max(t,e))}var Rn=15;function zn(e,{scale:t,padding:n,originalWidth:r,originalHeight:i,variant:a,pass:o}){if(!Array.isArray(e)||e.length===0)return[];if(!Number.isFinite(t)||t<=0)throw Error(`OCR extraction requires a valid scale.`);if(!Number.isFinite(r)||!Number.isFinite(i)||r<1||i<1)throw Error(`OCR extraction requires valid original image dimensions.`);let s=(Number.isFinite(n)?Math.max(0,n):0)*t,c=[];for(let n of e){let e=n?.paragraphs??[];for(let n of e){let e=n?.lines??[];for(let n of e){let e=n?.words??[];for(let n of e){let e=Bn({word:n,scale:t,scaledPadding:s,originalWidth:r,originalHeight:i,variant:a,pass:o});e&&c.push(e)}}}}return c}function Bn({word:e,scale:t,scaledPadding:n,originalWidth:r,originalHeight:i,variant:a,pass:o}){let s=Wn(e?.text??``);if(!s)return null;let c=Number(e?.confidence??0);if(!Number.isFinite(c)||c<Rn)return null;let l=e?.bbox;if(!Vn(l))return null;let u=Hn({bbox:l,scale:t,scaledPadding:n,originalWidth:r,originalHeight:i});return!u||Un(u,r,i)?null:{text:s,confidence:c,x:u.x,y:u.y,width:u.width,height:u.height,variant:String(a??`unknown`),pass:String(o??`unknown`)}}function Vn(e){if(!e)return!1;let t=[Number(e.x0),Number(e.y0),Number(e.x1),Number(e.y1)];if(!t.every(Number.isFinite))return!1;let[n,r,i,a]=t;return i>n&&a>r}function Hn({bbox:e,scale:t,scaledPadding:n,originalWidth:r,originalHeight:i}){let a=Number(e.x0),o=Number(e.y0),s=Number(e.x1),c=Number(e.y1),l=(a-n)/t,u=(o-n)/t,d=(s-n)/t,f=(c-n)/t;if(d<=0||f<=0||l>=r||u>=i)return null;let p=qn(l,0,r),m=qn(u,0,i),h=qn(d,0,r),g=qn(f,0,i),_=qn(Math.floor(p),0,r-1),v=qn(Math.floor(m),0,i-1),y=qn(Math.ceil(h),_+1,r),b=qn(Math.ceil(g),v+1,i);return{x:_,y:v,width:Math.max(1,y-_),height:Math.max(1,b-v)}}function Un(e,t,n){let r=e.width/t,i=e.height/n;return r>.98&&i>.5}function Wn(e){let t=String(e??``).normalize(`NFKC`).replace(/\s+/g,` `).trim();return t=t.replace(/(\d{1,2})\s*:\s*(\d{2})/g,`$1:$2`),t=t.replace(/(\d{1,2}:\d{2})\s*:\s*(\d{2})/g,`$1:$2`),t=t.replace(/(\d+)\s*\.\s*(\d+)/g,`$1.$2`),t=t.replace(/(\d)\.([Oo])\b/g,`$1.0`),t=t.replace(/\b([Oo])\.(\d)/g,`0.$2`),t=t.replace(/\b(\d+)[Oo]+(\d*)\b/g,(e,t,n)=>t+`0`.repeat(e.length-t.length-n.length)+n),t=t.replace(/(\d+)[Ss]\.(\d+)/g,`$15.$2`),t=t.replace(/(\d+)\.([Ss])(\d*)/g,`$1.5$3`),t=t.replace(/\b([Ss])\.(\d+)/g,`5.$2`),t=t.replace(/\b(\d+)[Ss]\b/g,`$15`),t=t.replace(/\b[lI|](\d{2,})\b/g,`1$1`),t=t.replace(/(\d+)\s*%/g,`$1%`),t=t.replace(/(\d+)\s*[*o°]\s*([CFcf])\b/g,`$1 °$2`),t=t.replace(/(\d+(?:\.\d+)?)\s*(V|mV|mA|uA|A|W|kW|Hz|kHz|MHz|RPM|rpm|PSI|psi|bar|BAR|km\/h|mph|ms|us|dB)\b/g,`$1 $2`),t=t.replace(/^>+$|^->+$|^>>+$|^»+$|^I>+$/g,`▶`),t=t.replace(/^<+$|^<-+$|^<<+$|^«+$|^<I+$/g,`◄`),t=t.replace(/^\^+$|^\/\^\\+$/g,`▲`),t=t.replace(/^\[=\]$|^\[--\]$|^\[III\]$|^CIIID$/g,`🔋`),t=t.replace(/^\|{3,5}$|^[ıI]{3,5}$/g,`📶`),t=t.replace(/^\[[xX]\]$/g,`☑`),t=t.replace(/^\[\s*\]$/g,`☐`),t=t.replace(/^\([oO*]\)$/g,`🔘`),t=t.replace(/^\(\s*\)$/g,`⚪`),t=t.replace(/^[~^`'",._-]+|[~^`'",._-]+$/g,``).trim(),t}function Gn(e){return String(e??``).replace(/\r/g,``).replace(/[ \t]+\n/g,`
`).replace(/\n{3,}/g,`

`).trim()}function Kn(e,t){let n=e.y+e.height/2,r=t.y+t.height/2;return Math.abs(n-r)>3?n-r:e.x-t.x}function qn(e,t,n){return Math.min(n,Math.max(t,e))}var Jn=.76,Yn=.88;function Xn(e){if(!Array.isArray(e)||e.length===0)return{clusters:[],words:[]};let t=Qn(e.filter(Zn)),n=dr(t.map(rr).filter(Boolean));return n.sort(Kn),{clusters:t,words:n}}function Zn(e){return!(!e||!pr(e.text)||!Number.isFinite(e.x)||!Number.isFinite(e.y)||!Number.isFinite(e.width)||!Number.isFinite(e.height)||e.width<=0||e.height<=0)}function Qn(e){let t=[...e].sort((e,t)=>{let n=lr(t)-lr(e);return Math.abs(n)>.001?n:Kn(e,t)}),n=[];for(let e of t){let t=null,r=-1/0;for(let i of n){let n=tr(e,i);n.matches&&n.score>r&&(r=n.score,t=i)}if(!t){n.push($n(e));continue}er(t,e)}return n.sort((e,t)=>Kn(e,t))}function $n(e){return{x:e.x,y:e.y,width:e.width,height:e.height,candidates:[e]}}function er(e,t){e.candidates.push(t);let n=e.candidates;e.x=xr(n.map(e=>e.x)),e.y=xr(n.map(e=>e.y)),e.width=xr(n.map(e=>e.width)),e.height=xr(n.map(e=>e.height))}function tr(e,t){let n=-1/0,r=[{x:t.x,y:t.y,width:t.width,height:t.height},...t.candidates];for(let t of r){let r=nr(e,t);r.sameToken&&(n=Math.max(n,r.score))}return{matches:Number.isFinite(n),score:n}}function nr(e,t){let n=vr(e,t);if(n<=0)return{sameToken:!1,score:0};let r=e.width*e.height,i=t.width*t.height,a=Math.max(1,Math.min(r,i)),o=Math.max(1,r+i-n),s=n/a,c=n/o,l=yr(e),u=br(e),d=yr(t),f=br(t),p=Math.abs(l-d),m=Math.abs(u-f),h=Math.max(1,Math.min(e.width,t.width)),g=Math.max(e.width,t.width),_=Math.max(1,Math.min(e.height,t.height)),v=Math.max(e.height,t.height),y=h/Math.max(1,g),b=_/Math.max(1,v),x=m<=Math.max(2,v*.38),S=p<=Math.max(3,h*.45);return{sameToken:x&&b>=.55&&(c>=.5||s>=.84&&S&&y>=.34),score:c*6+s*3+b+y*.5-m/Math.max(1,v),iou:c,coverage:s}}function rr(e){if(!e||e.candidates.length===0)return null;let t=ir(e.candidates);if(t.length===0)return null;let n=null,r=-1/0;for(let e of t){let t=ar(e);t>r&&(r=t,n=e)}if(!n)return null;let i=sr(n);return i?{...i,support:n.candidates.length,sourceSupport:fr(n.candidates),fusionScore:Sr(r)}:null}function ir(e){let t=[...e].sort((e,t)=>lr(t)-lr(e)),n=[];for(let e of t){let t=mr(e.text);if(!t)continue;let r=null,i=0;for(let e of n){let n=gr(t,e.normalized);n>=Jn&&n>i&&(r=e,i=n)}if(!r){n.push({normalized:t,candidates:[e]});continue}r.candidates.push(e);let a=cr(r.candidates);r.normalized=mr(a.text)}return n}function ar(e){let t=e.candidates;if(t.length===0)return-1/0;let n=cr(t),r=lr(n),i=fr(t),a=new Set(t.map(e=>e.variant)),o=new Set(t.map(e=>e.pass));return r+=Math.min(24,i*5),r+=Math.min(12,a.size*3),r+=Math.min(4,o.size*2),r+=or(t),hr(n.text)&&(r+=4),ur(n)&&(i<=1?r-=24:i===2&&(r-=10)),r}function or(e){let t=new Map;for(let n of e){let e=mr(n.text);t.set(e,(t.get(e)??0)+1)}let n=0;for(let e of t.values())n=Math.max(n,e);return Math.min(12,Math.max(0,n-1)*3)}function sr(e){let t=null,n=-1/0;for(let r of e.candidates){let i=lr(r);for(let t of e.candidates)t!==r&&gr(mr(r.text),mr(t.text))>=Yn&&(i+=2);i>n&&(n=i,t=r)}return t}function cr(e){let t=e[0],n=lr(t);for(let r=1;r<e.length;r+=1){let i=e[r],a=lr(i);a>n&&(t=i,n=a)}return t}function lr(e){let t=pr(e.text);if(!t)return-1/0;let n=Number(e.confidence)||0,r=(t.match(/[\p{L}\p{N}]/gu)??[]).length,i=(t.match(/[.:,;%°/+\-]/gu)??[]).length,a=(t.match(/[^\p{L}\p{N}\s.,:;%°/+\-()[\]]/gu)??[]).length;return n+=Math.min(8,r*.8),n+=Math.min(8,i*2),n-=a*5,t.length===1&&r===1&&(n-=8),r===0&&i===0&&(n-=16),e.variant===`normal`&&(n+=3),e.variant===`thin`&&(n+=1),e.variant===`recovery`&&(n-=2),e.pass===`sparse`&&(n+=2),n}function ur(e){let t=pr(e.text);if(!t)return!0;let n=(t.match(/[\p{L}\p{N}]/gu)??[]).length,r=(t.match(/[.:,;%°/+\-]/gu)??[]).length;return t.length===1&&n===1&&r===0||t.length<=2&&n===0}function dr(e){let t=[...e].sort((e,t)=>(t.fusionScore??0)-(e.fusionScore??0)),n=[];for(let e of t){let t=!1;for(let r of n){let n=nr(e,r);if(n.sameToken){if(gr(mr(e.text),mr(r.text))>=.7){t=!0;break}if(n.iou>=.68||n.coverage>=.92){t=!0;break}}}t||n.push(e)}return n}function fr(e){let t=new Set;for(let n of e)t.add(`${n.variant}:${n.pass}`);return t.size}function pr(e){return String(e??``).normalize(`NFKC`).replace(/\s+/g,` `).trim()}function mr(e){return pr(e).replace(/\s+/g,``).toLocaleLowerCase()}function hr(e){return/[.:,;%°/+\-]/u.test(String(e??``))}function gr(e,t){if(e===t)return 1;if(!e||!t)return 0;let n=_r(e,t),r=Math.max(e.length,t.length);return r===0?1:Math.max(0,1-n/r)}function _r(e,t){let n=t.length+1,r=Array(n),i=Array(n);for(let e=0;e<n;e+=1)r[e]=e;for(let n=1;n<=e.length;n+=1){i[0]=n;for(let a=1;a<=t.length;a+=1){let o=e[n-1]===t[a-1]?0:1;i[a]=Math.min(i[a-1]+1,r[a]+1,r[a-1]+o)}let a=r;r=i,i=a}return r[t.length]}function vr(e,t){let n=Math.max(e.x,t.x),r=Math.max(e.y,t.y),i=Math.min(e.x+e.width,t.x+t.width),a=Math.min(e.y+e.height,t.y+t.height);return Math.max(0,i-n)*Math.max(0,a-r)}function yr(e){return e.x+e.width/2}function br(e){return e.y+e.height/2}function xr(e){if(!Array.isArray(e)||e.length===0)return 0;let t=[...e].sort((e,t)=>e-t),n=Math.floor(t.length/2);return t.length%2==1?t[n]:(t[n-1]+t[n])/2}function Sr(e){return Math.round(e*10)/10}function Cr(e){if(!Array.isArray(e)||e.length===0)return[];let t=e.filter(wr).sort(Kn);if(t.length===0)return[];let n=Tr(t),r=[];for(let e of n){let t=Dr(e.words);if(t.length===0)continue;t.sort((e,t)=>e.x-t.x);let n=null;for(let e of t){if(!n){n=kr(e);continue}let t=Mr(n,e),i=n.x+n.width,a=e.x-i;if(Nr(n,e)&&a<=t){Ar(n,e);continue}r.push(Pr(n)),n=kr(e)}n&&r.push(Pr(n))}return r.filter(Fr).sort(Kr)}function wr(e){if(!e||!Ur(e.text))return!1;let t=Number(e.x),n=Number(e.y),r=Number(e.width),i=Number(e.height);return!(!Number.isFinite(t)||!Number.isFinite(n)||!Number.isFinite(r)||!Number.isFinite(i)||r<=0||i<=0)}function Tr(e){let t=[];for(let n of e){let e=Hr(n),r=null,i=1/0;for(let a of t){let t=Math.abs(e-a.centerY);t<=Math.max(2,Math.min(n.height,a.averageHeight)*.65)&&t<i&&(i=t,r=a)}if(!r){t.push({centerY:e,averageHeight:n.height,words:[n]});continue}r.words.push(n),Er(r)}return t.sort((e,t)=>e.centerY-t.centerY),t}function Er(e){if(!e||e.words.length===0)return;let t=0,n=0;for(let r of e.words)t+=Hr(r),n+=r.height;e.centerY=t/e.words.length,e.averageHeight=n/e.words.length}function Dr(e){if(e.length<=1)return[...e];let t=[...e].sort((e,t)=>{let n=Rr(t)-Rr(e);return Math.abs(n)>.001?n:t.width-e.width}),n=[];for(let e of t){let t=!1;for(let r of n)if(Or(e,r)){t=!0;break}t||n.push(e)}return n.sort((e,t)=>e.x-t.x)}function Or(e,t){let n=Vr(e,t);if(n.area<=0)return!1;let r=Math.max(1,e.width*e.height),i=Math.max(1,t.width*t.height),a=Math.min(r,i),o=n.area/a,s=r+i-n.area,c=n.area/Math.max(1,s),l=Math.min(e.height,t.height)/Math.max(1,Math.max(e.height,t.height));if(!(Math.abs(Hr(e)-Hr(t))<=Math.max(2,Math.max(e.height,t.height)*.35))||l<.55)return!1;if(zr(Wr(e.text),Wr(t.text))>=.72&&(c>=.42||o>=.78))return!0;let u=Lr(e),d=Lr(t);return!!(o>=.88&&(u&&Rr(e)<Rr(t)||d&&Rr(t)<Rr(e)))}function kr(e){return{text:Ur(e.text),x:e.x,y:e.y,width:e.width,height:e.height,confidence:Number(e.confidence)||0,fusionScore:Number(e.fusionScore)||0,support:Number(e.support)||1,sourceSupport:Number(e.sourceSupport)||1,wordCount:1,words:[e]}}function Ar(e,t){let n=e.x+e.width,r=e.y+e.height,i=t.x+t.width,a=t.y+t.height,o=jr(e,t,t.x-n);e.text=`${e.text}${o}${Ur(t.text)}`;let s=Math.min(e.x,t.x),c=Math.min(e.y,t.y),l=Math.max(n,i),u=Math.max(r,a);e.x=s,e.y=c,e.width=l-s,e.height=u-c;let d=e.wordCount;e.wordCount+=1,e.confidence=(e.confidence*d+(Number(t.confidence)||0))/e.wordCount,e.fusionScore=Math.max(e.fusionScore,Number(t.fusionScore)||0),e.support=Math.max(e.support,Number(t.support)||1),e.sourceSupport=Math.max(e.sourceSupport,Number(t.sourceSupport)||1),e.words.push(t)}function jr(e,t,n){let r=e.text,i=Ur(t.text);return!r||!i||n<=0||/^[.,:;%°)\]]/u.test(i)||/[(\[]$/u.test(r)?``:` `}function Mr(e,t){let n=Math.max(1,Math.min(e.height,t.height));return Math.max(2,Math.min(10,n*.9))}function Nr(e,t){let n=Math.abs(Hr(e)-Hr(t)),r=Math.max(1,Math.min(e.height,t.height)),i=Math.max(e.height,t.height);return r/Math.max(1,i)>=.5&&n<=Math.max(2,i*.5)}function Pr(e){return{text:Gr(e.text),x:qr(e.x),y:qr(e.y),width:Math.max(1,qr(e.width)),height:Math.max(1,qr(e.height)),confidence:Jr(e.confidence),fusionScore:Jr(e.fusionScore),support:e.support,sourceSupport:e.sourceSupport,wordCount:e.wordCount}}function Fr(e){return!e||!e.text||e.width<=0||e.height<=0?!1:/[\p{L}\p{N}.:,;%°/+\-]/u.test(e.text)}function Ir(e){if(!Array.isArray(e)||e.length===0)return``;let t=[...e].filter(Fr).sort(Kr);if(t.length===0)return``;let n=[];for(let e of t){let t=Hr(e),r=null,i=1/0;for(let a of n){let n=Math.abs(t-a.centerY);n<=Math.max(2,Math.min(e.height,a.averageHeight)*.65)&&n<i&&(r=a,i=n)}if(!r){n.push({centerY:t,averageHeight:e.height,regions:[e]});continue}r.regions.push(e);let a=0,o=0;for(let e of r.regions)a+=Hr(e),o+=e.height;r.centerY=a/r.regions.length,r.averageHeight=o/r.regions.length}return n.sort((e,t)=>e.centerY-t.centerY),n.map(e=>(e.regions.sort((e,t)=>e.x-t.x),e.regions.map(e=>e.text).join(` `).trim())).filter(Boolean).join(`
`)}function Lr(e){let t=Ur(e.text);if(!t)return!0;let n=(t.match(/[\p{L}\p{N}]/gu)??[]).length,r=(t.match(/[.:,;%°/+\-]/gu)??[]).length;return t.length===1&&n===1&&r===0||t.length<=2&&n===0}function Rr(e){return Number.isFinite(e.fusionScore)?e.fusionScore:Number.isFinite(e.confidence)?e.confidence:0}function zr(e,t){if(e===t)return 1;if(!e||!t)return 0;let n=Br(e,t),r=Math.max(e.length,t.length);return r===0?1:Math.max(0,1-n/r)}function Br(e,t){let n=t.length+1,r=Array(n),i=Array(n);for(let e=0;e<n;e+=1)r[e]=e;for(let n=1;n<=e.length;n+=1){i[0]=n;for(let a=1;a<=t.length;a+=1){let o=e[n-1]===t[a-1]?0:1;i[a]=Math.min(i[a-1]+1,r[a]+1,r[a-1]+o)}let a=r;r=i,i=a}return r[t.length]}function Vr(e,t){let n=Math.max(e.x,t.x),r=Math.max(e.y,t.y),i=Math.min(e.x+e.width,t.x+t.width),a=Math.min(e.y+e.height,t.y+t.height),o=Math.max(0,i-n),s=Math.max(0,a-r);return{width:o,height:s,area:o*s}}function Hr(e){return e.y+e.height/2}function Ur(e){return String(e??``).normalize(`NFKC`).replace(/\s+/g,` `).trim()}function Wr(e){return Ur(e).replace(/\s+/g,``).toLocaleLowerCase()}function Gr(e){return Ur(e).replace(/\s+([.,:;%°)\]])/gu,`$1`).replace(/([(\[])\s+/gu,`$1`)}function Kr(e,t){let n=Hr(e),r=Hr(t),i=Math.max(2,Math.min(e.height,t.height)*.5);return Math.abs(n-r)>i?n-r:e.x-t.x}function qr(e){return Math.round(Number(e)||0)}function Jr(e){return Math.round((Number(e)||0)*10)/10}var Yr=`eng`;async function Xr({image:e,width:t,height:n,threshold:r,polarity:i}){$r({image:e,width:t,height:n,threshold:r,polarity:i});let a=An(t,n),o=jn(t,n),s=Mn({image:e,width:t,height:n,scale:a,padding:o,threshold:r,polarity:i}),c=await(0,kn.createWorker)(Yr),l=[],u=[];try{for(let e of s){let r=await Zr({worker:c,canvas:e.canvas,pageSegmentationMode:kn.PSM.SPARSE_TEXT}),i=Gn(r?.data?.text??``),s=zn(r?.data?.blocks??[],{scale:a,padding:o,originalWidth:t,originalHeight:n,variant:e.name,pass:`sparse`});l.push(...s),u.push({variant:e.name,pass:`sparse`,text:i,candidateCount:s.length}),console.log(`[LCD OCR ${e.name.toUpperCase()} SPARSE TEXT]`,i);let d=await Zr({worker:c,canvas:e.canvas,pageSegmentationMode:kn.PSM.SINGLE_BLOCK}),f=Gn(d?.data?.text??``),p=zn(d?.data?.blocks??[],{scale:a,padding:o,originalWidth:t,originalHeight:n,variant:e.name,pass:`block`});l.push(...p),u.push({variant:e.name,pass:`block`,text:f,candidateCount:p.length}),console.log(`[LCD OCR ${e.name.toUpperCase()} BLOCK TEXT]`,f)}}finally{await Qr(c)}console.log(`[LCD OCR ALL CANDIDATES]`,l);let{clusters:d,words:f}=Xn(l);console.log(`[LCD OCR CLUSTERS]`,d),console.log(`[LCD OCR WINNERS]`,f);let p=Cr(f),m=Ir(p);return console.log(`[LCD OCR TEXT]`,m),{text:m,regions:p,words:f,clusters:d,candidates:l,passes:u,scale:a,padding:o}}async function Zr({worker:e,canvas:t,pageSegmentationMode:n}){return await e.setParameters({tessedit_pageseg_mode:n,preserve_interword_spaces:`1`,user_defined_dpi:`300`}),e.recognize(t,{},{text:!0,blocks:!0})}async function Qr(e){if(e&&typeof e.terminate==`function`)try{await e.terminate()}catch(e){console.warn(`[LCD OCR WORKER TERMINATION]`,e)}}function $r({image:e,width:t,height:n,threshold:r,polarity:i}){if(!e)throw Error(`OCR requires a reference image.`);if(!Number.isFinite(t)||!Number.isFinite(n)||t<1||n<1)throw Error(`OCR requires valid image dimensions.`);if(!Number.isFinite(r))throw Error(`OCR requires a valid image threshold.`);if(i!==`dark-on-light`&&i!==`light-on-dark`)throw Error(`OCR requires a valid image polarity.`)}var ei=[{width:128,height:64,name:`128 × 64 (OLED / Graphic LCD)`},{width:128,height:32,name:`128 × 32 (Narrow OLED)`},{width:84,height:48,name:`84 × 48 (Nokia 5110)`},{width:160,height:128,name:`160 × 128 (ST7735 Color TFT)`},{width:240,height:128,name:`240 × 128 (Graphic LCD)`},{width:240,height:64,name:`240 × 64 (Wide LCD)`},{width:256,height:64,name:`256 × 64 (SSD1322 OLED)`},{width:320,height:240,name:`320 × 240 (QVGA TFT)`},{width:160,height:80,name:`160 × 80 (Mini TFT)`}];async function ti(e={},t=null){let n=t||u.reference?.src;if(!n)throw Error(`Upload a reference image before analyzing.`);let r=await tt(n),{width:i,height:a,threshold:o,polarity:s,binaryMask:c,imageData:l}=ct(r),d=lt(l,c),f=await Xr({image:r,width:i,height:a,threshold:o,polarity:s}),p=wt(c,i,a,f.regions,e),m=e.detectText===!1?[]:f.regions.map(e=>ni(e,d.foreground)),h=e.detectFrames===!1?[]:p.lines.map(e=>Lt(e,d.foreground)),g=p.rectangles.filter(t=>!(t.filled&&e.detectBadges===!1||!t.filled&&e.detectFrames===!1)).map(e=>Rt(e,d.foreground)),_=e.detectCircles===!1?[]:(p.circles||[]).map(e=>zt(e,d.foreground)),v=e.detectSymbols===!1?[]:(p.symbols||[]).map(e=>e.type===`text`||e.type===`line`?{...e,color:e.color||d.foreground}:{...e,stroke:e.stroke||d.foreground,fill:e.fill===`transparent`?`transparent`:e.fill||d.foreground});for(let e of m)for(let t of g)if(t.fill!==`transparent`){let n=e.x>=t.x-2&&e.x+e.width<=t.x+t.width+2,r=e.y>=t.y-2&&e.y+e.height<=t.y+t.height+2;n&&r&&(e.color=d.background||`#1d2720`,e.inverted=!0,t.name=`Detected Inverted Badge`)}let y=[...g,..._,...v,...h,...m];return y.sort(ai),{width:i,height:a,threshold:o,polarity:s,palette:d,suggestedResolution:ri(i,a),elements:y,text:f.text,stats:{textRegions:m.length,lines:h.length,rectangles:g.length,hollowFrames:p.stats?.hollowFrames??0,solidBadges:p.stats?.solidBadges??0,circles:_.length,symbols:v.length,totalElements:y.length,ocrCandidates:f.candidates.length,ocrClusters:f.clusters.length,ocrWords:f.words.length,ocrScale:f.scale,ocrPadding:f.padding}}}function ni(e,t=`#a8d9a8`){let n=String(e?.text??``).trim(),r=Math.max(0,Math.round(Number(e?.x)||0)),i=Math.max(0,Math.round(Number(e?.y)||0)),a=Math.max(1,Math.round(Number(e?.width)||1)),o=Math.max(1,Math.round(Number(e?.height)||1)),s=si(Math.round(o*1.05),6,96),c=/^[0-9.:\-\s%+°CFAVWmkuhzRPMpsiBAR/]+$/i.test(n),l=/^\d{1,2}:\d{2}(?::\d{2})?$/.test(n),u=/^[A-Z0-9_\-\s]{2,16}$/.test(n),d=`monospace`,f=400;return l||c||u?(d=`Share Tech Mono`,f=700):o>=16&&(f=700),{type:`text`,name:ii(n),text:n,x:r,y:i,width:a,height:o,fontSize:s,fontFamily:d,fontWeight:f,textAlign:`left`,color:t,opacity:1,rotation:0,source:`analysis`,confidence:Number(e?.confidence)||0,fusionScore:Number(e?.fusionScore)||0,support:Number(e?.support)||1,sourceSupport:Number(e?.sourceSupport)||1}}function ri(e,t){let n=e/t,r=null,i=1/0;for(let a of ei){for(let n of[1,2,3,4,.5]){let o=a.width*n,s=a.height*n,c=Math.abs(e-o)/o+Math.abs(t-s)/s;c<.15&&c<i&&(i=c,r=a)}let o=a.width/a.height;Math.abs(n-o)/o<.05&&.25<i&&(i=.25,r=a)}return r}function ii(e){let t=String(e??``).replace(/\s+/g,` `).trim();return t?t.length<=28?t:`${t.slice(0,27)}…`:`Detected Text`}function ai(e,t){if(oi(e,t))return-1;if(oi(t,e))return 1;let n=Number(e?.y)||0,r=Number(t?.y)||0,i=Number(e?.height)||0,a=Number(t?.height)||0,o=n+i/2,s=r+a/2,c=Math.max(2,Math.min(Math.max(1,i),Math.max(1,a))*.5);return Math.abs(o-s)>c?o-s:(Number(e?.x)||0)-(Number(t?.x)||0)}function oi(e,t){if(e?.type===`text`)return!1;let n=Number(e?.x)||0,r=Number(e?.y)||0,i=Number(e?.width)||0,a=Number(e?.height)||0,o=Number(t?.x)||0,s=Number(t?.y)||0,c=Number(t?.width)||0,l=Number(t?.height)||0;return o>=n-2&&o+c<=n+i+2&&s>=r-2&&s+l<=r+a+2}function si(e,t,n){return Math.min(n,Math.max(t,e))}function ci(e,t){let n=Math.min(e,Math.max(20,u.display.width*.5)),r=Math.min(t,Math.max(10,u.display.height*.25));return{width:Math.round(n),height:Math.round(r)}}function li(e,t){return{x:Math.max(0,Math.round((u.display.width-e)/2)),y:Math.max(0,Math.round((u.display.height-t)/2))}}function ui(e){let t=null;if(e===`text`){let e=ci(220,50),n=li(e.width,e.height),r=Math.max(8,Math.min(28,Math.round(u.display.height*.08)));t={id:j(),type:`text`,name:`Text`,x:n.x,y:n.y,width:e.width,height:e.height,text:`NEW TEXT`,fontSize:r,fontFamily:`Courier New`,fontWeight:700,color:`#a8d9a8`}}else if(e===`rectangle`){let e=ci(180,100),n=li(e.width,e.height);t={id:j(),type:`rectangle`,name:`Rectangle`,x:n.x,y:n.y,width:e.width,height:e.height,fill:`#324638`,stroke:`#a8d9a8`,strokeWidth:2}}else if(e===`circle`){let e=Math.min(100,u.display.width*.25,u.display.height*.4),n=Math.max(20,Math.round(e)),r=li(n,n);t={id:j(),type:`circle`,name:`Circle`,x:r.x,y:r.y,width:n,height:n,fill:`transparent`,stroke:`#a8d9a8`,strokeWidth:2}}else if(e===`line`){let e=ci(180,12),n=li(e.width,e.height);t={id:j(),type:`line`,name:`Line`,x:n.x,y:n.y,width:e.width,height:e.height,color:`#a8d9a8`,strokeWidth:2}}else if(e===`icon`){let e=Math.max(16,Math.min(32,Math.round(u.display.height*.2))),n=li(e,e);t={id:j(),type:`text`,name:`Symbol Icon`,x:n.x,y:n.y,width:e,height:e,text:`⚡`,fontSize:Math.max(12,Math.round(e*.75)),fontFamily:`Courier New`,fontWeight:700,color:`#a8d9a8`}}t&&te(t)}function di(e={}){let{dataUrl:t,name:n=`Logo`,naturalWidth:r=64,naturalHeight:i=64,x:a,y:o}=e,s=u.display.width||128,c=u.display.height||64,l=r,d=i,f=Math.max(16,Math.round(s*.5)),p=Math.max(16,Math.round(c*.5));if(l>f||d>p){let e=Math.min(f/l,p/d);l=Math.max(8,Math.round(l*e)),d=Math.max(8,Math.round(d*e))}let m=a===void 0?Math.max(0,Math.round((s-l)/2)):a,h=o===void 0?Math.max(0,Math.round((c-d)/2)):o,g={id:j(),type:`bitmap`,name:n||`Logo`,x:m,y:h,width:l,height:d,dataUrl:t,opacity:1};return te(g),g}function fi(e,t=!0){let n={...e,id:j(),type:e.type,name:e.name||e.type||`Element`,x:Math.round(e.x||0),y:Math.round(e.y||0),width:Math.max(1,Math.round(e.width||20)),height:Math.max(1,Math.round(e.height||10))};return te(n,t),n}function pi(e){if(!e||typeof e!=`string`)return{bytes:new Uint8Array,totalBytes:0,totalBits:0,detectedWidth:null,detectedHeight:null,variableName:null,formatSuggestion:`adafruit`};let t=e,n=null,r=null,i=`adafruit`,a=t.match(/#define\s+(?:[a-zA-Z0-9_]+_)?width\s+(\d+)/i);a&&(n=parseInt(a[1],10));let o=t.match(/#define\s+(?:[a-zA-Z0-9_]+_)?height\s+(\d+)/i);o&&(r=parseInt(o[1],10));let s=null,c=t.match(/(?:unsigned\s+char|uint8_t|char|const\s+char|byte)\s+(?:PROGMEM\s+)?([a-zA-Z0-9_]+)\s*\[/i);c&&(s=c[1]),a&&o&&(t.includes(`_bits`)||t.includes(`xbm`))?i=`xbm`:t.toLowerCase().includes(`u8g2`)||t.toLowerCase().includes(`page`)?i=`u8g2`:(t.toLowerCase().includes(`rgb565`)||t.toLowerCase().includes(`uint16_t`))&&(i=`rgb565_be`),t=t.replace(/\/\*[\s\S]*?\*\//g,` `),t=t.replace(/\/\/[^\n\r]*/g,` `),t=t.replace(/#[^\n\r]*/g,` `),t=t.replace(/^[0-9a-fA-F]{4,8}:\s*/gm,` `),t=t.replace(/[a-zA-Z0-9_]+\s*\[\s*\d+\s*\]/g,` `);let l=[],u=t.match(/0x[0-9a-fA-F]{1,2}|\\x[0-9a-fA-F]{1,2}/gi);if(u&&u.length>0)for(let e=0;e<u.length;e++){let t=u[e].replace(/^[0x\\]+/i,``);l.push(parseInt(t,16)&255)}else{let e=t.match(/\b[0-9a-fA-F]{2}\b/g);if(e&&e.length>=2)for(let t=0;t<e.length;t++)l.push(parseInt(e[t],16)&255);else{let e=t.replace(/[^0-9a-fA-F]/g,``);if(e.length>=2)for(let t=0;t<e.length-1;t+=2)l.push(parseInt(e.slice(t,t+2),16)&255)}}let d=new Uint8Array(l);return{bytes:d,totalBytes:d.length,totalBits:d.length*8,detectedWidth:n,detectedHeight:r,variableName:s,formatSuggestion:i}}function mi(e,t,n=`adafruit`){if(!t||t<=0||!e||e<=0)return 64;if(n.startsWith(`rgb565`))return Math.max(1,Math.floor(e/(t*2)));if(n===`gray8`)return Math.max(1,Math.floor(e/t));if(n===`u8g2`||n===`vertical_msb`){let n=Math.ceil(e/t);return Math.max(8,n*8)}let r=Math.ceil(t/8);return Math.max(1,Math.ceil(e/r))}function hi(e,t,n,r=`adafruit`){let i=Math.max(1,Math.round(t||128)),a=Math.max(1,Math.round(n||64)),o=new Uint8Array(i*a);if(!e||e.length===0)return o;if(r===`u8g2`||r===`c_vertical`||r===`vertical_lsb`){let t=Math.ceil(a/8);for(let n=0;n<t;n++)for(let t=0;t<i;t++){let r=n*i+t;if(r>=e.length)continue;let s=e[r];for(let e=0;e<8;e++){let r=n*8+e;r<a&&(o[r*i+t]=s>>e&1)}}}else if(r===`vertical_msb`||r===`c_vertical_msb`){let t=Math.ceil(a/8);for(let n=0;n<t;n++)for(let t=0;t<i;t++){let r=n*i+t;if(r>=e.length)continue;let s=e[r];for(let e=0;e<8;e++){let r=n*8+e;r<a&&(o[r*i+t]=s>>7-e&1)}}}else if(r===`xbm`||r===`horizontal_lsb`||r===`c_horizontal_lsb`){let t=Math.ceil(i/8);for(let n=0;n<a;n++)for(let r=0;r<t;r++){let a=n*t+r;if(a>=e.length)break;let s=e[a];for(let e=0;e<8;e++){let t=r*8+e;t<i&&(o[n*i+t]=s>>e&1)}}}else if(r===`rgb565_be`||r===`rgb565_le`){let t=r===`rgb565_le`;for(let n=0;n<a;n++)for(let r=0;r<i;r++){let a=(n*i+r)*2;if(a+1<e.length){let s=e[a],c=e[a+1],l=t?c<<8|s:s<<8|c;o[n*i+r]=l===0?0:1}}}else if(r===`gray8`)for(let t=0;t<a;t++)for(let n=0;n<i;n++){let r=t*i+n;r<e.length&&(o[t*i+n]=+(e[r]>127))}else{let t=Math.ceil(i/8);for(let n=0;n<a;n++)for(let r=0;r<t;r++){let a=n*t+r;if(a>=e.length)break;let s=e[a];for(let e=0;e<8;e++){let t=r*8+e;t<i&&(o[n*i+t]=s>>7-e&1)}}}return o}function gi(e,t,n,r=`adafruit`){let i=Math.max(1,Math.round(t||128)),a=Math.max(1,Math.round(n||64));if(r===`u8g2`||r===`c_vertical`||r===`vertical_lsb`){let t=Math.ceil(a/8),n=new Uint8Array(t*i);for(let r=0;r<t;r++)for(let t=0;t<i;t++){let o=0;for(let n=0;n<8;n++){let s=r*8+n;s<a&&e[s*i+t]&&(o|=1<<n)}n[r*i+t]=o}return n}if(r===`vertical_msb`||r===`c_vertical_msb`){let t=Math.ceil(a/8),n=new Uint8Array(t*i);for(let r=0;r<t;r++)for(let t=0;t<i;t++){let o=0;for(let n=0;n<8;n++){let s=r*8+n;s<a&&e[s*i+t]&&(o|=1<<7-n)}n[r*i+t]=o}return n}if(r===`xbm`||r===`horizontal_lsb`||r===`c_horizontal_lsb`){let t=Math.ceil(i/8),n=new Uint8Array(t*a);for(let r=0;r<a;r++)for(let a=0;a<t;a++){let o=0;for(let t=0;t<8;t++){let n=a*8+t;n<i&&e[r*i+n]&&(o|=1<<t)}n[r*t+a]=o}return n}if(r===`rgb565_be`||r===`rgb565_le`){let t=r===`rgb565_le`,n=new Uint8Array(i*a*2);for(let r=0;r<a;r++)for(let a=0;a<i;a++){let o=(r*i+a)*2,s=e[r*i+a]===1?65535:0,c=s>>8&255,l=s&255;n[o]=t?l:c,n[o+1]=t?c:l}return n}if(r===`gray8`){let t=new Uint8Array(i*a);for(let n=0;n<e.length;n++)t[n]=e[n]?255:0;return t}let o=Math.ceil(i/8),s=new Uint8Array(o*a);for(let t=0;t<a;t++)for(let n=0;n<o;n++){let r=0;for(let a=0;a<8;a++){let o=n*8+a;o<i&&e[t*i+o]&&(r|=1<<7-a)}s[t*o+n]=r}return s}function _i(e,t,n){let r=n,i=t,a=new Uint8Array(r*i);for(let i=0;i<n;i++)for(let o=0;o<t;o++)a[o*r+(n-1-i)]=e[i*t+o];return{pixels:a,width:r,height:i}}function vi(e,t,n){let r=new Uint8Array(t*n);for(let i=0;i<n;i++)for(let n=0;n<t;n++)r[i*t+(t-1-n)]=e[i*t+n];return r}function yi(e,t,n){let r=new Uint8Array(t*n);for(let i=0;i<n;i++)for(let a=0;a<t;a++)r[(n-1-i)*t+a]=e[i*t+a];return r}function bi(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=+!e[n];return t}function xi(e){let t=new Uint8Array(e.length);return t.fill(0),t}function Si(e,t,n,r,i,a=1){if(r<0||r>=t||i<0||i>=n)return;let o=e[i*t+r];if(o===a)return;let s=[r,i];for(;s.length>0;){let r=s.pop(),i=s.pop();if(i<0||i>=t||r<0||r>=n)continue;let c=r*t+i;e[c]===o&&(e[c]=a,s.push(i+1,r,i-1,r,i,r+1,i,r-1))}}function Ci(e,t,n,r,i,a,o,s=1){let c=Math.abs(a-r),l=Math.abs(o-i),u=r<a?1:-1,d=i<o?1:-1,f=c-l;for(;r>=0&&r<t&&i>=0&&i<n&&(e[i*t+r]=s),r!==a||i!==o;){let e=2*f;e>-l&&(f-=l,r+=u),e<c&&(f+=c,i+=d)}}function wi(e,t,n,r,i,a,o,s=1){let c=Math.min(r,a),l=Math.max(r,a),u=Math.min(i,o),d=Math.max(i,o);for(let r=c;r<=l;r++)r>=0&&r<t&&(u>=0&&u<n&&(e[u*t+r]=s),d>=0&&d<n&&(e[d*t+r]=s));for(let r=u;r<=d;r++)r>=0&&r<n&&(c>=0&&c<t&&(e[r*t+c]=s),l>=0&&l<t&&(e[r*t+l]=s))}function Ti(e,t,n,r,i=`adafruit`,a=`bitmap`){let o=i===`adafruit`||i===`xbm`?Math.max(1,Math.min(16,Math.ceil(n/8))):i===`u8g2`||i===`vertical_msb`?Math.max(1,Math.min(16,n)):16,s=[];for(let e=0;e<t.length;e+=o){let n=Array.from(t.slice(e,e+o)).map(e=>`0x`+e.toString(16).padStart(2,`0`).toUpperCase()),r=e+o>=t.length;s.push(`  `+n.join(`, `)+(r?``:`,`))}let c=s.join(`
`),l=(e||``).trim(),u=l.indexOf(`{`),d=l.lastIndexOf(`}`);if(u!==-1&&d>u){let e=l.slice(0,u+1),i=l.slice(d);return e=e.replace(/(#define\s+[a-zA-Z0-9_]*width\s+)\d+/gi,`$1${n}`),e=e.replace(/(#define\s+[a-zA-Z0-9_]*height\s+)\d+/gi,`$1${r}`),e=e.replace(/(\[[a-zA-Z0-9_]*)\d+(\]\s*(?:PROGMEM\s*)?=\s*\{)/gi,`$1${t.length}$2`),`${e}\n${c}\n${i}`}let f=l.indexOf(`[`),p=l.lastIndexOf(`]`);if(l.includes(`bytearray(`)&&f!==-1&&p>f){let e=l.slice(0,f+1),t=l.slice(p);return e=e.replace(/(WIDTH\s*=\s*)\d+/i,`$1${n}`),e=e.replace(/(HEIGHT\s*=\s*)\d+/i,`$1${r}`),`${e}\n${c}\n${t}`}if(l.length>0&&!l.includes(`;`)&&!l.includes(`char`)&&!l.includes(`#`))return l.includes(`,`)?Array.from(t).map(e=>`0x`+e.toString(16).padStart(2,`0`).toUpperCase()).join(`, `):Array.from(t).map(e=>e.toString(16).padStart(2,`0`).toUpperCase()).join(` `);let m=(a||`bitmap`).replace(/[^a-zA-Z0-9_]/g,`_`);return i===`xbm`?`#define ${m}_width ${n}\n#define ${m}_height ${r}\nstatic unsigned char ${m}_bits[] = {\n${c}\n};\n`:i===`u8g2`?`// U8g2 / SSD1306 Page-Mode Display Buffer: ${n}x${r} px\n// Pages: ${Math.ceil(r/8)}, Total Bytes: ${t.length}\nconst uint8_t ${m}[${t.length}] PROGMEM = {\n${c}\n};\n`:`#define ${m.toUpperCase()}_WIDTH  ${n}\n#define ${m.toUpperCase()}_HEIGHT ${r}\n\nstatic const unsigned char PROGMEM ${m}_bmp[] = {\n${c}\n};\n`}function Ei(e){let t=new DataView(e);if(t.getUint16(0,!1)!==16973)throw Error(`Not a valid BMP file`);let n=t.getInt32(18,!0),r=t.getInt32(22,!0),i=t.getUint16(28,!0),a=t.getUint32(10,!0),o=Math.abs(r),s=r<0,c=n,l=o,u=new Uint8Array(c*l),d=Math.ceil(c*i/8),f=Math.ceil(d/4)*4;for(let e=0;e<o;e++){let n=s?e:o-1-e;for(let r=0;r<c;r++){let o=0;if(i===1)o=t.getUint8(a+e*f+Math.floor(r/8))>>7-r%8&1;else if(i===8)o=+(t.getUint8(a+e*f+r)>127);else if(i===24){let n=a+e*f+r*3,i=t.getUint8(n),s=t.getUint8(n+1),c=t.getUint8(n+2);o=+(i+s+c>382)}else if(i===32){let n=a+e*f+r*4,i=t.getUint8(n),s=t.getUint8(n+1),c=t.getUint8(n+2);o=+(i+s+c>382)}u[n*c+r]=o}}return{width:c,height:l,pixels:u}}function Di(e,t,n,r,i={}){if(!e)return;let a=n,o=r,s=i.zoom||1,c=!!i.showGrid&&s>=4,l=i.hoverX??null,u=i.hoverY??null,d=!!i.invert,f=i.fgColor||`#a8d9a8`,p=i.bgColor||`#18211b`;e.width=a*s,e.height=o*s;let m=e.getContext(`2d`);if(m){m.fillStyle=p,m.fillRect(0,0,e.width,e.height),m.fillStyle=d?p:f;for(let e=0;e<o;e++)for(let n=0;n<a;n++){let r=t[e*a+n]===1;(d?!r:r)&&(s===1?m.fillRect(n,e,1,1):c?m.fillRect(n*s+1,e*s+1,Math.max(1,s-1),Math.max(1,s-1)):m.fillRect(n*s,e*s,s,s))}if(c){m.save(),m.translate(.5,.5),m.strokeStyle=`rgba(255, 255, 255, 0.08)`,m.lineWidth=.5;for(let e=0;e<=a;e++)m.beginPath(),m.moveTo(e*s,0),m.lineTo(e*s,o*s),m.stroke();for(let e=0;e<=o;e++)m.beginPath(),m.moveTo(0,e*s),m.lineTo(a*s,e*s),m.stroke();m.restore()}l!==null&&u!==null&&l>=0&&l<a&&u>=0&&u<o&&(m.save(),m.translate(.5,.5),m.strokeStyle=`#00f0ff`,m.lineWidth=Math.max(1,s>6?2:1.5),m.strokeRect(l*s,u*s,s,s),m.restore())}}function Oi(e,t,n,r,i,a={}){if(r<0||r>=t||i<0||i>=n||!e||e.length===0)return null;let o=a.format||`adafruit`,s=0,c=0,l=!1,u=0;if(o===`u8g2`||o===`c_vertical`||o===`vertical_lsb`){let n=Math.floor(i/8);c=i%8,s=n*t+r,u=e[s]||0,l=!!(u&1<<c)}else if(o===`vertical_msb`||o===`c_vertical_msb`){let n=Math.floor(i/8);c=7-i%8,s=n*t+r,u=e[s]||0,l=!!(u&1<<7-i%8)}else if(o===`xbm`||o===`horizontal_lsb`||o===`c_horizontal_lsb`){let n=Math.ceil(t/8),a=Math.floor(r/8);c=r%8,s=i*n+a,u=e[s]||0,l=!!(u&1<<c)}else if(o===`rgb565_be`||o===`rgb565_le`)return s=(i*t+r)*2,u=e[s]||0,{x:r,y:i,byteIndex:s,bitIndex:0,hexByte:`0x${(e[s]||0).toString(16).padStart(2,`0`)}, 0x${(e[s+1]||0).toString(16).padStart(2,`0`)}`,isOn:!0,format:o};else{let n=Math.ceil(t/8),a=Math.floor(r/8);c=7-r%8,s=i*n+a,u=e[s]||0,l=!!(u&1<<7-r%8)}return a.invert&&(l=!l),{x:r,y:i,byteIndex:s,bitIndex:c,hexByte:`0x${u.toString(16).padStart(2,`0`).toUpperCase()}`,isOn:l,format:o}}var ki=[{id:`sample_ssd1306_adafruit`,name:`SSD1306 128×64 (Adafruit GFX C Header)`,format:`adafruit`,width:128,height:64,getCode(){let e=1024,t=new Uint8Array(e);for(let e=0;e<16;e++)t[0+e]=255,t[16+e]=129,t[992+e]=129,t[1008+e]=255;for(let e=0;e<64;e++)t[e*16+0]|=128,t[e*16+15]|=1;for(let e=14;e<=50;e++)t[e*16+3]|=15,t[e*16+12]|=240;for(let e=4;e<=11;e++)t[384+e]=255,t[640+e]=255;for(let e=26;e<39;e++)for(let n=4;n<=11;n++)t[e*16+n]=e%2==0?170:85;let n=[];for(let r=0;r<e;r+=12){let i=Array.from(t.slice(r,r+12)).map(e=>`0x`+e.toString(16).padStart(2,`0`).toUpperCase());n.push(`  `+i.join(`, `)+(r+12<e?`,`:``))}return`// =============================================================================
// SSD1306 OLED (128x64) Adafruit_GFX Bitmap Header
// Format: Horizontal MSB-first | Size: 128x64 px (1024 bytes)
// =============================================================================

#define SSD1306_LOGO_WIDTH  128
#define SSD1306_LOGO_HEIGHT 64

static const unsigned char PROGMEM ssd1306_logo_bmp[] = {
`+n.join(`
`)+`
};
`}},{id:`sample_xbm_icon`,name:`XBM 64×64 Icon (Standard X BitMap LSB)`,format:`xbm`,width:64,height:64,getCode(){let e=new Uint8Array(512);for(let t=0;t<64;t++){let n=32-Math.abs(t-32);for(let r=32-n;r<=32+n;r++){let n=Math.floor(r/8),i=r%8;n>=0&&n<8&&(e[t*8+n]|=1<<i)}}let t=[];for(let n=0;n<512;n+=12){let r=Array.from(e.slice(n,n+12)).map(e=>`0x`+e.toString(16).padStart(2,`0`).toUpperCase());t.push(`  `+r.join(`, `)+(n+12<512?`,`:``))}return`#define icon_diamond_width 64
#define icon_diamond_height 64
static unsigned char icon_diamond_bits[] = {
`+t.join(`
`)+`
};
`}},{id:`sample_nokia5110`,name:`Nokia 5110 PCD8544 84×48 (Vertical Pages)`,format:`u8g2`,width:84,height:48,getCode(){let e=new Uint8Array(504);for(let t=0;t<6;t++)for(let n=0;n<84;n++){let r=t*84+n;t===0&&(e[r]=1),t===5&&(e[r]=128),(n===0||n===83)&&(e[r]=255),n>20&&n<64&&(t===2||t===3)&&(e[r]=n%3==0?170:85)}let t=[];for(let n=0;n<504;n+=12){let r=Array.from(e.slice(n,n+12)).map(e=>`0x`+e.toString(16).padStart(2,`0`).toUpperCase());t.push(`  `+r.join(`, `)+(n+12<504?`,`:``))}return`// Nokia 5110 (PCD8544) 84x48 Display Buffer
// Vertical 8-px Pages (6 pages x 84 columns = 504 bytes)
const uint8_t nokia_phone_bmp[504] = {
`+t.join(`
`)+`
};
`}},{id:`sample_micropython`,name:`MicroPython framebuf 128×32 bytearray`,format:`adafruit`,width:128,height:32,getCode(){let e=new Uint8Array(512);for(let t=0;t<32;t++)for(let n=0;n<16;n++)t===0||t===31||n===0||n===15?e[t*16+n]=255:(t+n)%4==0&&(e[t*16+n]=51);let t=[];for(let n=0;n<512;n+=12){let r=Array.from(e.slice(n,n+12)).map(e=>`0x`+e.toString(16).padStart(2,`0`).toUpperCase());t.push(`  `+r.join(`, `)+(n+12<512?`,`:``))}return`# MicroPython SSD1306 (128x32) Mono framebuf
import framebuf

WIDTH = 128
HEIGHT = 32

bmp_buffer = bytearray([
`+t.join(`
`)+`
])
`}},{id:`sample_raw_hex`,name:`Raw Hex Byte Stream (00 FF 12 ...)`,format:`adafruit`,width:32,height:32,getCode(){let e=[];for(let t=0;t<32;t++)for(let n=0;n<4;n++){let r=t<4||t>27||n===0||n===3?255:t*7+n*13&255;e.push(r.toString(16).padStart(2,`0`).toUpperCase())}return e.join(` `)}}];function Ai(e,t={}){let n=t.showToast||(()=>{}),r=document.querySelector(`#open-hex-decoder`),i=document.querySelector(`#reference-from-hex-btn`),a=document.querySelector(`#hex-decoder-modal`);if(!a)return;let o=a.querySelector(`#hex-decoder-close`),s=a.querySelector(`#hex-decoder-input`),c=a.querySelector(`#hex-decoder-format`),l=a.querySelector(`#hex-decoder-width`),u=a.querySelector(`#hex-decoder-height`),d=a.querySelector(`#hex-decoder-presets`),f=a.querySelector(`#hex-decoder-auto-height`),p=a.querySelector(`#hex-decoder-swap-dim`),m=a.querySelector(`#hex-decoder-samples`),h=a.querySelector(`#hex-decoder-clear`),g=a.querySelector(`#hex-preview-wrap`)||a.querySelector(`.hex-preview-container`),_=a.querySelector(`#hex-decoder-preview`),v=a.querySelector(`#hex-decoder-invert`),y=a.querySelector(`#hex-decoder-grid`),b=a.querySelector(`#hex-decoder-theme`),x=a.querySelector(`#hex-decoder-fg-color`),S=a.querySelector(`#hex-decoder-bg-color`),C=a.querySelectorAll(`.hex-zoom-btn`),w=a.querySelectorAll(`.hex-tool-btn[data-tool]`),T=a.querySelector(`#hex-tool-undo`),ee=a.querySelector(`#hex-tool-redo`),E=a.querySelector(`#hex-tool-rot90`),O=a.querySelector(`#hex-tool-flipx`),k=a.querySelector(`#hex-tool-flipy`),ne=a.querySelector(`#hex-tool-invert-bits`),re=a.querySelector(`#hex-tool-clear-canvas`),ie=a.querySelector(`#hex-decoder-byte-count`),ae=a.querySelector(`#hex-decoder-resolution-badge`),A=a.querySelector(`#hex-decoder-status-badge`),ce=a.querySelector(`#hex-decoder-hint`),le=a.querySelector(`#hex-info-size`),M=a.querySelector(`#hex-info-xy`),ue=a.querySelector(`#hex-info-byte`),de=a.querySelector(`#hex-info-bit`),fe=a.querySelector(`#hex-info-idx`),pe=a.querySelector(`#hex-info-count`),N=a.querySelector(`#hex-decoder-copy-img`),me=a.querySelector(`#hex-decoder-download-png`),he=a.querySelector(`#hex-decoder-insert-layer`),ge=a.querySelector(`#hex-decoder-set-reference`),_e=a.querySelector(`#hex-decoder-set-project`),P=128,F=64,ve=4,ye=`draw`,I=new Uint8Array(P*F),L=new Uint8Array,R=`bitmap`,be=!1,xe=1,Se=!1,Ce=null,z=null,we=null,Te=null,Ee=[],De=[];function B(){Ee.push(I.slice()),Ee.length>50&&Ee.shift(),De.length=0}function Oe(){Ee.length!==0&&(De.push(I.slice()),I=Ee.pop(),H())}function ke(){De.length!==0&&(Ee.push(I.slice()),I=De.pop(),H())}let Ae={matrix:{fg:`#a8d9a8`,bg:`#18211b`},oled_blue:{fg:`#00f0ff`,bg:`#050c14`},oled_white:{fg:`#ffffff`,bg:`#000000`},oled_amber:{fg:`#ffb800`,bg:`#140d02`},nokia:{fg:`#1c3325`,bg:`#8ea890`},bw:{fg:`#000000`,bg:`#ffffff`}};function je(e){Ae[e]&&(x.value=Ae[e].fg,S.value=Ae[e].bg)}function V(e=null){Di(_,e||I,P,F,{zoom:ve,showGrid:!y||y.checked,hoverX:we,hoverY:Te,invert:v?v.checked:!1,fgColor:x.value,bgColor:S.value}),_.style.width=`${P*ve}px`,_.style.height=`${F*ve}px`;let t=0;for(let e=0;e<I.length;e++)I[e]===1&&t++;let n=P*F,r=n>0?(t/n*100).toFixed(1):0;pe&&(pe.textContent=`${t.toLocaleString()} / ${n.toLocaleString()} (${r}%)`),le&&(le.textContent=`${P} × ${F}`)}function H(){L=gi(I,P,F,c.value),Se=!0,s.value=Ti(s.value,L,P,F,c.value,R),Se=!1,Pe(),V()}function Ne(){if(Se)return;let e=s.value||``,t=pi(e);L=t.bytes,t.variableName&&(R=t.variableName),t.detectedWidth&&t.detectedHeight?(P=t.detectedWidth,F=t.detectedHeight,l.value=P,u.value=F):(P=Math.max(1,parseInt(l.value,10)||128),F=Math.max(1,parseInt(u.value,10)||64)),t.formatSuggestion&&c.value!==t.formatSuggestion&&(e.includes(`_bits`)||e.includes(`#define`)||e.includes(`u8g2`))&&(c.value=t.formatSuggestion),I=hi(L,P,F,c.value),L.length>0&&K(`hex_decode_execute`,{format:c.value,width:P,height:F,bytes:L.length}),Pe(),V()}function Pe(){let e=c.value;ie.textContent=`${L.length.toLocaleString()} Bytes (${(L.length*8).toLocaleString()} Bits)`,ae.textContent=`${P} × ${F} px`;let t=e.startsWith(`rgb565`)?P*F*2:e===`gray8`?P*F:e===`u8g2`||e===`vertical_msb`?Math.ceil(F/8)*P:Math.ceil(P/8)*F;if(L.length===0)A.textContent=`Empty`,A.className=`badge status-idle`,ce.textContent=`Draw directly on the screen above, or paste C/XBM code to start.`;else if(L.length===t)A.textContent=`100% Matched`,A.className=`badge status-match`,ce.textContent=`Exact byte match: ${L.length} bytes matches ${P}×${F} px (${e}).`;else if(L.length>t){let e=L.length-t;A.textContent=`+${e} Extra Bytes`,A.className=`badge status-warn`,ce.textContent=`Buffer has ${L.length} bytes; display uses first ${t} bytes (+${e} unused).`}else{let e=t-L.length;A.textContent=`-${e} Bytes Short`,A.className=`badge status-warn`,ce.textContent=`Buffer has ${L.length} bytes; ${t} bytes needed for full ${P}×${F} px.`}}let Fe=null;function U(){Fe&&clearTimeout(Fe),Fe=setTimeout(Ne,40)}function Ie(e){let t=_.getBoundingClientRect(),n=P/t.width,r=F/t.height,i=Math.floor((e.clientX-t.left)*n),a=Math.floor((e.clientY-t.top)*r);return[Math.max(0,Math.min(P-1,i)),Math.max(0,Math.min(F-1,a))]}function Le(e,t){return e>=0&&e<P&&t>=0&&t<F}function Re(e,t){if(!Le(e,t)){M&&(M.textContent=`—`),ue&&(ue.textContent=`—`),de&&(de.textContent=`—`),fe&&(fe.textContent=`—`);return}let n=Oi(L,P,F,e,t,{format:c.value,invert:v?v.checked:!1});M&&(M.textContent=`${e}, ${t}`),n&&(ue&&(ue.textContent=`${n.hexByte} (#${n.byteIndex})`),de&&(de.textContent=`Bit ${n.bitIndex}`),fe&&(fe.textContent=`${t*P+e}`))}_.addEventListener(`pointerdown`,e=>{_.setPointerCapture(e.pointerId),be=!0;let[t,n]=Ie(e);if(!Le(t,n))return;B();let r=e.button===2?ye===`draw`?`erase`:`draw`:ye;if(r===`draw`)xe=I[n*P+t]===1?0:1,I[n*P+t]=xe,H();else if(r===`erase`)xe=0,I[n*P+t]=0,H();else if(r===`fill`){let e=I[n*P+t];Si(I,P,F,t,n,+!e),H()}else r===`line`?Ce=[t,n]:r===`rect`&&(z=[t,n])}),_.addEventListener(`pointermove`,e=>{let[t,n]=Ie(e);if(we=t,Te=n,Re(t,n),!be){V();return}let r=(e.buttons&2)==2?ye===`draw`?`erase`:`draw`:ye;if(r===`draw`)I[n*P+t]=xe,H();else if(r===`erase`)I[n*P+t]=0,H();else if(r===`line`&&Ce){let e=I.slice();Ci(e,P,F,Ce[0],Ce[1],t,n,1),V(e)}else if(r===`rect`&&z){let e=I.slice();wi(e,P,F,z[0],z[1],t,n,1),V(e)}}),_.addEventListener(`pointerup`,e=>{let[t,n]=Ie(e);ye===`line`&&Ce?(Ci(I,P,F,Ce[0],Ce[1],t,n,1),Ce=null,H()):ye===`rect`&&z&&(wi(I,P,F,z[0],z[1],t,n,1),z=null,H()),be=!1,V()}),_.addEventListener(`pointerleave`,()=>{we=null,Te=null,M&&(M.textContent=`—`),ue&&(ue.textContent=`—`),de&&(de.textContent=`—`),fe&&(fe.textContent=`—`),V()}),_.addEventListener(`contextmenu`,e=>{e.preventDefault()}),w.forEach(e=>{e.addEventListener(`click`,()=>{w.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),ye=e.dataset.tool||`draw`})}),T?.addEventListener(`click`,Oe),ee?.addEventListener(`click`,ke),E?.addEventListener(`click`,()=>{B();let e=_i(I,P,F);I=e.pixels,P=e.width,F=e.height,l.value=P,u.value=F,H()}),O?.addEventListener(`click`,()=>{B(),I=vi(I,P,F),H()}),k?.addEventListener(`click`,()=>{B(),I=yi(I,P,F),H()}),ne?.addEventListener(`click`,()=>{B(),I=bi(I),H()}),re?.addEventListener(`click`,()=>{B(),I=xi(I),H()}),g&&(g.addEventListener(`dragover`,e=>{e.preventDefault(),g.style.outline=`2px dashed #00f0ff`}),g.addEventListener(`dragleave`,()=>{g.style.outline=``}),g.addEventListener(`drop`,async e=>{e.preventDefault(),g.style.outline=``;let t=e.dataTransfer?.files?.[0];if(t){if(t.name.toLowerCase().endsWith(`.bmp`))try{let e=Ei(await t.arrayBuffer());B(),P=e.width,F=e.height,l.value=P,u.value=F,I=e.pixels,H(),n(`📁 Loaded BMP: ${e.width}×${e.height} px`,`info`)}catch(e){n(`Failed to parse BMP file: `+e.message,`error`)}else{let e=await t.text();s.value=e,Ne(),n(`📁 Loaded file: ${t.name}`,`info`)}}})),window.addEventListener(`keydown`,e=>{if(a.hidden)return;let t=e.target.tagName===`TEXTAREA`||e.target.tagName===`INPUT`;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`z`)t||(e.preventDefault(),e.shiftKey?ke():Oe());else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`y`&&!t)e.preventDefault(),ke();else if(!t&&!e.ctrlKey&&!e.metaKey&&!e.altKey){let t={d:`draw`,e:`erase`,f:`fill`,l:`line`,r:`rect`}[e.key.toLowerCase()];t&&(ye=t,w.forEach(e=>{e.dataset.tool===t?e.classList.add(`active`):e.classList.remove(`active`)}))}});function ze(){m.innerHTML=`<option value="">Load Sample Hex ▾</option>`;for(let e of ki){let t=document.createElement(`option`);t.value=e.id,t.textContent=e.name,m.appendChild(t)}}ze(),m.addEventListener(`change`,()=>{let e=m.value;if(!e)return;let t=ki.find(t=>t.id===e);t&&(s.value=t.getCode(),c.value=t.format,l.value=t.width,u.value=t.height,P=t.width,F=t.height,Ne()),m.value=``}),d.addEventListener(`change`,()=>{let e=d.value;if(!e)return;let[t,n]=e.split(`x`);if(t&&n){B();let e=parseInt(t,10),r=parseInt(n,10);l.value=e,u.value=r,P=e,F=r,I=new Uint8Array(e*r),H()}d.value=``}),f.addEventListener(`click`,()=>{let e=parseInt(l.value,10)||128,t=mi(L.length,e,c.value);u.value=t,F=t,Ne()}),p.addEventListener(`click`,()=>{B();let e=l.value;l.value=u.value,u.value=e,P=parseInt(l.value,10),F=parseInt(u.value,10),I=new Uint8Array(P*F),H()}),h.addEventListener(`click`,()=>{B(),s.value=``,I=new Uint8Array(P*F),Ne()}),C.forEach(e=>{e.addEventListener(`click`,()=>{C.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),ve=parseInt(e.dataset.zoom,10)||4,V()})}),b.addEventListener(`change`,()=>{je(b.value),V()}),N.addEventListener(`click`,async()=>{if(_)try{_.toBlob(async e=>{e&&(await navigator.clipboard.write([new ClipboardItem({"image/png":e})]),N.textContent=`✓ Copied PNG!`,setTimeout(()=>{N.textContent=`📋 Copy Image`},2e3))})}catch{N.textContent=`✓ Copied (Fallback)`,setTimeout(()=>{N.textContent=`📋 Copy Image`},2e3)}}),me.addEventListener(`click`,()=>{if(!_)return;let e=_.toDataURL(`image/png`),t=document.createElement(`a`);t.download=`decoded_hex_${P}x${F}.png`,t.href=e,t.click()}),he.addEventListener(`click`,()=>{if(!_)return;let e=_.toDataURL(`image/png`);Me(e,_);let t={id:j(),type:`bitmap`,name:`Hex Bitmap (${P}×${F})`,x:0,y:0,width:P,height:F,dataUrl:e};K(`hex_insert_layer`,{width:P,height:F}),te(t),G()}),ge.addEventListener(`click`,()=>{if(!_)return;let e=_.toDataURL(`image/png`);K(`hex_set_reference`,{width:P,height:F}),se({src:e,fileName:`hex_${P}x${F}.png`,naturalWidth:P,naturalHeight:F}),G()}),_e.addEventListener(`click`,async()=>{if(!_)return;let t=_.toDataURL(`image/png`);Me(t,_),K(`hex_set_project`,{width:P,height:F});let r=_e.textContent;_e.textContent=`⏳ Creating Mockup...`,_e.disabled=!0;try{oe({width:P,height:F,background:S.value}),se({src:t,fileName:`hex_${P}x${F}.png`,naturalWidth:P,naturalHeight:F});let r=!1;try{let i=await ti({detectText:!0,detectFrames:!0,detectBadges:!0,detectCircles:!0,detectSymbols:!0},t);if(i&&i.elements&&i.elements.length>0){e.elements=[];for(let e of i.elements)fi(e,!1);D(),r=!0,n(`✨ Created editable mockup with ${i.elements.length} elements! (Original in Reference)`,`info`)}}catch(e){console.warn(`Auto-vectorization skipped:`,e)}r||(e.elements=[{id:j(),type:`bitmap`,name:`Decoded Screen (${P}×${F})`,x:0,y:0,width:P,height:F,dataUrl:t}],D(),n(`🖥️ Mockup created with decoded bitmap layer & background reference.`,`info`)),G()}finally{_e.textContent=r,_e.disabled=!1}}),s.addEventListener(`input`,U),c.addEventListener(`change`,()=>{Ne()}),l.addEventListener(`input`,U),u.addEventListener(`input`,U),v?.addEventListener(`change`,()=>V()),y?.addEventListener(`change`,()=>V()),x?.addEventListener(`input`,()=>V()),S?.addEventListener(`input`,()=>V());function W(e=null){if(a.removeAttribute(`hidden`),a.hidden=!1,a.classList.add(`open`),a.style.display=`flex`,K(`hex_decoder_open`),typeof e==`string`)s.value=e;else if(!s.value.trim()){let e=ki[0];s.value=e.getCode(),c.value=e.format,l.value=e.width,u.value=e.height}Ne()}function G(){a.setAttribute(`hidden`,``),a.hidden=!0,a.classList.remove(`open`),a.style.display=`none`}let Be=a.querySelector(`#hex-decoder-maximize`),Ve=a.querySelector(`.modal-dialog`);return Be?.addEventListener(`click`,()=>{Ve?.classList.toggle(`fullscreen`);let e=Ve?.classList.contains(`fullscreen`);Be.textContent=e?`🗗`:`⛶`,Be.title=e?`Pencereyi Küçült`:`Tam Ekran Yap`}),r?.addEventListener(`click`,()=>W()),i?.addEventListener(`click`,()=>W()),o?.addEventListener(`click`,G),a.addEventListener(`click`,e=>{e.target===a&&G()}),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&!a.hidden?G():(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`h`&&!e.shiftKey&&(e.preventDefault(),a.hidden?W():G())}),G(),{openModal:W,closeModal:G}}function ji(e,t,n,r={}){let{snap:i=!1,snapSize:a=10,displayWidth:o=16384,displayHeight:s=16384,minWidth:c=4,minHeight:l=4}=r,u=n.x,d=n.y;i&&a>0?(u=Math.round(u/a)*a,d=Math.round(d/a)*a):(u=Math.round(u),d=Math.round(d));let{x:f,y:p,width:m,height:h}=t,g=t.x+t.width,_=t.y+t.height;if(e.includes(`e`)){let e=t.width+u;m=Math.max(c,Math.min(o-f,e))}else if(e.includes(`w`)){let e=t.x+u;e=Math.max(0,Math.min(g-c,e)),m=g-e,f=e}if(e.includes(`s`)){let e=t.height+d;h=Math.max(l,Math.min(s-p,e))}else if(e.includes(`n`)){let e=t.y+d;e=Math.max(0,Math.min(_-l,e)),h=_-e,p=e}return{x:Math.round(f),y:Math.round(p),width:Math.round(m),height:Math.round(h)}}var q=null,Mi=null,Ni=null;function Pi(e){q=e,q.addEventListener(`pointerdown`,Fi),q.addEventListener(`dblclick`,Ri),window.addEventListener(`pointermove`,Ii),window.addEventListener(`pointerup`,Li),window.addEventListener(`pointercancel`,Li),window.addEventListener(`blur`,Li),q.addEventListener(`pointerleave`,()=>{let e=document.querySelector(`#status-coords`);e&&!Mi&&!Ni&&(e.textContent=``)})}function Fi(e){let t=e.target.closest(`.resize-handle`);if(t){let n=t.dataset.handle,r=t.dataset.elementId,i=u.elements.find(e=>e.id===r);if(!i)return;Ni={id:r,handle:n,startMouseX:e.clientX,startMouseY:e.clientY,startBox:{x:i.x,y:i.y,width:i.width,height:i.height}},e.preventDefault(),e.stopPropagation();return}let n=e.target.closest(`[data-element-id]`);if(!n){k(null);return}let r=n.dataset.elementId,i=u.elements.find(e=>e.id===r);i&&(k(r),Mi={id:r,startMouseX:e.clientX,startMouseY:e.clientY,startX:i.x,startY:i.y},e.preventDefault())}function Ii(e){let t=document.querySelector(`#status-coords`);if(t&&q){let n=q.getBoundingClientRect(),r=u.view.scale||1,i=Math.floor((e.clientX-n.left)/r),a=Math.floor((e.clientY-n.top)/r);i>=0&&i<u.display.width&&a>=0&&a<u.display.height?t.textContent=`X: ${i}  Y: ${a}`:!Mi&&!Ni&&(t.textContent=``)}if(Ni){let t=u.elements.find(e=>e.id===Ni.id);if(!t)return;let n=u.view.scale||1,r=(e.clientX-Ni.startMouseX)/n,i=(e.clientY-Ni.startMouseY)/n,a=ji(Ni.handle,Ni.startBox,{x:r,y:i},{snap:u.grid.snap,snapSize:u.grid.size,displayWidth:u.display.width,displayHeight:u.display.height,minWidth:t.type===`circle`?10:4,minHeight:t.type===`circle`?10:t.type===`line`?1:4});ae(t.id,a,!1),zi();return}if(!Mi)return;let n=u.elements.find(e=>e.id===Mi.id);if(!n)return;let r=u.view.scale||1,i=(e.clientX-Mi.startMouseX)/r,a=(e.clientY-Mi.startMouseY)/r,o=Mi.startX+i,s=Mi.startY+a;if(u.grid.snap){let e=u.grid.size;o=Math.round(o/e)*e,s=Math.round(s/e)*e}o=Math.max(0,Math.min(u.display.width-n.width,o)),s=Math.max(0,Math.min(u.display.height-n.height,s)),ae(n.id,{x:Math.round(o),y:Math.round(s)},!1),zi()}function Li(){if(Ni){Ni=null,D();return}Mi&&(Mi=null,D())}function Ri(e){let t=e.target.closest(`[data-element-id]`);if(!t)return;let n=t.dataset.elementId,r=u.elements.find(e=>e.id===n);if(!r||r.type!==`text`||t.querySelector(`.inline-text-editor`))return;let i=document.createElement(`input`);i.type=`text`,i.className=`inline-text-editor`,i.value=r.text||``,i.style.position=`absolute`,i.style.left=`0`,i.style.top=`0`,i.style.width=`100%`,i.style.height=`100%`,i.style.fontSize=`${r.fontSize}px`,i.style.fontFamily=r.fontFamily||`monospace`,i.style.fontWeight=String(r.fontWeight||`400`),i.style.color=r.color,i.style.background=`rgba(0, 0, 0, 0.85)`,i.style.border=`1px solid #8be28b`,i.style.outline=`none`,i.style.padding=`0 4px`,i.style.zIndex=`500`;function a(){if(i.parentNode){let e=i.value;i.remove(),ae(r.id,{text:e})}}i.addEventListener(`blur`,a),i.addEventListener(`keydown`,e=>{e.key===`Enter`?a():e.key===`Escape`&&i.remove(),e.stopPropagation()}),t.appendChild(i),i.focus(),i.select()}function zi(){if(!q)return;let{width:e,height:t,background:n}=u.display,r=u.view.scale||1;q.style.width=`${e}px`,q.style.height=`${t}px`,q.style.backgroundColor=n,q.style.transform=`scale(${r})`,q.style.transformOrigin=`center center`,q.classList.toggle(`grid-enabled`,u.grid.enabled),q.style.setProperty(`--grid-size`,`${u.grid.size}px`),q.innerHTML=``;for(let e of u.elements)q.appendChild(Bi(e));if(u.overlay?.enabled&&u.reference?.src){let e=document.createElement(`img`);e.className=`canvas-reference-overlay`,e.src=u.reference.src,e.alt=`Reference Overlay`,e.style.position=`absolute`,e.style.left=`0`,e.style.top=`0`,e.style.width=`100%`,e.style.height=`100%`,e.style.objectFit=`fill`,e.style.opacity=String(u.overlay.opacity??.4),e.style.pointerEvents=`none`,e.style.zIndex=`100`,q.appendChild(e)}}function Bi(e){let t=document.createElement(`div`);return t.className=`canvas-element`,t.dataset.elementId=e.id,t.style.left=`${e.x}px`,t.style.top=`${e.y}px`,t.style.width=`${e.width}px`,t.style.height=`${e.height}px`,e.id===u.selectedId&&(t.classList.add(`selected`),Ki(t,e)),e.type===`text`&&Hi(t,e),e.type===`rectangle`&&Ui(t,e),e.type===`circle`&&Wi(t,e),e.type===`line`&&Gi(t,e),e.type===`bitmap`&&Vi(t,e),t}function Vi(e,t){e.classList.add(`element-bitmap`);let n=e.querySelector(`img`);n||(n=document.createElement(`img`),n.className=`canvas-bitmap-img`,n.style.width=`100%`,n.style.height=`100%`,n.style.objectFit=`fill`,n.style.imageRendering=`pixelated`,n.style.pointerEvents=`none`,n.style.userSelect=`none`,n.draggable=!1,e.appendChild(n)),n.src=t.dataUrl||``,n.style.opacity=t.opacity===void 0?`1`:String(t.opacity)}function Hi(e,t){e.classList.add(`text-element`),e.textContent=t.text,e.style.color=t.color,e.style.fontSize=`${t.fontSize}px`,e.style.fontFamily=t.fontFamily,e.style.fontWeight=t.fontWeight,e.style.lineHeight=`1`}function Ui(e,t){e.classList.add(`rectangle-element`),e.style.background=t.fill,e.style.border=`${t.strokeWidth}px solid ${t.stroke}`,e.style.boxSizing=`border-box`}function Wi(e,t){e.classList.add(`circle-element`),e.style.background=t.fill,e.style.border=`${t.strokeWidth}px solid ${t.stroke}`,e.style.borderRadius=`50%`,e.style.boxSizing=`border-box`}function Gi(e,t){e.classList.add(`line-element`);let n=document.createElement(`div`);n.style.width=`100%`,n.style.height=`${t.strokeWidth}px`,n.style.background=t.color,n.style.pointerEvents=`none`,e.appendChild(n)}function Ki(e,t){let n=t.type===`line`?[`w`,`e`]:[`nw`,`n`,`ne`,`e`,`se`,`s`,`sw`,`w`];for(let r of n){let n=document.createElement(`div`);n.className=`resize-handle handle-${r}`,n.dataset.handle=r,n.dataset.elementId=t.id,e.appendChild(n)}}var qi=[`.ttf`,`.otf`,`.woff`,`.woff2`];function Ji(e){return!e||typeof e!=`string`?`CustomFont`:e.replace(/\.[^/.]+$/,``).replace(/[^a-zA-Z0-9_\-\s]/g,``).trim().replace(/\s+/g,` `)||`CustomFont`}function Yi(e){if(!e||!e.name)return!1;let t=e.name.toLowerCase();return qi.some(e=>t.endsWith(e))}async function Xi(e){if(!Yi(e))throw Error(`Unsupported font format. Please upload .ttf, .otf, .woff, or .woff2 files.`);let t=Ji(e.name),n=await e.arrayBuffer();if(typeof FontFace>`u`)throw Error(`FontFace API is not supported in this environment.`);let r=new FontFace(t,n);return await r.load(),document?.fonts&&document.fonts.add(r),t}function Zi(e,t){let n=u.display.width||320,r=u.display.height||240;return{x:Math.max(0,Math.round((n-e)/2)),y:Math.max(0,Math.round((r-t)/2))}}function Qi(e={}){let t=Math.max(40,e.width||60),n=Math.max(20,e.height||28),r=Zi(t,n),i=e.x===void 0?r.x:e.x,a=e.y===void 0?r.y:e.y,o=e.stroke||`#a8d9a8`,s=e.fill||`#a8d9a8`,c=e.level===void 0?3:e.level,l=t-6,u=[];u.push({id:j(),type:`rectangle`,name:`Battery Frame`,x:i,y:a,width:l,height:n,fill:`transparent`,stroke:o,strokeWidth:2});let d=Math.round(n*.45);u.push({id:j(),type:`rectangle`,name:`Battery Anode`,x:i+l,y:a+Math.round((n-d)/2),width:6,height:d,fill:s,stroke:o,strokeWidth:1});let f=l-8-4,p=Math.max(2,Math.floor(f/3)),m=n-8;for(let e=0;e<Math.min(3,Math.max(0,c));e++)u.push({id:j(),type:`rectangle`,name:`Battery Bar ${e+1}`,x:i+4+e*(p+2),y:a+4,width:p,height:m,fill:s,stroke:s,strokeWidth:1});return u}function $i(e={}){let t=Math.max(80,e.width||180),n=Math.max(16,e.height||26),r=Math.min(100,Math.max(0,e.percent===void 0?65:e.percent)),i=Zi(t,n),a=e.x===void 0?i.x:e.x,o=e.y===void 0?i.y:e.y,s=e.stroke||`#a8d9a8`,c=e.fill||`#a8d9a8`,l=[];l.push({id:j(),type:`rectangle`,name:`Progress Frame`,x:a,y:o,width:t,height:n,fill:`transparent`,stroke:s,strokeWidth:2});let u=t-6,d=Math.max(1,Math.round(r/100*u));return l.push({id:j(),type:`rectangle`,name:`Progress Fill`,x:a+3,y:o+3,width:d,height:n-6,fill:c,stroke:c,strokeWidth:1}),l.push({id:j(),type:`text`,name:`Progress Label`,x:a+t+8,y:o+Math.round((n-18)/2),width:48,height:18,text:`${r}%`,fontSize:14,fontFamily:`Courier New`,fontWeight:700,color:s}),l}function ea(e={}){let t=Math.max(60,e.width||100),n=Math.max(20,e.height||32),r=e.label||`READY`,i=Zi(t,n),a=e.x===void 0?i.x:e.x,o=e.y===void 0?i.y:e.y,s=e.stroke||`#a8d9a8`,c=e.fill||`#25382b`,l=[];return l.push({id:j(),type:`rectangle`,name:`Badge Box`,x:a,y:o,width:t,height:n,fill:c,stroke:s,strokeWidth:2}),l.push({id:j(),type:`text`,name:`Badge Text`,x:a+4,y:o+Math.round((n-18)/2),width:t-8,height:18,text:r,fontSize:14,fontFamily:`Courier New`,fontWeight:700,color:s}),l}function ta(e={}){let t=Math.max(100,e.width||140),n=Math.max(50,e.height||64),r=e.label||`TEMP`,i=e.value||`24.5`,a=e.unit||`°C`,o=Zi(t,n),s=e.x===void 0?o.x:e.x,c=e.y===void 0?o.y:e.y,l=e.stroke||`#a8d9a8`,u=[];return u.push({id:j(),type:`rectangle`,name:`${r} Card`,x:s,y:c,width:t,height:n,fill:`transparent`,stroke:l,strokeWidth:1}),u.push({id:j(),type:`text`,name:`${r} Header`,x:s+6,y:c+4,width:t-12,height:16,text:r,fontSize:10,fontFamily:`Courier New`,fontWeight:600,color:l}),u.push({id:j(),type:`text`,name:`${r} Value`,x:s+6,y:c+24,width:t-42,height:32,text:i,fontSize:22,fontFamily:`Courier New`,fontWeight:700,color:l}),u.push({id:j(),type:`text`,name:`${r} Unit`,x:s+t-36,y:c+32,width:30,height:20,text:a,fontSize:12,fontFamily:`Courier New`,fontWeight:600,color:l}),u}function na(e,t={}){let n=[];return e===`battery`?n=Qi(t):e===`progress`?n=$i(t):e===`badge`?n=ea(t):e===`gauge`&&(n=ta(t)),n.length>0&&ne(n),n}var ra=null;function ia(e){return new Promise((t,n)=>{if(!e){n(Error(`No file selected.`));return}if(!e.type.startsWith(`image/`)){n(Error(`Please select an image file.`));return}ra&&URL.revokeObjectURL(ra),ra=URL.createObjectURL(e);let r=new Image;r.onload=()=>{se({src:ra,fileName:e.name,naturalWidth:r.naturalWidth,naturalHeight:r.naturalHeight}),t({width:r.naturalWidth,height:r.naturalHeight,src:ra})},r.onerror=()=>{n(Error(`Image could not be loaded.`))},r.src=ra})}function aa(){let e=u.reference;e.src&&oe({width:e.naturalWidth,height:e.naturalHeight})}function oa(e,t=`sample.png`){return new Promise((n,r)=>{ra&&=(URL.revokeObjectURL(ra),null);let i=new Image;i.crossOrigin=`anonymous`,i.onload=()=>{se({src:e,fileName:t,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight}),n({width:i.naturalWidth,height:i.naturalHeight,src:e})},i.onerror=()=>{r(Error(`Sample image could not be loaded.`))},i.src=e})}function sa(){ra&&=(URL.revokeObjectURL(ra),null),se({src:null,fileName:null,naturalWidth:0,naturalHeight:0})}var ca=[{id:`controller`,title:`🎛️ Industrial HMI`,subtitle:`128 × 64 Graphic LCD`,url:`./samples/controller.png`},{id:`marlin-3d`,title:`🖨️ 3D Printer (Marlin)`,subtitle:`128 × 64 Blue LCD`,url:`./samples/marlin-printer.png`},{id:`iot-weather`,title:`📟 IoT Weather Station`,subtitle:`128 × 64 ESP32 OLED`,url:`./samples/iot-station.png`}];async function la(e){if(!e||!e.display)return``;let t={d:{w:e.display.width,h:e.display.height,b:e.display.background},e:(e.elements||[]).map(e=>{let t={i:e.id,t:e.type,x:e.x,y:e.y,w:e.width,h:e.height};return e.text===void 0?e.content!==void 0&&(t.c=e.content):t.c=e.text,e.fontFamily&&(t.f=e.fontFamily),e.fontSize&&(t.s=e.fontSize),e.color&&(t.cl=e.color),e.stroke&&(t.st=e.stroke),e.strokeWidth&&(t.sw=e.strokeWidth),e.fill&&(t.fl=e.fill),e.radius!==void 0&&(t.r=e.radius),e.x1!==void 0&&(t.x1=e.x1),e.y1!==void 0&&(t.y1=e.y1),e.x2!==void 0&&(t.x2=e.x2),e.y2!==void 0&&(t.y2=e.y2),e.symbolSubtype&&(t.sub=e.symbolSubtype),e.value!==void 0&&(t.val=e.value),e.max!==void 0&&(t.max=e.max),t})},n=JSON.stringify(t),r=new Blob([n]).stream().pipeThrough(new CompressionStream(`deflate-raw`)),i=await new Response(r).arrayBuffer(),a=new Uint8Array(i),o=``;for(let e=0;e<a.length;e++)o+=String.fromCharCode(a[e]);return btoa(o).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}async function ua(e){if(!e)return null;let t=e.replace(/^#p=/,``).replace(/^#/,``).trim();if(!t)return null;for(t=t.replace(/-/g,`+`).replace(/_/g,`/`);t.length%4!=0;)t+=`=`;let n=atob(t),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);let i=new Blob([r]).stream().pipeThrough(new DecompressionStream(`deflate-raw`)),a=await new Response(i).text(),o=JSON.parse(a);return{display:{width:o.d?.w||128,height:o.d?.h||64,background:o.d?.b||`#18211b`},elements:(o.e||[]).map((e,t)=>({id:e.i||`el_${t}_${Math.random().toString(36).slice(2,6)}`,type:e.t||`text`,x:e.x||0,y:e.y||0,width:e.w||10,height:e.h||10,...e.c===void 0?{}:{content:e.c,text:e.c},...e.f?{fontFamily:e.f}:{},...e.s?{fontSize:e.s}:{},...e.cl?{color:e.cl}:{},...e.st?{stroke:e.st}:{},...e.sw?{strokeWidth:e.sw}:{},...e.fl?{fill:e.fl}:{},...e.r===void 0?{}:{radius:e.r},...e.x1===void 0?{}:{x1:e.x1},...e.y1===void 0?{}:{y1:e.y1},...e.x2===void 0?{}:{x2:e.x2},...e.y2===void 0?{}:{y2:e.y2},...e.sub?{symbolSubtype:e.sub}:{},...e.val===void 0?{}:{value:e.val},...e.max===void 0?{}:{max:e.max}}))}}function da(e,t){return e===84&&t===48?`nokia`:e===160&&t===32?`charlcd`:e===128&&(t===64||t===32)?`oled`:`industrial`}function fa(e,{width:t,height:n,enabled:r}){if(!e)return;let i=e.querySelector(`.hardware-pcb-shell`);if(!r){i&&i.remove(),e.classList.remove(`has-hardware-shell`);return}e.classList.add(`has-hardware-shell`);let a=da(t,n);i||(i=document.createElement(`div`),i.className=`hardware-pcb-shell`,e.prepend(i)),i.dataset.deviceType=a;let o=[`GND`,`VCC`,`SCL`,`SDA`],s=`0.96" I2C OLED (SSD1306)`;a===`nokia`?(o=[`RST`,`CE`,`DC`,`DIN`,`CLK`,`VCC`,`BL`,`GND`],s=`84×48 Graphic LCD (PCD8544)`):a===`charlcd`?(o=[`VSS`,`VDD`,`V0`,`RS`,`RW`,`E`,`D4`,`D5`,`D6`,`D7`,`A`,`K`],s=`16×2 Character LCD (HD44780)`):a===`industrial`&&(o=[`VSS`,`VDD`,`V0`,`RS`,`R/W`,`E`,`DB0..7`,`PSB`,`RST`],s=`${t}×${n} Industrial HMI Controller`),i.innerHTML=`
    <div class="pcb-header-pins">
      ${o.map(e=>`
        <div class="pcb-pin" title="${e}">
          <span class="pin-ring"></span>
          <span class="pin-label">${e}</span>
        </div>
      `).join(``)}
    </div>
    <div class="pcb-screws">
      <span class="pcb-screw top-left"></span>
      <span class="pcb-screw top-right"></span>
      <span class="pcb-screw bottom-left"></span>
      <span class="pcb-screw bottom-right"></span>
    </div>
    <div class="pcb-silkscreen-label">${s}</div>
    <div class="glass-reflection-glare"></div>
  `}var pa=null,ma=null,ha=0;function ga(){return pa!==null}function _a(e){let t=e.match(/^([^0-9.-]*)(-?\d+(?:\.\d+)?)(.*)$/);if(!t)return null;let n=t[2],r=n.includes(`.`)?n.split(`.`)[1].length:0;return{prefix:t[1],num:parseFloat(n),decimals:r,suffix:t[3]}}function va(e,t){return ga()||!e||!Array.isArray(e.elements)?!1:(ma=JSON.parse(JSON.stringify(e.elements)),ha=0,pa=setInterval(()=>{ha++,ya(e),typeof t==`function`&&t()},500),!0)}function ya(e){if(!e||!Array.isArray(e.elements))return;let t=ha%2==0;for(let n=0;n<e.elements.length;n++){let r=e.elements[n],i=ma&&ma[n];if(r.type===`text`){let e=i&&i.text||r.text||``,a=e.match(/^(\d{1,2})(:)(\d{2})(:?\d{0,2})(.*)$/);if(a){r.text=`${a[1]}${t?`:`:` `}${a[2],a[3]}${a[4]?t?a[4]:a[4].replace(`:`,` `):``}${a[5]||``}`;continue}if(/^\d{1,3}\s*%$/.test(e.trim())){let t=parseInt(e,10),n=Math.sin(ha*.15)*5;r.text=`${Math.max(5,Math.min(100,Math.round(t+n)))}%`;continue}let o=_a(e);if(o&&(o.suffix.includes(`°`)||o.suffix.toLowerCase().includes(`c`)||o.suffix.toLowerCase().includes(`v`)||o.suffix.toLowerCase().includes(`hpa`)||o.suffix.toLowerCase().includes(`rpm`)||o.suffix.toLowerCase().includes(`bar`))){let e=Math.sin((ha+n*3)*.25)*.4,t=(o.num+e).toFixed(o.decimals);r.text=`${o.prefix}${t}${o.suffix}`;continue}}if(r.type===`rect`&&r.fill&&i&&i.width>10&&i.width<(e.display?.width||128)){let e=i.width,t=Math.round(Math.sin((ha+n)*.2)*6);r.width=Math.max(2,e+t)}}}function ba(e,t){return ga()?(clearInterval(pa),pa=null,e&&ma&&(e.elements=JSON.parse(JSON.stringify(ma)),ma=null),typeof t==`function`&&t(),!0):!1}function xa(e,t,n,r,i,a=1,o=1){let s=0,c=0,l=Math.max(0,Math.floor(r-a)),u=Math.min(t-1,Math.ceil(r+a)),d=Math.max(0,Math.floor(i-o)),f=Math.min(n-1,Math.ceil(i+o));for(let n=d;n<=f;n++){let r=n*t;for(let t=l;t<=u;t++)s+=e[r+t],c++}if(c===0)return 0;let p=s/c;return Math.max(0,Math.min(1,1-p/255))}function Sa(e,t,n,r={}){let{lineSpacing:i=4,minThickness:a=.4,maxThickness:o=4.2,gamma:s=1.2,angle:c=`horizontal`,modulation:l=`continuous`,pulseFrequency:u=.35,contrast:d=20,brightness:f=0,invert:p=!1}=r,m;if(e instanceof Float32Array)m=e;else if(e?.data)m=Ea(e,{contrast:d,brightness:f});else throw Error(`Invalid source for telegraphic scan: expected Float32Array or ImageData.`);let h=new Uint8Array(t*n),g=Math.max(1,Number(i)||4),_=Math.max(.5,Number(o)||g),v=Math.max(0,Number(a)||0),y=Math.max(1,Math.floor(g/2));for(let e=0;e<n;e++)for(let r=0;r<t;r++){let i=!1;if(c===`diagonal`){let a=(r+e)/Math.SQRT2,o=Math.round(a/g),c=Math.abs(a-o*g),l=xa(m,t,n,r,e,1,1);p&&(l=1-l),l**=+s;let u=v+(_-v)*l;u>=.3&&c<=u/2&&(i=!0)}else if(c===`crosshatch`){let a=Math.round((e-g/2)/g)*g+g/2,o=Math.abs(e-a),c=Math.round((r-g/2)/g)*g+g/2,l=Math.abs(r-c),u=xa(m,t,n,r,e,1,1);p&&(u=1-u),u**=+s;let d=v+(_-v)*u;d>=.3&&(o<=d/2||u>.45&&l<=d/2)&&(i=!0)}else if(c===`vertical`){let a=Math.round((r-g/2)/g)*g+g/2,o=Math.abs(r-a),c=xa(m,t,n,a,e,1,y);p&&(c=1-c),c**=+s;let l=v+(_-v)*c;l>=.3&&o<=l/2&&(i=!0)}else{let a=Math.round((e-g/2)/g)*g+g/2,o=Math.abs(e-a),c=xa(m,t,n,r,a,1,y);p&&(c=1-c),c**=+s;let d=v+(_-v)*c;l===`pulse`&&c<.85&&Math.sin(r*u)<1-c*1.5&&(d=0),d>=.3&&o<=d/2&&(i=!0)}let a=e*t+r;h[a]=+!!i}return h}var Ca=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]],wa=[[0,32,8,40,2,34,10,42],[48,16,56,24,50,18,58,26],[12,44,4,36,14,46,6,38],[60,28,52,20,62,30,54,22],[3,35,11,43,1,33,9,41],[51,19,59,27,49,17,57,25],[15,47,7,39,13,45,5,37],[63,31,55,23,61,29,53,21]];function Ta(e,t=0,n=0){let r=e+n*1.28;if(t!==0){let e=Math.max(-100,Math.min(100,t));r=259*(e+255)/(255*(259-e))*(r-128)+128}return Math.max(0,Math.min(255,r))}function Ea(e,{contrast:t=0,brightness:n=0}={}){let{width:r,height:i,data:a}=e,o=new Float32Array(r*i);for(let e=0;e<r*i;e++){let r=e*4,i=a[r],s=a[r+1],c=a[r+2],l=a[r+3]/255,u=.299*i+.587*s+.114*c;u=u*l+255*(1-l),o[e]=Ta(u,t,n)}return o}function Da(e,t,n,{threshold:r=128,invert:i=!1}={}){let a=new Float32Array(e),o=new Uint8Array(t*n);for(let e=0;e<n;e++)for(let s=0;s<t;s++){let c=e*t+s,l=a[c],u=l>=r,d=l-(u?255:0);o[c]=i?+!u:+!!u,s+1<t&&(a[c+1]+=7/16*d),e+1<n&&(s-1>=0&&(a[c+t-1]+=3/16*d),a[c+t]+=5/16*d,s+1<t&&(a[c+t+1]+=1/16*d))}return o}function Oa(e,t,n,{threshold:r=128,invert:i=!1}={}){let a=new Float32Array(e),o=new Uint8Array(t*n);for(let e=0;e<n;e++)for(let s=0;s<t;s++){let c=e*t+s,l=a[c],u=l>=r,d=(l-(u?255:0))/8;o[c]=i?+!u:+!!u,s+1<t&&(a[c+1]+=d),s+2<t&&(a[c+2]+=d),e+1<n&&(s-1>=0&&(a[c+t-1]+=d),a[c+t]+=d,s+1<t&&(a[c+t+1]+=d)),e+2<n&&(a[c+t*2]+=d)}return o}function ka(e,t,n,{threshold:r=128,matrixSize:i=4,invert:a=!1}={}){let o=new Uint8Array(t*n),s=i===8?wa:Ca,c=i,l=c*c;for(let i=0;i<n;i++)for(let n=0;n<t;n++){let u=i*t+n,d=e[u]+((s[i%c][n%c]+.5)/l-.5)*128>=r;o[u]=a?+!d:+!!d}return o}function Aa(e,t,n,{threshold:r=128,invert:i=!1}={}){let a=new Uint8Array(t*n);for(let o=0;o<t*n;o++){let t=e[o]>=r;a[o]=i?+!t:+!!t}return a}function ja(e,t,n,{fgColor:r=`#ffffff`,bgColor:i=`#000000`}={}){let a=e=>{let t=e.replace(`#`,``);t.length===3&&(t=t.split(``).map(e=>e+e).join(``));let n=parseInt(t,16);return[n>>16&255,n>>8&255,n&255]},o=a(r),s=a(i),c=typeof ImageData<`u`?new ImageData(t,n):{width:t,height:n,data:new Uint8ClampedArray(t*n*4)},l=c.data;for(let t=0;t<e.length;t++){let n=e[t]===1?o:s,r=t*4;l[r]=n[0],l[r+1]=n[1],l[r+2]=n[2],l[r+3]=255}return c}function Ma(e,t={}){let{algorithm:n=`atkinson`,contrast:r=20,brightness:i=0,threshold:a=128,invert:o=!1,fgColor:s=`#a8d9a8`,bgColor:c=`#18211b`}=t,{width:l,height:u}=e,d=Ea(e,{contrast:r,brightness:i}),f;return f=n===`telegraphic`?Sa(d,l,u,{lineSpacing:t.lineSpacing??4,minThickness:t.minThickness??.4,maxThickness:t.maxThickness??(t.lineSpacing??4)*1.05,angle:t.angle??`horizontal`,modulation:t.modulation??`continuous`,gamma:t.gamma??1.2,invert:o}):n===`floyd-steinberg`?Da(d,l,u,{threshold:a,invert:o}):n===`bayer4`?ka(d,l,u,{threshold:a,matrixSize:4,invert:o}):n===`bayer8`?ka(d,l,u,{threshold:a,matrixSize:8,invert:o}):n===`threshold`?Aa(d,l,u,{threshold:a,invert:o}):Oa(d,l,u,{threshold:a,invert:o}),{width:l,height:u,binary:f,createImageData:(e=s,t=c)=>ja(f,l,u,{fgColor:e,bgColor:t})}}document.querySelector(`#app`).innerHTML=`
  <div class="studio">

    <header class="topbar">

      <div class="brand">
        <div class="brand-icon">L</div>

        <div class="brand-copy">
          <strong>LCD Mockup Studio</strong>
          <span id="project-title">Untitled Project</span>
        </div>
      </div>

      <div class="toolbar">

        <button type="button" id="new-project">
          New
        </button>

        <button type="button" id="open-project">
          Open
        </button>

        <button type="button" id="save-project">
          Save
        </button>

        <div class="separator"></div>

        <button type="button" id="undo-button" disabled title="Undo (Ctrl+Z)">
          Undo
        </button>

        <button type="button" id="redo-button" disabled title="Redo (Ctrl+Shift+Z)">
          Redo
        </button>

        <div class="separator"></div>

        <button type="button" id="duplicate-button" disabled title="Duplicate Element (Ctrl+D)">
          Duplicate
        </button>

        <button type="button" id="copy-button" disabled title="Copy Element (Ctrl+C)">
          Copy
        </button>

        <button type="button" id="paste-button" disabled title="Paste Element (Ctrl+V)">
          Paste
        </button>

        <div class="separator"></div>

        <button
          type="button"
          class="export-button"
          id="export-png"
        >
          Export PNG
        </button>

        <button
          type="button"
          class="export-button export-svg-button"
          id="export-svg"
        >
          Export SVG
        </button>

        <button
          type="button"
          class="export-button export-c-button"
          id="export-c"
          title="Export Code: C / C++, JSON, Hex, Arduino, MicroPython, Base64"
        >
          Export Code
        </button>

        <div class="separator"></div>

        <button
          type="button"
          class="share-button"
          id="share-project"
          title="Share Project URL (Creates zero-backend permanent link and copies to clipboard)"
        >
          🔗 Share
        </button>

        <div class="separator"></div>

        <button
          type="button"
          class="shortcuts-button"
          id="shortcuts-button"
          title="Keyboard Shortcuts (?)"
        >
          ⌨️ Shortcuts
        </button>

        <div class="separator"></div>

        <a
          href="https://buymeacoffee.com/mitra.zahiri"
          target="_blank"
          rel="noopener noreferrer"
          class="coffee-button"
          id="buy-me-coffee-btn"
          title="☕ Buy Me a Coffee — Support Mitra Zahiri's development"
        >
          ☕ Buy Me a Coffee
        </a>

      </div>

      <input id="project-file-input" type="file" accept=".json,.lcd.json,application/json" hidden>
    </header>


    <!-- ============================================= -->
    <!-- LEFT SIDEBAR                                  -->
    <!-- ============================================= -->

    <aside class="sidebar left-sidebar">

      <section class="panel reference-panel">

        <div class="panel-header">

          <div>
            <div class="panel-title">
              REFERENCE
            </div>

            <div class="panel-subtitle">
              Original screenshot
            </div>
          </div>

          <span class="beta-badge">
            SOURCE
          </span>

        </div>


        <div
          class="reference-preview empty"
          id="reference-preview"
        >

          <img
            id="reference-preview-image"
            alt="Reference"
            hidden
          >

          <div
            class="reference-placeholder"
            id="reference-placeholder"
          >
            <strong>No reference image</strong>

            <span>
              Upload an LCD, HMI or device
              screenshot.
            </span>
          </div>

        </div>


        <input
          id="reference-file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
        >


        <div class="reference-upload-row">
          <button
            class="wide-button primary-button"
            id="upload-reference"
            type="button"
          >
            Upload
          </button>
          <div class="sample-dropdown-container">
            <button
              class="wide-button secondary-button"
              id="try-sample-btn"
              type="button"
              title="Try built-in LCD sample images"
            >
              Try Sample ▾
            </button>
            <div class="sample-dropdown-menu" id="sample-dropdown-menu" hidden></div>
          </div>
          <button
            class="wide-button secondary-button"
            id="reference-from-hex-btn"
            type="button"
            title="Import reference from C code or hex byte array"
          >
            📥 From Hex
          </button>
        </div>


        <div
          class="reference-info"
          id="reference-info"
          hidden
        >
          <div class="reference-info-meta">
            <strong id="reference-name">Image</strong>
            <span id="reference-size"></span>
          </div>
          <button
            class="reference-remove-btn"
            id="remove-reference"
            type="button"
            title="Remove reference image"
          >
            ✕ Remove
          </button>
        </div>

        <div class="analysis-mode-tabs">
          <button type="button" class="analysis-mode-tab active" id="tab-mode-lcd" data-mode="lcd" title="Extract text & UI from physical LCD displays">
            📟 LCD Screen
          </button>
          <button type="button" class="analysis-mode-tab" id="tab-mode-dither" data-mode="dither" title="High-fidelity retro telegraph and 1-bit scanline engraving">
            📡 Telegraph &amp; Photo
          </button>
        </div>

        <div class="mode-container-lcd" id="mode-container-lcd">
          <details
            class="analysis-options"
            id="analysis-options-details"
            style="margin: 8px 0; font-size: 11px;"
          >
            <summary style="cursor: pointer; color: #a8d9a8; font-weight: bold; margin-bottom: 6px;">
              ⚙ Analysis Settings
            </summary>
            <div style="display: flex; flex-direction: column; gap: 5px; padding: 6px 8px; background: rgba(0,0,0,0.25); border-radius: 4px; border: 1px solid #334438;">
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-text" checked> Text (OCR &amp; 7-Segment)
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-frames" checked> Frames &amp; Lines
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-badges" checked> Badges &amp; Bars
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-circles" checked> Circles &amp; Dots
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-symbols" checked> Symbols &amp; Icons
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-auto-theme" checked> Auto-Adopt Display Palette
              </label>
            </div>
          </details>

          <button
            class="wide-button analyze-button"
            id="analyze-reference"
            type="button"
            disabled
          >
            ✦ Analyze LCD Screen
          </button>

          <button
            class="wide-button secondary-button"
            id="match-reference-size"
            type="button"
            title="Match canvas dimensions to reference image"
            style="margin-top: 6px; font-size: 11px; padding: 7px 10px;"
          >
            📐 Match Screen Size
          </button>
        </div>

        <div class="mode-container-dither" id="mode-container-dither" hidden>
          <div class="dither-settings-box">
            <div class="dither-field">
              <label for="dither-algo-select">Engraving &amp; Dither Style:</label>
              <select id="dither-algo-select" class="sidebar-select">
                <option value="telegraphic" selected>📡 Telegraph Engraving (Wirephoto) ★</option>
                <option value="atkinson">🕹️ 1-Bit Dither (Macintosh 1984)</option>
                <option value="floyd-steinberg">Floyd-Steinberg (Smooth Shading)</option>
                <option value="bayer4">📰 Halftone Matrix (Bayer 4×4)</option>
                <option value="bayer8">Bayer 8×8 (Fine Pixel Matrix)</option>
                <option value="threshold">🖋️ Comic Ink / Stencil</option>
              </select>
            </div>

            <!-- Primary Telegraph Settings (shown when telegraphic is active) -->
            <div id="telegraphic-options-box" class="telegraphic-options-box">
              <div class="dither-field">
                <label for="telegraphic-spacing">Scanline Spacing (Density):</label>
                <select id="telegraphic-spacing" class="sidebar-select">
                  <option value="2">2 px (Ultra High Detail)</option>
                  <option value="3">3 px (Fine &amp; Crisp Engraving)</option>
                  <option value="4" selected>4 px (Classic Telegraph Facsimile - Recommended)</option>
                  <option value="6">6 px (Retro Wide Scanlines)</option>
                </select>
              </div>

              <div class="dither-field">
                <label for="telegraphic-angle">Scanline Angle:</label>
                <select id="telegraphic-angle" class="sidebar-select">
                  <option value="horizontal" selected>Horizontal (0° Classic Wirephoto)</option>
                  <option value="diagonal">Diagonal (45° Currency Engraving)</option>
                  <option value="crosshatch">Crosshatch (Dual-Axis Shading)</option>
                  <option value="vertical">Vertical (90° Raster)</option>
                </select>
              </div>
            </div>

            <!-- Contrast slider (key control) -->
            <div class="dither-slider-group">
              <div class="slider-row">
                <label for="dither-contrast">Contrast</label>
                <span id="dither-contrast-val">+25%</span>
              </div>
              <input type="range" id="dither-contrast" min="-100" max="100" value="25" step="5">
            </div>

            <!-- Clean Collapsible for Advanced / Secondary Settings -->
            <details class="dither-advanced-details" style="font-size: 11px; margin-top: 4px;">
              <summary style="cursor: pointer; color: #8b949e; font-size: 10px; font-weight: 600; padding: 4px 0;">
                ⚙ Advanced Settings (Scaling, Threshold, Brightness)
              </summary>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div class="dither-field">
                  <label for="dither-target-select">Target Display Size:</label>
                  <select id="dither-target-select" class="sidebar-select">
                    <option value="fit" selected>Fit to Current Screen</option>
                    <option value="proportional">Preserve Photo Aspect Ratio</option>
                    <option value="avatar">👤 Insert as Corner Avatar</option>
                    <option value="ssd1306">128 × 64 (OLED / SSD1306)</option>
                    <option value="badge">250 × 122 (e-Paper Badge)</option>
                    <option value="nokia">84 × 48 (Nokia 5110)</option>
                    <option value="smartwatch">128 × 128 (Smartwatch)</option>
                  </select>
                </div>

                <div class="dither-field" id="modulation-field">
                  <label for="telegraphic-modulation">Modulation:</label>
                  <select id="telegraphic-modulation" class="sidebar-select">
                    <option value="continuous" selected>Continuous Stroke Weight</option>
                    <option value="pulse">Morse / Telegraph Pulsed Raster</option>
                  </select>
                </div>

                <div class="dither-slider-group" id="max-thickness-group">
                  <div class="slider-row">
                    <label for="telegraphic-max-thickness">Max Stroke Thickness</label>
                    <span id="telegraphic-max-thickness-val">4.5 px</span>
                  </div>
                  <input type="range" id="telegraphic-max-thickness" min="2" max="10" value="4.5" step="0.5">
                </div>

                <div class="dither-slider-group">
                  <div class="slider-row">
                    <label for="dither-brightness">Brightness</label>
                    <span id="dither-brightness-val">0%</span>
                  </div>
                  <input type="range" id="dither-brightness" min="-100" max="100" value="0" step="5">
                </div>

                <div class="dither-slider-group" id="threshold-slider-group">
                  <div class="slider-row">
                    <label for="dither-threshold">Threshold</label>
                    <span id="dither-threshold-val">128</span>
                  </div>
                  <input type="range" id="dither-threshold" min="30" max="225" value="128" step="1">
                </div>

                <div class="dither-checkbox-row">
                  <label>
                    <input type="checkbox" id="dither-invert"> Invert Colors (Negative)
                  </label>
                </div>
              </div>
            </details>
          </div>

          <!-- Hero Action Button - Standalone & Spacious -->
          <button
            class="wide-button dither-action-btn"
            id="apply-dither-button"
            type="button"
            disabled
          >
            📡 Generate Telegraph Engraving
          </button>
        </div>

        <div
          class="analysis-message"
          id="analysis-message"
          hidden
        ></div>

        <div
          class="reference-actions"
          id="reference-actions"
          hidden
          style="display: none;"
        ></div>

      </section>


      <section class="panel">

        <div class="panel-title">
          ELEMENTS
        </div>

        <div class="element-grid">

          <button
            class="element-card"
            data-element-type="text"
            type="button"
          >
            <span class="element-icon">
              T
            </span>

            <span>
              Text
            </span>
          </button>


          <button
            class="element-card"
            data-element-type="rectangle"
            type="button"
          >
            <span class="element-icon">
              □
            </span>

            <span>
              Rectangle
            </span>
          </button>


          <button
            class="element-card"
            data-element-type="line"
            type="button"
          >
            <span class="element-icon">
              ─
            </span>

            <span>
              Line
            </span>
          </button>


          <button
            class="element-card"
            data-element-type="circle"
            type="button"
          >
            <span class="element-icon">
              ○
            </span>

            <span>
              Circle
            </span>
          </button>

          <button
            class="element-card"
            id="btn-upload-image-element"
            type="button"
            title="Upload custom PNG image, logo or icon as a canvas layer"
          >
            <span class="element-icon">
              🖼️
            </span>

            <span>
              Image / Logo
            </span>
          </button>

          <button
            class="element-card"
            data-element-type="icon"
            type="button"
            title="Insert LCD Icon / Symbol (⚡, ★, ♥, ⚙️)"
          >
            <span class="element-icon">
              ⚡
            </span>

            <span>
              Icon
            </span>
          </button>

        </div>

        <input
          id="image-element-file-input"
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
          hidden
        >

        <div class="panel-subtitle" style="margin-top: 14px; margin-bottom: 8px; font-size: 11px; font-weight: 700; color: #8fa394; text-transform: uppercase; letter-spacing: 0.5px;">
          LCD Stencils
        </div>

        <div class="element-grid stencil-grid">
          <button class="element-card" data-stencil-type="battery" type="button" title="Insert Battery Indicator (Frame + Terminal + Bars)">
            <span class="element-icon">🔋</span>
            <span>Battery</span>
          </button>
          <button class="element-card" data-stencil-type="progress" type="button" title="Insert Progress Bar with Frame & Fill">
            <span class="element-icon">📊</span>
            <span>Progress</span>
          </button>
          <button class="element-card" data-stencil-type="badge" type="button" title="Insert Status Badge / Button">
            <span class="element-icon">🏷️</span>
            <span>Badge</span>
          </button>
          <button class="element-card" data-stencil-type="gauge" type="button" title="Insert Numeric Gauge Box Readout">
            <span class="element-icon">🔢</span>
            <span>Gauge</span>
          </button>
        </div>

      </section>


      <section class="panel layers-panel">

        <div class="panel-header">

          <div class="panel-title">
            LAYERS
          </div>

          <div class="layer-actions">
            <button type="button" class="layer-action-btn" id="layer-to-front" disabled title="Bring to Front">⇈</button>
            <button type="button" class="layer-action-btn" id="layer-move-up" disabled title="Move Up (PageUp / ])">▲</button>
            <button type="button" class="layer-action-btn" id="layer-move-down" disabled title="Move Down (PageDown / [)">▼</button>
            <button type="button" class="layer-action-btn" id="layer-to-back" disabled title="Send to Back">⇊</button>
          </div>

          <span
            class="layer-count"
            id="layer-count"
          >
            0
          </span>

        </div>

        <div
          class="layers-list"
          id="layers-list"
        ></div>

      </section>

    </aside>


    <!-- ============================================= -->
    <!-- WORKSPACE                                     -->
    <!-- ============================================= -->

    <main class="workspace">

      <div class="workspace-header">

        <div>

          <strong>
            Editable Mockup
          </strong>

          <span
            id="workspace-resolution"
          ></span>

        </div>


        <div class="workspace-actions">

          <div class="overlay-controls" id="overlay-controls" title="Reference Ghost Overlay (compare with original photo)" hidden>
            <label>
              <input type="checkbox" id="overlay-toggle">
              Overlay
            </label>
            <input type="range" id="overlay-opacity" min="0.05" max="1" step="0.05" value="0.4" title="Overlay Opacity">
          </div>

          <button
            id="toggle-hardware-shell"
            type="button"
            class="workspace-toggle-btn"
            title="Toggle Realistic Physical Hardware Breakout PCB & Pins"
          >
            🔘 Hardware Shell
          </button>

          <button
            id="toggle-simulation"
            type="button"
            class="workspace-toggle-btn simulation-btn"
            title="Live Hardware Simulation (Animate clock, battery & telemetry)"
          >
            ▶ Live Preview
          </button>

          <div class="separator"></div>

          <button
            id="fit-workspace"
            type="button"
          >
            Fit
          </button>

          <button
            id="zoom-out"
            type="button"
          >
            −
          </button>

          <span
            class="zoom-label"
            id="zoom-label"
          >
            100%
          </span>

          <button
            id="zoom-in"
            type="button"
          >
            +
          </button>

        </div>

      </div>


      <div
        class="canvas-area"
        id="canvas-area"
      >

        <div class="display-frame">

          <div
            class="display-canvas"
          ></div>

        </div>

        <div class="canvas-quickstart" id="canvas-quickstart">
          <div class="quickstart-card">
            <div class="quickstart-title">
              <span class="quickstart-tag">⚡ 1-CLICK QUICKSTART</span>
              <h2>Start with a Real Embedded Display</h2>
              <p>Select a pre-built embedded screen or drop any photo / screenshot:</p>
            </div>
            <div class="quickstart-grid">
              <button class="quickstart-card-btn" type="button" data-sample-id="controller">
                <span class="qs-icon">🎛️</span>
                <div class="qs-text">
                  <strong>Industrial HMI</strong>
                  <span>128 × 64 STN Graphic LCD</span>
                </div>
              </button>
              <button class="quickstart-card-btn" type="button" data-sample-id="marlin-3d">
                <span class="qs-icon">🖨️</span>
                <div class="qs-text">
                  <strong>3D Printer Marlin</strong>
                  <span>128 × 64 Blue Graphic LCD</span>
                </div>
              </button>
              <button class="quickstart-card-btn" type="button" data-sample-id="iot-weather">
                <span class="qs-icon">📟</span>
                <div class="qs-text">
                  <strong>IoT Weather Station</strong>
                  <span>128 × 64 ESP32 OLED</span>
                </div>
              </button>
            </div>
            <div class="quickstart-hints">
              <span>📋 Press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste screenshot</span>
              <span>•</span>
              <span>📁 Drag & drop PNG / JPG anywhere</span>
            </div>
          </div>
        </div>

      </div>


      <div class="workspace-hint">
        Reference stays on the left.
        This canvas contains only editable elements.
      </div>

    </main>


    <!-- ============================================= -->
    <!-- RIGHT SIDEBAR                                 -->
    <!-- ============================================= -->

    <aside class="sidebar right-sidebar">

      <section class="panel">

        <div class="panel-title">
          DISPLAY
        </div>


        <div class="field-row">

          <label class="field">

            <span>
              Width
            </span>

            <input
              id="display-width"
              type="number"
              min="1"
            >

          </label>


          <label class="field">

            <span>
              Height
            </span>

            <input
              id="display-height"
              type="number"
              min="1"
            >

          </label>

        </div>


        <label class="field">

          <span>
            Background
          </span>

          <div class="color-field">

            <input
              id="display-background"
              type="color"
            >

            <input
              id="display-background-text"
              type="text"
              readonly
            >

          </div>

        </label>
 
        <label class="field preset-field">
          <span>
            Target Hardware Display
          </span>
          <select id="hardware-preset-select">
            <option value="">Custom Dimensions</option>
            <option value="ssd1306-128x64">SSD1306 128 × 64 (0.96" OLED)</option>
            <option value="ssd1306-128x32">SSD1306 128 × 32 (0.91" OLED)</option>
            <option value="st7920-128x64">ST7920 128 × 64 (Graphic LCD)</option>
            <option value="nokia-84x48">PCD8544 84 × 48 (Nokia 5110)</option>
            <option value="hd44780-16x2">HD44780 16 × 2 (Character LCD)</option>
            <option value="st7789-240x240">ST7789 240 × 240 (Square IPS)</option>
          </select>
        </label>

        <label class="field preset-field">
          <span>
            LCD Palette Preset
          </span>
          <select id="lcd-preset-select">
            <option value="">Custom / Manual</option>
            <option value="emerald">Dark Emerald (Default)</option>
            <option value="nokia">Nokia 5110 Matrix</option>
            <option value="stn-blue">Blue STN LCD</option>
            <option value="amber">Industrial Amber</option>
            <option value="oled-cyan">OLED Cyan</option>
            <option value="gray-lcd">Classic Gray LCD</option>
          </select>
        </label>


        <div class="document-summary">

          <span>
            Orientation
          </span>

          <strong
            id="display-orientation"
          ></strong>

        </div>

      </section>


      <section class="panel properties-panel">

        <div class="panel-title">
          PROPERTIES
        </div>


        <div
          class="properties-empty"
          id="properties-empty"
        >
          <strong>
            Nothing selected
          </strong>

          <span>
            Select an element on the mockup
            or in Layers.
          </span>
        </div>


        <div
          id="properties-content"
          hidden
        >

          <div class="selected-type">

            <span>
              Selected
            </span>

            <strong
              id="property-type"
            ></strong>

          </div>


          <label
            class="field"
            id="property-text-field"
          >

            <span>
              Text
            </span>

            <input
              id="property-text"
              type="text"
            >

          </label>


          <div class="field-row">

            <label class="field">

              <span>
                X
              </span>

              <input
                id="property-x"
                type="number"
              >

            </label>


            <label class="field">

              <span>
                Y
              </span>

              <input
                id="property-y"
                type="number"
              >

            </label>

          </div>


          <div class="field-row">

            <label class="field">

              <span>
                Width
              </span>

              <input
                id="property-width"
                type="number"
                min="1"
              >

            </label>


            <label class="field">

              <span>
                Height
              </span>

              <input
                id="property-height"
                type="number"
                min="1"
              >

            </label>

          </div>


          <div
            id="text-properties"
          >

            <label class="field">

              <span>
                Font
              </span>

              <select
                id="property-font-family"
              >
                <option value="VT323">
                  VT323 (Dot Matrix)
                </option>

                <option value="Share Tech Mono">
                  Share Tech Mono
                </option>

                <option value="Courier New">
                  Courier New
                </option>

                <option value="monospace">
                  Monospace
                </option>

                <option value="Lucida Console">
                  Lucida Console
                </option>

                <option value="Consolas">
                  Consolas
                </option>

                <option value="Trebuchet MS">
                  Trebuchet MS
                </option>

                <option value="Arial">
                  Arial
                </option>

                <option value="Verdana">
                  Verdana
                </option>
              </select>

              <div class="field-row" style="margin-top: 5px;">
                <input type="file" id="font-file-input" accept=".ttf,.otf,.woff,.woff2" hidden>
                <button type="button" class="wide-button" id="load-custom-font-btn" style="padding: 4px 8px; font-size: 11px;">
                  ⭳ Load Custom Font (.ttf / .woff)
                </button>
              </div>

            </label>


            <div class="field-row">

              <label class="field">

                <span>
                  Font Size
                </span>

                <input
                  id="property-font-size"
                  type="number"
                  min="1"
                >

              </label>


              <label class="field">

                <span>
                  Weight
                </span>

                <select
                  id="property-font-weight"
                >
                  <option value="400">
                    Regular
                  </option>

                  <option value="600">
                    Semi Bold
                  </option>

                  <option value="700">
                    Bold
                  </option>
                </select>

              </label>

            </div>


            <label class="field">

              <span>
                Text Color
              </span>

              <input
                id="property-text-color"
                type="color"
              >

            </label>

          </div>


          <div
            id="shape-properties"
          >

            <label
              class="field"
              id="property-fill-field"
            >

              <span>
                Fill
              </span>

              <input
                id="property-fill"
                type="color"
              >

            </label>


            <label class="field">

              <span>
                Stroke / Line Color
              </span>

              <input
                id="property-stroke"
                type="color"
              >

            </label>


            <label class="field">

              <span>
                Stroke Width
              </span>

              <input
                id="property-stroke-width"
                type="number"
                min="1"
                max="50"
              >

            </label>

          </div>

          <div id="bitmap-properties" hidden>
            <div class="field">
              <span>Bitmap Vectorization</span>
              <button type="button" class="wide-button primary-button" id="property-bitmap-vectorize" style="margin-top: 4px;" title="Extract text, boxes, and shapes from this bitmap into editable vector elements">
                ✨ Convert to Editable Elements
              </button>
            </div>

            <div class="field-row" style="margin-top: 8px;">
              <button type="button" class="wide-button" id="property-bitmap-invert" title="Invert bitmap pixels">
                🔄 Invert Pixels
              </button>
              <button type="button" class="wide-button" id="property-bitmap-open-decoder" title="Open this bitmap in Hex to Image decoder">
                📥 Open in Hex
              </button>
            </div>

            <label class="field" style="margin-top: 8px;">
              <span>Bitmap Tint / Recolor</span>
              <div class="field-row">
                <input id="property-bitmap-tint" type="color" value="#a8d9a8">
                <button type="button" class="icon-button" id="property-bitmap-apply-tint" title="Apply tint color to pixels" style="padding: 4px 8px; font-size: 11px;">Apply</button>
              </div>
            </label>

            <label class="field" style="margin-top: 8px;">
              <span>Bitmap Opacity: <strong id="property-bitmap-opacity-val">100%</strong></span>
              <input id="property-bitmap-opacity" type="range" min="10" max="100" value="100">
            </label>
          </div>


          <div class="field">
            <span>Alignment & Distribution</span>
            <div class="alignment-grid">
              <button type="button" class="icon-button" id="align-left" title="Align Left">⇤</button>
              <button type="button" class="icon-button" id="align-center-h" title="Center Horizontally">⇹</button>
              <button type="button" class="icon-button" id="align-right" title="Align Right">⇥</button>
              <button type="button" class="icon-button" id="align-top" title="Align Top">⤒</button>
              <button type="button" class="icon-button" id="align-center-v" title="Center Vertically">⇕</button>
              <button type="button" class="icon-button" id="align-bottom" title="Align Bottom">⤓</button>
            </div>
            <div class="field-row" style="margin-top: 6px;">
              <button type="button" class="icon-button" id="distribute-h" title="Distribute Horizontally (≥3 elements)" style="padding: 5px; font-size: 11px;">⇶ Distribute H</button>
              <button type="button" class="icon-button" id="distribute-v" title="Distribute Vertically (≥3 elements)" style="padding: 5px; font-size: 11px;">⇵ Distribute V</button>
            </div>
          </div>

          <div class="field-row" style="margin-top: 10px;">
            <button
              class="wide-button"
              id="duplicate-element"
              type="button"
            >
              Duplicate
            </button>
            <button
              class="wide-button danger-button"
              id="delete-element"
              type="button"
            >
              Delete
            </button>
          </div>

        </div>

      </section>

    </aside>


    <!-- ============================================= -->
    <!-- STATUS                                        -->
    <!-- ============================================= -->

    <footer class="statusbar">

      <div class="status-left">
        <span id="project-status" role="status" aria-live="polite"></span>

        <span
          id="status-resolution"
        ></span>

        <span
          id="status-orientation"
        ></span>

        <span
          id="status-coords"
          style="font-family: monospace; font-size: 11px; margin-left: 12px; color: #8fa394;"
        ></span>

      </div>


      <div class="status-right">

        <label>
          <input
            id="grid-toggle"
            type="checkbox"
            checked
          >

          Grid
        </label>


        <label>
          <input
            id="snap-toggle"
            type="checkbox"
            checked
          >

          Snap
        </label>

      </div>

    </footer>

    <div id="c-export-modal" class="modal-backdrop" hidden style="display: none;">
      <div class="modal-dialog" style="max-width: 860px;">
        <div class="modal-header">
          <div class="modal-title">
            <span>💻 Code Export</span>
            <span id="c-export-resolution" class="badge">128 × 64 px</span>
            <span id="c-export-format-badge" class="badge" style="background: #1f2a3a; color: #58a6ff;">C / C++</span>
          </div>
          <button type="button" class="icon-button modal-close" id="c-export-close" title="Close (Esc)">✕</button>
        </div>

        <!-- CODE CATEGORY TABS -->
        <div class="code-export-tabs" id="code-export-tabs">
          <button type="button" class="code-tab-btn active" data-tab="c">💻 C / C++ Code</button>
          <button type="button" class="code-tab-btn" data-tab="json">📋 JSON Code</button>
          <button type="button" class="code-tab-btn" data-tab="hex">🔢 Hex Code</button>
          <button type="button" class="code-tab-btn" data-tab="micropython">🐍 MicroPython</button>
          <button type="button" class="code-tab-btn" data-tab="base64">⚡ Base64 / URI</button>
        </div>

        <div class="modal-body">
          <div class="c-export-preview-column">
            <span class="column-title" id="code-preview-title">1-Bit Monochrome Hardware Preview</span>
            <div class="preview-container" id="code-preview-container">
              <canvas id="c-export-preview" class="c-preview-canvas"></canvas>
            </div>

            <!-- MONOCHROME / IMAGE OPTIONS (C, Hex, MicroPython, Base64) -->
            <div class="c-export-options" id="code-mono-options">
              <label class="field">
                <span id="code-format-label">Target Format</span>
                <select id="c-export-format">
                  <option value="adafruit">Adafruit_GFX (Horizontal MSB-first .h)</option>
                  <option value="u8g2">U8g2 / SSD1306 (Vertical 8-px Pages .h)</option>
                  <option value="xbm">XBM (Standard X BitMap / LSB-first .h)</option>
                  <option value="arduino_sketch">Complete Arduino Sketch (.ino)</option>
                </select>
              </label>
              <div class="field-row">
                <label class="field" style="flex: 1;">
                  <span>Luminance Threshold: <strong id="c-export-threshold-val">128</strong></span>
                  <input type="range" id="c-export-threshold" min="1" max="254" value="128">
                </label>
                <label class="checkbox-label" style="margin-top: 18px; margin-left: 10px; white-space: nowrap;">
                  <input type="checkbox" id="c-export-invert">
                  Invert
                </label>
              </div>
            </div>

            <!-- JSON EXPORT OPTIONS -->
            <div class="c-export-options" id="code-json-options" hidden style="display: none;">
              <div class="field-row" style="margin-top: 4px;">
                <label class="checkbox-label">
                  <input type="checkbox" id="code-json-pretty" checked>
                  Pretty-Print (2-space indent)
                </label>
              </div>
              <div class="json-summary-card" style="margin-top: 12px; background: #111518; padding: 12px; border-radius: 6px; font-size: 11px; color: #8fa394; border: 1px solid #282f37; display: flex; flex-direction: column; gap: 6px;">
                <div>📐 Display: <strong id="json-info-res" style="color: #c9d1d9;">128 × 64 px</strong></div>
                <div>🧩 Elements: <strong id="json-info-count" style="color: #c9d1d9;">0 elements</strong></div>
                <div>🎨 Background: <strong id="json-info-bg" style="color: #c9d1d9;">#18211b</strong></div>
              </div>
            </div>
          </div>

          <div class="c-export-code-column">
            <span class="column-title" id="code-column-title">Generated Code</span>
            <textarea id="c-export-code" class="c-code-area" readonly spellcheck="false"></textarea>
            <div class="modal-actions">
              <button type="button" class="wide-button" id="c-export-copy">📋 Copy C Code</button>
              <button type="button" class="wide-button primary-button" id="c-export-download">⭳ Download .h File</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- HEX TO IMAGE DECODER MODAL -->
    <div id="hex-decoder-modal" class="modal-backdrop" hidden style="display: none;">
      <div class="modal-dialog hex-modal-dialog">
        <div class="modal-header">
          <div class="modal-title">
            <span>📥 Hex to Image — Embedded C Bitmap &amp; Byte Decoder</span>
            <span id="hex-decoder-byte-count" class="badge">0 Bytes (0 Bits)</span>
            <span id="hex-decoder-resolution-badge" class="badge">128 × 64 px</span>
            <span id="hex-decoder-status-badge" class="badge status-match">Ready</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button type="button" class="icon-button" id="hex-decoder-maximize" title="Toggle Fullscreen / Maximize">⛶</button>
            <button type="button" class="icon-button modal-close" id="hex-decoder-close" title="Close (Esc)">✕</button>
          </div>
        </div>
        <div class="modal-body hex-modal-body">
          <!-- LEFT COLUMN: CODE INPUT & CONTROLS -->
          <div class="hex-input-column">
            <div class="hex-column-header">
              <span class="column-title">Hex Code / C Array Input</span>
              <div class="hex-sample-controls">
                <select id="hex-decoder-samples" class="hex-select-compact" title="Load real-world LCD sample code">
                  <option value="">Load Sample Hex ▾</option>
                </select>
                <button type="button" id="hex-decoder-clear" class="hex-btn-compact" title="Clear input">✕ Clear</button>
              </div>
            </div>

            <textarea
              id="hex-decoder-input"
              class="c-code-area hex-code-area"
              spellcheck="false"
              placeholder="// Paste C array, XBM bits, MicroPython bytearray, or raw hex bytes here...&#10;// Example:&#10;// static const unsigned char PROGMEM logo_bmp[] = { 0x00, 0xFF, ... };&#10;// Or raw: 00 FF A1 B2 ... or 0x00, 0xFF..."
            ></textarea>

            <div id="hex-decoder-hint" class="hex-status-banner">
              Paste any C header, XBM, MicroPython array, or raw hex bytes to decode.
            </div>

            <div class="hex-config-card">
              <div class="hex-config-row">
                <label class="field" style="flex: 1.4;">
                  <span>Format / Scan Direction</span>
                  <select id="hex-decoder-format">
                    <option value="adafruit">Adafruit_GFX (Horizontal MSB-first .h)</option>
                    <option value="u8g2">U8g2 / SSD1306 (Vertical 8-px Pages .h)</option>
                    <option value="xbm">XBM (Standard X BitMap / LSB-first .h)</option>
                    <option value="vertical_msb">Vertical / Column-major MSB-first</option>
                    <option value="rgb565_be">RGB565 Color (16-bit Big-Endian / TFT)</option>
                    <option value="rgb565_le">RGB565 Color (16-bit Little-Endian)</option>
                    <option value="gray8">Grayscale (8-bit / 1 Byte per px)</option>
                  </select>
                </label>

                <label class="field" style="flex: 1;">
                  <span>Quick Preset</span>
                  <select id="hex-decoder-presets">
                    <option value="">Choose Preset ▾</option>
                    <option value="128x64">128 × 64 (SSD1306 / ST7920)</option>
                    <option value="128x32">128 × 32 (SSD1306 0.91")</option>
                    <option value="84x48">84 × 48 (Nokia 5110 PCD8544)</option>
                    <option value="128x128">128 × 128 (ST7735 / Color)</option>
                    <option value="240x240">240 × 240 (ST7789 IPS)</option>
                    <option value="240x320">240 × 320 (ILI9341 TFT)</option>
                    <option value="96x64">96 × 64 (OLED)</option>
                    <option value="64x64">64 × 64 (Square Icon)</option>
                    <option value="32x32">32 × 32 (Badge)</option>
                    <option value="16x16">16 × 16 (Small Icon)</option>
                  </select>
                </label>
              </div>

              <div class="hex-config-row" style="align-items: flex-end;">
                <label class="field" style="flex: 1;">
                  <span>Width (px)</span>
                  <input type="number" id="hex-decoder-width" min="1" max="1024" value="128">
                </label>

                <label class="field" style="flex: 1;">
                  <span>Height (px)</span>
                  <input type="number" id="hex-decoder-height" min="1" max="1024" value="64">
                </label>

                <button type="button" id="hex-decoder-auto-height" class="hex-btn-tool" title="Auto-calculate height from byte count and width">
                  ⚡ Auto Height
                </button>

                <button type="button" id="hex-decoder-swap-dim" class="hex-btn-tool" title="Swap Width and Height">
                  ⇄ Swap
                </button>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: LIVE SCREEN PREVIEW & ACTIONS -->
          <div class="hex-preview-column">
            <div class="hex-column-header">
              <span class="column-title">Live Screen &amp; Interactive Pixel Editor</span>
              <div class="hex-zoom-group">
                <span style="font-size: 11px; color: #8fa394; margin-right: 4px;">Zoom:</span>
                <button type="button" class="hex-zoom-btn" data-zoom="1">1×</button>
                <button type="button" class="hex-zoom-btn" data-zoom="2">2×</button>
                <button type="button" class="hex-zoom-btn" data-zoom="3">3×</button>
                <button type="button" class="hex-zoom-btn active" data-zoom="4">4×</button>
                <button type="button" class="hex-zoom-btn" data-zoom="6">6×</button>
                <button type="button" class="hex-zoom-btn" data-zoom="8">8×</button>
                <button type="button" class="hex-zoom-btn" data-zoom="12">12×</button>
                <button type="button" class="hex-zoom-btn" data-zoom="16">16×</button>
              </div>
            </div>

            <!-- BITMAP PIXEL EDITING TOOLBAR (KasperCalc Inspired) -->
            <div class="hex-canvas-toolbar">
              <div class="hex-tool-btn-group" id="hex-tools-group">
                <button type="button" class="hex-tool-btn active" data-tool="draw" id="hex-tool-draw" title="Draw Pixel [D] (Tıkla/Sürükle: pikselleri değiştir, Sağ tık: sil)">✏️ Draw</button>
                <button type="button" class="hex-tool-btn" data-tool="erase" id="hex-tool-erase" title="Erase Pixel [E] (Sol tık/sürükle: pikselleri sıfırla)">🧹 Erase</button>
                <button type="button" class="hex-tool-btn" data-tool="fill" id="hex-tool-fill" title="Flood Fill [F] (Bölgeyi doldur)">🪣 Fill</button>
                <button type="button" class="hex-tool-btn" data-tool="line" id="hex-tool-line" title="Line Tool [L] (Düz çizgi çiz)">📏 Line</button>
                <button type="button" class="hex-tool-btn" data-tool="rect" id="hex-tool-rect" title="Rectangle Tool [R] (Kutu çerçeve çiz)">⬜ Rect</button>
              </div>

              <div class="hex-toolbar-separator"></div>

              <div class="hex-tool-btn-group">
                <button type="button" class="hex-tool-btn" id="hex-tool-undo" title="Undo bit edit (Ctrl+Z)">↩ Undo</button>
                <button type="button" class="hex-tool-btn" id="hex-tool-redo" title="Redo bit edit (Ctrl+Y)">↪ Redo</button>
              </div>

              <div class="hex-toolbar-separator"></div>

              <div class="hex-tool-btn-group">
                <button type="button" class="hex-tool-btn" id="hex-tool-rot90" title="Rotate 90° Clockwise">⟳ 90°</button>
                <button type="button" class="hex-tool-btn" id="hex-tool-flipx" title="Flip Horizontally (Flip X)">↔ Flip X</button>
                <button type="button" class="hex-tool-btn" id="hex-tool-flipy" title="Flip Vertically (Flip Y)">↕ Flip Y</button>
                <button type="button" class="hex-tool-btn" id="hex-tool-invert-bits" title="Invert All Bits (0 ↔ 1)">⌽ Invert</button>
                <button type="button" class="hex-tool-btn" id="hex-tool-clear-canvas" title="Clear All Pixels to 0">🗑 Clear</button>
              </div>
            </div>

            <div class="hex-preview-container" id="hex-preview-wrap">
              <canvas id="hex-decoder-preview" class="hex-preview-canvas" style="touch-action: none;"></canvas>
            </div>

            <!-- KASPERCALC STYLE LIVE INSPECTION BAR -->
            <div id="hex-decoder-pixel-info" class="hex-pixel-info hex-info-grid">
              <span>Size: <b id="hex-info-size">128×64</b></span>
              <span>Cursor: <b id="hex-info-xy">—</b></span>
              <span>Byte: <b id="hex-info-byte">—</b></span>
              <span>Bit: <b id="hex-info-bit">—</b></span>
              <span>Index: <b id="hex-info-idx">—</b></span>
              <span>Pixels ON: <b id="hex-info-count">0</b></span>
            </div>

            <div class="hex-quick-tip">
              💡 <b>Hızlı İpucu:</b> Ekrana doğrudan tıklayarak veya sürükleyerek pikselleri anında değiştirin (C/Hex kodu senkronize güncellenir). Tek tıkla 0/1 geçişi yapabilir, daha geniş ve rahat çizim için Zoom'u <b>4×</b>, <b>6×</b> veya <b>8×</b> seçebilirsiniz.
            </div>

            <div class="hex-appearance-bar">
              <label class="field" style="margin-bottom: 0;">
                <span style="font-size: 10px;">Color Theme</span>
                <select id="hex-decoder-theme" style="padding: 3px 6px; font-size: 11px;">
                  <option value="matrix">LCD Matrix Green</option>
                  <option value="oled_blue">OLED Cyan Blue</option>
                  <option value="oled_white">OLED Pure White</option>
                  <option value="oled_amber">OLED Amber Yellow</option>
                  <option value="nokia">Nokia 5110 Teal</option>
                  <option value="bw">Paper Black &amp; White</option>
                </select>
              </label>

              <label class="field" style="margin-bottom: 0; width: 45px;">
                <span style="font-size: 10px;">Pixel</span>
                <input type="color" id="hex-decoder-fg-color" value="#a8d9a8" style="padding: 1px; height: 24px; cursor: pointer;">
              </label>

              <label class="field" style="margin-bottom: 0; width: 45px;">
                <span style="font-size: 10px;">Back</span>
                <input type="color" id="hex-decoder-bg-color" value="#18211b" style="padding: 1px; height: 24px; cursor: pointer;">
              </label>

              <label class="checkbox-label" style="margin-top: 14px; white-space: nowrap; font-size: 11px;">
                <input type="checkbox" id="hex-decoder-invert">
                Invert
              </label>

              <label class="checkbox-label" style="margin-top: 14px; white-space: nowrap; font-size: 11px;">
                <input type="checkbox" id="hex-decoder-grid">
                Pixel Grid
              </label>
            </div>

            <div class="hex-actions-grid">
              <button type="button" class="wide-button" id="hex-decoder-copy-img" title="Copy PNG image directly to clipboard">
                📋 Copy Image
              </button>
              <button type="button" class="wide-button" id="hex-decoder-download-png" title="Download decoded image as PNG file">
                ⭳ Download PNG
              </button>
              <button type="button" class="wide-button primary-button" id="hex-decoder-insert-layer" title="Insert decoded bitmap as a new layer into canvas">
                🖼️ Insert as Layer
              </button>
              <button type="button" class="wide-button secondary-button" id="hex-decoder-set-reference" title="Set decoded image as background reference in left sidebar">
                📐 Set as Reference
              </button>
              <button type="button" class="wide-button" id="hex-decoder-set-project" title="Resize project screen and load decoded bitmap as display">
                🖥️ Create Mockup From This
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KEYBOARD SHORTCUTS MODAL -->
    <div id="shortcuts-modal" class="modal-backdrop" hidden style="display: none;">
      <div class="modal-dialog" style="max-width: 580px;">
        <div class="modal-header">
          <div class="modal-title">
            <span>⌨️ Keyboard Shortcuts</span>
          </div>
          <button type="button" class="icon-button modal-close" id="shortcuts-close" title="Close (Esc)">✕</button>
        </div>
        <div class="modal-body" style="flex-direction: column;">
          <div class="shortcuts-grid">
            <div class="shortcut-group">
              <div class="shortcut-group-title">Clipboard & History</div>
              <div class="shortcut-row">
                <span>Paste Image / Element</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>V</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Copy Selected Element</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>C</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Duplicate Element</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>D</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Undo Action</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>Z</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Redo Action</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>Y</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Hex to Image Decoder</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>H</kbd></div>
              </div>
            </div>
            <div class="shortcut-group">
              <div class="shortcut-group-title">Canvas & Selection</div>
              <div class="shortcut-row">
                <span>Nudge Element (1px)</span>
                <div class="shortcut-keys"><kbd>Arrow Keys</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Fast Nudge (5px)</span>
                <div class="shortcut-keys"><kbd>Shift</kbd> + <kbd>Arrow</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Layer Up / Down</span>
                <div class="shortcut-keys"><kbd>]</kbd> / <kbd>[</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Delete Element</span>
                <div class="shortcut-keys"><kbd>Del</kbd> / <kbd>Backspace</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Open Shortcuts</span>
                <div class="shortcut-keys"><kbd>?</kbd></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FLOATING TOAST CONTAINER -->
    <div id="toast-container" class="toast-container"></div>

  </div>
`;var Na=document.querySelector(`.display-canvas`),Pa=document.querySelector(`#canvas-area`),Fa=document.querySelector(`#reference-file-input`),Ia=document.querySelector(`#upload-reference`),La=document.querySelector(`#reference-preview`),Ra=document.querySelector(`#reference-preview-image`),za=document.querySelector(`#reference-placeholder`),Ba=document.querySelector(`#reference-info`);document.querySelector(`#reference-name`),document.querySelector(`#reference-size`);var J=document.querySelector(`#analyze-reference`),Y=document.querySelector(`#analysis-message`),Va=document.querySelector(`#reference-actions`),Ha=document.querySelector(`#match-reference-size`),Ua=document.querySelector(`#remove-reference`),Wa=document.querySelector(`#fit-workspace`),Ga=document.querySelector(`#zoom-out`),Ka=document.querySelector(`#zoom-in`),qa=document.querySelector(`#zoom-label`),Ja=document.querySelector(`#workspace-resolution`),Ya=document.querySelector(`#display-width`),Xa=document.querySelector(`#display-height`),Za=document.querySelector(`#display-background`),Qa=document.querySelector(`#display-background-text`),$a=document.querySelector(`#display-orientation`),eo=document.querySelector(`#status-resolution`),to=document.querySelector(`#status-orientation`),no=document.querySelector(`#layers-list`),ro=document.querySelector(`#layer-count`),io=document.querySelector(`#properties-empty`),ao=document.querySelector(`#properties-content`),oo=document.querySelector(`#property-type`),so=document.querySelector(`#property-text-field`),co=document.querySelector(`#property-text`),lo=document.querySelector(`#property-x`),uo=document.querySelector(`#property-y`),fo=document.querySelector(`#property-width`),po=document.querySelector(`#property-height`),mo=document.querySelector(`#text-properties`),ho=document.querySelector(`#property-font-family`),go=document.querySelector(`#font-file-input`),_o=document.querySelector(`#load-custom-font-btn`),vo=document.querySelector(`#property-font-size`),yo=document.querySelector(`#property-font-weight`),bo=document.querySelector(`#property-text-color`),xo=document.querySelector(`#shape-properties`),So=document.querySelector(`#property-fill-field`),Co=document.querySelector(`#property-fill`),wo=document.querySelector(`#property-stroke`),To=document.querySelector(`#property-stroke-width`),Eo=document.querySelector(`#bitmap-properties`),Do=document.querySelector(`#property-bitmap-vectorize`),Oo=document.querySelector(`#property-bitmap-invert`),ko=document.querySelector(`#property-bitmap-tint`),Ao=document.querySelector(`#property-bitmap-apply-tint`),jo=document.querySelector(`#property-bitmap-opacity`),Mo=document.querySelector(`#property-bitmap-opacity-val`),No=document.querySelector(`#property-bitmap-open-decoder`),Po=document.querySelector(`#delete-element`),Fo=document.querySelector(`#grid-toggle`),Io=document.querySelector(`#snap-toggle`),Lo=document.querySelector(`#undo-button`),Ro=document.querySelector(`#redo-button`),zo=document.querySelector(`#duplicate-button`),Bo=document.querySelector(`#copy-button`),Vo=document.querySelector(`#paste-button`),Ho=document.querySelector(`#duplicate-element`),Uo=document.querySelector(`#overlay-controls`),Wo=document.querySelector(`#overlay-toggle`),Go=document.querySelector(`#overlay-opacity`),Ko=document.querySelector(`#lcd-preset-select`),qo=document.querySelector(`#layer-to-front`),Jo=document.querySelector(`#layer-move-up`),Yo=document.querySelector(`#layer-move-down`),Xo=document.querySelector(`#layer-to-back`),Zo=document.querySelector(`#align-left`),Qo=document.querySelector(`#align-center-h`),$o=document.querySelector(`#align-right`),es=document.querySelector(`#align-top`),ts=document.querySelector(`#align-center-v`),ns=document.querySelector(`#align-bottom`),rs=document.querySelector(`#distribute-h`),is=document.querySelector(`#distribute-v`);function as(){let e=!!u.selectedId,t=!!ue(),n=u.elements.length>=3;zo&&(zo.disabled=!e),Ho&&(Ho.disabled=!e),Bo&&(Bo.disabled=!e),Vo&&(Vo.disabled=!t),qo&&(qo.disabled=!e),Jo&&(Jo.disabled=!e),Yo&&(Yo.disabled=!e),Xo&&(Xo.disabled=!e),Zo&&(Zo.disabled=!e),Qo&&(Qo.disabled=!e),$o&&($o.disabled=!e),es&&(es.disabled=!e),ts&&(ts.disabled=!e),ns&&(ns.disabled=!e),rs&&(rs.disabled=!n),is&&(is.disabled=!n),Uo&&(Uo.hidden=!u.reference.src)}function os(){Lo.disabled=!b(),Ro.disabled=!x()}Lo.addEventListener(`click`,()=>{C()}),Ro.addEventListener(`click`,()=>{w()});function ss(){let e=O();e&&de(e.id)}zo&&zo.addEventListener(`click`,ss),Ho&&Ho.addEventListener(`click`,ss),Bo&&Bo.addEventListener(`click`,()=>{let e=O();e&&(fe(e.id),as())}),Vo&&Vo.addEventListener(`click`,()=>{pe()}),Wo&&Wo.addEventListener(`change`,()=>{ge(Wo.checked)}),Go&&Go.addEventListener(`input`,()=>{_e(Go.value)}),Ko&&Ko.addEventListener(`change`,()=>{Ko.value&&F(Ko.value)}),qo&&qo.addEventListener(`click`,()=>he(void 0,`front`)),Jo&&Jo.addEventListener(`click`,()=>he(void 0,`up`)),Yo&&Yo.addEventListener(`click`,()=>he(void 0,`down`)),Xo&&Xo.addEventListener(`click`,()=>he(void 0,`back`)),Zo&&Zo.addEventListener(`click`,()=>N(void 0,`left`)),Qo&&Qo.addEventListener(`click`,()=>N(void 0,`center`)),$o&&$o.addEventListener(`click`,()=>N(void 0,`right`)),es&&es.addEventListener(`click`,()=>N(void 0,`top`)),ts&&ts.addEventListener(`click`,()=>N(void 0,`middle`)),ns&&ns.addEventListener(`click`,()=>N(void 0,`bottom`)),rs&&rs.addEventListener(`click`,()=>me(`horizontal`)),is&&is.addEventListener(`click`,()=>me(`vertical`)),E(os),E(as),os(),as(),Pi(Na),document.querySelectorAll(`[data-element-type]`).forEach(e=>{e.addEventListener(`click`,()=>{ui(e.dataset.elementType)})}),document.querySelectorAll(`[data-stencil-type]`).forEach(e=>{e.addEventListener(`click`,()=>{na(e.dataset.stencilType)})});function cs(e){if(!e)return;let t=new FileReader;t.onload=t=>{let n=t.target.result,r=new Image;r.onload=()=>{let t=r.naturalWidth||64,i=r.naturalHeight||64,a=e.name?e.name.replace(/\.[^/.]+$/,``):`Logo`,o=a.charAt(0).toUpperCase()+a.slice(1),s=di({dataUrl:n,name:o,naturalWidth:t,naturalHeight:i});K(`image_upload`,{name:o,width:t,height:i}),Q(`✨ Added "${o}" (${s.width}×${s.height}px) to canvas!`,`info`)},r.src=n},t.readAsDataURL(e)}var ls=document.querySelector(`#btn-upload-image-element`),us=document.querySelector(`#image-element-file-input`);ls&&us&&(ls.addEventListener(`click`,()=>{us.click()}),us.addEventListener(`change`,()=>{let e=us.files?.[0];e&&(cs(e),us.value=``)}));var ds=document.querySelector(`.workspace`);ds&&(ds.addEventListener(`dragover`,e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`),ds.classList.add(`drag-over`)}),ds.addEventListener(`dragleave`,e=>{e.preventDefault(),ds.classList.remove(`drag-over`)}),ds.addEventListener(`drop`,e=>{e.preventDefault(),ds.classList.remove(`drag-over`);let t=e.dataTransfer?.files;if(t&&t.length>0){let e=t[0];e.type.startsWith(`image/`)&&cs(e)}}));var fs=!1,ps=!1;function ms(){let e=u.reference,t=!!e.src;if(t?Ra.src=e.src:Ra.removeAttribute(`src`),Ra.hidden=!t,za.hidden=t,La.classList.toggle(`empty`,!t),Ba&&(Ba.hidden=!t,t)){let e=document.querySelector(`#reference-name`),t=document.querySelector(`#reference-size`);e&&u.reference.name&&(e.textContent=u.reference.name),t&&u.reference.width&&(t.textContent=`${u.reference.width} × ${u.reference.height} px`)}Va&&(Va.hidden=!0),J&&(J.disabled=!t);let n=document.querySelector(`#apply-dither-button`);n&&(n.disabled=!t),Y&&(Y.hidden=!0)}async function hs(e){fs=!0;try{Y&&(Y.hidden=!0);let t=await e;if(Ra.src=t.src,Ra.hidden=!1,za.hidden=!0,La.classList.remove(`empty`),Ba){Ba.hidden=!1;let e=document.querySelector(`#reference-name`),n=document.querySelector(`#reference-size`);e&&(e.textContent=t.name||`Image`),n&&(n.textContent=`${t.width} × ${t.height} px`)}Va&&(Va.hidden=!0),J&&(J.disabled=!1);let n=document.querySelector(`#apply-dither-button`);return n&&(n.disabled=!1),aa(),requestAnimationFrame(()=>X()),t}catch(e){return console.error(e),window.alert(e?.message||`Reference image could not be loaded.`),null}finally{fs=!1}}Ia.addEventListener(`click`,()=>{Fa.click()}),Fa.addEventListener(`change`,async()=>{let e=Fa.files?.[0];e&&(await hs(ia(e)),Fa.value=``)}),window.addEventListener(`paste`,async e=>{let t=e.target;if(t?.tagName===`INPUT`||t?.tagName===`TEXTAREA`||t?.isContentEditable)return;let n=e.clipboardData?.items;if(n){for(let t of n)if(t.type.startsWith(`image/`)){let n=t.getAsFile();if(n){e.preventDefault(),await hs(ia(n));break}}}});var gs=document.querySelector(`#try-sample-btn`),_s=document.querySelector(`#sample-dropdown-menu`);gs&&_s&&(_s.innerHTML=ca.map(e=>`
      <button class="sample-dropdown-item" type="button" data-sample-id="${e.id}">
        <strong>${e.title}</strong>
        <span>${e.subtitle}</span>
      </button>
    `).join(``),gs.addEventListener(`click`,e=>{e.stopPropagation(),_s.hidden=!_s.hidden}),document.addEventListener(`click`,()=>{_s.hidden=!0}),_s.addEventListener(`click`,async e=>{let t=e.target.closest(`.sample-dropdown-item`);if(!t)return;let n=t.dataset.sampleId,r=ca.find(e=>e.id===n);r&&(_s.hidden=!0,await hs(oa(r.url,r.title))&&J.click())})),Ha.addEventListener(`click`,()=>{aa(),requestAnimationFrame(()=>X())}),Ua.addEventListener(`click`,()=>{sa(),Ra.removeAttribute(`src`),Ra.hidden=!0,za.hidden=!1,La.classList.add(`empty`),Ba&&(Ba.hidden=!0),Va.hidden=!0,J.disabled=!0,Y&&(Y.hidden=!0)}),J.addEventListener(`click`,async()=>{if(!u.reference.src)return;ps=!0;let e=J.textContent;J.disabled=!0,J.textContent=`Analyzing...`,Y.hidden=!1,Y.className=`analysis-message`,Y.textContent=`Analyzing image...`;try{let e=document.querySelector(`#opt-detect-text`)?.checked??!0,t=document.querySelector(`#opt-detect-frames`)?.checked??!0,n=document.querySelector(`#opt-detect-badges`)?.checked??!0,r=document.querySelector(`#opt-detect-circles`)?.checked??!0,i=document.querySelector(`#opt-detect-symbols`)?.checked??!0,a=document.querySelector(`#opt-auto-theme`)?.checked??!0,o=await ti({detectText:e,detectFrames:t,detectBadges:n,detectCircles:r,detectSymbols:i});ie(!1),a&&o.palette?.background&&oe({background:o.palette.background});for(let e of o.elements)fi(e,!1);D(),requestAnimationFrame(()=>X()),Y.hidden=!1,Y.textContent=`✓ ${o.elements.length} elements detected`,Q(`✓ ${o.elements.length} LCD elements vectorized!`,`info`),setTimeout(()=>{ps||(Y.hidden=!0)},2500)}catch(e){console.error(e),Y.className=`analysis-message error`,Y.textContent=e?.message||`Analysis failed.`,Q(e?.message||`Analysis failed`,`warn`)}finally{J.disabled=!u.reference.src,J.textContent=e,ps=!1}});var vs=document.querySelector(`#analyze-telegraphic`);vs?.addEventListener(`click`,async()=>{if(!u.reference.src)return;let e=vs.textContent;vs.disabled=!0,vs.textContent=`Scanning...`,Q(`📡 Scanning telegraph / wirephoto scanlines...`,`info`);try{let e=await tt(u.reference.src),t=u.display.width,n=u.display.height;if(u.display.width<=128&&e.naturalWidth>128){let r=e.naturalWidth/(e.naturalHeight||1);r>=1?(t=Math.min(e.naturalWidth,256),n=Math.max(32,Math.round(t/r))):(n=Math.min(e.naturalHeight,256),t=Math.max(32,Math.round(n*r))),oe({width:t,height:n})}let r=document.createElement(`canvas`);r.width=t,r.height=n;let i=r.getContext(`2d`);i.imageSmoothingEnabled=!0,i.imageSmoothingQuality=`high`,i.drawImage(e,0,0,t,n);let a=i.getImageData(0,0,t,n),o=u.display.background||`#18211b`,s=o===`#000000`||o===`#18211b`||o.startsWith(`#0`)||o.startsWith(`#1`)?`#a8d9a8`:`#18211b`,c=Ma(a,{algorithm:`telegraphic`,lineSpacing:4,minThickness:.4,maxThickness:4.5,contrast:25,brightness:0,invert:!1,fgColor:s,bgColor:o}).createImageData(s,o);i.putImageData(c,0,0);let l=r.toDataURL(`image/png`);Me(l,r);let d={id:`bmp_tele_${Date.now()}`,type:`bitmap`,name:`Telegraph / Wirephoto Engraving`,x:0,y:0,width:t,height:n,dataUrl:l,ditherMethod:`telegraphic`,contrast:25,brightness:0,threshold:128,invert:!1};u.elements=[d],u.selectedId=d.id,D(),requestAnimationFrame(()=>X()),Q(`📡 Telegraph / wirephoto engraving generated! C code and SVG updated.`,`info`)}catch(e){console.error(`Telegraphic scan error:`,e),Q(`Scan error: `+e.message,`error`)}finally{vs.disabled=!u.reference.src,vs.textContent=e}}),Ya.addEventListener(`change`,()=>{oe({width:Math.max(1,Number(Ya.value)||1)}),X()}),Xa.addEventListener(`change`,()=>{oe({height:Math.max(1,Number(Xa.value)||1)}),X()}),Za.addEventListener(`input`,()=>{oe({background:Za.value})});function X(){let e=Math.max(100,Pa.clientWidth-100),t=Math.max(100,Pa.clientHeight-100),n=u.display.width,r=u.display.height;if(n<=0||r<=0)return;let i=e/n,a=t/r,o=Math.min(i,a);o=Math.min(4,Math.max(.1,o)),A(o)}Wa.addEventListener(`click`,X),Ga.addEventListener(`click`,()=>{let e=u.view.scale;A(e-.25)}),Ka.addEventListener(`click`,()=>{let e=u.view.scale;A(e+.25)}),Fo.addEventListener(`change`,()=>{ce(Fo.checked)}),Io.addEventListener(`change`,()=>{le(Io.checked)});function ys(){if(no.innerHTML=``,ro.textContent=String(u.elements.length),u.elements.length===0){let e=document.createElement(`div`);e.className=`layers-empty`,e.textContent=`No editable elements yet.`,no.appendChild(e);return}[...u.elements].reverse().forEach(e=>{let t=document.createElement(`button`);t.type=`button`,t.className=`layer-item`,e.id===u.selectedId&&t.classList.add(`active`);let n=document.createElement(`span`);n.className=`layer-icon`,n.textContent=bs(e.type);let r=document.createElement(`span`);r.className=`layer-name`,r.textContent=e.type===`text`?e.text:e.name,t.append(n,r),t.addEventListener(`click`,()=>{k(e.id)}),no.appendChild(t)})}function bs(e){return e===`text`?`T`:e===`rectangle`?`□`:e===`circle`?`○`:e===`line`?`─`:`•`}function xs(){let e=O();if(!e){io.hidden=!1,ao.hidden=!0;return}io.hidden=!0,ao.hidden=!1,oo.textContent=e.type,lo.value=e.x,uo.value=e.y,fo.value=e.width,po.value=e.height;let t=e.type===`text`,n=[`rectangle`,`circle`,`line`].includes(e.type);if(so.hidden=!t,mo.hidden=!t,xo.hidden=!n,t){if(co.value=e.text,e.fontFamily&&!Array.from(ho.options).some(t=>t.value===e.fontFamily)){let t=document.createElement(`option`);t.value=e.fontFamily,t.textContent=`${e.fontFamily} (Custom)`,ho.appendChild(t)}ho.value=e.fontFamily,vo.value=e.fontSize,yo.value=String(e.fontWeight),bo.value=e.color}if(n){let t=e.type===`line`;So.hidden=t,t||(Co.value=Ss(e.fill,`#324638`)),wo.value=Ss(t?e.color:e.stroke,`#a8d9a8`),To.value=e.strokeWidth||1}let r=e.type===`bitmap`;if(Eo&&(Eo.hidden=!r,r)){let t=Math.round((e.opacity===void 0?1:e.opacity)*100);jo&&(jo.value=t),Mo&&(Mo.textContent=`${t}%`),ko&&e.tint&&(ko.value=e.tint)}}function Ss(e,t){return typeof e==`string`&&/^#[0-9a-f]{6}$/i.test(e)?e:t}function Z(e){let t=O();t&&ae(t.id,e)}co.addEventListener(`input`,()=>{Z({text:co.value})}),lo.addEventListener(`change`,()=>{Z({x:Number(lo.value)||0})}),uo.addEventListener(`change`,()=>{Z({y:Number(uo.value)||0})}),fo.addEventListener(`change`,()=>{Z({width:Math.max(1,Number(fo.value)||1)})}),po.addEventListener(`change`,()=>{Z({height:Math.max(1,Number(po.value)||1)})}),ho.addEventListener(`change`,()=>{Z({fontFamily:ho.value})}),_o&&go&&(_o.addEventListener(`click`,()=>{go.click()}),go.addEventListener(`change`,async()=>{let e=go.files?.[0];if(!e)return;let t=document.querySelector(`#project-status`);try{t&&(t.textContent=`Loading font ${e.name}…`);let n=await Xi(e);if(!Array.from(ho.options).some(e=>e.value===n)){let e=document.createElement(`option`);e.value=n,e.textContent=`${n} (Custom)`,ho.appendChild(e)}ho.value=n,Z({fontFamily:n}),t&&(t.textContent=`Loaded font: ${n}`)}catch(e){t&&(t.textContent=`Font error: ${e.message}`)}finally{go.value=``}})),vo.addEventListener(`change`,()=>{Z({fontSize:Math.max(1,Number(vo.value)||1)})}),yo.addEventListener(`change`,()=>{Z({fontWeight:Number(yo.value)})}),bo.addEventListener(`input`,()=>{Z({color:bo.value})}),Co.addEventListener(`input`,()=>{Z({fill:Co.value})}),wo.addEventListener(`input`,()=>{let e=O();if(e){if(e.type===`line`){Z({color:wo.value});return}Z({stroke:wo.value})}}),To.addEventListener(`change`,()=>{Z({strokeWidth:Math.max(1,Number(To.value)||1)})}),Po.addEventListener(`click`,()=>{let e=O();e&&re(e.id)});function Cs(e){return new Promise(t=>{let n=new Image;n.onload=()=>{let e=document.createElement(`canvas`);e.width=n.width,e.height=n.height;let r=e.getContext(`2d`);r.drawImage(n,0,0);let i=r.getImageData(0,0,e.width,e.height),a=i.data;for(let e=0;e<a.length;e+=4)a[e+3]>0&&(a[e]=255-a[e],a[e+1]=255-a[e+1],a[e+2]=255-a[e+2]);r.putImageData(i,0,0);let o=e.toDataURL(`image/png`);Me(o,e),t(o)},n.src=e})}function ws(e,t){return new Promise(n=>{let r=new Image;r.onload=()=>{let e=document.createElement(`canvas`);e.width=r.width,e.height=r.height;let i=e.getContext(`2d`);i.drawImage(r,0,0);let a=i.getImageData(0,0,e.width,e.height),o=a.data,s=t.replace(`#`,``),c=parseInt(s.slice(0,2),16)||0,l=parseInt(s.slice(2,4),16)||0,u=parseInt(s.slice(4,6),16)||0;for(let e=0;e<o.length;e+=4){let t=.299*o[e]+.587*o[e+1]+.114*o[e+2];o[e+3]>20&&t>20&&(o[e]=c,o[e+1]=l,o[e+2]=u)}i.putImageData(a,0,0);let d=e.toDataURL(`image/png`);Me(d,e),n(d)},r.src=e})}Do?.addEventListener(`click`,async()=>{let e=O();if(!e||e.type!==`bitmap`||!e.dataUrl)return;let t=Do.textContent;Do.disabled=!0,Do.textContent=`⏳ Vectorizing...`;try{let t=await ti({detectText:!0,detectFrames:!0,detectBadges:!0,detectCircles:!0,detectSymbols:!0},e.dataUrl);if(t&&t.elements&&t.elements.length>0){let n=e.x||0,r=e.y||0;re(e.id);for(let e of t.elements)fi({...e,x:(e.x||0)+n,y:(e.y||0)+r},!1);D(),Q(`✨ Converted bitmap to ${t.elements.length} editable elements!`,`info`)}else Q(`No distinct text or shape elements detected in this bitmap.`,`warn`)}catch(e){console.error(e),Q(`Vectorization error: `+e.message,`error`)}finally{Do.disabled=!1,Do.textContent=t}}),Oo?.addEventListener(`click`,async()=>{let e=O();e&&e.type===`bitmap`&&e.dataUrl&&(Z({dataUrl:await Cs(e.dataUrl)}),D(),Q(`🔄 Bitmap pixels inverted`,`info`))}),Ao?.addEventListener(`click`,async()=>{let e=O();if(!e||e.type!==`bitmap`||!e.dataUrl)return;let t=ko?.value||`#a8d9a8`;Z({dataUrl:await ws(e.dataUrl,t),tint:t}),D(),Q(`🎨 Applied tint color to bitmap`,`info`)}),jo?.addEventListener(`input`,()=>{let e=Number(jo.value)||100;Mo&&(Mo.textContent=`${e}%`),Z({opacity:e/100})}),No?.addEventListener(`click`,()=>{let e=O();if(!e||e.type!==`bitmap`)return;let t=document.querySelector(`#reference-from-hex-btn`)||document.querySelector(`#open-hex-decoder`);t&&t.click()}),window.addEventListener(`keydown`,e=>{let t=e.target,n=t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement;if(n)return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`z`){e.preventDefault(),e.shiftKey?w():C();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`y`){e.preventDefault(),w();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`v`&&ue()){e.preventDefault(),pe(),Q(`Pasted element from clipboard`,`info`);return}if(e.key===`?`&&!n){e.preventDefault(),Os();return}e.key===`Escape`&&ks();let r=O();if(!r)return;if(e.key===`Delete`||e.key===`Backspace`){re(r.id),e.preventDefault();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`d`){e.preventDefault(),de(r.id);return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`c`){e.preventDefault(),fe(r.id),as();return}if(e.key===`PageUp`||e.key===`]`){e.preventDefault(),he(r.id,e.shiftKey?`front`:`up`);return}if(e.key===`PageDown`||e.key===`[`){e.preventDefault(),he(r.id,e.shiftKey?`back`:`down`);return}let i=e.shiftKey?5:1,a=r.x,o=r.y;if(e.key===`ArrowLeft`)a-=i;else if(e.key===`ArrowRight`)a+=i;else if(e.key===`ArrowUp`)o-=i;else if(e.key===`ArrowDown`)o+=i;else return;a=Math.max(0,Math.min(u.display.width-r.width,a)),o=Math.max(0,Math.min(u.display.height-r.height,o)),ae(r.id,{x:a,y:o}),e.preventDefault()});function Ts(){let e=u.display.width,t=u.display.height,n=e>=t?`Landscape`:`Portrait`;Ya.value=e,Xa.value=t,Za.value=u.display.background,Qa.value=u.display.background.toUpperCase(),$a.textContent=n,Ja.textContent=`${e} × ${t} px`,eo.textContent=`${e} × ${t} px`,to.textContent=n,qa.textContent=`${Math.round(u.view.scale*100)}%`,Fo.checked=u.grid.enabled,Io.checked=u.grid.snap,Wo&&(Wo.checked=!!u.overlay?.enabled),Go&&(Go.value=String(u.overlay?.opacity??.4)),as();let r=document.querySelector(`#canvas-quickstart`);r&&(r.hidden=u.elements.length>0||!!u.reference.src);let i=document.querySelector(`#hardware-preset-select`);i&&(i.value=Object.keys(ve).find(n=>ve[n].width===e&&ve[n].height===t)||``);let a=document.querySelector(`.display-frame`);a&&u.hardwareShellEnabled&&fa(a,{width:e,height:t,enabled:!0}),ys(),xs()}E(()=>{zi(),Ts()});var Es=null;window.addEventListener(`resize`,()=>{clearTimeout(Es),Es=setTimeout(X,100)}),zi(),Ts(),requestAnimationFrame(()=>{X()}),De({refreshReference:ms,fitWorkspace:X,isAnalyzing:()=>ps||fs}),Fe(u),ze(u),et(u),Ai(u,{showToast:Q}),Ue(),Ke(),document.querySelector(`#buy-me-coffee-btn`)?.addEventListener(`click`,()=>{K(`coffee_click`,{location:`header`})});function Q(e,t=`info`){let n=document.querySelector(`#toast-container`);if(!n)return;let r=document.createElement(`div`);r.className=`toast-item toast-${t}`,r.innerHTML=`<span>${t===`warn`?`⚠️`:t===`error`?`❌`:`✅`}</span> <span>${e}</span>`,n.appendChild(r),setTimeout(()=>{r.classList.add(`toast-out`),setTimeout(()=>r.remove(),250)},2500)}function Ds(){let e=document.querySelector(`#hardware-preset-select`);e&&e.addEventListener(`change`,()=>{let t=e.value;if(t&&ve[t]){ye(t);let e=ve[t];K(`preset_apply`,{name:t,title:e.name}),Q(`Target display set to ${e.name}`,`info`)}})}var $=document.querySelector(`#shortcuts-modal`);function Os(){$&&($.removeAttribute(`hidden`),$.hidden=!1,$.classList.add(`open`),$.style.display=`flex`)}function ks(){$&&($.setAttribute(`hidden`,``),$.hidden=!0,$.classList.remove(`open`),$.style.display=`none`)}function As(){let e=document.querySelector(`#shortcuts-button`),t=document.querySelector(`#shortcuts-close`);e?.addEventListener(`click`,Os),t?.addEventListener(`click`,ks),$?.addEventListener(`click`,e=>{e.target===$&&ks()})}function js(){let e=document.querySelector(`#canvas-quickstart`);e&&e.querySelectorAll(`.quickstart-card-btn`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.sampleId,n=ca.find(e=>e.id===t);n&&(Q(`Loading ${n.title}...`,`info`),await hs(oa(n.url,n.title))&&J.click())})})}Ds(),As(),js();function Ms(){document.querySelector(`#share-project`)?.addEventListener(`click`,async()=>{try{let e=await la(u);if(!e){Q(`Empty project cannot be shared`,`warn`);return}window.location.hash=`p=${e}`,K(`share_link_create`),navigator.clipboard&&navigator.clipboard.writeText?(await navigator.clipboard.writeText(window.location.href),Q(`🔗 Share URL copied to clipboard! (Lossless permalink)`,`info`)):Q(`URL updated in address bar!`,`info`)}catch(e){console.error(e),Q(`Failed to create share link`,`error`)}}),window.location.hash&&window.location.hash.startsWith(`#p=`)&&ua(window.location.hash).then(e=>{e&&e.display&&Array.isArray(e.elements)&&(Object.assign(u,{display:e.display,elements:e.elements,selectedId:null}),D(),X(),Q(`✨ Loaded shared mockup from URL!`,`info`))}).catch(e=>{console.warn(`Could not load project from URL:`,e)})}function Ns(){let e=document.querySelector(`#toggle-simulation`);e&&e.addEventListener(`click`,()=>{if(ga())ba(u,()=>{zi(),e.innerHTML=`▶ Live Preview`,e.classList.remove(`active`),document.querySelector(`.workspace`)?.classList.remove(`simulating`),Q(`Simulation stopped — original state restored`,`info`)});else{if(!u.elements||u.elements.length===0){Q(`Add or load some elements first to simulate`,`warn`);return}va(u,()=>{zi()})&&(e.innerHTML=`⏸ Stop Sim`,e.classList.add(`active`),document.querySelector(`.workspace`)?.classList.add(`simulating`),Q(`▶ Live simulation running (clock & telemetry active)`,`info`))}})}function Ps(){let e=document.querySelector(`#toggle-hardware-shell`),t=document.querySelector(`.display-frame`);e&&t&&e.addEventListener(`click`,()=>{u.hardwareShellEnabled=!u.hardwareShellEnabled,fa(t,{width:u.display.width,height:u.display.height,enabled:u.hardwareShellEnabled}),e.classList.toggle(`active`,!!u.hardwareShellEnabled),Q(u.hardwareShellEnabled?`🔘 Breakout PCB & bezel frame enabled`:`Display shell hidden`,`info`)})}Ms(),Ns(),Ps();function Fs(){let e=document.querySelector(`#tab-mode-lcd`),t=document.querySelector(`#tab-mode-dither`),n=document.querySelector(`#mode-container-lcd`),r=document.querySelector(`#mode-container-dither`);e?.addEventListener(`click`,()=>{e.classList.add(`active`),t?.classList.remove(`active`),n&&(n.hidden=!1),r&&(r.hidden=!0)}),t?.addEventListener(`click`,()=>{t.classList.add(`active`),e?.classList.remove(`active`),r&&(r.hidden=!1),n&&(n.hidden=!0)});let i=document.querySelector(`#dither-contrast`),a=document.querySelector(`#dither-contrast-val`);i?.addEventListener(`input`,()=>{let e=parseInt(i.value,10);a&&(a.textContent=(e>0?`+`:``)+e+`%`)});let o=document.querySelector(`#dither-brightness`),s=document.querySelector(`#dither-brightness-val`);o?.addEventListener(`input`,()=>{let e=parseInt(o.value,10);s&&(s.textContent=(e>0?`+`:``)+e+`%`)});let c=document.querySelector(`#dither-threshold`),l=document.querySelector(`#dither-threshold-val`);c?.addEventListener(`input`,()=>{l&&(l.textContent=c.value)});let d=document.querySelector(`#telegraphic-max-thickness`),f=document.querySelector(`#telegraphic-max-thickness-val`);d?.addEventListener(`input`,()=>{f&&(f.textContent=d.value+` px`)});let p=document.querySelector(`#dither-algo-select`),m=document.querySelector(`#telegraphic-options-box`),h=document.querySelector(`#apply-dither-button`);function g(){let e=p?.value===`telegraphic`;m&&(m.hidden=!e);let t=document.querySelector(`#modulation-field`),n=document.querySelector(`#max-thickness-group`),r=document.querySelector(`#threshold-slider-group`);t&&(t.hidden=!e),n&&(n.hidden=!e),r&&(r.hidden=e),h&&(h.textContent=e?`📡 Generate Telegraph Engraving`:`✨ Generate 1-Bit Dither`)}p?.addEventListener(`change`,g),g();async function _(){if(!u.reference.src){Q(`Please upload an image or portrait first`,`warn`);return}let e=document.querySelector(`#apply-dither-button`);e&&(e.disabled=!0);try{let e=p?.value===`telegraphic`;Q(e?`📡 Generating authentic retro telegraph / wirephoto scanline engraving...`:`Converting to high-detail 1-bit dither art...`,`info`);let t=await tt(u.reference.src),n=document.querySelector(`#dither-target-select`)?.value||`fit`,r=n===`avatar`,i=document.querySelector(`#dither-algo-select`)?.value||`telegraphic`,a=parseInt(document.querySelector(`#dither-contrast`)?.value||`25`,10),o=parseInt(document.querySelector(`#dither-brightness`)?.value||`0`,10),s=parseInt(document.querySelector(`#dither-threshold`)?.value||`128`,10),c=!!document.querySelector(`#dither-invert`)?.checked,l=parseInt(document.querySelector(`#telegraphic-spacing`)?.value||`4`,10),d=document.querySelector(`#telegraphic-angle`)?.value||`horizontal`,f=document.querySelector(`#telegraphic-modulation`)?.value||`continuous`,m=parseFloat(document.querySelector(`#telegraphic-max-thickness`)?.value||`4.5`),h=u.display.width,g=u.display.height;if(r){let e=Math.min(80,Math.max(32,Math.round(u.display.height*.75)));h=e,g=e}else if(n===`ssd1306`)h=128,g=64;else if(n===`badge`)h=250,g=122;else if(n===`nokia`)h=84,g=48;else if(n===`smartwatch`)h=128,g=128;else if(n===`proportional`){let e=t.naturalWidth/(t.naturalHeight||1);e>=1?(h=Math.min(t.naturalWidth,256),g=Math.max(16,Math.round(h/e))):(g=Math.min(t.naturalHeight,256),h=Math.max(16,Math.round(g*e)))}let _=document.createElement(`canvas`);_.width=h,_.height=g;let v=_.getContext(`2d`);v.imageSmoothingEnabled=!0,v.imageSmoothingQuality=`high`,v.drawImage(t,0,0,h,g);let y=v.getImageData(0,0,h,g),b=u.display.background||`#18211b`,x=b===`#000000`||b===`#18211b`||b.startsWith(`#0`)||b.startsWith(`#1`)?`#a8d9a8`:`#18211b`,S=Ma(y,{algorithm:i,lineSpacing:l,angle:d,modulation:f,maxThickness:m,contrast:a,brightness:o,threshold:s,invert:c,fgColor:x,bgColor:b}).createImageData(x,b);v.putImageData(S,0,0);let C=_.toDataURL(`image/png`);Me(C,_);let w=r?`Dithered Avatar`:e?`Telegraph / Wirephoto Engraving`:`1-Bit Dither Portrait`,T={id:`bmp_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,type:`bitmap`,name:w,x:r?10:0,y:r?10:0,width:h,height:g,dataUrl:C,ditherMethod:i,contrast:a,brightness:o,threshold:s,invert:c};K(`dither_apply`,{algorithm:i,width:h,height:g,avatar:r}),r?(u.elements.push(T),u.selectedId=T.id,D(),Q(`✨ Dithered Avatar inserted into canvas!`,`info`)):(oe({width:h,height:g}),u.elements=[T],u.selectedId=T.id,D(),requestAnimationFrame(()=>X()),Q(e?`📡 Telegraph / wirephoto engraving generated! Microcontroller C code ready.`:`✨ 1-Bit Dither Portrait generated! Click "Export C Code" for microcontroller code.`,`info`))}catch(e){console.error(`Dithering error:`,e),Q(`Dithering failed: `+e.message,`error`)}finally{e&&(e.disabled=!u.reference.src)}}document.querySelector(`#apply-dither-button`)?.addEventListener(`click`,_)}Fs();
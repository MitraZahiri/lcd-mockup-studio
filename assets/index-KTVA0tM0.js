var e=Object.defineProperty,t=Object.getOwnPropertyDescriptor,n=Object.getOwnPropertyNames,r=Object.prototype.hasOwnProperty,i=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(e){throw n=[e],e}},a=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),o=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r},s=(i,a,o,s)=>{if(a&&typeof a==`object`||typeof a==`function`)for(var c=n(a),l=0,u=c.length,d;l<u;l++)d=c[l],!r.call(i,d)&&d!==o&&e(i,d,{get:(e=>a[e]).bind(null,d),enumerable:!(s=t(a,d))||s.enumerable});return i},c=t=>r.call(t,`module.exports`)?t[`module.exports`]:s(e({},`__esModule`,{value:!0}),t),l=(e=>typeof require<`u`?require:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof require<`u`?require:e)[t]}):e)(function(e){if(typeof require<`u`)return require.apply(this,arguments);throw Error('Calling `require` for "'+e+"\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.")});(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u={display:{width:800,height:480,background:`#18211b`},reference:{src:null,fileName:null,naturalWidth:0,naturalHeight:0},elements:[],selectedId:null,view:{scale:1},grid:{enabled:!0,snap:!0,size:10},overlay:{enabled:!1,opacity:.4}},d=100,f=[],p=[],m=!1;function h(e){try{return structuredClone(e)}catch{return JSON.parse(JSON.stringify(e,(e,t)=>{if(!(typeof HTMLElement<`u`&&t instanceof HTMLElement)&&!(typeof HTMLCanvasElement<`u`&&t instanceof HTMLCanvasElement)&&!(typeof OffscreenCanvas<`u`&&t instanceof OffscreenCanvas))return t}))}}function g(e){return h(e)}function _(){return g({display:u.display,elements:u.elements,grid:u.grid})}function v(e,t){return JSON.stringify(e)===JSON.stringify(t)}function y(){if(m)return;let e=_(),t=f[f.length-1];t&&v(t,e)||(f.push(e),f.length>d&&f.shift(),p.length=0)}function b(){return f.length>1}function x(){return p.length>0}function S(e){m=!0,u.display=g(e.display),u.elements=g(e.elements),u.grid=g(e.grid),u.selectedId=null,m=!1,D()}function C(){if(!b())return!1;let e=f.pop();p.push(e);let t=f[f.length-1];return S(t),!0}function w(){if(!x())return!1;let e=p.pop();return f.push(e),S(e),!0}function T(){f.length=0,p.length=0,f.push(_()),D()}var ee=new Set;function E(e){return ee.add(e),()=>{ee.delete(e)}}function D(){y(),ee.forEach(e=>{e(u)})}function O(){return u.elements.find(e=>e.id===u.selectedId)||null}function k(e){u.selectedId=e,D()}function te(e,t=!0){u.elements.push(e),u.selectedId=e.id,t&&D()}function ne(e){Array.isArray(e)&&(u.elements.push(...e),e.length>0&&(u.selectedId=e[e.length-1].id),D())}function re(e){u.elements=u.elements.filter(t=>t.id!==e),u.selectedId===e&&(u.selectedId=null),D()}function ie(e=!0){u.elements=u.elements.filter(e=>e.source!==`analysis`),u.elements.some(e=>e.id===u.selectedId)||(u.selectedId=null),e&&D()}function ae(e,t,n=!0){let r=u.elements.find(t=>t.id===e);r&&(Object.assign(r,t),n&&D())}function A(e){Object.assign(u.display,e),D()}function oe(e){Object.assign(u.reference,e),D()}function se(e){let t=Number(e);Number.isFinite(t)&&(u.view.scale=Math.max(.1,Math.min(8,t)),D())}function ce(e){u.grid.enabled=!!e,D()}function le(e){u.grid.snap=!!e,D()}function j(){return typeof crypto<`u`&&crypto.randomUUID?crypto.randomUUID():`element-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}var M=null;function ue(){return M}function de(e=u.selectedId){let t=u.elements.find(t=>t.id===e);if(!t)return null;let n=h(t);return n.id=j(),n.x=Math.max(0,Math.min(u.display.width-n.width,n.x+8)),n.y=Math.max(0,Math.min(u.display.height-n.height,n.y+8)),n.name&&=n.name.includes(`(Copy)`)?n.name:`${n.name} (Copy)`,u.elements.push(n),u.selectedId=n.id,D(),n}function fe(e=u.selectedId){let t=u.elements.find(t=>t.id===e);return t?(M=h(t),M):null}function pe(){if(!M)return null;let e=h(M);return e.id=j(),e.x=Math.max(0,Math.min(u.display.width-e.width,e.x+8)),e.y=Math.max(0,Math.min(u.display.height-e.height,e.y+8)),M.x=e.x,M.y=e.y,e.name&&=e.name.includes(`(Copy)`)?e.name:`${e.name} (Copy)`,u.elements.push(e),u.selectedId=e.id,D(),e}function me(e=u.selectedId,t){let n=u.elements.find(t=>t.id===e);if(!n)return;let{width:r,height:i}=u.display;switch(t){case`left`:n.x=0;break;case`center`:n.x=Math.max(0,Math.round((r-n.width)/2));break;case`right`:n.x=Math.max(0,r-n.width);break;case`top`:n.y=0;break;case`middle`:n.y=Math.max(0,Math.round((i-n.height)/2));break;case`bottom`:n.y=Math.max(0,i-n.height);break;default:return}D()}function he(e=`horizontal`){if(u.elements.length<3)return;let t=[...u.elements];if(e===`horizontal`){t.sort((e,t)=>e.x-t.x);let e=t[0],n=t[t.length-1],r=e.x,i=(n.x+n.width-r-t.reduce((e,t)=>e+t.width,0))/(t.length-1),a=r;for(let e of t)e.x=Math.round(a),a+=e.width+i}else if(e===`vertical`){t.sort((e,t)=>e.y-t.y);let e=t[0],n=t[t.length-1],r=e.y,i=(n.y+n.height-r-t.reduce((e,t)=>e+t.height,0))/(t.length-1),a=r;for(let e of t)e.y=Math.round(a),a+=e.height+i}D()}function ge(e=u.selectedId,t){let n=u.elements.findIndex(t=>t.id===e);if(n===-1)return;let r=u.elements,i=r[n];if(t===`up`&&n<r.length-1)r[n]=r[n+1],r[n+1]=i;else if(t===`down`&&n>0)r[n]=r[n-1],r[n-1]=i;else if(t===`front`)r.splice(n,1),r.push(i);else if(t===`back`)r.splice(n,1),r.unshift(i);else return;D()}function _e(e){u.overlay.enabled=!!e,D()}function ve(e){let t=Number(e);Number.isFinite(t)&&(u.overlay.opacity=Math.max(0,Math.min(1,t)),D())}var ye={emerald:{name:`Dark Emerald`,background:`#18211b`,color:`#a8d9a8`,fill:`#324638`},nokia:{name:`Nokia 5110 Matrix`,background:`#c4d5b6`,color:`#222b1d`,fill:`#8fa77e`},"stn-blue":{name:`Blue STN LCD`,background:`#002277`,color:`#ffffff`,fill:`#0033aa`},amber:{name:`Industrial Amber`,background:`#141006`,color:`#ffaa00`,fill:`#3a2705`},"oled-cyan":{name:`OLED Cyan`,background:`#000810`,color:`#00e5ff`,fill:`#002b3d`},"gray-lcd":{name:`Classic Gray LCD`,background:`#9aa89a`,color:`#1a201c`,fill:`#738273`}};function be(e){let t=ye[e];t&&(u.display.background=t.background,D())}var xe={"ssd1306-128x64":{name:`SSD1306 128×64 (0.96" OLED)`,width:128,height:64,colorPreset:`oled-cyan`},"ssd1306-128x32":{name:`SSD1306 128×32 (0.91" OLED)`,width:128,height:32,colorPreset:`oled-cyan`},"st7920-128x64":{name:`ST7920 128×64 (Graphic LCD)`,width:128,height:64,colorPreset:`stn-blue`},"nokia-84x48":{name:`PCD8544 84×48 (Nokia 5110)`,width:84,height:48,colorPreset:`nokia`},"hd44780-16x2":{name:`HD44780 16×2 (Character LCD)`,width:160,height:32,colorPreset:`stn-blue`},"st7789-240x240":{name:`ST7789 240×240 (Square IPS)`,width:240,height:240,colorPreset:`emerald`}};function Se(e){let t=xe[e];t&&(u.display.width=t.width,u.display.height=t.height,t.colorPreset&&ye[t.colorPreset]&&(u.display.background=ye[t.colorPreset].background),y(),D())}T();var Ce=33554432;function N(e,t){if(!e)throw Error(t)}function P(e,t,n=0,r=16384){return N(Number.isFinite(e)&&e>=n&&e<=r,`Invalid ${t}.`),e}function F(e,t,n=1e4){return N(typeof e==`string`&&e.length<=n,`Invalid ${t}.`),e}function we(e,t=!1){return N(typeof e==`string`&&(/^#[0-9a-f]{6}$/i.test(e)||t&&e===`transparent`),`Invalid project color.`),e}function Te(e){N(e?.format===`lcd-mockup-studio`&&e.version===1,`This is not a supported LCD Mockup Studio project (version 1).`);let t={width:P(e.display?.width,`display width`,1),height:P(e.display?.height,`display height`,1),background:we(e.display?.background)},n=e.grid;N(typeof n?.enabled==`boolean`&&typeof n?.snap==`boolean`,`Invalid project grid.`),N(Array.isArray(e.elements)&&e.elements.length<=1e4,`The project must contain at most 10,000 elements.`);let r=new Set,i=e.elements.map(e=>{N(e&&[`text`,`rectangle`,`circle`,`line`,`bitmap`].includes(e.type),`Unsupported element type.`);let t=F(e.id,`element ID`,200);N(t.length>0&&!r.has(t),`Missing or duplicate element ID.`),r.add(t);let n={id:t,type:e.type,name:F(e.name??e.type,`element name`),x:P(e.x,`element X`,-1e6,1e6),y:P(e.y,`element Y`,-1e6,1e6),width:P(e.width,`element width`,1,1e6),height:P(e.height,`element height`,1,1e6)};e.source===`analysis`&&(n.source=`analysis`);for(let t of[`confidence`,`fusionScore`,`support`,`sourceSupport`])Number.isFinite(e[t])&&(n[t]=e[t]);return e.opacity!==void 0&&(n.opacity=P(e.opacity,`opacity`,0,1)),e.rotation!==void 0&&(n.rotation=P(e.rotation,`rotation`,-360,360)),e.type===`text`?(P(Number(e.fontWeight),`font weight`,1,1e3),N(typeof e.fontWeight==`number`||typeof e.fontWeight==`string`,`Invalid font weight.`),e.textAlign!==void 0&&(N([`left`,`center`,`right`].includes(e.textAlign),`Invalid text alignment.`),n.textAlign=e.textAlign),Object.assign(n,{text:F(e.text,`element text`),fontFamily:F(e.fontFamily,`font family`,200),fontSize:P(e.fontSize,`font size`,1),fontWeight:e.fontWeight,color:we(e.color)})):e.type===`bitmap`?(n.dataUrl=F(e.dataUrl,`bitmap data URL`,15e6),e.ditherMethod&&(n.ditherMethod=F(e.ditherMethod,`dither method`,50)),e.contrast!==void 0&&(n.contrast=P(e.contrast,`contrast`,-100,100)),e.brightness!==void 0&&(n.brightness=P(e.brightness,`brightness`,-100,100)),e.threshold!==void 0&&(n.threshold=P(e.threshold,`threshold`,0,255)),e.invert!==void 0&&(n.invert=!!e.invert)):(n.strokeWidth=P(e.strokeWidth,`stroke width`,1),e.type===`line`?n.color=we(e.color):(n.fill=we(e.fill,!0),n.stroke=we(e.stroke))),n}),a=null;if(e.reference!=null){let t=e.reference;N(typeof t.src==`string`&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(t.src),`The reference must be an embedded PNG, JPEG or WebP image.`),a={src:t.src,fileName:F(t.fileName,`reference filename`,1e3),naturalWidth:P(t.naturalWidth,`reference width`,1),naturalHeight:P(t.naturalHeight,`reference height`,1)}}return{format:`lcd-mockup-studio`,version:1,name:F(e.name,`project name`,200),display:t,elements:i,reference:a,grid:{enabled:n.enabled,snap:n.snap,size:P(n.size,`grid size`,1,1024)}}}function Ee(e){N(new Blob([e]).size<=Ce,`Project exceeds the 32 MB limit.`);let t;try{t=JSON.parse(e)}catch{throw Error(`The project file contains invalid JSON.`)}return Te(t)}function De(e,t){return structuredClone({format:`lcd-mockup-studio`,version:1,name:t,display:e.display,elements:e.elements,grid:e.grid,reference:e.reference.src?e.reference:null})}var Oe=()=>({src:null,fileName:null,naturalWidth:0,naturalHeight:0});function ke(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(Error(`The reference image could not be saved.`)),r.readAsDataURL(e)})}function Ae(e){return e?new Promise((t,n)=>{let r=new Image;r.onload=()=>{r.naturalWidth!==e.naturalWidth||r.naturalHeight!==e.naturalHeight?n(Error(`Reference image dimensions do not match the project.`)):t()},r.onerror=()=>n(Error(`The embedded reference image is damaged.`)),r.src=e.src}):Promise.resolve()}function je({refreshReference:e,fitWorkspace:t,isAnalyzing:n}){let r=document.querySelector(`#new-project`),i=document.querySelector(`#open-project`),a=document.querySelector(`#save-project`),o=document.querySelector(`#project-file-input`),s=document.querySelector(`#project-title`),c=document.querySelector(`#project-status`),l=`Untitled Project`,d=!1,f=()=>JSON.stringify(De(u,l)),p=f();T();let m=()=>f()!==p,h=()=>{s.textContent=`${l}${m()?` *`:``}`};E(h);function g(e){d=e,r.disabled=i.disabled=a.disabled=e}function _(){return!n()||(window.alert(`Wait for image analysis or reference loading to finish.`),!1)}function v(){return!m()||window.confirm(`Replace the current project? Unsaved changes will be lost.`)}function y(n){let r=u.reference.src;Object.assign(u,{display:n.display,elements:n.elements,grid:n.grid,reference:n.reference??Oe(),selectedId:null,view:{scale:1}}),l=n.name||`Untitled Project`,p=f(),r?.startsWith(`blob:`)&&URL.revokeObjectURL(r),e(),T(),D(),requestAnimationFrame(t)}r.addEventListener(`click`,()=>{!d&&_()&&v()&&(y({name:`Untitled Project`,display:{width:800,height:480,background:`#18211b`},elements:[],reference:null,grid:{enabled:!0,snap:!0,size:10}}),c.textContent=`New project`)}),i.addEventListener(`click`,()=>{!d&&_()&&o.click()}),o.addEventListener(`change`,async()=>{let e=o.files?.[0];if(o.value=``,e&&!d&&_()){g(!0),c.textContent=`Opening project…`;try{if(e.size>33554432)throw Error(`Project exceeds the 32 MB limit.`);let t=Ee(await e.text());if(await Ae(t.reference),!_()||!v()){c.textContent=`Open cancelled`;return}y(t),c.textContent=`Project opened`}catch(e){c.textContent=`Could not open project`,window.alert(e.message)}finally{g(!1)}}});async function b(){if(d||!_())return;let e=window.prompt(`Project name`,l);if(e===null)return;let t=e.trim()||`Untitled Project`;if(t.length>200){window.alert(`Use a project name of at most 200 characters.`);return}let n=De(u,t),r=JSON.stringify(n);g(!0),c.textContent=`Preparing download…`;try{if(n.reference?.src.startsWith(`blob:`)){let e=await fetch(n.reference.src);if(!e.ok)throw Error(`The reference image could not be read.`);n.reference.src=await ke(await e.blob())}let e=new Blob([JSON.stringify(Te(n),null,2)],{type:`application/json`});if(e.size>33554432)throw Error(`Project exceeds the 32 MB limit.`);let i=URL.createObjectURL(e),a=document.createElement(`a`);a.href=i,a.download=`${t.replace(/[^\p{L}\p{N}._-]+/gu,`-`).replace(/^\.+/,``)||`project`}.lcd.json`,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e3),l=t,p=r,h(),c.textContent=`Project download started`}catch(e){c.textContent=`Could not save project`,window.alert(e.message)}finally{g(!1)}}a.addEventListener(`click`,b),window.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`s`&&(e.preventDefault(),b())}),window.addEventListener(`beforeunload`,e=>{m()&&(e.preventDefault(),e.returnValue=``)}),h()}var Me=16777216;function Ne(e,t){if(!Number.isInteger(e)||!Number.isInteger(t)||e<1||t<1||e>16384||t>16384||e*t>Me)throw Error(`Use whole-pixel dimensions up to 16,384 per side and 16 megapixels total for PNG export.`)}function Pe(e){return`${e.fontWeight||400} ${e.fontSize}px ${e.fontFamily||`monospace`}`}function Fe(e,t){let{x:n,y:r,width:i,height:a,fontSize:o}=t;e.beginPath(),e.rect(n,r,i,a),e.clip(),e.font=Pe(t),e.textAlign=`left`,e.textBaseline=`alphabetic`,e.fillStyle=t.color;let s=String(t.text??``).replace(/[\t\n\r\f ]+/g,` `).replace(/^ | $/g,``),c=e.measureText(s||`M`),l=c.fontBoundingBoxAscent??o*.8,u=c.fontBoundingBoxDescent??o*.2;e.fillText(s,n,r+a/2+(l-u)/2)}function Ie(e,t){let{x:n,y:r,width:i,height:a,strokeWidth:o}=t;if(t.type===`line`){e.fillStyle=t.color,e.fillRect(n,r+(a-o)/2,i,o);return}let s=t.type===`circle`,c=(t,n,r,i)=>{s?e.ellipse(t+r/2,n+i/2,r/2,i/2,0,0,Math.PI*2):e.rect(t,n,r,i)};if(t.fill!==`transparent`&&(e.fillStyle=t.fill,e.beginPath(),c(n,r,i,a),e.fill()),o>0){e.fillStyle=t.stroke,e.beginPath(),c(n,r,i,a);let s=i-o*2,l=a-o*2;s>0&&l>0&&(e.moveTo(n+o+s,r+a/2),c(n+o,r+o,s,l)),e.fill(`evenodd`)}}var Le=new Map;function Re(e,t){e&&t&&Le.set(e,t)}function ze(e,t){if(!t.dataUrl)return;let n=Le.get(t.dataUrl);if(n&&e.drawImage){e.drawImage(n,t.x,t.y,t.width,t.height);return}if(typeof Image<`u`){let n=new Image;n.src=t.dataUrl,n.complete&&n.naturalWidth>0&&e.drawImage&&e.drawImage(n,t.x,t.y,t.width,t.height)}}function Be(e,t){let{width:n,height:r,background:i}=e.display;Ne(n,r),t.width=n,t.height=r;let a=t.getContext(`2d`);if(!a)throw Error(`PNG export is not available in this browser.`);a.fillStyle=i,a.fillRect(0,0,n,r);for(let t of e.elements){a.save();try{if(t.type===`text`)Fe(a,t);else if([`rectangle`,`circle`,`line`].includes(t.type))Ie(a,t);else if(t.type===`bitmap`)ze(a,t);else throw Error(`Cannot export element type: ${t.type}`)}finally{a.restore()}}return t}async function Ve(e){let t=structuredClone({display:e.display,elements:e.elements});Ne(t.display.width,t.display.height),document.fonts&&await Promise.all(t.elements.filter(e=>e.type===`text`).map(e=>document.fonts.load(Pe(e),e.text||`M`)));let n=Be(t,document.createElement(`canvas`));return{blob:await new Promise((e,t)=>{n.toBlob(n=>{n?e(n):t(Error(`The browser could not generate the PNG. Try a smaller display size.`))},`image/png`)}),width:n.width,height:n.height}}function He(e){let t=document.querySelector(`#export-png`),n=document.querySelector(`#project-status`),r=!1;t.addEventListener(`click`,async()=>{if(!r){r=!0,t.disabled=!0,t.textContent=`Exporting…`,n.textContent=`Preparing PNG…`;try{let{blob:t,width:r,height:i}=await Ve(e),a=URL.createObjectURL(t),o=document.createElement(`a`);o.href=a,o.download=`lcd-mockup-${r}x${i}.png`,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(a),1e3),n.textContent=`PNG download started (${r} × ${i} px)`}catch(e){n.textContent=`PNG export failed: ${e.message}`}finally{r=!1,t.disabled=!1,t.textContent=`Export PNG`}}})}function I(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&apos;`)}function Ue(e,t){if(!Number.isInteger(e)||!Number.isInteger(t)||e<1||t<1||e>16384||t>16384||e*t>16777216)throw Error(`Use whole-pixel dimensions up to 16,384 per side and 16 megapixels total for SVG export.`)}function We(e){let{width:t,height:n,background:r}=e.display;Ue(t,n);let i=[],a=[];for(let t of e.elements)if(t.type===`text`){let e=`clip-${t.id}`;a.push(`    <clipPath id="${I(e)}"><rect x="${t.x}" y="${t.y}" width="${t.width}" height="${t.height}" /></clipPath>`);let n=String(t.text??``).replace(/[\t\n\r\f ]+/g,` `).replace(/^ | $/g,``),r=I(t.fontFamily||`monospace`),o=I(t.color||`#a8d9a8`),s=I(t.fontWeight||`400`),c=Number(t.fontSize)||12,l=t.y+t.height/2;i.push(`  <g clip-path="url(#${I(e)})">\n    <text x="${t.x}" y="${l}" dominant-baseline="central" fill="${o}" font-family="${r}" font-size="${c}px" font-weight="${s}" xml:space="preserve">${I(n)}</text>\n  </g>`)}else if(t.type===`rectangle`){let e=Number(t.strokeWidth)||0,n=I(t.stroke||`transparent`),r=I(t.fill||`transparent`);if(e>0&&t.stroke&&t.stroke!==`transparent`){let a=e/2,o=t.x+a,s=t.y+a,c=Math.max(0,t.width-e),l=Math.max(0,t.height-e);i.push(`  <rect x="${o}" y="${s}" width="${c}" height="${l}" fill="${r}" stroke="${n}" stroke-width="${e}" />`)}else i.push(`  <rect x="${t.x}" y="${t.y}" width="${t.width}" height="${t.height}" fill="${r}" />`)}else if(t.type===`circle`){let e=Number(t.strokeWidth)||0,n=I(t.stroke||`transparent`),r=I(t.fill||`transparent`),a=t.x+t.width/2,o=t.y+t.height/2,s=Math.max(0,t.width/2-e/2),c=Math.max(0,t.height/2-e/2);e>0&&t.stroke&&t.stroke!==`transparent`?i.push(`  <ellipse cx="${a}" cy="${o}" rx="${s}" ry="${c}" fill="${r}" stroke="${n}" stroke-width="${e}" />`):i.push(`  <ellipse cx="${a}" cy="${o}" rx="${t.width/2}" ry="${t.height/2}" fill="${r}" />`)}else if(t.type===`line`){let e=Number(t.strokeWidth)||1,n=I(t.color||`#a8d9a8`),r=t.y+(t.height-e)/2;i.push(`  <rect x="${t.x}" y="${r}" width="${t.width}" height="${e}" fill="${n}" />`)}else if(t.type===`bitmap`){let e=I(t.dataUrl||``);i.push(`  <image href="${e}" x="${t.x}" y="${t.y}" width="${t.width}" height="${t.height}" image-rendering="pixelated" />`)}else throw Error(`Cannot export element type to SVG: ${t.type}`);let o=a.length>0?`  <defs>\n${a.join(`
`)}\n  </defs>\n`:``;return`<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t} ${n}" width="${t}" height="${n}">\n`+o+`  <rect width="${t}" height="${n}" fill="${I(r)}" />\n`+i.join(`
`)+`
</svg>
`}function Ge(e){let t=structuredClone({display:e.display,elements:e.elements}),n=We(t);return{blob:new Blob([n],{type:`image/svg+xml;charset=utf-8`}),width:t.display.width,height:t.display.height,svgString:n}}function Ke(e){let t=document.querySelector(`#export-svg`),n=document.querySelector(`#project-status`);if(!t)return;let r=!1;t.addEventListener(`click`,()=>{if(!r){r=!0,t.disabled=!0,t.textContent=`Exporting…`,n&&(n.textContent=`Preparing SVG…`);try{let{blob:t,width:r,height:i}=Ge(e),a=URL.createObjectURL(t),o=document.createElement(`a`);o.href=a,o.download=`lcd-mockup-${r}x${i}.svg`,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(a),1e3),n&&(n.textContent=`SVG download started (${r} × ${i} px)`)}catch(e){n&&(n.textContent=`SVG export failed: ${e.message}`)}finally{r=!1,t.disabled=!1,t.textContent=`Export SVG`}}})}function qe(e,t={}){let{width:n,height:r,data:i}=e,a=t.threshold===void 0?128:t.threshold,o=!!t.invert,s=t.format||`adafruit`;function c(e,t){if(e>=n||t>=r)return!1;let s=(t*n+e)*4,c=i[s],l=i[s+1],u=i[s+2],d=.299*c+.587*l+.114*u>=a;return o?!d:d}let l=[],u=s===`xbm`||s===`arduino_sketch`;if(s===`u8g2`){let e=Math.ceil(r/8);for(let t=0;t<e;t++)for(let e=0;e<n;e++){let n=0;for(let r=0;r<8;r++){let i=t*8+r;c(e,i)&&(n|=1<<r)}l.push(n)}}else if(u){let e=Math.ceil(n/8);for(let t=0;t<r;t++)for(let r=0;r<e;r++){let e=0;for(let i=0;i<8;i++){let a=r*8+i;a<n&&c(a,t)&&(e|=1<<i)}l.push(e)}}else{let e=Math.ceil(n/8);for(let t=0;t<r;t++)for(let r=0;r<e;r++){let e=0;for(let i=0;i<8;i++){let a=r*8+i;a<n&&c(a,t)&&(e|=1<<7-i)}l.push(e)}}return new Uint8Array(l)}function Je(e={}){let{bitmapBytes:t,width:n,height:r,format:i=`adafruit`,variableName:a=`lcd_mockup_bitmap`,projectName:o=`LCD Mockup`}=e,s=a.replace(/[^a-zA-Z0-9_]/g,`_`)||`lcd_mockup_bitmap`,c=s.toUpperCase(),l=[];for(let e=0;e<t.length;e+=12){let n=Array.from(t.slice(e,e+12)).map(e=>`0x`+e.toString(16).padStart(2,`0`)).join(`, `);l.push(`  `+n+(e+12<t.length?`,`:``))}if(i===`micropython`)return`# =============================================================================
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

#endif // ${c}_H\n`}function Ye(e,t,n,r,i=`adafruit`){e.width=n,e.height=r;let a=e.getContext(`2d`);if(!a)return;let o=a.createImageData(n,r),s=o.data;function c(e,t,i){if(e>=n||t>=r)return;let a=(t*n+e)*4,o=i?255:20;s[a]=o,s[a+1]=i?255:25,s[a+2]=o,s[a+3]=255}if(i===`u8g2`){let e=Math.ceil(r/8),i=0;for(let r=0;r<e;r++)for(let e=0;e<n;e++){let n=t[i++]||0;for(let t=0;t<8;t++){let i=r*8+t;c(e,i,!!(n&1<<t))}}}else if(i===`xbm`){let e=Math.ceil(n/8),i=0;for(let a=0;a<r;a++)for(let r=0;r<e;r++){let e=t[i++]||0;for(let t=0;t<8;t++){let i=r*8+t;i<n&&c(i,a,!!(e&1<<t))}}}else{let e=Math.ceil(n/8),i=0;for(let a=0;a<r;a++)for(let r=0;r<e;r++){let e=t[i++]||0;for(let t=0;t<8;t++){let i=r*8+t;i<n&&c(i,a,!!(e&1<<7-t))}}}a.putImageData(o,0,0)}function Xe(e){let t=document.querySelector(`#export-c`),n=document.querySelector(`#c-export-modal`);if(!t||!n)return;let r=n.querySelector(`#c-export-close`),i=n.querySelector(`#c-export-format`),a=n.querySelector(`#c-export-threshold`),o=n.querySelector(`#c-export-threshold-val`),s=n.querySelector(`#c-export-invert`),c=n.querySelector(`#c-export-code`),l=n.querySelector(`#c-export-copy`),u=n.querySelector(`#c-export-download`),d=n.querySelector(`#c-export-preview`),f=n.querySelector(`#c-export-resolution`),p=``,m=null;function h(){let{width:t,height:n}=e.display,r=document.createElement(`canvas`);Be(structuredClone({display:e.display,elements:e.elements}),r);let h=r.getContext(`2d`);if(!h)return;let g=h.getImageData(0,0,t,n),_=i.value,v=Number(a.value),y=s.checked;o.textContent=String(v),f.textContent=`${t} × ${n} px`;let b=_===`arduino_sketch`?`xbm`:_===`micropython`?`adafruit`:_;m=qe(g,{threshold:v,invert:y,format:_}),Ye(d,m,t,n,b),p=Je({bitmapBytes:m,width:t,height:n,format:_,variableName:`lcd_mockup_bitmap`,projectName:`LCD Mockup`}),c.value=p,l&&(_===`arduino_sketch`?l.textContent=`📋 Copy Arduino Sketch`:_===`micropython`?l.textContent=`📋 Copy Python Code`:l.textContent=`📋 Copy C Code`),u&&(_===`arduino_sketch`?u.textContent=`⭳ Download .ino Sketch`:_===`micropython`?u.textContent=`⭳ Download .py Script`:_===`xbm`?u.textContent=`⭳ Download .xbm File`:u.textContent=`⭳ Download .h Header`)}function g(){h(),n.removeAttribute(`hidden`),n.hidden=!1,n.classList.add(`open`),n.style.display=`flex`}function _(){n.setAttribute(`hidden`,``),n.hidden=!0,n.classList.remove(`open`),n.style.display=`none`}_(),t.addEventListener(`click`,g),r?.addEventListener(`click`,_),n.addEventListener(`click`,e=>{e.target===n&&_()}),i?.addEventListener(`change`,h),a?.addEventListener(`input`,h),s?.addEventListener(`change`,h),l?.addEventListener(`click`,async()=>{if(p)try{await navigator.clipboard.writeText(p);let e=l.textContent;l.textContent=`✓ Copied to Clipboard!`,setTimeout(()=>{l.textContent=e},1500)}catch{c.select(),document.execCommand(`copy`)}}),u?.addEventListener(`click`,()=>{if(!p)return;let{width:t,height:n}=e.display,r=i.value,a=`h`;r===`arduino_sketch`?a=`ino`:r===`micropython`?a=`py`:r===`xbm`&&(a=`xbm`);let o=new Blob([p],{type:`text/plain;charset=utf-8`}),s=URL.createObjectURL(o),c=document.createElement(`a`);c.href=s,c.download=`lcd-mockup-${t}x${n}.${a}`,document.body.appendChild(c),c.click(),c.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&(n.classList.contains(`open`)||!n.hidden)&&_()})}function Ze(e,t){let n=Math.min(e,Math.max(20,u.display.width*.5)),r=Math.min(t,Math.max(10,u.display.height*.25));return{width:Math.round(n),height:Math.round(r)}}function Qe(e,t){return{x:Math.max(0,Math.round((u.display.width-e)/2)),y:Math.max(0,Math.round((u.display.height-t)/2))}}function $e(e){let t=null;if(e===`text`){let e=Ze(220,50),n=Qe(e.width,e.height),r=Math.max(8,Math.min(28,Math.round(u.display.height*.08)));t={id:j(),type:`text`,name:`Text`,x:n.x,y:n.y,width:e.width,height:e.height,text:`NEW TEXT`,fontSize:r,fontFamily:`Courier New`,fontWeight:700,color:`#a8d9a8`}}else if(e===`rectangle`){let e=Ze(180,100),n=Qe(e.width,e.height);t={id:j(),type:`rectangle`,name:`Rectangle`,x:n.x,y:n.y,width:e.width,height:e.height,fill:`#324638`,stroke:`#a8d9a8`,strokeWidth:2}}else if(e===`circle`){let e=Math.min(100,u.display.width*.25,u.display.height*.4),n=Math.max(20,Math.round(e)),r=Qe(n,n);t={id:j(),type:`circle`,name:`Circle`,x:r.x,y:r.y,width:n,height:n,fill:`transparent`,stroke:`#a8d9a8`,strokeWidth:2}}else if(e===`line`){let e=Ze(180,12),n=Qe(e.width,e.height);t={id:j(),type:`line`,name:`Line`,x:n.x,y:n.y,width:e.width,height:e.height,color:`#a8d9a8`,strokeWidth:2}}t&&te(t)}function et(e,t=!0){let n={...e,id:j(),type:e.type,name:e.name||e.type||`Element`,x:Math.round(e.x||0),y:Math.round(e.y||0),width:Math.max(1,Math.round(e.width||20)),height:Math.max(1,Math.round(e.height||10))};return te(n,t),n}function tt(e,t,n,r={}){let{snap:i=!1,snapSize:a=10,displayWidth:o=16384,displayHeight:s=16384,minWidth:c=4,minHeight:l=4}=r,u=n.x,d=n.y;i&&a>0?(u=Math.round(u/a)*a,d=Math.round(d/a)*a):(u=Math.round(u),d=Math.round(d));let{x:f,y:p,width:m,height:h}=t,g=t.x+t.width,_=t.y+t.height;if(e.includes(`e`)){let e=t.width+u;m=Math.max(c,Math.min(o-f,e))}else if(e.includes(`w`)){let e=t.x+u;e=Math.max(0,Math.min(g-c,e)),m=g-e,f=e}if(e.includes(`s`)){let e=t.height+d;h=Math.max(l,Math.min(s-p,e))}else if(e.includes(`n`)){let e=t.y+d;e=Math.max(0,Math.min(_-l,e)),h=_-e,p=e}return{x:Math.round(f),y:Math.round(p),width:Math.round(m),height:Math.round(h)}}var L=null,R=null,z=null;function nt(e){L=e,L.addEventListener(`pointerdown`,rt),L.addEventListener(`dblclick`,ot),window.addEventListener(`pointermove`,it),window.addEventListener(`pointerup`,at),window.addEventListener(`pointercancel`,at),window.addEventListener(`blur`,at),L.addEventListener(`pointerleave`,()=>{let e=document.querySelector(`#status-coords`);e&&!R&&!z&&(e.textContent=``)})}function rt(e){let t=e.target.closest(`.resize-handle`);if(t){let n=t.dataset.handle,r=t.dataset.elementId,i=u.elements.find(e=>e.id===r);if(!i)return;z={id:r,handle:n,startMouseX:e.clientX,startMouseY:e.clientY,startBox:{x:i.x,y:i.y,width:i.width,height:i.height}},e.preventDefault(),e.stopPropagation();return}let n=e.target.closest(`[data-element-id]`);if(!n){k(null);return}let r=n.dataset.elementId,i=u.elements.find(e=>e.id===r);i&&(k(r),R={id:r,startMouseX:e.clientX,startMouseY:e.clientY,startX:i.x,startY:i.y},e.preventDefault())}function it(e){let t=document.querySelector(`#status-coords`);if(t&&L){let n=L.getBoundingClientRect(),r=u.view.scale||1,i=Math.floor((e.clientX-n.left)/r),a=Math.floor((e.clientY-n.top)/r);i>=0&&i<u.display.width&&a>=0&&a<u.display.height?t.textContent=`X: ${i}  Y: ${a}`:!R&&!z&&(t.textContent=``)}if(z){let t=u.elements.find(e=>e.id===z.id);if(!t)return;let n=u.view.scale||1,r=(e.clientX-z.startMouseX)/n,i=(e.clientY-z.startMouseY)/n,a=tt(z.handle,z.startBox,{x:r,y:i},{snap:u.grid.snap,snapSize:u.grid.size,displayWidth:u.display.width,displayHeight:u.display.height,minWidth:t.type===`circle`?10:4,minHeight:t.type===`circle`?10:t.type===`line`?1:4});ae(t.id,a,!1),st();return}if(!R)return;let n=u.elements.find(e=>e.id===R.id);if(!n)return;let r=u.view.scale||1,i=(e.clientX-R.startMouseX)/r,a=(e.clientY-R.startMouseY)/r,o=R.startX+i,s=R.startY+a;if(u.grid.snap){let e=u.grid.size;o=Math.round(o/e)*e,s=Math.round(s/e)*e}o=Math.max(0,Math.min(u.display.width-n.width,o)),s=Math.max(0,Math.min(u.display.height-n.height,s)),ae(n.id,{x:Math.round(o),y:Math.round(s)},!1),st()}function at(){if(z){z=null,D();return}R&&(R=null,D())}function ot(e){let t=e.target.closest(`[data-element-id]`);if(!t)return;let n=t.dataset.elementId,r=u.elements.find(e=>e.id===n);if(!r||r.type!==`text`||t.querySelector(`.inline-text-editor`))return;let i=document.createElement(`input`);i.type=`text`,i.className=`inline-text-editor`,i.value=r.text||``,i.style.position=`absolute`,i.style.left=`0`,i.style.top=`0`,i.style.width=`100%`,i.style.height=`100%`,i.style.fontSize=`${r.fontSize}px`,i.style.fontFamily=r.fontFamily||`monospace`,i.style.fontWeight=String(r.fontWeight||`400`),i.style.color=r.color,i.style.background=`rgba(0, 0, 0, 0.85)`,i.style.border=`1px solid #8be28b`,i.style.outline=`none`,i.style.padding=`0 4px`,i.style.zIndex=`500`;function a(){if(i.parentNode){let e=i.value;i.remove(),ae(r.id,{text:e})}}i.addEventListener(`blur`,a),i.addEventListener(`keydown`,e=>{e.key===`Enter`?a():e.key===`Escape`&&i.remove(),e.stopPropagation()}),t.appendChild(i),i.focus(),i.select()}function st(){if(!L)return;let{width:e,height:t,background:n}=u.display,r=u.view.scale||1;L.style.width=`${e}px`,L.style.height=`${t}px`,L.style.backgroundColor=n,L.style.transform=`scale(${r})`,L.style.transformOrigin=`center center`,L.classList.toggle(`grid-enabled`,u.grid.enabled),L.style.setProperty(`--grid-size`,`${u.grid.size}px`),L.innerHTML=``;for(let e of u.elements)L.appendChild(ct(e));if(u.overlay?.enabled&&u.reference?.src){let e=document.createElement(`img`);e.className=`canvas-reference-overlay`,e.src=u.reference.src,e.alt=`Reference Overlay`,e.style.position=`absolute`,e.style.left=`0`,e.style.top=`0`,e.style.width=`100%`,e.style.height=`100%`,e.style.objectFit=`fill`,e.style.opacity=String(u.overlay.opacity??.4),e.style.pointerEvents=`none`,e.style.zIndex=`100`,L.appendChild(e)}}function ct(e){let t=document.createElement(`div`);return t.className=`canvas-element`,t.dataset.elementId=e.id,t.style.left=`${e.x}px`,t.style.top=`${e.y}px`,t.style.width=`${e.width}px`,t.style.height=`${e.height}px`,e.id===u.selectedId&&(t.classList.add(`selected`),mt(t,e)),e.type===`text`&&ut(t,e),e.type===`rectangle`&&dt(t,e),e.type===`circle`&&ft(t,e),e.type===`line`&&pt(t,e),e.type===`bitmap`&&lt(t,e),t}function lt(e,t){e.classList.add(`element-bitmap`);let n=e.querySelector(`img`);n||(n=document.createElement(`img`),n.className=`canvas-bitmap-img`,n.style.width=`100%`,n.style.height=`100%`,n.style.objectFit=`fill`,n.style.imageRendering=`pixelated`,n.style.pointerEvents=`none`,n.style.userSelect=`none`,n.draggable=!1,e.appendChild(n)),n.src=t.dataUrl||``}function ut(e,t){e.classList.add(`text-element`),e.textContent=t.text,e.style.color=t.color,e.style.fontSize=`${t.fontSize}px`,e.style.fontFamily=t.fontFamily,e.style.fontWeight=t.fontWeight,e.style.lineHeight=`1`}function dt(e,t){e.classList.add(`rectangle-element`),e.style.background=t.fill,e.style.border=`${t.strokeWidth}px solid ${t.stroke}`,e.style.boxSizing=`border-box`}function ft(e,t){e.classList.add(`circle-element`),e.style.background=t.fill,e.style.border=`${t.strokeWidth}px solid ${t.stroke}`,e.style.borderRadius=`50%`,e.style.boxSizing=`border-box`}function pt(e,t){e.classList.add(`line-element`);let n=document.createElement(`div`);n.style.width=`100%`,n.style.height=`${t.strokeWidth}px`,n.style.background=t.color,n.style.pointerEvents=`none`,e.appendChild(n)}function mt(e,t){let n=t.type===`line`?[`w`,`e`]:[`nw`,`n`,`ne`,`e`,`se`,`s`,`sw`,`w`];for(let r of n){let n=document.createElement(`div`);n.className=`resize-handle handle-${r}`,n.dataset.handle=r,n.dataset.elementId=t.id,e.appendChild(n)}}var ht=[`.ttf`,`.otf`,`.woff`,`.woff2`];function gt(e){return!e||typeof e!=`string`?`CustomFont`:e.replace(/\.[^/.]+$/,``).replace(/[^a-zA-Z0-9_\-\s]/g,``).trim().replace(/\s+/g,` `)||`CustomFont`}function _t(e){if(!e||!e.name)return!1;let t=e.name.toLowerCase();return ht.some(e=>t.endsWith(e))}async function vt(e){if(!_t(e))throw Error(`Unsupported font format. Please upload .ttf, .otf, .woff, or .woff2 files.`);let t=gt(e.name),n=await e.arrayBuffer();if(typeof FontFace>`u`)throw Error(`FontFace API is not supported in this environment.`);let r=new FontFace(t,n);return await r.load(),document?.fonts&&document.fonts.add(r),t}function yt(e,t){let n=u.display.width||320,r=u.display.height||240;return{x:Math.max(0,Math.round((n-e)/2)),y:Math.max(0,Math.round((r-t)/2))}}function bt(e={}){let t=Math.max(40,e.width||60),n=Math.max(20,e.height||28),r=yt(t,n),i=e.x===void 0?r.x:e.x,a=e.y===void 0?r.y:e.y,o=e.stroke||`#a8d9a8`,s=e.fill||`#a8d9a8`,c=e.level===void 0?3:e.level,l=t-6,u=[];u.push({id:j(),type:`rectangle`,name:`Battery Frame`,x:i,y:a,width:l,height:n,fill:`transparent`,stroke:o,strokeWidth:2});let d=Math.round(n*.45);u.push({id:j(),type:`rectangle`,name:`Battery Anode`,x:i+l,y:a+Math.round((n-d)/2),width:6,height:d,fill:s,stroke:o,strokeWidth:1});let f=l-8-4,p=Math.max(2,Math.floor(f/3)),m=n-8;for(let e=0;e<Math.min(3,Math.max(0,c));e++)u.push({id:j(),type:`rectangle`,name:`Battery Bar ${e+1}`,x:i+4+e*(p+2),y:a+4,width:p,height:m,fill:s,stroke:s,strokeWidth:1});return u}function xt(e={}){let t=Math.max(80,e.width||180),n=Math.max(16,e.height||26),r=Math.min(100,Math.max(0,e.percent===void 0?65:e.percent)),i=yt(t,n),a=e.x===void 0?i.x:e.x,o=e.y===void 0?i.y:e.y,s=e.stroke||`#a8d9a8`,c=e.fill||`#a8d9a8`,l=[];l.push({id:j(),type:`rectangle`,name:`Progress Frame`,x:a,y:o,width:t,height:n,fill:`transparent`,stroke:s,strokeWidth:2});let u=t-6,d=Math.max(1,Math.round(r/100*u));return l.push({id:j(),type:`rectangle`,name:`Progress Fill`,x:a+3,y:o+3,width:d,height:n-6,fill:c,stroke:c,strokeWidth:1}),l.push({id:j(),type:`text`,name:`Progress Label`,x:a+t+8,y:o+Math.round((n-18)/2),width:48,height:18,text:`${r}%`,fontSize:14,fontFamily:`Courier New`,fontWeight:700,color:s}),l}function St(e={}){let t=Math.max(60,e.width||100),n=Math.max(20,e.height||32),r=e.label||`READY`,i=yt(t,n),a=e.x===void 0?i.x:e.x,o=e.y===void 0?i.y:e.y,s=e.stroke||`#a8d9a8`,c=e.fill||`#25382b`,l=[];return l.push({id:j(),type:`rectangle`,name:`Badge Box`,x:a,y:o,width:t,height:n,fill:c,stroke:s,strokeWidth:2}),l.push({id:j(),type:`text`,name:`Badge Text`,x:a+4,y:o+Math.round((n-18)/2),width:t-8,height:18,text:r,fontSize:14,fontFamily:`Courier New`,fontWeight:700,color:s}),l}function Ct(e={}){let t=Math.max(100,e.width||140),n=Math.max(50,e.height||64),r=e.label||`TEMP`,i=e.value||`24.5`,a=e.unit||`°C`,o=yt(t,n),s=e.x===void 0?o.x:e.x,c=e.y===void 0?o.y:e.y,l=e.stroke||`#a8d9a8`,u=[];return u.push({id:j(),type:`rectangle`,name:`${r} Card`,x:s,y:c,width:t,height:n,fill:`transparent`,stroke:l,strokeWidth:1}),u.push({id:j(),type:`text`,name:`${r} Header`,x:s+6,y:c+4,width:t-12,height:16,text:r,fontSize:10,fontFamily:`Courier New`,fontWeight:600,color:l}),u.push({id:j(),type:`text`,name:`${r} Value`,x:s+6,y:c+24,width:t-42,height:32,text:i,fontSize:22,fontFamily:`Courier New`,fontWeight:700,color:l}),u.push({id:j(),type:`text`,name:`${r} Unit`,x:s+t-36,y:c+32,width:30,height:20,text:a,fontSize:12,fontFamily:`Courier New`,fontWeight:600,color:l}),u}function wt(e,t={}){let n=[];return e===`battery`?n=bt(t):e===`progress`?n=xt(t):e===`badge`?n=St(t):e===`gauge`&&(n=Ct(t)),n.length>0&&ne(n),n}var B=null;function Tt(e){return new Promise((t,n)=>{if(!e){n(Error(`No file selected.`));return}if(!e.type.startsWith(`image/`)){n(Error(`Please select an image file.`));return}B&&URL.revokeObjectURL(B),B=URL.createObjectURL(e);let r=new Image;r.onload=()=>{oe({src:B,fileName:e.name,naturalWidth:r.naturalWidth,naturalHeight:r.naturalHeight}),t({width:r.naturalWidth,height:r.naturalHeight,src:B})},r.onerror=()=>{n(Error(`Image could not be loaded.`))},r.src=B})}function Et(){let e=u.reference;e.src&&A({width:e.naturalWidth,height:e.naturalHeight})}function Dt(e,t=`sample.png`){return new Promise((n,r)=>{B&&=(URL.revokeObjectURL(B),null);let i=new Image;i.crossOrigin=`anonymous`,i.onload=()=>{oe({src:e,fileName:t,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight}),n({width:i.naturalWidth,height:i.naturalHeight,src:e})},i.onerror=()=>{r(Error(`Sample image could not be loaded.`))},i.src=e})}function Ot(){B&&=(URL.revokeObjectURL(B),null),oe({src:null,fileName:null,naturalWidth:0,naturalHeight:0})}var kt=[{id:`controller`,title:`🎛️ Industrial HMI`,subtitle:`128 × 64 Graphic LCD`,url:`./samples/controller.png`},{id:`marlin-3d`,title:`🖨️ 3D Printer (Marlin)`,subtitle:`128 × 64 Blue LCD`,url:`./samples/marlin-printer.png`},{id:`iot-weather`,title:`📟 IoT Weather Station`,subtitle:`128 × 64 ESP32 OLED`,url:`./samples/iot-station.png`}];function At(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>{t(r)},r.onerror=()=>{n(Error(`Reference image could not be read.`))},r.src=e})}function jt(e,t){let n=document.createElement(`canvas`);return n.width=e,n.height=t,n}function Mt(e){let t=e.length/4,n=new Uint8Array(t);for(let r=0;r<t;r+=1){let t=r*4,i=e[t],a=e[t+1],o=e[t+2];n[r]=Math.round(i*.299+a*.587+o*.114)}return n}function Nt(e){if(!e||e.length===0)return 127;let t=new Uint32Array(256);for(let n=0;n<e.length;n+=1)t[e[n]]+=1;let n=e.length,r=0;for(let e=0;e<256;e+=1)r+=e*t[e];let i=0,a=0,o=127,s=-1;for(let e=0;e<256;e+=1){if(i+=t[e],i===0)continue;let c=n-i;if(c===0)break;a+=e*t[e];let l=a/i-(r-a)/c,u=i*c*l*l;u>s&&(s=u,o=e)}return o}function Pt(e,t){let n=0,r=0;for(let i=0;i<e.length;i+=1)e[i]<=t?n+=1:r+=1;return n<=r?`dark-on-light`:`light-on-dark`}function Ft(e,t,n){let r=new Uint8Array(e.length),i=n===`dark-on-light`;for(let n=0;n<e.length;n+=1){let a=e[n];r[n]=+(i?a<=t:a>t)}return r}function It(e,t,n){if(!e||t<3||n<3)return e;let r=e.slice();for(let i=1;i<n-1;i+=1)for(let n=1;n<t-1;n+=1){let a=i*t+n;if(r[a]===0)continue;let o=0;for(let e=-1;e<=1;e+=1)for(let a=-1;a<=1;a+=1){if(a===0&&e===0)continue;let s=(i+e)*t+(n+a);o+=r[s]}o===0&&(e[a]=0)}return e}function Lt(e){let t=e.naturalWidth,n=e.naturalHeight;if(!Number.isFinite(t)||!Number.isFinite(n)||t<1||n<1)throw Error(`Reference image has invalid dimensions.`);let r=jt(t,n),i=r.getContext(`2d`,{willReadFrequently:!0});if(!i)throw Error(`Canvas image analysis is not available.`);i.imageSmoothingEnabled=!1,i.drawImage(e,0,0,t,n);let a=i.getImageData(0,0,t,n),o=Mt(a.data),s=Nt(o),c=Pt(o,s),l=Ft(o,s,c);return It(l,t,n),{width:t,height:n,canvas:r,imageData:a,grayscale:o,threshold:s,polarity:c,binaryMask:l}}function Rt(e,t){if(!e||!t)return{foreground:`#a8d9a8`,background:`#1d2720`};let{data:n}=e,r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0,d=t.length,f=Math.max(1,Math.floor(d/25e3));for(let e=0;e<d;e+=f){let d=e*4,f=n[d],p=n[d+1],m=n[d+2];t[e]===1?(r+=f,i+=p,a+=m,o++):(s+=f,c+=p,l+=m,u++)}function p(e,t,n){let r=e=>Math.max(0,Math.min(255,Math.round(e))),i=e=>r(e).toString(16).padStart(2,`0`);return`#${i(e)}${i(t)}${i(n)}`}return{foreground:o>0?p(r/o,i/o,a/o):`#a8d9a8`,background:u>0?p(s/u,c/u,l/u):`#1d2720`}}function zt(e,t,n,r,i=[],a=`#a8d9a8`){let o=[],s=new Set,c=Bt(e,t,n,r,s);for(let e of c)o.push(...e.elements);for(let r=0;r<e.length;r++){if(s.has(r))continue;let{x:c,y:l,width:u,height:d,area:f,density:p}=e[r];if(Qt(c,l,u,d,i))continue;if(Ht(t,n,c,l,u,d)){s.add(r);let e=Ut(t,n,c,l,u,d,a);o.push(...e);continue}let m=Wt(t,n,c,l,u,d,p);if(m){s.add(r),o.push(Gt(m,c,l,u,d,a));continue}if(Kt(t,n,c,l,u,d)){s.add(r),o.push(Zt(`🔒`,`Detected Lock Icon`,c,l,u,d,a));continue}if(qt(t,n,c,l,u,d)){s.add(r),o.push(Zt(`🔔`,`Detected Alarm Bell`,c,l,u,d,a));continue}if(Jt(t,n,c,l,u,d)){s.add(r),o.push(Zt(`💧`,`Detected Fluid Drop`,c,l,u,d,a));continue}if(Yt(t,n,c,l,u,d)){s.add(r),o.push(Zt(`ᛒ`,`Detected Bluetooth Icon`,c,l,u,d,a));continue}if(Xt(t,n,c,l,u,d)===`checked`){s.add(r),o.push(Zt(`☑`,`Detected Checked Box`,c,l,u,d,a));continue}}return{symbols:o,consumedIndices:s}}function Bt(e,t,n,r,i){let a=[],o=[];for(let t=0;t<e.length;t++){if(i.has(t))continue;let n=e[t];n.width>=1&&n.width<=8&&n.height>=4&&n.height<=40&&n.height>=n.width*1.2&&n.density>=.65&&o.push(t)}if(o.length<3)return a;o.sort((t,n)=>e[t].x-e[n].x);let s=[o[0]];for(let t=1;t<o.length;t++){let n=s[s.length-1],r=o[t],c=e[n],l=e[r],u=c.y+c.height,d=l.y+l.height,f=Math.abs(u-d)<=3,p=c.x+c.width,m=l.x-p,h=m>=1&&m<=7,g=l.height>=c.height-1;f&&h&&g?s.push(r):(s.length>=3&&s.length<=6&&a.push(Vt(s,e,i)),s=[r])}return s.length>=3&&s.length<=6&&a.push(Vt(s,e,i)),a}function Vt(e,t,n){let r=[],i=e.length;for(let a=0;a<i;a++){let o=e[a];n.add(o);let s=t[o];r.push({type:`rectangle`,name:`Detected Signal Bar ${a+1}/${i}`,x:s.x,y:s.y,width:Math.max(1,s.width),height:Math.max(1,s.height),fill:`#a8d9a8`,stroke:`#a8d9a8`,strokeWidth:1,source:`analysis`})}return{elements:r}}function Ht(e,t,n,r,i,a){let o=i/a;if(o<1.4||o>4.2||i<14||a<6||a>45)return!1;let s=Math.max(2,Math.round(i*.1)),c=n+i-s,l=r+Math.round(a*.25),u=r+Math.round(a*.75),d=0,f=0;for(let o=c;o<n+i;o++){for(let n=r;n<l;n++)e[n*t+o]===0&&d++;for(let n=u;n<r+a;n++)e[n*t+o]===0&&f++}return d>0&&f>0}function Ut(e,t,n,r,i,a,o){let s=[],c=Math.max(2,Math.round(i*.1)),l=i-c,u=Math.max(2,Math.round(a*.45)),d=r+Math.round((a-u)/2);s.push({type:`rectangle`,name:`Detected Battery Frame`,x:n,y:r,width:l,height:a,fill:`transparent`,stroke:o,strokeWidth:1,source:`analysis`}),s.push({type:`rectangle`,name:`Detected Battery Terminal`,x:n+l,y:d,width:c,height:u,fill:o,stroke:o,strokeWidth:1,source:`analysis`});let f=n+2,p=n+l-2,m=r+2,h=r+a-2,g=p-f,_=h-m;if(g>=4&&_>=2){let n=0,r=g*_;for(let r=m;r<=h;r++)for(let i=f;i<=p;i++)e[r*t+i]===1&&n++;let i=n/r;if(i>=.12){let e=Math.max(2,Math.round(g*Math.min(1,i*1.15))),t=Math.min(100,Math.round(i*100));s.push({type:`rectangle`,name:`Detected Battery Charge (${t}%)`,x:f,y:m,width:e,height:_,fill:o,stroke:o,strokeWidth:1,source:`analysis`})}}return s}function Wt(e,t,n,r,i,a,o){if(i<4||a<4||i>32||a>32||o<.3||o>.85)return null;let s=0,c=0,l=0;for(let o=r;o<r+a;o++)for(let a=n;a<n+i;a++)e[o*t+a]===1&&(s+=a-n,c+=o-r,l++);if(l===0)return null;let u=s/l,d=c/l,f=u/i,p=d/a,m=new Int32Array(i);for(let o=0;o<i;o++)for(let i=0;i<a;i++)e[(r+i)*t+(n+o)]===1&&m[o]++;let h=new Int32Array(a);for(let o=0;o<a;o++)for(let a=0;a<i;a++)e[(r+o)*t+(n+a)]===1&&h[o]++;let g=m[0]+(i>2?m[1]:0),_=m[i-1]+(i>2?m[i-2]:0),v=h[0]+(a>2?h[1]:0),y=h[a-1]+(a>2?h[a-2]:0);return f<.45&&g>_*1.8&&m[i-1]<=3?`right`:f>.55&&_>g*1.8&&m[0]<=3?`left`:p<.45&&v>y*1.8&&h[a-1]<=3?`down`:p>.55&&y>v*1.8&&h[0]<=3?`up`:null}function Gt(e,t,n,r,i,a){let o={right:`▶`,left:`◄`,up:`▲`,down:`▼`},s={right:`Detected Arrow (Right)`,left:`Detected Arrow (Left)`,up:`Detected Arrow (Up)`,down:`Detected Arrow (Down)`},c=o[e]||`▶`,l=s[e]||`Detected Arrow`,u=Math.max(8,Math.round(i*1.1));return{type:`text`,name:l,text:c,x:t,y:n,width:Math.max(1,r),height:Math.max(1,i),fontSize:u,fontFamily:`monospace`,fontWeight:400,textAlign:`left`,color:a,source:`analysis`}}function Kt(e,t,n,r,i,a){if(i<8||a<10||i>36||a>40)return!1;let o=i/a;if(o<.6||o>1.25)return!1;let s=Math.round(a*.4),c=a-s,l=n+Math.round(i/2),u=0;for(let n=r+2;n<r+s-1;n++)e[n*t+l]===0&&u++;let d=0;for(let o=r+s;o<r+a;o++)for(let r=n;r<n+i;r++)e[o*t+r]===1&&d++;let f=d/(i*c);return u>=2&&f>=.55}function qt(e,t,n,r,i,a){if(i<8||a<8||i>32||a>32)return!1;let o=i/a;if(o<.7||o>1.35)return!1;let s=0;for(let a=n;a<n+i;a++)e[r*t+a]===1&&s++;let c=0,l=r+Math.round(a*.8);for(let r=n;r<n+i;r++)e[l*t+r]===1&&c++;return c>=i*.75&&s<=i*.5}function Jt(e,t,n,r,i,a){if(i<6||a<8||i>28||a>36||a<=i*1.1)return!1;let o=0;for(let a=n;a<n+i;a++)e[r*t+a]===1&&o++;let s=r+Math.round(a*.7),c=0;for(let r=n;r<n+i;r++)e[s*t+r]===1&&c++;return o<=3&&c>=i*.7}function Yt(e,t,n,r,i,a){if(i<6||a<10||i>24||a>36)return!1;let o=i/a;if(o<.35||o>.75)return!1;let s=n+Math.round(i/2),c=0;for(let n=r;n<r+a;n++)(e[n*t+s]===1||e[n*t+s-1]===1)&&c++;return c>=a*.75}function Xt(e,t,n,r,i,a){if(i<8||a<8||i>24||a>24)return null;let o=i/a;if(o<.85||o>1.18)return null;let s=0;for(let o=n;o<n+i;o++)e[r*t+o]===1&&s++,e[(r+a-1)*t+o]===1&&s++;for(let o=r;o<r+a;o++)e[o*t+n]===1&&s++,e[o*t+(n+i-1)]===1&&s++;let c=(i+a)*2-4;if(s<c*.65)return null;let l=n+2,u=n+i-3,d=r+2,f=r+a-3,p=(u-l+1)*(f-d+1);if(p<=0)return null;let m=0;for(let n=d;n<=f;n++)for(let r=l;r<=u;r++)e[n*t+r]===1&&m++;let h=m/p;return m>=3&&h<=.65?`checked`:null}function Zt(e,t,n,r,i,a,o){let s=Math.max(8,Math.round(a*1.05));return{type:`text`,name:t,text:e,x:n,y:r,width:Math.max(1,i),height:Math.max(1,a),fontSize:s,fontFamily:`monospace`,fontWeight:400,textAlign:`left`,color:o,source:`analysis`}}function Qt(e,t,n,r,i){if(!i||i.length===0)return!1;for(let a of i){let i=(a.x||0)-2,o=i+(a.width||0)+4,s=(a.y||0)-2,c=s+(a.height||0)+4,l=e>=i&&e+n<=o,u=t>=s&&t+r<=c;if(l&&u&&n*r<a.width*a.height*.7)return!0}return!1}function $t(e,t,n,r=[],i={}){if(!e||t<1||n<1)return{lines:[],rectangles:[],circles:[],symbols:[],stats:{lines:0,rectangles:0,circles:0,symbols:0}};let{rectangles:a,remainingHLines:o,remainingVLines:s}=an(en(e,t,n),nn(e,t,n),t,n),c=dn([...o,...s],r),l=fn(a,r),{solidRectangles:u,circles:d,symbols:f}=sn(e,t,n,r,l,i),p=[...l,...u];return{lines:c,rectangles:p,circles:d,symbols:f,stats:{lines:c.length,rectangles:p.length,hollowFrames:l.length,solidBadges:u.length,circles:d.length,symbols:f.length}}}function en(e,t,n){let r=Math.max(8,Math.round(t*.08)),i=[];for(let a=0;a<n;a++){let n=-1;for(let o=0;o<=t;o++){let s=o<t&&e[a*t+o]===1;if(s&&n===-1&&(n=o),!s&&n!==-1){let e=o-n;e>=r&&i.push({x:n,y:a,width:e,height:1,orientation:`horizontal`}),n=-1}}}return tn(i)}function tn(e){if(e.length===0)return[];let t=[...e].sort((e,t)=>e.y===t.y?e.x-t.x:e.y-t.y),n=[];for(let e of t){let t=n[n.length-1];if(!t){n.push({...e});continue}let r=t.y+t.height,i=e.y-r<=1,a=Math.abs(e.x-t.x)<=4,o=Math.abs(e.width-t.width)<=6;if(i&&a&&o){let n=Math.min(t.x,e.x),i=Math.min(t.y,e.y),a=Math.max(t.x+t.width,e.x+e.width),o=Math.max(r,e.y+e.height);t.x=n,t.y=i,t.width=a-n,t.height=o-i}else n.push({...e})}return n.filter(e=>e.height<=8)}function nn(e,t,n){let r=Math.max(8,Math.round(n*.08)),i=[];for(let a=0;a<t;a++){let o=-1;for(let s=0;s<=n;s++){let c=s<n&&e[s*t+a]===1;if(c&&o===-1&&(o=s),!c&&o!==-1){let e=s-o;e>=r&&i.push({x:a,y:o,width:1,height:e,orientation:`vertical`}),o=-1}}}return rn(i)}function rn(e){if(e.length===0)return[];let t=[...e].sort((e,t)=>e.x===t.x?e.y-t.y:e.x-t.x),n=[];for(let e of t){let t=n[n.length-1];if(!t){n.push({...e});continue}let r=t.x+t.width,i=e.x-r<=1,a=Math.abs(e.y-t.y)<=4,o=Math.abs(e.height-t.height)<=6;if(i&&a&&o){let n=Math.min(t.x,e.x),i=Math.min(t.y,e.y),a=Math.max(r,e.x+e.width),o=Math.max(t.y+t.height,e.y+e.height);t.x=n,t.y=i,t.width=a-n,t.height=o-i}else n.push({...e})}return n.filter(e=>e.width<=8)}function an(e,t,n,r){let i=[],a=new Set,o=new Set;for(let s=0;s<e.length;s++){let c=e[s];if(!a.has(s))for(let l=0;l<e.length;l++){if(s===l||a.has(l))continue;let u=e[l];if(u.y<=c.y+10)continue;let d=Math.abs(c.x-u.x)<=6,f=Math.abs(c.width-u.width)<=6;if(!d||!f)continue;let p=Math.min(c.x,u.x),m=Math.max(c.x+c.width,u.x+u.width),h=c.y,g=u.y+u.height,_=-1,v=-1;for(let e=0;e<t.length;e++){if(o.has(e))continue;let n=t[e],r=Math.abs(n.x-p)<=6,i=Math.abs(n.x+n.width-m)<=6,a=Math.abs(n.y-h)<=6&&Math.abs(n.y+n.height-g)<=6;r&&a&&(_=e),i&&a&&(v=e)}if(_!==-1&&v!==-1){a.add(s),a.add(l),o.add(_),o.add(v);let e=Math.min(p,t[_].x),d=Math.min(h,t[_].y),f=Math.max(m,t[v].x+t[v].width)-e,y=Math.max(g,t[_].y+t[_].height)-d,b=Math.max(1,Math.round((c.height+u.height+t[_].width+t[v].width)/4));i.push({x:Math.max(0,e),y:Math.max(0,d),width:Math.min(n-e,f),height:Math.min(r-d,y),strokeWidth:Math.min(8,b),filled:!1,name:`Detected Frame`});break}}}return{rectangles:i,remainingHLines:e.filter((e,t)=>!a.has(t)),remainingVLines:t.filter((e,t)=>!o.has(t))}}function on(e,t,n){let r=new Uint8Array(t*n),i=[],a=[-1,0,1,-1,1,-1,0,1],o=[-1,-1,-1,0,0,1,1,1],s=new Int32Array(t*n);for(let c=0;c<n;c++)for(let l=0;l<t;l++){let u=c*t+l;if(e[u]!==1||r[u]===1)continue;r[u]=1;let d=0,f=0;s[f++]=u;let p=l,m=l,h=c,g=c,_=0;for(;d<f;){let i=s[d++],c=Math.floor(i/t),l=i%t;_++,l<p&&(p=l),l>m&&(m=l),c<h&&(h=c),c>g&&(g=c);for(let i=0;i<8;i++){let u=l+a[i],d=c+o[i];if(u>=0&&u<t&&d>=0&&d<n){let n=d*t+u;e[n]===1&&r[n]===0&&(r[n]=1,s[f++]=n)}}}let v=m-p+1,y=g-h+1,b=v*y,x=_/b;i.push({x:p,y:h,width:v,height:y,area:_,density:x})}return i}function sn(e,t,n,r,i,a={}){let o=on(e,t,n),s=[],c=[],{symbols:l,consumedIndices:u}=zt(o,e,t,n,r,a.color||`#a8d9a8`);for(let a=0;a<o.length;a++){if(u.has(a))continue;let{x:l,y:d,width:f,height:p,area:m,density:h}=o[a];if(f<4&&p<4||ln(l,d,f,p,i)||un(l,d,f,p,r))continue;let g=f/p;if(g>=.72&&g<=1.38&&f>=4&&p>=4&&f<=Math.min(t,n)*.4&&cn(e,t,l,d,f,p)>=3){if(h>=.52){c.push({x:l,y:d,width:f,height:p,fill:`solid`,strokeWidth:1,name:`Detected Indicator Dot`});continue}if(h>=.2&&h<.52){c.push({x:l,y:d,width:f,height:p,fill:`transparent`,strokeWidth:1,name:`Detected Ring Gauge`});continue}}if(f>=8&&p>=4&&h>=.78){let e=f/p>=3.2,n=f>=t*.6&&p>=8&&p<=24,r=`Detected Solid Badge`;e&&(r=`Detected Progress Bar`),n&&(r=`Detected Header Bar`),s.push({x:l,y:d,width:f,height:p,filled:!0,strokeWidth:1,name:r})}}return{solidRectangles:s,circles:c,symbols:l}}function cn(e,t,n,r,i,a){let o=0,s=(n,r)=>n<0||r<0?1:+(e[r*t+n]===0);return o+=s(n,r),o+=s(n+i-1,r),o+=s(n,r+a-1),o+=s(n+i-1,r+a-1),o}function ln(e,t,n,r,i){for(let a of i)if(Math.abs(a.x-e)<=4&&Math.abs(a.y-t)<=4&&Math.abs(a.width-n)<=6&&Math.abs(a.height-r)<=6)return!0;return!1}function un(e,t,n,r,i){if(!i||i.length===0)return!1;for(let a of i){let i=(a.x||0)-3,o=i+(a.width||0)+6,s=(a.y||0)-3,c=s+(a.height||0)+6,l=e>=i&&e+n<=o,u=t>=s&&t+r<=c;if(l&&u&&n*r<a.width*a.height*.75)return!0}return!1}function dn(e,t){return!t||t.length===0?e:e.filter(e=>{for(let n of t){let t=(n.x||0)-2,r=t+(n.width||0)+4,i=(n.y||0)-2,a=i+(n.height||0)+4,o=e.x+e.width,s=e.y+e.height,c=e.x>=t&&o<=r,l=e.y>=i&&s<=a;if(c&&l&&(e.width<100||e.height<100))return!1}return!0})}function fn(e,t){return e.filter(e=>e.width>=14&&e.height>=10)}function pn(e,t=`#a8d9a8`){let n=e.orientation===`horizontal`||e.width>=e.height,r=Math.max(1,n?e.height:e.width);return{type:`line`,name:e.name||(n?`Detected Horizontal Line`:`Detected Vertical Line`),x:Math.max(0,Math.round(e.x)),y:Math.max(0,Math.round(e.y)),width:Math.max(1,Math.round(e.width)),height:Math.max(n?3:1,Math.round(e.height)),color:t,strokeWidth:r,source:`analysis`}}function mn(e,t=`#a8d9a8`){let n=!!e.filled;return{type:`rectangle`,name:e.name||(n?`Detected Solid Badge`:`Detected Frame`),x:Math.max(0,Math.round(e.x)),y:Math.max(0,Math.round(e.y)),width:Math.max(1,Math.round(e.width)),height:Math.max(1,Math.round(e.height)),fill:n?t:`transparent`,stroke:t,strokeWidth:Math.max(1,Math.round(e.strokeWidth||1)),source:`analysis`}}function hn(e,t=`#a8d9a8`){let n=e.fill!==`transparent`;return{type:`circle`,name:e.name||(n?`Detected Indicator Dot`:`Detected Ring Gauge`),x:Math.max(0,Math.round(e.x)),y:Math.max(0,Math.round(e.y)),width:Math.max(2,Math.round(e.width)),height:Math.max(2,Math.round(e.height)),fill:n?t:`transparent`,stroke:t,strokeWidth:Math.max(1,Math.round(e.strokeWidth||1)),source:`analysis`}}var gn=a(((e,t)=>{var n=function(e){var t=Object.prototype,n=t.hasOwnProperty,r=Object.defineProperty||function(e,t,n){e[t]=n.value},i,a=typeof Symbol==`function`?Symbol:{},o=a.iterator||`@@iterator`,s=a.asyncIterator||`@@asyncIterator`,c=a.toStringTag||`@@toStringTag`;function l(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{l({},``)}catch{l=function(e,t,n){return e[t]=n}}function u(e,t,n,i){var a=t&&t.prototype instanceof _?t:_,o=Object.create(a.prototype);return r(o,`_invoke`,{value:ee(e,n,new k(i||[]))}),o}e.wrap=u;function d(e,t,n){try{return{type:`normal`,arg:e.call(t,n)}}catch(e){return{type:`throw`,arg:e}}}var f=`suspendedStart`,p=`suspendedYield`,m=`executing`,h=`completed`,g={};function _(){}function v(){}function y(){}var b={};l(b,o,function(){return this});var x=Object.getPrototypeOf,S=x&&x(x(te([])));S&&S!==t&&n.call(S,o)&&(b=S);var C=y.prototype=_.prototype=Object.create(b);v.prototype=y,r(C,`constructor`,{value:y,configurable:!0}),r(y,`constructor`,{value:v,configurable:!0}),v.displayName=l(y,c,`GeneratorFunction`);function w(e){[`next`,`throw`,`return`].forEach(function(t){l(e,t,function(e){return this._invoke(t,e)})})}e.isGeneratorFunction=function(e){var t=typeof e==`function`&&e.constructor;return t?t===v||(t.displayName||t.name)===`GeneratorFunction`:!1},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,y):(e.__proto__=y,l(e,c,`GeneratorFunction`)),e.prototype=Object.create(C),e},e.awrap=function(e){return{__await:e}};function T(e,t){function i(r,a,o,s){var c=d(e[r],e,a);if(c.type===`throw`)s(c.arg);else{var l=c.arg,u=l.value;return u&&typeof u==`object`&&n.call(u,`__await`)?t.resolve(u.__await).then(function(e){i(`next`,e,o,s)},function(e){i(`throw`,e,o,s)}):t.resolve(u).then(function(e){l.value=e,o(l)},function(e){return i(`throw`,e,o,s)})}}var a;function o(e,n){function r(){return new t(function(t,r){i(e,n,t,r)})}return a=a?a.then(r,r):r()}r(this,`_invoke`,{value:o})}w(T.prototype),l(T.prototype,s,function(){return this}),e.AsyncIterator=T,e.async=function(t,n,r,i,a){a===void 0&&(a=Promise);var o=new T(u(t,n,r,i),a);return e.isGeneratorFunction(n)?o:o.next().then(function(e){return e.done?e.value:o.next()})};function ee(e,t,n){var r=f;return function(i,a){if(r===m)throw Error(`Generator is already running`);if(r===h){if(i===`throw`)throw a;return ne()}for(n.method=i,n.arg=a;;){var o=n.delegate;if(o){var s=E(o,n);if(s){if(s===g)continue;return s}}if(n.method===`next`)n.sent=n._sent=n.arg;else if(n.method===`throw`){if(r===f)throw r=h,n.arg;n.dispatchException(n.arg)}else n.method===`return`&&n.abrupt(`return`,n.arg);r=m;var c=d(e,t,n);if(c.type===`normal`){if(r=n.done?h:p,c.arg===g)continue;return{value:c.arg,done:n.done}}c.type===`throw`&&(r=h,n.method=`throw`,n.arg=c.arg)}}}function E(e,t){var n=t.method,r=e.iterator[n];if(r===i)return t.delegate=null,n===`throw`&&e.iterator.return&&(t.method=`return`,t.arg=i,E(e,t),t.method===`throw`)||n!==`return`&&(t.method=`throw`,t.arg=TypeError(`The iterator does not provide a '`+n+`' method`)),g;var a=d(r,e.iterator,t.arg);if(a.type===`throw`)return t.method=`throw`,t.arg=a.arg,t.delegate=null,g;var o=a.arg;if(!o)return t.method=`throw`,t.arg=TypeError(`iterator result is not an object`),t.delegate=null,g;if(o.done)t[e.resultName]=o.value,t.next=e.nextLoc,t.method!==`return`&&(t.method=`next`,t.arg=i);else return o;return t.delegate=null,g}w(C),l(C,c,`Generator`),l(C,o,function(){return this}),l(C,`toString`,function(){return`[object Generator]`});function D(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function O(e){var t=e.completion||{};t.type=`normal`,delete t.arg,e.completion=t}function k(e){this.tryEntries=[{tryLoc:`root`}],e.forEach(D,this),this.reset(!0)}e.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}};function te(e){if(e){var t=e[o];if(t)return t.call(e);if(typeof e.next==`function`)return e;if(!isNaN(e.length)){var r=-1,a=function t(){for(;++r<e.length;)if(n.call(e,r))return t.value=e[r],t.done=!1,t;return t.value=i,t.done=!0,t};return a.next=a}}return{next:ne}}e.values=te;function ne(){return{value:i,done:!0}}return k.prototype={constructor:k,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=i,this.done=!1,this.delegate=null,this.method=`next`,this.arg=i,this.tryEntries.forEach(O),!e)for(var t in this)t.charAt(0)===`t`&&n.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=i)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if(e.type===`throw`)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function r(n,r){return s.type=`throw`,s.arg=e,t.next=n,r&&(t.method=`next`,t.arg=i),!!r}for(var a=this.tryEntries.length-1;a>=0;--a){var o=this.tryEntries[a],s=o.completion;if(o.tryLoc===`root`)return r(`end`);if(o.tryLoc<=this.prev){var c=n.call(o,`catchLoc`),l=n.call(o,`finallyLoc`);if(c&&l){if(this.prev<o.catchLoc)return r(o.catchLoc,!0);if(this.prev<o.finallyLoc)return r(o.finallyLoc)}else if(c){if(this.prev<o.catchLoc)return r(o.catchLoc,!0)}else if(l){if(this.prev<o.finallyLoc)return r(o.finallyLoc)}else throw Error(`try statement without catch or finally`)}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r];if(i.tryLoc<=this.prev&&n.call(i,`finallyLoc`)&&this.prev<i.finallyLoc){var a=i;break}}a&&(e===`break`||e===`continue`)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var o=a?a.completion:{};return o.type=e,o.arg=t,a?(this.method=`next`,this.next=a.finallyLoc,g):this.complete(o)},complete:function(e,t){if(e.type===`throw`)throw e.arg;return e.type===`break`||e.type===`continue`?this.next=e.arg:e.type===`return`?(this.rval=this.arg=e.arg,this.method=`return`,this.next=`end`):e.type===`normal`&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),O(n),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if(r.type===`throw`){var i=r.arg;O(n)}return i}}throw Error(`illegal catch attempt`)},delegateYield:function(e,t,n){return this.delegate={iterator:te(e),resultName:t,nextLoc:n},this.method===`next`&&(this.arg=i),g}},e}(typeof t==`object`?t.exports:{});try{regeneratorRuntime=n}catch{typeof globalThis==`object`?globalThis.regeneratorRuntime=n:Function(`r`,`regeneratorRuntime = r`)(n)}})),_n=a(((e,t)=>{t.exports=(e,t)=>`${e}-${t}-${Math.random().toString(16).slice(3,8)}`})),vn=a(((e,t)=>{var n=_n(),r=0;t.exports=({id:e,action:t,payload:i={}})=>{let a=e;return a===void 0&&(a=n(`Job`,r),r+=1),{id:a,action:t,payload:i}}})),yn=a((e=>{var t=!1;e.logging=t,e.setLogging=e=>{t=e},e.log=(...n)=>t?console.log.apply(e,n):null})),bn=a(((e,t)=>{var n=vn(),{log:r}=yn(),i=_n(),a=0;t.exports=()=>{let t=i(`Scheduler`,a),o={},s={},c=[];a+=1;let l=()=>c.length,u=()=>Object.keys(o).length,d=()=>{if(c.length!==0){let e=Object.keys(o);for(let t=0;t<e.length;t+=1)if(s[e[t]]===void 0){c[0](o[e[t]]);break}}},f=(i,a)=>new Promise((o,l)=>{let u=n({action:i,payload:a});c.push(async t=>{c.shift(),s[t.id]=u;try{o(await t[i].apply(e,[...a,u.id]))}catch(e){l(e)}finally{delete s[t.id],d()}}),r(`[${t}]: Add ${u.id} to JobQueue`),r(`[${t}]: JobQueue length=${c.length}`),d()});return{addWorker:e=>(o[e.id]=e,r(`[${t}]: Add ${e.id}`),r(`[${t}]: Number of workers=${u()}`),d(),e.id),addJob:async(e,...n)=>{if(u()===0)throw Error(`[${t}]: You need to have at least one worker before adding jobs`);return f(e,n)},terminate:async()=>{Object.keys(o).forEach(async e=>{await o[e].terminate()}),c=[]},getQueueLen:l,getNumWorkers:u}}})),xn=a(((e,t)=>{t.exports=e=>{let t={};return typeof WorkerGlobalScope<`u`?t.type=`webworker`:typeof document==`object`?t.type=`browser`:typeof process==`object`&&typeof l==`function`&&(t.type=`node`),e===void 0?t:t[e]}})),Sn=a(((e,t)=>{var n=xn()(`type`)===`browser`?e=>new URL(e,window.location.href).href:e=>e;t.exports=e=>{let t={...e};return[`corePath`,`workerPath`,`langPath`].forEach(r=>{e[r]&&(t[r]=n(t[r]))}),t}})),Cn=a(((e,t)=>{t.exports={TESSERACT_ONLY:0,LSTM_ONLY:1,TESSERACT_LSTM_COMBINED:2,DEFAULT:3}})),wn=o({author:()=>``,browser:()=>Pn,bugs:()=>Vn,collective:()=>Un,contributors:()=>Fn,default:()=>Wn,dependencies:()=>Rn,description:()=>Dn,devDependencies:()=>Ln,homepage:()=>Hn,jsdelivr:()=>Mn,license:()=>In,main:()=>On,name:()=>Tn,overrides:()=>zn,repository:()=>Bn,scripts:()=>Nn,type:()=>kn,types:()=>An,unpkg:()=>jn,version:()=>En}),Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,Rn,zn,Bn,Vn,Hn,Un,Wn,Gn=i((()=>{Tn=`tesseract.js`,En=`7.0.0`,Dn=`Pure Javascript Multilingual OCR`,On=`src/index.js`,kn=`commonjs`,An=`src/index.d.ts`,jn=`dist/tesseract.min.js`,Mn=`dist/tesseract.min.js`,Nn={start:`node scripts/server.js`,build:`rimraf dist && webpack --config scripts/webpack.config.prod.js && rollup -c scripts/rollup.esm.mjs`,"profile:tesseract":`webpack-bundle-analyzer dist/tesseract-stats.json`,"profile:worker":`webpack-bundle-analyzer dist/worker-stats.json`,prepublishOnly:`npm run build`,wait:`rimraf dist && wait-on http://localhost:3000/dist/tesseract.min.js`,test:`npm-run-all -p -r start test:all`,"test:all":`npm-run-all wait test:browser test:node:all`,"test:browser":`karma start karma.conf.js`,"test:node":`nyc mocha --exit --bail --require ./scripts/test-helper.mjs`,"test:node:all":`npm run test:node -- ./tests/*.test.mjs`,lint:`eslint src`,"lint:fix":`eslint --fix src`,postinstall:`opencollective-postinstall || true`},Pn={"./src/worker/node/index.js":`./src/worker/browser/index.js`},Fn=[`jeromewu`],In=`Apache-2.0`,Ln={"@babel/core":`^7.21.4`,"@babel/eslint-parser":`^7.21.3`,"@babel/preset-env":`^7.21.4`,"@rollup/plugin-commonjs":`^24.1.0`,acorn:`^8.8.2`,"babel-loader":`^9.1.2`,buffer:`^6.0.3`,cors:`^2.8.5`,eslint:`^7.32.0`,"eslint-config-airbnb-base":`^14.2.1`,"eslint-plugin-import":`^2.27.5`,"expect.js":`^0.3.1`,express:`^4.18.2`,mocha:`^10.2.0`,"npm-run-all":`^4.1.5`,karma:`^6.4.2`,"karma-chrome-launcher":`^3.2.0`,"karma-firefox-launcher":`^2.1.2`,"karma-mocha":`^2.0.1`,"karma-webpack":`^5.0.0`,nyc:`^15.1.0`,rimraf:`^5.0.0`,rollup:`^3.20.7`,"wait-on":`^7.0.1`,webpack:`^5.79.0`,"webpack-bundle-analyzer":`^4.8.0`,"webpack-cli":`^5.0.1`,"webpack-dev-middleware":`^6.0.2`,"rollup-plugin-sourcemaps":`^0.6.3`},Rn={"bmp-js":`^0.1.0`,"idb-keyval":`^6.2.0`,"is-url":`^1.2.4`,"node-fetch":`^2.6.9`,"opencollective-postinstall":`^2.0.3`,"regenerator-runtime":`^0.13.3`,"tesseract.js-core":`^7.0.0`,"wasm-feature-detect":`^1.8.0`,zlibjs:`^0.3.1`},zn={"@rollup/pluginutils":`^5.0.2`},Bn={type:`git`,url:`https://github.com/naptha/tesseract.js.git`},Vn={url:`https://github.com/naptha/tesseract.js/issues`},Hn=`https://github.com/naptha/tesseract.js`,Un={type:`opencollective`,url:`https://opencollective.com/tesseractjs`},Wn={name:Tn,version:En,description:Dn,main:On,type:kn,types:An,unpkg:jn,jsdelivr:Mn,scripts:Nn,browser:Pn,author:``,contributors:Fn,license:In,devDependencies:Ln,dependencies:Rn,overrides:zn,repository:Bn,bugs:Vn,homepage:Hn,collective:Un}})),Kn=a(((e,t)=>{t.exports={workerBlobURL:!0,logger:()=>{}}})),qn=a(((e,t)=>{var n=(Gn(),c(wn).default).version;t.exports={...Kn(),workerPath:`https://cdn.jsdelivr.net/npm/tesseract.js@v${n}/dist/worker.min.js`}})),Jn=a(((e,t)=>{t.exports=({workerPath:e,workerBlobURL:t})=>{let n;if(Blob&&URL&&t){let t=new Blob([`importScripts("${e}");`],{type:`application/javascript`});n=new Worker(URL.createObjectURL(t))}else n=new Worker(e);return n}})),Yn=a(((e,t)=>{t.exports=e=>{e.terminate()}})),Xn=a(((e,t)=>{t.exports=(e,t)=>{e.onmessage=({data:e})=>{t(e)}}})),Zn=a(((e,t)=>{t.exports=async(e,t)=>{e.postMessage(t)}})),Qn=a(((e,t)=>{var n=e=>new Promise((t,n)=>{let r=new FileReader;r.onload=()=>{t(r.result)},r.onerror=({target:{error:{code:e}}})=>{n(Error(`File could not be read! Code=${e}`))},r.readAsArrayBuffer(e)}),r=async e=>{let t=e;return e===void 0?`undefined`:(typeof e==`string`?t=/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(e)?atob(e.split(`,`)[1]).split(``).map(e=>e.charCodeAt(0)):await(await fetch(e)).arrayBuffer():typeof HTMLElement<`u`&&e instanceof HTMLElement?(e.tagName===`IMG`&&(t=await r(e.src)),e.tagName===`VIDEO`&&(t=await r(e.poster)),e.tagName===`CANVAS`&&await new Promise(r=>{e.toBlob(async e=>{t=await n(e),r()})})):typeof OffscreenCanvas<`u`&&e instanceof OffscreenCanvas?t=await n(await e.convertToBlob()):(e instanceof File||e instanceof Blob)&&(t=await n(e)),new Uint8Array(t))};t.exports=r})),$n=a(((e,t)=>{t.exports={defaultOptions:qn(),spawnWorker:Jn(),terminateWorker:Yn(),onMessage:Xn(),send:Zn(),loadImage:Qn()}})),er=a(((e,t)=>{var n=Sn(),r=vn(),{log:i}=yn(),a=_n(),o=Cn(),{defaultOptions:s,spawnWorker:c,terminateWorker:l,onMessage:u,loadImage:d,send:f}=$n(),p=0;t.exports=async(e=`eng`,t=o.LSTM_ONLY,m={},h={})=>{let g=a(`Worker`,p),{logger:_,errorHandler:v,...y}=n({...s,...m}),b={},x=typeof e==`string`?e.split(`+`):e,S=t,C=h,w=[o.DEFAULT,o.LSTM_ONLY].includes(t)&&!y.legacyCore,T,ee,E=new Promise((e,t)=>{ee=e,T=t}),D=e=>{T(e.message)},O=c(y);O.onerror=D,p+=1;let k=({id:e,action:t,payload:n})=>new Promise((r,a)=>{i(`[${g}]: Start ${e}, action=${t}`);let o=`${t}-${e}`;b[o]={resolve:r,reject:a},f(O,{workerId:g,jobId:e,action:t,payload:n})}),te=()=>console.warn("`load` is depreciated and should be removed from code (workers now come pre-loaded)"),ne=e=>k(r({id:e,action:`load`,payload:{options:{lstmOnly:w,corePath:y.corePath,logging:y.logging}}})),re=(e,t,n)=>k(r({id:n,action:`FS`,payload:{method:`writeFile`,args:[e,t]}})),ie=(e,t)=>k(r({id:t,action:`FS`,payload:{method:`readFile`,args:[e,{encoding:`utf8`}]}})),ae=(e,t)=>k(r({id:t,action:`FS`,payload:{method:`unlink`,args:[e]}})),A=(e,t,n)=>k(r({id:n,action:`FS`,payload:{method:e,args:t}})),oe=(e,t)=>k(r({id:t,action:`loadLanguage`,payload:{langs:e,options:{langPath:y.langPath,dataPath:y.dataPath,cachePath:y.cachePath,cacheMethod:y.cacheMethod,gzip:y.gzip,lstmOnly:[o.DEFAULT,o.LSTM_ONLY].includes(S)&&!y.legacyLang}}})),se=(e,t,n,i)=>k(r({id:i,action:`initialize`,payload:{langs:e,oem:t,config:n}})),ce=(e=`eng`,t,n,r)=>{if(w&&[o.TESSERACT_ONLY,o.TESSERACT_LSTM_COMBINED].includes(t))throw Error(`Legacy model requested but code missing.`);let i=t||S;S=i;let a=n||C;C=a;let s=(typeof e==`string`?e.split(`+`):e).filter(e=>!x.includes(e));return x.push(...s),s.length>0?oe(s,r).then(()=>se(e,i,a,r)):se(e,i,a,r)},le=(e={},t)=>k(r({id:t,action:`setParameters`,payload:{params:e}})),j=async(e,t={},n={text:!0},i)=>k(r({id:i,action:`recognize`,payload:{image:await d(e),options:t,output:n}})),M=async(e,t)=>{if(w)throw Error("`worker.detect` requires Legacy model, which was not loaded.");return k(r({id:t,action:`detect`,payload:{image:await d(e)}}))},ue=async()=>(O!==null&&(l(O),O=null),Promise.resolve());u(O,({workerId:e,jobId:t,status:n,action:r,data:a})=>{let o=`${r}-${t}`;if(n===`resolve`)i(`[${e}]: Complete ${t}`),b[o].resolve({jobId:t,data:a}),delete b[o];else if(n===`reject`){if(b[o].reject(a),delete b[o],r===`load`&&T(a),v)v(a);else throw Error(a)}else n===`progress`&&_({...a,userJobId:t})});let de={id:g,worker:O,load:te,writeText:re,readText:ie,removeFile:ae,FS:A,reinitialize:ce,setParameters:le,recognize:j,detect:M,terminate:ue};return ne().then(()=>oe(e)).then(()=>se(e,t,h)).then(()=>ee(de)).catch(()=>{}),E}})),tr=a(((e,t)=>{var n=er();t.exports={recognize:async(e,t,r)=>{let i=await n(t,1,r);return i.recognize(e).finally(async()=>{await i.terminate()})},detect:async(e,t)=>{let r=await n(`osd`,0,t);return r.detect(e).finally(async()=>{await r.terminate()})}}})),nr=a(((e,t)=>{t.exports={AFR:`afr`,AMH:`amh`,ARA:`ara`,ASM:`asm`,AZE:`aze`,AZE_CYRL:`aze_cyrl`,BEL:`bel`,BEN:`ben`,BOD:`bod`,BOS:`bos`,BUL:`bul`,CAT:`cat`,CEB:`ceb`,CES:`ces`,CHI_SIM:`chi_sim`,CHI_TRA:`chi_tra`,CHR:`chr`,CYM:`cym`,DAN:`dan`,DEU:`deu`,DZO:`dzo`,ELL:`ell`,ENG:`eng`,ENM:`enm`,EPO:`epo`,EST:`est`,EUS:`eus`,FAS:`fas`,FIN:`fin`,FRA:`fra`,FRK:`frk`,FRM:`frm`,GLE:`gle`,GLG:`glg`,GRC:`grc`,GUJ:`guj`,HAT:`hat`,HEB:`heb`,HIN:`hin`,HRV:`hrv`,HUN:`hun`,IKU:`iku`,IND:`ind`,ISL:`isl`,ITA:`ita`,ITA_OLD:`ita_old`,JAV:`jav`,JPN:`jpn`,KAN:`kan`,KAT:`kat`,KAT_OLD:`kat_old`,KAZ:`kaz`,KHM:`khm`,KIR:`kir`,KOR:`kor`,KUR:`kur`,LAO:`lao`,LAT:`lat`,LAV:`lav`,LIT:`lit`,MAL:`mal`,MAR:`mar`,MKD:`mkd`,MLT:`mlt`,MSA:`msa`,MYA:`mya`,NEP:`nep`,NLD:`nld`,NOR:`nor`,ORI:`ori`,PAN:`pan`,POL:`pol`,POR:`por`,PUS:`pus`,RON:`ron`,RUS:`rus`,SAN:`san`,SIN:`sin`,SLK:`slk`,SLV:`slv`,SPA:`spa`,SPA_OLD:`spa_old`,SQI:`sqi`,SRP:`srp`,SRP_LATN:`srp_latn`,SWA:`swa`,SWE:`swe`,SYR:`syr`,TAM:`tam`,TEL:`tel`,TGK:`tgk`,TGL:`tgl`,THA:`tha`,TIR:`tir`,TUR:`tur`,UIG:`uig`,UKR:`ukr`,URD:`urd`,UZB:`uzb`,UZB_CYRL:`uzb_cyrl`,VIE:`vie`,YID:`yid`}})),rr=a(((e,t)=>{t.exports={OSD_ONLY:`0`,AUTO_OSD:`1`,AUTO_ONLY:`2`,AUTO:`3`,SINGLE_COLUMN:`4`,SINGLE_BLOCK_VERT_TEXT:`5`,SINGLE_BLOCK:`6`,SINGLE_LINE:`7`,SINGLE_WORD:`8`,CIRCLE_WORD:`9`,SINGLE_CHAR:`10`,SPARSE_TEXT:`11`,SPARSE_TEXT_OSD:`12`,RAW_LINE:`13`}})),ir=a(((e,t)=>{gn();var n=bn(),r=er(),i=tr(),a=nr(),o=Cn(),s=rr(),{setLogging:c}=yn();t.exports={languages:a,OEM:o,PSM:s,createScheduler:n,createWorker:r,setLogging:c,...i}}))();function ar(e,t){let n=Math.max(e,t);return n<=320?6:n<=640?4:n<=1200?2:1}function or(e,t){return Math.max(8,Math.min(24,Math.round(Math.min(e,t)*.12)))}function sr({image:e,width:t,height:n,scale:r,padding:i,threshold:a,polarity:o}){let s=cr(a),c=lr({threshold:a,polarity:o,amount:s,mode:`thin`}),l=lr({threshold:a,polarity:o,amount:s,mode:`thick`});return[{name:`normal`,canvas:ur({image:e,width:t,height:n,scale:r,padding:i,threshold:a,polarity:o,morphology:`none`})},{name:`thin`,canvas:ur({image:e,width:t,height:n,scale:r,padding:i,threshold:c,polarity:o,morphology:`none`})},{name:`thick`,canvas:ur({image:e,width:t,height:n,scale:r,padding:i,threshold:l,polarity:o,morphology:`none`})},{name:`recovery`,canvas:ur({image:e,width:t,height:n,scale:r,padding:i,threshold:a,polarity:o,morphology:`dilate`})}]}function cr(e){let t=Math.min(e,255-e);return Math.max(8,Math.min(18,Math.round(t*.14)))}function lr({threshold:e,polarity:t,amount:n,mode:r}){let i=t===`dark-on-light`,a=0;return r===`thin`&&(a=i?-n:n),r===`thick`&&(a=i?n:-n),fr(e+a,1,254)}function ur({image:e,width:t,height:n,scale:r,padding:i,threshold:a,polarity:o,morphology:s=`none`}){let c=i*r,l=t*r,u=n*r,d=jt(l+c*2,u+c*2),f=d.getContext(`2d`,{willReadFrequently:!0});if(!f)throw Error(`OCR preprocessing canvas is not available.`);f.fillStyle=`#ffffff`,f.fillRect(0,0,d.width,d.height),f.imageSmoothingEnabled=!1,f.drawImage(e,c,c,l,u);let p=f.getImageData(c,c,l,u),m=p.data,h=o===`dark-on-light`,g=new Uint8Array(l*u);for(let e=0;e<g.length;e+=1){let t=e*4,n=Math.round(m[t]*.299+m[t+1]*.587+m[t+2]*.114);g[e]=+(h?n<=a:n>a)}let _=s===`dilate`?dr(g,l,u):g;for(let e=0;e<_.length;e+=1){let t=e*4,n=_[e]===1?0:255;m[t]=n,m[t+1]=n,m[t+2]=n,m[t+3]=255}return f.putImageData(p,c,c),d}function dr(e,t,n){let r=e.slice();for(let i=1;i<n-1;i+=1)for(let n=1;n<t-1;n+=1){let a=i*t+n;if(e[a]===1)continue;let o=e[a-1],s=e[a+1],c=e[a-t],l=e[a+t];(o===1||s===1||c===1||l===1)&&(r[a]=1)}return r}function fr(e,t,n){return Math.min(n,Math.max(t,e))}var pr=15;function mr(e,{scale:t,padding:n,originalWidth:r,originalHeight:i,variant:a,pass:o}){if(!Array.isArray(e)||e.length===0)return[];if(!Number.isFinite(t)||t<=0)throw Error(`OCR extraction requires a valid scale.`);if(!Number.isFinite(r)||!Number.isFinite(i)||r<1||i<1)throw Error(`OCR extraction requires valid original image dimensions.`);let s=(Number.isFinite(n)?Math.max(0,n):0)*t,c=[];for(let n of e){let e=n?.paragraphs??[];for(let n of e){let e=n?.lines??[];for(let n of e){let e=n?.words??[];for(let n of e){let e=hr({word:n,scale:t,scaledPadding:s,originalWidth:r,originalHeight:i,variant:a,pass:o});e&&c.push(e)}}}}return c}function hr({word:e,scale:t,scaledPadding:n,originalWidth:r,originalHeight:i,variant:a,pass:o}){let s=yr(e?.text??``);if(!s)return null;let c=Number(e?.confidence??0);if(!Number.isFinite(c)||c<pr)return null;let l=e?.bbox;if(!gr(l))return null;let u=_r({bbox:l,scale:t,scaledPadding:n,originalWidth:r,originalHeight:i});return!u||vr(u,r,i)?null:{text:s,confidence:c,x:u.x,y:u.y,width:u.width,height:u.height,variant:String(a??`unknown`),pass:String(o??`unknown`)}}function gr(e){if(!e)return!1;let t=[Number(e.x0),Number(e.y0),Number(e.x1),Number(e.y1)];if(!t.every(Number.isFinite))return!1;let[n,r,i,a]=t;return i>n&&a>r}function _r({bbox:e,scale:t,scaledPadding:n,originalWidth:r,originalHeight:i}){let a=Number(e.x0),o=Number(e.y0),s=Number(e.x1),c=Number(e.y1),l=(a-n)/t,u=(o-n)/t,d=(s-n)/t,f=(c-n)/t;if(d<=0||f<=0||l>=r||u>=i)return null;let p=V(l,0,r),m=V(u,0,i),h=V(d,0,r),g=V(f,0,i),_=V(Math.floor(p),0,r-1),v=V(Math.floor(m),0,i-1),y=V(Math.ceil(h),_+1,r),b=V(Math.ceil(g),v+1,i);return{x:_,y:v,width:Math.max(1,y-_),height:Math.max(1,b-v)}}function vr(e,t,n){let r=e.width/t,i=e.height/n;return r>.98&&i>.5}function yr(e){let t=String(e??``).normalize(`NFKC`).replace(/\s+/g,` `).trim();return t=t.replace(/(\d{1,2})\s*:\s*(\d{2})/g,`$1:$2`),t=t.replace(/(\d{1,2}:\d{2})\s*:\s*(\d{2})/g,`$1:$2`),t=t.replace(/(\d+)\s*\.\s*(\d+)/g,`$1.$2`),t=t.replace(/(\d)\.([Oo])\b/g,`$1.0`),t=t.replace(/\b([Oo])\.(\d)/g,`0.$2`),t=t.replace(/\b(\d+)[Oo]+(\d*)\b/g,(e,t,n)=>t+`0`.repeat(e.length-t.length-n.length)+n),t=t.replace(/(\d+)[Ss]\.(\d+)/g,`$15.$2`),t=t.replace(/(\d+)\.([Ss])(\d*)/g,`$1.5$3`),t=t.replace(/\b([Ss])\.(\d+)/g,`5.$2`),t=t.replace(/\b(\d+)[Ss]\b/g,`$15`),t=t.replace(/\b[lI|](\d{2,})\b/g,`1$1`),t=t.replace(/(\d+)\s*%/g,`$1%`),t=t.replace(/(\d+)\s*[*o°]\s*([CFcf])\b/g,`$1 °$2`),t=t.replace(/(\d+(?:\.\d+)?)\s*(V|mV|mA|uA|A|W|kW|Hz|kHz|MHz|RPM|rpm|PSI|psi|bar|BAR|km\/h|mph|ms|us|dB)\b/g,`$1 $2`),t=t.replace(/^>+$|^->+$|^>>+$|^»+$|^I>+$/g,`▶`),t=t.replace(/^<+$|^<-+$|^<<+$|^«+$|^<I+$/g,`◄`),t=t.replace(/^\^+$|^\/\^\\+$/g,`▲`),t=t.replace(/^\[=\]$|^\[--\]$|^\[III\]$|^CIIID$/g,`🔋`),t=t.replace(/^\|{3,5}$|^[ıI]{3,5}$/g,`📶`),t=t.replace(/^\[[xX]\]$/g,`☑`),t=t.replace(/^\[\s*\]$/g,`☐`),t=t.replace(/^\([oO*]\)$/g,`🔘`),t=t.replace(/^\(\s*\)$/g,`⚪`),t=t.replace(/^[~^`'",._-]+|[~^`'",._-]+$/g,``).trim(),t}function br(e){return String(e??``).replace(/\r/g,``).replace(/[ \t]+\n/g,`
`).replace(/\n{3,}/g,`

`).trim()}function xr(e,t){let n=e.y+e.height/2,r=t.y+t.height/2;return Math.abs(n-r)>3?n-r:e.x-t.x}function V(e,t,n){return Math.min(n,Math.max(t,e))}var Sr=.76,Cr=.88;function wr(e){if(!Array.isArray(e)||e.length===0)return{clusters:[],words:[]};let t=Er(e.filter(Tr)),n=Rr(t.map(jr).filter(Boolean));return n.sort(xr),{clusters:t,words:n}}function Tr(e){return!(!e||!Br(e.text)||!Number.isFinite(e.x)||!Number.isFinite(e.y)||!Number.isFinite(e.width)||!Number.isFinite(e.height)||e.width<=0||e.height<=0)}function Er(e){let t=[...e].sort((e,t)=>{let n=H(t)-H(e);return Math.abs(n)>.001?n:xr(e,t)}),n=[];for(let e of t){let t=null,r=-1/0;for(let i of n){let n=kr(e,i);n.matches&&n.score>r&&(r=n.score,t=i)}if(!t){n.push(Dr(e));continue}Or(t,e)}return n.sort((e,t)=>xr(e,t))}function Dr(e){return{x:e.x,y:e.y,width:e.width,height:e.height,candidates:[e]}}function Or(e,t){e.candidates.push(t);let n=e.candidates;e.x=qr(n.map(e=>e.x)),e.y=qr(n.map(e=>e.y)),e.width=qr(n.map(e=>e.width)),e.height=qr(n.map(e=>e.height))}function kr(e,t){let n=-1/0,r=[{x:t.x,y:t.y,width:t.width,height:t.height},...t.candidates];for(let t of r){let r=Ar(e,t);r.sameToken&&(n=Math.max(n,r.score))}return{matches:Number.isFinite(n),score:n}}function Ar(e,t){let n=Wr(e,t);if(n<=0)return{sameToken:!1,score:0};let r=e.width*e.height,i=t.width*t.height,a=Math.max(1,Math.min(r,i)),o=Math.max(1,r+i-n),s=n/a,c=n/o,l=Gr(e),u=Kr(e),d=Gr(t),f=Kr(t),p=Math.abs(l-d),m=Math.abs(u-f),h=Math.max(1,Math.min(e.width,t.width)),g=Math.max(e.width,t.width),_=Math.max(1,Math.min(e.height,t.height)),v=Math.max(e.height,t.height),y=h/Math.max(1,g),b=_/Math.max(1,v),x=m<=Math.max(2,v*.38),S=p<=Math.max(3,h*.45);return{sameToken:x&&b>=.55&&(c>=.5||s>=.84&&S&&y>=.34),score:c*6+s*3+b+y*.5-m/Math.max(1,v),iou:c,coverage:s}}function jr(e){if(!e||e.candidates.length===0)return null;let t=Mr(e.candidates);if(t.length===0)return null;let n=null,r=-1/0;for(let e of t){let t=Nr(e);t>r&&(r=t,n=e)}if(!n)return null;let i=Fr(n);return i?{...i,support:n.candidates.length,sourceSupport:zr(n.candidates),fusionScore:Jr(r)}:null}function Mr(e){let t=[...e].sort((e,t)=>H(t)-H(e)),n=[];for(let e of t){let t=U(e.text);if(!t)continue;let r=null,i=0;for(let e of n){let n=Hr(t,e.normalized);n>=Sr&&n>i&&(r=e,i=n)}if(!r){n.push({normalized:t,candidates:[e]});continue}r.candidates.push(e);let a=Ir(r.candidates);r.normalized=U(a.text)}return n}function Nr(e){let t=e.candidates;if(t.length===0)return-1/0;let n=Ir(t),r=H(n),i=zr(t),a=new Set(t.map(e=>e.variant)),o=new Set(t.map(e=>e.pass));return r+=Math.min(24,i*5),r+=Math.min(12,a.size*3),r+=Math.min(4,o.size*2),r+=Pr(t),Vr(n.text)&&(r+=4),Lr(n)&&(i<=1?r-=24:i===2&&(r-=10)),r}function Pr(e){let t=new Map;for(let n of e){let e=U(n.text);t.set(e,(t.get(e)??0)+1)}let n=0;for(let e of t.values())n=Math.max(n,e);return Math.min(12,Math.max(0,n-1)*3)}function Fr(e){let t=null,n=-1/0;for(let r of e.candidates){let i=H(r);for(let t of e.candidates)t!==r&&Hr(U(r.text),U(t.text))>=Cr&&(i+=2);i>n&&(n=i,t=r)}return t}function Ir(e){let t=e[0],n=H(t);for(let r=1;r<e.length;r+=1){let i=e[r],a=H(i);a>n&&(t=i,n=a)}return t}function H(e){let t=Br(e.text);if(!t)return-1/0;let n=Number(e.confidence)||0,r=(t.match(/[\p{L}\p{N}]/gu)??[]).length,i=(t.match(/[.:,;%°/+\-]/gu)??[]).length,a=(t.match(/[^\p{L}\p{N}\s.,:;%°/+\-()[\]]/gu)??[]).length;return n+=Math.min(8,r*.8),n+=Math.min(8,i*2),n-=a*5,t.length===1&&r===1&&(n-=8),r===0&&i===0&&(n-=16),e.variant===`normal`&&(n+=3),e.variant===`thin`&&(n+=1),e.variant===`recovery`&&(n-=2),e.pass===`sparse`&&(n+=2),n}function Lr(e){let t=Br(e.text);if(!t)return!0;let n=(t.match(/[\p{L}\p{N}]/gu)??[]).length,r=(t.match(/[.:,;%°/+\-]/gu)??[]).length;return t.length===1&&n===1&&r===0||t.length<=2&&n===0}function Rr(e){let t=[...e].sort((e,t)=>(t.fusionScore??0)-(e.fusionScore??0)),n=[];for(let e of t){let t=!1;for(let r of n){let n=Ar(e,r);if(n.sameToken){if(Hr(U(e.text),U(r.text))>=.7){t=!0;break}if(n.iou>=.68||n.coverage>=.92){t=!0;break}}}t||n.push(e)}return n}function zr(e){let t=new Set;for(let n of e)t.add(`${n.variant}:${n.pass}`);return t.size}function Br(e){return String(e??``).normalize(`NFKC`).replace(/\s+/g,` `).trim()}function U(e){return Br(e).replace(/\s+/g,``).toLocaleLowerCase()}function Vr(e){return/[.:,;%°/+\-]/u.test(String(e??``))}function Hr(e,t){if(e===t)return 1;if(!e||!t)return 0;let n=Ur(e,t),r=Math.max(e.length,t.length);return r===0?1:Math.max(0,1-n/r)}function Ur(e,t){let n=t.length+1,r=Array(n),i=Array(n);for(let e=0;e<n;e+=1)r[e]=e;for(let n=1;n<=e.length;n+=1){i[0]=n;for(let a=1;a<=t.length;a+=1){let o=e[n-1]===t[a-1]?0:1;i[a]=Math.min(i[a-1]+1,r[a]+1,r[a-1]+o)}let a=r;r=i,i=a}return r[t.length]}function Wr(e,t){let n=Math.max(e.x,t.x),r=Math.max(e.y,t.y),i=Math.min(e.x+e.width,t.x+t.width),a=Math.min(e.y+e.height,t.y+t.height);return Math.max(0,i-n)*Math.max(0,a-r)}function Gr(e){return e.x+e.width/2}function Kr(e){return e.y+e.height/2}function qr(e){if(!Array.isArray(e)||e.length===0)return 0;let t=[...e].sort((e,t)=>e-t),n=Math.floor(t.length/2);return t.length%2==1?t[n]:(t[n-1]+t[n])/2}function Jr(e){return Math.round(e*10)/10}function Yr(e){if(!Array.isArray(e)||e.length===0)return[];let t=e.filter(Xr).sort(xr);if(t.length===0)return[];let n=Zr(t),r=[];for(let e of n){let t=$r(e.words);if(t.length===0)continue;t.sort((e,t)=>e.x-t.x);let n=null;for(let e of t){if(!n){n=ti(e);continue}let t=ii(n,e),i=n.x+n.width,a=e.x-i;if(ai(n,e)&&a<=t){ni(n,e);continue}r.push(oi(n)),n=ti(e)}n&&r.push(oi(n))}return r.filter(si).sort(gi)}function Xr(e){if(!e||!G(e.text))return!1;let t=Number(e.x),n=Number(e.y),r=Number(e.width),i=Number(e.height);return!(!Number.isFinite(t)||!Number.isFinite(n)||!Number.isFinite(r)||!Number.isFinite(i)||r<=0||i<=0)}function Zr(e){let t=[];for(let n of e){let e=W(n),r=null,i=1/0;for(let a of t){let t=Math.abs(e-a.centerY);t<=Math.max(2,Math.min(n.height,a.averageHeight)*.65)&&t<i&&(i=t,r=a)}if(!r){t.push({centerY:e,averageHeight:n.height,words:[n]});continue}r.words.push(n),Qr(r)}return t.sort((e,t)=>e.centerY-t.centerY),t}function Qr(e){if(!e||e.words.length===0)return;let t=0,n=0;for(let r of e.words)t+=W(r),n+=r.height;e.centerY=t/e.words.length,e.averageHeight=n/e.words.length}function $r(e){if(e.length<=1)return[...e];let t=[...e].sort((e,t)=>{let n=ui(t)-ui(e);return Math.abs(n)>.001?n:t.width-e.width}),n=[];for(let e of t){let t=!1;for(let r of n)if(ei(e,r)){t=!0;break}t||n.push(e)}return n.sort((e,t)=>e.x-t.x)}function ei(e,t){let n=pi(e,t);if(n.area<=0)return!1;let r=Math.max(1,e.width*e.height),i=Math.max(1,t.width*t.height),a=Math.min(r,i),o=n.area/a,s=r+i-n.area,c=n.area/Math.max(1,s),l=Math.min(e.height,t.height)/Math.max(1,Math.max(e.height,t.height));if(!(Math.abs(W(e)-W(t))<=Math.max(2,Math.max(e.height,t.height)*.35))||l<.55)return!1;if(di(mi(e.text),mi(t.text))>=.72&&(c>=.42||o>=.78))return!0;let u=li(e),d=li(t);return!!(o>=.88&&(u&&ui(e)<ui(t)||d&&ui(t)<ui(e)))}function ti(e){return{text:G(e.text),x:e.x,y:e.y,width:e.width,height:e.height,confidence:Number(e.confidence)||0,fusionScore:Number(e.fusionScore)||0,support:Number(e.support)||1,sourceSupport:Number(e.sourceSupport)||1,wordCount:1,words:[e]}}function ni(e,t){let n=e.x+e.width,r=e.y+e.height,i=t.x+t.width,a=t.y+t.height,o=ri(e,t,t.x-n);e.text=`${e.text}${o}${G(t.text)}`;let s=Math.min(e.x,t.x),c=Math.min(e.y,t.y),l=Math.max(n,i),u=Math.max(r,a);e.x=s,e.y=c,e.width=l-s,e.height=u-c;let d=e.wordCount;e.wordCount+=1,e.confidence=(e.confidence*d+(Number(t.confidence)||0))/e.wordCount,e.fusionScore=Math.max(e.fusionScore,Number(t.fusionScore)||0),e.support=Math.max(e.support,Number(t.support)||1),e.sourceSupport=Math.max(e.sourceSupport,Number(t.sourceSupport)||1),e.words.push(t)}function ri(e,t,n){let r=e.text,i=G(t.text);return!r||!i||n<=0||/^[.,:;%°)\]]/u.test(i)||/[(\[]$/u.test(r)?``:` `}function ii(e,t){let n=Math.max(1,Math.min(e.height,t.height));return Math.max(2,Math.min(10,n*.9))}function ai(e,t){let n=Math.abs(W(e)-W(t)),r=Math.max(1,Math.min(e.height,t.height)),i=Math.max(e.height,t.height);return r/Math.max(1,i)>=.5&&n<=Math.max(2,i*.5)}function oi(e){return{text:hi(e.text),x:_i(e.x),y:_i(e.y),width:Math.max(1,_i(e.width)),height:Math.max(1,_i(e.height)),confidence:vi(e.confidence),fusionScore:vi(e.fusionScore),support:e.support,sourceSupport:e.sourceSupport,wordCount:e.wordCount}}function si(e){return!e||!e.text||e.width<=0||e.height<=0?!1:/[\p{L}\p{N}.:,;%°/+\-]/u.test(e.text)}function ci(e){if(!Array.isArray(e)||e.length===0)return``;let t=[...e].filter(si).sort(gi);if(t.length===0)return``;let n=[];for(let e of t){let t=W(e),r=null,i=1/0;for(let a of n){let n=Math.abs(t-a.centerY);n<=Math.max(2,Math.min(e.height,a.averageHeight)*.65)&&n<i&&(r=a,i=n)}if(!r){n.push({centerY:t,averageHeight:e.height,regions:[e]});continue}r.regions.push(e);let a=0,o=0;for(let e of r.regions)a+=W(e),o+=e.height;r.centerY=a/r.regions.length,r.averageHeight=o/r.regions.length}return n.sort((e,t)=>e.centerY-t.centerY),n.map(e=>(e.regions.sort((e,t)=>e.x-t.x),e.regions.map(e=>e.text).join(` `).trim())).filter(Boolean).join(`
`)}function li(e){let t=G(e.text);if(!t)return!0;let n=(t.match(/[\p{L}\p{N}]/gu)??[]).length,r=(t.match(/[.:,;%°/+\-]/gu)??[]).length;return t.length===1&&n===1&&r===0||t.length<=2&&n===0}function ui(e){return Number.isFinite(e.fusionScore)?e.fusionScore:Number.isFinite(e.confidence)?e.confidence:0}function di(e,t){if(e===t)return 1;if(!e||!t)return 0;let n=fi(e,t),r=Math.max(e.length,t.length);return r===0?1:Math.max(0,1-n/r)}function fi(e,t){let n=t.length+1,r=Array(n),i=Array(n);for(let e=0;e<n;e+=1)r[e]=e;for(let n=1;n<=e.length;n+=1){i[0]=n;for(let a=1;a<=t.length;a+=1){let o=e[n-1]===t[a-1]?0:1;i[a]=Math.min(i[a-1]+1,r[a]+1,r[a-1]+o)}let a=r;r=i,i=a}return r[t.length]}function pi(e,t){let n=Math.max(e.x,t.x),r=Math.max(e.y,t.y),i=Math.min(e.x+e.width,t.x+t.width),a=Math.min(e.y+e.height,t.y+t.height),o=Math.max(0,i-n),s=Math.max(0,a-r);return{width:o,height:s,area:o*s}}function W(e){return e.y+e.height/2}function G(e){return String(e??``).normalize(`NFKC`).replace(/\s+/g,` `).trim()}function mi(e){return G(e).replace(/\s+/g,``).toLocaleLowerCase()}function hi(e){return G(e).replace(/\s+([.,:;%°)\]])/gu,`$1`).replace(/([(\[])\s+/gu,`$1`)}function gi(e,t){let n=W(e),r=W(t),i=Math.max(2,Math.min(e.height,t.height)*.5);return Math.abs(n-r)>i?n-r:e.x-t.x}function _i(e){return Math.round(Number(e)||0)}function vi(e){return Math.round((Number(e)||0)*10)/10}var yi=`eng`;async function bi({image:e,width:t,height:n,threshold:r,polarity:i}){Ci({image:e,width:t,height:n,threshold:r,polarity:i});let a=ar(t,n),o=or(t,n),s=sr({image:e,width:t,height:n,scale:a,padding:o,threshold:r,polarity:i}),c=await(0,ir.createWorker)(yi),l=[],u=[];try{for(let e of s){let r=await xi({worker:c,canvas:e.canvas,pageSegmentationMode:ir.PSM.SPARSE_TEXT}),i=br(r?.data?.text??``),s=mr(r?.data?.blocks??[],{scale:a,padding:o,originalWidth:t,originalHeight:n,variant:e.name,pass:`sparse`});l.push(...s),u.push({variant:e.name,pass:`sparse`,text:i,candidateCount:s.length}),console.log(`[LCD OCR ${e.name.toUpperCase()} SPARSE TEXT]`,i);let d=await xi({worker:c,canvas:e.canvas,pageSegmentationMode:ir.PSM.SINGLE_BLOCK}),f=br(d?.data?.text??``),p=mr(d?.data?.blocks??[],{scale:a,padding:o,originalWidth:t,originalHeight:n,variant:e.name,pass:`block`});l.push(...p),u.push({variant:e.name,pass:`block`,text:f,candidateCount:p.length}),console.log(`[LCD OCR ${e.name.toUpperCase()} BLOCK TEXT]`,f)}}finally{await Si(c)}console.log(`[LCD OCR ALL CANDIDATES]`,l);let{clusters:d,words:f}=wr(l);console.log(`[LCD OCR CLUSTERS]`,d),console.log(`[LCD OCR WINNERS]`,f);let p=Yr(f),m=ci(p);return console.log(`[LCD OCR TEXT]`,m),{text:m,regions:p,words:f,clusters:d,candidates:l,passes:u,scale:a,padding:o}}async function xi({worker:e,canvas:t,pageSegmentationMode:n}){return await e.setParameters({tessedit_pageseg_mode:n,preserve_interword_spaces:`1`,user_defined_dpi:`300`}),e.recognize(t,{},{text:!0,blocks:!0})}async function Si(e){if(e&&typeof e.terminate==`function`)try{await e.terminate()}catch(e){console.warn(`[LCD OCR WORKER TERMINATION]`,e)}}function Ci({image:e,width:t,height:n,threshold:r,polarity:i}){if(!e)throw Error(`OCR requires a reference image.`);if(!Number.isFinite(t)||!Number.isFinite(n)||t<1||n<1)throw Error(`OCR requires valid image dimensions.`);if(!Number.isFinite(r))throw Error(`OCR requires a valid image threshold.`);if(i!==`dark-on-light`&&i!==`light-on-dark`)throw Error(`OCR requires a valid image polarity.`)}var wi=[{width:128,height:64,name:`128 × 64 (OLED / Graphic LCD)`},{width:128,height:32,name:`128 × 32 (Narrow OLED)`},{width:84,height:48,name:`84 × 48 (Nokia 5110)`},{width:160,height:128,name:`160 × 128 (ST7735 Color TFT)`},{width:240,height:128,name:`240 × 128 (Graphic LCD)`},{width:240,height:64,name:`240 × 64 (Wide LCD)`},{width:256,height:64,name:`256 × 64 (SSD1322 OLED)`},{width:320,height:240,name:`320 × 240 (QVGA TFT)`},{width:160,height:80,name:`160 × 80 (Mini TFT)`}];async function Ti(e={}){let t=u.reference;if(!t?.src)throw Error(`Upload a reference image before analyzing.`);let n=await At(t.src),{width:r,height:i,threshold:a,polarity:o,binaryMask:s,imageData:c}=Lt(n),l=Rt(c,s),d=await bi({image:n,width:r,height:i,threshold:a,polarity:o}),f=$t(s,r,i,d.regions,e),p=e.detectText===!1?[]:d.regions.map(e=>Ei(e,l.foreground)),m=e.detectFrames===!1?[]:f.lines.map(e=>pn(e,l.foreground)),h=f.rectangles.filter(t=>!(t.filled&&e.detectBadges===!1||!t.filled&&e.detectFrames===!1)).map(e=>mn(e,l.foreground)),g=e.detectCircles===!1?[]:(f.circles||[]).map(e=>hn(e,l.foreground)),_=e.detectSymbols===!1?[]:(f.symbols||[]).map(e=>e.type===`text`||e.type===`line`?{...e,color:e.color||l.foreground}:{...e,stroke:e.stroke||l.foreground,fill:e.fill===`transparent`?`transparent`:e.fill||l.foreground});for(let e of p)for(let t of h)if(t.fill!==`transparent`){let n=e.x>=t.x-2&&e.x+e.width<=t.x+t.width+2,r=e.y>=t.y-2&&e.y+e.height<=t.y+t.height+2;n&&r&&(e.color=l.background||`#1d2720`,e.inverted=!0,t.name=`Detected Inverted Badge`)}let v=[...h,...g,..._,...m,...p];return v.sort(ki),{width:r,height:i,threshold:a,polarity:o,palette:l,suggestedResolution:Di(r,i),elements:v,text:d.text,stats:{textRegions:p.length,lines:m.length,rectangles:h.length,hollowFrames:f.stats?.hollowFrames??0,solidBadges:f.stats?.solidBadges??0,circles:g.length,symbols:_.length,totalElements:v.length,ocrCandidates:d.candidates.length,ocrClusters:d.clusters.length,ocrWords:d.words.length,ocrScale:d.scale,ocrPadding:d.padding}}}function Ei(e,t=`#a8d9a8`){let n=String(e?.text??``).trim(),r=Math.max(0,Math.round(Number(e?.x)||0)),i=Math.max(0,Math.round(Number(e?.y)||0)),a=Math.max(1,Math.round(Number(e?.width)||1)),o=Math.max(1,Math.round(Number(e?.height)||1)),s=ji(Math.round(o*1.05),6,96),c=/^[0-9.:\-\s%+°CFAVWmkuhzRPMpsiBAR/]+$/i.test(n),l=/^\d{1,2}:\d{2}(?::\d{2})?$/.test(n),u=/^[A-Z0-9_\-\s]{2,16}$/.test(n),d=`monospace`,f=400;return l||c||u?(d=`Share Tech Mono`,f=700):o>=16&&(f=700),{type:`text`,name:Oi(n),text:n,x:r,y:i,width:a,height:o,fontSize:s,fontFamily:d,fontWeight:f,textAlign:`left`,color:t,opacity:1,rotation:0,source:`analysis`,confidence:Number(e?.confidence)||0,fusionScore:Number(e?.fusionScore)||0,support:Number(e?.support)||1,sourceSupport:Number(e?.sourceSupport)||1}}function Di(e,t){let n=e/t,r=null,i=1/0;for(let a of wi){for(let n of[1,2,3,4,.5]){let o=a.width*n,s=a.height*n,c=Math.abs(e-o)/o+Math.abs(t-s)/s;c<.15&&c<i&&(i=c,r=a)}let o=a.width/a.height;Math.abs(n-o)/o<.05&&.25<i&&(i=.25,r=a)}return r}function Oi(e){let t=String(e??``).replace(/\s+/g,` `).trim();return t?t.length<=28?t:`${t.slice(0,27)}…`:`Detected Text`}function ki(e,t){if(Ai(e,t))return-1;if(Ai(t,e))return 1;let n=Number(e?.y)||0,r=Number(t?.y)||0,i=Number(e?.height)||0,a=Number(t?.height)||0,o=n+i/2,s=r+a/2,c=Math.max(2,Math.min(Math.max(1,i),Math.max(1,a))*.5);return Math.abs(o-s)>c?o-s:(Number(e?.x)||0)-(Number(t?.x)||0)}function Ai(e,t){if(e?.type===`text`)return!1;let n=Number(e?.x)||0,r=Number(e?.y)||0,i=Number(e?.width)||0,a=Number(e?.height)||0,o=Number(t?.x)||0,s=Number(t?.y)||0,c=Number(t?.width)||0,l=Number(t?.height)||0;return o>=n-2&&o+c<=n+i+2&&s>=r-2&&s+l<=r+a+2}function ji(e,t,n){return Math.min(n,Math.max(t,e))}async function Mi(e){if(!e||!e.display)return``;let t={d:{w:e.display.width,h:e.display.height,b:e.display.background},e:(e.elements||[]).map(e=>{let t={i:e.id,t:e.type,x:e.x,y:e.y,w:e.width,h:e.height};return e.text===void 0?e.content!==void 0&&(t.c=e.content):t.c=e.text,e.fontFamily&&(t.f=e.fontFamily),e.fontSize&&(t.s=e.fontSize),e.color&&(t.cl=e.color),e.stroke&&(t.st=e.stroke),e.strokeWidth&&(t.sw=e.strokeWidth),e.fill&&(t.fl=e.fill),e.radius!==void 0&&(t.r=e.radius),e.x1!==void 0&&(t.x1=e.x1),e.y1!==void 0&&(t.y1=e.y1),e.x2!==void 0&&(t.x2=e.x2),e.y2!==void 0&&(t.y2=e.y2),e.symbolSubtype&&(t.sub=e.symbolSubtype),e.value!==void 0&&(t.val=e.value),e.max!==void 0&&(t.max=e.max),t})},n=JSON.stringify(t),r=new Blob([n]).stream().pipeThrough(new CompressionStream(`deflate-raw`)),i=await new Response(r).arrayBuffer(),a=new Uint8Array(i),o=``;for(let e=0;e<a.length;e++)o+=String.fromCharCode(a[e]);return btoa(o).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}async function Ni(e){if(!e)return null;let t=e.replace(/^#p=/,``).replace(/^#/,``).trim();if(!t)return null;for(t=t.replace(/-/g,`+`).replace(/_/g,`/`);t.length%4!=0;)t+=`=`;let n=atob(t),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);let i=new Blob([r]).stream().pipeThrough(new DecompressionStream(`deflate-raw`)),a=await new Response(i).text(),o=JSON.parse(a);return{display:{width:o.d?.w||128,height:o.d?.h||64,background:o.d?.b||`#18211b`},elements:(o.e||[]).map((e,t)=>({id:e.i||`el_${t}_${Math.random().toString(36).slice(2,6)}`,type:e.t||`text`,x:e.x||0,y:e.y||0,width:e.w||10,height:e.h||10,...e.c===void 0?{}:{content:e.c,text:e.c},...e.f?{fontFamily:e.f}:{},...e.s?{fontSize:e.s}:{},...e.cl?{color:e.cl}:{},...e.st?{stroke:e.st}:{},...e.sw?{strokeWidth:e.sw}:{},...e.fl?{fill:e.fl}:{},...e.r===void 0?{}:{radius:e.r},...e.x1===void 0?{}:{x1:e.x1},...e.y1===void 0?{}:{y1:e.y1},...e.x2===void 0?{}:{x2:e.x2},...e.y2===void 0?{}:{y2:e.y2},...e.sub?{symbolSubtype:e.sub}:{},...e.val===void 0?{}:{value:e.val},...e.max===void 0?{}:{max:e.max}}))}}function Pi(e,t){return e===84&&t===48?`nokia`:e===160&&t===32?`charlcd`:e===128&&(t===64||t===32)?`oled`:`industrial`}function Fi(e,{width:t,height:n,enabled:r}){if(!e)return;let i=e.querySelector(`.hardware-pcb-shell`);if(!r){i&&i.remove(),e.classList.remove(`has-hardware-shell`);return}e.classList.add(`has-hardware-shell`);let a=Pi(t,n);i||(i=document.createElement(`div`),i.className=`hardware-pcb-shell`,e.prepend(i)),i.dataset.deviceType=a;let o=[`GND`,`VCC`,`SCL`,`SDA`],s=`0.96" I2C OLED (SSD1306)`;a===`nokia`?(o=[`RST`,`CE`,`DC`,`DIN`,`CLK`,`VCC`,`BL`,`GND`],s=`84×48 Graphic LCD (PCD8544)`):a===`charlcd`?(o=[`VSS`,`VDD`,`V0`,`RS`,`RW`,`E`,`D4`,`D5`,`D6`,`D7`,`A`,`K`],s=`16×2 Character LCD (HD44780)`):a===`industrial`&&(o=[`VSS`,`VDD`,`V0`,`RS`,`R/W`,`E`,`DB0..7`,`PSB`,`RST`],s=`${t}×${n} Industrial HMI Controller`),i.innerHTML=`
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
  `}var Ii=null,Li=null,Ri=0;function zi(){return Ii!==null}function Bi(e){let t=e.match(/^([^0-9.-]*)(-?\d+(?:\.\d+)?)(.*)$/);if(!t)return null;let n=t[2],r=n.includes(`.`)?n.split(`.`)[1].length:0;return{prefix:t[1],num:parseFloat(n),decimals:r,suffix:t[3]}}function Vi(e,t){return zi()||!e||!Array.isArray(e.elements)?!1:(Li=JSON.parse(JSON.stringify(e.elements)),Ri=0,Ii=setInterval(()=>{Ri++,Hi(e),typeof t==`function`&&t()},500),!0)}function Hi(e){if(!e||!Array.isArray(e.elements))return;let t=Ri%2==0;for(let n=0;n<e.elements.length;n++){let r=e.elements[n],i=Li&&Li[n];if(r.type===`text`){let e=i&&i.text||r.text||``,a=e.match(/^(\d{1,2})(:)(\d{2})(:?\d{0,2})(.*)$/);if(a){r.text=`${a[1]}${t?`:`:` `}${a[2],a[3]}${a[4]?t?a[4]:a[4].replace(`:`,` `):``}${a[5]||``}`;continue}if(/^\d{1,3}\s*%$/.test(e.trim())){let t=parseInt(e,10),n=Math.sin(Ri*.15)*5;r.text=`${Math.max(5,Math.min(100,Math.round(t+n)))}%`;continue}let o=Bi(e);if(o&&(o.suffix.includes(`°`)||o.suffix.toLowerCase().includes(`c`)||o.suffix.toLowerCase().includes(`v`)||o.suffix.toLowerCase().includes(`hpa`)||o.suffix.toLowerCase().includes(`rpm`)||o.suffix.toLowerCase().includes(`bar`))){let e=Math.sin((Ri+n*3)*.25)*.4,t=(o.num+e).toFixed(o.decimals);r.text=`${o.prefix}${t}${o.suffix}`;continue}}if(r.type===`rect`&&r.fill&&i&&i.width>10&&i.width<(e.display?.width||128)){let e=i.width,t=Math.round(Math.sin((Ri+n)*.2)*6);r.width=Math.max(2,e+t)}}}function Ui(e,t){return zi()?(clearInterval(Ii),Ii=null,e&&Li&&(e.elements=JSON.parse(JSON.stringify(Li)),Li=null),typeof t==`function`&&t(),!0):!1}function Wi(e,t,n,r,i,a=1,o=1){let s=0,c=0,l=Math.max(0,Math.floor(r-a)),u=Math.min(t-1,Math.ceil(r+a)),d=Math.max(0,Math.floor(i-o)),f=Math.min(n-1,Math.ceil(i+o));for(let n=d;n<=f;n++){let r=n*t;for(let t=l;t<=u;t++)s+=e[r+t],c++}if(c===0)return 0;let p=s/c;return Math.max(0,Math.min(1,1-p/255))}function Gi(e,t,n,r={}){let{lineSpacing:i=4,minThickness:a=.4,maxThickness:o=4.2,gamma:s=1.2,angle:c=`horizontal`,modulation:l=`continuous`,pulseFrequency:u=.35,contrast:d=20,brightness:f=0,invert:p=!1}=r,m;if(e instanceof Float32Array)m=e;else if(e?.data)m=Yi(e,{contrast:d,brightness:f});else throw Error(`Invalid source for telegraphic scan: expected Float32Array or ImageData.`);let h=new Uint8Array(t*n),g=Math.max(1,Number(i)||4),_=Math.max(.5,Number(o)||g),v=Math.max(0,Number(a)||0),y=Math.max(1,Math.floor(g/2));for(let e=0;e<n;e++)for(let r=0;r<t;r++){let i=!1;if(c===`diagonal`){let a=(r+e)/Math.SQRT2,o=Math.round(a/g),c=Math.abs(a-o*g),l=Wi(m,t,n,r,e,1,1);p&&(l=1-l),l**=+s;let u=v+(_-v)*l;u>=.3&&c<=u/2&&(i=!0)}else if(c===`crosshatch`){let a=Math.round((e-g/2)/g)*g+g/2,o=Math.abs(e-a),c=Math.round((r-g/2)/g)*g+g/2,l=Math.abs(r-c),u=Wi(m,t,n,r,e,1,1);p&&(u=1-u),u**=+s;let d=v+(_-v)*u;d>=.3&&(o<=d/2||u>.45&&l<=d/2)&&(i=!0)}else if(c===`vertical`){let a=Math.round((r-g/2)/g)*g+g/2,o=Math.abs(r-a),c=Wi(m,t,n,a,e,1,y);p&&(c=1-c),c**=+s;let l=v+(_-v)*c;l>=.3&&o<=l/2&&(i=!0)}else{let a=Math.round((e-g/2)/g)*g+g/2,o=Math.abs(e-a),c=Wi(m,t,n,r,a,1,y);p&&(c=1-c),c**=+s;let d=v+(_-v)*c;l===`pulse`&&c<.85&&Math.sin(r*u)<1-c*1.5&&(d=0),d>=.3&&o<=d/2&&(i=!0)}let a=e*t+r;h[a]=+!!i}return h}var Ki=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]],qi=[[0,32,8,40,2,34,10,42],[48,16,56,24,50,18,58,26],[12,44,4,36,14,46,6,38],[60,28,52,20,62,30,54,22],[3,35,11,43,1,33,9,41],[51,19,59,27,49,17,57,25],[15,47,7,39,13,45,5,37],[63,31,55,23,61,29,53,21]];function Ji(e,t=0,n=0){let r=e+n*1.28;if(t!==0){let e=Math.max(-100,Math.min(100,t));r=259*(e+255)/(255*(259-e))*(r-128)+128}return Math.max(0,Math.min(255,r))}function Yi(e,{contrast:t=0,brightness:n=0}={}){let{width:r,height:i,data:a}=e,o=new Float32Array(r*i);for(let e=0;e<r*i;e++){let r=e*4,i=a[r],s=a[r+1],c=a[r+2],l=a[r+3]/255,u=.299*i+.587*s+.114*c;u=u*l+255*(1-l),o[e]=Ji(u,t,n)}return o}function Xi(e,t,n,{threshold:r=128,invert:i=!1}={}){let a=new Float32Array(e),o=new Uint8Array(t*n);for(let e=0;e<n;e++)for(let s=0;s<t;s++){let c=e*t+s,l=a[c],u=l>=r,d=l-(u?255:0);o[c]=i?+!u:+!!u,s+1<t&&(a[c+1]+=7/16*d),e+1<n&&(s-1>=0&&(a[c+t-1]+=3/16*d),a[c+t]+=5/16*d,s+1<t&&(a[c+t+1]+=1/16*d))}return o}function Zi(e,t,n,{threshold:r=128,invert:i=!1}={}){let a=new Float32Array(e),o=new Uint8Array(t*n);for(let e=0;e<n;e++)for(let s=0;s<t;s++){let c=e*t+s,l=a[c],u=l>=r,d=(l-(u?255:0))/8;o[c]=i?+!u:+!!u,s+1<t&&(a[c+1]+=d),s+2<t&&(a[c+2]+=d),e+1<n&&(s-1>=0&&(a[c+t-1]+=d),a[c+t]+=d,s+1<t&&(a[c+t+1]+=d)),e+2<n&&(a[c+t*2]+=d)}return o}function Qi(e,t,n,{threshold:r=128,matrixSize:i=4,invert:a=!1}={}){let o=new Uint8Array(t*n),s=i===8?qi:Ki,c=i,l=c*c;for(let i=0;i<n;i++)for(let n=0;n<t;n++){let u=i*t+n,d=e[u]+((s[i%c][n%c]+.5)/l-.5)*128>=r;o[u]=a?+!d:+!!d}return o}function $i(e,t,n,{threshold:r=128,invert:i=!1}={}){let a=new Uint8Array(t*n);for(let o=0;o<t*n;o++){let t=e[o]>=r;a[o]=i?+!t:+!!t}return a}function ea(e,t,n,{fgColor:r=`#ffffff`,bgColor:i=`#000000`}={}){let a=e=>{let t=e.replace(`#`,``);t.length===3&&(t=t.split(``).map(e=>e+e).join(``));let n=parseInt(t,16);return[n>>16&255,n>>8&255,n&255]},o=a(r),s=a(i),c=typeof ImageData<`u`?new ImageData(t,n):{width:t,height:n,data:new Uint8ClampedArray(t*n*4)},l=c.data;for(let t=0;t<e.length;t++){let n=e[t]===1?o:s,r=t*4;l[r]=n[0],l[r+1]=n[1],l[r+2]=n[2],l[r+3]=255}return c}function ta(e,t={}){let{algorithm:n=`atkinson`,contrast:r=20,brightness:i=0,threshold:a=128,invert:o=!1,fgColor:s=`#a8d9a8`,bgColor:c=`#18211b`}=t,{width:l,height:u}=e,d=Yi(e,{contrast:r,brightness:i}),f;return f=n===`telegraphic`?Gi(d,l,u,{lineSpacing:t.lineSpacing??4,minThickness:t.minThickness??.4,maxThickness:t.maxThickness??(t.lineSpacing??4)*1.05,angle:t.angle??`horizontal`,modulation:t.modulation??`continuous`,gamma:t.gamma??1.2,invert:o}):n===`floyd-steinberg`?Xi(d,l,u,{threshold:a,invert:o}):n===`bayer4`?Qi(d,l,u,{threshold:a,matrixSize:4,invert:o}):n===`bayer8`?Qi(d,l,u,{threshold:a,matrixSize:8,invert:o}):n===`threshold`?$i(d,l,u,{threshold:a,invert:o}):Zi(d,l,u,{threshold:a,invert:o}),{width:l,height:u,binary:f,createImageData:(e=s,t=c)=>ea(f,l,u,{fgColor:e,bgColor:t})}}document.querySelector(`#app`).innerHTML=`
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
          title="Export as C Header / Embedded Monochrome Bitmap (Adafruit GFX / U8g2 / XBM)"
        >
          Export C Code
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
        </div>


        <div
          class="reference-info"
          id="reference-info"
          hidden
        >
          <div class="reference-info-meta">
            <strong id="reference-name">Görsel</strong>
            <span id="reference-size"></span>
          </div>
          <button
            class="reference-remove-btn"
            id="remove-reference"
            type="button"
            title="Yüklenen görseli kaldır"
          >
            ✕ Kaldır
          </button>
        </div>

        <div class="analysis-mode-tabs">
          <button type="button" class="analysis-mode-tab active" id="tab-mode-lcd" data-mode="lcd" title="Extract text & UI from physical LCD displays">
            📟 LCD Ekran
          </button>
          <button type="button" class="analysis-mode-tab" id="tab-mode-dither" data-mode="dither" title="High-fidelity retro telegraph and 1-bit scanline engraving">
            📡 Telgraf &amp; Foto
          </button>
        </div>

        <div class="mode-container-lcd" id="mode-container-lcd">
          <details
            class="analysis-options"
            id="analysis-options-details"
            style="margin: 8px 0; font-size: 11px;"
          >
            <summary style="cursor: pointer; color: #a8d9a8; font-weight: bold; margin-bottom: 6px;">
              ⚙ Analiz Ayarları
            </summary>
            <div style="display: flex; flex-direction: column; gap: 5px; padding: 6px 8px; background: rgba(0,0,0,0.25); border-radius: 4px; border: 1px solid #334438;">
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-text" checked> Metin (OCR &amp; 7-Segment)
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-frames" checked> Çerçeve ve Çizgiler
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-badges" checked> Dolu Rozet ve Barlar
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-circles" checked> Daire ve Noktalar
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-symbols" checked> Simgeler ve İkonlar
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-auto-theme" checked> Ekran Rengini Otomatik Uyarla
              </label>
            </div>
          </details>

          <button
            class="wide-button analyze-button"
            id="analyze-reference"
            type="button"
            disabled
          >
            ✦ LCD Ekranı Çözümle
          </button>

          <button
            class="wide-button secondary-button"
            id="match-reference-size"
            type="button"
            title="Ekran boyutunu yüklenen görselin çözünürlüğüne eşitler"
            style="margin-top: 6px; font-size: 11px; padding: 7px 10px;"
          >
            📐 Ekran Boyutunu Eşle
          </button>
        </div>

        <div class="mode-container-dither" id="mode-container-dither" hidden>
          <div class="dither-settings-box">
            <div class="dither-field">
              <label for="dither-algo-select">Gravür / Çizim Stili:</label>
              <select id="dither-algo-select" class="sidebar-select">
                <option value="telegraphic" selected>📡 Telgraf Gravürü (Wirephoto) ★</option>
                <option value="atkinson">🕹️ 1-Bit Dither (Macintosh 1984)</option>
                <option value="floyd-steinberg">Floyd-Steinberg (Yumuşak Gölgeli)</option>
                <option value="bayer4">📰 Gazete Matrisi (Bayer 4×4)</option>
                <option value="bayer8">Bayer 8×8 (İnce Piksel Matrisi)</option>
                <option value="threshold">🖋️ Çizgi Roman / Stencil</option>
              </select>
            </div>

            <!-- Primary Telegraph Settings (shown when telegraphic is active) -->
            <div id="telegraphic-options-box" class="telegraphic-options-box">
              <div class="dither-field">
                <label for="telegraphic-spacing">Çizgi Sıklığı (Tarama Yoğunluğu):</label>
                <select id="telegraphic-spacing" class="sidebar-select">
                  <option value="2">2 px (Ultra Yüksek Detay)</option>
                  <option value="3">3 px (İnce &amp; Net Gravür)</option>
                  <option value="4" selected>4 px (Klasik Telgraf Faksı - Önerilen)</option>
                  <option value="6">6 px (Retro Geniş Çizgiler)</option>
                </select>
              </div>

              <div class="dither-field">
                <label for="telegraphic-angle">Tarama Açısı:</label>
                <select id="telegraphic-angle" class="sidebar-select">
                  <option value="horizontal" selected>Yatay (0° Klasik Wirephoto)</option>
                  <option value="diagonal">Diyagonal (45° Gravür &amp; Para Baskısı)</option>
                  <option value="crosshatch">Çapraz (Çift Yönlü Çizgi)</option>
                  <option value="vertical">Dikey (90° Tarama)</option>
                </select>
              </div>
            </div>

            <!-- Contrast slider (key control) -->
            <div class="dither-slider-group">
              <div class="slider-row">
                <label for="dither-contrast">Kontrast</label>
                <span id="dither-contrast-val">+25%</span>
              </div>
              <input type="range" id="dither-contrast" min="-100" max="100" value="25" step="5">
            </div>

            <!-- Clean Collapsible for Advanced / Secondary Settings -->
            <details class="dither-advanced-details" style="font-size: 11px; margin-top: 4px;">
              <summary style="cursor: pointer; color: #8b949e; font-size: 10px; font-weight: 600; padding: 4px 0;">
                ⚙ Detaylı Ayarlar (Çözünürlük, Eşik, Parlaklık)
              </summary>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div class="dither-field">
                  <label for="dither-target-select">Hedef Ekran Boyutu:</label>
                  <select id="dither-target-select" class="sidebar-select">
                    <option value="fit" selected>Mevcut Ekrana Sığdır</option>
                    <option value="proportional">Fotoğraf Oranını Koru</option>
                    <option value="avatar">👤 Köşeye Avatar Olarak Ekle</option>
                    <option value="ssd1306">128 × 64 (OLED / SSD1306)</option>
                    <option value="badge">250 × 122 (e-Paper Badge)</option>
                    <option value="nokia">84 × 48 (Nokia 5110)</option>
                    <option value="smartwatch">128 × 128 (Akıllı Saat)</option>
                  </select>
                </div>

                <div class="dither-field" id="modulation-field">
                  <label for="telegraphic-modulation">Modülasyon:</label>
                  <select id="telegraphic-modulation" class="sidebar-select">
                    <option value="continuous" selected>Sürekli Değişken Kalınlık</option>
                    <option value="pulse">Mors / Telgraf Kesik Darbeli</option>
                  </select>
                </div>

                <div class="dither-slider-group" id="max-thickness-group">
                  <div class="slider-row">
                    <label for="telegraphic-max-thickness">Maks. Çizgi Kalınlığı</label>
                    <span id="telegraphic-max-thickness-val">4.5 px</span>
                  </div>
                  <input type="range" id="telegraphic-max-thickness" min="2" max="10" value="4.5" step="0.5">
                </div>

                <div class="dither-slider-group">
                  <div class="slider-row">
                    <label for="dither-brightness">Parlaklık</label>
                    <span id="dither-brightness-val">0%</span>
                  </div>
                  <input type="range" id="dither-brightness" min="-100" max="100" value="0" step="5">
                </div>

                <div class="dither-slider-group" id="threshold-slider-group">
                  <div class="slider-row">
                    <label for="dither-threshold">Eşik Değeri</label>
                    <span id="dither-threshold-val">128</span>
                  </div>
                  <input type="range" id="dither-threshold" min="30" max="225" value="128" step="1">
                </div>

                <div class="dither-checkbox-row">
                  <label>
                    <input type="checkbox" id="dither-invert"> Renkleri Ters Çevir (Invert)
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
            📡 Telgraf Gravürü Oluştur
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

        </div>

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
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title">
            <span>Embedded C Bitmap Export</span>
            <span id="c-export-resolution" class="badge">128 × 64 px</span>
          </div>
          <button type="button" class="icon-button modal-close" id="c-export-close" title="Close (Esc)">✕</button>
        </div>
        <div class="modal-body">
          <div class="c-export-preview-column">
            <span class="column-title">1-Bit Monochrome Hardware Preview</span>
            <div class="preview-container">
              <canvas id="c-export-preview" class="c-preview-canvas"></canvas>
            </div>
            <div class="c-export-options">
              <label class="field">
                <span>Target Hardware Format</span>
                <select id="c-export-format">
                  <option value="adafruit">Adafruit_GFX (Horizontal MSB-first .h)</option>
                  <option value="u8g2">U8g2 / SSD1306 (Vertical 8-px Pages .h)</option>
                  <option value="xbm">XBM (Standard X BitMap / LSB-first .h)</option>
                  <option value="arduino_sketch">Complete Arduino Sketch (.ino)</option>
                  <option value="micropython">MicroPython framebuf (ESP32/Pico .py)</option>
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
          </div>
          <div class="c-export-code-column">
            <span class="column-title">Generated C Header / Array</span>
            <textarea id="c-export-code" class="c-code-area" readonly spellcheck="false"></textarea>
            <div class="modal-actions">
              <button type="button" class="wide-button" id="c-export-copy">📋 Copy C Code</button>
              <button type="button" class="wide-button primary-button" id="c-export-download">⭳ Download .h File</button>
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
`;var na=document.querySelector(`.display-canvas`),ra=document.querySelector(`#canvas-area`),ia=document.querySelector(`#reference-file-input`),aa=document.querySelector(`#upload-reference`),oa=document.querySelector(`#reference-preview`),K=document.querySelector(`#reference-preview-image`),sa=document.querySelector(`#reference-placeholder`),ca=document.querySelector(`#reference-info`);document.querySelector(`#reference-name`),document.querySelector(`#reference-size`);var q=document.querySelector(`#analyze-reference`),J=document.querySelector(`#analysis-message`),la=document.querySelector(`#reference-actions`),ua=document.querySelector(`#match-reference-size`),da=document.querySelector(`#remove-reference`),fa=document.querySelector(`#fit-workspace`),pa=document.querySelector(`#zoom-out`),ma=document.querySelector(`#zoom-in`),ha=document.querySelector(`#zoom-label`),ga=document.querySelector(`#workspace-resolution`),_a=document.querySelector(`#display-width`),va=document.querySelector(`#display-height`),ya=document.querySelector(`#display-background`),ba=document.querySelector(`#display-background-text`),xa=document.querySelector(`#display-orientation`),Sa=document.querySelector(`#status-resolution`),Ca=document.querySelector(`#status-orientation`),wa=document.querySelector(`#layers-list`),Ta=document.querySelector(`#layer-count`),Ea=document.querySelector(`#properties-empty`),Da=document.querySelector(`#properties-content`),Oa=document.querySelector(`#property-type`),ka=document.querySelector(`#property-text-field`),Aa=document.querySelector(`#property-text`),ja=document.querySelector(`#property-x`),Ma=document.querySelector(`#property-y`),Na=document.querySelector(`#property-width`),Pa=document.querySelector(`#property-height`),Fa=document.querySelector(`#text-properties`),Y=document.querySelector(`#property-font-family`),Ia=document.querySelector(`#font-file-input`),La=document.querySelector(`#load-custom-font-btn`),Ra=document.querySelector(`#property-font-size`),za=document.querySelector(`#property-font-weight`),Ba=document.querySelector(`#property-text-color`),Va=document.querySelector(`#shape-properties`),Ha=document.querySelector(`#property-fill-field`),Ua=document.querySelector(`#property-fill`),Wa=document.querySelector(`#property-stroke`),Ga=document.querySelector(`#property-stroke-width`),Ka=document.querySelector(`#delete-element`),qa=document.querySelector(`#grid-toggle`),Ja=document.querySelector(`#snap-toggle`),Ya=document.querySelector(`#undo-button`),Xa=document.querySelector(`#redo-button`),Za=document.querySelector(`#duplicate-button`),Qa=document.querySelector(`#copy-button`),$a=document.querySelector(`#paste-button`),eo=document.querySelector(`#duplicate-element`),to=document.querySelector(`#overlay-controls`),no=document.querySelector(`#overlay-toggle`),ro=document.querySelector(`#overlay-opacity`),io=document.querySelector(`#lcd-preset-select`),ao=document.querySelector(`#layer-to-front`),oo=document.querySelector(`#layer-move-up`),so=document.querySelector(`#layer-move-down`),co=document.querySelector(`#layer-to-back`),lo=document.querySelector(`#align-left`),uo=document.querySelector(`#align-center-h`),fo=document.querySelector(`#align-right`),po=document.querySelector(`#align-top`),mo=document.querySelector(`#align-center-v`),ho=document.querySelector(`#align-bottom`),go=document.querySelector(`#distribute-h`),_o=document.querySelector(`#distribute-v`);function vo(){let e=!!u.selectedId,t=!!ue(),n=u.elements.length>=3;Za&&(Za.disabled=!e),eo&&(eo.disabled=!e),Qa&&(Qa.disabled=!e),$a&&($a.disabled=!t),ao&&(ao.disabled=!e),oo&&(oo.disabled=!e),so&&(so.disabled=!e),co&&(co.disabled=!e),lo&&(lo.disabled=!e),uo&&(uo.disabled=!e),fo&&(fo.disabled=!e),po&&(po.disabled=!e),mo&&(mo.disabled=!e),ho&&(ho.disabled=!e),go&&(go.disabled=!n),_o&&(_o.disabled=!n),to&&(to.hidden=!u.reference.src)}function yo(){Ya.disabled=!b(),Xa.disabled=!x()}Ya.addEventListener(`click`,()=>{C()}),Xa.addEventListener(`click`,()=>{w()});function bo(){let e=O();e&&de(e.id)}Za&&Za.addEventListener(`click`,bo),eo&&eo.addEventListener(`click`,bo),Qa&&Qa.addEventListener(`click`,()=>{let e=O();e&&(fe(e.id),vo())}),$a&&$a.addEventListener(`click`,()=>{pe()}),no&&no.addEventListener(`change`,()=>{_e(no.checked)}),ro&&ro.addEventListener(`input`,()=>{ve(ro.value)}),io&&io.addEventListener(`change`,()=>{io.value&&be(io.value)}),ao&&ao.addEventListener(`click`,()=>ge(void 0,`front`)),oo&&oo.addEventListener(`click`,()=>ge(void 0,`up`)),so&&so.addEventListener(`click`,()=>ge(void 0,`down`)),co&&co.addEventListener(`click`,()=>ge(void 0,`back`)),lo&&lo.addEventListener(`click`,()=>me(void 0,`left`)),uo&&uo.addEventListener(`click`,()=>me(void 0,`center`)),fo&&fo.addEventListener(`click`,()=>me(void 0,`right`)),po&&po.addEventListener(`click`,()=>me(void 0,`top`)),mo&&mo.addEventListener(`click`,()=>me(void 0,`middle`)),ho&&ho.addEventListener(`click`,()=>me(void 0,`bottom`)),go&&go.addEventListener(`click`,()=>he(`horizontal`)),_o&&_o.addEventListener(`click`,()=>he(`vertical`)),E(yo),E(vo),yo(),vo(),nt(na),document.querySelectorAll(`[data-element-type]`).forEach(e=>{e.addEventListener(`click`,()=>{$e(e.dataset.elementType)})}),document.querySelectorAll(`[data-stencil-type]`).forEach(e=>{e.addEventListener(`click`,()=>{wt(e.dataset.stencilType)})});var xo=!1,So=!1;function Co(){let e=u.reference,t=!!e.src;if(t?K.src=e.src:K.removeAttribute(`src`),K.hidden=!t,sa.hidden=t,oa.classList.toggle(`empty`,!t),ca&&(ca.hidden=!t,t)){let e=document.querySelector(`#reference-name`),t=document.querySelector(`#reference-size`);e&&u.reference.name&&(e.textContent=u.reference.name),t&&u.reference.width&&(t.textContent=`${u.reference.width} × ${u.reference.height} px`)}la&&(la.hidden=!0),q&&(q.disabled=!t);let n=document.querySelector(`#apply-dither-button`);n&&(n.disabled=!t),J&&(J.hidden=!0)}async function wo(e){xo=!0;try{J&&(J.hidden=!0);let t=await e;if(K.src=t.src,K.hidden=!1,sa.hidden=!0,oa.classList.remove(`empty`),ca){ca.hidden=!1;let e=document.querySelector(`#reference-name`),n=document.querySelector(`#reference-size`);e&&(e.textContent=t.name||`Görsel`),n&&(n.textContent=`${t.width} × ${t.height} px`)}la&&(la.hidden=!0),q&&(q.disabled=!1);let n=document.querySelector(`#apply-dither-button`);return n&&(n.disabled=!1),Et(),requestAnimationFrame(()=>X()),t}catch(e){return console.error(e),window.alert(e?.message||`Reference image could not be loaded.`),null}finally{xo=!1}}aa.addEventListener(`click`,()=>{ia.click()}),ia.addEventListener(`change`,async()=>{let e=ia.files?.[0];e&&(await wo(Tt(e)),ia.value=``)}),window.addEventListener(`paste`,async e=>{let t=e.target;if(t?.tagName===`INPUT`||t?.tagName===`TEXTAREA`||t?.isContentEditable)return;let n=e.clipboardData?.items;if(n){for(let t of n)if(t.type.startsWith(`image/`)){let n=t.getAsFile();if(n){e.preventDefault(),await wo(Tt(n));break}}}});var To=document.querySelector(`#try-sample-btn`),Eo=document.querySelector(`#sample-dropdown-menu`);To&&Eo&&(Eo.innerHTML=kt.map(e=>`
      <button class="sample-dropdown-item" type="button" data-sample-id="${e.id}">
        <strong>${e.title}</strong>
        <span>${e.subtitle}</span>
      </button>
    `).join(``),To.addEventListener(`click`,e=>{e.stopPropagation(),Eo.hidden=!Eo.hidden}),document.addEventListener(`click`,()=>{Eo.hidden=!0}),Eo.addEventListener(`click`,async e=>{let t=e.target.closest(`.sample-dropdown-item`);if(!t)return;let n=t.dataset.sampleId,r=kt.find(e=>e.id===n);r&&(Eo.hidden=!0,await wo(Dt(r.url,r.title))&&q.click())})),ua.addEventListener(`click`,()=>{Et(),requestAnimationFrame(()=>X())}),da.addEventListener(`click`,()=>{Ot(),K.removeAttribute(`src`),K.hidden=!0,sa.hidden=!1,oa.classList.add(`empty`),ca&&(ca.hidden=!0),la.hidden=!0,q.disabled=!0,J&&(J.hidden=!0)}),q.addEventListener(`click`,async()=>{if(!u.reference.src)return;So=!0;let e=q.textContent;q.disabled=!0,q.textContent=`Analyzing...`,J.hidden=!1,J.className=`analysis-message`,J.textContent=`Analyzing image...`;try{let e=document.querySelector(`#opt-detect-text`)?.checked??!0,t=document.querySelector(`#opt-detect-frames`)?.checked??!0,n=document.querySelector(`#opt-detect-badges`)?.checked??!0,r=document.querySelector(`#opt-detect-circles`)?.checked??!0,i=document.querySelector(`#opt-detect-symbols`)?.checked??!0,a=document.querySelector(`#opt-auto-theme`)?.checked??!0,o=await Ti({detectText:e,detectFrames:t,detectBadges:n,detectCircles:r,detectSymbols:i});ie(!1),a&&o.palette?.background&&A({background:o.palette.background});for(let e of o.elements)et(e,!1);D(),requestAnimationFrame(()=>X()),J.hidden=!1,J.textContent=`✓ ${o.elements.length} elements detected`,Q(`✓ ${o.elements.length} LCD elements vectorized!`,`info`),setTimeout(()=>{So||(J.hidden=!0)},2500)}catch(e){console.error(e),J.className=`analysis-message error`,J.textContent=e?.message||`Analysis failed.`,Q(e?.message||`Analysis failed`,`warn`)}finally{q.disabled=!u.reference.src,q.textContent=e,So=!1}});var Do=document.querySelector(`#analyze-telegraphic`);Do?.addEventListener(`click`,async()=>{if(!u.reference.src)return;let e=Do.textContent;Do.disabled=!0,Do.textContent=`Taranıyor...`,Q(`📡 Telgraf / Wirephoto çizgi taraması yapılıyor...`,`info`);try{let e=await At(u.reference.src),t=u.display.width,n=u.display.height;if(u.display.width<=128&&e.naturalWidth>128){let r=e.naturalWidth/(e.naturalHeight||1);r>=1?(t=Math.min(e.naturalWidth,256),n=Math.max(32,Math.round(t/r))):(n=Math.min(e.naturalHeight,256),t=Math.max(32,Math.round(n*r))),A({width:t,height:n})}let r=document.createElement(`canvas`);r.width=t,r.height=n;let i=r.getContext(`2d`);i.imageSmoothingEnabled=!0,i.imageSmoothingQuality=`high`,i.drawImage(e,0,0,t,n);let a=i.getImageData(0,0,t,n),o=u.display.background||`#18211b`,s=o===`#000000`||o===`#18211b`||o.startsWith(`#0`)||o.startsWith(`#1`)?`#a8d9a8`:`#18211b`,c=ta(a,{algorithm:`telegraphic`,lineSpacing:4,minThickness:.4,maxThickness:4.5,contrast:25,brightness:0,invert:!1,fgColor:s,bgColor:o}).createImageData(s,o);i.putImageData(c,0,0);let l=r.toDataURL(`image/png`);Re(l,r);let d={id:`bmp_tele_${Date.now()}`,type:`bitmap`,name:`Telgraf / Wirephoto Taraması`,x:0,y:0,width:t,height:n,dataUrl:l,ditherMethod:`telegraphic`,contrast:25,brightness:0,threshold:128,invert:!1};u.elements=[d],u.selectedId=d.id,D(),requestAnimationFrame(()=>X()),Q(`📡 Telgraf / Wirephoto taraması oluşturuldu! C kodları ve SVG güncellendi.`,`info`)}catch(e){console.error(`Telegraphic scan error:`,e),Q(`Tarama hatası: `+e.message,`error`)}finally{Do.disabled=!u.reference.src,Do.textContent=e}}),_a.addEventListener(`change`,()=>{A({width:Math.max(1,Number(_a.value)||1)}),X()}),va.addEventListener(`change`,()=>{A({height:Math.max(1,Number(va.value)||1)}),X()}),ya.addEventListener(`input`,()=>{A({background:ya.value})});function X(){let e=Math.max(100,ra.clientWidth-100),t=Math.max(100,ra.clientHeight-100),n=u.display.width,r=u.display.height;if(n<=0||r<=0)return;let i=e/n,a=t/r,o=Math.min(i,a);o=Math.min(4,Math.max(.1,o)),se(o)}fa.addEventListener(`click`,X),pa.addEventListener(`click`,()=>{let e=u.view.scale;se(e-.25)}),ma.addEventListener(`click`,()=>{let e=u.view.scale;se(e+.25)}),qa.addEventListener(`change`,()=>{ce(qa.checked)}),Ja.addEventListener(`change`,()=>{le(Ja.checked)});function Oo(){if(wa.innerHTML=``,Ta.textContent=String(u.elements.length),u.elements.length===0){let e=document.createElement(`div`);e.className=`layers-empty`,e.textContent=`No editable elements yet.`,wa.appendChild(e);return}[...u.elements].reverse().forEach(e=>{let t=document.createElement(`button`);t.type=`button`,t.className=`layer-item`,e.id===u.selectedId&&t.classList.add(`active`);let n=document.createElement(`span`);n.className=`layer-icon`,n.textContent=ko(e.type);let r=document.createElement(`span`);r.className=`layer-name`,r.textContent=e.type===`text`?e.text:e.name,t.append(n,r),t.addEventListener(`click`,()=>{k(e.id)}),wa.appendChild(t)})}function ko(e){return e===`text`?`T`:e===`rectangle`?`□`:e===`circle`?`○`:e===`line`?`─`:`•`}function Ao(){let e=O();if(!e){Ea.hidden=!1,Da.hidden=!0;return}Ea.hidden=!0,Da.hidden=!1,Oa.textContent=e.type,ja.value=e.x,Ma.value=e.y,Na.value=e.width,Pa.value=e.height;let t=e.type===`text`,n=[`rectangle`,`circle`,`line`].includes(e.type);if(ka.hidden=!t,Fa.hidden=!t,Va.hidden=!n,t){if(Aa.value=e.text,e.fontFamily&&!Array.from(Y.options).some(t=>t.value===e.fontFamily)){let t=document.createElement(`option`);t.value=e.fontFamily,t.textContent=`${e.fontFamily} (Custom)`,Y.appendChild(t)}Y.value=e.fontFamily,Ra.value=e.fontSize,za.value=String(e.fontWeight),Ba.value=e.color}if(n){let t=e.type===`line`;Ha.hidden=t,t||(Ua.value=jo(e.fill,`#324638`)),Wa.value=jo(t?e.color:e.stroke,`#a8d9a8`),Ga.value=e.strokeWidth||1}}function jo(e,t){return typeof e==`string`&&/^#[0-9a-f]{6}$/i.test(e)?e:t}function Z(e){let t=O();t&&ae(t.id,e)}Aa.addEventListener(`input`,()=>{Z({text:Aa.value})}),ja.addEventListener(`change`,()=>{Z({x:Number(ja.value)||0})}),Ma.addEventListener(`change`,()=>{Z({y:Number(Ma.value)||0})}),Na.addEventListener(`change`,()=>{Z({width:Math.max(1,Number(Na.value)||1)})}),Pa.addEventListener(`change`,()=>{Z({height:Math.max(1,Number(Pa.value)||1)})}),Y.addEventListener(`change`,()=>{Z({fontFamily:Y.value})}),La&&Ia&&(La.addEventListener(`click`,()=>{Ia.click()}),Ia.addEventListener(`change`,async()=>{let e=Ia.files?.[0];if(!e)return;let t=document.querySelector(`#project-status`);try{t&&(t.textContent=`Loading font ${e.name}…`);let n=await vt(e);if(!Array.from(Y.options).some(e=>e.value===n)){let e=document.createElement(`option`);e.value=n,e.textContent=`${n} (Custom)`,Y.appendChild(e)}Y.value=n,Z({fontFamily:n}),t&&(t.textContent=`Loaded font: ${n}`)}catch(e){t&&(t.textContent=`Font error: ${e.message}`)}finally{Ia.value=``}})),Ra.addEventListener(`change`,()=>{Z({fontSize:Math.max(1,Number(Ra.value)||1)})}),za.addEventListener(`change`,()=>{Z({fontWeight:Number(za.value)})}),Ba.addEventListener(`input`,()=>{Z({color:Ba.value})}),Ua.addEventListener(`input`,()=>{Z({fill:Ua.value})}),Wa.addEventListener(`input`,()=>{let e=O();if(e){if(e.type===`line`){Z({color:Wa.value});return}Z({stroke:Wa.value})}}),Ga.addEventListener(`change`,()=>{Z({strokeWidth:Math.max(1,Number(Ga.value)||1)})}),Ka.addEventListener(`click`,()=>{let e=O();e&&re(e.id)}),window.addEventListener(`keydown`,e=>{let t=e.target,n=t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement;if(n)return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`z`){e.preventDefault(),e.shiftKey?w():C();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`y`){e.preventDefault(),w();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`v`&&ue()){e.preventDefault(),pe(),Q(`Pasted element from clipboard`,`info`);return}if(e.key===`?`&&!n){e.preventDefault(),Fo();return}e.key===`Escape`&&Io();let r=O();if(!r)return;if(e.key===`Delete`||e.key===`Backspace`){re(r.id),e.preventDefault();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`d`){e.preventDefault(),de(r.id);return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`c`){e.preventDefault(),fe(r.id),vo();return}if(e.key===`PageUp`||e.key===`]`){e.preventDefault(),ge(r.id,e.shiftKey?`front`:`up`);return}if(e.key===`PageDown`||e.key===`[`){e.preventDefault(),ge(r.id,e.shiftKey?`back`:`down`);return}let i=e.shiftKey?5:1,a=r.x,o=r.y;if(e.key===`ArrowLeft`)a-=i;else if(e.key===`ArrowRight`)a+=i;else if(e.key===`ArrowUp`)o-=i;else if(e.key===`ArrowDown`)o+=i;else return;a=Math.max(0,Math.min(u.display.width-r.width,a)),o=Math.max(0,Math.min(u.display.height-r.height,o)),ae(r.id,{x:a,y:o}),e.preventDefault()});function Mo(){let e=u.display.width,t=u.display.height,n=e>=t?`Landscape`:`Portrait`;_a.value=e,va.value=t,ya.value=u.display.background,ba.value=u.display.background.toUpperCase(),xa.textContent=n,ga.textContent=`${e} × ${t} px`,Sa.textContent=`${e} × ${t} px`,Ca.textContent=n,ha.textContent=`${Math.round(u.view.scale*100)}%`,qa.checked=u.grid.enabled,Ja.checked=u.grid.snap,no&&(no.checked=!!u.overlay?.enabled),ro&&(ro.value=String(u.overlay?.opacity??.4)),vo();let r=document.querySelector(`#canvas-quickstart`);r&&(r.hidden=u.elements.length>0||!!u.reference.src);let i=document.querySelector(`#hardware-preset-select`);i&&(i.value=Object.keys(xe).find(n=>xe[n].width===e&&xe[n].height===t)||``);let a=document.querySelector(`.display-frame`);a&&u.hardwareShellEnabled&&Fi(a,{width:e,height:t,enabled:!0}),Oo(),Ao()}E(()=>{st(),Mo()});var No=null;window.addEventListener(`resize`,()=>{clearTimeout(No),No=setTimeout(X,100)}),st(),Mo(),requestAnimationFrame(()=>{X()}),je({refreshReference:Co,fitWorkspace:X,isAnalyzing:()=>So||xo}),He(u),Ke(u),Xe(u);function Q(e,t=`info`){let n=document.querySelector(`#toast-container`);if(!n)return;let r=document.createElement(`div`);r.className=`toast-item toast-${t}`,r.innerHTML=`<span>${t===`warn`?`⚠️`:t===`error`?`❌`:`✅`}</span> <span>${e}</span>`,n.appendChild(r),setTimeout(()=>{r.classList.add(`toast-out`),setTimeout(()=>r.remove(),250)},2500)}function Po(){let e=document.querySelector(`#hardware-preset-select`);e&&e.addEventListener(`change`,()=>{let t=e.value;if(t&&xe[t]){Se(t);let e=xe[t];Q(`Target display set to ${e.name}`,`info`)}})}var $=document.querySelector(`#shortcuts-modal`);function Fo(){$&&($.removeAttribute(`hidden`),$.hidden=!1,$.classList.add(`open`),$.style.display=`flex`)}function Io(){$&&($.setAttribute(`hidden`,``),$.hidden=!0,$.classList.remove(`open`),$.style.display=`none`)}function Lo(){let e=document.querySelector(`#shortcuts-button`),t=document.querySelector(`#shortcuts-close`);e?.addEventListener(`click`,Fo),t?.addEventListener(`click`,Io),$?.addEventListener(`click`,e=>{e.target===$&&Io()})}function Ro(){let e=document.querySelector(`#canvas-quickstart`);e&&e.querySelectorAll(`.quickstart-card-btn`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.sampleId,n=kt.find(e=>e.id===t);n&&(Q(`Loading ${n.title}...`,`info`),await wo(Dt(n.url,n.title))&&q.click())})})}Po(),Lo(),Ro();function zo(){document.querySelector(`#share-project`)?.addEventListener(`click`,async()=>{try{let e=await Mi(u);if(!e){Q(`Empty project cannot be shared`,`warn`);return}window.location.hash=`p=${e}`,navigator.clipboard&&navigator.clipboard.writeText?(await navigator.clipboard.writeText(window.location.href),Q(`🔗 Share URL copied to clipboard! (Lossless permalink)`,`info`)):Q(`URL updated in address bar!`,`info`)}catch(e){console.error(e),Q(`Failed to create share link`,`error`)}}),window.location.hash&&window.location.hash.startsWith(`#p=`)&&Ni(window.location.hash).then(e=>{e&&e.display&&Array.isArray(e.elements)&&(Object.assign(u,{display:e.display,elements:e.elements,selectedId:null}),D(),X(),Q(`✨ Loaded shared mockup from URL!`,`info`))}).catch(e=>{console.warn(`Could not load project from URL:`,e)})}function Bo(){let e=document.querySelector(`#toggle-simulation`);e&&e.addEventListener(`click`,()=>{if(zi())Ui(u,()=>{st(),e.innerHTML=`▶ Live Preview`,e.classList.remove(`active`),document.querySelector(`.workspace`)?.classList.remove(`simulating`),Q(`Simulation stopped — original state restored`,`info`)});else{if(!u.elements||u.elements.length===0){Q(`Add or load some elements first to simulate`,`warn`);return}Vi(u,()=>{st()})&&(e.innerHTML=`⏸ Stop Sim`,e.classList.add(`active`),document.querySelector(`.workspace`)?.classList.add(`simulating`),Q(`▶ Live simulation running (clock & telemetry active)`,`info`))}})}function Vo(){let e=document.querySelector(`#toggle-hardware-shell`),t=document.querySelector(`.display-frame`);e&&t&&e.addEventListener(`click`,()=>{u.hardwareShellEnabled=!u.hardwareShellEnabled,Fi(t,{width:u.display.width,height:u.display.height,enabled:u.hardwareShellEnabled}),e.classList.toggle(`active`,!!u.hardwareShellEnabled),Q(u.hardwareShellEnabled?`🔘 Breakout PCB & bezel frame enabled`:`Display shell hidden`,`info`)})}zo(),Bo(),Vo();function Ho(){let e=document.querySelector(`#tab-mode-lcd`),t=document.querySelector(`#tab-mode-dither`),n=document.querySelector(`#mode-container-lcd`),r=document.querySelector(`#mode-container-dither`);e?.addEventListener(`click`,()=>{e.classList.add(`active`),t?.classList.remove(`active`),n&&(n.hidden=!1),r&&(r.hidden=!0)}),t?.addEventListener(`click`,()=>{t.classList.add(`active`),e?.classList.remove(`active`),r&&(r.hidden=!1),n&&(n.hidden=!0)});let i=document.querySelector(`#dither-contrast`),a=document.querySelector(`#dither-contrast-val`);i?.addEventListener(`input`,()=>{let e=parseInt(i.value,10);a&&(a.textContent=(e>0?`+`:``)+e+`%`)});let o=document.querySelector(`#dither-brightness`),s=document.querySelector(`#dither-brightness-val`);o?.addEventListener(`input`,()=>{let e=parseInt(o.value,10);s&&(s.textContent=(e>0?`+`:``)+e+`%`)});let c=document.querySelector(`#dither-threshold`),l=document.querySelector(`#dither-threshold-val`);c?.addEventListener(`input`,()=>{l&&(l.textContent=c.value)});let d=document.querySelector(`#telegraphic-max-thickness`),f=document.querySelector(`#telegraphic-max-thickness-val`);d?.addEventListener(`input`,()=>{f&&(f.textContent=d.value+` px`)});let p=document.querySelector(`#dither-algo-select`),m=document.querySelector(`#telegraphic-options-box`),h=document.querySelector(`#apply-dither-button`);function g(){let e=p?.value===`telegraphic`;m&&(m.hidden=!e);let t=document.querySelector(`#modulation-field`),n=document.querySelector(`#max-thickness-group`),r=document.querySelector(`#threshold-slider-group`);t&&(t.hidden=!e),n&&(n.hidden=!e),r&&(r.hidden=e),h&&(h.textContent=e?`📡 Telgraf Gravürü Oluştur`:`✨ 1-Bit Gravüre Dönüştür`)}p?.addEventListener(`change`,g),g();async function _(){if(!u.reference.src){Q(`Please upload an image or portrait first`,`warn`);return}let e=document.querySelector(`#apply-dither-button`);e&&(e.disabled=!0);try{let e=p?.value===`telegraphic`;Q(e?`📡 Generating authentic retro telegraph / wirephoto scanline engraving...`:`Converting to high-detail 1-bit dither art...`,`info`);let t=await At(u.reference.src),n=document.querySelector(`#dither-target-select`)?.value||`fit`,r=document.querySelector(`#dither-algo-select`)?.value||`telegraphic`,i=parseInt(document.querySelector(`#dither-contrast`)?.value||`25`,10),a=parseInt(document.querySelector(`#dither-brightness`)?.value||`0`,10),o=parseInt(document.querySelector(`#dither-threshold`)?.value||`128`,10),s=!!document.querySelector(`#dither-invert`)?.checked,c=parseInt(document.querySelector(`#telegraphic-spacing`)?.value||`4`,10),l=document.querySelector(`#telegraphic-angle`)?.value||`horizontal`,d=document.querySelector(`#telegraphic-modulation`)?.value||`continuous`,f=parseFloat(document.querySelector(`#telegraphic-max-thickness`)?.value||`4.5`),m=u.display.width,h=u.display.height;if(isAvatarOnly){let e=Math.min(80,Math.max(32,Math.round(u.display.height*.75)));m=e,h=e}else if(n===`ssd1306`)m=128,h=64;else if(n===`badge`)m=250,h=122;else if(n===`nokia`)m=84,h=48;else if(n===`smartwatch`)m=128,h=128;else if(n===`proportional`){let e=t.naturalWidth/(t.naturalHeight||1);e>=1?(m=Math.min(t.naturalWidth,256),h=Math.max(16,Math.round(m/e))):(h=Math.min(t.naturalHeight,256),m=Math.max(16,Math.round(h*e)))}let g=document.createElement(`canvas`);g.width=m,g.height=h;let _=g.getContext(`2d`);_.imageSmoothingEnabled=!0,_.imageSmoothingQuality=`high`,_.drawImage(t,0,0,m,h);let v=_.getImageData(0,0,m,h),y=u.display.background||`#18211b`,b=y===`#000000`||y===`#18211b`||y.startsWith(`#0`)||y.startsWith(`#1`)?`#a8d9a8`:`#18211b`,x=ta(v,{algorithm:r,lineSpacing:c,angle:l,modulation:d,maxThickness:f,contrast:i,brightness:a,threshold:o,invert:s,fgColor:b,bgColor:y}).createImageData(b,y);_.putImageData(x,0,0);let S=g.toDataURL(`image/png`);Re(S,g);let C=isAvatarOnly?`Dithered Avatar`:e?`Telgraf / Wirephoto Gravürü`:`1-Bit Dither Portrait`,w={id:`bmp_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,type:`bitmap`,name:C,x:isAvatarOnly?10:0,y:isAvatarOnly?10:0,width:m,height:h,dataUrl:S,ditherMethod:r,contrast:i,brightness:a,threshold:o,invert:s};isAvatarOnly?(u.elements.push(w),u.selectedId=w.id,D(),Q(`✨ Dithered Avatar inserted into canvas!`,`info`)):(A({width:m,height:h}),u.elements=[w],u.selectedId=w.id,D(),requestAnimationFrame(()=>X()),Q(e?`📡 Telgraf / Wirephoto gravürü oluşturuldu! Mikrodenetleyici C kodları hazır.`:`✨ 1-Bit Dither Portrait generated! Click "Export C Code" for microcontroller code.`,`info`))}catch(e){console.error(`Dithering error:`,e),Q(`Dithering failed: `+e.message,`error`)}finally{e&&(e.disabled=!u.reference.src)}}document.querySelector(`#apply-dither-button`)?.addEventListener(`click`,_)}Ho();
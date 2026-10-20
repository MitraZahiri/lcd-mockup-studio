import{$ as e,A as t,B as n,C as r,D as i,E as a,F as o,G as s,H as c,I as l,J as u,K as d,L as f,M as p,N as m,O as h,P as g,Q as _,R as v,S as ee,T as y,U as b,V as x,W as S,X as te,Y as ne,Z as re,_ as C,a as ie,b as ae,c as oe,d as se,et as w,f as ce,g as le,h as ue,j as de,k as fe,l as pe,nt as me,q as he,t as ge,tt as T,u as _e,v as ve,w as ye,y as be,z as E}from"./dithering-D2desjM0.js";var xe=()=>({src:null,fileName:null,naturalWidth:0,naturalHeight:0});function Se(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(Error(`The reference image could not be saved.`)),r.readAsDataURL(e)})}function Ce(e){return e?new Promise((t,n)=>{let r=new Image;r.onload=()=>{r.naturalWidth!==e.naturalWidth||r.naturalHeight!==e.naturalHeight?n(Error(`Reference image dimensions do not match the project.`)):t()},r.onerror=()=>n(Error(`The embedded reference image is damaged.`)),r.src=e.src}):Promise.resolve()}function we({refreshReference:e,fitWorkspace:t,isAnalyzing:n}){let i=document.querySelector(`#new-project`),a=document.querySelector(`#open-project`),o=document.querySelector(`#save-project`),c=document.querySelector(`#project-file-input`),u=document.querySelector(`#project-title`),d=document.querySelector(`#project-status`),f=`Untitled Project`,p=!1,m=()=>JSON.stringify(r(l,f)),h=m();s();let g=()=>m()!==h,v=()=>{u.textContent=`${f}${g()?` *`:``}`};_(v);function y(e){p=e,i.disabled=a.disabled=o.disabled=e}function b(){return!n()||(window.alert(`Wait for image analysis or reference loading to finish.`),!1)}function x(){return!g()||window.confirm(`Replace the current project? Unsaved changes will be lost.`)}function S(n){let r=l.reference.src;Object.assign(l,{display:n.display,elements:n.elements,grid:n.grid,reference:n.reference??xe(),selectedId:null,view:{scale:1}}),f=n.name||`Untitled Project`,h=m(),r?.startsWith(`blob:`)&&URL.revokeObjectURL(r),e(),s(),E(),requestAnimationFrame(t)}i.addEventListener(`click`,()=>{!p&&b()&&x()&&(S({name:`Untitled Project`,display:{width:800,height:480,background:`#18211b`},elements:[],reference:null,grid:{enabled:!0,snap:!0,size:10}}),d.textContent=`New project`)}),a.addEventListener(`click`,()=>{!p&&b()&&c.click()}),c.addEventListener(`change`,async()=>{let e=c.files?.[0];if(c.value=``,e&&!p&&b()){y(!0),d.textContent=`Opening project…`;try{if(e.size>33554432)throw Error(`Project exceeds the 32 MB limit.`);let t=ee(await e.text());if(await Ce(t.reference),!b()||!x()){d.textContent=`Open cancelled`;return}S(t),d.textContent=`Project opened`}catch(e){d.textContent=`Could not open project`,window.alert(e.message)}finally{y(!1)}}});async function te(){if(p||!b())return;let e=window.prompt(`Project name`,f);if(e===null)return;let t=e.trim()||`Untitled Project`;if(t.length>200){window.alert(`Use a project name of at most 200 characters.`);return}let n=r(l,t),i=JSON.stringify(n);y(!0),d.textContent=`Preparing download…`;try{if(n.reference?.src.startsWith(`blob:`)){let e=await fetch(n.reference.src);if(!e.ok)throw Error(`The reference image could not be read.`);n.reference.src=await Se(await e.blob())}let e=new Blob([JSON.stringify(ye(n),null,2)],{type:`application/json`});if(e.size>33554432)throw Error(`Project exceeds the 32 MB limit.`);let r=URL.createObjectURL(e),a=document.createElement(`a`);a.href=r,a.download=`${t.replace(/[^\p{L}\p{N}._-]+/gu,`-`).replace(/^\.+/,``)||`project`}.lcd.json`,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(r),1e3),f=t,h=i,v(),d.textContent=`Project download started`}catch(e){d.textContent=`Could not save project`,window.alert(e.message)}finally{y(!1)}}o.addEventListener(`click`,te),window.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`s`&&(e.preventDefault(),te())}),window.addEventListener(`beforeunload`,e=>{g()&&(e.preventDefault(),e.returnValue=``)}),v()}function D(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&apos;`)}function Te(e,t){if(!Number.isInteger(e)||!Number.isInteger(t)||e<1||t<1||e>16384||t>16384||e*t>16777216)throw Error(`Use whole-pixel dimensions up to 16,384 per side and 16 megapixels total for SVG export.`)}function Ee(e){let{width:t,height:n,background:r}=e.display;Te(t,n);let i=[],a=[];for(let t of e.elements)if(t.type===`text`){let e=`clip-${t.id}`;a.push(`    <clipPath id="${D(e)}"><rect x="${t.x}" y="${t.y}" width="${t.width}" height="${t.height}" /></clipPath>`);let n=String(t.text??``).replace(/[\t\n\r\f ]+/g,` `).replace(/^ | $/g,``),r=D(t.fontFamily||`monospace`),o=D(t.color||`#a8d9a8`),s=D(t.fontWeight||`400`),c=Number(t.fontSize)||12,l=t.y+t.height/2;i.push(`  <g clip-path="url(#${D(e)})">\n    <text x="${t.x}" y="${l}" dominant-baseline="central" fill="${o}" font-family="${r}" font-size="${c}px" font-weight="${s}" xml:space="preserve">${D(n)}</text>\n  </g>`)}else if(t.type===`rectangle`){let e=Number(t.strokeWidth)||0,n=D(t.stroke||`transparent`),r=D(t.fill||`transparent`);if(e>0&&t.stroke&&t.stroke!==`transparent`){let a=e/2,o=t.x+a,s=t.y+a,c=Math.max(0,t.width-e),l=Math.max(0,t.height-e);i.push(`  <rect x="${o}" y="${s}" width="${c}" height="${l}" fill="${r}" stroke="${n}" stroke-width="${e}" />`)}else i.push(`  <rect x="${t.x}" y="${t.y}" width="${t.width}" height="${t.height}" fill="${r}" />`)}else if(t.type===`circle`){let e=Number(t.strokeWidth)||0,n=D(t.stroke||`transparent`),r=D(t.fill||`transparent`),a=t.x+t.width/2,o=t.y+t.height/2,s=Math.max(0,t.width/2-e/2),c=Math.max(0,t.height/2-e/2);e>0&&t.stroke&&t.stroke!==`transparent`?i.push(`  <ellipse cx="${a}" cy="${o}" rx="${s}" ry="${c}" fill="${r}" stroke="${n}" stroke-width="${e}" />`):i.push(`  <ellipse cx="${a}" cy="${o}" rx="${t.width/2}" ry="${t.height/2}" fill="${r}" />`)}else if(t.type===`line`){let e=Number(t.strokeWidth)||1,n=D(t.color||`#a8d9a8`),r=t.y+(t.height-e)/2;i.push(`  <rect x="${t.x}" y="${r}" width="${t.width}" height="${e}" fill="${n}" />`)}else if(t.type===`bitmap`){let e=D(t.dataUrl||``);i.push(`  <image href="${e}" x="${t.x}" y="${t.y}" width="${t.width}" height="${t.height}" image-rendering="pixelated" />`)}else throw Error(`Cannot export element type to SVG: ${t.type}`);let o=a.length>0?`  <defs>\n${a.join(`
`)}\n  </defs>\n`:``;return`<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t} ${n}" width="${t}" height="${n}">\n`+o+`  <rect width="${t}" height="${n}" fill="${D(r)}" />\n`+i.join(`
`)+`
</svg>
`}function De(e){let t=structuredClone({display:e.display,elements:e.elements}),n=Ee(t);return{blob:new Blob([n],{type:`image/svg+xml;charset=utf-8`}),width:t.display.width,height:t.display.height,svgString:n}}function Oe(e){let t=document.querySelector(`#export-svg`),n=document.querySelector(`#project-status`);if(!t)return;let r=!1;t.addEventListener(`click`,()=>{if(!r){r=!0,t.disabled=!0,t.textContent=`Exporting…`,n&&(n.textContent=`Preparing SVG…`);try{let{blob:t,width:r,height:i}=De(e),a=URL.createObjectURL(t),o=document.createElement(`a`);o.href=a,o.download=`lcd-mockup-${r}x${i}.svg`,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(a),1e3),n&&(n.textContent=`SVG download started (${r} × ${i} px)`)}catch(e){n&&(n.textContent=`SVG export failed: ${e.message}`)}finally{r=!1,t.disabled=!1,t.textContent=`Export SVG`}}})}function ke(e,t,n,r={}){let{snap:i=!1,snapSize:a=10,displayWidth:o=16384,displayHeight:s=16384,minWidth:c=4,minHeight:l=4}=r,u=n.x,d=n.y;i&&a>0?(u=Math.round(u/a)*a,d=Math.round(d/a)*a):(u=Math.round(u),d=Math.round(d));let{x:f,y:p,width:m,height:h}=t,g=t.x+t.width,_=t.y+t.height;if(e.includes(`e`)){let e=t.width+u;m=Math.max(c,Math.min(o-f,e))}else if(e.includes(`w`)){let e=t.x+u;e=Math.max(0,Math.min(g-c,e)),m=g-e,f=e}if(e.includes(`s`)){let e=t.height+d;h=Math.max(l,Math.min(s-p,e))}else if(e.includes(`n`)){let e=t.y+d;e=Math.max(0,Math.min(_-l,e)),h=_-e,p=e}return{x:Math.round(f),y:Math.round(p),width:Math.round(m),height:Math.round(h)}}var O=null,k=null,A=null;function Ae(e){O=e,O.addEventListener(`pointerdown`,je),O.addEventListener(`dblclick`,Pe),window.addEventListener(`pointermove`,Me),window.addEventListener(`pointerup`,Ne),window.addEventListener(`pointercancel`,Ne),window.addEventListener(`blur`,Ne),O.addEventListener(`pointerleave`,()=>{let e=document.querySelector(`#status-coords`);e&&!k&&!A&&(e.textContent=``)})}function je(e){let t=e.target.closest(`.resize-handle`);if(t){let n=t.dataset.handle,r=t.dataset.elementId,i=l.elements.find(e=>e.id===r);if(!i)return;A={id:r,handle:n,startMouseX:e.clientX,startMouseY:e.clientY,startBox:{x:i.x,y:i.y,width:i.width,height:i.height}},e.preventDefault(),e.stopPropagation();return}let n=e.target.closest(`[data-element-id]`);if(!n){d(null);return}let r=n.dataset.elementId,i=l.elements.find(e=>e.id===r);i&&(d(r),k={id:r,startMouseX:e.clientX,startMouseY:e.clientY,startX:i.x,startY:i.y},e.preventDefault())}function Me(e){let t=document.querySelector(`#status-coords`);if(t&&O){let n=O.getBoundingClientRect(),r=l.view.scale||1,i=Math.floor((e.clientX-n.left)/r),a=Math.floor((e.clientY-n.top)/r);i>=0&&i<l.display.width&&a>=0&&a<l.display.height?t.textContent=`X: ${i}  Y: ${a}`:!k&&!A&&(t.textContent=``)}if(A){let t=l.elements.find(e=>e.id===A.id);if(!t)return;let n=l.view.scale||1,r=(e.clientX-A.startMouseX)/n,i=(e.clientY-A.startMouseY)/n,a=ke(A.handle,A.startBox,{x:r,y:i},{snap:l.grid.snap,snapSize:l.grid.size,displayWidth:l.display.width,displayHeight:l.display.height,minWidth:t.type===`circle`?10:4,minHeight:t.type===`circle`?10:t.type===`line`?1:4});T(t.id,a,!1),j();return}if(!k)return;let n=l.elements.find(e=>e.id===k.id);if(!n)return;let r=l.view.scale||1,i=(e.clientX-k.startMouseX)/r,a=(e.clientY-k.startMouseY)/r,o=k.startX+i,s=k.startY+a;if(l.grid.snap){let e=l.grid.size;o=Math.round(o/e)*e,s=Math.round(s/e)*e}o=Math.max(0,Math.min(l.display.width-n.width,o)),s=Math.max(0,Math.min(l.display.height-n.height,s)),T(n.id,{x:Math.round(o),y:Math.round(s)},!1),j()}function Ne(){if(A){A=null,E();return}k&&(k=null,E())}function Pe(e){let t=e.target.closest(`[data-element-id]`);if(!t)return;let n=t.dataset.elementId,r=l.elements.find(e=>e.id===n);if(!r||r.type!==`text`||t.querySelector(`.inline-text-editor`))return;let i=document.createElement(`input`);i.type=`text`,i.className=`inline-text-editor`,i.value=r.text||``,i.style.position=`absolute`,i.style.left=`0`,i.style.top=`0`,i.style.width=`100%`,i.style.height=`100%`,i.style.fontSize=`${r.fontSize}px`,i.style.fontFamily=r.fontFamily||`monospace`,i.style.fontWeight=String(r.fontWeight||`400`),i.style.color=r.color,i.style.background=`rgba(0, 0, 0, 0.85)`,i.style.border=`1px solid #8be28b`,i.style.outline=`none`,i.style.padding=`0 4px`,i.style.zIndex=`500`;function a(){if(i.parentNode){let e=i.value;i.remove(),T(r.id,{text:e})}}i.addEventListener(`blur`,a),i.addEventListener(`keydown`,e=>{e.key===`Enter`?a():e.key===`Escape`&&i.remove(),e.stopPropagation()}),t.appendChild(i),i.focus(),i.select()}function j(){if(!O)return;let{width:e,height:t,background:n}=l.display,r=l.view.scale||1;O.style.width=`${e}px`,O.style.height=`${t}px`,O.style.backgroundColor=n,O.style.transform=`scale(${r})`,O.style.transformOrigin=`center center`,O.classList.toggle(`grid-enabled`,l.grid.enabled),O.style.setProperty(`--grid-size`,`${l.grid.size}px`),O.innerHTML=``;for(let e of l.elements)O.appendChild(Fe(e));if(l.overlay?.enabled&&l.reference?.src){let e=document.createElement(`img`);e.className=`canvas-reference-overlay`,e.src=l.reference.src,e.alt=`Reference Overlay`,e.style.position=`absolute`,e.style.left=`0`,e.style.top=`0`,e.style.width=`100%`,e.style.height=`100%`,e.style.objectFit=`fill`,e.style.opacity=String(l.overlay.opacity??.4),e.style.pointerEvents=`none`,e.style.zIndex=`100`,O.appendChild(e)}}function Fe(e){let t=document.createElement(`div`);return t.className=`canvas-element`,t.dataset.elementId=e.id,t.style.left=`${e.x}px`,t.style.top=`${e.y}px`,t.style.width=`${e.width}px`,t.style.height=`${e.height}px`,e.id===l.selectedId&&(t.classList.add(`selected`),Ve(t,e)),e.type===`text`&&Le(t,e),e.type===`rectangle`&&Re(t,e),e.type===`circle`&&ze(t,e),e.type===`line`&&Be(t,e),e.type===`bitmap`&&Ie(t,e),t}function Ie(e,t){e.classList.add(`element-bitmap`);let n=e.querySelector(`img`);n||(n=document.createElement(`img`),n.className=`canvas-bitmap-img`,n.style.width=`100%`,n.style.height=`100%`,n.style.objectFit=`fill`,n.style.imageRendering=`pixelated`,n.style.pointerEvents=`none`,n.style.userSelect=`none`,n.draggable=!1,e.appendChild(n)),n.src=t.dataUrl||``,n.style.opacity=t.opacity===void 0?`1`:String(t.opacity)}function Le(e,t){e.classList.add(`text-element`),e.textContent=t.text,e.style.color=t.color,e.style.fontSize=`${t.fontSize}px`,e.style.fontFamily=t.fontFamily,e.style.fontWeight=t.fontWeight,e.style.lineHeight=`1`}function Re(e,t){e.classList.add(`rectangle-element`),e.style.background=t.fill,e.style.border=`${t.strokeWidth}px solid ${t.stroke}`,e.style.boxSizing=`border-box`}function ze(e,t){e.classList.add(`circle-element`),e.style.background=t.fill,e.style.border=`${t.strokeWidth}px solid ${t.stroke}`,e.style.borderRadius=`50%`,e.style.boxSizing=`border-box`}function Be(e,t){e.classList.add(`line-element`);let n=document.createElement(`div`);n.style.width=`100%`,n.style.height=`${t.strokeWidth}px`,n.style.background=t.color,n.style.pointerEvents=`none`,e.appendChild(n)}function Ve(e,t){let n=t.type===`line`?[`w`,`e`]:[`nw`,`n`,`ne`,`e`,`se`,`s`,`sw`,`w`];for(let r of n){let n=document.createElement(`div`);n.className=`resize-handle handle-${r}`,n.dataset.handle=r,n.dataset.elementId=t.id,e.appendChild(n)}}var He=[`.ttf`,`.otf`,`.woff`,`.woff2`];function Ue(e){return!e||typeof e!=`string`?`CustomFont`:e.replace(/\.[^/.]+$/,``).replace(/[^a-zA-Z0-9_\-\s]/g,``).trim().replace(/\s+/g,` `)||`CustomFont`}function We(e){if(!e||!e.name)return!1;let t=e.name.toLowerCase();return He.some(e=>t.endsWith(e))}async function Ge(e){if(!We(e))throw Error(`Unsupported font format. Please upload .ttf, .otf, .woff, or .woff2 files.`);let t=Ue(e.name),n=await e.arrayBuffer();if(typeof FontFace>`u`)throw Error(`FontFace API is not supported in this environment.`);let r=new FontFace(t,n);return await r.load(),document?.fonts&&document.fonts.add(r),t}function Ke(e,t){let n=l.display.width||320,r=l.display.height||240;return{x:Math.max(0,Math.round((n-e)/2)),y:Math.max(0,Math.round((r-t)/2))}}function qe(e={}){let t=Math.max(40,e.width||60),n=Math.max(20,e.height||28),r=Ke(t,n),i=e.x===void 0?r.x:e.x,a=e.y===void 0?r.y:e.y,o=e.stroke||`#a8d9a8`,s=e.fill||`#a8d9a8`,c=e.level===void 0?3:e.level,l=t-6,u=[];u.push({id:m(),type:`rectangle`,name:`Battery Frame`,x:i,y:a,width:l,height:n,fill:`transparent`,stroke:o,strokeWidth:2});let d=Math.round(n*.45);u.push({id:m(),type:`rectangle`,name:`Battery Anode`,x:i+l,y:a+Math.round((n-d)/2),width:6,height:d,fill:s,stroke:o,strokeWidth:1});let f=l-8-4,p=Math.max(2,Math.floor(f/3)),h=n-8;for(let e=0;e<Math.min(3,Math.max(0,c));e++)u.push({id:m(),type:`rectangle`,name:`Battery Bar ${e+1}`,x:i+4+e*(p+2),y:a+4,width:p,height:h,fill:s,stroke:s,strokeWidth:1});return u}function Je(e={}){let t=Math.max(80,e.width||180),n=Math.max(16,e.height||26),r=Math.min(100,Math.max(0,e.percent===void 0?65:e.percent)),i=Ke(t,n),a=e.x===void 0?i.x:e.x,o=e.y===void 0?i.y:e.y,s=e.stroke||`#a8d9a8`,c=e.fill||`#a8d9a8`,l=[];l.push({id:m(),type:`rectangle`,name:`Progress Frame`,x:a,y:o,width:t,height:n,fill:`transparent`,stroke:s,strokeWidth:2});let u=t-6,d=Math.max(1,Math.round(r/100*u));return l.push({id:m(),type:`rectangle`,name:`Progress Fill`,x:a+3,y:o+3,width:d,height:n-6,fill:c,stroke:c,strokeWidth:1}),l.push({id:m(),type:`text`,name:`Progress Label`,x:a+t+8,y:o+Math.round((n-18)/2),width:48,height:18,text:`${r}%`,fontSize:14,fontFamily:`Courier New`,fontWeight:700,color:s}),l}function Ye(e={}){let t=Math.max(60,e.width||100),n=Math.max(20,e.height||32),r=e.label||`READY`,i=Ke(t,n),a=e.x===void 0?i.x:e.x,o=e.y===void 0?i.y:e.y,s=e.stroke||`#a8d9a8`,c=e.fill||`#25382b`,l=[];return l.push({id:m(),type:`rectangle`,name:`Badge Box`,x:a,y:o,width:t,height:n,fill:c,stroke:s,strokeWidth:2}),l.push({id:m(),type:`text`,name:`Badge Text`,x:a+4,y:o+Math.round((n-18)/2),width:t-8,height:18,text:r,fontSize:14,fontFamily:`Courier New`,fontWeight:700,color:s}),l}function Xe(e={}){let t=Math.max(100,e.width||140),n=Math.max(50,e.height||64),r=e.label||`TEMP`,i=e.value||`24.5`,a=e.unit||`°C`,o=Ke(t,n),s=e.x===void 0?o.x:e.x,c=e.y===void 0?o.y:e.y,l=e.stroke||`#a8d9a8`,u=[];return u.push({id:m(),type:`rectangle`,name:`${r} Card`,x:s,y:c,width:t,height:n,fill:`transparent`,stroke:l,strokeWidth:1}),u.push({id:m(),type:`text`,name:`${r} Header`,x:s+6,y:c+4,width:t-12,height:16,text:r,fontSize:10,fontFamily:`Courier New`,fontWeight:600,color:l}),u.push({id:m(),type:`text`,name:`${r} Value`,x:s+6,y:c+24,width:t-42,height:32,text:i,fontSize:22,fontFamily:`Courier New`,fontWeight:700,color:l}),u.push({id:m(),type:`text`,name:`${r} Unit`,x:s+t-36,y:c+32,width:30,height:20,text:a,fontSize:12,fontFamily:`Courier New`,fontWeight:600,color:l}),u}function Ze(e,t={}){let n=[];return e===`battery`?n=qe(t):e===`progress`?n=Je(t):e===`badge`?n=Ye(t):e===`gauge`&&(n=Xe(t)),n.length>0&&a(n),n}var M=null;function Qe(e){return new Promise((t,n)=>{if(!e){n(Error(`No file selected.`));return}if(!e.type.startsWith(`image/`)){n(Error(`Please select an image file.`));return}M&&URL.revokeObjectURL(M),M=URL.createObjectURL(e);let r=new Image;r.onload=()=>{me({src:M,fileName:e.name,naturalWidth:r.naturalWidth,naturalHeight:r.naturalHeight}),t({width:r.naturalWidth,height:r.naturalHeight,src:M})},r.onerror=()=>{n(Error(`Image could not be loaded.`))},r.src=M})}function $e(){let e=l.reference;e.src&&w({width:e.naturalWidth,height:e.naturalHeight})}function et(e,t=`sample.png`){return new Promise((n,r)=>{M&&=(URL.revokeObjectURL(M),null);let i=new Image;i.crossOrigin=`anonymous`,i.onload=()=>{me({src:e,fileName:t,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight}),n({width:i.naturalWidth,height:i.naturalHeight,src:e})},i.onerror=()=>{r(Error(`Sample image could not be loaded.`))},i.src=e})}function tt(){M&&=(URL.revokeObjectURL(M),null),me({src:null,fileName:null,naturalWidth:0,naturalHeight:0})}var nt=[{id:`controller`,title:`🎛️ Industrial HMI`,subtitle:`128 × 64 Graphic LCD`,url:`./samples/controller.png`},{id:`marlin-3d`,title:`🖨️ 3D Printer (Marlin)`,subtitle:`128 × 64 Blue LCD`,url:`./samples/marlin-printer.png`},{id:`iot-weather`,title:`📟 IoT Weather Station`,subtitle:`128 × 64 ESP32 OLED`,url:`./samples/iot-station.png`}];async function rt(e){if(!e||!e.display)return``;let t={d:{w:e.display.width,h:e.display.height,b:e.display.background},e:(e.elements||[]).map(e=>{let t={i:e.id,t:e.type,x:e.x,y:e.y,w:e.width,h:e.height};return e.text===void 0?e.content!==void 0&&(t.c=e.content):t.c=e.text,e.fontFamily&&(t.f=e.fontFamily),e.fontSize&&(t.s=e.fontSize),e.color&&(t.cl=e.color),e.stroke&&(t.st=e.stroke),e.strokeWidth&&(t.sw=e.strokeWidth),e.fill&&(t.fl=e.fill),e.radius!==void 0&&(t.r=e.radius),e.x1!==void 0&&(t.x1=e.x1),e.y1!==void 0&&(t.y1=e.y1),e.x2!==void 0&&(t.x2=e.x2),e.y2!==void 0&&(t.y2=e.y2),e.symbolSubtype&&(t.sub=e.symbolSubtype),e.value!==void 0&&(t.val=e.value),e.max!==void 0&&(t.max=e.max),t})},n=JSON.stringify(t),r=new Blob([n]).stream().pipeThrough(new CompressionStream(`deflate-raw`)),i=await new Response(r).arrayBuffer(),a=new Uint8Array(i),o=``;for(let e=0;e<a.length;e++)o+=String.fromCharCode(a[e]);return btoa(o).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}async function it(e){if(!e)return null;let t=e.replace(/^#p=/,``).replace(/^#/,``).trim();if(!t)return null;for(t=t.replace(/-/g,`+`).replace(/_/g,`/`);t.length%4!=0;)t+=`=`;let n=atob(t),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);let i=new Blob([r]).stream().pipeThrough(new DecompressionStream(`deflate-raw`)),a=await new Response(i).text(),o=JSON.parse(a);return{display:{width:o.d?.w||128,height:o.d?.h||64,background:o.d?.b||`#18211b`},elements:(o.e||[]).map((e,t)=>({id:e.i||`el_${t}_${Math.random().toString(36).slice(2,6)}`,type:e.t||`text`,x:e.x||0,y:e.y||0,width:e.w||10,height:e.h||10,...e.c===void 0?{}:{content:e.c,text:e.c},...e.f?{fontFamily:e.f}:{},...e.s?{fontSize:e.s}:{},...e.cl?{color:e.cl}:{},...e.st?{stroke:e.st}:{},...e.sw?{strokeWidth:e.sw}:{},...e.fl?{fill:e.fl}:{},...e.r===void 0?{}:{radius:e.r},...e.x1===void 0?{}:{x1:e.x1},...e.y1===void 0?{}:{y1:e.y1},...e.x2===void 0?{}:{x2:e.x2},...e.y2===void 0?{}:{y2:e.y2},...e.sub?{symbolSubtype:e.sub}:{},...e.val===void 0?{}:{value:e.val},...e.max===void 0?{}:{max:e.max}}))}}function at(e,t){return e===84&&t===48?`nokia`:e===160&&t===32?`charlcd`:e===128&&(t===64||t===32)?`oled`:`industrial`}function ot(e,{width:t,height:n,enabled:r}){if(!e)return;let i=e.querySelector(`.hardware-pcb-shell`);if(!r){i&&i.remove(),e.classList.remove(`has-hardware-shell`);return}e.classList.add(`has-hardware-shell`);let a=at(t,n);i||(i=document.createElement(`div`),i.className=`hardware-pcb-shell`,e.prepend(i)),i.dataset.deviceType=a;let o=[`GND`,`VCC`,`SCL`,`SDA`],s=`0.96" I2C OLED (SSD1306)`;a===`nokia`?(o=[`RST`,`CE`,`DC`,`DIN`,`CLK`,`VCC`,`BL`,`GND`],s=`84×48 Graphic LCD (PCD8544)`):a===`charlcd`?(o=[`VSS`,`VDD`,`V0`,`RS`,`RW`,`E`,`D4`,`D5`,`D6`,`D7`,`A`,`K`],s=`16×2 Character LCD (HD44780)`):a===`industrial`&&(o=[`VSS`,`VDD`,`V0`,`RS`,`R/W`,`E`,`DB0..7`,`PSB`,`RST`],s=`${t}×${n} Industrial HMI Controller`),i.innerHTML=`
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
  `}var st=null,N=null,P=0;function ct(){return st!==null}function lt(e){let t=e.match(/^([^0-9.-]*)(-?\d+(?:\.\d+)?)(.*)$/);if(!t)return null;let n=t[2],r=n.includes(`.`)?n.split(`.`)[1].length:0;return{prefix:t[1],num:parseFloat(n),decimals:r,suffix:t[3]}}function ut(e,t){return ct()||!e||!Array.isArray(e.elements)?!1:(N=JSON.parse(JSON.stringify(e.elements)),P=0,st=setInterval(()=>{P++,dt(e),typeof t==`function`&&t()},500),!0)}function dt(e){if(!e||!Array.isArray(e.elements))return;let t=P%2==0;for(let n=0;n<e.elements.length;n++){let r=e.elements[n],i=N&&N[n];if(r.type===`text`){let e=i&&i.text||r.text||``,a=e.match(/^(\d{1,2})(:)(\d{2})(:?\d{0,2})(.*)$/);if(a){r.text=`${a[1]}${t?`:`:` `}${a[2],a[3]}${a[4]?t?a[4]:a[4].replace(`:`,` `):``}${a[5]||``}`;continue}if(/^\d{1,3}\s*%$/.test(e.trim())){let t=parseInt(e,10),n=Math.sin(P*.15)*5;r.text=`${Math.max(5,Math.min(100,Math.round(t+n)))}%`;continue}let o=lt(e);if(o&&(o.suffix.includes(`°`)||o.suffix.toLowerCase().includes(`c`)||o.suffix.toLowerCase().includes(`v`)||o.suffix.toLowerCase().includes(`hpa`)||o.suffix.toLowerCase().includes(`rpm`)||o.suffix.toLowerCase().includes(`bar`))){let e=Math.sin((P+n*3)*.25)*.4,t=(o.num+e).toFixed(o.decimals);r.text=`${o.prefix}${t}${o.suffix}`;continue}}if(r.type===`rect`&&r.fill&&i&&i.width>10&&i.width<(e.display?.width||128)){let e=i.width,t=Math.round(Math.sin((P+n)*.2)*6);r.width=Math.max(2,e+t)}}}function ft(e,t){return ct()?(clearInterval(st),st=null,e&&N&&(e.elements=JSON.parse(JSON.stringify(N)),N=null),typeof t==`function`&&t(),!0):!1}var pt=`lcd_hex_handoff`;document.querySelector(`#app`).innerHTML=`
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
          href="./tools/"
          class="shortcuts-button"
          id="free-tools-link"
          title="Free online tools: hex to image, image to C array, SSD1306 bitmap converter"
          style="text-decoration: none;"
        >
          🧰 Free Tools
        </a>

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
`;var mt=document.querySelector(`.display-canvas`),ht=document.querySelector(`#canvas-area`),gt=document.querySelector(`#reference-file-input`),_t=document.querySelector(`#upload-reference`),vt=document.querySelector(`#reference-preview`),F=document.querySelector(`#reference-preview-image`),yt=document.querySelector(`#reference-placeholder`),I=document.querySelector(`#reference-info`);document.querySelector(`#reference-name`),document.querySelector(`#reference-size`);var L=document.querySelector(`#analyze-reference`),R=document.querySelector(`#analysis-message`),z=document.querySelector(`#reference-actions`),bt=document.querySelector(`#match-reference-size`),xt=document.querySelector(`#remove-reference`),St=document.querySelector(`#fit-workspace`),Ct=document.querySelector(`#zoom-out`),wt=document.querySelector(`#zoom-in`),Tt=document.querySelector(`#zoom-label`),Et=document.querySelector(`#workspace-resolution`),Dt=document.querySelector(`#display-width`),Ot=document.querySelector(`#display-height`),kt=document.querySelector(`#display-background`),At=document.querySelector(`#display-background-text`),jt=document.querySelector(`#display-orientation`),Mt=document.querySelector(`#status-resolution`),Nt=document.querySelector(`#status-orientation`),Pt=document.querySelector(`#layers-list`),Ft=document.querySelector(`#layer-count`),It=document.querySelector(`#properties-empty`),Lt=document.querySelector(`#properties-content`),Rt=document.querySelector(`#property-type`),zt=document.querySelector(`#property-text-field`),Bt=document.querySelector(`#property-text`),Vt=document.querySelector(`#property-x`),Ht=document.querySelector(`#property-y`),Ut=document.querySelector(`#property-width`),Wt=document.querySelector(`#property-height`),Gt=document.querySelector(`#text-properties`),B=document.querySelector(`#property-font-family`),V=document.querySelector(`#font-file-input`),Kt=document.querySelector(`#load-custom-font-btn`),qt=document.querySelector(`#property-font-size`),Jt=document.querySelector(`#property-font-weight`),Yt=document.querySelector(`#property-text-color`),Xt=document.querySelector(`#shape-properties`),Zt=document.querySelector(`#property-fill-field`),Qt=document.querySelector(`#property-fill`),$t=document.querySelector(`#property-stroke`),en=document.querySelector(`#property-stroke-width`),tn=document.querySelector(`#bitmap-properties`),H=document.querySelector(`#property-bitmap-vectorize`),nn=document.querySelector(`#property-bitmap-invert`),rn=document.querySelector(`#property-bitmap-tint`),an=document.querySelector(`#property-bitmap-apply-tint`),on=document.querySelector(`#property-bitmap-opacity`),sn=document.querySelector(`#property-bitmap-opacity-val`),cn=document.querySelector(`#property-bitmap-open-decoder`),ln=document.querySelector(`#delete-element`),un=document.querySelector(`#grid-toggle`),dn=document.querySelector(`#snap-toggle`),fn=document.querySelector(`#undo-button`),pn=document.querySelector(`#redo-button`),mn=document.querySelector(`#duplicate-button`),hn=document.querySelector(`#copy-button`),gn=document.querySelector(`#paste-button`),_n=document.querySelector(`#duplicate-element`),vn=document.querySelector(`#overlay-controls`),U=document.querySelector(`#overlay-toggle`),W=document.querySelector(`#overlay-opacity`),yn=document.querySelector(`#lcd-preset-select`),bn=document.querySelector(`#layer-to-front`),xn=document.querySelector(`#layer-move-up`),Sn=document.querySelector(`#layer-move-down`),Cn=document.querySelector(`#layer-to-back`),wn=document.querySelector(`#align-left`),Tn=document.querySelector(`#align-center-h`),En=document.querySelector(`#align-right`),Dn=document.querySelector(`#align-top`),On=document.querySelector(`#align-center-v`),kn=document.querySelector(`#align-bottom`),An=document.querySelector(`#distribute-h`),jn=document.querySelector(`#distribute-v`);function G(){let e=!!l.selectedId,t=!!f(),n=l.elements.length>=3;mn&&(mn.disabled=!e),_n&&(_n.disabled=!e),hn&&(hn.disabled=!e),gn&&(gn.disabled=!t),bn&&(bn.disabled=!e),xn&&(xn.disabled=!e),Sn&&(Sn.disabled=!e),Cn&&(Cn.disabled=!e),wn&&(wn.disabled=!e),Tn&&(Tn.disabled=!e),En&&(En.disabled=!e),Dn&&(Dn.disabled=!e),On&&(On.disabled=!e),kn&&(kn.disabled=!e),An&&(An.disabled=!n),jn&&(jn.disabled=!n),vn&&(vn.hidden=!l.reference.src)}function Mn(){fn.disabled=!de(),pn.disabled=!t()}fn.addEventListener(`click`,()=>{e()}),pn.addEventListener(`click`,()=>{x()});function Nn(){let e=v();e&&o(e.id)}mn&&mn.addEventListener(`click`,Nn),_n&&_n.addEventListener(`click`,Nn),hn&&hn.addEventListener(`click`,()=>{let e=v();e&&(p(e.id),G())}),gn&&gn.addEventListener(`click`,()=>{n()}),U&&U.addEventListener(`change`,()=>{u(U.checked)}),W&&W.addEventListener(`input`,()=>{ne(W.value)}),yn&&yn.addEventListener(`change`,()=>{yn.value&&fe(yn.value)}),bn&&bn.addEventListener(`click`,()=>S(void 0,`front`)),xn&&xn.addEventListener(`click`,()=>S(void 0,`up`)),Sn&&Sn.addEventListener(`click`,()=>S(void 0,`down`)),Cn&&Cn.addEventListener(`click`,()=>S(void 0,`back`)),wn&&wn.addEventListener(`click`,()=>i(void 0,`left`)),Tn&&Tn.addEventListener(`click`,()=>i(void 0,`center`)),En&&En.addEventListener(`click`,()=>i(void 0,`right`)),Dn&&Dn.addEventListener(`click`,()=>i(void 0,`top`)),On&&On.addEventListener(`click`,()=>i(void 0,`middle`)),kn&&kn.addEventListener(`click`,()=>i(void 0,`bottom`)),An&&An.addEventListener(`click`,()=>g(`horizontal`)),jn&&jn.addEventListener(`click`,()=>g(`vertical`)),_(Mn),_(G),Mn(),G(),Ae(mt),document.querySelectorAll(`[data-element-type]`).forEach(e=>{e.addEventListener(`click`,()=>{pe(e.dataset.elementType)})}),document.querySelectorAll(`[data-stencil-type]`).forEach(e=>{e.addEventListener(`click`,()=>{Ze(e.dataset.stencilType)})});function Pn(e){if(!e)return;let t=new FileReader;t.onload=t=>{let n=t.target.result,r=new Image;r.onload=()=>{let t=r.naturalWidth||64,i=r.naturalHeight||64,a=e.name?e.name.replace(/\.[^/.]+$/,``):`Logo`,o=a.charAt(0).toUpperCase()+a.slice(1),s=oe({dataUrl:n,name:o,naturalWidth:t,naturalHeight:i});C(`image_upload`,{name:o,width:t,height:i}),Q(`✨ Added "${o}" (${s.width}×${s.height}px) to canvas!`,`info`)},r.src=n},t.readAsDataURL(e)}var Fn=document.querySelector(`#btn-upload-image-element`),K=document.querySelector(`#image-element-file-input`);Fn&&K&&(Fn.addEventListener(`click`,()=>{K.click()}),K.addEventListener(`change`,()=>{let e=K.files?.[0];e&&(Pn(e),K.value=``)}));var q=document.querySelector(`.workspace`);q&&(q.addEventListener(`dragover`,e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`),q.classList.add(`drag-over`)}),q.addEventListener(`dragleave`,e=>{e.preventDefault(),q.classList.remove(`drag-over`)}),q.addEventListener(`drop`,e=>{e.preventDefault(),q.classList.remove(`drag-over`);let t=e.dataTransfer?.files;if(t&&t.length>0){let e=t[0];e.type.startsWith(`image/`)&&Pn(e)}}));var In=!1,Ln=!1;function Rn(){let e=l.reference,t=!!e.src;if(t?F.src=e.src:F.removeAttribute(`src`),F.hidden=!t,yt.hidden=t,vt.classList.toggle(`empty`,!t),I&&(I.hidden=!t,t)){let e=document.querySelector(`#reference-name`),t=document.querySelector(`#reference-size`);e&&l.reference.name&&(e.textContent=l.reference.name),t&&l.reference.width&&(t.textContent=`${l.reference.width} × ${l.reference.height} px`)}z&&(z.hidden=!0),L&&(L.disabled=!t);let n=document.querySelector(`#apply-dither-button`);n&&(n.disabled=!t),R&&(R.hidden=!0)}async function zn(e){In=!0;try{R&&(R.hidden=!0);let t=await e;if(F.src=t.src,F.hidden=!1,yt.hidden=!0,vt.classList.remove(`empty`),I){I.hidden=!1;let e=document.querySelector(`#reference-name`),n=document.querySelector(`#reference-size`);e&&(e.textContent=t.name||`Image`),n&&(n.textContent=`${t.width} × ${t.height} px`)}z&&(z.hidden=!0),L&&(L.disabled=!1);let n=document.querySelector(`#apply-dither-button`);return n&&(n.disabled=!1),$e(),requestAnimationFrame(()=>X()),t}catch(e){return console.error(e),window.alert(e?.message||`Reference image could not be loaded.`),null}finally{In=!1}}_t.addEventListener(`click`,()=>{gt.click()}),gt.addEventListener(`change`,async()=>{let e=gt.files?.[0];e&&(await zn(Qe(e)),gt.value=``)}),window.addEventListener(`paste`,async e=>{let t=e.target;if(t?.tagName===`INPUT`||t?.tagName===`TEXTAREA`||t?.isContentEditable)return;let n=e.clipboardData?.items;if(n){for(let t of n)if(t.type.startsWith(`image/`)){let n=t.getAsFile();if(n){e.preventDefault(),await zn(Qe(n));break}}}});var Bn=document.querySelector(`#try-sample-btn`),J=document.querySelector(`#sample-dropdown-menu`);Bn&&J&&(J.innerHTML=nt.map(e=>`
      <button class="sample-dropdown-item" type="button" data-sample-id="${e.id}">
        <strong>${e.title}</strong>
        <span>${e.subtitle}</span>
      </button>
    `).join(``),Bn.addEventListener(`click`,e=>{e.stopPropagation(),J.hidden=!J.hidden}),document.addEventListener(`click`,()=>{J.hidden=!0}),J.addEventListener(`click`,async e=>{let t=e.target.closest(`.sample-dropdown-item`);if(!t)return;let n=t.dataset.sampleId,r=nt.find(e=>e.id===n);r&&(J.hidden=!0,await zn(et(r.url,r.title))&&L.click())})),bt.addEventListener(`click`,()=>{$e(),requestAnimationFrame(()=>X())}),xt.addEventListener(`click`,()=>{tt(),F.removeAttribute(`src`),F.hidden=!0,yt.hidden=!1,vt.classList.add(`empty`),I&&(I.hidden=!0),z.hidden=!0,L.disabled=!0,R&&(R.hidden=!0)}),L.addEventListener(`click`,async()=>{if(!l.reference.src)return;Ln=!0;let e=L.textContent;L.disabled=!0,L.textContent=`Analyzing...`,R.hidden=!1,R.className=`analysis-message`,R.textContent=`Analyzing image...`;try{let e=document.querySelector(`#opt-detect-text`)?.checked??!0,t=document.querySelector(`#opt-detect-frames`)?.checked??!0,n=document.querySelector(`#opt-detect-badges`)?.checked??!0,r=document.querySelector(`#opt-detect-circles`)?.checked??!0,i=document.querySelector(`#opt-detect-symbols`)?.checked??!0,a=document.querySelector(`#opt-auto-theme`)?.checked??!0,o=await se({detectText:e,detectFrames:t,detectBadges:n,detectCircles:r,detectSymbols:i});c(!1),a&&o.palette?.background&&w({background:o.palette.background});for(let e of o.elements)_e(e,!1);E(),requestAnimationFrame(()=>X()),R.hidden=!1,R.textContent=`✓ ${o.elements.length} elements detected`,Q(`✓ ${o.elements.length} LCD elements vectorized!`,`info`),setTimeout(()=>{Ln||(R.hidden=!0)},2500)}catch(e){console.error(e),R.className=`analysis-message error`,R.textContent=e?.message||`Analysis failed.`,Q(e?.message||`Analysis failed`,`warn`)}finally{L.disabled=!l.reference.src,L.textContent=e,Ln=!1}});var Y=document.querySelector(`#analyze-telegraphic`);Y?.addEventListener(`click`,async()=>{if(!l.reference.src)return;let e=Y.textContent;Y.disabled=!0,Y.textContent=`Scanning...`,Q(`📡 Scanning telegraph / wirephoto scanlines...`,`info`);try{let e=await ce(l.reference.src),t=l.display.width,n=l.display.height;if(l.display.width<=128&&e.naturalWidth>128){let r=e.naturalWidth/(e.naturalHeight||1);r>=1?(t=Math.min(e.naturalWidth,256),n=Math.max(32,Math.round(t/r))):(n=Math.min(e.naturalHeight,256),t=Math.max(32,Math.round(n*r))),w({width:t,height:n})}let r=document.createElement(`canvas`);r.width=t,r.height=n;let i=r.getContext(`2d`);i.imageSmoothingEnabled=!0,i.imageSmoothingQuality=`high`,i.drawImage(e,0,0,t,n);let a=i.getImageData(0,0,t,n),o=l.display.background||`#18211b`,s=o===`#000000`||o===`#18211b`||o.startsWith(`#0`)||o.startsWith(`#1`)?`#a8d9a8`:`#18211b`,c=ge(a,{algorithm:`telegraphic`,lineSpacing:4,minThickness:.4,maxThickness:4.5,contrast:25,brightness:0,invert:!1,fgColor:s,bgColor:o}).createImageData(s,o);i.putImageData(c,0,0);let u=r.toDataURL(`image/png`);ae(u,r);let d={id:`bmp_tele_${Date.now()}`,type:`bitmap`,name:`Telegraph / Wirephoto Engraving`,x:0,y:0,width:t,height:n,dataUrl:u,ditherMethod:`telegraphic`,contrast:25,brightness:0,threshold:128,invert:!1};l.elements=[d],l.selectedId=d.id,E(),requestAnimationFrame(()=>X()),Q(`📡 Telegraph / wirephoto engraving generated! C code and SVG updated.`,`info`)}catch(e){console.error(`Telegraphic scan error:`,e),Q(`Scan error: `+e.message,`error`)}finally{Y.disabled=!l.reference.src,Y.textContent=e}}),Dt.addEventListener(`change`,()=>{let e=Math.max(1,Number(Dt.value)||1);w({width:e}),X()}),Ot.addEventListener(`change`,()=>{let e=Math.max(1,Number(Ot.value)||1);w({height:e}),X()}),kt.addEventListener(`input`,()=>{w({background:kt.value})});function X(){let e=Math.max(100,ht.clientWidth-100),t=Math.max(100,ht.clientHeight-100),n=l.display.width,r=l.display.height;if(n<=0||r<=0)return;let i=e/n,a=t/r,o=Math.min(i,a);o=Math.min(4,Math.max(.1,o)),re(o)}St.addEventListener(`click`,X),Ct.addEventListener(`click`,()=>{let e=l.view.scale;re(e-.25)}),wt.addEventListener(`click`,()=>{let e=l.view.scale;re(e+.25)}),un.addEventListener(`change`,()=>{he(un.checked)}),dn.addEventListener(`change`,()=>{te(dn.checked)});function Vn(){if(Pt.innerHTML=``,Ft.textContent=String(l.elements.length),l.elements.length===0){let e=document.createElement(`div`);e.className=`layers-empty`,e.textContent=`No editable elements yet.`,Pt.appendChild(e);return}[...l.elements].reverse().forEach(e=>{let t=document.createElement(`button`);t.type=`button`,t.className=`layer-item`,e.id===l.selectedId&&t.classList.add(`active`);let n=document.createElement(`span`);n.className=`layer-icon`,n.textContent=Hn(e.type);let r=document.createElement(`span`);r.className=`layer-name`,r.textContent=e.type===`text`?e.text:e.name,t.append(n,r),t.addEventListener(`click`,()=>{d(e.id)}),Pt.appendChild(t)})}function Hn(e){return e===`text`?`T`:e===`rectangle`?`□`:e===`circle`?`○`:e===`line`?`─`:`•`}function Un(){let e=v();if(!e){It.hidden=!1,Lt.hidden=!0;return}It.hidden=!0,Lt.hidden=!1,Rt.textContent=e.type,Vt.value=e.x,Ht.value=e.y,Ut.value=e.width,Wt.value=e.height;let t=e.type===`text`,n=[`rectangle`,`circle`,`line`].includes(e.type);if(zt.hidden=!t,Gt.hidden=!t,Xt.hidden=!n,t){if(Bt.value=e.text,e.fontFamily&&!Array.from(B.options).some(t=>t.value===e.fontFamily)){let t=document.createElement(`option`);t.value=e.fontFamily,t.textContent=`${e.fontFamily} (Custom)`,B.appendChild(t)}B.value=e.fontFamily,qt.value=e.fontSize,Jt.value=String(e.fontWeight),Yt.value=e.color}if(n){let t=e.type===`line`;Zt.hidden=t,t||(Qt.value=Wn(e.fill,`#324638`)),$t.value=Wn(t?e.color:e.stroke,`#a8d9a8`),en.value=e.strokeWidth||1}let r=e.type===`bitmap`;if(tn&&(tn.hidden=!r,r)){let t=Math.round((e.opacity===void 0?1:e.opacity)*100);on&&(on.value=t),sn&&(sn.textContent=`${t}%`),rn&&e.tint&&(rn.value=e.tint)}}function Wn(e,t){return typeof e==`string`&&/^#[0-9a-f]{6}$/i.test(e)?e:t}function Z(e){let t=v();t&&T(t.id,e)}Bt.addEventListener(`input`,()=>{Z({text:Bt.value})}),Vt.addEventListener(`change`,()=>{Z({x:Number(Vt.value)||0})}),Ht.addEventListener(`change`,()=>{Z({y:Number(Ht.value)||0})}),Ut.addEventListener(`change`,()=>{Z({width:Math.max(1,Number(Ut.value)||1)})}),Wt.addEventListener(`change`,()=>{Z({height:Math.max(1,Number(Wt.value)||1)})}),B.addEventListener(`change`,()=>{Z({fontFamily:B.value})}),Kt&&V&&(Kt.addEventListener(`click`,()=>{V.click()}),V.addEventListener(`change`,async()=>{let e=V.files?.[0];if(!e)return;let t=document.querySelector(`#project-status`);try{t&&(t.textContent=`Loading font ${e.name}…`);let n=await Ge(e);if(!Array.from(B.options).some(e=>e.value===n)){let e=document.createElement(`option`);e.value=n,e.textContent=`${n} (Custom)`,B.appendChild(e)}B.value=n,Z({fontFamily:n}),t&&(t.textContent=`Loaded font: ${n}`)}catch(e){t&&(t.textContent=`Font error: ${e.message}`)}finally{V.value=``}})),qt.addEventListener(`change`,()=>{Z({fontSize:Math.max(1,Number(qt.value)||1)})}),Jt.addEventListener(`change`,()=>{Z({fontWeight:Number(Jt.value)})}),Yt.addEventListener(`input`,()=>{Z({color:Yt.value})}),Qt.addEventListener(`input`,()=>{Z({fill:Qt.value})}),$t.addEventListener(`input`,()=>{let e=v();if(e){if(e.type===`line`){Z({color:$t.value});return}Z({stroke:$t.value})}}),en.addEventListener(`change`,()=>{Z({strokeWidth:Math.max(1,Number(en.value)||1)})}),ln.addEventListener(`click`,()=>{let e=v();e&&b(e.id)});function Gn(e){return new Promise(t=>{let n=new Image;n.onload=()=>{let e=document.createElement(`canvas`);e.width=n.width,e.height=n.height;let r=e.getContext(`2d`);r.drawImage(n,0,0);let i=r.getImageData(0,0,e.width,e.height),a=i.data;for(let e=0;e<a.length;e+=4)a[e+3]>0&&(a[e]=255-a[e],a[e+1]=255-a[e+1],a[e+2]=255-a[e+2]);r.putImageData(i,0,0);let o=e.toDataURL(`image/png`);ae(o,e),t(o)},n.src=e})}function Kn(e,t){return new Promise(n=>{let r=new Image;r.onload=()=>{let e=document.createElement(`canvas`);e.width=r.width,e.height=r.height;let i=e.getContext(`2d`);i.drawImage(r,0,0);let a=i.getImageData(0,0,e.width,e.height),o=a.data,s=t.replace(`#`,``),c=parseInt(s.slice(0,2),16)||0,l=parseInt(s.slice(2,4),16)||0,u=parseInt(s.slice(4,6),16)||0;for(let e=0;e<o.length;e+=4){let t=.299*o[e]+.587*o[e+1]+.114*o[e+2];o[e+3]>20&&t>20&&(o[e]=c,o[e+1]=l,o[e+2]=u)}i.putImageData(a,0,0);let d=e.toDataURL(`image/png`);ae(d,e),n(d)},r.src=e})}H?.addEventListener(`click`,async()=>{let e=v();if(!e||e.type!==`bitmap`||!e.dataUrl)return;let t=H.textContent;H.disabled=!0,H.textContent=`⏳ Vectorizing...`;try{let t=await se({detectText:!0,detectFrames:!0,detectBadges:!0,detectCircles:!0,detectSymbols:!0},e.dataUrl);if(t&&t.elements&&t.elements.length>0){let n=e.x||0,r=e.y||0;b(e.id);for(let e of t.elements)_e({...e,x:(e.x||0)+n,y:(e.y||0)+r},!1);E(),Q(`✨ Converted bitmap to ${t.elements.length} editable elements!`,`info`)}else Q(`No distinct text or shape elements detected in this bitmap.`,`warn`)}catch(e){console.error(e),Q(`Vectorization error: `+e.message,`error`)}finally{H.disabled=!1,H.textContent=t}}),nn?.addEventListener(`click`,async()=>{let e=v();e&&e.type===`bitmap`&&e.dataUrl&&(Z({dataUrl:await Gn(e.dataUrl)}),E(),Q(`🔄 Bitmap pixels inverted`,`info`))}),an?.addEventListener(`click`,async()=>{let e=v();if(!e||e.type!==`bitmap`||!e.dataUrl)return;let t=rn?.value||`#a8d9a8`;Z({dataUrl:await Kn(e.dataUrl,t),tint:t}),E(),Q(`🎨 Applied tint color to bitmap`,`info`)}),on?.addEventListener(`input`,()=>{let e=Number(on.value)||100;sn&&(sn.textContent=`${e}%`),Z({opacity:e/100})}),cn?.addEventListener(`click`,()=>{let e=v();if(!e||e.type!==`bitmap`)return;let t=document.querySelector(`#reference-from-hex-btn`)||document.querySelector(`#open-hex-decoder`);t&&t.click()}),window.addEventListener(`keydown`,t=>{let r=t.target,i=r instanceof HTMLInputElement||r instanceof HTMLTextAreaElement||r instanceof HTMLSelectElement;if(i)return;if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()===`z`){t.preventDefault(),t.shiftKey?x():e();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()===`y`){t.preventDefault(),x();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()===`v`&&f()){t.preventDefault(),n(),Q(`Pasted element from clipboard`,`info`);return}if(t.key===`?`&&!i){t.preventDefault(),Qn();return}t.key===`Escape`&&$n();let a=v();if(!a)return;if(t.key===`Delete`||t.key===`Backspace`){b(a.id),t.preventDefault();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()===`d`){t.preventDefault(),o(a.id);return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()===`c`){t.preventDefault(),p(a.id),G();return}if(t.key===`PageUp`||t.key===`]`){t.preventDefault(),S(a.id,t.shiftKey?`front`:`up`);return}if(t.key===`PageDown`||t.key===`[`){t.preventDefault(),S(a.id,t.shiftKey?`back`:`down`);return}let s=t.shiftKey?5:1,c=a.x,u=a.y;if(t.key===`ArrowLeft`)c-=s;else if(t.key===`ArrowRight`)c+=s;else if(t.key===`ArrowUp`)u-=s;else if(t.key===`ArrowDown`)u+=s;else return;c=Math.max(0,Math.min(l.display.width-a.width,c)),u=Math.max(0,Math.min(l.display.height-a.height,u)),T(a.id,{x:c,y:u}),t.preventDefault()});function qn(){let e=l.display.width,t=l.display.height,n=e>=t?`Landscape`:`Portrait`;Dt.value=e,Ot.value=t,kt.value=l.display.background,At.value=l.display.background.toUpperCase(),jt.textContent=n,Et.textContent=`${e} × ${t} px`,Mt.textContent=`${e} × ${t} px`,Nt.textContent=n,Tt.textContent=`${Math.round(l.view.scale*100)}%`,un.checked=l.grid.enabled,dn.checked=l.grid.snap,U&&(U.checked=!!l.overlay?.enabled),W&&(W.value=String(l.overlay?.opacity??.4)),G();let r=document.querySelector(`#canvas-quickstart`);r&&(r.hidden=l.elements.length>0||!!l.reference.src);let i=document.querySelector(`#hardware-preset-select`);i&&(i.value=Object.keys(y).find(n=>y[n].width===e&&y[n].height===t)||``);let a=document.querySelector(`.display-frame`);a&&l.hardwareShellEnabled&&ot(a,{width:e,height:t,enabled:!0}),Vn(),Un()}_(()=>{j(),qn()});var Jn=null;window.addEventListener(`resize`,()=>{clearTimeout(Jn),Jn=setTimeout(X,100)}),j(),qn(),requestAnimationFrame(()=>{X()}),we({refreshReference:Rn,fitWorkspace:X,isAnalyzing:()=>Ln||In}),be(l),Oe(l),ue(l);var Yn=ie(l,{showToast:Q});Xn();function Xn(){let e=new URLSearchParams(window.location.search).get(`tool`);if(e===`hex`&&Yn){let e=null;try{e=JSON.parse(sessionStorage.getItem(pt)||`null`),sessionStorage.removeItem(pt)}catch{e=null}if(e?.code){let t=document.querySelector(`#hex-decoder-modal`);t.querySelector(`#hex-decoder-format`).value=e.format||`adafruit`,t.querySelector(`#hex-decoder-width`).value=e.width||128,t.querySelector(`#hex-decoder-height`).value=e.height||64,Yn.openModal(e.code)}else Yn.openModal()}else e===`export`&&document.querySelector(`#export-c`)?.click()}le(),ve(),document.querySelector(`#buy-me-coffee-btn`)?.addEventListener(`click`,()=>{C(`coffee_click`,{location:`header`})});function Q(e,t=`info`){let n=document.querySelector(`#toast-container`);if(!n)return;let r=document.createElement(`div`);r.className=`toast-item toast-${t}`,r.innerHTML=`<span>${t===`warn`?`⚠️`:t===`error`?`❌`:`✅`}</span> <span>${e}</span>`,n.appendChild(r),setTimeout(()=>{r.classList.add(`toast-out`),setTimeout(()=>r.remove(),250)},2500)}function Zn(){let e=document.querySelector(`#hardware-preset-select`);e&&e.addEventListener(`change`,()=>{let t=e.value;if(t&&y[t]){h(t);let e=y[t];C(`preset_apply`,{name:t,title:e.name}),Q(`Target display set to ${e.name}`,`info`)}})}var $=document.querySelector(`#shortcuts-modal`);function Qn(){$&&($.removeAttribute(`hidden`),$.hidden=!1,$.classList.add(`open`),$.style.display=`flex`)}function $n(){$&&($.setAttribute(`hidden`,``),$.hidden=!0,$.classList.remove(`open`),$.style.display=`none`)}function er(){let e=document.querySelector(`#shortcuts-button`),t=document.querySelector(`#shortcuts-close`);e?.addEventListener(`click`,Qn),t?.addEventListener(`click`,$n),$?.addEventListener(`click`,e=>{e.target===$&&$n()})}function tr(){let e=document.querySelector(`#canvas-quickstart`);e&&e.querySelectorAll(`.quickstart-card-btn`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.sampleId,n=nt.find(e=>e.id===t);n&&(Q(`Loading ${n.title}...`,`info`),await zn(et(n.url,n.title))&&L.click())})})}Zn(),er(),tr();function nr(){document.querySelector(`#share-project`)?.addEventListener(`click`,async()=>{try{let e=await rt(l);if(!e){Q(`Empty project cannot be shared`,`warn`);return}window.location.hash=`p=${e}`,C(`share_link_create`),navigator.clipboard&&navigator.clipboard.writeText?(await navigator.clipboard.writeText(window.location.href),Q(`🔗 Share URL copied to clipboard! (Lossless permalink)`,`info`)):Q(`URL updated in address bar!`,`info`)}catch(e){console.error(e),Q(`Failed to create share link`,`error`)}}),window.location.hash&&window.location.hash.startsWith(`#p=`)&&it(window.location.hash).then(e=>{e&&e.display&&Array.isArray(e.elements)&&(Object.assign(l,{display:e.display,elements:e.elements,selectedId:null}),E(),X(),Q(`✨ Loaded shared mockup from URL!`,`info`))}).catch(e=>{console.warn(`Could not load project from URL:`,e)})}function rr(){let e=document.querySelector(`#toggle-simulation`);e&&e.addEventListener(`click`,()=>{if(ct())ft(l,()=>{j(),e.innerHTML=`▶ Live Preview`,e.classList.remove(`active`),document.querySelector(`.workspace`)?.classList.remove(`simulating`),Q(`Simulation stopped — original state restored`,`info`)});else{if(!l.elements||l.elements.length===0){Q(`Add or load some elements first to simulate`,`warn`);return}ut(l,()=>{j()})&&(e.innerHTML=`⏸ Stop Sim`,e.classList.add(`active`),document.querySelector(`.workspace`)?.classList.add(`simulating`),Q(`▶ Live simulation running (clock & telemetry active)`,`info`))}})}function ir(){let e=document.querySelector(`#toggle-hardware-shell`),t=document.querySelector(`.display-frame`);e&&t&&e.addEventListener(`click`,()=>{l.hardwareShellEnabled=!l.hardwareShellEnabled,ot(t,{width:l.display.width,height:l.display.height,enabled:l.hardwareShellEnabled}),e.classList.toggle(`active`,!!l.hardwareShellEnabled),Q(l.hardwareShellEnabled?`🔘 Breakout PCB & bezel frame enabled`:`Display shell hidden`,`info`)})}nr(),rr(),ir();function ar(){let e=document.querySelector(`#tab-mode-lcd`),t=document.querySelector(`#tab-mode-dither`),n=document.querySelector(`#mode-container-lcd`),r=document.querySelector(`#mode-container-dither`);e?.addEventListener(`click`,()=>{e.classList.add(`active`),t?.classList.remove(`active`),n&&(n.hidden=!1),r&&(r.hidden=!0)}),t?.addEventListener(`click`,()=>{t.classList.add(`active`),e?.classList.remove(`active`),r&&(r.hidden=!1),n&&(n.hidden=!0)});let i=document.querySelector(`#dither-contrast`),a=document.querySelector(`#dither-contrast-val`);i?.addEventListener(`input`,()=>{let e=parseInt(i.value,10);a&&(a.textContent=(e>0?`+`:``)+e+`%`)});let o=document.querySelector(`#dither-brightness`),s=document.querySelector(`#dither-brightness-val`);o?.addEventListener(`input`,()=>{let e=parseInt(o.value,10);s&&(s.textContent=(e>0?`+`:``)+e+`%`)});let c=document.querySelector(`#dither-threshold`),u=document.querySelector(`#dither-threshold-val`);c?.addEventListener(`input`,()=>{u&&(u.textContent=c.value)});let d=document.querySelector(`#telegraphic-max-thickness`),f=document.querySelector(`#telegraphic-max-thickness-val`);d?.addEventListener(`input`,()=>{f&&(f.textContent=d.value+` px`)});let p=document.querySelector(`#dither-algo-select`),m=document.querySelector(`#telegraphic-options-box`),h=document.querySelector(`#apply-dither-button`);function g(){let e=p?.value===`telegraphic`;m&&(m.hidden=!e);let t=document.querySelector(`#modulation-field`),n=document.querySelector(`#max-thickness-group`),r=document.querySelector(`#threshold-slider-group`);t&&(t.hidden=!e),n&&(n.hidden=!e),r&&(r.hidden=e),h&&(h.textContent=e?`📡 Generate Telegraph Engraving`:`✨ Generate 1-Bit Dither`)}p?.addEventListener(`change`,g),g();async function _(){if(!l.reference.src){Q(`Please upload an image or portrait first`,`warn`);return}let e=document.querySelector(`#apply-dither-button`);e&&(e.disabled=!0);try{let e=p?.value===`telegraphic`;Q(e?`📡 Generating authentic retro telegraph / wirephoto scanline engraving...`:`Converting to high-detail 1-bit dither art...`,`info`);let t=await ce(l.reference.src),n=document.querySelector(`#dither-target-select`)?.value||`fit`,r=n===`avatar`,i=document.querySelector(`#dither-algo-select`)?.value||`telegraphic`,a=parseInt(document.querySelector(`#dither-contrast`)?.value||`25`,10),o=parseInt(document.querySelector(`#dither-brightness`)?.value||`0`,10),s=parseInt(document.querySelector(`#dither-threshold`)?.value||`128`,10),c=!!document.querySelector(`#dither-invert`)?.checked,u=parseInt(document.querySelector(`#telegraphic-spacing`)?.value||`4`,10),d=document.querySelector(`#telegraphic-angle`)?.value||`horizontal`,f=document.querySelector(`#telegraphic-modulation`)?.value||`continuous`,m=parseFloat(document.querySelector(`#telegraphic-max-thickness`)?.value||`4.5`),h=l.display.width,g=l.display.height;if(r){let e=Math.min(80,Math.max(32,Math.round(l.display.height*.75)));h=e,g=e}else if(n===`ssd1306`)h=128,g=64;else if(n===`badge`)h=250,g=122;else if(n===`nokia`)h=84,g=48;else if(n===`smartwatch`)h=128,g=128;else if(n===`proportional`){let e=t.naturalWidth/(t.naturalHeight||1);e>=1?(h=Math.min(t.naturalWidth,256),g=Math.max(16,Math.round(h/e))):(g=Math.min(t.naturalHeight,256),h=Math.max(16,Math.round(g*e)))}let _=document.createElement(`canvas`);_.width=h,_.height=g;let v=_.getContext(`2d`);v.imageSmoothingEnabled=!0,v.imageSmoothingQuality=`high`,v.drawImage(t,0,0,h,g);let ee=v.getImageData(0,0,h,g),y=l.display.background||`#18211b`,b=y===`#000000`||y===`#18211b`||y.startsWith(`#0`)||y.startsWith(`#1`)?`#a8d9a8`:`#18211b`,x=ge(ee,{algorithm:i,lineSpacing:u,angle:d,modulation:f,maxThickness:m,contrast:a,brightness:o,threshold:s,invert:c,fgColor:b,bgColor:y}).createImageData(b,y);v.putImageData(x,0,0);let S=_.toDataURL(`image/png`);ae(S,_);let te=r?`Dithered Avatar`:e?`Telegraph / Wirephoto Engraving`:`1-Bit Dither Portrait`,ne={id:`bmp_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,type:`bitmap`,name:te,x:r?10:0,y:r?10:0,width:h,height:g,dataUrl:S,ditherMethod:i,contrast:a,brightness:o,threshold:s,invert:c};C(`dither_apply`,{algorithm:i,width:h,height:g,avatar:r}),r?(l.elements.push(ne),l.selectedId=ne.id,E(),Q(`✨ Dithered Avatar inserted into canvas!`,`info`)):(w({width:h,height:g}),l.elements=[ne],l.selectedId=ne.id,E(),requestAnimationFrame(()=>X()),Q(e?`📡 Telegraph / wirephoto engraving generated! Microcontroller C code ready.`:`✨ 1-Bit Dither Portrait generated! Click "Export C Code" for microcontroller code.`,`info`))}catch(e){console.error(`Dithering error:`,e),Q(`Dithering failed: `+e.message,`error`)}finally{e&&(e.disabled=!l.reference.src)}}document.querySelector(`#apply-dither-button`)?.addEventListener(`click`,_)}ar();
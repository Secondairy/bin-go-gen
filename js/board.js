/* @preserve
 * board.js
 * Copyright (C) 2025 MsCosmoJo
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @endpreserve
 */
export function generateBoard(e){const t=e.boardSize,n=t*t,o=e.freeSpot&&t%2==1,s=n-(o?1:0),l=e=>e.map((e=>e[Math.floor(Math.random()*e.length)]));void 0===e.items.any&&(e.items.any=[]),void 0===e.items.singles_can&&(e.items.singles_can=[]),void 0===e.items.singles_must&&(e.items.singles_must=[]);let i=[];i.push(...l(e.items.singles_must));const a=l(e.items.singles_can),r=[...e.items.any,...a];for(;i.length<s;){const e=Math.floor(Math.random()*r.length);if(i.push(r[e]),r.splice(e,1),0===r.length&&i.length<s)throw new Error(`Not enough unique items to fill ${s} cells, pool exhausted.`)}(e=>{for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}})(i);const c=document.getElementById("bingo");c.style.setProperty("--n",e.boardSize),c.innerHTML="";for(let e=0;e<n;e++){const t=document.createElement("div");t.className="cell";const s=Math.floor(n/2);o&&e===s&&t.classList.add("free");const l=document.createElement("div");l.className="cell-text",l.textContent=o&&e===Math.floor(n/2)?"":i.shift(),t.append(l),t.addEventListener("click",(()=>t.classList.toggle("marked"))),c.append(t)}}function fitText(e){if(!(e instanceof Element))return;const t=e.querySelector(".cell-text");if(!(t instanceof Element))return;const n=getComputedStyle(t),o=getComputedStyle(e);let s=parseFloat(n.fontSize);const l=parseFloat(o.paddingLeft)||0,i=parseFloat(o.paddingRight)||0,a=parseFloat(o.paddingTop)||0,r=parseFloat(o.paddingBottom)||0,c=(e.clientWidth,e.clientHeight-a-r);t.style.whiteSpace="",t.style.fontSize="",s=parseFloat(getComputedStyle(t).fontSize),t.style.whiteSpace="";const d=.7*s;for(;t.scrollHeight>c&&s>d;)s-=1,t.style.fontSize=s+"px",s=parseFloat(getComputedStyle(t).fontSize)}function debounce(e,t){let n;return function(...o){clearTimeout(n),n=setTimeout((()=>{clearTimeout(n),e(...o)}),t)}}
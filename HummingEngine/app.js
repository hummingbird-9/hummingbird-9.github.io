(() => {
'use strict';
const $ = id => document.getElementById(id);
const defaults = {engine:'google',transport:'epoxy',adblock:false,tor:false,bookmarksVisible:true,scramjetVersion:'2',autoFallback:true,theme:'classic',colorA:'#0a2e0a',colorB:'#1a5d1a',accent:'#90e4c1',newTabBackground:'',pageBackground:'',wallpaperDim:30,rounding:12,font:'Segoe UI',motion:true,buttonColor:'#205b35',buttonTextColor:'#e0f7e0',buttonSize:'normal',buttonStyle:'glass',buttonHover:true,pathSearch:false,proxyOnly:false,historyEnabled:false,customTabTitle:'',customFavicon:''};
const read = (key, fallback) => {try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch {return fallback;}};
const settings = {...defaults,...read('hummingproxy-settings',{})};
delete settings.chromeMode; // Chrome mode has been retired.
if (!['google','duckduckgo','firefox'].includes(settings.engine)) settings.engine='google';
if (!['1','2','static'].includes(settings.scramjetVersion)) settings.scramjetVersion='2';
if (!['libcurl','epoxy'].includes(settings.transport)) settings.transport='libcurl';
const persist = () => {try {localStorage.setItem('hummingproxy-settings',JSON.stringify(settings));} catch {}};
const APP_BASE = (() => {
  const raw=document.querySelector('meta[name="app-base"]')?.content?.trim();
  if(!raw)return '';
  try {const path=new URL(raw,location.origin).pathname;return path==='/'?'':path.replace(/\/+$/,'');}
  catch{return '';}
})();
const appPath = path => APP_BASE + (String(path).startsWith('/')?String(path):'/'+String(path));
const launchParams = new URLSearchParams(location.search);
const launchQuery = launchParams.get('q');
const launchOpen = launchParams.get('open');
const searchPresentation = Boolean((launchQuery&&launchQuery.trim())||(launchOpen&&launchOpen.trim())||launchParams.has('popup'));
const isPagesHost = document.querySelector('meta[name="app-host"]')?.content === 'github-pages';
const migratePagesEpoxyDefault = isPagesHost && !read('hummingproxy-pages-epoxy-default-v1',false);
if(migratePagesEpoxyDefault){
  settings.transport='epoxy';
  try{localStorage.setItem('hummingproxy-pages-epoxy-default-v1','true');}catch{}
  persist();
}
if(isPagesHost&&!read('hummingproxy-pages-scramjet2-default',false)){
  settings.scramjetVersion='2';
  try{localStorage.setItem('hummingproxy-pages-scramjet2-default','true');}catch{}
  persist();
}
if(isPagesHost&&!read('hummingproxy-pages-scramjet2-default-v2',false)){
  settings.scramjetVersion='2';
  try{localStorage.setItem('hummingproxy-pages-scramjet2-default-v2','true');}catch{}
  persist();
}
const proxyOnlyMode = () => settings.proxyOnly===true || searchPresentation;
document.documentElement.classList.toggle('proxy-only',proxyOnlyMode());
const saveData = () => {try {localStorage.setItem('hummingproxy-bookmarks',JSON.stringify(bookmarks));localStorage.setItem('hummingproxy-tabs',JSON.stringify(tabs.map(t=>({id:t.id,url:t.url,title:t.title,icon:t.icon,history:settings.historyEnabled?t.history.slice(-25):[],index:settings.historyEnabled?t.index:-1}))));} catch {}};
let bookmarks=read('hummingproxy-bookmarks',[]).filter(x=>x && typeof x.url==='string').slice(0,60);
let tabs=[], current=null, scramjet=null, mux=null, v2Controller=null, ready=false, torEndpoint='', activeTransport='', loadTimeout=0, booting=false, pendingSearch=null;
let storedTabs=read('hummingproxy-tabs',[]);
let seq=0;
let fallbackV2=false, fallbackV1=false, fallbackStatic=false, fallbackReason='', runtimeEngine='', storageRepair='not attempted', setupFailed='';
let staticWisp='wss://anura.pro/wisp/';
const hexColor = (value,fallback) => /^#[0-9a-f]{6}$/i.test(value||'')?value:fallback;
const safeImage = value => {try {if(!value)return '';const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:'';}catch{return '';}};
function applyAppearance(){
  const root=document.documentElement;
  root.classList.toggle('proxy-only',proxyOnlyMode());
  document.title=searchPresentation?'Google':(String(settings.customTabTitle||'').trim()||'HummingProxy').slice(0,80);
  let favicon=document.querySelector('link[data-custom-favicon]');
  if(!favicon){favicon=document.createElement('link');favicon.rel='icon';favicon.setAttribute('data-custom-favicon','');document.head.append(favicon);}
  const iconUrl=safeImage(settings.customFavicon);
  favicon.href=searchPresentation?'https://www.google.com/favicon.ico':(iconUrl||appPath('/favicon.ico'));
  root.style.setProperty('--color-a',hexColor(settings.colorA,'#0a2e0a'));
  root.style.setProperty('--color-b',hexColor(settings.colorB,'#1a5d1a'));
  root.style.setProperty('--accent',hexColor(settings.accent,'#90e4c1'));
  root.style.setProperty('--rounding',Math.max(0,Math.min(30,Number(settings.rounding)||0))+'px');
  root.style.setProperty('--wallpaper-dim',Math.max(0,Math.min(90,Number(settings.wallpaperDim)||0))/100);
  root.style.setProperty('--home-image',safeImage(settings.pageBackground)?`url("${safeImage(settings.pageBackground).replaceAll('"','%22')}")`:'none');
  root.style.setProperty('--tab-image',safeImage(settings.newTabBackground)?`url("${safeImage(settings.newTabBackground).replaceAll('"','%22')}")`:'none');
  root.style.setProperty('--app-font',({ 'Segoe UI':'"Segoe UI",Tahoma,sans-serif',Arial:'Arial,sans-serif',Verdana:'Verdana,sans-serif',Georgia:'Georgia,serif',Monospace:'ui-monospace,monospace'})[settings.font]||'"Segoe UI",Tahoma,sans-serif');
  root.style.setProperty('--button-color',hexColor(settings.buttonColor,'#205b35'));
  root.style.setProperty('--button-text',hexColor(settings.buttonTextColor,'#e0f7e0'));
  root.style.setProperty('--button-scale',({compact:.82,normal:1,large:1.18})[settings.buttonSize]||1);
  root.dataset.buttonStyle=['glass','solid','outline'].includes(settings.buttonStyle)?settings.buttonStyle:'glass';
  root.classList.toggle('no-button-hover',settings.buttonHover===false);
  root.classList.toggle('no-motion',settings.motion===false);
}
const themes={classic:['#0a2e0a','#1a5d1a','#90e4c1'],ocean:['#071c37','#145c7d','#83e4ff'],sunset:['#321422','#93465c','#ffcc94'],purple:['#1e123a','#57388e','#d3b3ff'],midnight:['#0c111b','#283449','#b4d1ff'],forest:['#112b20','#336a47','#b3f0b5']};
function syncAppearanceControls(){for(const id of ['theme','colorA','colorB','accent','newTabBackground','pageBackground','wallpaperDim','rounding','font','buttonColor','buttonTextColor','buttonSize','buttonStyle'])if($(id))$(id).value=settings[id];$('motion').checked=settings.motion!==false;if($('buttonHover'))$('buttonHover').checked=settings.buttonHover!==false;}
applyAppearance();
const diagnosticEvents=[];
const logDiagnostic=(kind,detail='')=>{diagnosticEvents.push({time:new Date().toISOString(),kind,detail:String(detail).slice(0,250)});if(diagnosticEvents.length>35)diagnosticEvents.shift();};
window.addEventListener('error',event=>logDiagnostic('page error',event.message||'unknown'));
window.addEventListener('unhandledrejection',event=>logDiagnostic('unhandled rejection',event.reason?.message||String(event.reason)));

const isHomeVisible=()=>!$('home').classList.contains('hidden');
const status = v => $('status').textContent=v;
function showRecovery(reason){
  const panel=$('recoveryHelp');if(!panel)return;
  $('recoveryReason').textContent=String(reason||'A page or connection failed.').slice(0,300);
  panel.classList.remove('hidden');
}
function hideRecovery(){if($('recoveryHelp'))$('recoveryHelp').classList.add('hidden');}

const loading = (on, detail='') => {
  clearTimeout(loadTimeout);
  $('loader').classList.toggle('hidden',!on);
  $('loadProgress').classList.toggle('active',on);
  if(!on){$('loadProgress').value=0;return;}
  setLoadPhase(5,detail||'Starting…');
  // No reliable byte-level progress event exists for proxied iframe navigations.
  // Hold at the last known stage rather than showing a fake looping spinner.
  loadTimeout=setTimeout(()=>{
    setLoadPhase(85,'The site is taking longer than usual to respond…');
    status('Still waiting for the site response. The page can continue loading in the background.');
    loadTimeout=setTimeout(()=>{
      const pending=currentTab();
      if(pending?.busy){
        loading(false);
        status('The site is still loading. Its page can finish in the background.');
      }
    },18000);
  },12000);
};
function setLoadDetail(detail){if(!$('loader').classList.contains('hidden'))$('loadDetail').textContent=String(detail||'').split(/\r?\n/).filter(Boolean).slice(-1)[0]||'';}
function setLoadPhase(percent,detail=''){
  if($('loader').classList.contains('hidden'))return;
  $('loadProgress').value=Math.max(0,Math.min(100,Number(percent)||0));
  if(detail)setLoadDetail(detail);
}
const searchUrls = {google:q=>`https://www.google.com/search?igu=1&q=${encodeURIComponent(q)}`,duckduckgo:q=>`https://duckduckgo.com/?q=${encodeURIComponent(q)}`,firefox:q=>`https://www.google.com/search?igu=1&q=${encodeURIComponent(q)}`};
function iframeEntryBase(pathname=location.pathname){
  // If already on a /search route, strip only that suffix. Otherwise, when
  // embedded, treat the current document path as the iframe's own entry path.
  const searchMatch=pathname.match(/^(.*)\/search\/?$/i);
  if(searchMatch)return searchMatch[1]||'';
  if(window.top!==window)return pathname==='/'?'':pathname.replace(/\/+$/,'');
  // Also allow a custom HTML entry filename when the app is opened directly.
  return /\.html?$/i.test(pathname)?pathname.replace(/\/+$/,''):'';
}
function searchRoutePath(){const base=iframeEntryBase();return base?base+'/search':appPath('/search');}
function isSearchEntryPath(pathname=location.pathname){return /(?:^|\/)search\/?$/i.test(pathname);}
function updateCustomSearchUrl(){
  const input=$('customSearchUrl');if(input)input.value=location.origin+appPath('/search?q=%s');
  const iframeInput=$('iframeSearchUrl');if(iframeInput)iframeInput.value=location.origin+searchRoutePath()+'?q=%s';
}
function resolveUrl(input) {
  const v=input.trim();
  if(!v)return '';
  if(/^https?:\/\//i.test(v)){const u=new URL(v);if(!['http:','https:'].includes(u.protocol))throw Error('Unsupported address');return u.href;}
  if(/^(localhost|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/.*)?$/i.test(v))throw Error('Local addresses are not supported');
  if(/^[^\s/]+\.[a-z]{2,}(?::\d+)?(?:[/?#]\S*)?$/i.test(v))return new URL('https://'+v).href;
  return searchUrls[settings.engine](v);
}
function route(){const url=settings.tor?torEndpoint:(isPagesHost?staticWisp:`${location.protocol==='https:'?'wss:':'ws:'}//${location.host}${appPath('/wisp/')}`);return {name:settings.transport,url};}
async function switchTransport(){
  if(settings.tor&&!torEndpoint)throw Error('Tor is not available on this server');
  const {name,url}=runtimeEngine==='static'&&!settings.tor?{name:settings.transport,url:staticWisp}:route();
  const key=name+'|'+url;
  if(activeTransport===key)return;
  status('Connecting…');
  if(runtimeEngine==='2'){
    if(!v2Controller)throw Error('Scramjet 2 is not initialized');
    const {default: Transport}=await import(name==='libcurl'?appPath('/v2-libcurl/index.mjs'):appPath('/v2-epoxy/index.mjs'));
    v2Controller.setTransport(new Transport({wisp:url}));
    activeTransport=key;
    status(settings.tor?'Tor route selected':name+' ready');
    return;
  }
  if(runtimeEngine==='static'){
    try {
      await mux.setTransport(appPath('/static/transport/'+name+'.mjs'),[{wisp:url}]);
    } catch(error) {
      logDiagnostic('static transport error',error.message||error);
      if(name!=='libcurl') {
        await mux.setTransport(appPath('/static/transport/libcurl.mjs'),[{wisp:url}]);
        status('Static Scramjet: libcurl fallback connected');
      } else throw error;
    }
  }else if(name==='libcurl')await mux.setTransport(appPath('/libcurl/index.mjs'),[{websocket:url}]);
  else await mux.setTransport(appPath('/epoxy/index.mjs'),[{wisp:url}]);
  activeTransport=key;
  status(settings.tor?'Tor route selected':name+' ready');
}
function currentTab(){return tabs.find(t=>t.id===current);}
function shortTitle(url){try{return new URL(url).hostname.replace(/^www\./,'');}catch{return 'New tab';}}
function makeTab(data={}){
  const tab={id:++seq,url:typeof data.url==='string'?data.url:'',title:data.title||shortTitle(data.url||''),icon:typeof data.icon==='string'?data.icon:'',history:Array.isArray(data.history)?data.history.slice(-25):[],index:Number.isInteger(data.index)?data.index:-1,frame:null,busy:false};
  tabs.push(tab);return tab;
}
function drawTabs(){
  const host=$('tabStrip');
  const newTabButton=$('newTab');
  host.replaceChildren();
  tabs.forEach(tab=>{
    const item=document.createElement('div');item.className='tab'+(tab.id===current?' active':'');
    const pick=document.createElement('button');pick.type='button';pick.className='tab-pick';const icon=document.createElement('span');icon.className='tab-site-icon';
    if(tab.icon){const img=document.createElement('img');img.alt='';img.src=tab.icon;img.referrerPolicy='no-referrer';img.onerror=()=>{const backup=tab.url?`https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(tab.url).hostname)}&sz=32`:'';if(backup&&!img.dataset.backup){img.dataset.backup='1';img.src=backup;}else{img.remove();icon.textContent='◎';}};icon.append(img);}else if(tab.url){const img=document.createElement('img');img.alt='';img.referrerPolicy='no-referrer';img.src=`https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(tab.url).hostname)}&sz=32`;img.onerror=()=>{img.remove();icon.textContent='◎';};icon.append(img);}else icon.textContent='◎';
    const caption=document.createElement('span');caption.className='tab-caption';caption.textContent=tab.title;
    pick.append(icon,caption);pick.title=tab.url||'New tab';pick.onclick=()=>activate(tab.id);
    const close=document.createElement('button');close.type='button';close.className='tab-close';close.textContent='×';close.title='Close tab';close.setAttribute('aria-label','Close '+tab.title);close.onclick=()=>closeTab(tab.id);
    item.append(pick,close);host.append(item);
  });
  if(newTabButton){host.append(newTabButton);newTabButton.disabled=false;}
}
function drawBookmarks(){
  $('bookmarkBar').classList.toggle('hidden',!settings.bookmarksVisible);
  $('showBookmarks').checked=settings.bookmarksVisible;
  const bar=$('bookmarkItems');bar.replaceChildren();
  bookmarks.forEach((mark,i)=>{
    const button=document.createElement('button');button.type='button';button.className='bookmark-link';button.textContent=mark.title||shortTitle(mark.url);button.title=mark.url;button.onclick=()=>navigate(mark.url);
    button.oncontextmenu=e=>{e.preventDefault();if(confirm('Remove this bookmark?')){bookmarks.splice(i,1);saveData();drawBookmarks();}};
    bar.append(button);
  });
  $('bookmarkToggle').textContent=bookmarks.some(b=>b.url===currentTab()?.url)?'★':'☆';
  $('bookmarkToggle').title='Bookmark this page';
}
function updateUI(){
  const t=currentTab();$('browserAddress').value=t?.url||'';
  $('back').disabled=!t||t.index<=0;
  $('forward').disabled=!t||t.index>=t.history.length-1;
  drawTabs();drawBookmarks();
}
function trimFrames(){
  const live=tabs.filter(t=>t.frame);
  if(live.length<=3)return;
  for(const tab of live){
    if(tab.id===current)continue;
    dropFrame(tab);
    if(tabs.filter(t=>t.frame).length<=3)break;
  }
}
function activate(id){
  const tab=tabs.find(t=>t.id===id);if(!tab)return;
  current=id;
  tabs.forEach(t=>{if(t.frame){t.frame.frame.classList.toggle('hidden',t.id!==id);t.frame.frame.style.pointerEvents=t.id===id?'auto':'none';}});
  $('home').classList.add('hidden');$('browser').classList.remove('hidden');
  $('emptyTab').classList.toggle('hidden',!!(tab.url||tab.frame));
  updateUI();saveData();
  if(tab.url&&!tab.frame&&ready)navigate(tab.url,false);
  trimFrames();
}
function createTab(url=''){
  const tab=makeTab();activate(tab.id);if(url)navigate(url);else $('emptyTabAddress').focus();
  return tab;
}
function closeTab(id){
  const idx=tabs.findIndex(t=>t.id===id);if(idx<0)return;
  const [tab]=tabs.splice(idx,1);
  if(tab.frame)dropFrame(tab);
  if(tabs.length===0){current=null;home();updateUI();saveData();return;}
  if(id===current){current=tabs[Math.min(idx,tabs.length-1)].id;activate(current);}
  else updateUI();
  saveData();
}
function ads(tab){
  if(!settings.adblock||!tab?.frame)return;
  try{
    const doc=tab.frame.frame.contentDocument;
    if(!doc||doc.getElementById('humming-cosmetic-filter'))return;
    const style=doc.createElement('style');style.id='humming-cosmetic-filter';style.textContent='[id="google_ads_iframe"],[data-ad-slot],.adsbygoogle,[id^="div-gpt-ad"],.ad-banner,.ad-container{display:none!important}';doc.head?.append(style);
  }catch{}
}
function refreshTabMetadata(tab){
  if(!tab?.frame?.frame)return;
  let doc;
  try{doc=tab.frame.frame.contentDocument||tab.frame.frame.contentWindow?.document;}catch{return;}
  if(!doc)return;
  let changed=false;
  try{
    const raw=(doc.title||'').trim().slice(0,110);
    if(raw && !/^\{[\s\S]*\}$/.test(raw) && raw!==tab.title){tab.title=raw;changed=true;}
    const link=doc.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
    const rawIcon=link?.getAttribute('href');
    if(rawIcon){
      const resolved=new URL(rawIcon,doc.baseURI).href;
      if(/^https?:\/\//.test(resolved)){
        const next=resolved.startsWith(location.origin+'/')?resolved:(runtimeEngine!=='2'?appPath('/service/')+encodeURIComponent(resolved):'');
        if(next && next!==tab.icon){tab.icon=next;changed=true;}
      }
    }else if(!tab.icon&&tab.url&&runtimeEngine!=='2'){
      tab.icon=appPath('/service/')+encodeURIComponent(new URL('/favicon.ico',tab.url).href);changed=true;
    }
  }catch(e){logDiagnostic('metadata error',e.message||e);}
  if(changed){if(tab.id===current)updateUI();else drawTabs();saveData();}
}
function monitorTabMetadata(tab){
  refreshTabMetadata(tab);
  try{
    const doc=tab.frame.frame.contentDocument;
    if(!doc)return;
    if(tab.metadataObserver)tab.metadataObserver.disconnect();
    const observer=new MutationObserver(()=>refreshTabMetadata(tab));
    observer.observe(doc.head||doc.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['href','rel']});
    tab.metadataObserver=observer;
  }catch{}
}
function dropFrame(tab){
  tab.metadataObserver?.disconnect();tab.metadataObserver=null;
  if(tab.frame){tab.frame.frame.remove();tab.frame=null;}
}
async function inspectScramjetDatabase(){
  storageRepair='checking $scramjet without modifying it';
  if(!('indexedDB' in window)){storageRepair='IndexedDB unavailable';return;}
  await new Promise(resolve=>{
    let done=false,request;
    const finish=value=>{if(done)return;done=true;clearTimeout(timer);storageRepair=value;logDiagnostic('storage inspection',value);resolve();};
    const timer=setTimeout(()=>finish('inspection blocked or unavailable after 3 seconds'),3000);
    try{
      request=indexedDB.open('$scramjet');
      request.onsuccess=()=>{const db=request.result;const stores=[...db.objectStoreNames];const version=db.version;db.close();finish('database version '+version+'; stores: '+(stores.join(', ')||'(none)'));};
      request.onerror=()=>finish('inspection error: '+(request.error?.message||'unknown'));
      request.onblocked=()=>logDiagnostic('storage inspection blocked','existing database connection');
    }catch(error){finish('inspection unavailable: '+(error.message||error));}
  });
}

function popupDestination(value,base){
  try{
    const destination=new URL(String(value||''),base||location.href);
    if(!['http:','https:'].includes(destination.protocol))return '';
    if(destination.origin===location.origin){
      const pathname=decodeURIComponent(destination.pathname);
      for(const prefix of [appPath('/static/scramjet/'),appPath('/v2/p/'),appPath('/service/')]){
        if(pathname.startsWith(prefix)){
          const original=pathname.slice(prefix.length).replace(/^\/+/, '');
          if(/^https?:\/\//i.test(original)){
            const resolved=new URL(original);
            if(destination.search)resolved.search=destination.search;
            if(destination.hash)resolved.hash=destination.hash;
            return resolved.href;
          }
        }
      }
    }
    return destination.href;
  }catch{return '';}
}
function openProxyPopup(value,base){
  const destination=popupDestination(value,base||location.href);
  if(proxyOnlyMode()){
    const target=appPath('/')+(destination?'?open='+encodeURIComponent(destination):'?popup=1');
    const popup=window.open(target,'_blank');
    if(popup){try{popup.opener=null;}catch{};return popup;}
    if(destination){status('Pop-up blocked; opening the link in this page instead.');void navigate(destination);}
    return null;
  }
  const tab=createTab(destination||'');
  if(!tab)return null;
  const locationFacade={};
  const go=value=>{
    const next=popupDestination(value,tab.url||base||location.href);
    if(next){activate(tab.id);void navigate(next,false);}
  };
  Object.defineProperties(locationFacade,{
    href:{get:()=>tab.url||'',set:go},
    assign:{value:go},
    replace:{value:go},
    reload:{value:()=>{if(tab.url){activate(tab.id);void navigate(tab.url,false);}}}
  });
  const handle={focus(){activate(tab.id);},close(){closeTab(tab.id);},postMessage(){}};
  Object.defineProperty(handle,'location',{get:()=>locationFacade,set:go});
  return handle;
}
function installPopupHandling(tab){
  const frameWindow=tab.frame?.frame?.contentWindow;
  const doc=tab.frame?.frame?.contentDocument;
  if(!frameWindow||!doc?.documentElement)return;
  if(doc.documentElement.dataset.hummingPopupHook==='1')return;
  doc.documentElement.dataset.hummingPopupHook='1';
  const handleLink=event=>{
    if(event.defaultPrevented)return;
    if(event.type==='click'&&event.button!==0)return;
    if(event.type==='auxclick'&&event.button!==1)return;
    const path=typeof event.composedPath==='function'?event.composedPath():[];
    const anchor=path.find(node=>node?.tagName==='A'&&node.href)||event.target?.closest?.('a[href]');
    if(!anchor||anchor.hasAttribute('download'))return;
    const target=(anchor.getAttribute('target')||doc.querySelector('base[target]')?.getAttribute('target')||'').toLowerCase();
    const wantsNewContext=(target&&target!=='_self')||event.ctrlKey||event.metaKey||event.shiftKey||event.type==='auxclick';
    if(!wantsNewContext)return;
    const destination=popupDestination(anchor.href,doc.baseURI);
    if(!destination)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openProxyPopup(destination,doc.baseURI);
  };
  frameWindow.addEventListener('click',handleLink,true);
  frameWindow.addEventListener('auxclick',handleLink,true);
  const routedOpen=url=>openProxyPopup(url==null?'':String(url),doc.baseURI);
  try{Object.defineProperty(frameWindow,'open',{configurable:true,writable:true,value:routedOpen});}
  catch{try{frameWindow.open=routedOpen;}catch{}}
}
function ensureFrame(tab){
  if(tab.frame)return;
  if(runtimeEngine==='2'){
    const plugins=[];
    const utils=window.$scramjetUtils;
    const HttpCachePlugin=utils?.HttpCachePlugin;
    if(typeof HttpCachePlugin==='function')plugins.push(new HttpCachePlugin());
    else logDiagnostic('HTTP cache unavailable','Scramjet Utils did not expose HttpCachePlugin');
    const ManagedPlugin=utils?.ManagedPlugin;
    if(typeof ManagedPlugin==='function'){
      class FirstDocumentRevealPlugin extends ManagedPlugin {
        constructor(){super('hummingproxy-first-document-reveal',[]);}
        install(frame){
          super.install(frame);
          this.tap(frame.hooks.init.post,context=>{
            if(!context.isTopLevel||!tab.busy||tab.documentReady)return;
            tab.documentReady=true;
            const documentWaitMs=tab.requestSentAt?Math.round(performance.now()-tab.requestSentAt):null;
            tab.lastDocumentWaitMs=documentWaitMs;
            clearTimeout(tab.firstDocumentFallback);
            logDiagnostic('first document ready',documentWaitMs===null?tab.url:`${tab.url} — ${(documentWaitMs/1000).toFixed(2)}s after request dispatch`);
            tab.frame?.frame.classList.remove('frame-pending');
            try{installPopupHandling(tab);monitorTabMetadata(tab);}catch(error){logDiagnostic('early frame setup',error?.message||error);}
            if(current===tab.id){
              loading(false);
              status('Page is visible; remaining resources may still be loading.');
            }
          });
        }
      }
      plugins.push(new FirstDocumentRevealPlugin());
    }else logDiagnostic('early document reveal unavailable','Scramjet Utils ManagedPlugin was not available');
    const raw=v2Controller.createFrame(undefined,{plugins});
    tab.frame={frame:raw.element,go:url=>raw.go(url)};
  }else tab.frame=scramjet.createFrame();
  tab.frame.frame.title='HummingProxy: '+tab.title;
  tab.frame.frame.setAttribute('allow','fullscreen; autoplay; clipboard-read; clipboard-write');
  tab.frame.frame.classList.toggle('hidden',tab.id!==current);
  tab.frame.frame.classList.add('frame-pending');
  $('frameHost').append(tab.frame.frame);
  tab.frame.frame.addEventListener('load',()=>{
    installPopupHandling(tab);
    monitorTabMetadata(tab);
    if(!tab.busy){logDiagnostic('iframe bootstrap load','Initial frame document; no proxied navigation was in progress');return;}
    tab.busy=false;
    clearTimeout(tab.firstDocumentFallback);
    const frameLoadMs=tab.navigationStartedAt?Math.round(performance.now()-tab.navigationStartedAt):null;
    const responseWaitMs=tab.requestSentAt?Math.round(performance.now()-tab.requestSentAt):null;
    tab.lastFrameLoadMs=frameLoadMs;
    tab.lastResponseWaitMs=responseWaitMs;
    logDiagnostic('iframe load',tab.url);
    if(frameLoadMs!==null)logDiagnostic('navigation timing',`first document ${Number.isFinite(tab.lastDocumentWaitMs)?(tab.lastDocumentWaitMs/1000).toFixed(2)+'s':'not reported'}; full iframe load ${(frameLoadMs/1000).toFixed(2)}s; ${responseWaitMs===null?'request timing unavailable':(responseWaitMs/1000).toFixed(2)+'s after request dispatch'}`);
    setLoadPhase(100,'All iframe resources finished loading');
    requestAnimationFrame(()=>{
      tab.frame?.frame.classList.remove('frame-pending');
      if(current===tab.id){status('Page fully loaded');clearTimeout(loadTimeout);loadTimeout=setTimeout(()=>loading(false),220);}
    });
    ads(tab);
  });
  tab.frame.frame.addEventListener('error',()=>{logDiagnostic('iframe error',tab.url);showRecovery('The embedded page could not load.');});
  tab.frame.addEventListener?.('urlchange',e=>{
    const url=String(e.url||tab.frame.url||'');if(!/^https?:\/\//.test(url))return;
    tab.url=url;tab.title=shortTitle(url);tab.icon='';
    if(settings.historyEnabled&&tab.history[tab.index]!==url){tab.history=tab.history.slice(0,tab.index+1);tab.history.push(url);tab.index=tab.history.length-1;}
    if(current===tab.id)updateUI();saveData();ads(tab);
  });
}
async function navigate(input,push=true){
  let url;
  try{url=resolveUrl(input);if(!url)return;}catch(e){status(e.message);showRecovery(e.message);return;}
  if(!ready){
    if(setupFailed){status('Proxy not ready: '+setupFailed);showRecovery('The selected engine failed to start: '+setupFailed+' Try another Scramjet version in Settings or reload.');return;}
    pendingSearch={input:url,push};$('address').value=input;status('Preparing '+(runtimeEngine==='static'?'Static Scramjet':'Scramjet '+(runtimeEngine||settings.scramjetVersion))+' — your search will open when ready…');return;
  }
  if(proxyOnlyMode()){$('home').classList.add('hidden');$('browser').classList.remove('hidden');}
  let tab=currentTab();if(!tab||(isHomeVisible()&&!proxyOnlyMode())){tab=makeTab();current=tab.id;}
  hideRecovery();loading(true,'Resolving address…');setLoadPhase(12,'Resolving address…');
  try{
    setLoadPhase(27,'Connecting proxy transport…');await switchTransport();setLoadPhase(43,'Preparing browser frame…');ensureFrame(tab);
    tab.url=url;tab.title=shortTitle(url);tab.icon='';tab.busy=true;tab.navigationStartedAt=performance.now();tab.requestSentAt=0;tab.documentReady=false;clearTimeout(tab.firstDocumentFallback);tab.frame.frame.classList.add('frame-pending');
    const navigationId=tab.navigationId=(tab.navigationId||0)+1;
    tab.firstDocumentFallback=setTimeout(()=>{
      if(tab.navigationId!==navigationId||tab.documentReady)return;
      tab.frame?.frame.classList.remove('frame-pending');
      logDiagnostic('slow first-document fallback','Revealed the frame after 8 seconds; the destination document has not signalled init.post yet');
      if(current===tab.id){loading(false);status('Still waiting for the page response; it will appear when received.');}
    },8000);
    if(push&&settings.historyEnabled){tab.history=tab.history.slice(0,tab.index+1);tab.history.push(url);tab.index=tab.history.length-1;}else if(!settings.historyEnabled){tab.history=[];tab.index=-1;}
    if(settings.pathSearch){history.replaceState(null,'',searchRoutePath()+'?q='+encodeURIComponent(input.trim()));}
    $('home').classList.add('hidden');$('browser').classList.remove('hidden');$('emptyTab').classList.add('hidden');updateUI();saveData();
    logDiagnostic('navigate',url);setLoadPhase(68,'Request sent to '+new URL(url).hostname+'; waiting for response…');
    tab.requestSentAt=performance.now();
    await tab.frame.go(url);
    trimFrames();
  }catch(e){logDiagnostic('navigation error',e.message||e);loading(false);tab.busy=false;status('Navigation failed: '+String(e.message||e).slice(0,130));showRecovery('Navigation failed: '+(e.message||String(e))+' Try reloading the proxy or switching engines.');}
}
async function refreshTor(){
  try{
    const response=await fetch(appPath('/api/config'),{cache:'no-store'});if(!response.ok)throw Error('Backend unavailable');
    const c=await response.json();torEndpoint=c.torAvailable?(c.torWispUrl==='__LOCAL_TOR__'?`${location.protocol==='https:'?'wss:':'ws:'}//${location.host}/tor-wisp/`:c.torWispUrl):'';
    $('tor').disabled=!torEndpoint;
    if(!torEndpoint&&settings.tor){settings.tor=false;activeTransport='';persist();}
    $('tor').checked=settings.tor;
    $('torNote').textContent=torEndpoint?'Tor exit verified by backend. Extra startup time is normal.':(c.torStarting?'Tor is starting; try again shortly.':'Tor unavailable. Docker deployment required.');
  }catch{$('tor').disabled=true;$('torNote').textContent=isPagesHost?'Tor requires the optional server backend and is unavailable on GitHub Pages.':'Cannot check Tor status';}
}
function waitForWorker(registration,timeout=18000){
  return new Promise((resolve,reject)=>{
    if(registration.active&&registration.active.state==='activated'){resolve(registration.active);return;}
    let settled=false;
    const finish=(error,worker)=>{if(settled)return;settled=true;clearTimeout(timer);registration.removeEventListener('updatefound',inspect);if(error)reject(error);else resolve(worker);};
    const inspect=()=>{
      const worker=registration.active||registration.waiting||registration.installing;
      if(!worker)return;
      if(worker.state==='activated'){finish(null,worker);return;}
      if(worker.state==='redundant'){finish(Error('Service worker became redundant. Reload this page.'));return;}
      worker.addEventListener('statechange',inspect,{once:true});
    };
    const timer=setTimeout(()=>finish(Error('Service worker activation timed out. Check DevTools for a service worker script error.')),timeout);
    registration.addEventListener('updatefound',inspect);
    inspect();
  });
}
async function init(){
  if(booting)return;booting=true;
  $('engine').value=settings.engine;$('transport').value=settings.transport;$('adblock').checked=settings.adblock;syncAppearanceControls();
  $('pathSearch').checked=settings.pathSearch===true;$('proxyOnly').checked=settings.proxyOnly===true;$('historyEnabled').checked=settings.historyEnabled===true;updateCustomSearchUrl();$('customTabTitle').value=settings.customTabTitle||'';$('customFavicon').value=settings.customFavicon||'';
  drawBookmarks();
  if(isPagesHost){
    settings.tor=false;
    $('scramjetVersion').value=settings.scramjetVersion;
    $('scramjetVersion').disabled=false;
    $('scramjetVersion').title='GitHub Pages runs the bundled Scramjet 2 runtime by default. Stable Scramjet 1.1.0 remains available as a fallback.';
    const legacyOption=$('scramjetVersion').querySelector('option[value="static"]');
    if(legacyOption)legacyOption.hidden=true;
    persist();
  }else $('scramjetVersion').value=settings.scramjetVersion;
  $('autoFallback').checked=settings.autoFallback!==false;
  if(!tabs.length){current=makeTab().id;updateUI();}
  $('go').disabled=false;
  if(window.top!==window){logDiagnostic('embedded mode','iframe storage may be restricted');$('embeddedNotice').classList.remove('hidden');}
  await refreshTor();
  try{
    if(!('serviceWorker'in navigator))throw Error('Service workers unavailable in this browser');
    if(settings.scramjetVersion==='static'){
      await initializeStatic();
    }else{
      const primary=settings.scramjetVersion==='2'?'2':'1';
      try{
        if(primary==='2')await initializeV2();else await initializeV1();
      }catch(primaryError){
        const primaryMessage=String(primaryError?.message||primaryError);
        fallbackReason=primaryMessage;
        logDiagnostic('Scramjet '+primary+' setup failed',primaryMessage);
        if(settings.autoFallback===false)throw Error('Scramjet '+primary+' failed: '+primaryMessage+' (automatic fallback is disabled)');
        runtimeEngine='';activeTransport='';scramjet=null;mux=null;v2Controller=null;
        const backup=primary==='2'?'1':'2';
        const backupLabel=backup==='static'?'Static Scramjet':'Scramjet '+backup;
        status('Scramjet '+primary+' failed; trying '+backupLabel+' fallback…');
        if(backup==='static')fallbackStatic=true;
        else if(backup==='1')fallbackV1=true;
        else{fallbackV2=true;await inspectScramjetDatabase();}
        try{
          if(backup==='static')await initializeStatic();
          else if(backup==='1')await initializeV1();
          else await initializeV2();
        }catch(fallbackError){
          const fallbackMessage=String(fallbackError?.message||fallbackError);
          logDiagnostic('Scramjet '+backup+' fallback failed',fallbackMessage);
          throw Error('Scramjet '+primary+' failed: '+primaryMessage+'. Scramjet '+backup+' fallback also failed: '+fallbackMessage);
        }
      }
    }
    await switchTransport();
    setupFailed='';
    ready=true;
    const fallbackLabel=fallbackV1?'Scramjet 1 fallback':fallbackV2?'Scramjet 2 fallback':'';
    logDiagnostic('initialized',fallbackLabel||('Scramjet '+runtimeEngine));
    status(fallbackLabel?'Ready · '+fallbackLabel:'Ready · Scramjet '+runtimeEngine);
    $('go').disabled=false;
    const valid=!searchPresentation&&Array.isArray(storedTabs)?storedTabs.filter(t=>t&&typeof t.url==='string'):[];
    if(valid.length){tabs=[];valid.forEach(t=>makeTab(t));current=tabs[0].id;}
    updateUI();
    const params=new URLSearchParams(location.search);
    const pathname=location.pathname;
    const isSearchRoute=isSearchEntryPath(pathname);
    const isEmbedded=window.top!==window;
    const iframeBase=iframeEntryBase(pathname);
    const query=params.get('q');
    const openTarget=params.get('open');
    if(openTarget){
      const destination=popupDestination(openTarget,location.href);
      history.replaceState(null,'',appPath('/')+location.hash);
      if(destination)pendingSearch={input:destination,push:true};
    }else if(query!==null&&query.trim()&&(isSearchRoute||isEmbedded||iframeBase||settings.pathSearch||searchPresentation)){
      const cleanPath=iframeBase||appPath('/');
      history.replaceState(null,'',cleanPath+location.hash);
      pendingSearch={input:query,push:true};
    }
    if(pendingSearch){const target=pendingSearch;pendingSearch=null;await navigate(target.input,target.push);}
    else home();
  }catch(e){
    setupFailed=String(e.message||e);pendingSearch=null;
    logDiagnostic('setup error',e.message||e);console.error('HummingProxy setup',e);status('Setup failed — open Diagnostics or try Scramjet 1');
    showRecovery(e.message||String(e));$('setupError').textContent='Proxy setup failed: '+(e.message||String(e))+(String(e.message||'').includes('object stores')?' Scramjet 1 database has missing stores. Scramjet 2 may work on this device.':'');$('setupError').classList.remove('hidden');$('repairProxy').classList.remove('hidden');$('go').disabled=false;
  }
}
function isMissingStore(error){return /object store|NotFoundError|transaction.*IDBDatabase/i.test(String(error?.message||error));}
async function initializeV2(){
      status('Loading Scramjet 2…');
      if(isPagesHost&&!settings.tor)await loadStaticWisp();
      for(const src of [appPath('/v2-scram/scramjet.js'),appPath('/v2-controller/controller.api.js'),appPath('/v2-utils/scramjet-utils.js')]){
        await new Promise((resolve,reject)=>{const tag=document.createElement('script');tag.src=src;tag.onload=resolve;tag.onerror=()=>reject(Error('Could not load '+src));document.head.append(tag);});
      }
      const registration=await navigator.serviceWorker.register(appPath('/sw-v2.js'),{scope:appPath('/v2/'),updateViaCache:'none'});
      const activatedWorker=await waitForWorker(registration);
      const {default: Transport}=await import(settings.transport==='libcurl'?appPath('/v2-libcurl/index.mjs'):appPath('/v2-epoxy/index.mjs'));
      const initialRoute=route();
      if(settings.tor&&!torEndpoint)throw Error('Tor is unavailable');
      v2Controller=new window.$scramjetController.Controller({
        serviceworker:activatedWorker,
        transport:new Transport({wisp:initialRoute.url}),
        config:{prefix:appPath('/v2/p/'),scramjetPath:appPath('/v2-scram/scramjet.js'),wasmPath:appPath('/v2-scram/scramjet.wasm'),injectPath:appPath('/v2-controller/controller.inject.js')},
        scramjetConfig:{files:{wasm:appPath('/v2-scram/scramjet.wasm')}}
      });
      await v2Controller.wait();
      activeTransport=initialRoute.name+'|'+initialRoute.url;
      runtimeEngine='2';
      const keepV2WorkerAlive=()=>{try{registration.active?.postMessage('keepalive');}catch{}};
      setInterval(keepV2WorkerAlive,15000);
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)keepV2WorkerAlive();});
}
async function loadStaticWisp(){
  try{
    const response=await fetch(appPath('/static/wisp.txt'),{cache:'no-store'});
    if(response.ok){const match=(await response.text()).match(/WISP URL:\s*(\S+)/i);if(match&&/^wss:\/\//i.test(match[1]))staticWisp=match[1];}
  }catch{}
}
async function initializeStatic(){
  status('Loading Static Scramjet…');
  await loadStaticWisp();
  await import(appPath('/static/scramjet-engine/scramjet.js'));
  if(!window.$scramjetLoadController)throw Error('Static Scramjet library unavailable');
  const {ScramjetController}=window.$scramjetLoadController();
  scramjet=new ScramjetController({
    prefix:appPath('/static/scramjet/'),
    files:{wasm:appPath('/static/scramjet-engine/scramjet.wasm'),all:appPath('/static/scramjet-engine/scramjet-all.js'),sync:appPath('/static/scramjet-engine/scramjet-sync.js')}
  });
  status('Initializing Static Scramjet storage…');
  await scramjet.init();
  status('Registering Static Scramjet worker…');
  const registration=await navigator.serviceWorker.register(appPath('/static/sw.js'),{scope:appPath('/static/'),updateViaCache:'none'});
  await waitForWorker(registration);
  if(!window._0zzl94?._ak44v7){
    await new Promise((resolve,reject)=>{
      const tag=document.createElement('script');tag.src=appPath('/static/bare-mux/bare-mux.js');
      tag.onload=resolve;tag.onerror=()=>reject(Error('Static BareMux library failed to load'));document.head.append(tag);
    });
  }
  if(!window._0zzl94?._ak44v7)throw Error('Static BareMux API unavailable');
  mux=new window._0zzl94._ak44v7(appPath('/static/bare-mux/bare-mux-worker.js'));
  runtimeEngine='static';
}
async function initializeV1(){
      if(isPagesHost&&!settings.tor)await loadStaticWisp();
      if(!window.$scramjetLoadController){
        await new Promise((resolve,reject)=>{
          const tag=document.createElement('script');
          tag.src=appPath('/scram/scramjet.all.js');
          tag.onload=resolve;
          tag.onerror=()=>reject(Error('Could not load '+tag.src));
          document.head.append(tag);
        });
      }
      if(!window.$scramjetLoadController)throw Error('Scramjet library unavailable');
      const {ScramjetController}=window.$scramjetLoadController();
      scramjet=new ScramjetController({prefix:appPath('/service/'),files:{wasm:appPath('/scram/scramjet.wasm.wasm'),all:appPath('/scram/scramjet.all.js'),sync:appPath('/scram/scramjet.sync.js')}});
      status('Initializing Scramjet storage…');
      await scramjet.init();
      status('Registering service worker…');
      const registration=await navigator.serviceWorker.register(appPath('/sw.js'),{scope:appPath('/'),updateViaCache:'none'});
      await waitForWorker(registration);
      const {BareMuxConnection}=window.BareMux||await import(appPath('/baremux/index.mjs'));
      mux=new BareMuxConnection(appPath('/baremux/worker.js'));
      runtimeEngine='1';
}
async function diagnosticsText(){
  const t=currentTab(),f=t?.frame?.frame;
  const rect=f?.getBoundingClientRect();
  let workers=[];
  try{workers=(await navigator.serviceWorker.getRegistrations()).map(r=>({scope:r.scope,active:r.active?.state||'none',waiting:r.waiting?.state||'none'}));}catch(e){workers=['unavailable: '+e.message];}
  const workerPath=runtimeEngine==='2'?appPath('/v2/'):runtimeEngine==='static'?appPath('/static/'):'/';
  const workerScope=new URL(workerPath,location.origin).href;
  const engineWorker=workers.find(w=>w.scope===workerScope);
  const pageUrl=String(t?.url||'');
  let pageNote='No destination-page diagnosis is available. An iframe load event alone does not prove successful rendering.';
  if(/google\.com\/sorry|\/sorry\/index|recaptcha/i.test(pageUrl))pageNote='Google returned a verification/challenge page. That is a destination-site response, not by itself evidence of a Scramjet startup failure.';
  else if(runtimeEngine&&ready)pageNote='Scramjet runtime initialized. A destination may still show its own block, challenge, or unsupported-page response.';
  else if(!runtimeEngine)pageNote='No Scramjet runtime completed initialization.';
  const frameNote=!f?'No frame has been created.':(!f.isConnected?'Frame is detached.':((f.classList.contains('hidden')||(rect&&rect.width===0&&rect.height===0))?'Frame is hidden or has zero layout size; this can be expected when its tab is inactive or the New Tab overlay is displayed.':'Frame is attached with a non-zero layout size.'));
  const lines=[
    'HummingProxy diagnostics',
    'Time: '+new Date().toISOString(),
    'Browser: '+navigator.userAgent,
    'Origin: '+location.origin,
    'Proxy-only mode: '+Boolean(proxyOnlyMode()),
    'Custom search URL: '+location.origin+appPath('/search?q=%s'),
    'Embedded: '+(window.top!==window),
    'Secure context: '+window.isSecureContext,
    'Preferred engine: '+(settings.scramjetVersion==='static'?'Static Scramjet':'Scramjet '+settings.scramjetVersion),
    'Active engine: '+(runtimeEngine?'Scramjet '+runtimeEngine:'none'),
    'Engine initialized: '+Boolean(runtimeEngine),
    'Fallback used: '+(fallbackV1?'yes — Scramjet 1':fallbackV2?'yes — Scramjet 2':fallbackStatic?'yes — Static Scramjet':'no'),
    'Fallback reason: '+(fallbackReason||'none'),
    'Engine controller: '+(runtimeEngine==='2'?(v2Controller?'Scramjet 2 controller ready':'Scramjet 2 controller missing'):runtimeEngine==='static'?(scramjet?'Static Scramjet controller created':'Static controller missing'):(runtimeEngine==='1'?(scramjet?'Scramjet 1 controller created':'Scramjet 1 controller missing'):'none')),
    'Engine service worker: '+(engineWorker?engineWorker.active:'not registered for '+workerPath),
    'Storage policy hint: '+(window.top!==window?'Third-party iframe; browser storage partitioning or denial possible':'Top-level page'),
    'Storage repair: '+storageRepair,
    'Transport: '+settings.transport,
    'Active transport configured: '+Boolean(activeTransport),
    'Tor selected: '+settings.tor,
    'Page: '+(pageUrl||'none'),
    'Page assessment: '+pageNote,
    'Frame present: '+Boolean(f),
    'Frame attached: '+Boolean(f?.isConnected),
    'Frame hidden: '+Boolean(f?.classList.contains('hidden')),
    'Frame dimensions: '+(rect?Math.round(rect.width)+'x'+Math.round(rect.height):'none'),
    'Frame src: '+(f?.getAttribute('src')||'none'),
    'Frame loading: '+Boolean(t?.busy),
    'Time to first proxied document: '+(Number.isFinite(t?.lastDocumentWaitMs)?(t.lastDocumentWaitMs/1000).toFixed(2)+'s':'not measured yet'),
    'Time to full iframe load: '+(Number.isFinite(t?.lastFrameLoadMs)?(t.lastFrameLoadMs/1000).toFixed(2)+'s':'not measured yet'),
    'Time from request dispatch to full iframe load: '+(Number.isFinite(t?.lastResponseWaitMs)?(t.lastResponseWaitMs/1000).toFixed(2)+'s':'not measured yet'),
    'Device hints: '+(navigator.hardwareConcurrency||'unknown')+' logical CPU cores; '+(navigator.deviceMemory? navigator.deviceMemory+' GB reported RAM':'RAM estimate unavailable'),
    'Frame presentation: '+frameNote,
    'Top-level service worker controller: '+(navigator.serviceWorker.controller?.scriptURL||'none'),
    'Registrations: '+JSON.stringify(workers),
    'Events: '+JSON.stringify(diagnosticEvents,null,2)
  ];
  return lines.join('\n');
}
async function refreshDiagnostics(){ $('diagnosticsOutput').textContent=await diagnosticsText(); }
$('diagnosticsBtn').onclick=()=>{$('diagnosticsPanel').classList.toggle('hidden');if(!$('diagnosticsPanel').classList.contains('hidden'))void refreshDiagnostics();};
$('closeDiagnostics').onclick=()=>$('diagnosticsPanel').classList.add('hidden');
$('refreshDiagnostics').onclick=()=>void refreshDiagnostics();
$('copyDiagnostics').onclick=async()=>{const content=await diagnosticsText();try{await navigator.clipboard.writeText(content);status('Diagnostics copied');}catch{const area=document.createElement('textarea');area.value=content;document.body.append(area);area.select();document.execCommand('copy');area.remove();status('Diagnostics copy attempted');}};
$('repairProxy').onclick=()=>{location.assign(appPath('/repair.html'));};
$('recoveryDismiss').onclick=hideRecovery;
$('recoveryRetry').onclick=()=>location.reload();
$('searchForm').onsubmit=e=>{e.preventDefault();void navigate($('address').value);};
$('browserForm').onsubmit=e=>{e.preventDefault();void navigate($('browserAddress').value);};
$('emptyTabForm').onsubmit=e=>{e.preventDefault();void navigate($('emptyTabAddress').value);};
$('settingsBtn').onclick=()=>{$('settings').classList.toggle('hidden');updateCustomSearchUrl();refreshTor();};
$('copySearchUrl').onclick=async()=>{updateCustomSearchUrl();const value=$('customSearchUrl').value;try{await navigator.clipboard.writeText(value);status('Custom search URL copied');}catch{const field=$('customSearchUrl');field.focus();field.select();try{document.execCommand('copy');status('Custom search URL copied');}catch{status('Select and copy the search URL manually');}}};
$('copyIframeSearchUrl').onclick=async()=>{updateCustomSearchUrl();const value=$('iframeSearchUrl').value;try{await navigator.clipboard.writeText(value);status('Iframe search URL copied');}catch{const field=$('iframeSearchUrl');field.focus();field.select();try{document.execCommand('copy');status('Iframe search URL copied');}catch{status('Select and copy the iframe search URL manually');}}};
$('browserSettings').onclick=()=>{$('settings').classList.toggle('hidden');updateCustomSearchUrl();refreshTor();};
$('closeSettings').onclick=()=>$('settings').classList.add('hidden');

$('clearSiteData').onclick=async()=>{
  if(!confirm('Clear ALL HummingProxy data for '+location.origin+'? This removes saved tabs, bookmarks, settings, customizations, IndexedDB and cached files. This cannot be undone.'))return;
  const button=$('clearSiteData'), output=$('clearSiteDataStatus');
  button.disabled=true;output.textContent='Closing proxy connections and clearing site data…';
  const issues=[];
  try{
    for(const tab of tabs)if(tab.frame)dropFrame(tab);
    if('serviceWorker' in navigator){
      const registrations=await navigator.serviceWorker.getRegistrations();
      for(const registration of registrations){try{await registration.unregister();}catch(error){issues.push('Worker: '+error.message);}}
    }
    if('caches' in window){for(const key of await caches.keys()){try{await caches.delete(key);}catch(error){issues.push('Cache: '+error.message);}}}
    if('indexedDB' in window){
      let names=['$scramjet'];
      if(typeof indexedDB.databases==='function'){
        try{names=[...new Set([...names,...(await indexedDB.databases()).map(db=>db.name).filter(Boolean)])];}catch(error){issues.push('Database listing: '+error.message);}
      }
      for(const name of names){
        const outcome=await new Promise(resolve=>{
          let settled=false;
          const finish=message=>{if(settled)return;settled=true;clearTimeout(timeout);resolve(message);};
          const timeout=setTimeout(()=>finish('Database '+name+' deletion timed out; close other HummingProxy tabs and retry.'),4500);
          try{
            const request=indexedDB.deleteDatabase(name);
            request.onsuccess=()=>finish('');
            request.onerror=()=>finish('Database '+name+': '+(request.error?.message||'unknown error'));
            request.onblocked=()=>finish('Database '+name+' is blocked by another open tab or worker.');
          }catch(error){finish('Database '+name+': '+error.message);}
        });
        if(outcome)issues.push(outcome);
      }
    }
    if(issues.length){output.textContent='Not fully cleared: '+issues.join(' ')+' Close other HummingProxy tabs and retry.';return;}
    try{localStorage.clear();}catch(error){issues.push('Local storage: '+error.message);}
    try{sessionStorage.clear();}catch(error){issues.push('Session storage: '+error.message);}
    if(issues.length){output.textContent=issues.join(' ');return;}
    output.textContent='Site data cleared. Reloading…';
    location.replace(location.pathname+'?reset='+Date.now());
  }catch(error){output.textContent='Could not clear data: '+(error.message||error);}
  finally{button.disabled=false;}
};

$('engine').onchange=e=>{settings.engine=e.target.value;persist();};
$('pathSearch').onchange=e=>{settings.pathSearch=e.target.checked;persist();};
$('proxyOnly').onchange=e=>{
  settings.proxyOnly=e.target.checked;persist();applyAppearance();
  if(proxyOnlyMode()){$('home').classList.add('hidden');$('browser').classList.remove('hidden');$('emptyTab').classList.add('hidden');}
  else if(!proxyOnlyMode()&&!currentTab()?.url&&!currentTab()?.frame){$('browser').classList.add('hidden');$('home').classList.remove('hidden');}
};
$('historyEnabled').onchange=e=>{if(e.target.checked&&!confirm('Enable HummingProxy in-app browsing history? Visited URLs may be stored on this device. This does not control network or server-side logs.')){e.target.checked=false;return;}settings.historyEnabled=e.target.checked;if(!settings.historyEnabled){for(const tab of tabs){tab.history=[];tab.index=-1;}}persist();saveData();updateUI();};
$('customTabTitle').oninput=e=>{settings.customTabTitle=e.target.value.slice(0,80);persist();applyAppearance();};
$('customFavicon').onchange=e=>{settings.customFavicon=safeImage(e.target.value);e.target.value=settings.customFavicon;persist();applyAppearance();};
$('autoFallback').onchange=e=>{settings.autoFallback=e.target.checked;persist();};
$('adblock').onchange=e=>{settings.adblock=e.target.checked;persist();tabs.forEach(ads);};
$('showBookmarks').onchange=e=>{settings.bookmarksVisible=e.target.checked;persist();drawBookmarks();};
$('theme').onchange=e=>{const palette=themes[e.target.value];if(!palette)return;settings.theme=e.target.value;[settings.colorA,settings.colorB,settings.accent]=palette;persist();applyAppearance();syncAppearanceControls();};
for(const id of ['colorA','colorB','accent','newTabBackground','pageBackground','wallpaperDim','rounding','font','buttonColor','buttonTextColor','buttonSize','buttonStyle'])$(id).addEventListener('input',e=>{settings[id]=e.target.value;if(['colorA','colorB','accent'].includes(id))settings.theme='custom';persist();applyAppearance();if(id==='theme')syncAppearanceControls();});
$('motion').onchange=e=>{settings.motion=e.target.checked;persist();applyAppearance();};
$('buttonHover').onchange=e=>{settings.buttonHover=e.target.checked;persist();applyAppearance();};
$('resetAppearance').onclick=()=>{for(const key of ['theme','colorA','colorB','accent','newTabBackground','pageBackground','wallpaperDim','rounding','font','motion','buttonColor','buttonTextColor','buttonSize','buttonStyle','buttonHover'])settings[key]=defaults[key];persist();applyAppearance();syncAppearanceControls();};
async function changeRoute(key,value){
  const old=settings[key];settings[key]=value;persist();
  try{
    if(ready){await switchTransport();for(const t of tabs){if(t.frame)dropFrame(t); }const t=currentTab();if(t?.url&&!isHomeVisible())await navigate(t.url,false);}
  }catch(e){settings[key]=old;persist();$('transport').value=settings.transport;$('tor').checked=settings.tor;activeTransport='';alert(e.message);}
}
$('scramjetVersion').onchange=e=>{
  const next=e.target.value;
  if(next===settings.scramjetVersion)return;
  if(isPagesHost&&next==='static'){e.target.value=settings.scramjetVersion;return;}
  settings.scramjetVersion=next;persist();location.reload();
};
$('transport').onchange=e=>changeRoute('transport',e.target.value);
$('tor').onchange=e=>changeRoute('tor',e.target.checked);
function home(){
  loading(false);
  $('settings').classList.add('hidden');
  $('diagnosticsPanel').classList.add('hidden');
  hideRecovery();
  for(const tab of tabs)if(tab.frame?.frame){tab.frame.frame.classList.add('hidden');tab.frame.frame.style.pointerEvents='none';}
  if(proxyOnlyMode()){
    $('home').classList.add('hidden');
    $('browser').classList.remove('hidden');
    $('emptyTab').classList.add('hidden');
  }else{
    $('browser').classList.add('hidden');
    $('home').classList.remove('hidden');
    $('home').style.pointerEvents='auto';
  }
  $('address').disabled=false;
  $('go').disabled=false;
}
$('homeBtnTop').onclick=home;$('homeBtn').onclick=home;
$('newTab').onclick=()=>createTab();
$('closeBrowserWindow').onclick=()=>home();
$('openTabs').onclick=()=>{if(!tabs.length){createTab();return;}activate(current&&tabs.some(t=>t.id===current)?current:tabs[0].id);};
$('bookmarkToggle').onclick=()=>{
  const t=currentTab();if(!t?.url)return;
  const idx=bookmarks.findIndex(b=>b.url===t.url);
  if(idx>=0)bookmarks.splice(idx,1);else if(bookmarks.length<60)bookmarks.push({url:t.url,title:t.title});
  saveData();drawBookmarks();
};
$('reload').onclick=()=>{const t=currentTab();if(t?.url)navigate(t.url,false);};
$('back').onclick=()=>{const t=currentTab();if(t&&t.index>0)navigate(t.history[--t.index],false);};
$('forward').onclick=()=>{const t=currentTab();if(t&&t.index<t.history.length-1)navigate(t.history[++t.index],false);};
function updateFullscreen(){const full=document.fullscreenElement===$('browser');$('expand').textContent=full?'⤢':'⛶';$('expand').title=full?'Exit fullscreen':'Fullscreen';$('expand').setAttribute('aria-label',$('expand').title);}
$('expand').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('browser').requestFullscreen();}catch(e){status('Fullscreen unavailable: '+e.message);}};
document.addEventListener('fullscreenchange',updateFullscreen);
$('cancelLoad').onclick=()=>loading(false);
$('brandLogo').addEventListener('error',()=>{$('brandLogo').classList.add('hidden');$('logoFallback').classList.remove('hidden');});
if($('brandLogo').complete&&!$('brandLogo').naturalWidth){$('brandLogo').classList.add('hidden');$('logoFallback').classList.remove('hidden');}
init();
})();

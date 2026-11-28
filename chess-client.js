(() => {
'use strict';
const $=id=>document.getElementById(id);
const API='https://lichess.org';
const TOKEN_KEY='hummingbird_lichess_board_token_v1';
const PIECES={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟︎'};
const START_FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
let token='',account=null,connected=false,eventAbort=null,gameAbort=null,seekAbort=null,challengeAbort=null,activeGameId='',gameData=null,gameColor='',position=null,selected=-1,pendingChallenges=new Map(),proxyFrame=null,bridgeReady=null,proxyId=0;
const proxyPending=new Map(),streamBuffers=new WeakMap();
class ApiError extends Error{constructor(status,body){super('Lichess API HTTP '+status+(body?': '+String(body).slice(0,160):''));this.status=status}}
function status(text){$('gameStatus').textContent=text}
function routeStatus(text){$('routeStatus').textContent=text}
function updateControls(){$('seekButton').disabled=!connected;$('challengeButton').disabled=!connected;$('resignButton').disabled=!connected||!activeGameId;$('connectButton').textContent=connected?'Connected':'Connect Lichess'}
function delay(ms,signal){return new Promise(resolve=>{const timer=setTimeout(done,ms);function done(){clearTimeout(timer);signal?.removeEventListener('abort',done);resolve()}if(signal?.aborted)done();else signal?.addEventListener('abort',done,{once:true})})}
function canFallback(code){return [403,451,502,503,504].includes(code)}
function authHeaders(extra){return Object.assign({Authorization:'Bearer '+token,Accept:'application/json'},extra||{})}
function parseJSON(text){if(!text)return null;try{return JSON.parse(text)}catch(_){return {text}}}
function usingProxy(reason){routeStatus('HummingProxy · API only');status('Direct Lichess access failed ('+reason+'). HummingProxy is handling only Lichess API requests and game streams.')}
window.addEventListener('message',event=>{
 if(!proxyFrame||event.source!==proxyFrame.contentWindow||event.origin!==location.origin)return;
 const msg=event.data||{};
 if(msg.type==='ready'){const p=proxyPending.get('ready');if(p){proxyPending.delete('ready');p.resolve()}return}
 if(msg.type==='ready-error'){routeStatus('HummingProxy unavailable');const p=proxyPending.get('ready');if(p){proxyPending.delete('ready');p.reject(new Error(msg.message||'Proxy bridge failed'))}return}
 const p=proxyPending.get(msg.id);if(!p)return;
 if(msg.type==='response'){proxyPending.delete(msg.id);p.resolve({ok:msg.ok,status:msg.status,body:msg.body||''})}
 else if(msg.type==='headers')p.resolveHeaders({ok:msg.ok,status:msg.status});
 else if(msg.type==='chunk')p.onChunk?.(msg.chunk||'');
 else if(msg.type==='end'){proxyPending.delete(msg.id);p.resolveDone()}
 else if(msg.type==='error'){proxyPending.delete(msg.id);const e=new Error(msg.message||'Proxy API request failed');p.rejectHeaders?.(e);p.rejectDone?.(e);p.reject?.(e)}
});
function ensureBridge(){
 if(bridgeReady)return bridgeReady;
 bridgeReady=new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{proxyPending.delete('ready');reject(new Error('HummingProxy API bridge did not initialize.'))},35000);
  proxyPending.set('ready',{resolve:()=>{clearTimeout(timer);resolve()},reject:e=>{clearTimeout(timer);reject(e)}});
  proxyFrame=document.createElement('iframe');proxyFrame.title='Lichess API proxy bridge';proxyFrame.setAttribute('aria-hidden','true');proxyFrame.tabIndex=-1;
  proxyFrame.style.cssText='position:fixed;width:1px;height:1px;left:-10px;bottom:-10px;opacity:0;pointer-events:none;border:0';
  proxyFrame.src='HummingEngine/static/lichess-bridge.html';document.body.appendChild(proxyFrame);
 }).catch(e=>{bridgeReady=null;throw e});
 return bridgeReady;
}
async function proxyRequest(url,init){
 await ensureBridge();const id='p'+(++proxyId);
 return new Promise((resolve,reject)=>{proxyPending.set(id,{resolve,reject});proxyFrame.contentWindow.postMessage({type:'request',id,url,method:init.method||'GET',headers:init.headers||{},body:init.body||'',stream:false},location.origin)});
}
async function proxyStream(url,init,onChunk,signal){
 await ensureBridge();const id='s'+(++proxyId);let resolveHeaders,rejectHeaders,resolveDone;
 const headers=new Promise((resolve,reject)=>{resolveHeaders=resolve;rejectHeaders=reject});
 const done=new Promise(resolve=>{resolveDone=resolve});
 proxyPending.set(id,{resolveHeaders,rejectHeaders,resolveDone,onChunk});
 const abort=()=>{proxyFrame?.contentWindow?.postMessage({type:'abort',id},location.origin);proxyPending.delete(id);resolveDone()};
 if(signal?.aborted)abort();else signal?.addEventListener('abort',abort,{once:true});
 proxyFrame.contentWindow.postMessage({type:'request',id,url,method:init.method||'GET',headers:init.headers||{},body:init.body||'',stream:true},location.origin);
 const meta=await headers;
 return {...meta,done:done.finally(()=>signal?.removeEventListener('abort',abort)),cancel:abort};
}
async function apiRequest(path,options){
 options=options||{};const url=API+path;
 const init={method:options.method||'GET',headers:authHeaders(options.headers),body:options.body,credentials:'omit',cache:'no-store'};
 let failed=null;
 try{
  const response=await fetch(url,init);
  if(canFallback(response.status))failed=new ApiError(response.status,await response.text());
  else{const text=await response.text();if(!response.ok)throw new ApiError(response.status,text);return parseJSON(text)}
 }catch(error){
  if(error.name==='AbortError')throw error;
  if(!(error instanceof TypeError)&&!(error instanceof ApiError&&canFallback(error.status)))throw error;
  failed=error;
 }
 usingProxy(failed?.status?'HTTP '+failed.status:'network/CORS error');
 const response=await proxyRequest(url,init);
 if(!response.ok)throw new ApiError(response.status,response.body);
 return parseJSON(response.body);
}
async function consumeNDJSON(body,onEvent,signal){
 if(!body)return;const reader=body.getReader(),decoder=new TextDecoder();let buffer='';
 const abort=()=>reader.cancel().catch(()=>{});signal?.addEventListener('abort',abort,{once:true});
 try{
  while(!signal?.aborted){const r=await reader.read();if(r.done)break;buffer+=decoder.decode(r.value,{stream:true});let p;
   while((p=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,p).trim();buffer=buffer.slice(p+1);if(line){try{onEvent(JSON.parse(line))}catch(e){console.warn('Bad Lichess event',e)}}}
  }
  buffer+=decoder.decode();if(buffer.trim()){try{onEvent(JSON.parse(buffer.trim()))}catch(_){}}
 }finally{signal?.removeEventListener('abort',abort);try{reader.releaseLock()}catch(_){}}
}
function consumeProxyChunk(signal,chunk,onEvent){
 let buffer=streamBuffers.get(signal)||'';buffer+=chunk;let p;
 while((p=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,p).trim();buffer=buffer.slice(p+1);if(line){try{onEvent(JSON.parse(line))}catch(e){console.warn('Bad proxied Lichess event',e)}}}
 streamBuffers.set(signal,buffer);
}
async function runStream(path,onEvent,signal,options){
 options=options||{};
 while(!signal.aborted){
  try{
   const url=API+path,init={method:options.method||'GET',headers:authHeaders(Object.assign({Accept:'application/x-ndjson'},options.headers||{})),body:options.body,credentials:'omit',cache:'no-store'};
   let failed=null;
   try{
    const response=await fetch(url,init);
    if(canFallback(response.status))failed=new ApiError(response.status,await response.text());
    else if(!response.ok)throw new ApiError(response.status,await response.text());
    else await consumeNDJSON(response.body,onEvent,signal);
   }catch(error){
    if(signal.aborted||error.name==='AbortError')return;
    if(!(error instanceof TypeError)&&!(error instanceof ApiError&&canFallback(error.status)))throw error;
    failed=error;
   }
   if(failed&&!signal.aborted){
    usingProxy(failed.status?'HTTP '+failed.status:'stream/network error');
    const stream=await proxyStream(url,init,chunk=>consumeProxyChunk(signal,chunk,onEvent),signal);
    if(!stream.ok){stream.cancel();throw new ApiError(stream.status,'HummingProxy stream request failed')}
    await stream.done;
   }
  }catch(error){
   if(signal.aborted)return;
   status(error.message||'Lichess stream disconnected');
   if(options.once)return;
   await delay(error instanceof ApiError&&error.status===429?60000:3500,signal);
  }
  if(options.once)return;
  if(!signal.aborted)await delay(700,signal);
 }
}
function parseFen(fen){
 const parts=String(fen||'startpos').trim().split(/\s+/),placement=parts[0]==='startpos'?START_FEN.split(' ')[0]:parts[0],turnText=parts[0]==='startpos'?'w':(parts[1]||'w');
 const board=Array(64).fill('.'),rows=placement.split('/');
 if(rows.length!==8)throw new Error('Invalid game starting position');
 rows.forEach((row,r)=>{let file=0;for(const char of row){if(/^[1-8]$/.test(char))file+=Number(char);else if(/^[prnbqkPRNBQK]$/.test(char)&&file<8)board[r*8+file++]=char;else throw new Error('Invalid FEN row')}if(file!==8)throw new Error('Invalid FEN row')});
 return {board,turn:turnText==='b'?'black':'white'};
}
function squareIndex(s){return (8-Number(s[1]))*8+'abcdefgh'.indexOf(s[0])}
function squareName(i){return 'abcdefgh'[i%8]+(8-Math.floor(i/8))}
function replayMoves(fen,text){
 const p=parseFen(fen),moves=String(text||'').trim().split(/\s+/).filter(Boolean);
 for(const uci of moves){
  if(!/^[a-h][1-8][a-h][1-8][qrbnQRBN]?$/.test(uci))continue;
  const from=squareIndex(uci.slice(0,2)),to=squareIndex(uci.slice(2,4));let piece=p.board[from];if(piece==='.')continue;
  const ff=from%8,tf=to%8,row=Math.floor(from/8);
  if(piece.toLowerCase()==='p'&&ff!==tf&&p.board[to]==='.')p.board[row*8+tf]='.';
  if(piece.toLowerCase()==='k'&&Math.abs(tf-ff)===2){const rf=row*8+(tf>ff?7:0),rt=row*8+(tf>ff?5:3);p.board[rt]=p.board[rf];p.board[rf]='.'}
  if(uci.length===5)piece=p.turn==='white'?uci[4].toUpperCase():uci[4].toLowerCase();
  p.board[from]='.';p.board[to]=piece;p.turn=p.turn==='white'?'black':'white';
 }
 return {...p,moves};
}
function renderBoard(){
 const root=$('chessBoard');root.replaceChildren();
 for(let i=0;i<64;i++){
  const button=document.createElement('button');button.type='button';button.className='chess-client-square '+((Math.floor(i/8)+i%8)%2===0?'light':'dark');
  if(position&&selected===i)button.classList.add('selected');button.dataset.square=String(i);
  const piece=position?position.board[i]:'.';
  if(piece!=='.'){
   if(piece.toLowerCase()==='k'){const img=document.createElement('img');img.className='king'+(piece==='k'?' black-king':'');img.src='img/hummingblock.png';img.alt=piece==='k'?'Black king':'White king';button.appendChild(img)}
   else{const span=document.createElement('span');span.className='chess-client-piece '+(piece===piece.toUpperCase()?'white':'black');span.textContent=PIECES[piece]||'';button.appendChild(span)}
  }
  if(i%8===0){const label=document.createElement('small');label.textContent=String(8-Math.floor(i/8));button.appendChild(label)}
  root.appendChild(button);
 }
}
function renderMoves(){
 if(!position){$('moveList').textContent='No active game';return}
 const rows=[];for(let i=0;i<position.moves.length;i+=2)rows.push((Math.floor(i/2)+1)+'. '+position.moves[i]+(position.moves[i+1]?'  '+position.moves[i+1]:''));
 $('moveList').textContent=rows.length?rows.join('\n'):'Game started — no moves yet';
}
function clock(ms){const sec=Math.max(0,Math.floor(ms/1000));return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')}
function renderGame(){
 renderBoard();renderMoves();
 if(!gameData){$('whitePlayer').textContent='White';$('blackPlayer').textContent='Black';$('whiteClock').textContent='—';$('blackClock').textContent='—';$('resignButton').disabled=true;return}
 const state=gameData.state||{};
 $('whitePlayer').textContent=gameData.white?.name||gameData.white?.id||'White';$('blackPlayer').textContent=gameData.black?.name||gameData.black?.id||'Black';
 $('whiteClock').textContent=state.wtime==null?'—':clock(state.wtime);$('blackClock').textContent=state.btime==null?'—':clock(state.btime);
 $('resignButton').disabled=!activeGameId||state.status!=='started';
}
function renderChallenges(){
 const area=$('incomingChallenges');area.replaceChildren();
 if(!pendingChallenges.size){const p=document.createElement('p');p.className='chess-client-muted';p.textContent=connected?'No incoming challenges':'Connect to receive challenges';area.appendChild(p);return}
 for(const [id,ch] of pendingChallenges){
  const item=document.createElement('div');item.className='chess-client-challenge';
  const detail=document.createElement('div'),name=document.createElement('strong'),info=document.createElement('small');
  name.textContent=ch.challenger?.name||'Lichess player';info.textContent=(ch.speed||'chess')+' · '+(ch.timeControl?.show||'time control')+' · '+(ch.rated?'Rated':'Casual');detail.append(name,info);
  const actions=document.createElement('div');actions.className='chess-client-row';
  const accept=document.createElement('button');accept.type='button';accept.textContent='Accept';accept.addEventListener('click',()=>answerChallenge(id,true));
  const decline=document.createElement('button');decline.type='button';decline.className='secondary';decline.textContent='Decline';decline.addEventListener('click',()=>answerChallenge(id,false));
  actions.append(accept,decline);item.append(detail,actions);area.appendChild(item);
 }
}
function controls(){ $('seekButton').disabled=!connected;$('challengeButton').disabled=!connected;$('resignButton').disabled=!connected||!activeGameId;$('connectButton').textContent=connected?'Connected':'Connect Lichess'}
async function connect(){
 token=$('lichessToken').value.trim();if(!token){status('Paste your Lichess token first');return}
 if($('rememberToken').checked)localStorage.setItem(TOKEN_KEY,token);else localStorage.removeItem(TOKEN_KEY);
 try{
  status('Checking Lichess account…');account=await apiRequest('/api/account');connected=true;controls();
  status('Connected as '+(account.username||account.id)+'. Listening for challenges…');
  eventAbort?.abort();eventAbort=new AbortController();runStream('/api/stream/event',handleEvent,eventAbort.signal);renderChallenges();
 }catch(e){connected=false;account=null;controls();status(e.message)}
}
function disconnect(){
 connected=false;account=null;token='';eventAbort?.abort();eventAbort=null;gameAbort?.abort();gameAbort=null;seekAbort?.abort();seekAbort=null;challengeAbort?.abort();challengeAbort=null;
 activeGameId='';gameData=null;gameColor='';position=null;selected=-1;pendingChallenges.clear();
 localStorage.removeItem(TOKEN_KEY);$('lichessToken').value='';controls();renderBoard();renderGame();renderChallenges();
 status('Disconnected. The local token has been cleared.');routeStatus('Direct API · proxy fallback ready');
}
function handleEvent(event){
 if(event.type==='challenge'&&event.challenge){
  if(event.challenge.variant?.key==='standard'||!event.challenge.variant?.key){pendingChallenges.set(event.challenge.id,event.challenge);renderChallenges()}
 }else if(event.type==='challengeCanceled'||event.type==='challengeDeclined'){
  const id=event.challenge?.id||event.challengeId;if(id)pendingChallenges.delete(id);renderChallenges();
 }else if(event.type==='gameStart'&&event.game){const id=event.game.gameId||event.game.id;if(id)startGame(id)}
 else if(event.type==='gameFinish'&&event.game&&(event.game.gameId||event.game.id)===activeGameId){status('Lichess game finished');seekAbort?.abort();seekAbort=null}
}
async function answerChallenge(id,accept){
 try{await apiRequest('/api/challenge/'+encodeURIComponent(id)+'/'+(accept?'accept':'decline'),{method:'POST'});pendingChallenges.delete(id);renderChallenges();status(accept?'Challenge accepted. Waiting for game start…':'Challenge declined')}
 catch(e){status(e.message)}
}
async function challengeUser(){
 const name=$('challengeUsername').value.trim();if(!name){status('Enter a Lichess username');return}
 if(challengeAbort){status('Cancel the current outgoing challenge first.');return}
 const pair=$('challengeTime').value.split('|'),form=new URLSearchParams();
 form.set('rated',$('ratedGame').checked?'true':'false');form.set('variant','standard');
 form.set('color',$('challengeColor').value);form.set('clock.limit',pair[0]);form.set('clock.increment',pair[1]);
 form.set('keepAliveStream','true');
 const controller=challengeAbort=new AbortController();
 $('challengeButton').disabled=true;$('challengeCancelButton').disabled=false;$('challengeButton').textContent='Challenge open';
 status('Sending challenge to '+name+'…');
 runStream('/api/challenge/'+encodeURIComponent(name),event=>{
   if(event.done){
     status(event.done==='accepted'?'Challenge accepted. The game will arrive through your Lichess event stream.':'Challenge '+event.done+'.');
     controller.abort();
   }
 },controller.signal,{method:'POST',body:form.toString(),headers:{'Content-Type':'application/x-www-form-urlencoded'},once:true})
 .finally(()=>{
   if(challengeAbort===controller)challengeAbort=null;
   if(!challengeAbort){$('challengeButton').disabled=!connected;$('challengeButton').textContent='Send challenge';$('challengeCancelButton').disabled=true;}
 });
}
function cancelOutgoingChallenge(){
 if(!challengeAbort)return;
 challengeAbort.abort();challengeAbort=null;
 $('challengeButton').disabled=!connected;$('challengeButton').textContent='Send challenge';$('challengeCancelButton').disabled=true;
 status('Outgoing challenge canceled by closing its keep-alive stream.');
}
async function findOpponent(){
 if(!connected)return;if(seekAbort){await cancelSeek();return}
 const pair=$('seekTime').value.split('|'),form=new URLSearchParams({rated:'false',time:pair[0],increment:pair[1],variant:'standard',color:'random'});
 const controller=seekAbort=new AbortController();
 $('seekButton').textContent='Cancel search';status('Searching Lichess for a random opponent…');
 runStream('/api/board/seek',()=>{},controller.signal,{method:'POST',body:form.toString(),headers:{'Content-Type':'application/x-www-form-urlencoded'},once:true})
 .finally(()=>{
   if(seekAbort===controller){seekAbort=null;$('seekButton').textContent='Find opponent';if(!activeGameId)status('Opponent search ended. Find another opponent to search again.');}
 });
}
async function cancelSeek(){
 if(!seekAbort)return;seekAbort.abort();seekAbort=null;$('seekButton').textContent='Find opponent';
 try{await apiRequest('/api/board/seek',{method:'DELETE'})}catch(_){}status('Opponent search cancelled');
}
function startGame(id){
 seekAbort?.abort();seekAbort=null;$('seekButton').textContent='Find opponent';gameAbort?.abort();gameAbort=new AbortController();
 activeGameId=id;gameData=null;gameColor='';position=null;selected=-1;renderGame();status('Game '+id+' started. Loading board…');
 runStream('/api/board/game/stream/'+encodeURIComponent(id),handleGameEvent,gameAbort.signal,{once:true});controls();
}
function handleGameEvent(event){
 if(event.type==='gameFull'){
  gameData=event;const own=(account?.id||'').toLowerCase();
  if(own&&String(event.white?.id||'').toLowerCase()===own)gameColor='white';
  else if(own&&String(event.black?.id||'').toLowerCase()===own)gameColor='black';else gameColor='';
  applyState(event.state,event.initialFen);
 }else if(event.type==='gameState'){if(!gameData)gameData={initialFen:'startpos',white:{},black:{}};applyState(event,gameData.initialFen)}
 renderGame();
}
function applyState(state,fen){
 if(!state)return;position=replayMoves(fen||gameData?.initialFen||'startpos',state.moves||'');if(gameData)gameData.state=state;selected=-1;renderBoard();renderMoves();
 if(state.status&&state.status!=='started'){status('Game finished — '+(state.winner?state.winner+' wins':'draw'));gameAbort?.abort();}
 else if(!gameColor)status('Game loaded, but account colour could not be identified');
 else if(position.turn===gameColor)status('Your move. Select one of your pieces, then a destination');
 else status('Opponent to move. Their moves arrive through the Lichess game stream');
}
async function sendMove(from,to){
 if(!activeGameId||!position||!gameColor)return;if(position.turn!==gameColor){status('It is not your turn');return}
 const piece=position.board[from],owns=gameColor==='white'?piece===piece.toUpperCase():piece===piece.toLowerCase();
 if(piece==='.'||!owns){status('Select one of your own pieces');return}
 const target=position.board[to];if(target!=='.'&&((gameColor==='white'&&target===target.toUpperCase())||(gameColor==='black'&&target===target.toLowerCase()))){status('You cannot capture your own piece');return}
 let uci=squareName(from)+squareName(to);if(piece.toLowerCase()==='p'&&(Math.floor(to/8)===0||Math.floor(to/8)===7))uci+=$('promotionPiece').value;
 selected=-1;renderBoard();status('Sending move to Lichess…');
 try{await apiRequest('/api/board/game/'+encodeURIComponent(activeGameId)+'/move/'+uci,{method:'POST'});status('Move accepted. Waiting for updated game state…')}
 catch(e){status(e.message);renderBoard()}
}
function boardClick(event){
 const button=event.target.closest('[data-square]');if(!button||!position)return;const target=Number(button.dataset.square);
 if(!Number.isInteger(target)||target<0||target>=64)return;
 if(!activeGameId||!gameColor){status('Start a Lichess game first');return}
 if(position.turn!==gameColor){status('Wait for your opponent to move');return}
 if(selected<0){const p=position.board[target],own=gameColor==='white'?p===p.toUpperCase():p===p.toLowerCase();if(p!=='.'&&own){selected=target;renderBoard()}return}
 if(target===selected){selected=-1;renderBoard();return}
 const p=position.board[target],own=p!=='.'&&(gameColor==='white'?p===p.toUpperCase():p===p.toLowerCase());
 if(own){selected=target;renderBoard();return}
 sendMove(selected,target);
}
async function resign(){
 if(!activeGameId||!confirm('Resign this Lichess game?'))return;
 try{await apiRequest('/api/board/game/'+encodeURIComponent(activeGameId)+'/resign',{method:'POST'});status('Resignation sent')}
 catch(e){status(e.message)}
}
function bind(){
 $('connectButton').addEventListener('click',connect);$('disconnectButton').addEventListener('click',disconnect);
 $('challengeButton').addEventListener('click',challengeUser);$('challengeCancelButton').addEventListener('click',cancelOutgoingChallenge);
 $('seekButton').addEventListener('click',findOpponent);
 $('resignButton').addEventListener('click',resign);$('chessBoard').addEventListener('click',boardClick);
 $('challengeUsername').addEventListener('keydown',e=>{if(e.key==='Enter')challengeUser()});
 window.addEventListener('pagehide',()=>{eventAbort?.abort();gameAbort?.abort();seekAbort?.abort()});
}
bind();controls();renderBoard();renderGame();renderChallenges();
const saved=localStorage.getItem(TOKEN_KEY)||'';if(saved){$('lichessToken').value=saved;status('Saved token ready. Press Connect Lichess.')}
})();
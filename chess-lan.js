(() => {
'use strict';
const $=id=>document.getElementById(id);
const GLYPH={P:'♙',N:'♘',B:'♗',R:'♖',Q:'♕',p:'♟︎',n:'♞',b:'♝',r:'♜',q:'♛'};
const KNIGHT=[-33,-31,-18,-14,14,18,31,33],BISHOP=[-17,-15,15,17],ROOK=[-16,-1,1,16],KING=[-17,-16,-15,-1,1,15,16,17],PROMOS=['q','r','b','n'];
let peer=null,channel=null,myColor=0,room='',playerName='Player',remoteName='Friend',game=createGame(),selected=-1,connected=false,role='';
function status(t){$('roomStatus').textContent=t}
function gameStatus(t){$('gameStatus').textContent=t}
function onBoard(i){return i>=0&&i<128&&!(i&0x88)}
function side(p){return p==='.'?0:p===p.toUpperCase()?1:-1}
function idx(f,r){return r*16+f}
function squareName(i){return 'abcdefgh'[i&7]+(8-(i>>4))}
function createGame(){const board=Array(128).fill('.'),back='RNBQKBNR';for(let f=0;f<8;f++){board[f]=back[f].toLowerCase();board[16+f]='p';board[96+f]='P';board[112+f]=back[f]}return{board,turn:1,castle:15,ep:-1,half:0,full:1,last:null,over:false,status:'White to move'}}
function attacked(s,target,by){
 for(let r=0;r<8;r++)for(let f=0;f<8;f++){const from=idx(f,r),p=s.board[from];if(side(p)!==by)continue;const t=p.toLowerCase();
  if(t==='p'){const next=from-16*by;if(target===next-1||target===next+1)return true;continue}
  const dirs=t==='n'?KNIGHT:t==='b'?BISHOP:t==='r'?ROOK:t==='q'?BISHOP.concat(ROOK):KING;
  for(const d of dirs){let to=from+d;while(onBoard(to)){if(to===target)return true;if(s.board[to]!=='.'||t==='n'||t==='k')break;to+=d}}
 }return false;
}
function inCheck(s,color){const k=s.board.indexOf(color===1?'K':'k');return k<0||attacked(s,k,-color)}
function pseudo(s){
 const out=[],add=(from,to,flag)=>{const p=s.board[from];if(p.toLowerCase()==='p'&&((to>>4)===0||(to>>4)===7))PROMOS.forEach(promotion=>out.push({from,to,promotion,flag:flag||''}));else out.push({from,to,promotion:'',flag:flag||''})};
 for(let r=0;r<8;r++)for(let f=0;f<8;f++){const from=idx(f,r),p=s.board[from];if(side(p)!==s.turn)continue;const t=p.toLowerCase();
  if(t==='p'){const step=-16*s.turn,one=from+step;if(onBoard(one)&&s.board[one]==='.'){add(from,one);const home=s.turn===1?6:1,two=from+step*2;if(r===home&&s.board[two]==='.')add(from,two)}
   for(const d of [-1,1]){const to=one+d;if(!onBoard(to))continue;if(side(s.board[to])===-s.turn&&s.board[to].toLowerCase()!=='k')add(from,to);else if(to===s.ep&&s.board[to]==='.'&&s.board[to+16*s.turn]===(s.turn===1?'p':'P'))add(from,to,'ep')}continue}
  const dirs=t==='n'?KNIGHT:t==='b'?BISHOP:t==='r'?ROOK:t==='q'?BISHOP.concat(ROOK):KING;
  for(const d of dirs){let to=from+d;while(onBoard(to)){if(side(s.board[to])===s.turn)break;if(s.board[to].toLowerCase()!=='k')add(from,to);if(s.board[to]!=='.'||t==='n'||t==='k')break;to+=d}}
  const home=s.turn===1?116:4,rook=s.turn===1?'R':'r',kb=s.turn===1?1:4,qb=s.turn===1?2:8;
  if(t==='k'&&from===home&&!inCheck(s,s.turn)){if((s.castle&kb)&&s.board[home+3]===rook&&s.board[home+1]==='.'&&s.board[home+2]==='.'&&!attacked(s,home+1,-s.turn)&&!attacked(s,home+2,-s.turn))add(from,home+2,'castle');if((s.castle&qb)&&s.board[home-4]===rook&&s.board[home-1]==='.'&&s.board[home-2]==='.'&&s.board[home-3]==='.'&&!attacked(s,home-1,-s.turn)&&!attacked(s,home-2,-s.turn))add(from,home-2,'castle')}
 }return out;
}
function applyBare(s,m){
 const board=s.board.slice(),p=board[m.from],captured=board[m.to];board[m.from]='.';board[m.to]=m.promotion?(s.turn===1?m.promotion.toUpperCase():m.promotion):p;
 if(m.flag==='ep')board[m.to+16*s.turn]='.';
 if(m.flag==='castle'){const rf=m.to>m.from?m.from+3:m.from-4,rt=m.to>m.from?m.from+1:m.from-1;board[rt]=board[rf];board[rf]='.'}
 let castle=s.castle;const rb={119:1,112:2,7:4,0:8};if(p==='K')castle&=~3;if(p==='k')castle&=~12;if(p.toLowerCase()==='r')castle&=~(rb[m.from]||0);if(captured.toLowerCase()==='r')castle&=~(rb[m.to]||0);
 return{board,turn:-s.turn,castle,ep:p.toLowerCase()==='p'&&Math.abs(m.to-m.from)===32?(m.to+m.from)/2:-1,half:p.toLowerCase()==='p'||captured!=='.'||m.flag==='ep'?0:s.half+1,full:s.full+(s.turn===-1?1:0)};
}
function legal(s){return pseudo(s).filter(m=>!inCheck(applyBare(s,m),s.turn))}
function result(s){const moves=legal(s),check=inCheck(s,s.turn);if(!moves.length)return{over:true,text:check?'Checkmate — '+(s.turn===1?'Black':'White')+' wins.':'Draw — stalemate.'};if(s.half>=100)return{over:true,text:'Draw — fifty-move rule.'};return{over:false,text:(s.turn===1?'White':'Black')+' to move'+(check?' · Check':'')}}
function applyMove(m,send){
 const uci=squareName(m.from)+squareName(m.to)+(m.promotion||''),next=applyBare(game,m);game={...next,last:{from:m.from,to:m.to},over:false,status:''};
 const r=result(game);game.over=r.over;game.status=r.text;selected=-1;render();
 if(send&&channel&&channel.readyState==='open')channel.send(JSON.stringify({type:'move',from:m.from,to:m.to,promotion:m.promotion||'',color:myColor}));
}
function receiveMove(data){
 if(!Number.isInteger(data.from)||!Number.isInteger(data.to)||data.color!==-myColor||game.turn!==data.color)return false;
 const m=legal(game).find(x=>x.from===data.from&&x.to===data.to&&x.promotion===(data.promotion||''));if(!m)return false;applyMove(m,false);return true;
}
function render(){
 const root=$('board');root.replaceChildren();const possible=selected>=0?legal(game).filter(m=>m.from===selected):[];
 for(let display=0;display<64;display++){const actual=myColor===-1?63-display:display,file=actual&7,rank=actual>>3,piece=game.board[actual],button=document.createElement('button');
  button.type='button';button.className='lan-square '+((file+rank)%2===0?'light':'dark');if(actual===selected)button.classList.add('selected');if(possible.some(m=>m.to===actual))button.classList.add(piece==='.'?'target':'capture-target');
  button.dataset.square=String(actual);button.disabled=!connected||game.over||game.turn!==myColor;
  if(piece!=='.'){if(piece.toLowerCase()==='k'){const img=document.createElement('img');img.className='lan-king'+(piece==='k'?' black':'');img.src='img/hummingblock.png';img.alt=piece==='k'?'Black king':'White king';button.appendChild(img)}else{const span=document.createElement('span');span.className='lan-piece '+(side(piece)===1?'white':'black');span.textContent=GLYPH[piece];button.appendChild(span)}}
  if(file===0){const label=document.createElement('small');label.textContent=String(8-rank);button.appendChild(label)}root.appendChild(button)
 }
 $('whiteName').textContent=(role==='host'?playerName:remoteName)+' · White';$('blackName').textContent=(role==='guest'?playerName:remoteName)+' · Black';
 $('whiteSide').textContent=role==='host'?'You':'Peer';$('blackSide').textContent=role==='guest'?'You':'Peer';$('newGame').disabled=!connected;gameStatus(connected?game.status:'Waiting for a peer connection.');
}
function resetGame(send){game=createGame();selected=-1;render();if(send&&channel&&channel.readyState==='open')channel.send(JSON.stringify({type:'reset'}))}
function chooseSquare(to){
 if(!connected||game.over)return;if(game.turn!==myColor){gameStatus('Wait for your opponent to move.');return}
 if(selected<0){if(side(game.board[to])===myColor){selected=to;render()}return}
 if(to===selected){selected=-1;render();return}
 const moves=legal(game).filter(m=>m.from===selected&&m.to===to);
 if(moves.length){let chosen=moves[0];if(moves.length>1&&moves[0].promotion)chosen=moves.find(m=>m.promotion===$('promotion').value)||moves[0];applyMove(chosen,true);return}
 if(side(game.board[to])===myColor){selected=to;render()}else{selected=-1;render()}
}
function setConnected(){
 connected=true;status('Connected to '+remoteName+' in "'+room+'". Moves now travel directly between the two browsers.');render();
 if(channel&&channel.readyState==='open')channel.send(JSON.stringify({type:'hello',name:playerName,room}));
}
function attachChannel(ch){
 ch.onopen=setConnected;ch.onclose=()=>{connected=false;status('The other player disconnected.');render()};ch.onerror=()=>status('The local peer connection reported an error.');
 ch.onmessage=event=>{let msg;try{msg=JSON.parse(event.data)}catch(_){return}
  if(msg.type==='hello'){remoteName=String(msg.name||'Friend').slice(0,24);if(role==='guest'&&msg.room)room=String(msg.room).slice(0,36);render()}
  else if(msg.type==='move'){if(!receiveMove(msg))gameStatus('Ignored an invalid or out-of-turn move from the peer.')}
  else if(msg.type==='reset'){resetGame(false);gameStatus('New game started by '+remoteName+'.')}
 };
}
function closePeer(){connected=false;try{channel?.close()}catch(_){}try{peer?.close()}catch(_){}channel=null;peer=null}
function setupPeer(host){
 closePeer();role=host?'host':'guest';myColor=host?1:-1;connected=false;game=createGame();selected=-1;peer=new RTCPeerConnection({iceServers:[]});
 peer.onconnectionstatechange=()=>{if(peer.connectionState==='failed')status('Direct LAN connection failed. Confirm both devices are on the same Wi-Fi and allow local connections.');else if(peer.connectionState==='disconnected')status('Peer disconnected. Waiting for the connection to return…')};
 peer.oniceconnectionstatechange=()=>{if(peer.iceConnectionState==='failed')status('ICE connection failed. This network or browser may block direct local connections.')};
 if(host){channel=peer.createDataChannel('hummingbird-chess',{ordered:true});attachChannel(channel)}else peer.ondatachannel=e=>{channel=e.channel;attachChannel(channel)};
}
function bytesToBase64Url(bytes){let bin='';for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function base64UrlToBytes(value){const raw=value.trim().replace(/-/g,'+').replace(/_/g,'/'),padded=raw+'='.repeat((4-raw.length%4)%4),bin=atob(padded);return Uint8Array.from(bin,c=>c.charCodeAt(0))}
async function encodeCode(value){
 const compact={v:2,t:value.type==='offer'?'o':'a',r:value.room,n:value.host||value.guest||'',s:value.sdp};
 const source=JSON.stringify(compact);
 if(typeof CompressionStream==='function'){
  try{const stream=new Blob([source]).stream().pipeThrough(new CompressionStream('deflate'));const bytes=new Uint8Array(await new Response(stream).arrayBuffer());return 'HB2:'+bytesToBase64Url(bytes)}catch(_){}
 }
 return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(value)));
}
async function decodeCode(value){
 const input=String(value||'').trim();
 if(input.startsWith('HB2:')){
  if(typeof DecompressionStream!=='function')throw new Error('This browser cannot read compressed Hummingbird invite codes. Update your browser.');
  const bytes=base64UrlToBytes(input.slice(4)),stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
  const compact=JSON.parse(await new Response(stream).text());
  if(compact.v!==2||(compact.t!=='o'&&compact.t!=='a')||typeof compact.s!=='string')throw new Error('Invalid compressed invite code.');
  return{version:1,type:compact.t==='o'?'offer':'answer',room:compact.r,host:compact.t==='o'?compact.n:undefined,guest:compact.t==='a'?compact.n:undefined,sdp:compact.s};
 }
 return JSON.parse(new TextDecoder().decode(base64UrlToBytes(input)));
}
function waitForIce(pc,timeoutMs=12000){if(pc.iceGatheringState==='complete')return Promise.resolve(true);return new Promise(resolve=>{let finished=false;const timer=setTimeout(()=>finish(false),timeoutMs);function finish(complete){if(finished)return;finished=true;clearTimeout(timer);pc.removeEventListener('icegatheringstatechange',changed);resolve(complete)}function changed(){if(pc.iceGatheringState==='complete')finish(true)}pc.addEventListener('icegatheringstatechange',changed)})}
async function createRoom(){
 if(!window.RTCPeerConnection){status('This browser does not support WebRTC.');return}
 room=$('roomName').value.trim();if(!room){status('Give your room a name first.');$('roomName').focus();return}
 playerName=$('playerName').value.trim()||'Host';setupPeer(true);
 try{const offer=await peer.createOffer();await peer.setLocalDescription(offer);status('Preparing the local invitation code…');await waitForIce(peer);
  $('offerCode').value=await encodeCode({version:1,type:'offer',room,host:playerName,sdp:peer.localDescription.sdp});$('copyOffer').disabled=false;$('connectGuest').disabled=false;
  status('Room "'+room+'" created. Copy the invitation code and send it to your friend. You are White.');render()
 }catch(e){status(e.message||'Could not create the room.');closePeer()}
}
async function joinRoom(){
 if(!window.RTCPeerConnection){status('This browser does not support WebRTC.');return}
 let invite;try{invite=await decodeCode($('offerCode').value)}catch(e){status(e.message||'Paste a valid host invitation code first.');return}
 if(invite.version!==1||invite.type!=='offer'||!invite.sdp||!invite.room){status('That is not a valid Hummingbird LAN invitation.');return}
 playerName=$('playerName').value.trim()||'Guest';room=String(invite.room).slice(0,36);remoteName=String(invite.host||'Host').slice(0,24);$('roomName').value=room;$('answerCode').value='';$('copyAnswer').disabled=true;setupPeer(false);status('Joining "'+room+'" and gathering local network details…');
 try{await peer.setRemoteDescription({type:'offer',sdp:invite.sdp});const answer=await peer.createAnswer();await peer.setLocalDescription(answer);status('Preparing your answer code for "'+room+'”…');await waitForIce(peer);
  $('answerCode').value=await encodeCode({version:1,type:'answer',room,guest:playerName,sdp:peer.localDescription.sdp});$('copyAnswer').disabled=false;
  status('You are joining "'+room+'" as Black. Copy your answer code and send it back to the host.');render()
 }catch(e){status(e.message||'Could not join this room.');closePeer()}
}
async function connectGuest(){
 if(!peer||role!=='host'){status('Create a room on this device first.');return}
 let answer;try{answer=await decodeCode($('answerCode').value)}catch(e){status(e.message||'Paste your friend’s answer code first.');return}
 if(answer.version!==1||answer.type!=='answer'||!answer.sdp||answer.room!==room){status('The answer code does not match this room.');return}
 try{remoteName=String(answer.guest||'Guest').slice(0,24);await peer.setRemoteDescription({type:'answer',sdp:answer.sdp});status('Answer accepted. Connecting directly to '+remoteName+'…')}
 catch(e){status(e.message||'Could not accept the answer code.')}
}
async function copyText(value){if(!value){status('There is no code to copy yet.');return}try{await navigator.clipboard.writeText(value);status('Code copied. Send it to the other player.')}catch(_){status('Clipboard is unavailable. Select the code and copy it manually.')}}
function init(){
 $('createRoom').addEventListener('click',createRoom);$('joinRoom').addEventListener('click',joinRoom);$('connectGuest').addEventListener('click',connectGuest);
 $('copyOffer').addEventListener('click',()=>copyText($('offerCode').value));$('copyAnswer').addEventListener('click',()=>copyText($('answerCode').value));
 $('newGame').addEventListener('click',()=>resetGame(true));
 $('board').addEventListener('click',e=>{const b=e.target.closest('[data-square]');if(b)chooseSquare(Number(b.dataset.square))});
 window.addEventListener('pagehide',closePeer);render();
}
init();
})();
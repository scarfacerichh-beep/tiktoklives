export class AvatarPlayer{
 constructor(video,{state=()=>{}}={}){this.video=video;this.state=state;this.generation=0;this.volume=.85;this.audibleVolume=.85;this.failed=false;this.listeners=[];for(const[type,handler]of Object.entries({loadedmetadata:()=>{if(!this.failed)this.emit('ready');},playing:()=>{if(!this.failed&&!video.paused&&!video.ended)this.emit('playing');},pause:()=>{if(!this.failed&&!video.ended)this.emit('paused');},ended:()=>{if(!this.failed)this.emit('ended');},error:()=>{this.failed=true;this.emit('error');},volumechange:()=>this.emit('volume')})){video.addEventListener(type,handler);this.listeners.push([type,handler]);}video.volume=this.volume;}
 emit(name){this.state({name,muted:this.video.muted,volume:this.video.volume});}
 async play(){const generation=++this.generation;if(this.failed){this.emit('error');return false;}this.emit('loading');try{await this.video.play();if(generation!==this.generation)return false;return true;}catch(error){if(generation!==this.generation)return false;this.emit(error.name==='NotAllowedError'?'blocked':'error');return false;}}
 pause(){this.generation++;this.video.pause();}
 restart(){this.video.currentTime=0;return this.play();}
 setVolume(value){const n=Number(value);if(!Number.isFinite(n))return;this.volume=Math.max(0,Math.min(1,n));this.video.volume=this.volume;if(this.volume>0){this.audibleVolume=this.volume;this.video.muted=false;}this.emit('volume');}
 toggleMute(){if(this.video.muted||this.video.volume===0){this.video.muted=false;if(this.video.volume===0)this.video.volume=this.audibleVolume;}else this.video.muted=true;this.emit('volume');}
 destroy(){this.generation++;for(const[type,handler]of this.listeners)this.video.removeEventListener(type,handler);this.video.pause();this.listeners=[];}
}
export const readings=[{title:'A Estrela',text:'Renove sua esperança. Reconheça os pequenos avanços e dê espaço ao que você quer construir.'},{title:'O Sol',text:'Valorize o que traz alegria. Um gesto simples de cuidado pode iluminar o seu dia e o de outra pessoa.'},{title:'A Lua',text:'Observe seus sentimentos com calma. Antes de tirar conclusões, acolha o que sente e busque clareza.'}];
export function readingFor(value){const index=Number(value)-1;return Number.isInteger(index)&&index>=0&&index<readings.length?readings[index]:null;}

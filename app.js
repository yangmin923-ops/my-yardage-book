const nav=document.querySelector('.navigation');
function syncNavHeight(){document.documentElement.style.setProperty('--nav-height',nav.offsetHeight+'px');}
syncNavHeight();new ResizeObserver(syncNavHeight).observe(nav);
const cards=[...document.querySelectorAll('.hole-card')];
const links=[...document.querySelectorAll('.hole-links a')];
function mark(id){links.forEach(a=>{const active=a.hash==='#'+id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});document.getElementById('current-hole').textContent=id.replace('hole-','')+' / 18';}
let scheduled=false;function track(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{const edge=nav.getBoundingClientRect().bottom+32;const current=cards.find(c=>c.getBoundingClientRect().bottom>edge)||cards[cards.length-1];mark(current.id);scheduled=false;});}
addEventListener('scroll',track,{passive:true});addEventListener('resize',track);track();
document.querySelectorAll('video').forEach(video=>{video.addEventListener('play',()=>{document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();});});const error=()=>{video.parentElement.querySelector('.video-error').hidden=false;};video.addEventListener('error',error);video.querySelector('source').addEventListener('error',error);});
// Load and autoplay only the video visible below the sticky navigation.
let videoObserver;
function observeVideos(){
  if(videoObserver)videoObserver.disconnect();
  videoObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const video=entry.target;
      if(!entry.isIntersecting || entry.intersectionRatio<0.5){video.pause();return;}
      const source=video.querySelector('source');
      if(!source.hasAttribute('src')){source.src=source.dataset.src;video.muted=true;video.load();}
      if(!document.hidden)video.play().catch(()=>{
        const message=video.parentElement.querySelector('.video-error');
        message.textContent='자동 재생이 제한되었습니다. 재생 버튼을 눌러 주세요.';
        message.hidden=false;
      });
    });
  },{threshold:[0,0.5],rootMargin:'-'+nav.offsetHeight+'px 0px 0px 0px'});
  document.querySelectorAll('video').forEach(video=>videoObserver.observe(video));
}
observeVideos();
new ResizeObserver(observeVideos).observe(nav);
document.addEventListener('visibilitychange',()=>{
  document.querySelectorAll('video').forEach(video=>video.pause());
  if(!document.hidden)observeVideos();
});

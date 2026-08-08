/* Ascent mobile nav — builds a hamburger menu from the existing nav on small screens.
   No-op on desktop (the button is hidden by CSS). Runs on every marketing page. */
(function(){
  function build(){
    var navin=document.querySelector('nav .navin');
    if(!navin || navin.dataset.mob) return;
    var nl=navin.querySelector('.nl');
    var book=navin.querySelector(':scope > .btn.g');
    if(!nl) return;
    navin.dataset.mob='1';

    /* put a "Book a call" at the bottom of the dropdown so it lives inside the menu on mobile */
    if(book){
      var b=book.cloneNode(true);
      b.className='btn g menubook';
      nl.appendChild(b);
    }

    var btn=document.createElement('button');
    btn.type='button';
    btn.className='navtog';
    btn.setAttribute('aria-label','Open menu');
    btn.setAttribute('aria-expanded','false');
    btn.innerHTML='<span></span><span></span><span></span>';
    navin.appendChild(btn);

    function setOpen(open){
      navin.classList.toggle('menuopen',open);
      btn.setAttribute('aria-expanded',open?'true':'false');
      btn.setAttribute('aria-label',open?'Close menu':'Open menu');
    }
    btn.addEventListener('click',function(){ setOpen(!navin.classList.contains('menuopen')); });
    /* tap a link → close */
    nl.addEventListener('click',function(e){ if(e.target.closest('a')) setOpen(false); });
    /* Esc closes */
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') setOpen(false); });
    /* leaving mobile width resets the menu */
    window.addEventListener('resize',function(){ if(window.innerWidth>900) setOpen(false); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build);
  else build();
})();

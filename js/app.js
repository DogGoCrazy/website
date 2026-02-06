document.addEventListener('DOMContentLoaded',function(){
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  // initialize from saved preference
  const saved = localStorage.getItem('theme');
  if(saved === 'dark') root.setAttribute('data-theme','dark');
  document.getElementById('year').textContent = new Date().getFullYear();

  themeToggle.addEventListener('click', ()=>{
    const isDark = root.getAttribute('data-theme') === 'dark';
    if(isDark){
      root.removeAttribute('data-theme');
      localStorage.setItem('theme','light');
    } else {
      root.setAttribute('data-theme','dark');
      localStorage.setItem('theme','dark');
    }
  });

  // small accessibility helper: focus visible outline
  document.body.addEventListener('keyup', (e)=>{
    if(e.key === 'Tab') document.body.classList.add('show-focus');
  });
});

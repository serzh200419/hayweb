document.querySelectorAll<HTMLDetailsElement>('.mobile-menu').forEach(menu=>{
 const summary=menu.querySelector('summary')!;
 menu.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;summary.focus();event.preventDefault();}});
 menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;summary.focus();}));
 document.addEventListener('click',event=>{if(menu.open&&event.target instanceof Node&&!menu.contains(event.target)){const hadFocus=menu.contains(document.activeElement);menu.open=false;if(hadFocus)summary.focus();}});
 matchMedia('(min-width: 1201px)').addEventListener('change',event=>{if(event.matches){const hadFocus=menu.contains(document.activeElement);menu.open=false;if(hadFocus)document.querySelector<HTMLAnchorElement>('.desktop-navigation a')?.focus();}});
});

'use strict';
// Coordinates describe where the character's feet may touch the scene.
window.walkSurfaces=(()=>{
 const zones={
  3:[[7,94,70,96]], // Dry paving in front of the pool, never the water.
  4:[[7,94,89,97],[56,94,74,97]] // Foreground floor and the corridor beside the bed.
 };
 function rectangles(scene){return zones[scene]||[[7,93,66,93]]}
 function allowed(scene,x,y){return rectangles(scene).some(([l,r,t,b])=>x>=l&&x<=r&&y>=t&&y<=b)}
 function point(scene,x,y){let best=null,distance=Infinity;for(const[l,r,t,b]of rectangles(scene)){const p={x:Math.max(l,Math.min(r,x)),y:Math.max(t,Math.min(b,y))},d=(p.x-x)**2+(p.y-y)**2;if(d<distance){best=p;distance=d}}return best}
 function depth(scene,y){return scene===3?.85+(y-70)/170:scene===4?.93+(y-74)/200:.7+(y-66)/95}
 return{rectangles,allowed,point,depth};
})();

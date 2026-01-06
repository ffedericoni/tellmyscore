import{i as b,ɵ as C,C as v,N as x,a as y,D as G,R as O,w as T,b as a,c as s,d as o,e as l,j as i,k as _,n as M,x as g,f as F,h as I,aa as P,y as d,q as c,A as w,u,o as k,p as S}from"./index-BH9wt9iL.js";import{S as $}from"./storage.service-BAQ0acWl.js";function N(e,n){e&1&&(a(0,"div",3),s(1," No games recorded yet. Go to "),a(2,"a",4),s(3,"Scores"),o(),s(4," to start playing! "),o())}function D(e,n){if(e&1&&(a(0,"span"),s(1),o()),e&2){const t=c().$implicit;i(),w(t.title)}}function R(e,n){e&1&&(a(0,"span"),s(1,"Untitled Game"),o())}function V(e,n){if(e&1&&(a(0,"th"),s(1),o()),e&2){const t=n.$implicit;i(),u(" ",t.name," ")}}function j(e,n){if(e&1&&(a(0,"th"),s(1),o()),e&2){const t=n.$implicit,r=c().$implicit,p=c();i(),u(" ",p.getGameTotal(r,t.id)," ")}}function A(e,n){if(e&1){const t=M();a(0,"div",5)(1,"h3"),l(2,D,2,1,"span",6)(3,R,2,0,"span",6),a(4,"small"),s(5),g(6,"date"),g(7,"date"),o(),a(8,"div",7)(9,"button",8),F("click",function(){const p=k(t).index,h=c();return S(h.deleteGame(p))}),I(10,"i",9),o()()(),a(11,"table",10)(12,"thead")(13,"tr"),l(14,V,2,1,"th",11),o()(),a(15,"tbody")(16,"tr"),l(17,j,2,1,"th",11),o()()()()}if(e&2){const t=n.$implicit;i(2),_("ngIf",t.title),i(),_("ngIf",!t.title),i(2),P("",d(6,6,t.started,"mediumDate")," ",d(7,9,t.started,"shortTime"),""),i(9),_("ngForOf",t.players),i(3),_("ngForOf",t.players)}}const m=class m{constructor(){this.storage=b($),this.games=this.storage.games}deleteGame(n){confirm("Are you sure you want to delete this game?")&&this.storage.games.update(t=>{const r=[...t];return r.splice(n,1),r})}getGameTotal(n,t){return n.totals[t]||0}};m.ɵfac=function(t){return new(t||m)},m.ɵcmp=C({type:m,selectors:[["app-games"]],decls:5,vars:2,consts:[[1,"container"],["class","alert alert-info",4,"ngIf"],["class","game-table delete-animation",4,"ngFor","ngForOf"],[1,"alert","alert-info"],["routerLink","/scores"],[1,"game-table","delete-animation"],[4,"ngIf"],[1,"toolbar-right"],[1,"btn","btn-danger",3,"click"],[1,"fa","fa-trash-o"],[1,"table"],[4,"ngFor","ngForOf"]],template:function(t,r){t&1&&(a(0,"div",0)(1,"h1"),s(2,"Games"),o(),l(3,N,5,0,"div",1)(4,A,18,12,"div",2),o()),t&2&&(i(3),_("ngIf",r.games().length===0),i(),_("ngForOf",r.games()))},dependencies:[v,x,y,G,O,T],styles:[`.game-table[_ngcontent-%COMP%] {
  margin-bottom: 2rem;
}
.game-table[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  margin-top: 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.game-table[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {
  font-size: 65%;
  margin-left: 10px;
  color: #777;
}
.game-table[_ngcontent-%COMP%]   .toolbar-right[_ngcontent-%COMP%] {
  float: right;
}`]});let f=m;export{f as GamesComponent};

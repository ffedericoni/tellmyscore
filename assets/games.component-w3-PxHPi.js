import{i as T,S as O,w as v,D as b,ɵ as E,C as S,N as I,a as x,R as F,B as P,T as y,b as A,c as s,d as o,e as _,f as i,g,l as a,m as h,n as p,o as l,r as N,h as L,k as w,E as k,F as C,z as d,u as f,s as D,t as $}from"./index-CcAiTb-F.js";function R(e,n){e&1&&(s(0,"div",3),o(1),_(2,"translate"),s(3,"a",4),o(4),_(5,"translate"),i(),o(6),_(7,"translate"),i()),e&2&&(a(),d(" ",p(2,3,"GAMES.NO_GAMES")," "),a(3),h(p(5,5,"GAMES.NO_GAMES_LINK")),a(2),d(" ",p(7,7,"GAMES.NO_GAMES_SUFFIX")," "))}function B(e,n){if(e&1&&(s(0,"span"),o(1),i()),e&2){const t=f().$implicit;a(),h(t.title)}}function V(e,n){e&1&&(s(0,"span"),o(1),_(2,"translate"),i()),e&2&&(a(),h(p(2,1,"GAMES.UNTITLED")))}function z(e,n){if(e&1&&(s(0,"th"),o(1),i()),e&2){const t=n.$implicit;a(),d(" ",t.name," ")}}function U(e,n){if(e&1&&(s(0,"th"),o(1),i()),e&2){const t=n.$implicit,r=f().$implicit,c=f();a(),d(" ",c.getGameTotal(r,t.id)," ")}}function j(e,n){if(e&1){const t=N();s(0,"div",5)(1,"h3"),g(2,B,2,1,"span",6)(3,V,3,3,"span",6),s(4,"small"),o(5),_(6,"date"),_(7,"date"),i(),s(8,"div",7)(9,"button",8),L("click",function(){const c=D(t).index,u=f();return $(u.deleteGame(c))}),w(10,"i",9),i()()(),s(11,"table",10)(12,"thead")(13,"tr"),g(14,z,2,1,"th",11),i()(),s(15,"tbody")(16,"tr"),g(17,U,2,1,"th",11),i()()()()}if(e&2){const t=n.$implicit;a(2),l("ngIf",t.title),a(),l("ngIf",!t.title),a(2),k("",C(6,6,t.started,"mediumDate")," ",C(7,9,t.started,"shortTime"),""),a(9),l("ngForOf",t.players),a(3),l("ngForOf",t.players)}}const m=class m{constructor(){this.storage=T(O),this.translate=T(v),this.games=this.storage.games}deleteGame(n){const t=this.games()[n],r=new b(this.translate.currentLang).transform(t.started,"mediumDate"),c=this.translate.instant("GAMES.DELETE_CONFIRM_TITLE")+" "+r+"?";confirm(c)&&this.storage.games.update(u=>{const M=[...u];return M.splice(n,1),M})}getGameTotal(n,t){return n.totals[t]||0}};m.ɵfac=function(t){return new(t||m)},m.ɵcmp=E({type:m,selectors:[["app-games"]],decls:6,vars:5,consts:[[1,"container"],["class","alert alert-info",4,"ngIf"],["class","game-table delete-animation",4,"ngFor","ngForOf"],[1,"alert","alert-info"],["routerLink","/scores"],[1,"game-table","delete-animation"],[4,"ngIf"],[1,"toolbar-right"],[1,"btn","btn-danger",3,"click"],[1,"fa","fa-trash-o"],[1,"table"],[4,"ngFor","ngForOf"]],template:function(t,r){t&1&&(s(0,"div",0)(1,"h1"),o(2),_(3,"translate"),i(),g(4,R,8,9,"div",1)(5,j,18,12,"div",2),i()),t&2&&(a(2),h(p(3,3,"GAMES.TITLE")),a(2),l("ngIf",r.games().length===0),a(),l("ngForOf",r.games()))},dependencies:[S,I,x,b,F,P,y,A],styles:[`.game-table[_ngcontent-%COMP%] {
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
}`]});let G=m;export{G as GamesComponent};

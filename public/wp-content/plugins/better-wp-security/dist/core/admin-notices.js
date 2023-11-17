this.itsec=this.itsec||{},this.itsec.core=this.itsec.core||{},this.itsec.core["admin-notices"]=(window.itsecWebpackJsonP=window.itsecWebpackJsonP||[]).push([[8],{"1Zi1":function(e,t,n){},"1ZqX":function(e,t){!function(){e.exports=this.wp.data}()},"6IbE":function(e,t,n){},Ckse:function(e,t,n){},GRId:function(e,t){!function(){e.exports=this.wp.element}()},Hz6T:function(e,t){!function(){e.exports=this.itsec.core["admin-notices-api"]}()},K9lf:function(e,t){!function(){e.exports=this.wp.compose}()},KTI5:function(e,t,n){},TSYQ:function(e,t,n){
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
!function(){"use strict";var t={}.hasOwnProperty;function n(){for(var e=[],i=0;i<arguments.length;i++){var c=arguments[i];if(c){var a=typeof c;if("string"===a||"number"===a)e.push(c);else if(Array.isArray(c)){if(c.length){var o=n.apply(null,c);o&&e.push(o)}}else if("object"===a)if(c.toString===Object.prototype.toString)for(var r in c)t.call(c,r)&&c[r]&&e.push(r);else e.push(c.toString())}}return e.join(" ")}e.exports?(n.default=n,e.exports=n):"function"==typeof define&&"object"==typeof define.amd&&define.amd?define("classnames",[],(function(){return n})):window.classNames=n}()},UuzZ:function(e,t){!function(){e.exports=this.wp.autop}()},VwaH:function(e,t,n){},Y8OO:function(e,t){!function(){e.exports=this.wp.domReady}()},YLtl:function(e,t){!function(){e.exports=this.lodash}()},dwGD:function(e,t,n){"use strict";n.r(t);var i=n("GRId"),c=n("l3Sj"),a=n("Y8OO"),o=n.n(a),r=n("tI+e"),s=(n("Hz6T"),n("TSYQ")),l=n.n(s),u=n("K9lf"),m=n("1ZqX"),d=n("rE5z");n("6IbE");var b=Object(u.compose)([Object(m.withSelect)((function(e){return{notices:e("ithemes-security/admin-notices").getNotices(),noticesLoaded:e("ithemes-security/admin-notices").areNoticesLoaded()}})),Object(u.withState)({isToggled:!1})])((function(e){var t=e.notices,n=e.noticesLoaded,a=e.isToggled,o=e.setState;return Object(i.createElement)(i.Fragment,null,Object(i.createElement)(r.Button,{id:"itsec-admin-notices-toolbar-trigger",className:l()("ab-item ab-empty-item",{"itsec-admin-notices-toolbar--has-notices":t.length>0}),onClick:function(){return o({isToggled:!a})},"aria-expanded":a},Object(i.createElement)("span",{className:"it-icon-itsec"}),Object(i.createElement)("span",{className:"itsec-toolbar-text"},Object(c.__)("Security","better-wp-security")),t.length>0&&Object(i.createElement)("span",{className:"itsec-admin-notices-toolbar-bubble"},Object(i.createElement)("span",{className:"itsec-admin-notices-toolbar-bubble__count"},t.length))),a&&Object(i.createElement)(r.Popover,{className:"itsec-admin-notices-toolbar__popover",noArrow:!0,expandOnMobile:!0,focusOnMount:"container",position:"bottom center",headerTitle:Object(c.__)("Security","better-wp-security"),onClose:function(){return o({isToggled:!1})},onFocusOutside:function(){return o({isToggled:!1})}},Object(i.createElement)(d.a,{notices:t,loaded:n,close:function(){return o({isToggled:!1})}})))}));n("1Zi1");var O=function(e){var t=e.portalEl;return Object(i.createElement)(r.SlotFillProvider,null,Object(i.createPortal)(Object(i.createElement)(r.Popover.Slot,null),t),Object(i.createElement)(b,null))};n.p=window.itsecWebpackPublicPath,Object(c.setLocaleData)({"":{}},"better-wp-security"),o()((function(){var e=document.getElementById("wp-admin-bar-itsec_admin_bar_menu"),t=document.getElementById("itsec-admin-notices-root");return Object(i.render)(Object(i.createElement)(O,{portalEl:t}),e)}))},l3Sj:function(e,t){!function(){e.exports=this.wp.i18n}()},"o/Pk":function(e,t,n){},rE5z:function(e,t,n){"use strict";var i=n("GRId"),c=n("TSYQ"),a=n.n(c),o=n("YLtl"),r=n("l3Sj"),s=n("tI+e"),l=n("K9lf"),u=n("1ZqX"),m=n("UuzZ");n("VwaH");function d(e){var t=e.notice;return Object(i.createElement)("article",{className:"itsec-admin-notice itsec-admin-notice--severity-".concat(t.severity)},Object(i.createElement)("header",{className:"itsec-admin-notice__header"},Object(i.createElement)("div",{className:"itsec-admin-notice__header-inset"},Object(i.createElement)("h4",{dangerouslySetInnerHTML:{__html:t.title||b(t.message,t)}}),Object(o.map)(t.actions,(function(e,t){return"primary"===e.style&&Object(i.createElement)(s.Button,{key:t,href:e.uri},e.title)})))),t.title&&t.message&&Object(i.createElement)("section",{className:"itsec-admin-notice__message",dangerouslySetInnerHTML:{__html:Object(m.autop)(b(t.message,t))}}),function(e){if(Object(o.isEmpty)(e.meta))return!1;if(1===Object(o.size)(e.meta)&&e.meta.hasOwnProperty("created_at"))return!1;return!0}(t)&&Object(i.createElement)("dl",{className:"itsec-admin-notice__meta"},Object(o.map)(t.meta,(function(e,t){return"created_at"!==t&&Object(i.createElement)(i.Fragment,{key:t},Object(i.createElement)("dt",null,e.label),Object(i.createElement)("dd",null,e.formatted))}))),t.meta.created_at&&Object(i.createElement)("footer",{className:"itsec-admin-notice__footer"},Object(i.createElement)("time",{dateTime:t.meta.created_at.value},t.meta.created_at.formatted)))}function b(e,t){for(var n in t.actions)t.actions.hasOwnProperty(n)&&""!==t.actions[n].uri&&(e=e.replace("{{ $"+n+" }}",t.actions[n].uri));return e}n("o/Pk");var O=Object(l.compose)([Object(u.withDispatch)((function(e){return{doAction:e("ithemes-security/admin-notices").doNoticeAction}})),Object(u.withSelect)((function(e,t){return{inProgress:e("ithemes-security/admin-notices").getInProgressActions(t.notice.id)}}))])((function(e){var t=e.notice,n=e.doAction,c=e.inProgress,a=[],l=function(e){if(!t.actions.hasOwnProperty(e))return"continue";var o=t.actions[e];"close"===o.style&&a.push(Object(i.createElement)("li",{key:e},Object(i.createElement)(s.Button,{icon:"dismiss",label:o.title,onClick:function(){return n(t.id,e)},isBusy:c.includes(e)})))};for(var u in t.actions)l(u);var m=function(e){var t={};for(var n in e.actions)if(e.actions.hasOwnProperty(n)){var i=e.actions[n];"close"!==i.style&&"primary"!==i.style&&(t[n]=i)}return t}(t);return Object(o.isEmpty)(m)||a.push(Object(i.createElement)("li",{key:"more"},Object(i.createElement)(s.Dropdown,{position:"bottom right",className:"itsec-admin-notice-list-actions__more-menu",contentClassName:"itsec-admin-notice-list-actions__more-menu-items",renderToggle:function(e){var t=e.isOpen,n=e.onToggle;return Object(i.createElement)(s.Button,{icon:"ellipsis",label:Object(r.__)("More Actions","better-wp-security"),onClick:n,"aria-haspopup":!0,"aria-expanded":t})},renderContent:function(){return Object(i.createElement)(s.NavigableMenu,{role:"menu"},Object(o.map)(m,(function(e,a){return e.uri?Object(i.createElement)(s.Button,{key:a,href:e.uri},e.title):Object(i.createElement)(s.Button,{key:a,onClick:function(){return n(t.id,a)},disabled:c.includes(a)},e.title,c.includes(a)&&Object(i.createElement)(s.Spinner,null))})))}}))),Object(i.createElement)("ul",{className:"itsec-admin-notice-list-actions"},a)}));n("Ckse");var f=function(e){var t=e.notices;return Object(i.createElement)("ul",{className:"itsec-admin-notice-list"},t.map((function(e){return Object(i.createElement)("li",{className:"itsec-admin-notice-list-item-container",key:e.id},Object(i.createElement)(O,{notice:e}),Object(i.createElement)(d,{notice:e,noticeId:e.id}))})))};n("KTI5");t.a=Object(l.compose)([Object(l.withState)({isConfiguring:!1,checked:{}}),Object(u.withSelect)((function(e){return{mutedHighlights:e("ithemes-security/admin-notices").getMutedHighlights(),mutedHighlightUpdatesInFlight:e("ithemes-security/admin-notices").getMutedHighlightUpdatesInFlight()}})),Object(u.withDispatch)((function(e){return{updateMutedHighlight:e("ithemes-security/admin-notices").updateMutedHighlight}}))])((function(e){var t=e.notices,n=e.loaded,c=e.mutedHighlights,l=e.mutedHighlightUpdatesInFlight,u=e.updateMutedHighlight,m=e.isConfiguring,d=e.setState;return Object(i.createElement)("div",{className:a()("itsec-admin-notice-panel",{"itsec-admin-notice-panel--is-configuring":m})},Object(i.createElement)(s.Button,{icon:"admin-generic",label:Object(r.__)("Configure","better-wp-security"),className:"itsec-admin-notice-panel__configure-trigger",style:{opacity:Object(o.size)(c)>0?1:0},onClick:function(){return d({isConfiguring:!m})}}),Object(i.createElement)("header",{className:"itsec-admin-notice-panel__header"},Object(i.createElement)("h3",null,Object(r.__)("Security Admin Messages","better-wp-security")),Object(i.createElement)("p",null,Object(r.__)("Important notices from iThemes Security","better-wp-security"))),m&&Object(i.createElement)("ul",{className:"itsec-admin-notice-panel__configure-highlighted-logs"},[{slug:"file-change-report",label:Object(r.__)("File Change Report","better-wp-security")},{slug:"notification-center-send-failed",label:Object(r.__)("Notification Center Errors","better-wp-security")},{slug:"malware-scan-report",label:Object(r.__)("Malware Scan Report","better-wp-security")},{slug:"malware-scan-failed",label:Object(r.__)("Malware Scan Failed","better-wp-security")},{slug:"site-scanner-report",label:Object(r.__)("Site Scan Report","better-wp-security")}].map((function(e){var t=e.slug,a=e.label;return void 0!==c[t]&&Object(i.createElement)("li",null,Object(i.createElement)("label",{htmlFor:"itsec-mute-highlight-".concat(t)},a),Object(i.createElement)(s.FormToggle,{id:"itsec-mute-highlight-".concat(t),disabled:!n||l[t],checked:!Object(o.get)(l,[t,"mute"],c[t]),onChange:function(){return u(t,!c[t])}}))}))),t.length>0?Object(i.createElement)(f,{notices:t}):n&&Object(i.createElement)("span",null,Object(r.__)("No notices at the moment.","better-wp-security")))}))},"tI+e":function(e,t){!function(){e.exports=this.wp.components}()}},[["dwGD",0]]]);
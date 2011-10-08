(function () {
//ded's domready
!function(a,b){function m(a){l=1;while(a=c.shift())a()}var c=[],d,e,f=!1,g=b.documentElement,h=g.doScroll,i="DOMContentLoaded",j="addEventListener",k="onreadystatechange",l=/^loade|c/.test(b.readyState);b[j]&&b[j](i,e=function(){b.removeEventListener(i,e,f),m()},f),h&&b.attachEvent(k,d=function(){/^c/.test(b.readyState)&&(b.detachEvent(k,d),m())}),a.domReady=h?function(a){self!=top?l?a():c.push(a):function(){try{g.doScroll("left")}catch(b){return setTimeout(function(){domReady(a)},50)}a()}()}:function(a){l?a():c.push(a)}}(this,document)

function sjax(a){if(AJAX=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP")){AJAX.open("GET",a,false);AJAX.send(null);return AJAX.responseText}else return false}

function str_trim(a){return a.replace(/\n/gm,"").replace(/^\s\s*/,"").replace(/\s\s*$/,"")}

function strip_css_comments(a){return a.replace(/\/\*([\s\S]*?)\*\//gim,"")}

function rgb2hex(a,b,c){return((256+a<<8|b)<<8|c).toString(16).slice(1)}

if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  }
}


var prefixes0123 = ["transform","transform-origin","transition","transition-property","transition-duration","transition-timing-function","transition-delay","user-select"];
var prefixes01 = ["border-radius","box-shadow","column-count","column-gap","column-rule","column-rule-style","column-rule-color","column-rule-width","column-width","background-size","background-origin","border-image","border-image-source","border-image-width","border-image-outset","border-image-repeat"];
var prefixes013 = ["box-flex","box-orient","box-align","box-ordinal-group","box-flex-group","box-pack","box-direction","box-lines","box-sizing"];

var supported_rules = ["border-bottom-left-radius", "border-bottom-right-radius", "border-top-left-radius", "border-top-right-radius", "display", "opacity", "text-overflow", "background-clip", "background-image", "background"].concat(prefixes0123).concat(prefixes01).concat(prefixes013);
var prefix = ["-moz-", "-webkit-", "-o-", "-ms-"];
var css_regex = /([\s\S]*?)\{([\s\S]*?)\}/gim;


domReady(function () {
var style_els = document.getElementsByTagName("style");
var link_els = document.getElementsByTagName("link");
var css_files = [];
//Processing external stylesheets
for (var x in link_els) {
	if (typeof (link_els[x]) === "object" && link_els[x].className === "cssfx") {
		css_files.push(sjax(link_els[x].href));
	}
}
//Processing in-page stylesheets
for (var x in style_els) {
	if (typeof (style_els[x]) === "object") {
		css_files.push(style_els[x].innerHTML);
	}
}

for (var x in css_files) {
	if(typeof css_files[x] === "string"){
	var css_fx_output = document.createElement('style');
	css_fx_output.setAttribute('type', 'text/css');
	var css = css_files[x];
	var rules = [];
	for (var y = 0, match_count = css.match(css_regex).length; y < match_count; y++) {
		var match = css_regex.exec(css);
		if (match !== null) {
			var selector = str_trim(strip_css_comments(match[1]));
			var rule = str_trim(strip_css_comments(match[2])).replace(/\s{2,}|\t/gm, " ");
			for (var z in supported_rules) {
				if (rule.indexOf(supported_rules[z]) != -1) {
					if (converted_rule = cssFxProcessElement(selector, rule)) {
						rules.push(converted_rule);
					}
					break;
				}
			}
		}
	}
	if (rules.length>0) {
		var css_fx_rules = rules.join("\n")
		if (css_fx_output.styleSheet) {
			//Internet Explorer
			css_fx_output.styleSheet.cssText = css_fx_rules;
		} else {
			//Everyone else
			css_fx_output.textContent = css_fx_rules;
		}
		document.getElementsByTagName("head")[0].appendChild(css_fx_output);
	}
}
}

function cssFxProcessElement(e, rule) {
	var css_array = rule.split(";"), rules = [];
	for (var r in css_array) {
		if (typeof css_array[r] === "string" && css_array[r].indexOf(":") !== -1) {
			var rule = css_array[r].split(":");
			rule[0] = str_trim(rule[0]);
			rule[1] = str_trim(rule[1]);
			var new_rules = [];
			var clean_rule = rule.join(":");
			if (prefixes01.indexOf(rule[0]) !== -1) {
				new_rules.push(prefix[0] + clean_rule);
				new_rules.push(prefix[1] + clean_rule);
			} else if (prefixes013.indexOf(rule[0]) !== -1) {
				//-moz, -webkit, -ms
				new_rules.push(prefix[0] + clean_rule);
				new_rules.push(prefix[1] + clean_rule);
				if (rule[0] === "box-align") {
					new_rules.push(prefix[3] + rule[0] + ":middle");
				} else {
					new_rules.push(prefix[3] + clean_rule);
				}
			} else if (prefixes0123.indexOf(rule[0]) !== -1) {
				//-moz, -webkit, -o, -ms
				new_rules.push(prefix[0] + clean_rule);
				new_rules.push(prefix[1] + clean_rule);
				new_rules.push(prefix[2] + clean_rule);
				new_rules.push(prefix[3] + clean_rule);
			} else {
				switch (rule[0]) {
				case "border-top-left-radius":
				case "border-top-right-radius":
				case "border-bottom-left-radius":
				case "border-bottom-right-radius":
					var v = rule[0].split("-");
					new_rules.push(prefix[0] + "border-radius-" + v[1] + v[2] + ":" + rule[1]);
					new_rules.push(prefix[1] + clean_rule);
					break;
				case "display":
					if (rule[1] === "box") {
						new_rules.push("display:" + prefix[0] + rule[1]);
						new_rules.push("display:" + prefix[1] + rule[1]);
						new_rules.push("display:" + prefix[3] + rule[1]);
					} else if (rule[1] === "inline-block") {
						new_rules.push("display:" + prefix[0] + "inline-stack");
						new_rules.push("zoom:1;*display:inline");
					}
					break;
				case "text-overflow":
					if (rule[1] === "ellipsis") {
						new_rules.push(prefix[2] + clean_rule);
					}
					break;
				case "opacity":
					new_rules.push("filter: alpha(opacity=" + parseInt(parseFloat(rule[1]) * 100) + ")");
					new_rules.push(prefix[0] + clean_rule);
					new_rules.push(prefix[1] + clean_rule);
					break;
				case "background-clip":
					if (rule[1] === "padding-box") {
						new_rules.push(prefix[1] + clean_rule);
						new_rules.push(prefix[0] + rule[0] + ":padding");
					}
					break;
				case "background-image":
				case "background-color":
				case "background":
					var lg = "linear-gradient";
					if (rule[1].indexOf(lg) === 0) {
						var attributes = rule[1].substr(lg.length);
						if (rule[0] === "background-image") {
							attributes = rule[1].substr(lg.length).match(/\((.*)\)/)[0];
						}
						var prop = lg + attributes;
						new_rules.push(rule[0] + ":" + prefix[0] + prop);
						new_rules.push(rule[0] + ":" + prefix[1] + "gradient" + prop);
						new_rules.push(rule[0] + ":" + prefix[1] + prop);
						new_rules.push(rule[0] + ":" + prefix[2] + prop);
						new_rules.push(rule[0] + ":" + prefix[3] + prop);
					}
					else if(rule[1].indexOf("rgba") !== -1){
						//Color array
						var cA = rule[1].match(/rgba\((.*?)\)/)[1].split(",");
						var hex = Math.floor(+(str_trim(cA[3]))*255).toString(16)+rgb2hex(+str_trim(cA[0]),+str_trim(cA[1]),+str_trim(cA[2]));
						new_rules.push("filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#"+hex+",endColorstr=#"+hex+");zoom:1");
					}
					break;
				}
			}
			if (new_rules.length > 0) {
				rules.push(new_rules.join(";"));
			}
		}
	}
	return (rules.length > 0 ? e + "{" + rules.join(";") + "}" : false);
}

})
})();

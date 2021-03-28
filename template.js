

// from https://dev.to/jadenconcord/how-to-make-a-simple-js-templating-framework-hhd
function myFramework(template){
    var ex = /{(.+)}/
    while(template.match(ex)){
      var match = template.match(ex);
      template = template.replace(match[0], eval(match[1]));
    }
    return template;
  }

  var values = {
    name: 'Joe',
    age: 42,
    favorateColor: 'red',
  }
  
  var template = "{name} is {age} and {name}'s favorite color is {favorateColor}. {unknown}"
  
  // replace each {value} of values
  for (var value in values) {
    template = template.replace(RegExp('{' + value + '}', 'g'), values[value])
  }
  
  // Replace templates where the variable was not found
  template = template.replace(/{\w+}/g, '')


  // From https://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
  var TemplateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g, 
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, 
        code = 'var r=[];\\n', 
        cursor = 0, 
        match;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\\n' : 'r.push(' + line + ');\\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\\\"') + '");\\n' : '');
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\\r\\t\\n]/g, '')).apply(options);
}



module.exports = function(html, options) {
	var re = /<%(.+?)%>/g, 
		reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g, 
		code = 'with(obj) { var r=[];\n', 
		cursor = 0, 
		result,
	    	match;
	var add = function(line, js) {
		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(html)) {
		add(html.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(html.substr(cursor, html.length - cursor));
	code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');
	try { result = new Function('obj', code).apply(options, [options]); }
	catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
	return result;
}


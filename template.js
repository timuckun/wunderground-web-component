// I wrote this but it didn't work with spaeces inside the delimieters

export function render_template(template) {
  var ex = /{{\s*(.+?)\s*}}/gm;
  while (template.match(ex)) {
    const match = template.match(ex);
    console.log(match);
    console.log(match[0]);
    console.log(match[1]);
    console.log(this.station)
    console.log(this.station.id);
    console.log('this.' + match[1]);
    const value = eval('this.' + match[1])
    if (value){
    template = template.replace(match[0], value);
    }else{
      template= template.replace(match[0], "'" + match[1] + "' is not defined")
    }
  }
  return template;
}


// From https://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
// modified so it doesn't blow up on one error
export function render(html, options) {
  var re = /{{(.+?)}}/g, ///<%(.+?)%>/g,
    reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
    code = "with(obj) { var r=[];\n",
    cursor = 0,
    result,
    match;
  var add = function (line, js) {
    console.log(`line == ${line}`);
    console.log(`js ${js}`);

    if(js)
    {
      code += line.match(reExp) ? line + "\n" : "try{r.push(" + line + ")}catch{};\n"
    }else{
      code +=line != "" ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : "";
    }
    console.log(code);
    return add;
  };
  while ((match = re.exec(html))) {
    console.log(match[0]);
   // console.log(match[1]);
    
    add(html.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }
  add(html.substr(cursor, html.length - cursor));
  code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, " ");
 // console.log(code);
  try {
    result = new Function("obj", code).apply(options, [options]);
    
  } catch (err) {
    console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
  }
  return result;
}


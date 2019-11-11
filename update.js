//===========================================================================
//
// Code for reading form the data JSON & building the webpage
//
//===========================================================================


var fs = require('fs');
var Mustache = require('mustache');
//===========================================================================
//
// Build Webpage
//
//===========================================================================
 function buildpage()
{
  var dataFile = {};
  // Consolidate all the data
  let nodes = ["grey",
               "blue",
               "red",
               "green",
               "black",
               "white",
               "titles",
               "dorms",
               "living-conditions",
               "mysteries",
               "friends"
              ];
  
  for (const node of nodes)
  {
    dataFile[node] = loadDataFile(node);
  }

  let htmlFill = makeDataView(dataFile);
  let simpleData = makeSimpleKeyMap(dataFile);
  let sectionData = makeSectionKeyMap(dataFile);
  
  // Write DataFile
  let strDF1 = JSON.stringify(simpleData);
  overwriteFileData('public/','dataFile.json',strDF1)
  
  // Write DataFile
  let strDF2 = JSON.stringify(sectionData);
  overwriteFileData('public/','sectionFile.json',strDF2)
    
  // Write HTML Fill File  
  let template = fs.readFileSync("base.html", 'utf8');
  let html = Mustache.render(template, htmlFill);
  overwriteFileData('views/','index.html',html)
}

function loadDataFile(node)
{
  if(!node)
  {
    console.log("Error loading Node!");
    return;
  }
  try{
    
    let buffer = fs.readFileSync("./data/"+node+".json", 'utf8'); 
  
    if(!buffer)
    {
      console.log("Error loading Node!");
      return;
    }
    return JSON.parse(buffer);
  }
  catch(error)
  {
    console.error("Error loading: ./data/"+node+".json");
  }
}

function overwriteFileData(path,fileName,dataStr)
{
  fs.writeFileSync(path+fileName,dataStr,{encoding:'utf8',flag:'w'});
  console.log("info: "+fileName+" updated");
}
//===========================================================================
//
// KeyMap
//
//===========================================================================
function makeSimpleKeyMap(dataFile)
{
  let keyMap = {};
  
  for (const node in dataFile)
  {
    for (const element in dataFile[node])
    {
      keyMap[element] = {};
      keyMap[element].titleText = dataFile[node][element].titleText;
      
      if(dataFile[node][element].cost)
      {
        keyMap[element].cost = dataFile[node][element].cost;
      } else {
        keyMap[element].cost = 0
      }
    }
  }
  return keyMap;
}

function makeSectionKeyMap(dataFile)
{
  let keyMap = {};
  
  for (const node in dataFile)
  {
    var ary = [];
    for (const element in dataFile[node])
    {
      ary.push(element);
    }
    keyMap[node] = ary;
  }
  return keyMap;
}
//===========================================================================
//
// HTML Creation Functions
//
//===========================================================================
function makeDataView(dataFile)
{
  let htmlFill = {};
  //console.log("Making dataView...")
  
  htmlFill['grey']       = makeSpell(dataFile['grey']);
  htmlFill['blue']       = makeSpell(dataFile['blue']);
  htmlFill['red']        = makeSpell(dataFile['red']);
  htmlFill['green']      = makeSpell(dataFile['green']);
  htmlFill['black']      = makeSpell(dataFile['black']);
  htmlFill['white']      = makeSpell(dataFile['white']);
  htmlFill['titles']     = makeGeneral(dataFile['titles']);
  htmlFill['dorms']      = makeGeneral(dataFile['dorms']);
  htmlFill['living-conditions']  = makeGeneral(dataFile['living-conditions']);
  htmlFill['mysteries']  = makeGeneral(dataFile['mysteries']);
  htmlFill['friends']    = makeFriends(dataFile['friends']); 

  
  return htmlFill;
}
function makeSpell(node)
{
  let i = 0;
  let str = ""
  
  if(node == null) {return null;}
  //console.log('dataFile='+dataFile +'\ndataFile['+node+']='+dataFile[node]+"\n");
  
  for (const element in node)
  {
    str +='<div class="option" id="'+ element + '">\n' 
	      + '  <div class="" id="'+element+':overlay"></div>\n'
	      + '  <div class="cost" id="'+element+':cost"> - '+ node[element].cost + ' credits - </div>\n'
	      + '  <div class="boxes">\n'
	      + makeImgTag(node,element) +'\n'
	      + '  </div>\n'
	      + '  <h4> '+ node[element].titleText +' </h4>\n'
	      + '  <div class="option-description">\n'
	      + node[element].descriptionText + '\n'
	      + '  </div>\n'
        + '</div>\n';

  }
  return str;
} 
function makeGeneral(node)
{
  let i = 0;
  let str = "\n"
  for (const element in node)
  {
    str +='<div class="option" id="'+ element + '">\n' 
	      + '  <div class="" id="'+element+':overlay"></div>\n'
	      + '  <div class="boxes">\n'
	      + makeImgTag(node,element) +'\n'
	      + '  </div>\n'
	      + '  <h4> '+node[element].titleText+' </h4>\n'
	      + '  <div class="option-description">\n'
	      + node[element].descriptionText + '\n';
    if(node[element].restrictionText != null)
    { 
    str+= '  <div class="restriction">\n'
	      + node[element].restrictionText + '\n'
	      + '  </div>\n';
    }
    str +='  </div>\n'
        + '</div>\n';

  }
  return str;
}
function makeFriends(node)
{
  let i = 0;
  let str = "\n"
  for (const element in node)
  {
    str +='<div class="option" id="'+ element + '">\n' 
	      + '  <div class="" id="'+element+':overlay"></div>'
	      + '  <div class="boxes">\n'
	      + makeImgTag(node,element) +'\n'
	      + '  </div>\n'
	      + '  <h4> '+node[element].titleText+' </h4>\n'
        + '  <b> ' +node[element].classText+' </b><br /><br />\n'
	      + '  <div class="option-description">\n'
	      + node[element].descriptionText + '\n';
    if(node[element].restrictionText != null)
    { 
    str+= '  <div class="restriction">\n'
	      + node[element].restrictionText + '\n'
	      + '  </div>\n';
    }
    str +='  </div>\n'
        + '</div>\n';

  }
  return str;
}

//===========================================================================
//
// Utility Functions
//
//===========================================================================

function makeImgTag(node,element)
{

  if(node == "" || element == "" || !node[element] || !node[element].imageLink)
  {
    //console.log("Failed to provide valid assest:"+element);
    return "";
  }
  let src = node[element].imageLink;
  let alt = node[element].imgAltText;

  return "<img src=\""+src+"\" alt=\""+alt+"\" height=\"200\"/>\n";  
} 

exports.buildpage = buildpage;
// client-side js
// run by the browser each time your view template is loaded

console.log("Setting things up...");
var dataFile = {};    // Store details about each node, such as the title, description text, restrictions, cost, etc
var sectionFile = {}; // Store lists of what dataFile nodes are in what sections
var flags ={};        // Store if user has clicked a node (TRUE) or not (FALSE)

// Store if user is allowed to click on the following nodes Hidden & not allowed = FALSE / TRUE = allowed
var valid = {  "title:lich":false,
                "title:sorcerer":false,
                "title:wizard":false,
                "title:witch":false,
                "title:druid":false,
                "title:alchemist":false,
                "title:priest":false,
                "title:defender":false,
                "title:battlemage":false,
                "title:spellblade":false,
                "friends:alice": false };
var credits = 60;

init();
console.log("...Ready to Play!");

//===========================================================================
//
// Setup things
//
//===========================================================================
function init()
{
  // Objects that hold current ship
  
  var files = ["/dataFile.json", "/sectionFile.json"];
         
  Promise.all([getDataJSON("/dataFile.json"), getDataJSON("/sectionFile.json") ])
    .then((data) => 
  {
    dataFile = data[0];
    sectionFile = data[1];
    buildFlags();
    setEventListeners();
    printUpdate();
  });
}
// Fetch a JSON file & parse it
function getDataJSON(filename)
{
  console.log("Loading "+ filename +"...")
  return fetch(filename)
    .then( (response) => response.json());
}
// Generate Flags
function buildFlags()
{
  for (const node in dataFile)
  {
    flags[node]=false;
  }
}
// Set all of the clickable HTML elements
function setEventListeners()
{
  for (const node in flags)
  {
    document.getElementById(node).onclick = function() { toggle(node); };
  }
}
//===========================================================================
//
// Things driven by user interaction
//
//===========================================================================
function clearAll()
{
  for (const node in flags)
  {
    if(flags[node] )
    {
      toggle(node);
    }
  }
}

function calcCredits()
{
  var cred = 60;
  
  for (const node in flags)
  {
    //console.log("For node:"+node + " Flag="+flags[node]+ " dataFile="+dataFile[node])
    if(flags[node] && dataFile[node] != null)
    {
      cred -= dataFile[node].cost;
    }
  }
  
  return cred;
}

function toggle(node)
{
  if(flags[node] == null)
  {
    flags[node] = false;
  }
  
  // Don't allow selection for ineligable titles
  if(valid[node] == false)
  {
    return;
  }
  
  if(flags[node] == false)
  {// Don't allow selection for more classes than credits
    if(dataFile[node].cost > 0 && (credits - dataFile[node].cost < 0))
    {
      alert("Insufficient credits");
      return;
    }
      // Don't allow selection for more than one title
    if(node.startsWith("titles:") )
    {
      radio("titles",node);
    }
    // Don't allow selection for more mysteries than allowed
    if(node.startsWith("mysteries:") && sectionCount("mysteries") >= 3 )
    {
      alert("Remove a mystery before selecting another");
      return;
    }
    // Don't allow selection for more than one dorm type
    if(node.startsWith("living-conditions:"))
    {
      radio("living-conditions",node);
    }
    // Don't allow selection for more than one dorm type
    if( node.startsWith("dorms:") )
    {
      radio("dorms",node);
    }
    // Don't allow selection for more friends than allowed
    if( node.startsWith("friends:") && sectionCount("friends") >= 5 )
    {
       alert("Remove a friend before selecting another");
       return;
    }
  }
  if(flags[node] == false)
  {
    document.getElementById(node+":overlay").classList.add('selected');
  } else {
    document.getElementById(node+":overlay").classList.remove('selected');
  }
  flags[node] = !flags[node];
  printUpdate();
}

function radio(section,node)
{
  for(const element in sectionFile[section])
    {
      var subnode = sectionFile[section][element];
      if(flags[subnode])
      {
        document.getElementById(subnode+":overlay").classList.remove('selected');
        flags[subnode] = !flags[subnode];
      }
    }
}
  
function openNav() 
{
  document.getElementById("mySidepanel").style.width = "50%";
  printUpdate();
}

function closeNav() 
{
  document.getElementById("mySidepanel").style.width = "0";
  printUpdate();
}

//===========================================================================
//
// Titles stuff
//
//===========================================================================
function validate()
{
  checkTitles();
  checkFriends();
}
function checkFriends()
{
  valid["friends:alice"] = ! flags["living-conditions:single"];
  
  for(var node of Object.keys(valid))
  {
    if(node.startsWith("friends:"))
    {
      setHidden(node, valid[node], "You can no longer be friends with");
    } 
  }
}
function checkTitles()
{
  var colors = countColors();
  
  // lich
  valid["title:lich"] = colors["black"] > Math.max(colors["blue"],colors["green"],colors["grey"],colors["red"],colors["white"]);
  
  // Sorcerer
  valid["title:sorcerer"] = (colors["blue"] + colors["red"]) > (colors["black"] + colors["green"] + colors["white"]);
  
  // Wizard
  valid["title:wizard"] = (colors["black"] <= 15) && (colors["blue"] <= 15) && (colors["green"] <= 15) && (colors["red"] <= 15) && (colors["white"] <= 15);
  
  // Witch
  valid["title:witch"] = aryCount([flags["blue:familiar"],flags["black:curses"],flags["red:toxic"],flags["blue:conjuration"]]) >= 2;
  
  // Druid
  valid["title:druid"] = (colors["black"] == 0) && (colors["red"] == 0 || (colors["red"] == dataFile["red:earth"].cost && flags["red:earth"])) && (colors["green"] >= 15);
  
  // Alchemist
  valid["title:alchemist"] = aryCount([flags["grey:jewelcraft"],flags["blue:enchanting"],flags["blue:conjuration"]]) >= 2;
  
  // Priest
  valid["title:priest"] = (colors["black"] == 0) && (sectionCount("red") <= 1) && (colors["white"] >= 15);
  
  // Defender
  valid["title:defender"] = aryCount([flags["blue:dispel"],flags["blue:reflect"],flags["white:shielding"],flags["white:healing"]]) >= 2;
  
  // Battlemage
  valid["title:battlemage"] = (flags["grey:mana-channeling"] || flags["grey:martial-arts"]) && (colors["red"] >= 15);
  
  // Spellblade
  valid["title:spellblade"] = flags["blue:enchanting"] && (sectionCount("red") >= 3);
  
  for(var node of Object.keys(valid))
  {
    if( node.startsWith("title:"))
    {
      setHidden(node, valid[node], "You no longer qualify for the title");
    }
  }
  
}
// Add / Remove hidden class from HTML node, if node was selected provide an alert
function setHidden(node,bool,message)
{
  if(bool)
    {
      document.getElementById(node+":overlay").classList.remove('hidden');
      
    } else {
      document.getElementById(node+":overlay").classList.add('hidden');
      if(flags[node] == true)
      {
        document.getElementById(node+":overlay").classList.remove('selected');
        alert(message + ": " + dataFile[node].titleText);
        flags[node] = false;
      }
    }
}
// Create a count of the number of classes taken for each color
function countColors()
{
  var colors = {"black":0,"blue":0,"green":0,"grey":0,"red":0,"white":0};
  
  for(var c of Object.keys(colors))
  {
    for(var f of Object.keys(flags))
    {
      if(f.startsWith(c+":") && flags[f])
      {
        colors[c] += dataFile[f].cost;
      }
    }
  }
  return colors;
}
// Count the number of true elements in an array
function aryCount( ary )
{
    var count = 0;
  
    ary.forEach(function(element) 
    {
      if(element)
      {
        count++;
      }
    });
  return count;
}
// Count the number of user-selected elements in a particular section
function sectionCount( node )
{
    var count = 0;
  
    for(const element in sectionFile[node])
    {
      if(flags[sectionFile[node][element]])
      {
        count++
      }
    }
  return count;
}
//===========================================================================
//
// Course List Output
//
//===========================================================================
function printUpdate()
{
  credits = calcCredits();
  validate();
  
  // ##TODO## reduce number of calls to innerHTML to reduce layout thrashing
  document.getElementById("outCredits").innerHTML      = ""+credits+" Credits";
  document.getElementById("outTitle").innerHTML        = getSectionRadio("titles");
  document.getElementById("final-courses").innerHTML   = aryToString(getCourseAry(), "<br />");
  document.getElementById("outDorm").innerHTML         = getSectionRadio("dorms");
  document.getElementById("outDormType").innerHTML     = getSectionRadio("living-conditions");
  document.getElementById("final-mysteries").innerHTML = aryToString(getSectionAry("mysteries"), "<br />");
  document.getElementById("final-friends").innerHTML   = aryToString(getSectionAry("friends"), "<br />");
  document.getElementById("redditTable").innerHTML     = redditExport();
}
// Get the single value from a radio type section
function getSectionRadio(section)
{
  var outString = "";
  for(const idx in sectionFile[section])
  {
    var subnode = sectionFile[section][idx];
    if(flags[subnode])
    {
      outString = dataFile[subnode].titleText;
    }
  }
  return outString;
}

// Get an array of courses selected
function getCourseAry()
{
  var outAry = [];
  
  outAry = outAry.concat(getSectionAry("grey"));
  outAry = outAry.concat(getSectionAry("blue"));
  outAry = outAry.concat(getSectionAry("red"));
  outAry = outAry.concat(getSectionAry("green"));
  outAry = outAry.concat(getSectionAry("black"));
  outAry = outAry.concat(getSectionAry("white"));
  
  return outAry;
}

// Convert an array to a delimited string
function aryToString(ary, delimiter)
{
  var outString = "";
  if(delimiter == null)
  {
    delimiter = "";
  }
  for(const i in ary)
  {
    outString += ary[i] + delimiter;
  }
  return outString;
}

// Return the array of selected choices in a section
function getSectionAry(section)
{
  var outAry = [];
  
  for(const idx in sectionFile[section])
  {
    var subnode = sectionFile[section][idx];
    if(flags[subnode])
    {
      outAry.push(dataFile[subnode].titleText);
    }
  }
  return outAry;
}

//===========================================================================
//
// Reddit Output
//
//===========================================================================
function redditExport()
{
  var outString = "## My Mage School Details ## <br/><br/>\n";
  var courses   = getCourseAry();
  var mysteries = getSectionAry("mysteries");
  var friends   = getSectionAry("friends");
  
  if(courses.length < 1 )
  {
    courses.push(" &amp;nbsp;");
  }
  if(mysteries.length < 1 )
  {
    mysteries.push(" &amp;nbsp;");
  }
  if(friends.length < 1 )
  {
    friends.push(" &amp;nbsp;");
  }
  
  
  outString += " &amp;nbsp;    | &amp;nbsp; <br />\n";
  outString += "          ---- | ----     <br />\n";
  outString += "**Credits Remaining:** | "+ credits + "<br/>\n";
  outString += "**Title:**     | " + getSectionRadio("titles") + "<br/>\n";
  outString += "**Courses:**   | " + courses[0] + "<br/>\n";
  for(var i = 1; i < courses.length; i++)
  {
    outString += " &amp;nbsp;  | " + courses[i] + "<br/>\n";
  }
  outString += "**Dorm:**      | " + getSectionRadio("dorms") + "<br/>\n";
  outString += "**Room Type:** | " + getSectionRadio("living-conditions") + "<br/>\n";
  outString += "**Mysteries:** | " + mysteries[0] + "<br/>\n";
  for(var i = 1; i < mysteries.length; i++)
  {
    outString += " &amp;nbsp;  | " + mysteries[i] + "<br/>\n";
  }
  outString += "**Friends:**   | " + friends[0] + "<br/>\n";  
  for(var i = 1; i < friends.length; i++)
  {
    outString += " &amp;nbsp;  | " + friends[i] + "<br/>\n";
  }
  
  return outString;
}
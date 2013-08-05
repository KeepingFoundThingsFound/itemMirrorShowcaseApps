var treearea;
var listall;
var currentlist=null;
var currenttext;
var lastlist = null;
var namespaceURI="http://planz5";
var dropboxItemUtility,
    dropboxXooMLUtility,
    dropboxClient,
    itemMirrorCase,
    itemMirrorOptions,
    createAssociationCase7Options,
    headingSaved_itemMirrorOption,
    deleteitemMirrorOption,
    sub_itemMirrorOption;
var savedHeadings=Array();
// Create DropboxClient
    dropboxClient = new Dropbox.Client({
        key:     "hCDcdUqhICA=|MKBkP334IVZY/UyPBoLqk7QiM3ytIjbXca1qaVk0IQ==",
        sandbox: true
    });
    dropboxClient.authDriver(new Dropbox.Drivers.Redirect({
        rememberUser: true
    }));

    // Create options for XooMLU and ItemU
    dropboxXooMLUtility = {
        utilityURI: "DropboxXooMLUtility",
        dropboxClient: dropboxClient
    };
    dropboxItemUtility = {
        utilityURI: "DropboxItemUtility",
        dropboxClient: dropboxClient
    };
    mirrorSyncUtility = {
      utilityURI: "MirrorSyncUtility"
    };
    URIToGroupingItem = "/";
    itemMirrorOptions = {
      1: {
        groupingItemURI: URIToGroupingItem,
        xooMLUtility: dropboxXooMLUtility,
        itemUtility: dropboxItemUtility
      },
      2: {
        groupingItemURI: URIToGroupingItem,
        xooMLUtility: dropboxXooMLUtility,
        itemUtility: dropboxItemUtility,
        syncUtility: mirrorSyncUtility,
        createIfDoesNotExist: false
      },
      3: {
        groupingItemURI: URIToGroupingItem,
        xooMLUtility: dropboxXooMLUtility,
        itemUtility: dropboxItemUtility,
        syncUtility: mirrorSyncUtility,
        createIfDoesNotExist: true
      }
    };

    function createFolder(folderName)
{

   createAssociationCase7Options = {
        "displayText": folderName,
        "itemName": folderName,
        "isGroupingItem": true
    };

    // createAssociationCase1Options = {
    //     displayText: folderName
    // };

    //need to define the new location of the association.
    sub_itemMirrorOption = {
        groupingItemURI: folderName+'/',
        xooMLUtility: dropboxXooMLUtility,
        itemUtility: dropboxItemUtility,
        syncUtility: mirrorSyncUtility,
        createIfDoesNotExist: true
    };

   dropboxClient.authenticate(function (error, client) {
      if (error) {
        throw error;
      }
      constructNewItemMirrorForFolder();
    });

    function constructNewItemMirrorForFolder() {


    //case pair of 3_7
       new ItemMirror(itemMirrorOptions[3], function (error, itemMirror) {
          if (error) { throw error; }

      createAssociation(itemMirror, createAssociationCase7Options);
      //This nested constructor is to create a new itemMirror for the new folder just created.
        dropboxClient.authenticate(function (error,client){
          if(error){
            throw error;
          }
          new ItemMirror(sub_itemMirrorOption, function (error, sub_itemMirror){
          if (error) { throw error; }
           console.log("a Xooml2 is crated!");
          
        });

        });
        
      });
    };



    function createAssociation(itemMirror, options) {
      itemMirror.createAssociation(options, function (error, GUID) {
        if (error) {
          throw error;
        }
        itemMirror.setAssociationNamespaceAttribute("filetype","folder",GUID, namespaceURI,function (error)
        {
          if(error)
            {throw error;}
          
        })
        console.log("A new folder and related Xooml2 file are created.");
        
      });
    }; 
};

	function createSubFolder(path,folderName)
    {
      //alert(path);

    	var itemMirrorOption3={
    		groupingItemURI: path,
        	xooMLUtility: dropboxXooMLUtility,
        	itemUtility: dropboxItemUtility,
        	syncUtility: mirrorSyncUtility,
        	createIfDoesNotExist: true

    	};
    	createAssociationCase7Options = {
        	"displayText": folderName,
        	"itemName": folderName,
        	"isGroupingItem": true
    	};
    	dropboxClient.authenticate(function (error, client) {
      		if (error) {
        		throw error;
      		}
      		new ItemMirror(itemMirrorOption3,function (error,itemMirror){
      			if(error)
      				{throw error;}
      			itemMirror.createAssociation(createAssociationCase7Options,function (error,GUID){
      				if(error)
      					{throw error;}
              itemMirror.setAssociationNamespaceAttribute("filetype","folder",GUID, namespaceURI,function (error)
            {
              if(error)
              {throw error;}
          
            })
      				console.log(path+"/"+folderName+"has been created!");
      			})

      			
      		})
     
    	});
    }
    function createWebpage(path, text,url)
{
  var webpageitemMirrorOption={
        groupingItemURI: path,
        xooMLUtility: dropboxXooMLUtility,
        itemUtility: dropboxItemUtility,
        syncUtility: mirrorSyncUtility,
        createIfDoesNotExist: true

  };
  var createAssociationCase2Options = {
        displayText: text,
        itemURI: url
    };
  var attributeName="filetype";
  var attributeValue="webpage";

    dropboxClient.authenticate(function (error, client) {
      if (error) {
        throw error;
      }
       new ItemMirror(webpageitemMirrorOption, function (error, itemMirror) {
          if (error) { throw error; }

        itemMirror.createAssociation(createAssociationCase2Options, function (error, GUID) {
        if (error) {
          throw error;
        }
        itemMirror.setAssociationNamespaceAttribute(attributeName,attributeValue,GUID, namespaceURI,function (error)
        {
          if(error)
            {throw error;}
          
        })
        console.log("A new web page is saved.");
        
      });
    });
  });
}
function createFile(path, title,localpath)
{
  var fileitemMirrorOption={
        groupingItemURI: path,
        xooMLUtility: dropboxXooMLUtility,
        itemUtility: dropboxItemUtility,
        syncUtility: mirrorSyncUtility,
        createIfDoesNotExist: true

  };
  var createAssociationCase1Options = {
        displayText: title,
      }

  var attributeName="filetype";
  var attributeValue="file";


    dropboxClient.authenticate(function (error, client) {
      if (error) {
        throw error;
      }
       new ItemMirror(fileitemMirrorOption, function (error, itemMirror) {
          if (error) { throw error; }

        itemMirror.createAssociation(createAssociationCase1Options, function (error, GUID) {
        if (error) {
          throw error;
        }
        itemMirror.setAssociationNamespaceAttribute(attributeName,attributeValue,GUID, namespaceURI,function (error)
        {
          if(error)
            {throw error;}
          
        })
        itemMirror.setAssociationNamespaceAttribute("filepath",localpath,GUID,namespaceURI,function (error){
          if(error)
          {
            throw error;
          }
        })
        console.log("A new file is saved.");
        
      });
    });
  });
}
    function addNote(path,text)
{

  var NoteitemMirrorOption={
        groupingItemURI: path,
        xooMLUtility: dropboxXooMLUtility,
        itemUtility: dropboxItemUtility,
        syncUtility: mirrorSyncUtility,
        createIfDoesNotExist: true

  };
  var createAssociationCase1Options = {
        "displayText": "Note",
        
    };
    var attributeName="content";
    var attributeValue=text;
    //alert(path);
    //alert(text);
    dropboxClient.authenticate(function (error, client) {
      if (error) {
        throw error;
       }
        new ItemMirror(NoteitemMirrorOption,function (error,NoteItemMirror) {
        if(error)
        {
          throw error;
        }
      NoteItemMirror.createAssociation(createAssociationCase1Options,function (error,GUID){
        if(error)
        {
          throw error;
        }
        NoteItemMirror.setAssociationNamespaceAttribute("filetype","note",GUID, namespaceURI,function (error)
        {
          if(error)
            {throw error;}
          
        })
        NoteItemMirror.setAssociationNamespaceAttribute(attributeName,attributeValue,GUID, namespaceURI,function (error)
        {
          if(error)
            {throw error;}
          console.log("A note is created!");
        })
      })
          

      });

      
      
    });
    
  
}
	function deleteHeading(path)
	{
	//lert(heading);
    //alert(path);
		var dir="";
    var tempArray=path.split("/");
    var heading=tempArray[tempArray.length-1];
    if(tempArray.length>=2)
    {
      
      //alert(tempArray.length);
    for(var i=0;i<tempArray.length-1;i++)
      {
        //alert(tempArray[i]);
        dir=dir+tempArray[i]+"/";
      }
    }
    else
    {
      dir=dir+"/";
    }
    //alert(dir);
  		deleteitemMirrorOption={
      	groupingItemURI: dir,
      	xooMLUtility: dropboxXooMLUtility,
      	itemUtility: dropboxItemUtility,
      	syncUtility: mirrorSyncUtility,
      	createIfDoesNotExist: true

  };
  	
  new ItemMirror(deleteitemMirrorOption,function (error,deleteItemMirror) {
        if(error)
        {
          throw error;
        }
        //alert("lal");
      deleteItemMirror.listAssociations(function (error,guids)
      {
          for(var q=0;q<guids.length;q++)
          {
          	//alert(guids[q]);
            deleteItemMirror.getAssociationDisplayText(guids[q], function (error,displayText ){
              if(error)
                {throw error;}
            	//alert(displayText);

              if(displayText==heading)
              {
              	//alert("success");
                deleteItemMirror.deleteAssociation(guids[q], function (error,displayText)
                {	
                	//console.log('test');
                  if(error)
                  {
                    throw error;
                  }
                  //alert("success");

                  console.log(displayText + " has been deleted!");
                });
              }
            });

          }

      });

  });


};
	function deleteF(path,option)
{
  //alert("sucss");
  dropboxClient.authenticate(function (error,client)
  {
    if(error)
      {throw error;}
    if(option=="1")
    {
    	//alert("sucess");
    	//alert("sfds");
      deleteHeading(path);
    }
  });
}
function deleteNoteBackEnd(path, text)
{
  var NoteitemMirrorOption={
        groupingItemURI: path,
        xooMLUtility: dropboxXooMLUtility,
        itemUtility: dropboxItemUtility,
        syncUtility: mirrorSyncUtility,
        createIfDoesNotExist: true

  };
  //alert(path);
  //alert(text);
  dropboxClient.authenticate(function (error,client)
  {
    if(error)
      {throw error;}
      new ItemMirror(NoteitemMirrorOption,function (error,deleteItemMirror) {
        if(error)
        {
          throw error;
        }
        //alert("lal");
      deleteItemMirror.listAssociations(function (error,guids)
      {
          for(var q=0;q<guids.length;q++)
          {
            //alert(guids[q]);

            deleteItemMirror.getAssociationDisplayText(guids[q], function (error,displayText ){
              if(error)
                {throw error;}
              //alert(displayText);

              if(displayText=="Note")
              {
                //alert("success");
                deleteItemMirror.getAssociationNamespaceAttribute("content",guids[q],namespaceURI,function (error, associationNamespaceAttribute ){
                  if(error)
                  {
                    throw error;
                  }
                  alert(associationNamespaceAttribute);
                  if(associationNamespaceAttribute==text){
                    deleteItemMirror.deleteAssociation(guids[q],function (error){
                      if(error)
                      {
                        throw error;
                      }
                      console.log(associationNamespaceAttribute+"has been deleted");
                    });
                  }
                })
                 
              } 
            });

          }

      });

  });
    
  });
  
}
function loadNote(path,title)
{
  var NoteitemMirrorOption = {
      groupingItemURI: path,
      xooMLUtility: dropboxXooMLUtility,
      itemUtility: dropboxItemUtility,
      syncUtility: mirrorSyncUtility,
      createIfDoesNotExist: true
    };
     dropboxClient.authenticate(function (error,client)
    {
      if(error)
        {throw error;}
        new ItemMirror(NoteitemMirrorOption,function (error,loadItemMirror) {
        if(error)
        {
          throw error;
        }
        //alert("lal");
        loadItemMirror.listAssociations(function (error,guids)
        {
          for(var q=0;q<guids.length;q++)
          {
            //alert(guids[q]);

            deleteItemMirror.getAssociationDisplayText(guids[q], function (error,displayText ){
              if(error)
                {throw error;}
              //alert(displayText);

              if(displayText==title)
              {
                //alert("success");
                deleteItemMirror.getAssociationNamespaceAttribute("content",guids[q],namespaceURI,function (error, associationNamespaceAttribute ){
                  if(error)
                  {
                    throw error;
                  }
                  //alert(associationNamespaceAttribute);
                  
                })
                 
              } 
            });

          }

      });

  });
    
  });
}
function loadheadings(path,option){
      headingSaved_itemMirrorOption = {
      groupingItemURI: path,
      xooMLUtility: dropboxXooMLUtility,
      itemUtility: dropboxItemUtility,
      syncUtility: mirrorSyncUtility,
      createIfDoesNotExist: true
    };
    var parent;
    savedHeadings.length=0;
    var savedNotes=new Array();
    savedNotes.length=0;
    var filetype=new Array();
    filetype.length=0;
    var location=new Array();
    location.length=0;
     new ItemMirror(headingSaved_itemMirrorOption, function(error, savedHeading_itemMirror){
          if (error) { throw error; }

          savedHeading_itemMirror.listAssociations(function(error,guids){
             for(var i=0; i<guids.length; i++){
                 savedHeading_itemMirror.getAssociationDisplayText(guids[i], function (error, displayText) {
                  if (error) {
                    throw error;
                  }
                    
                  if(displayText != ''&& displayText != "Note"){
                    savedHeadings.push(displayText);
                    savedHeading_itemMirror.getAssociationNamespaceAttribute("filetype",guids[i],namespaceURI,function (error,associationNamespaceAttribute){
                      filetype.push(associationNamespaceAttribute);
                      if(associationNamespaceAttribute=="webpage")
                      {
                          savedHeading_itemMirror.getAssociationAssociatedItem (guids[i],function (error,associatedItem){

                            if(error)
                            {
                              throw error;
                            }

                            location.push(associatedItem);
                            console.log("webpage "+displayText + " "+associatedItem);
                          })
                      }
                      if(associationNamespaceAttribute=="file")
                      {
                        savedHeading_itemMirror.getAssociationNamespaceAttribute("filepath",guids[i],namespaceURI,function (error,associationNamespaceAttribute){
                          
                          location.push(associationNamespaceAttribute);
                          console.log("file "+associationNamespaceAttribute);
                        })
                      }
                      else
                      {
                        location.push(null);
                        console.log(associationNamespaceAttribute + " null");
                      }
                    })
                  }
                  if(displayText=="Note"){
                    savedHeading_itemMirror.getAssociationNamespaceAttribute("content",guids[i],namespaceURI,function (error,associationNamespaceAttribute){
                      savedNotes.push(associationNamespaceAttribute);
                      
                    })
                  }
                });

             }
             for(var t=0;t<location.length;t++)
             {
                console.log(t+" "+location[t]);
             }
              for(var j=0; j< savedHeadings.length; j++){ 
              	if(option==1)
              	{
              		parent=listall;
              		//lastlist = currentlist;
					//lastlist.id = "";
              		templist = createNode(savedHeadings[j], filetype[j], location[j]);
              		currenttext = savedHeadings[j];
              		parent.appendChild(templist);
              		//currentlist = templist;
              		//currentlist.id = "treelistall";
              	}
              	if(option==2)
              	{
              		parent=currentlist;
              		//lastlist = currentlist;
					//lastlist.id = "";
              		templist = createNode(savedHeadings[j], filetype[j], location[j]);
                  console.log(filetype[j]+location[j]);
              		currenttext = savedHeadings[j];
              		parent.children[1].appendChild(templist);
              		//currentlist = templist;
              		//currentlist.id = "treelistall";
              		//parent.children[1].appendChild(createNode(savedHeadings[j]));
              	}

            	
                console.log(location[j]);
                //console.log(savedHeadings[j]);
              }
              console.log(savedNotes.length);
              for(var n=0;n<savedNotes.length;n++)
              {
                var temp = $("#note-template").html();
                $("<div class='note'></div>").html(temp).appendTo("#note-space");
                $(".note").draggable();
                document.getElementById("notetextarea").value=savedNotes[n];
              }
              //currentlist.childNodes[0];
          });
    });
};

window.onload = function(){
	loaditems();
	//loadheadings();
	
  var dropZone = document.getElementById("textarea");
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);


	//var createButton = document.getElementById("createButton");
	//createButton.onclick = create;

 //create button
 /*var cFolder=document.getElementById("createFolder");
 cFolder.onclick = createTopFolder;
 var cSubFolder=document.getElementById("createSubfolder");
 cSubFolder.onclick = create("folder");
 var cWebpage=document.getElementById("createWebpage");
 cWebpage.onclick = create("webpage");
 var cFile=document.getElementById("createFile");
 cFile.onclick = create("file");
 var cNote=document.getElementById("createNote");
 cNote.onclick = create("note");*/
//end create button

	var expandButton = document.getElementById("expandButton");
	expandButton.onclick = expand;
	var collapseButton = document.getElementById("collapseButton");
	collapseButton.onclick = collapse;
	var promoteButton = document.getElementById("promoteButton");
	promoteButton.onclick = promote;
	var demoteButton = document.getElementById("demoteButton");
	demoteButton.onclick = demote;
	var moveupButton = document.getElementById("moveupButton");
	moveupButton.onclick = moveup;
	var movedownButton = document.getElementById("movedownButton");
	movedownButton.onclick = movedown;
	var deleteButton = document.getElementById("deleteButton");
	deleteButton.onclick = deleteitem;
	var inputarea = document.getElementById("textarea");
	//var deleteButton = document.getElementById("deleteButton");
	inputarea.onkeypress = createNewItem;
	//use jQuery to sort the items
  
  /*var cancelchecked = document.getElementById("cancelchecked");
  cancelchecked.onmouseover = function(){
    cancelchecked.style.backgroundColor = "#D1D1D1";
    cancelchecked.style.cursor = "pointer";
    document.getElementById("cancelcheckedtext").style.visibility = "visible";
  }
  cancelchecked.onmouseout = function(){
    cancelchecked.style.backgroundColor = "#F1F1F1";
    document.getElementById("cancelcheckedtext").style.visibility = "hidden";
  }
  cancelchecked.onclick = function () {
    if(currentlist != null) {
      lastlist = currentlist;
      lastlist.id = "";
      currentlist = null;
    }
  }*/
	
}

function createTopFolder()
{
  console.log("folder");
  if(currentlist!=null)
  {
     lastlist = currentlist;
      lastlist.id = "";
      currentlist = null;

  }
  var title=document.getElementById("textarea").value;
  if(title=='')
  {alert("Plesase input a name!");}
  else {

    if (currentlist==null&&title != "") {
    
    listall.appendChild(createNode(title, "folder", null));
    var temp=document.getElementById("textarea");
          temp.value='';
          //temp.select();
          temp.blur();
     createFolder(title);
    }
  }
}


function loaditems(){
	//alert("loaditemsfunction");
	
	//make some example items
	treearea = document.getElementById("treeDiv1");
	
	
	listall = document.createElement("ul");
	listall.classList.add("treelistall");
	treearea.appendChild(listall);
	var dir="/";
	loadheadings(dir,1);
	
	/*var listfirstlevel1 = createNode("this is the first node first level");
	listall.appendChild(listfirstlevel1);
	
	listfirstlevel1.children[1].appendChild(createNode("this is the first node second level"));
	
	listall.appendChild(createNode("this is the second node first level"));
	
	currentlist = listfirstlevel1;
	currentlist.id = "currentlist";	
	currenttext = "this is the first node first level";*/
	//alert(currenttext);

}
function renameFolder(path,otitle,ntitle)
{
  var renameFolderitemMirrorOption = {
      groupingItemURI: path,
      xooMLUtility: dropboxXooMLUtility,
      itemUtility: dropboxItemUtility,
      syncUtility: mirrorSyncUtility,
      createIfDoesNotExist: true
    };
     dropboxClient.authenticate(function (error,client)
    {
      if(error)
        {throw error;}
        new ItemMirror(renameFoleritemMirrorOption,function (error,renameItemMirror) {
        if(error)
        {
          throw error;
        }
        //alert("lal");
        renameItemMirror.listAssociations(function (error,guids)
        {
          for(var q=0;q<guids.length;q++)
          {
            //alert(guids[q]);

            renameItemMirror.getAssociationDisplayText(guids[q], function (error,displayText ){
              if(error)
                {throw error;}
              //alert(displayText);

              if(displayText==otitle)
              {
                //alert("success");
                renameItemMirror.setAssociationDisplayText ( guids[q], ntitle, function (error) {
                  if(error)
                  {
                    throw error;
                  }
                  console.log(otitle+"has been renameed!");
                })
                 
              } 
            });

          }

      });

  });
    
  });
}

function create(type){
	//alert("createfunction");
  //get type
  /*var type = $('input[name=type]:checked').val();
  if(type == null){
    alert("You should choose a type");
    return
  }*/

  var pathorurl = null;
  var title=document.getElementById("textarea").value;
  console.log("create");
  
  

	

  if(title=='')
  {alert("Plesase input a name!");}
  else {
    if (currentlist==null&&title != "") {
    //currentlist.children[1].appendChild(createNode(folderName));
    listall.appendChild(createNode(title, type, null));
    var temp=document.getElementById("textarea");
          temp.value='';
          //temp.select();
          temp.blur();
    createFolder(title);
  }
  else
  {
     //alert("sdfsdf");
    var tempnode = currentlist;
    var path = currenttext;
    while(tempnode.parentNode.parentNode.id != "treeDiv1"){
      path = tempnode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML + "/" + path;
      tempnode = tempnode.parentNode.parentNode;
    }
    path=path+"/";
   //alert(path);
    //var a=currentlist.childNodes[0].getElementsByTagName("a")[0].innerHTML;
    //var text=document.getElementById("textarea").value;
    if(type=="folder")
    {
      currentlist.children[1].appendChild(createNode(title, type, null));
      createSubFolder(path,title);

    }
    if (type == "webpage"){
      var temptext = prompt('Please copy the url adddress', '');
      pathorurl = temptext;
      currentlist.children[1].appendChild(createNode(title, type, pathorurl)); 
      createWebpage(path, title,pathorurl);
    }

   if (type == "file"){
      var temptext = prompt('Please input the path', '');
      pathorurl = temptext;
      currentlist.children[1].appendChild(createNode(title, type, pathorurl));  
       createFile(path, title,pathorurl);
  }
  if(type=="note")
  {
    newNote();
    document.getElementById("notetextarea").value=title;
  }
    
    var temp=document.getElementById("textarea");
        temp.value='';
        //temp.select();
        temp.blur();
  }
}
}

function promoteItem(path,title)
{
  //alert(path);
  var dir=path+title;
  //alert(dir);
  deleteHeading(dir);
  var tempArray=path.split("/");
  //alert("path="+path);
  var upDir="";
  //alert(tempArray.length);
  //alert(tempArray[1]);
  if(tempArray.length==2)
  {
    upDir="/";
  }
  else{
    for(var i=0;i<tempArray.length-2;i++)
  {

    upDir=upDir+tempArray[i]+"/";
  }

  }
  
  
  //alert("upDir="+upDir);

  createSubFolder(upDir, title);

}
  


function createNode(title, type, pathorurl){
	//alert("create a node");
	var content = title;
	//make the newlist
	var listnewlevel1 = document.createElement("li");
	
	var listnewlevel1block = document.createElement("div");
	
	var listnewlevel1blocksign = document.createElement("img");
	listnewlevel1blocksign.src = "images/treeclosed.gif";
  listnewlevel1blocksign.id = "treeclosed";
	listnewlevel1block.appendChild(listnewlevel1blocksign);
	
	var listnewlevel1blocktext = document.createElement("a");
	listnewlevel1blocktext.innerHTML=content;
	listnewlevel1block.appendChild(listnewlevel1blocktext);

	listnewlevel1block.classList.add("listlevel1block");
	listnewlevel1.appendChild(listnewlevel1block);
	
	listnewlevel1block.onclick = selectcurrent;

  function selectcurrent(){
    if(currentlist!=null)
    {
      lastlist = currentlist;
      lastlist.id = "";
    }
    
    currentlist = listnewlevel1;
    currentlist.id = "currentlist";
    currenttext = listnewlevel1blocktext.innerHTML;
  }

  listnewlevel1blocksign.onclick = function(){
    if(this.id == "treeclosed"){
      this.src = "images/treeopen.gif";
      var a=currentlist.childNodes[0].getElementsByTagName("a")[0].innerHTML;
      loadheadings(a,2);
      currentlist = currentlist;
      this.id = "treeopen";
    }
    else if(this.id == "treeopen") {
      this.src = "images/treeclosed.gif";
      var temp = document.createElement("ul");
      temp.className = "treelistall";
      currentlist.removeChild(currentlist.childNodes[1]);
      currentlist.appendChild(temp);
      currentlist = currentlist;
      this.id = "treeclosed";
    }
  }
  
    var listnewlevel1blocktype = document.createElement("img");
    if(type == "folder"){
      listnewlevel1blocktype.src = "images/folder.png";
    }
    else if (type == "webpage"){
      listnewlevel1blocktype.src = "images/webpage.png"; 
      listnewlevel1blocktext.href = pathorurl;
      var re = /^http\:\/\//;
      var found = pathorurl.match(re);
      if(found != null){
        listnewlevel1blocktext.href = pathorurl;
      }
      else{
        pathorurl = "http://" + pathorurl;
        listnewlevel1blocktext.href = pathorurl;
      }
      listnewlevel1blocktext.target = "_blank";
    }
    else if (type == "file"){
      listnewlevel1blocktype.src = "images/file.png"; 
      //pathorurl = "file://" + pathorurl;
      //listnewlevel1blocktext.href = pathorurl;
      listnewlevel1blocktext.onclick=function(){
        alert("The file path on your local disk is : "+ pathorurl +".");
      }
      listnewlevel1blocktext.target = "_blank";
    }
    else if (type == "note"){
      listnewlevel1blocktype.src = "images/note.png"; 
    }
    listnewlevel1blocktype.classList.add("headingtype");
    listnewlevel1block.appendChild(listnewlevel1blocktype);
  

  //add buttons
  var listnewlevel1blockbuttons = document.createElement("span");
  listnewlevel1blockbuttons.classList.add("smallbuttons");
  //delete
  var listnewlevel1blockbuttonmovedelete = document.createElement("img");
  listnewlevel1blockbuttonmovedelete.src = "images/delete.png";
  listnewlevel1blockbuttonmovedelete.classList.add("smallbutton");
  listnewlevel1blockbuttons.appendChild(listnewlevel1blockbuttonmovedelete);
  //movedown
  var listnewlevel1blockbuttonmovedown = document.createElement("img");
  listnewlevel1blockbuttonmovedown.src = "images/down.png";
  listnewlevel1blockbuttonmovedown.classList.add("smallbutton");
  listnewlevel1blockbuttons.appendChild(listnewlevel1blockbuttonmovedown);
  //moveup
  var listnewlevel1blockbuttonmoveup = document.createElement("img");
  listnewlevel1blockbuttonmoveup.src = "images/up.png";
  listnewlevel1blockbuttonmoveup.classList.add("smallbutton");
  listnewlevel1blockbuttons.appendChild(listnewlevel1blockbuttonmoveup);
  //demote
  var listnewlevel1blockbuttondemote = document.createElement("img");
  listnewlevel1blockbuttondemote.src = "images/right.png";
  listnewlevel1blockbuttondemote.classList.add("smallbutton");
  listnewlevel1blockbuttons.appendChild(listnewlevel1blockbuttondemote);
  //promote
  var listnewlevel1blockbuttonpromote = document.createElement("img");
  listnewlevel1blockbuttonpromote.src = "images/left.png";
  listnewlevel1blockbuttonpromote.classList.add("smallbutton");
  listnewlevel1blockbuttons.appendChild(listnewlevel1blockbuttonpromote);
  //createsub
  var listnewlevel1blockbuttoncreatesub = document.createElement("img");
  listnewlevel1blockbuttoncreatesub.src = "images/create.png";
  listnewlevel1blockbuttoncreatesub.classList.add("smallbutton");
  listnewlevel1blockbuttons.appendChild(listnewlevel1blockbuttoncreatesub);

  //append the buttons div to listnewlevel1block
  listnewlevel1block.appendChild(listnewlevel1blockbuttons);
	
  listnewlevel1blockbuttons.style.visibility = "hidden";
	var listnewall = document.createElement("ul");
	listnewall.classList.add("treelistall");
	listnewlevel1.appendChild(listnewall);

  listnewlevel1.onmouseover = function(){
    listnewlevel1blockbuttons.style.visibility = "visible";
  }

	listnewlevel1.onmouseout = function(){
    listnewlevel1blockbuttons.style.visibility = "hidden";
  }

  listnewlevel1blockbuttoncreatesub.onclick = function(){
    selectcurrent;
    setTimeout(create,1);
  }
  listnewlevel1blockbuttonpromote.onclick = function(){
    selectcurrent;
    setTimeout(promote,1);
  }
  listnewlevel1blockbuttondemote.onclick = function(){
    selectcurrent;
    setTimeout(demote,1);
  }
  listnewlevel1blockbuttonmoveup.onclick = function(){
    selectcurrent;
    setTimeout(moveup,1);
  }
  listnewlevel1blockbuttonmovedown.onclick = function(){
    selectcurrent;
    setTimeout(movedown,1);
  }
  listnewlevel1blockbuttonmovedelete.onclick = function(){
    selectcurrent;
    setTimeout(deleteitem,1);
  }


  //double click to update heading
  listnewlevel1block.ondblclick = function() {
    var otitle=currenttext;
    var temptext = prompt('The new heading?', listnewlevel1blocktext.innerHTML);
    //var tempnode = currentlist;
  
    //var path = currenttext;
    //alert(path);
    //while(tempnode.parentNode.parentNode.id != "treeDiv1"){
      //path = tempnode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML + "/" + path;
      //tempnode = tempnode.parentNode.parentNode;
    //}
  //alert(path);
  //var dir=path+"/";
    if(temptext != null){
      listnewlevel1blocktext.innerHTML =  temptext ;

    }
  }
  /*
  listnewlevel1blockbuttoncreatesub.onclick = create;
  listnewlevel1blockbuttonpromote.onclick = promote;
  listnewlevel1blockbuttondemote.onclick = demote;
  listnewlevel1blockbuttonmoveup.onclick = moveup;
  listnewlevel1blockbuttonmovedown.onclick = movedown;
  listnewlevel1blockbuttonmovedelete.onclick = deleteitem;
  */
	//parent.appendChild(listnewlevel1);
	return listnewlevel1;
}

function expand(){
	//alert("expandfunction");
  var temptcurrenttext = currenttext;
  //alert(temptcurrenttext);
  if(currentlist!=lastlist)
  {
    if($("#note-space").html()!=null) {
      var arraynote = document.querySelectorAll(".note");
      for( var i= 0; i < arraynote.length; i++){
        document.getElementById("note-space").removeChild(arraynote[i]);
      }
  }


  }
   

  var tempnode = currentlist;
  
    var path = currenttext;
    //alert(path);
    while(tempnode.parentNode.parentNode.id != "treeDiv1"){
      path = tempnode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML + "/" + path;
      tempnode = tempnode.parentNode.parentNode;
    }
  //alert(path);
  var dir=path+"/";
    //alert(path);
	//var a=currentlist.childNodes[0].getElementsByTagName("a")[0].innerHTML;
	loadheadings(dir,2);
  currentlist = currentlist;
  currentlist.childNodes[0].childNodes[0].src = "images/treeopen.gif";
  currentlist.childNodes[0].childNodes[0].id = "treeclosed";
  //currentlist=tempnode;
  setTimeout(function(){currenttext = currentlist.childNodes[0].childNodes[1].innerHTML;},2000);
  //currenttext = currentlist.childNodes[0].childNodes[1].innerHTML;
  
  return true;
}

function collapse(){
	//alert("collapsefunction");
	/*
	var childs=currentlist.children[1].childNodes;
	console.log(childs.length);
	for(var i=0;i<childs.length;i++)
	{

		currentlist.removeChild(childs[i]);
	}
	*/
	//currentlist = Donghe
  if($("#note-space").html()!=null) {
      var arraynote = document.querySelectorAll(".note");
      for( var i= 0; i < arraynote.length; i++){
        document.getElementById("note-space").removeChild(arraynote[i]);
      }
    }
	var temp = document.createElement("ul");
	temp.className = "treelistall";
	currentlist.removeChild(currentlist.childNodes[1]);
	currentlist.appendChild(temp);
  currentlist = currentlist;
  currentlist.childNodes[0].childNodes[0].src = "images/treeclosed.gif";
  currentlist.childNodes[0].childNodes[0].id = "treeopen";
}

function promote(){
	//alert("promotefunction");
  if(currentlist.parentNode.parentNode.id == "treeDiv1"){
    return;
  }
  var tempnode = currentlist;
  var path = currenttext;
  while(tempnode.parentNode.parentNode.id != "treeDiv1"){
    path = tempnode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML + "/" + path;
    tempnode = tempnode.parentNode.parentNode;
  }
  //alert(path);
  var dir="";
  var tempArray=path.split("/");
  var heading=tempArray[tempArray.length-1];
  if(tempArray.length>=2){
      //alert(tempArray.length);
    for(var i=0;i<tempArray.length-1;i++){
        //alert(tempArray[i]);
        dir=dir+tempArray[i]+"/";
    }
  }
  else{
    dir=dir+"/";
  }
  if(currentlist.parentNode){
    currentlist.parentNode.parentNode.parentNode.insertBefore(currentlist, currentlist.parentNode.parentNode.nextSibling);
  }
  dropboxClient.authenticate(function (error, client) {
  if (error) {
    throw error;
  }
  promoteItem(dir,heading);
  });
  
}

function demote(){
	//alert("demotefunction");
  tempnode = currentlist;
  currentlist = currentlist.previousSibling;
  if(currentlist == null){
    return;
  }
  /*
  if(expand{
    //currentlist = tempnode;
    currentlist.childNodes[1].appendChild(tempnode);
  }*/
    expand;
    setTimeout(function(){
    currentlist.childNodes[1].appendChild(tempnode);
    currentlist = tempnode;
    },50);
  
}

function moveup(){
  if(currentlist.previousSibling != null) {
    currentlist.parentNode.insertBefore(currentlist, currentlist.previousSibling);
  }
}

function movedown(){
  if(currentlist.nextSibling != null){
    currentlist.parentNode.insertBefore(currentlist, currentlist.nextSibling.nextSibling);
  }
}

function deleteitem(){
  //get path
  
    var tempnode = currentlist;
    var path = currenttext;
    while(tempnode.parentNode.parentNode.id != "treeDiv1"){
      path = tempnode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML + "/" + path;
      tempnode = tempnode.parentNode.parentNode;
    }
  //alert(path);


	if(currentlist != null){
		/*
		var temptext = currentlist.getElementByTagName("a").innerHTML;
		alert(temptext);
		*/
		currentlist.parentNode.removeChild(currentlist);
		//listall.removeChild(currentlist);
		//var a=currentlist.childNodes[0].getElementsByTagName("a")[0].innerHTML;
		//var a = currenttext;
		//currenttext = "";
		//var text=a.innerHTML;
		//alert(a);
		deleteF(path,"1");
		//currentlist.parentNode.removeChild(currentlist);
	}
	//need to check whether there isn't any item
	//currentlist = null;
}


function createNewItem(event){
  if(event.keyCode==13){
    var type = $('input[name=type]:checked').val();
    if(type == null){
      alert("You should choose a type");
      return
    }

    var pathorurl = null;

    if (type == "webpage"){
        var temptext = prompt('Please copy the url adddress', '');
        pathorurl = temptext; 
    }
    else if (type == "file"){
        var temptext = prompt('Please input the path', '');
        pathorurl = temptext; 
    }

	
		var tmpText = document.getElementById("textarea").value;
		var tmplist = createNode(tmpText, type, pathorurl);
		listall.appendChild(tmplist);
		var temp=document.getElementById("textarea");
        temp.value='';
        //temp.select();
        temp.blur();
        createFolder(tmpText);
		//document.getElementById("textinput").value="";
        //document.getElementById("textinput").placeholder="Tap to add, or drag your files here";
	}
}


//change theme function
function changeCSS(css1, css2) {
        var link1 = document.getElementById("bootstrap1");
        link1.setAttribute("href", css1);
        var link2 = document.getElementById("bootstrap2");
        link2.setAttribute("href", css2);
}


//note 

$(document).ready(function() {
    $("body").height($(window).height());
    $("body").delegate(".new-button","click",newNote);
    $("body").delegate(".delete-button","click",deleteNote);
    $("body").delegate(".save-button","click",saveNote);
    $("#datepicker").datepicker({
      onSelect : function(){
        alert("you choose the date:"+ document.getElementById("datepicker").value);
      }
    });  
});

function newNote() {
  if(currentlist!=lastlist)
  {
    if($("#note-space").html()!=null) {
      var arraynote = document.querySelectorAll(".note");
      for( var i= 0; i < arraynote.length; i++){
        document.getElementById("note-space").removeChild(arraynote[i]);
      }
}
  }
  if(currentlist!=null){
    var temp = $("#note-template").html();
    $("<div class='note'></div>").html(temp).appendTo("#note-space");
    $(".note").draggable();
   }
   else{
    alert("You must choose one folder to add note!");
   }
};



function deleteNote() {
  var notecontent1 = document.getElementById("notetextarea").value;
  //alert(notecontent1);
  $(this).parents(".note").remove();
  var tempnode = currentlist;
    var path = currenttext;
  while(tempnode.parentNode.parentNode.id != "treeDiv1"){
      path = tempnode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML + "/" + path;
      tempnode = tempnode.parentNode.parentNode;
    }
    path=path+"/";
    //alert(path);
    deleteNoteBackEnd(path,notecontent1);
  
}

function saveNote() {
  var notecontent2 = document.getElementById("notetextarea").value;
  //alert(notecontent2);
  var tempnode = currentlist;
    var path = currenttext;
    //alert(path);
    while(tempnode.parentNode.parentNode.id != "treeDiv1"){
      path = tempnode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML + "/" + path;
      tempnode = tempnode.parentNode.parentNode;
    }
    path=path+"/";
  
  //alert(path);
  addNote(path,notecontent2);
}

//this function uses to alert the path of currentlist
function path(){
  
  var tempnode = currentlist;
    var path = currenttext;
    while(tempnode.parentNode.parentNode.id != "treeDiv1"){
      path = tempnode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML + "/" + path;
      tempnode = tempnode.parentNode.parentNode;
    }
    path=path+"/";
    //alert(path);
    return path;
}



//drag a file function



function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output;
    for  (var i = 0, f; f = files[i]; i++) {
      output=f.name;
    }
    document.getElementById('textarea').value = output;
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  
require(["ItemMirror"], function(ItemMirror){
    "use strict";

var stickywidth = 300;  // width of sticky note (can't be less than 200)
var stickyheight = 300; // height of sticky note (can't be less than 200)
var max_notes = 25; // maximum number of notes one can store
var html5sticky = {};
var note_index = 0;
var content;
var guidForNote;
var guidForsubfolder;
var currentBoard;
var foldName;
var savedNoteBoardText = Array();
var arrayforGUIDS = Array();
var isFolderOrNot;
var noteType;
var relationship = new Array();
        
 
var
    dropboxClientCredentials,
    dropboxAuthDriver,
    dropboxClient,
    dropboxXooMLUtility,
    dropboxItemUtility,
    mirrorSyncUtility;
    

    dropboxClientCredentials = {
      key: "cyN5MgnUD1A=|xqE7O1oaohmU0XRwOAo6iQ+4enIeiiMCIJkmqD30oA==",
      sandbox: true
    };


    dropboxAuthDriver = new Dropbox.Drivers.Redirect({
      rememberUser: true
    });

    dropboxClient = new Dropbox.Client(dropboxClientCredentials);
    dropboxClient.authDriver(dropboxAuthDriver);

    dropboxXooMLUtility = {
      driverURI: "DropboxXooMLUtility",
      dropboxClient: dropboxClient
    };

    dropboxItemUtility = {
      driverURI: "DropboxItemUtility",
      dropboxClient: dropboxClient
    };

    mirrorSyncUtility = {
      utilityURI: "MirrorSyncUtility"
    };


html5sticky.getDateTime = function(){
   var currentTime = new Date();
   var month = currentTime.getMonth() + 1;
   var day = currentTime.getDate();
   var year = currentTime.getFullYear();
   var hours = currentTime.getHours();
   var minutes = currentTime.getMinutes();
   var ampm = '';
   var sep = ' ';
   var dsep = '/';
   var tsep = ':';
   
   if (minutes < 10) minutes = "0" + minutes;
   
   if(hours > 11){
      ampm = 'PM';
   } else {
      ampm = 'AM';
   }   

   return month + dsep + day + dsep + year + sep + hours + tsep + minutes + sep + ampm;
   
};

function setItemMirrorOption(theFolderName, number){
    var itemMirrorOptions = {
      1: {
        groupingItemURI: theFolderName+'/',
        xooMLDriver: dropboxXooMLUtility,
        itemDriver: dropboxItemUtility
      },
      2: {
        groupingItemURI: theFolderName+'/',
        xooMLDriver: dropboxXooMLUtility,
        itemDriver: dropboxItemUtility,
        syncDriver: mirrorSyncUtility,
        readIfExists: false
      },
      3: {
        groupingItemURI: theFolderName+'/',
        xooMLDriver: dropboxXooMLUtility,
        itemDriver: dropboxItemUtility,
        syncDriver: mirrorSyncUtility,
        readIfExists: true
      }
    };

    return itemMirrorOptions[number];
}

function setAssociationOption(text, number){
     var associationOptions = {
      1:{
        displayText: text
      },
      
      2:{},
      
      7:{ 
        "displayText": text,
        "itemName": text,
        "isGroupingItem": true}

     };
     return associationOptions[number];

}

html5sticky.addNote = function(el){

    // count total present notes
    var tnotes = $('.text p').length;
    var dated = html5sticky.getDateTime();
    if (tnotes == max_notes){
       alert('You can not add any more notes, please delete some to add more.');
       return false;
    }
   
  	var nindex = ++note_index + 'box';
    var stickynote = $('<div class="box box0"><p height:200px contenteditable="true"></p><div class="changeColor"><a href="#"></a></div><div class="save"><a href="#"></a></div><div class="delete"><a href="#"></a></div><h3></h3></div>')
  	.appendTo($('.demo'));
  	$(stickynote).append($('<span id="idf_' + nindex + '" />')); 

    //dragNote();
    $(stickynote).draggable({ containment: ".demo", scroll: false });
 
};

//5.23(Zhengjun) for testing
function dragNote(el){
  // alert("really");
    //$(this).draggable({ containment: ".demo", scroll: false })
   // $(el).closest('.box').find('.box').
        if ( $(this).is('.ui-draggable-dragging') ) {
            return;
        }
        $(this).draggable( "option", "disabled", true );
        $(this).closest('.box').find('p').attr('contenteditable','true');
    
       $(this).blur(function(){
        $(this).draggable( { containment: ".demo", scroll: false });
        $(this).closest('.box').find('p').attr('contenteditable','false');
    });
}

// / get note identifier/
html5sticky.getIdentifier = function(el){
   var identifier = $(el).closest('.box').find('[id^=idf_]').attr('id');

   if (typeof identifier == 'undefined' || identifier == null){
      identifier = $(el).closest('.box').find('[id^=idf_]').attr('id');
   }

   if (typeof identifier != 'undefined'){
      identifier = identifier.replace('idf_', '');
      return identifier;
   }
   else{
      return false;
   }
};
// delete note
  html5sticky.deleteNote = function(el){
	
	var r=confirm("Do you really want to delete this note?");

	if (r==true){
    content = $(el).closest('.box').find('p').html().toString();
    //console.log(content);
    //console.log(foldName);
    var guid = $(el).closest('.box').attr("id");
    //here foldName is just the parent folder name.
   
   //!!!!
   	var tempParent = $(el).closest('.demo').find('.tempParent').text();
	  var tempChild = $(el).closest('.demo').find('.tempChild').text();
	  console.log(tempParent);
    console.log(tempChild);
	  // var name = "/" + tempParent;
   //  console.log("name: "+ name);
	  //console.log($(el).closest('.box').find(".subfolder"));
	  if($(el).closest('.box').find(".subfolder").hasClass("subfolder")){

		  console.log('this is subfolder whose name is: '+tempParent);
      console.log(guid);
      // deleteSubfolder(guid, tempParent);
      deleteAssociationforNote(guid, tempParent);
	  }
	  if($(el).closest('.box').find(".file").hasClass("file")){
      deleteSubfolder(guid, tempParent);
		  console.log('this is file');
	  }
	  if($(el).closest('.box').find(".webpage").hasClass("webpage")){
            deleteSubfolder(guid, tempParent);
		  console.log('this is webpage');
	  }
	  if($(el).closest('.box').find(".save").hasClass("save")){
            deleteSubfolder(guid, tempParent);

		  console.log('this is note');
	  }
     //if this class == subfolder
     //deleteSubfolder(guid, foldName);
     // else{
      // deleteAssociationforNote(guid, foldName);

     // }

  	  $(el).closest('.box').fadeOut('slow', function(){
    	$(el).closest('.box').remove();
    });
    }


  };


html5sticky.changeNote = function(el){
  //var identifier = html5sticky.getIdentifier($(el));
  //$('[id^=idf_' + identifier + ']').closest('.box').find('p').html()
  //console.log($(identifier));
  var col = $(el).closest('.box').attr("class");
  //alert(col);
  if($(el).closest('.box').hasClass("box0")) {
  $(el).closest('.box').removeClass("box box0 ui-draggable").addClass("box box1 ui-draggable");
  }
  else if($(el).closest('.box').hasClass("box1")) {
  $(el).closest('.box').removeClass("box box1 ui-draggable").addClass("box box2 ui-draggable");
  } 
  else if($(el).closest('.box').hasClass("box2")){
  $(el).closest('.box').removeClass("box box2 ui-draggable").addClass("box box3 ui-draggable"); 
  }
  else if($(el).closest('.box').hasClass("box3")){
  $(el).closest('.box').removeClass("box box3 ui-draggable").addClass("box box4 ui-draggable"); 
  }
  else
  {$(el).closest('.box').removeClass("box box4 ui-draggable").addClass("box box0 ui-draggable");} 
  
};
html5sticky.addBoard = function(el){
	 var con = $("input[type='text']").val();  
   for(var m=0; m<savedNoteBoardText.length; m++){
     if(savedNoteBoardText[m] == con){
        alert("You have this name already change another name please!");
		$('.board').remove('<ul class="noteb"><li style="width:140px; height: 20px;"><a href="#">'+con+ '</a> <img class="addSub" src="images/addSub.png" /><img class="del" src= "images/trash_box.png"/></li></ul>');
     }
   
   }
   //!!!
  if(con.length<=0 || con.length == ""){ 
    alert("please input a name for the board");}
  else{
  $('.board').append('<ul class="noteb"><li style="width:140px; height: 20px;"><a href="#">'+con+ '</a><img class="addSub" src="images/addSub.png" /><img class="del" src= "images/trash_box.png"/></li></ul>');
  buildItemMirrorwithAssandSubIM(con, 3,3, con, 7);}
  
   
	
    /* if(con != ''){
          buildItemMirrorwithAssandSubIM(con, 3,3, con, 7);
     }
     else{
      alert('please input a name for the board');
     }*/
      
		$("input[type='text']").attr("value","")
	};
	
  function buildItemMirrorwithAssandSubIM(groupItemName,itemMirrorCaseNum, subitemMirrorCaseNum, assText, assCaseNumber){
    var sub_itemMirrorOption = setItemMirrorOption(groupItemName, subitemMirrorCaseNum);
    var itemMirrorOption = setItemMirrorOption("", itemMirrorCaseNum);
    var assOption = setAssociationOption(assText, assCaseNumber);
    //build the parent itemMirror for the created-folder
    new ItemMirror(itemMirrorOption, function(error, iM){
      if(error){throw error;}
       
      //create a new ass in the root xoomlfile.
      iM.createAssociation(assOption, function(error, GUID){
      if (error) {
          throw error;
      }
 
      });
    //build the itemMirror for the sub
    new ItemMirror(sub_itemMirrorOption, function(error, subiM){
        if(error){
          throw error;
        }
    });

    });
}

  function changeDisplayText(updatedContent, guid, foldName){
     var imOption = setItemMirrorOption(foldName, 1);
     new ItemMirror(imOption, function(error, iM){
       if(error){
          throw error;
        }
        iM.setAssociationDisplayText(guid, updatedContent, function(error){
          if(error){throw error;}
        });

     });
   }

  function existNoteguid(guid){
    for(var m = 0; m < arrayforGUIDS.length; m++){
     // console.log(arrayforGUIDS[m]);
      if(guid == arrayforGUIDS[m]){
        return true;
      }
    }
    return false;
}

  html5sticky.saveNote = function(el){
    content = $(el).closest('.box').find('p').html().toString();
	//!!
	var updatedContent = replaceTextarea2(content);
    console.log("updatedcontent is: "+updatedContent);
	
    var currentId = $(el).closest('.box').attr("id");
    if(content != ''){
        if(existNoteguid(currentId)){
          //var updatedContent = $(el).closest('.box').find('p').html().toString().replace(/<br\s*[\/]?>/gi, "\n");
          //console.log(updatedContent);
          changeDisplayText(updatedContent, currentId, foldName);
        }
         
        else{
             // arrayforGUIDS.push(currentId);
             buildGUID(foldName, content, 3, 1, function(guidForNote){
              $(el).closest('.box').attr("id", guidForNote);
              arrayforGUIDS.push(guidForNote);
              // console.log($('.box').attr("id"));
        });
      }
 }
     
}


  function buildGUID(groupItemName, displayText, iMcaseNumber, assCaseNumber, callback){
      var imOption = setItemMirrorOption(groupItemName, iMcaseNumber);
      var assOption = setAssociationOption(displayText, assCaseNumber);
     
      new ItemMirror(imOption, function(error, iM){
        if(error){throw error;}
        iM.createAssociation(assOption, function(error, GUID){
        if (error) {
            throw error;
        }
      
        callback(GUID);
      
      });

    });
    
  }

  function deleteSubfolder(guid, parentFoldName){
    var subDeletionIMoption = setItemMirrorOption(parentFoldName,1);
    new ItemMirror(subDeletionIMoption, function(error, iM){
       if(error){throw error;}
       iM.deleteAssociation(guid, function(error){
        if(error){throw error;}
        console.log(guid);
        console.log("the parent foldername is" + parentFoldName);
      });
    });

  }
//252 - 278 delete a folder
  function deleteFolder(foldName){
    
    var deleteFolder_itemMirrorOption =  setItemMirrorOption("/", 1);
    new ItemMirror(deleteFolder_itemMirrorOption, function(error, deleteFolder_itemMirror){
      if(error){throw error;}
      deleteFolder_itemMirror.listAssociations(function(error, guids){
        for(var i = 0; i < guids.length; i++){
          deleteFolder_itemMirror.getAssociationDisplayText(guids[i], function(error, displayText){
            if(error){throw error;}
            if(displayText == foldName){
              // confirm("Are you sure you want to remove this board? The corresponding folder in 
              //   your dropbox app folder will also be removed!");
              deleteFolder_itemMirror.deleteAssociation(guids[i], function(error){
                if(error) {throw error;}
                console.log("the folder whose name is "+ displayText +" is deleted!");
              });
            }
          });
        }
      });
    });

  }

  function deleteAssociationforNote(guid, folderName){
     var inneritemMirrorOptionforNoteAss = setItemMirrorOption(folderName, 3);
     new ItemMirror(inneritemMirrorOptionforNoteAss, function(error, iM){
      iM.deleteAssociation(guid, function(error){
        if(error){throw error;}
      });
      // inneritemMirrorOptionforNoteAss.sync(function(error){
      //      if(error){throw error;}
      //       console.log("I am syncing");
      // });
      
     });
  }
     
    function displayEachnoteInFolder(folderName){
		    // var noteType ;
        var eachBoardText = Array();
        // var guidForText = Array();
        var arrayGUIDForEachBoard = new Array();
        
        var eachNoteItemMirrorOption = setItemMirrorOption(folderName, 1);
      //  alert("hello@");

        new ItemMirror(eachNoteItemMirrorOption, function(error, savedNoteinEachFolder){
          if (error) { throw error; }
        
         savedNoteinEachFolder.listAssociations(function(error,guids){
             for(var i=0; i < guids.length; i++){
                //global variable stores the guids
                 arrayforGUIDS.push(guids[i]);
             
                 //this board's array(local variable stores the guids)
                 arrayGUIDForEachBoard.push(guids[i]);

                 savedNoteinEachFolder.getAssociationDisplayText(guids[i], function (error, displayText) {
                  if (error) {
                    throw error;
                  }


                  if(displayText != ''){
                     
                   // console.log(relationship[i]);
                    // if(displayText以.txt/.docx/.doc/.xls/.rtf。。。结尾){
                    //   //加上对应的icon
                        // console.log(displayText+guids[i]);
                    // }
                    // else if(.url 结尾 加上对应的icon){
                      //加上对应的icon
                    // }
                    //在下面这个函数getGuidAddingIcon(383)里面加入 加icon的函数；

                    getGuidAddingIcon(guids[i], savedNoteinEachFolder,function(noteType, GUID){
                      // console.log("I am the note type " + noteType);  
                       if(noteType){
                      var stickynote =$('<div class="box box0"><p contenteditable="true">'+displayText+'</p><div class="changeColor"><a href="#"></a></div><div class="subfolder"><a href="#"></a></div><div class="delete"><a href="#"></a></div><h3></h3></div>').appendTo($('.demo'));
                      // $(stickynote).attr("id", arrayGUIDForEachBoard[i]);
                      $(stickynote).attr("id", GUID);

                      }
            
                      else{
                        var str = displayText.substring(displayText.lastIndexOf('.')+1);
                        if(str=='txt'||str=='doc'||str=='docx'||str=='xls'||str=='xlsx'||str=='ppt'||str=='pptx'||str=='pdf'||str=='rtf'){
                              var stickynote =$('<div class="box box0"><p contenteditable="true">'+displayText+'</p><div class="changeColor"><a href="#"></a></div><div class="file"><a href="#"></a></div><div class="delete"><a href="#"></a></div><h3></h3></div>').appendTo($('.demo'));
                              //console.log(displayText+guids[i]);
                               $(stickynote).attr("id", GUID);
                        }
                        else if(str=='url' || str == 'URL'){
                              var stickynote =$('<div class="box box0"><p contenteditable="true">'+displayText+'</p><div class="changeColor"><a href="#"></a></div><div class="webpage"><a href="#"></a></div><div class="delete"><a href="#"></a></div><h3></h3></div>').appendTo($('.demo'));
                               $(stickynote).attr("id", GUID);
                        }
                        else{
                              var stickynote =$('<div class="box box0"><p contenteditable="true">'+displayText+'</p><div class="changeColor"><a href="#"></a></div><div class="save"><a href="#"></a></div><div class="delete"><a href="#"></a></div><h3></h3></div>').appendTo($('.demo'));
                               $(stickynote).attr("id", GUID);
                        }
                      }

                        // $(stickynote).attr("id", arrayGUIDForEachBoard[i]);
                      // console.log(arrayGUID[j]);
                      // var nindex = ++ note_index + 'box';
                      // $(stickynote).append($('<span id="idf_' + eachBoardText[j] + '" />')); 
                      $(stickynote).append($('<span id="idf_' + eachBoardText[i] + '" />')); 
                
                      //!!
                      $(stickynote).draggable({ containment: ".demo", scroll: false })
                             // getGuidAddingIcon(guids[i], savedNoteinEachFolder);
                    });
					          
                      //下面这几行 应该和上面的融入到一起；
					
					  }
                });
             }
             
        //      for(var j=0; j< eachBoardText.length; j++){           
        //         var stickynote =$('<div class="box box0"><p contenteditable="true">'+eachBoardText[j]+'</p><div class="changeColor"><a href="#"></a></div><div class="save"><a href="#"></a></div><div class="delete"><a href="#"></a></div><h3></h3></div>').appendTo($('.demo'));
  			   //      $(stickynote).attr("id", arrayGUIDForEachBoard[j]);
        //         // console.log(arrayGUID[j]);
        // 			  // var nindex = ++ note_index + 'box';
        // 			  // $(stickynote).append($('<span id="idf_' + eachBoardText[j] + '" />')); 
        //         $(stickynote).append($('<span id="idf_' + eachBoardText[j] + '" />')); 
        		
    				// //!!
    				// $(stickynote).draggable({ containment: ".demo", scroll: false })
        	      	
        //          }
                 
              });
    });
  };

 function getGuidAddingIcon(guid, iM, callback){
     // var noteType;
        // var flag;
      iM.isAssociatedItemGrouping(guid, function(error, isGroupingItem){
          if (error) {
              throw error;
          }
          
          if (isGroupingItem) {
              callback(isGroupingItem, guid);             
          }
          else {
              callback(isGroupingItem, guid);
          }
      });
  }

function storeRelationShip(guid, iM, parent, callback){
  iM.isAssociatedItemGrouping(guid, function(error, isGroupingItem){
          if (error) {
                  throw error;
          }
          
          if (isGroupingItem) {
              iM.getAssociationDisplayText(guid, function(error, subdisplayText){
                if(error){throw error;}
                // var value = parent+":"+subdisplayText;
                // console.log(value);
                // relationship.push(value);
                parentArray.push(parent);
                childArray.push(subdisplayText);
                callback(subdisplayText);  

              });
          }
          else {
              console.log("parentArray: "+ parent);
              parentArray.push(parent);
          }
      });
}

     var parentArray = new Array();
     var childArray = new Array();
  //for displaying board user created to user
  function displaySavedBoard(){
     var folderSaved_itemMirrorOption = setItemMirrorOption("/", 3);
    
     // var folderSaved_itemMirrorOption = setItemMirrorOption("foldName", 3);
     new ItemMirror(folderSaved_itemMirrorOption, function(error, savedFolder_itemMirror){
          if (error) { throw error; }
          //first level folder "/"
          savedFolder_itemMirror.listAssociations(function(error,guids){
            // console.log("guids length: "+ guids.length);
             for(var i=0; i<guids.length; i++){
                 savedFolder_itemMirror.getAssociationDisplayText(guids[i], function (error, displayText) {
                  if (error) {
                    throw error;
                  }
                  if(displayText != ''){
                        var value;
                        var sub_itemMirrorOption = setItemMirrorOption(displayText, 3);

                        //second level folder "/1"
                        
                        new ItemMirror(sub_itemMirrorOption, function(error, iM){
                           if (error) { throw error; }  
                           iM.listAssociations(function(error,subGuids){
                            console.log("sub guids length: "+ subGuids.length);
                            if(subGuids.length == 0){
                              parentArray.push(displayText);
                              childArray.push("null");
                            }
                            else{
                              for(var j=0; j<subGuids.length; j++){
                              // value = displayText+":";                            
                              var subValue;

                              storeRelationShip(subGuids[j], iM, displayText, function(subValue){
                                
                                // value += ":" + subValue;
                                // relationship.push(value);
                                // console.log("I am value!!!" + value);
                                /*
                                for(var q=0; q<parentArray.length;q++){
                                  console.log("parentArray:"+q+" is "+parentArray[q]);
                                  if(q!=0 && (parentArray[q]==parentArray[q-1])){
                                    //console.log("parentArray:"+q+" is "+parentArray[q]);
                                    continue;
                                  }
                                  $('.board').append('<ul class="noteb"><li style="width:140px; height: 20px;"><a href="#">'+parentArray[q]+ '</a><img class="addSub" src="images/addSub.png" /><img class="del" src= "images/trash_box.png"/></li></ul>');
                                 
                                }

                                for(var p=0; p<childArray.length;p++){
                                  console.log("childArray:"+p+" is "+childArray[p]);
                                
                                }
                                */
                                //console.log("parentArray length: "+parentArray.length);
                                // value = displayText + ":";
                                //console.log("childArray length: "+ childArray.length);


                              });
                             
// 
                            }
                            }

        

                           });

                        });
                   

                    savedNoteBoardText.push(displayText);
                  }
                });
             }
             //!!!!!!
            for(var j=0; j< savedNoteBoardText.length; j++){           
              //!!
              $('.board').append('<ul class="noteb"><li style="width:140px; height: 20px;"><a href="#">'+savedNoteBoardText[j]+ '</a><img class="addSub" src="images/addSub.png" /><img class="del" src= "images/trash_box.png"/></li></ul>');
            }
            
            for(var m=0; m < relationship.length; m++){
            console.log("I am relationship array" + relationship[m]);
          }  

        
          });


    });

}





 
    html5sticky.deleteImg = function(el){ 
      var boardName = $(el).find('a').html().toString();
      foldName = boardName;
      // console.log(boardName);
      
  	  $(".boardname p").text('Location: '+ boardName);
  	  //!!!!
	  $('.tempParent').remove();
	  $('<div class="tempParent" style="visibility:hidden">'+boardName+'</div>').appendTo($('.demo'));
	  
	  
  	  //Remove all the notes displayed in the board
  	  $('.box').remove();
      // displayNoteIneachBoard(content, foldName);
      displayEachnoteInFolder(foldName);

    };
	
	//!!!need to be changed. (waiting for yan's methord)
	html5sticky.deleteSubImg = function(el){ 
      var boardName = $(el).find('a').html().toString();
      var parentName = $(el).closest('.noteb').find('a').html().toString();
	  
	  //!!!!
	  $('.tempParent').remove();
	  $('.tempChild').remove();
	  
	  $('<div class="tempParent" style="visibility:hidden">'+parentName+'</div>').appendTo($('.demo'));
	  $('<div class="tempChild" style="visibility:hidden">'+boardName+'</div>').appendTo($('.demo'));
	  
      // foldName = boardName;
      // console.log(boardName);
      boardName = boardName + "/" + parentName;
      foldName = boardName;
      console.log(foldName);
      displayEachnoteInFolder(foldName);

    };
         
    html5sticky.deleteBoard = function(el){	
	 var r = confirm("Are you sure you want to remove this board? The corresponding folder in your dropbox app folder will also be removed!");
	 if(r==true){
        $(el).closest('.noteb').fadeOut('normal', function(){
        $(el).closest('.noteb').remove();});
        deleteFolder(foldName);
		}
	else{}
    };
	
    html5sticky.loadboard= function(){
    	   displaySavedBoard();
    };

	  function buildSubFolder(parent, assOption, subfolderName, imOption, callback){
      var imOption = setItemMirrorOption(parent, 3);
      var assOption = setAssociationOption(subfolderName, 7);
      var path = parent+"/"+subfolderName;
      var sub_itemOption = setItemMirrorOption(path, 3);
      new ItemMirror(imOption, function(error, iM){
        if(error){throw error;}
        iM.createAssociation(assOption, function(error, GUID){
          if(error){throw error;}
          callback(GUID);
          console.log("I'm subfolder guid"+ GUID);

        });
        new ItemMirror(sub_itemOption, function(error, subiM){
          if(error){throw error;}

        });

      });

    }
	
		html5sticky.createSubBoard = function(el){
			var subfolderName = prompt("Please enter name of subfolder","");
      if(subfolderName==''||subfolderName==null){
        alert("The name of subfolder is empty.")
      }

      else{
      var parentName = $(el).closest('.noteb').find('a').html().toString();
      
      // console.log("subfolderName"+subfolderName+"parentFoldName"+parentName);
      // buildItemMirrorwithAssandSubIM(con, 3,3, con, 7);
      buildSubFolder(parentName,7,subfolderName,3, function(guidForsubfolder){
          console.log("guidForsubfolder: "+ guidForsubfolder);
          var stickynote = $('<div class="box box0" id="'+guidForsubfolder+'"><p height:200px contenteditable="true">'+subfolderName+'</p><div class="changeColor"><a href="#"></a></div><div class="subfolder"><a href="#"></a></div><div class="delete"><a href="#"></a></div><h3></h3></div>')
                           .appendTo($('.demo'));
             $(stickynote).draggable({ containment: ".demo", scroll: false }); 
      });
	    $(el).closest('.noteb').append('<li><ul class="subboard"><li class="subboardContent" style="width: 150px; height: 20px;"><a href="#">'+subfolderName+'</a><img class="delSub" src="images/trash_box.png" /></li></ul></li>');
		}
    };
	   
	   html5sticky.deleteSubBoard = function(el){
        var r = confirm("Are you sure you want to remove this board? The corresponding subfolder in your dropbox app folder will also be removed!");
    	   if(r==true){
            $(el).closest('ul').fadeOut('normal', function(){
            $(el).closest('ul').remove();});
    		}
    	 
  	 };
	 
	function replaceTextarea1(str){
		var reg=new RegExp("reservedForReplacing","g");
		str = str.replace(reg,"<br>");
		
		return str;
	}
	function replaceTextarea2(str){
		var reg=new RegExp("<br>","g");
		str = str.replace(reg,"reservedForReplacing");
		
		return str;
	}
  
    function textLimit(el){
		var textArea = $(el).closest('.box').find('p');
		//alert("processing");
		textArea.keydown(function(){
			//alert("processing2");
			var curLength=textArea.text().length;
			console.log(curLength);
			if(curLength>=200){
				var num=textArea.text().substr(0,199);
				textArea.text(num);
				alert("Sorry, Text limit is only 200" );
			}
			//else{ $("#textCount").text(4-$("#TextArea1").val().length);}
		})
	}

 $(function(){
    // add note
    $('.create').click(function(){
        html5sticky.addNote();
        return false;
    });
	
	$('.changeColor').live('click', function(){
        html5sticky.changeNote($(this));
        return false;
    });

    $('.delete').live('click', function(){
        html5sticky.deleteNote($(this));
        return false;
    });

    // save the note
    $('.save').live('click', function(){
        html5sticky.saveNote($(this));
        return false;
		
    });
    $('.add').live('click',function(){
		html5sticky.addBoard($(this));
        return false;
	  });
	
  	$('.noteb').live('click',function(){
  		html5sticky.deleteImg($(this));
      // console.log('Iam yan');
          return false;
  	});
	
	//!!!
	$('.subboardContent').live('click',function(){
  		html5sticky.deleteSubImg($(this));
      // console.log('Iam yan');
          return false;
  	});
	
  	$('.del').live('click',function(){
  		html5sticky.deleteBoard($(this));
          return false;
  	});
  	$('body').ready(function(){
          html5sticky.loadboard($(this));
    });
	
	//5.23(Zhengjun) for test
  $('.box').live('click',function(){
      if ( $(this).is('.ui-draggable-dragging') ) {
            return;
        }
        $(this).draggable( "option", "disabled", true );
        $(this).closest('.box').find('p').attr('contenteditable','true');
		//!!
		textLimit($(this));
	}).live('blur',function(){
        $(this).draggable( 'option', 'disabled', false);
        $(this).closest('.box').find('p').attr('contenteditable','false');
        var content = $(this).closest('.box').find('p').html().toString();
        //!!
		//alert(content);
		html5sticky.saveNote($(this));
    });
});
	//!!
	$('.addSub').live('click',function(){
  		html5sticky.createSubBoard($(this));
          return false;
  	});
	
	$('.delSub').live('click',function(){
  		html5sticky.deleteSubBoard($(this));
          return false;
  	});
	
   $("input[type='text']").live('click',function(){
	   $("input[type='text']").attr("value","");
       $("input[type='text']").keyup(function(e){
       if(e.which == 13){
       html5sticky.addBoard($(this));} //处理事件
    });
   });
   
});

var itemCount=0;
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

    //folderName;

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
    
  
    
    
/*----------------function--start--from--here--------------------------*/
/* create a new folder and corresponding xml file*/
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
          new ItemMirror(sub_itemMirrorOption, function(error, sub_itemMirror){
          if (error) { throw error; }
          
        });

        });
        
      });
    };

    function createAssociation(itemMirror, options) {
      itemMirror.createAssociation(options, function (error, GUID) {
        if (error) {
          throw error;
        }
        console.log("A new folder and related Xooml2 file are created.");
        
      });
    }; 
};

function loadHeadings(){
      headingSaved_itemMirrorOption = {
      groupingItemURI: '/',
      xooMLUtility: dropboxXooMLUtility,
      itemUtility: dropboxItemUtility,
      syncUtility: mirrorSyncUtility,
      createIfDoesNotExist: true
    };
     new ItemMirror(headingSaved_itemMirrorOption, function(error, savedHeading_itemMirror){
          if (error) { throw error; }

          savedHeading_itemMirror.listAssociations(function(error,guids){
             for(var i=0; i<guids.length; i++){
                 savedHeading_itemMirror.getAssociationDisplayText(guids[i], function (error, displayText) {
                  if (error) {
                    throw error;
                  }
                    //console.log("Display Text: "+displayText);
                    
                  // if($("#tag").val()==displayText){
                  //  //console.log("Tag is present");
                  //   tagPresent=1;
                  //   //break;
                  //   } 
                  if(displayText != ''){
                    savedHeadings.push(displayText);
                  }
                });

             }
              for(var j=0; j< savedHeadings.length; j++){           
            $('#contentarea').append('<div class="row"><div class="span8 item"><a    href="#">'+savedHeadings[j]+
            '</a></div></div>');

                console.log(savedHeadings[j]);
              }
          });
    });
};

/*function deleteHeading()
{
  deleteitemMirrorOption={
      groupingItemURI: '/',
      xooMLUtility: dropboxXooMLUtility,
      itemUtility: dropboxItemUtility,
      syncUtility: mirrorSyncUtility,
      createIfDoesNotExist: true

  };


}*/
/*------------------------------------------------------------------------*/

function bodyLoad(){

dropboxClient.authenticate(function (error, client) {
      if (error) {
        throw error;
      }
      loadHeadings();
    });

}



function createNewItem(keyId){
      if(keyId==13)
      {
        itemCount++;
        var newRow=document.createElement("div");
        newRow.className="row";
        var newDiv=document.createElement("div");
        newDiv.className="span8 item";

        var newItem=document.createElement("a");
        var folderName=document.getElementById("textarea").value.toString();
        
        //alert(folderName);
        
        createFolder(folderName);
        newItem.innerHTML=document.getElementById("textarea").value;
        newRow.appendChild(newDiv);
        newDiv.appendChild(newItem);
        document.getElementById("contentarea").appendChild(newDiv);
        
        //document.getElementById("textarea").blur();
        var temp=document.getElementById("textarea");
        temp.value='';
        //temp.select();
        temp.blur();
        //$(".search-query span2").focus();
        //temp.value='';
        //temp.focus();
        
      }
}
-var dropboxItemUtility,
    dropboxXooMLUtility,
    dropboxClient,
    itemMirrorCase,
    itemMirrorOptions,
    createAssociationCase7Options,
    sub_itemMirrorOption;
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
      dropboxClient.authenticate(function (error, client){
        new ItemMirror(sub_itemMirrorOption, function ( error, sub_itemMirror){
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
/*------------------------------------------------------------------------*/




function createNewItem(folderName){
  if(keyId==13)
      {
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
        document.getElementById("textarea").value="";
        
      }
}
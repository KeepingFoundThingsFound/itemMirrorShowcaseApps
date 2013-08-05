var associationNames = new Array();

function dropboxConnection(callback)
{
var
      dropboxClient,
      dropboxXooMLUtility,
      dropboxItemUtility,
      mirrorSyncUtility,
      URIToGroupingItem,
      itemMirrorOptions,
      createAssociationCase1Options,
      createAssociationCase2Options,
      createAssociationCase7Options,
      itemMirrors;
    
       
     dropboxClient = new Dropbox.Client({
      key:     "YTKSGBUodHA=|Pm0x0m5s+2lDR4d8ekUb4jmeNE+cQDNpeLo2uT09LA==",
      sandbox: true
    });
    dropboxClient.authDriver(new Dropbox.Drivers.Redirect({
      rememberUser: true
    }));
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
    createAssociationCase1Options = {
      displayText: "case1"
    };
    createAssociationCase2Options = {
      "displayText": "case2",
      "itemURI": "http://ischool.uw.edu/about"
    };
    createAssociationCase7Options = {
      "displayText": "case7",
      "itemName": "case7",
      "isGroupingItem": true
    };

    function constructNewItemMirror() {
      // Construct new ItemMirror in Case 3, could choose other cases
      new ItemMirror(itemMirrorOptions[3], function (error, itemMirror) {
        if (error) { throw error; }
        //alertSchemaVersion(itemMirror);
        findChildren(itemMirror);
        
        //createAssociation(itemMirror, createAssociationCase1Options); // Try swapping out other cases!
        //createAssociation(itemMirror, createAssociationCase2Options);
        //createAssociation(itemMirror, createAssociationCase7Options);
        
      });
    } 
    
    function findChildren(itemMirror)
    {
    	console.log("inside findChildren");
    	var myguids = new Array();
    	//var associationNames = new Array();
    	itemMirror.listAssociations(function (error, guids){
    		 if (error) {
    	          throw error;
    	        }
         	console.log("in listAssociation");
    		console.log(guids.length);
			myguids=guids;
    	});
		console.log(myguids.length);

    	if(myguids.length>0)
    		{
        	console.log("in if block");
    		for(var i=0;i<myguids.length;i++)
    		{
    		 	
    				itemMirror.getAssociationDisplayText(myguids[i], function (error, displayText) {
    		        if (error) {
    		          throw error;
    		        }
    		        console.log(displayText);
    		        associationNames[i] = displayText;
    		         		       		    	
    		    	});
    		   
    		}
    		
    		}
    		console.log("length inside"+associationNames.length);
    		callback();
    
   		}
        
    function createAssociation(itemMirror, options) {
      itemMirror.createAssociation(options, function (error, GUID) {
        if (error) {
          throw error;
        }

        getDisplayTextForAssociation(itemMirror, GUID);
        upgradeAssociation(itemMirror, GUID);
      });
    }

    function getDisplayTextForAssociation(itemMirror, GUID) {
      itemMirror.getAssociationDisplayText(GUID, function (error, displayText) {
        if (error) {
          throw error;
        }

        // do something with displayText
      });
    }

    function upgradeAssociation(itemMirror, GUID) {
      itemMirror.upgradeAssociation(GUID, function (error) {
        if (error) {
          throw error; // You might get a "404" error thrown here if "case1" already exists
                       // that's because upgrades only work if a grouping item doesn't already exist!
        } else {
          alert("upgrade complete!");
        }
        // Now "case1" should exist as a folder, try creating an ItemMirror for it.
      });
    }

    function alertSchemaVersion(itemMirror) {
      // Most "get" methods follow this pattern. Check documentation to be sure.
      itemMirror.getSchemaVersion(function (error, schemaVersion) {
        if (error) { throw error; }

        //alert(schemaVersion);
        // do something with schemaVersion
      });
    }

    dropboxClient.authenticate(function (error, client) {
      if (error) {
        throw error;
      }
      constructNewItemMirror();
      
    });

}

function showAssociation()
{
    console.log("outside length is"+associationNames.length);
	$.each(
				
				associationNames ,
				    function(i,v) {
				        $("#mindmap").append("<li><div><span>" + v + "</span></div></li>") ;
				    }
				) ;
		
}	
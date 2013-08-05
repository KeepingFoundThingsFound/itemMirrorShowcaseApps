
<!DOCTYPE html>
<head>
  <title>Hello World!</title>
</head>
<body>
<script src="//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.9.1/dropbox.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

<script src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.5/require.min.js"></script>
<script src="//googledrive.com/host/0B147HlW6g510cDdfeFJWM1MwTHM/6.0/ItemMirror.min.js"></script>
<script>
  /*
   Be sure to download ItemMirror.min.js in the same directory as this.
   */
  require(["ItemMirror"], function(ItemMirror){
    "use strict";

    var
      dropboxClient,
      dropboxXooMLUtility,
      dropboxItemUtility,
      mirrorSyncUtility,
      URIToGroupingItem,
      itemMirrorOptions,
      createAssociationCase1Options,
      createAssociationCase2Options,
      createAssociationCase7Options;

    dropboxClient = new Dropbox.Client({
      key:     "cyJ2mWlvUVA=|UR6kvCtyyNjeBJtMS+muZhqtoIoo/tHpB4g+PYLihA==",
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
      "itemURI": "http://case2"
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

        alertSchemaVersion(itemMirror);
        createAssociation(itemMirror, createAssociationCase1Options); // Try swapping out other cases!
        createItemMirrorFromGroupingItem(itemMirror);
      });
    }

    function createItemMirrorFromGroupingItem(itemMirror) {
      itemMirror.createAssociation(createAssociationCase7Options,
        function (error, GUID) {
        if (error) { throw error; }

        itemMirror.createItemMirrorFromAssociatedGroupingItem(
          GUID, function (error, newItemMirror) {
          if (error) { throw error; }

          itemMirror.getItemDescribed(function (error, itemDescribed) {
            if (error) { throw error; }

            alert("newItemMirror from Association displayText" + itemDescribed);
          });
        });
      });
    }

    function createAssociation(itemMirror, options) {
      itemMirror.createAssociation(options, function (error, GUID) {
        if (error) { throw error; }


        getDisplayTextForAssociation(itemMirror, GUID);
        upgradeAssociation(itemMirror, GUID);
      });
    }

    function getDisplayTextForAssociation(itemMirror, GUID) {
      itemMirror.getAssociationDisplayText(GUID, function (error, displayText) {
        if (error) { throw error; }


        // do something with displayText
      });
    }

    function upgradeAssociation(itemMirror, GUID) {
      itemMirror.upgradeAssociation({"GUID": GUID}, function (error) {
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

        alert(schemaVersion);
        // do something with schemaVersion
      });
    }

    dropboxClient.authenticate(function (error, client) {
      if (error) {
        throw error;
      }
      constructNewItemMirror()
    });
  });
</script>
</body>
</html>
/*
 * Dropbox.min 0.9.1
 * jQuery.min  1.9.1
 * ItemMirror.min 2.1
   doc & url: https://googledrive.com/host/0B147HlW6g510cDdfeFJWM1MwTHM
 */


/*declare object*/
var dropboxItemUtility,
    dropboxXooMLUtility,
    dropboxClient,
    itemMirrorCase,
    itemMirrorOptions;

    // Create DropboxClient
    dropboxClient = new Dropbox.Client({
        key:     "cyJ2mWlvUVA=|UR6kvCtyyNjeBJtMS+muZhqtoIoo/tHpB4g+PYLihA==",
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
/*----------------function--start--from--here--------------------------*/
/* assign dropbox connection options*/
function setItemMirrorOption(dirpath, callback){
    dirpath = dirpath + "/";

    itemMirrorOptions = { 
        groupingItemURI: dirpath, 
        xooMLUtility: dropboxXooMLUtility,
        itemUtility: dropboxItemUtility,
        syncUtility: {
            utilityURI: "MirrorSyncUtility"
        },
        createIfDoesNotExist: true 
    };

    callback(itemMirrorOptions);
}

/*create a new checklist and dropbox folder*/
function createChecklist(inputtext){
    checkExistassociation("", inputtext, function(flag){
        if (flag == true) {
            //create association
            console.log("you could create new one");

            setItemMirrorOption("", function (options) {
                dropboxClient.authenticate(function (error, client){
                    if (error) { throw error; }

                    new ItemMirror(options, function (error, itemMirrorCase){
                        if(error){ throw error; }

                        itemMirrorCase.createAssociation({
                            "displayText": inputtext,
                            "itemName": inputtext,
                            "isGroupingItem": true
                        }, function (error, GUID) {
                            if (error) { throw error; }
                            //create new xooml file under this folder
                            setItemMirrorOption(inputtext, function (options){
                                dropboxClient.authenticate(function (error, client){
                                    if (error) { throw error; }

                                    new ItemMirror(options, function (error, itemMirrorCase) {
                                        if (error) { throw error; };
                                        //set FragementNameSpaceAttribute, checklist color, create date
                                        var createDate = new Date();
                                        itemMirrorCase.setFragmentNamespaceAttribute("color", "yellow", "http://noteU", function (){
                                            //do
                                        });
                                        itemMirrorCase.setFragmentNamespaceAttribute("createDate", createDate.toString() , "http://noteU", function (){
                                            //do
                                        });
                                    });
                                });
                            });
                        });
                    });

                });
            });

        } else{
            //association is existed alert message
            alert("already existed!");
        };
    });
}

/* check association displaytext is already existed or not*/
function checkExistassociation(dirpath, inputtext, callback){
    var flag = true;

    setItemMirrorOption(dirpath, function (options){
        dropboxClient.authenticate(function (error, client) {
            if (error) { throw error; }

            new ItemMirror(options, function (error, itemMirrorCase) {
                if(error){ throw error; }

                itemMirrorCase.listAssociations(function (error, associations){
                //objext[] = {_GUID, _GUID}
                    for (var i = 0; i < associations.length; i++) {
                        itemMirrorCase.getAssociationDisplayText( associations[i],  function (error , filename) {
                            if(error) { throw error; }
                            if (inputtext == filename) {
                                flag = false;
                            } else{ };
                        });
                    }

                    callback(flag);
                });
            });
        });
    });
}

/*get username from dropbox client*/
function getUserName(){
    dropboxClient.authenticate(function (error, client) {
        if (error) { throw error; }
        //null is options setting for dropbox getUserInfo funtion
        client.getUserInfo(null, function(error, userInfo, userOptions){
            var username = userInfo.name;
            var useremail = userInfo.email;
            console.log(username);
        });
    });
}

/*load xml file from dirpath, if no xml file generate new one*/
function loadXooml(dirpath) {
    setItemMirrorOption(dirpath, function (options) {
        dropboxClient.authenticate(function (error, client) {
        if (error) { throw error; }

            new ItemMirror(options, function (error, itemMirrorCase) {
                if(error){ throw error; }
            
                var GUIDS = []; /* guid arrary*/
                var files = []; /* filename displaytext array*/
                itemMirrorCase.listAssociations(function (error, associations){
                //objext[] = {_GUID, _GUID}
                    if(associations.length == 0){
                        return "";
                    }
                    for (var i = 0; i < associations.length; i++) {
                        GUIDS.push(associations[i]);
                        itemMirrorCase.getAssociationDisplayText( associations[i],  function (error , filename) {
                            if(error) { throw error; }
                            files.push(filename);
                            console.log(filename);
                            //display filename on webpage
                        });
                    }
                });
            });
        });
    });
}


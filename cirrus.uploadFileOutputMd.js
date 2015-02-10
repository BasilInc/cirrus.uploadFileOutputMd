angular.module('cirrus.uploadFileOutputMd')
  .directive('uploadFileOutputMd', ['$upload', '$timeout', function($upload, $timeout){
    return {
      scope : {
        comment        : '=',
        files          : '=',
        error          : '='
      },
      link : function(scope, elem, attr) {
        scope.$watch('files', function(newVal, oldVal){

          _.each(scope.files, function(file){
            var isImage = scope.checkIfImage(file);

            // File must be image: error checking here
            if(isImage === -1){
              scope.error = true;
              $timeout(function(){ scope.error = false;}, 4000);
              // Reset 
              scope.files = [];
            }
            // If file is image, continue
            else {
              $upload.upload({
                url      : '/api/stories/uploadFileOnComment',
                file     : file,
                progress : function(e){}
              }).then(function(data, status, headers, config){
                // Data returned successfully 
                var imgUrlMd = '![](' + data.data + ')';
                // Conditions below determine insert location based on caret/content 
                if(scope.comment === '' || scope.comment === undefined){
                  scope.comment = scope.comment += imgUrlMd;
                }
                else {
                  var isEmpty = scope.checkIfLineIsEmpty(elem[0]);
                  // if the character before the cursor is a line break, insert image at the cursor             
                  if(isEmpty){ scope.comment = scope.insertAtCaret(elem[0], imgUrlMd); }
                  // if not, add a line break, then insert image at the cursor
                  else { scope.comment = scope.insertAtCaret(elem[0], "\n" + imgUrlMd); }
                }
                // Reset 
                scope.files = [];
              });

            }
          });
        });

        scope.checkIfImage = function(file){
          var validImageTypes = ['jpg', 'jpeg', 'png', 'gif'];
          var fileName = file.name;
          var re       = /(?:\.([^.]+))?$/;
          var fileExt  = re.exec(fileName)[1];
          var isImage  = validImageTypes.indexOf(fileExt.toLowerCase());  
          return isImage;
        };

        scope.checkIfLineIsEmpty = function(textarea){
          if(textarea.value.substr(0,textarea.selectionStart).match(/(?:^|\n|\r)\s*$/)
           && textarea.value.substr(textarea.selectionStart).match(/^\s*(?:\n|\r|$)/)) {
            return true;
          } else {
            return false;
          }
        };

        scope.insertAtCaret = function(elem, text){

          var txtarea   = elem;
          var scrollPos = txtarea.scrollTop;
          var strPos    = 0;
          var br        = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
              "ff" : (document.selection ? "ie" : false ) );

          if (br == "ie") { 
              txtarea.focus();
              var range = document.selection.createRange();
              range.moveStart ('character', -txtarea.value.length);
              strPos = range.text.length;
          }
          else if (br == "ff") strPos = txtarea.selectionStart;

          var front = (txtarea.value).substring(0,strPos);  
          var back  = (txtarea.value).substring(strPos,txtarea.value.length); 
          
          txtarea.value = front+text+back;
          strPos        = strPos + text.length;
          
          if (br == "ie") { 
              txtarea.focus();
              var range = document.selection.createRange();
              range.moveStart ('character', -txtarea.value.length);
              range.moveStart ('character', strPos);
              range.moveEnd ('character', 0);
              range.select();
          }
          else if (br == "ff") {
              txtarea.selectionStart = strPos;
              txtarea.selectionEnd = strPos;
              txtarea.focus();
          }
          txtarea.scrollTop = scrollPos;

          // Return the value of the text area after inserting
          return txtarea.value;
        };
      }
    };
  }]);
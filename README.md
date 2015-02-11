An Angular.js directive that uploads file and outputs markdown inline image   
Requires `angular-file-upload` (https://github.com/danialfarid/angular-file-upload) for file uploading portion

## Installation 

`bower install https://github.com/CirrusCPQ/cirrus.uploadFileOutputMd.git --save`

## Usage

Configure upload url using factory/provider

```angular.module('cirrus.uploadFileOutputMd').factory('uploadData', function(){
  return {
    url : '/upload/url'
  }
});```

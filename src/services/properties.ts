import fs = require('fs');

let propsFile = '/var/atc/ts-api.json';
let localPropsFile='../../properties.sample.json';
let props:any = null;

if(fs.existsSync(propsFile))
  props = require(propsFile);
else{
  props = require(localPropsFile);
}

export const properties = props;

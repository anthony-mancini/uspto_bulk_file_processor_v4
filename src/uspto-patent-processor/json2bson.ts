/**
 * @file This file contains code used to convert a local cache of processed
 * USPTO JSON files into BSON files. 
 * 
 * @author Anthony Mancini
 * @version 2.0.0
 * @license AGPLv3
 */


import * as fs from 'fs';
import * as path from 'path';
import * as BSON from 'bson';
import * as chalk from 'chalk';
import { 
  UsptoPatentData
} from './interfaces';


/**
 * Converts all of the USPTO JSON files in a specified directory into the BSON
 * format. 
 * 
 * @param localUsptoJsonDir a local directory containing USPTO JSON parsed data.
 * @param localUsptoBsonDir a local directory where the converted USPTO BSON 
 * data will be stored after the conversion.
 */
export function convertLocalUpstoJsonDirToBson(
  localUsptoJsonDir: string = path.join(__dirname, 'uspto_json_data'),
  localUsptoBsonDir: string = path.join(__dirname, 'uspto_bson_data'),
) : void {

  // Creating the USPTO BSON directory if one does not already exist
  if (!fs.existsSync(localUsptoBsonDir)) {
    fs.mkdirSync(localUsptoBsonDir);
  }

  // Getting an array of all the files in provided directory
  let localUsptoJsonPatentFilePaths: string[] = fs.readdirSync(localUsptoJsonDir)
    .map((fileName: string) => path.join(localUsptoJsonDir, fileName));

  // Looping through each of the files and performing the conversion from 
  // JSON to BSON
  for (let localUsptoJsonPatentFilePath of localUsptoJsonPatentFilePaths) {
    // Reading the USPTO JSON file and converting it to a string
    let usptoPatentJsonBuffer: Buffer = fs.readFileSync(localUsptoJsonPatentFilePath);
    let usptoPatentJson: string = usptoPatentJsonBuffer.toString();

    // Parsing the JSON data into a JS object
    let usptoPatentObject: UsptoPatentData = JSON.parse(usptoPatentJson);
    
    // Serializing the JSON object into a BSON object
    let usptoPatentBson: Buffer;
    try {
      usptoPatentBson = BSON.serialize(usptoPatentObject);
    } catch (err) {
      continue;
    }
    
    // Creating a file name to store the serialized BSON data, and creating a
    // file path
    let usptoBsonFileName: string = path.basename(localUsptoJsonPatentFilePath)
      .split('.')[0]
      + '.bson';

    let usptoBsonFilePath: string = path.join(localUsptoBsonDir, usptoBsonFileName);

    // Writing the BSON data to the local directory
    fs.writeFileSync(usptoBsonFilePath, usptoPatentBson);

    // Displaying a message to the user to let them know that the conversion was
    // successful and that the file was saved
    console.log(chalk.greenBright(`Successfully converted JSON data, file saved at: ${usptoBsonFilePath}`));
  }
}


/*
 * If this module is run as a script, the JSON to BSON conversion function will
 * be run. When running this code as an imported library, the conversion will not
 * occur until called by the developer. 
 */
if (require.main === module) {
  convertLocalUpstoJsonDirToBson();
}
/**
* @file This file contains the main class for processing bulk USPTO Red Book
* patent grant files. The file can either be used as a module within other
* source files or as a script using the default values for the 
* UsptoPatentProcessor class. If used as a script, a ".env" file must be
* specified with the connection string to the MongoDB database where this
* data will be stored after being fetched and processed. 
* 
* @author Anthony Mancini
* @version 2.0.0
* @license AGPLv3
*/

import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';
import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import * as AdmZip from 'adm-zip';
import { IZipEntry } from 'adm-zip';
import { DateTime } from 'luxon';
import * as dotenv from 'dotenv';
import { Connection } from 'mongoose';
import { 
  UsptoPatentData,
  UsptoPatentProcessorOptions,
} from './interfaces';
import * as converters from './converters';
import { MongoProcessor } from './mongodb';

dotenv.config();


/**
 * An class used to perform the core patent processing functionality. This 
 * class contains code that will fetch bulk Red Book grant patent files, parse
 * out the data from these files depending on the format, and store the data
 * in mulitple possible locations, including locally, remotely, and within a 
 * MongoDB database.
 * 
 * @author Anthony Mancini
 * @version 2.0.0
 * @license AGPLv3
 */
export class UsptoPatentProcessor {

  /**
   * The starting date of the bulk patent files that will be fetched.
   */
  private readonly startDate: DateTime = DateTime.local(
    1985, // Starting year.
    1,    // Starting month.
    1,    // Starting day. 
  );

  /**
   * The ending date for of the bulk patent files that will be fetched. The 
   * ending date is inclusive (if, for example, the value is 2000-01-01, then
   * this date will be the last date data wil be fetched).
   */
  private readonly endDate: DateTime = DateTime.local();

  /**
   * The file path to a file that contains a JSON array of patent numbers
   * that will act as a filter to newly fetched patent data.
   */
  private readonly patentAllowListFilePath: string;

  /**
   * An array of patent numbers that will be used to filter out fetched data
   * from the USPTO patent data.
   */
   private readonly patentFilteringArray: string[];

  /**
   * The path to a local directory where unprocessed XML data will be stored. If 
   * set to null, no files will be cached locally.
   */
  private readonly localUsptoXmlDir: string = path.join(__dirname, 'uspto_xml_data');

  /**
   * The path to a local directory where processed JSON data will be stored. If 
   * set to null, no files will be cached locally.
   */
  private readonly localUsptoJsonDir: string = path.join(__dirname, 'uspto_json_data');

  /**
   * The connection string to the MongoDB database where the data will be 
   * stored. If no connection string is provided, then the value will be pulled
   * from a ".env" file with the key "CONNECTION_STRING".
   */
  private readonly mongoDBConnectionString: string = process.env.CONNECTION_STRING !== undefined 
    ? process.env.CONNECTION_STRING 
    : null;

  private mongoDBDatabase: MongoProcessor;

  /**
   * The constructor function of the UsptoPatentProcessor class.
   * 
   * @param options a set of options that can be used with the 
   * UsptoPatentProcessor class.
   * 
   * @author Anthony Mancini
   * @version 2.0.0
   * @license AGPLv3
   */
  constructor(
    options: UsptoPatentProcessorOptions = {},
  ) {
    
    // Setting all of the properties in the class, checking first to see if no
    // argument was provided and if so using the default values for each of the
    // properties 
    if (options.startDate !== undefined) {
      this.startDate = options.startDate;
    }

    if (options.endDate !== undefined) {
      this.endDate = options.endDate;
    }

    if (options.patentAllowListFilePath !== undefined) {
      this.patentAllowListFilePath = options.patentAllowListFilePath;

      const patentAllowListFileBuffer: Buffer = fs.readFileSync(this.patentAllowListFilePath);
      const patentAllowListFileContents: string = patentAllowListFileBuffer.toString();
      const patentFilteringArray: string[] = JSON.parse(patentAllowListFileContents);

      this.patentFilteringArray = patentFilteringArray;
    }

    if (options.localUsptoXmlDir !== undefined) {
      this.localUsptoXmlDir = options.localUsptoXmlDir;
    }

    if (options.localUsptoJsonDir !== undefined) {
      this.localUsptoJsonDir = options.localUsptoJsonDir;
    }

    if (options.mongoDBConnectionString !== undefined) {
      this.mongoDBConnectionString = options.mongoDBConnectionString;
    }
  }


  /**
   * The core method of the UsptoPatentProcessor class used to fetch and 
   * process all of the bulk USPTO Red book patent grant files.
   * 
   * @author Anthony Mancini
   * @version 2.0.0
   * @license AGPLv3
   */
  private async fetchAndProcessBulkUsptoZipFiles() : Promise<void> {

    // Creating the connection to the MongoDB database
    this.mongoDBDatabase = new MongoProcessor(this.mongoDBConnectionString);
    await this.mongoDBDatabase.connect();
    
    // Getting the starting and ending year from the starting and ending
    // date
    const startYear: number = this.startDate.year;
    const endYear: number = this.endDate.year;

    // For each year starting with the startYear and ending at the endYear, 
    // fetching the link page for that year and using the page to get all of
    // the links to the compressed archive files
    for (let year = endYear; year >= startYear; year--) {
      // Creating the URL and fetching the HTML content
      let usptoBulkDataYearUrl: string = `https://bulkdata.uspto.gov/data/patent/grant/redbook/fulltext/${year}`;
      let usptoYearResponse: AxiosResponse = await axios.get(usptoBulkDataYearUrl);

      // Displaying a message to the user that the page was fetched if 
      // sucessful, otherwise an error message is displayed
      if (usptoYearResponse.status !== 200) {
        console.log(chalk.redBright(`Failed to fetch: ${usptoBulkDataYearUrl}`));
      }

      // If the fetch was sucessful, continue the fetching and processing
      if (usptoYearResponse.status === 200) {
        console.log(chalk.greenBright(`Successfully fetched: ${usptoBulkDataYearUrl}`))

        // Creating a JQuery root to parse out the Zip file links
        let html: string = usptoYearResponse.data;
        let $: cheerio.Root = cheerio.load(html);
        
        // Getting all of the links for the current USPTO year archive
        let usptoZipFileNames: string[] = $('.container table tr').get()
          .filter((node: any) => {
            // Removing any table rows that do not a file link
            return node.children[0].children[0].name === 'a';
          })
          .map((node: any) => {
            let fileName: string = node.children[0].children[0].attribs.href;
            let fileDate: string = $(node.children[2].children[0]).html().split(' ')[0];

            return {
              fileName,
              fileDate,
            };
          })
          .filter((fileDetails: any) => {
            // Removing any file that is not within the specified date range
            let fileDate: DateTime = DateTime.fromFormat(fileDetails.fileDate, 'yyyy-MM-dd');
            let isInDateRange: boolean = fileDate >= this.startDate && fileDate <= this.endDate;

            return isInDateRange;
          })
          .map((fileDetails: any) => {
            // Returning only the file name as the date is no longer needed
            return fileDetails.fileName;
          })
          .filter((fileName: string) => {
            // Removing any file that is not a zip file
            return fileName.toLowerCase().endsWith('.zip');
          })
          .filter((fileName: string) => {
            // Removing all supplemental files
            return !fileName.toLowerCase().includes('-supp.zip');
          })
          .filter((fileName: string) => {
            // Removing all DTD files
            return !fileName.toLowerCase().includes('dtd.zip');
          });

        // For each of the links, fetching the respective Zip file and 
        // processing the data using different processors depending on the
        // format of the data file
        for (let usptoZipFileName of usptoZipFileNames) {
          let usptoZipFileLink: string = usptoBulkDataYearUrl + '/' + usptoZipFileName;

          // Fetching the zip file with the bulk USPTO patent data
          let usptoZipFileResponse: AxiosResponse = await axios.get(usptoZipFileLink, {
              responseType: 'arraybuffer',
          });

          // Displaying a message to the user that the USPTO patent data
          // was successfully fetched
          console.log(chalk.greenBright(`  Successfully fetched zip file: ${usptoZipFileLink}`));
      
          // Getting the contents of the fetch and extracting the bulk file
          // from the zip file
          let usptoZipFileContents: Buffer = usptoZipFileResponse.data;
          let usptoZipFile: AdmZip = new AdmZip(usptoZipFileContents);
          let usptoEntryFiles: IZipEntry[] = usptoZipFile.getEntries();
          let usptoEntryFile: IZipEntry = usptoEntryFiles[0];
          let usptoEntryFileName: string = usptoEntryFile.name;
          let usptoEntryBuffer: Buffer = usptoEntryFile.getData();

          // Running the data processing function to process the bulk data
          await this.processAndSaveUsptoData(
            usptoZipFileName, 
            usptoEntryFileName,
            usptoEntryBuffer
          );

          // Displaying a message to the user that the USPTO patent data
          // was successfully processed and saved
          console.log(chalk.greenBright(`  Successfully processed and saved: ${usptoZipFileLink}`));
        }
      }
    }

    await this.mongoDBDatabase.close();
  }


  /**
   * Saves a file to a local directory. If the specified directory does not
   * exist, creates the directory.
   * 
   * @param directory the name of the directory that the file wil be saved to.
   * @param fileName the name of the file that will be saved.
   * @param contents the contents of the file.
   * 
   * @author Anthony Mancini
   * @version 2.0.0
   * @license AGPLv3
   */
  private saveToLocalDirectory(
    directory: string,
    fileName: string, 
    contents: Buffer,
  ) : void {

    // If the directory provided is not null, creating a local directory (if 
    // one does not exist) and saving the file to the local directory.
    if (directory !== null) {
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }

      // Saving the file if it doesn't already exist
      let filePath: string = path.join(directory, fileName);

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, contents);
      }
    }
  }


  /**
   * Processes and saves a single USPTO bulk file. This method can handle 
   * multiple formats of bulk USPTO Red Book grant bulk files, and contains
   * parsers for bulk data going back to 1980 bulk data files.
   * 
   * @param usptoZipFileName the name of the USPTO bulk zip file.
   * @param usptoEntryFileName the name of the entry file extracted from the 
   * zip file.
   * @param usptoEntryFileBuffer the contents of the extracted entry file.
   * 
   * @author Anthony Mancini
   * @version 2.0.0
   * @license AGPLv3
   */
  private async processAndSaveUsptoData(
    usptoZipFileName: string,
    usptoEntryFileName: string,
    usptoEntryFileBuffer: Buffer,
  ) : Promise<void> {

    // Saving the XML file in multiple locations depending on the details
    // specified in the constructor
    
    // Saving to local directories
    if (!(this.localUsptoXmlDir === undefined || this.localUsptoXmlDir === null)) {
      this.saveToLocalDirectory(this.localUsptoXmlDir, usptoEntryFileName, usptoEntryFileBuffer);
    }

    if (!(this.localUsptoJsonDir === undefined || this.localUsptoJsonDir === null)) {
      this.saveToLocalDirectory(this.localUsptoXmlDir, usptoEntryFileName, usptoEntryFileBuffer);
    }

    // Reading the bulk XML file, and parsing out all of the patents, and
    // processing the data into a JS structure
    let usptoData: string = usptoEntryFileBuffer.toString();
    let usptoProcessedData: UsptoPatentData[];

    // Running different parsers on the data depending on the format of the 
    // data provided
    if (usptoZipFileName.substr(0, 3) === 'ipg') {
      usptoProcessedData = await converters.convertUsptoVersion4XmlDataToJs(usptoData);
    } else if (usptoZipFileName.substr(0, 3) === 'pg0') {
      usptoProcessedData = await converters.convertUsptoVersion2XmlDataToJs(usptoData);
    } else if (usptoZipFileName.substr(0, 6) === 'pftaps') {
      usptoProcessedData = await converters.convertUsptoPftapsDataToJs(usptoData);
    }

    // If a patent filtering file is provided, filtering out any patents that are
    // not included in the filtering file data.
    let filteredUsptoProcessedData: UsptoPatentData[] = usptoProcessedData
      .filter((usptoData: UsptoPatentData) => {
        return this.patentFilteringArray.includes(usptoData.patent_number);
      })
    
    // Saving the JSON file if an JSON directory is specified in the constructor,
    // otherwise no file is saved.
    let usptoJsonFileName: string = usptoEntryFileName.split('.')[0] + '.json';
    let usptoJsonBuffer: Buffer = Buffer.from(JSON.stringify(usptoProcessedData));

    if (!(this.localUsptoJsonDir === undefined || this.localUsptoJsonDir === null)) {
      this.saveToLocalDirectory(this.localUsptoJsonDir, usptoJsonFileName, usptoJsonBuffer);
    }

    // Saving the processed data to the MongoDB database if a connection string
    // was specified in the constructor or .env file 
    if (!(this.mongoDBConnectionString === undefined || this.mongoDBConnectionString === null)) {
      await this.mongoDBDatabase.saveProcessedDataToMongoDB(usptoProcessedData);
      await this.mongoDBDatabase.saveFilteredDataToMongoDB(filteredUsptoProcessedData);
    }
  }


  /**
   * A public function used to run the entire fetching, parsing, and processing
   * operation.
   * 
   * @author Anthony Mancini
   * @version 2.0.0
   * @license AGPLv3
   */
  public async run() : Promise<void> {
    await this.fetchAndProcessBulkUsptoZipFiles();
  }
}

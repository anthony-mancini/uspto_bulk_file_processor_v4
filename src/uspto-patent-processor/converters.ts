/**
 * @file This file contains the converters used to convert different USPTO bulk
 * patent file formats into a single JavaScript object format.
 * 
 * @author Anthony Mancini
 * @version 4.0.0
 * @license AGPLv3
 */

import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { Parser as XmlParser } from 'xml2js';
import * as striptags from 'striptags';
import { 
  UsptoPatentData,
} from './interfaces';


/**
 * Converts Version 4 of USPTO Red Book Grant bulk XML data into a JavaScript
 * Object format.
 * 
 * @param xmlData the Version 4 of the bulk Red Book grant data.
 * @returns an array of patent data in the UsptoPatentSchemaData format.
 * 
 * @author Anthony Mancini
 * @version 3.0.0
 * @license AGPLv3
 */
export async function convertUsptoVersion4XmlDataToJs(
  xmlData: string,
) : Promise<UsptoPatentData[]> {

  // Parsing out all of the patent XML sections
  let patentXmlSectionRegularExpression: RegExp = /[<]us-patent-grant\s.*?[<][/]us-patent-grant[>]/gmis; 
  let patentXmlSections: string[] = xmlData.match(patentXmlSectionRegularExpression);

  // Creating an array of all the patent data in the bulk XML file
  let usptoBulkPatentData: UsptoPatentData[] = [];

  // For each patent section, creating an XML to JavaScript Object parser and
  // parsing the data into a UsptoPatentData structure. After the structure is
  // created, it is added to an array of all the UsptoPatentData
  for (let patentXmlSection of patentXmlSections) {
    let xmlParser: XmlParser = new XmlParser();
    let parsedPatentData: any = await xmlParser.parseStringPromise(patentXmlSection);

    // Creating the UsptoPatentData structure from the 
    let processedPatentData: any = {}

    // The patent application number
    try {
      // Getting the patent number
      processedPatentData.patent_number = parsedPatentData
        ['us-patent-grant']
        ['us-bibliographic-data-grant'][0]
        ['publication-reference'][0]
        ['document-id'][0]
        ['doc-number'][0];
      
      // Trimming any leading zeros from the patent number
      processedPatentData.patent_number = _.trimStart(processedPatentData.patent_number, '0');
    } catch (parsingError) {
      processedPatentData.patent_number = null;
    }

    // The expiration date of the patent. Keep this value null to satisfy the
    // interface required in otther code repositories, but implement the logic
    // if needed by other repositories in the future
    try {
      processedPatentData.expiration_date = null;
    } catch (parsingError) {
      processedPatentData.expiration_date = null;
    }

    // The date the patent was published
    try {
      // Getting the patent published date
      processedPatentData.published_date = parsedPatentData
        ['us-patent-grant']
        ['$']
        ['date-publ'];

      // Converting the date into "YYYY-MM-DD" format
      processedPatentData.published_date = DateTime
        .fromFormat(processedPatentData.published_date, 'yyyyMMdd')
        .toFormat('yyyy-MM-dd');
    } catch (parsingError) {
      processedPatentData.published_date = null;
    }

    // A list of patent application numbers. Keep this value null to satisfy the
    // interface required in otther code repositories, but implement the logic
    // if needed by other repositories in the future
    try {
      processedPatentData.application_numbers = null;
    } catch (parsingError) {
      processedPatentData.application_numbers = null;
    }

    // A listing of the generic claim of the patent as well as the 
    // individual claims.
    try {
      // Parsing out the individual claim XML sections
      let claimXmls: string[] = patentXmlSection.match(/[<]claim.*?[>].*?[<][/]claim[>]/gms);
      let claimData: {
        claim_number: string,
        claim_text: string,
      }[] = [];

      // For each section, getting the claim text and claim number
      for (let claimXml of claimXmls) {
        let claimText: string = striptags(claimXml).trim();
        let claimNumber: string = claimXml.match(/num[=]"[0-9]*?"/gms)
          .shift()
          .split('"')[1];

        // Removing any leading zeros from the claim number
        claimNumber = _.trimStart(claimNumber, '0');

        // Adding the claim data to an array of all claims
        claimData.push({ 
          claim_number: claimNumber, 
          claim_text: claimText,
        });
      }

      processedPatentData.claims = claimData;
    } catch (parsingError) {
      processedPatentData.claims = null;
    }

    // The formal title of the invention prescribed in the patent
    try {
      processedPatentData.invention_title = parsedPatentData['us-patent-grant']['us-bibliographic-data-grant'][0]['invention-title'][0]['_']
    } catch (parsingError) {
      processedPatentData.invention_title = null;
    }

    usptoBulkPatentData.push(processedPatentData);
  }

  return usptoBulkPatentData;
}


/**
 * Converts Version 2 of USPTO Red Book Grant bulk XML data into a JavaScript
 * Object format.
 * 
 * @param xmlData the Version 2 of the bulk Red Book grant data.
 * @returns an array of patent data in the UsptoPatentSchemaData format.
 * 
 * @author Anthony Mancini
 * @version 3.0.0
 * @license AGPLv3
 */
export async function convertUsptoVersion2XmlDataToJs(
  xmlData: string,
) : Promise<UsptoPatentData[]> {

  // Parsing out all of the patent XML sections
  let patentXmlSectionRegularExpression: RegExp = /[<]PATDOC\s.*?[<][/]PATDOC[>]/gmis; 
  let patentXmlSections: string[] = xmlData.match(patentXmlSectionRegularExpression);

  // Creating an array of all the patent data in the bulk XML file
  let usptoBulkPatentData: UsptoPatentData[] = [];

  // For each patent section, creating an XML to JavaScript Object parser and
  // parsing the data into a UsptoPatentData structure. After the structure is
  // created, it is added to an array of all the UsptoPatentData
  for (let patentXmlSection of patentXmlSections) {
    let xmlParser: XmlParser = new XmlParser();
    let parsedPatentData: any;

    // On rare occasions, the Version 2 of the USPTO patent data is not well formatted,
    // and even after corrections fails parsing. In these cases, simply return a
    // blank patent processed object. Note that Version 4 of the data has improved
    // formatting, so this error correction step is omitted in the Version 4 converter
    try {
      parsedPatentData = await xmlParser.parseStringPromise(patentXmlSection.replace(/[&][a-zA-Z0-9]*?[;]/gmi, ''));
    } catch (patentProcessingError) {
      return [{
        patent_number: null,
        expiration_date: null,
        published_date: null,
        application_numbers: null,
        claims: null,
        invention_title: null,
      }];
    }

    // Creating the UsptoPatentData structure from the 
    let processedPatentData: any = {};

    // The patent application number
    try {
      // Getting the patent application number
      processedPatentData.patent_number = parsedPatentData
        ['PATDOC']
        ['SDOBI'][0]
        ['B100'][0]
        ['B110'][0]
        ['DNUM'][0]
        ['PDAT'][0];

      // Removing any leading zeros from the patent number
      processedPatentData.patent_number = _.trimStart(processedPatentData.patent_number, '0');
    } catch (parsingError) {
      processedPatentData.patent_number = null;
    }

    // The expiration date of the patent. Keep this value null to satisfy the
    // interface required in otther code repositories, but implement the logic
    // if needed by other repositories in the future
    try {
      processedPatentData.expiration_date = null;
    } catch (parsingError) {
      processedPatentData.expiration_date = null;
    }

    // The date the patent was published
    try {
      processedPatentData.published_date = parsedPatentData
        ['PATDOC']
        ['SDOBI'][0]
        ['B200'][0]
        ['B220'][0]
        ['DATE'][0]
        ['PDAT'][0];
    } catch (parsingError) {
      processedPatentData.published_date = null;
    }

    // A list of patent application numbers. Keep this value null to satisfy the
    // interface required in otther code repositories, but implement the logic
    // if needed by other repositories in the future
    try {
      processedPatentData.application_numbers = null;
    } catch (parsingError) {
      processedPatentData.application_numbers = null;
    }

    // A listing of the generic claim of the patent as well as the 
    // individual claims
    try {
      // Parsing out the individual claim XML sections
      let claimXmls: string[] = patentXmlSection.match(/[<]CL[>].*?[<][/]CL[>]/gms);
      let claimData: {
        claim_number: string,
        claim_text: string,
      }[] = [];

      // For each section, getting the claim text and claim number
      for (let claimXml of claimXmls) {
        let claimText: string = striptags(claimXml).trim();
        let claimNumber: string = claimXml.match(/ID[=]"CLM-[0-9]*?"/gms)
          .shift()
          .split('CLM-')[1]
          .split('"')[0];

        // Removing any leading zeros from the claim number
        claimNumber = _.trimStart(claimNumber, '0');

        // Adding the claim data to an array of all claims
        claimData.push({ 
          claim_number: claimNumber, 
          claim_text: claimText,
        });
      }

      processedPatentData.claims = claimData;
    } catch (parsingError) {
      processedPatentData.claims = null;
    }

    // The formal title of the invention prescribed in the patent
    try {
      processedPatentData.invention_title = parsedPatentData['PATDOC']['SDOBI'][0]['B500'][0]['B540'][0]['STEXT'][0]['PDAT'][0];
    } catch (parsingError) {
      processedPatentData.invention_title = null;
    }

    usptoBulkPatentData.push(processedPatentData);
  }

  return usptoBulkPatentData;
}


/**
 * Converts the Pftaps Version of USPTO Red Book Grant bulk TXT data into a JavaScript
 * Object format.
 * 
 * @param pftapsData the Pftaps Version of the bulk Red Book grant data.
 * @returns an array of patent data in the UsptoPatentSchemaData format.
 * 
 * @author Anthony Mancini
 * @version 3.0.0
 * @license AGPLv3
 */
export async function convertUsptoPftapsDataToJs(
  pftapsData: string,
) : Promise<UsptoPatentData[]> {

  let patentPftapsSectionRegularExpression: RegExp = /PATN\r\n/gm;
  let patentPftapsSections: string[] = pftapsData.split(patentPftapsSectionRegularExpression);
  patentPftapsSections = patentPftapsSections.slice(1);

  // Creating an array of all the patent data in the bulk XML file
  let usptoBulkPatentData: UsptoPatentData[] = [];

  // For each patent section, creating an XML to JavaScript Object parser and
  // parsing the data into a UsptoPatentData structure. After the structure is
  // created, it is added to an array of all the UsptoPatentData
  for (let patentPftapsSection of patentPftapsSections) {
    // Creating the UsptoPatentData structure from the 
    let processedPatentData: any = {};

    // The patent application number
    try {
      processedPatentData.patent_number = _.trimStart(patentPftapsSection.split('\r\n')
      .filter((section: string) => {
        return section.startsWith('PNO  ')
      })[0]
      .split('PNO  ')[1], '0');
    } catch (parsingError) {
      processedPatentData.patent_number = null;
    }

    // The expiration date of the patent. Keep this value null to satisfy the
    // interface required in otther code repositories, but implement the logic
    // if needed by other repositories in the future
    try {
      processedPatentData.expiration_date = null;
    } catch (parsingError) {
      processedPatentData.expiration_date = null;
    }

    // The date the patent was published
    try {
      processedPatentData.published_date = patentPftapsSection.split('\r\n')
        .filter((section: string) => {
          return section.startsWith('ISD  ')
        })[0]
        .split('ISD  ')[1];
    } catch (parsingError) {
      processedPatentData.published_date = null;
    }

    // A list of patent application numbers. Keep this value null to satisfy the
    // interface required in otther code repositories, but implement the logic
    // if needed by other repositories in the future
    try {
      processedPatentData.application_numbers = null;
    } catch (parsingError) {
      processedPatentData.application_numbers = null;
    }

    // A listing of the generic claim of the patent as well as the 
    // individual claims
    try {
      // Splitting each of the claim lines into individual string lines in an
      // array
      let claimLines: string[] = patentPftapsSection.split(/(CLMS|DCLM)\r\n/gm)
        .pop()
        .trim()
        .split('\r\n')

      // Creating an object that will hold the claim data
      let claimData: {
        claim_number: string,
        claim_text: string,
      }[] = [];

      // Setting the initial claim number and accumulated claim line
      let claimNumber: string = '1.';
      let accumulatedClaimLine: string = '';

      // Looping through each claim line and combining claims of the same claim
      // number together
      for (let claimLine of claimLines) {
        // Testing the line to check if it contains a claim number
        if (/^NUM\s{2}[0-9]{1,}[.]$/.test(claimLine)) {
          // If the line contains a claim number and there is no accumulated claim
          // yet, push the completed claim data to the claim data array
          if (accumulatedClaimLine !== '') {
            claimData.push({ 
              claim_number: _.trimEnd(claimNumber, '.').trim(),
              claim_text: accumulatedClaimLine.trim(),
            });
          }

          // Getting the claim number and setting the accumulated claim line
          // to a blank string
          claimNumber = claimLine.split('  ')[1].trim();
          accumulatedClaimLine = '';

          continue;
        }

        // Skipping any STM lines, as these do not contain claims
        if (/^STM\s{2}/.test(claimLine)) {
          continue;
        }

        // Adding to the accumulated claims by replacing the tags and trimming
        // the line
        accumulatedClaimLine += claimLine.replace(/(^PAR\s{2}[0-9]{1,}[.])|(^(PA1|PAR|PAL)\s{2})/, '').trim() + ' ';

        // If there is only a single claim line, pushing to data to the claim array
        if (claimLines.length === 1) {
          claimData.push({ 
            claim_number: _.trimEnd(claimNumber, '.').trim(),
            claim_text: accumulatedClaimLine.trim(),
          });
        }
      }

      // When all claims have been processed, setting the claim data
      processedPatentData.claims = claimData;
    } catch (parsingError) {
      processedPatentData.claims = null;
    }

    // The formal title of the invention prescribed in the patent
    try {
      processedPatentData.invention_title = patentPftapsSection.split('\r\n')
        .filter((section: string) => {
          return section.startsWith('TTL  ')
        })[0]
        .split('TTL  ')[1];
    } catch (parsingError) {
      processedPatentData.invention_title = null;
    }

    usptoBulkPatentData.push(processedPatentData);
  }

  return usptoBulkPatentData;
}

/**
 * @file This file contains interfaces used throughout the other modules to
 * represent function options and patent data shapes.
 * 
 * @author Anthony Mancini
 * @version 2.0.0
 * @license AGPLv3
 */


import { DateTime } from 'luxon';


/**
 * An interface to represent the options the UsptoPatentProcessor can take in
 * its constructor function.
 */
export interface UsptoPatentProcessorOptions {
  startDate?: DateTime,
  endDate?: DateTime,
  fileLimit?: number,
  usptoSyncFilePath?: string,
  patentAllowListFilePath?: string,
  localUsptoXmlDir?: string,
  localUsptoJsonDir?: string,
  remoteUsptoXmlDir?: string,
  remoteUsptoJsonDir?: string,
  mongoDBConnectionString?: string,
}


/**
 * An interface to represent processed USPTO patent data from the XML files.
 */
 export interface UsptoPatentData {
  patent_number: string,
  expiration_date: string,
  published_date: string,
  application_numbers: string[],
  claims: {
    claim_number: string,
    claim_text: string,
  }[],
  invention_title: string,
}

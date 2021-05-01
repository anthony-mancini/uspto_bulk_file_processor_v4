/**
 * @file This file unit tests for the USPTO patent converter code for Version 2
 * of the USPTO patent data.
 * 
 * @author Anthony Mancini
 * @version 3.0.0
 * @license AGPLv3
 */

import * as fs from 'fs';
import * as path from 'path';
import test from 'ava';
import {
  UsptoPatentData,
  convertUsptoVersion2XmlDataToJs,
} from '../uspto-patent-processor/index';


/**
 * Setting up a test context to be used in all of the tests in this module
 */
test.before(async (avaTest: any) => {
  // Getting the sample data from the sample data folder
  const usptoVersion2FilePath: string = path.join(__dirname, '../../samples/usptoVersion2.xml');
  const usptoVersion2DataSample: string = fs.readFileSync(usptoVersion2FilePath).toString();

  // Converting the sample data into a unified format
  const usptoVersion2DataArray: UsptoPatentData[] = await convertUsptoVersion2XmlDataToJs(usptoVersion2DataSample);

  // Getting the first value from the array as there is only a single patent sample within the
  // sample file
  const usptoVersion2Data: UsptoPatentData = usptoVersion2DataArray.pop();

  // Checking that the values in the sample data match the expected values
  const usptoVersion2ActualData: UsptoPatentData = usptoVersion2Data;

  avaTest.context.usptoActualData = usptoVersion2ActualData;
});


/**
 * This test checks that the patent_number value has been parsed correctly
 */
test('Testing USPTO Version 2 Converter Value: patent_number', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.patent_number;
  const usptoExpectedValue: string = 'D0468073';

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the expiration_date value has been parsed correctly
 */
test('Testing USPTO Version 2 Converter Value: expiration_date', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.expiration_date;
  const usptoExpectedValue: string = null;

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the published_date value has been parsed correctly
 */
test('Testing USPTO Version 2 Converter Value: published_date', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.published_date;
  const usptoExpectedValue: string = '20010606';

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the application_numbers value has been parsed correctly
 */
test('Testing USPTO Version 2 Converter Value: application_numbers', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.application_numbers;
  const usptoExpectedValue: string = null;

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the claims value has been parsed correctly
 */
test('Testing USPTO Version 2 Converter Value: claims', async (avaTest: any) => {

  const usptoActualValue: number = avaTest.context.usptoActualData.claims.length;
  const usptoExpectedValue: number = 1;

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the invention_title value has been parsed correctly
 */
test('Testing USPTO Version 2 Converter Value: invention_title', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.invention_title;
  const usptoExpectedValue: string = 'Popcorn ice cream';

  avaTest.true(usptoActualValue === usptoExpectedValue);
});

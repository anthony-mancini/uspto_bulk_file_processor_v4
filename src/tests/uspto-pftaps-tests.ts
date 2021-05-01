/**
 * @file This file unit tests for the USPTO patent converter code for the Pftaps version
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
  convertUsptoPftapsDataToJs,
} from '../uspto-patent-processor/index';


/**
 * Setting up a test context to be used in all of the tests in this module
 */
test.before(async (avaTest: any) => {
  // Getting the sample data from the sample data folder
  const usptoPftapsFilePath: string = path.join(__dirname, '../../samples/usptoPftaps.txt');
  const usptoPftapsDataSample: string = fs.readFileSync(usptoPftapsFilePath).toString();

  // Converting the sample data into a unified format
  const usptoPftapsDataArray: UsptoPatentData[] = await convertUsptoPftapsDataToJs(usptoPftapsDataSample);

  // Getting the first value from the array as there is only a single patent sample within the
  // sample file
  const usptoPftapsData: UsptoPatentData = usptoPftapsDataArray.pop();

  // Checking that the values in the sample data match the expected values
  const usptoPftapsActualData: UsptoPatentData = usptoPftapsData;

  avaTest.context.usptoActualData = usptoPftapsActualData;
});


/**
 * This test checks that the patent_number value has been parsed correctly
 */
test('Testing USPTO Pftaps Converter Value: patent_number', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.patent_number;
  const usptoExpectedValue: string = '3800358';

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the expiration_date value has been parsed correctly
 */
test('Testing USPTO Pftaps Converter Value: expiration_date', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.expiration_date;
  const usptoExpectedValue: string = null;

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the published_date value has been parsed correctly
 */
test('Testing USPTO Pftaps Converter Value: published_date', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.published_date;
  const usptoExpectedValue: string = '19940104';

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the application_numbers value has been parsed correctly
 */
test('Testing USPTO Pftaps Converter Value: application_numbers', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.application_numbers;
  const usptoExpectedValue: string = null;

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the claims value has been parsed correctly
 */
test('Testing USPTO Pftaps Converter Value: claims', async (avaTest: any) => {

  const usptoActualValue: number = avaTest.context.usptoActualData.claims.length;
  const usptoExpectedValue: number = 2;

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the invention_title value has been parsed correctly
 */
test('Testing USPTO Pftaps Converter Value: invention_title', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.invention_title;
  const usptoExpectedValue: string = 'Deburring apparatus';

  avaTest.true(usptoActualValue === usptoExpectedValue);
});

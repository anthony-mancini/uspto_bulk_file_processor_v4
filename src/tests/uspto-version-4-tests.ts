/**
 * @file This file unit tests for the USPTO patent converter code for Version 4
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
  convertUsptoVersion4XmlDataToJs,
} from '../uspto-patent-processor/index';


/**
 * Setting up a test context to be used in all of the tests in this module
 */
test.before(async (avaTest: any) => {
  // Getting the sample data from the sample data folder
  const usptoVersion4FilePath: string = path.join(__dirname, '../../samples/usptoVersion4.xml');
  const usptoVersion4DataSample: string = fs.readFileSync(usptoVersion4FilePath).toString();

  // Converting the sample data into a unified format
  const usptoVersion4DataArray: UsptoPatentData[] = await convertUsptoVersion4XmlDataToJs(usptoVersion4DataSample);

  // Getting the first value from the array as there is only a single patent sample within the
  // sample file
  const usptoVersion4Data: UsptoPatentData = usptoVersion4DataArray.pop();

  // Checking that the values in the sample data match the expected values
  const usptoVersion4ActualData: UsptoPatentData = usptoVersion4Data;

  avaTest.context.usptoActualData = usptoVersion4ActualData;
});


/**
 * This test checks that the patent_number value has been parsed correctly
 */
test('Testing USPTO Version 4 Converter Value: patent_number', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.patent_number;
  const usptoExpectedValue: string = '8282966';

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the expiration_date value has been parsed correctly
 */
test('Testing USPTO Version 4 Converter Value: expiration_date', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.expiration_date;
  const usptoExpectedValue: string = null;

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the published_date value has been parsed correctly
 */
test('Testing USPTO Version 4 Converter Value: published_date', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.published_date;
  const usptoExpectedValue: string = '2012-10-09';

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the application_numbers value has been parsed correctly
 */
test('Testing USPTO Version 4 Converter Value: application_numbers', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.application_numbers;
  const usptoExpectedValue: string = null;

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the claims value has been parsed correctly
 */
test('Testing USPTO Version 4 Converter Value: claims', async (avaTest: any) => {

  const usptoActualValue: number = avaTest.context.usptoActualData.claims.length;
  const usptoExpectedValue: number = 29;

  avaTest.true(usptoActualValue === usptoExpectedValue);
});


/**
 * This test checks that the invention_title value has been parsed correctly
 */
test('Testing USPTO Version 4 Converter Value: invention_title', async (avaTest: any) => {

  const usptoActualValue: string = avaTest.context.usptoActualData.invention_title;
  const usptoExpectedValue: string = 'Methods of reducing the risk of occurrence of pulmonary edema in children in need of treatment with inhaled nitric oxide';

  avaTest.true(usptoActualValue === usptoExpectedValue);
});

import { Command } from 'commander';
import {
  UsptoPatentProcessor,
  UsptoPatentProcessorOptions,
  UsptoPatentData,
  convertUsptoPftapsDataToJs,
  convertUsptoVersion2XmlDataToJs,
  convertUsptoVersion4XmlDataToJs
} from './uspto-patent-processor/index';
import { DateTime } from 'luxon';


/**
 * Running the patent processor using CLI commands if running the code as a script
 */
if (require.main === module) {
  (async () => {
    // Creating a new Commander CLI program
    const program = new Command();
    
    // Setting the program version number
    program.version('4.0.0');

    // Setting all of the available options for the program
    program
      .option('-s --start-date <value>', 'The starting date (inclusive) of the patent fetching process. The required date format is "YYYY-MM-DD".')
      .option('-e --end-date <value>', 'The ending date (inclusive) of the patent fetching process. The required date format is "YYYY-MM-DD".')
      .option('-f --patent-number-file <value>', 'The path to a JSON file with an array of patent numbers that will act as a filter when fetching patent data from the USPTO.')
      .option('-c --connection-string <value>', 'The connection string to the MongoDB database.')

    // Parsing all of the arguments from the program
    program.parse(process.argv);

    // Getting all of the options from the arguments
    const options = program.opts();

    // Creating the UsptoPatentProcessor and running the processor
    let usptoPatentProcessor: UsptoPatentProcessor = new UsptoPatentProcessor({
      patentAllowListFilePath: options.patentNumberFile,
      mongoDBConnectionString: options.connectionString,
      startDate: options.startDate ? DateTime.fromFormat(options.startDate, "yyyy-MM-dd") : options.startDate,
      endDate: options.endDate ? DateTime.fromFormat(options.endDate, "yyyy-MM-dd") : options.endDate,
    });

    // Running the patent processor with the provided command options
    await usptoPatentProcessor.run();
  })();
}


/**
 * Exporting the patent processor code when using the code as a library
 */
export {
  UsptoPatentProcessor,
  UsptoPatentProcessorOptions,
  UsptoPatentData,
  convertUsptoPftapsDataToJs,
  convertUsptoVersion2XmlDataToJs,
  convertUsptoVersion4XmlDataToJs
}
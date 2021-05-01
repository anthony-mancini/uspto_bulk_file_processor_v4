/**
 * @file This file contains the MongoDB code used to write all of the
 * processed USPTO patent data to a MongoDB database.
 * 
 * @author Anthony Mancini
 * @version 2.0.0
 * @license AGPLv3
 */

import { UsptoPatentData } from './interfaces';
import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';


/**
 * This class contains a processor used to connect to the patent database, store
 * all of the patent data in the patent database, and close the connection to the
 * database when no longer needed.
 */
export class MongoProcessor {
  /**
   * A connection string to the MongoDB database
   */
  private readonly connectionString: string;

  /**
   * The MongoDB database connection
   */
  private database: Connection;

  /**
   * A model representing USPTO patent data to store into the collection
   */
  private UsptoData: any;

  /**
   * A model representing USPTO filtered patent data to store into the collection
   */
  private UsptoFilteredData: any;


  /**
   * The constructor function for the MongoProcessor class
   * 
   * @param connectionString the connection string to the MongoDB database
   */
  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }


  /**
   * This method creates a connection to the MongoDB database and sets up the
   * schemas for the patent collections.
   * 
   * @author Anthony Mancini
   * @version 3.0.0
   * @license AGPLv3
   */
  async connect() {
    // Connecting to the MongoDB database
    await mongoose.connect(this.connectionString);
    
    // Getting the database from the connection
    this.database = mongoose.connection;
    
    // Checking for errors and printing an error message upon failed connections
    this.database.on('error', (err) => {
      console.log('Error connecting to the database, no data will be added. Check your connection string.');

      return;
    });

    // Creating a database schema for all of the claim data
    let ClaimSchema = new mongoose.Schema({
      claim_number: {
        type: String,
      },
      claim_text: {
        type: String,
      },
    });
    
    // Creating a database schema to represent USPTO patent data
    let UsptoDataSchema = new mongoose.Schema({
      patent_number: {
        type: String,
      },
      expiration_date: {
        type: String,
      },
      published_date: {
        type: String,
      },
      application_numbers: [
        {
          type: String,
        },
      ],
      claims: [
        ClaimSchema,
      ],
      invention_title: {
        type: String,
      },
    });
    
    // Creating a new USPTO patent model
    this.UsptoData = this.database.model('patent', UsptoDataSchema);
    this.UsptoFilteredData = this.database.model('filteredpatent', UsptoDataSchema);
  }
  

  /**
   * Saves an array of UsptoPatentSchemaData to the MongoDB database at a given
   * connection string.
   * 
   * @param usptoProcessedData an array of processed USPTO data from a bulk data
   * file.
   * 
   * @author Anthony Mancini
   * @version 3.0.0
   * @license AGPLv3
   */
  async saveProcessedDataToMongoDB(
    usptoProcessedData: UsptoPatentData[],
  ) : Promise<void> {

    // Adding all of the data to the MongoDB database
    for (let usptoProcessDataRow of usptoProcessedData) {

      // Creating a new UsptoData object for our MongoDB database
      let usptoData = new this.UsptoData({
        patent_number: usptoProcessDataRow.patent_number,
        expiration_date: usptoProcessDataRow.expiration_date,
        published_date: usptoProcessDataRow.published_date,
        application_numbers: usptoProcessDataRow.application_numbers,
        claims: usptoProcessDataRow.claims,
        invention_title: usptoProcessDataRow.invention_title,
      });

      // Saving the object to the database
      await usptoData.save();
    }    
  }


  /**
   * Saves an array of UsptoPatentSchemaData to the MongoDB database at a given
   * connection string.
   * 
   * @param usptoProcessedData an array of processed USPTO data from a bulk data
   * file.
   * 
   * @author Anthony Mancini
   * @version 3.0.0
   * @license AGPLv3
   */
   async saveFilteredDataToMongoDB(
    usptoProcessedData: UsptoPatentData[],
  ) : Promise<void> {

    // Adding all of the data to the MongoDB database
    for (let usptoProcessDataRow of usptoProcessedData) {

      // Creating a new UsptoData object for our MongoDB database
      let usptoFilteredData = new this.UsptoFilteredData({
        patent_number: usptoProcessDataRow.patent_number,
        expiration_date: usptoProcessDataRow.expiration_date,
        published_date: usptoProcessDataRow.published_date,
        application_numbers: usptoProcessDataRow.application_numbers,
        claims: usptoProcessDataRow.claims,
        invention_title: usptoProcessDataRow.invention_title,
      });

      // Saving the object to the database
      await usptoFilteredData.save();
    }    
  }


  /**
   * Closes the connection to the MongoDB database
   * 
   * @author Anthony Mancini
   * @version 1.0.0
   * @license AGPLv3
   */
  async close() {
    await this.database.close();
  }
}

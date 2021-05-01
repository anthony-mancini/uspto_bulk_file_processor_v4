[uspto_bulk_file_processor](../README.md) / [Exports](../modules.md) / UsptoPatentProcessor

# Class: UsptoPatentProcessor

Exporting the patent processor code when using the code as a library

## Table of contents

### Constructors

- [constructor](usptopatentprocessor.md#constructor)

### Properties

- [endDate](usptopatentprocessor.md#enddate)
- [localUsptoJsonDir](usptopatentprocessor.md#localusptojsondir)
- [localUsptoXmlDir](usptopatentprocessor.md#localusptoxmldir)
- [mongoDBConnectionString](usptopatentprocessor.md#mongodbconnectionstring)
- [mongoDBDatabase](usptopatentprocessor.md#mongodbdatabase)
- [patentAllowListFilePath](usptopatentprocessor.md#patentallowlistfilepath)
- [patentFilteringArray](usptopatentprocessor.md#patentfilteringarray)
- [startDate](usptopatentprocessor.md#startdate)

### Methods

- [fetchAndProcessBulkUsptoZipFiles](usptopatentprocessor.md#fetchandprocessbulkusptozipfiles)
- [processAndSaveUsptoData](usptopatentprocessor.md#processandsaveusptodata)
- [run](usptopatentprocessor.md#run)
- [saveToLocalDirectory](usptopatentprocessor.md#savetolocaldirectory)

## Constructors

### constructor

\+ **new UsptoPatentProcessor**(`options?`: [*UsptoPatentProcessorOptions*](../interfaces/usptopatentprocessoroptions.md)): [*UsptoPatentProcessor*](usptopatentprocessor.md)

The constructor function of the UsptoPatentProcessor class.

**`author`** Anthony Mancini

**`version`** 2.0.0

**`license`** AGPLv3

#### Parameters:

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | [*UsptoPatentProcessorOptions*](../interfaces/usptopatentprocessoroptions.md) | {} | a set of options that can be used with the UsptoPatentProcessor class. |

**Returns:** [*UsptoPatentProcessor*](usptopatentprocessor.md)

Defined in: uspto-patent-processor/uspto-patent-processor.ts:96

## Properties

### endDate

• `Private` `Readonly` **endDate**: *DateTime*

The ending date for of the bulk patent files that will be fetched. The
ending date is inclusive (if, for example, the value is 2000-01-01, then
this date will be the last date data wil be fetched).

Defined in: uspto-patent-processor/uspto-patent-processor.ts:61

___

### localUsptoJsonDir

• `Private` `Readonly` **localUsptoJsonDir**: *string*

The path to a local directory where processed JSON data will be stored. If
set to null, no files will be cached locally.

Defined in: uspto-patent-processor/uspto-patent-processor.ts:85

___

### localUsptoXmlDir

• `Private` `Readonly` **localUsptoXmlDir**: *string*

The path to a local directory where unprocessed XML data will be stored. If
set to null, no files will be cached locally.

Defined in: uspto-patent-processor/uspto-patent-processor.ts:79

___

### mongoDBConnectionString

• `Private` `Readonly` **mongoDBConnectionString**: *string*

The connection string to the MongoDB database where the data will be
stored. If no connection string is provided, then the value will be pulled
from a ".env" file with the key "CONNECTION_STRING".

Defined in: uspto-patent-processor/uspto-patent-processor.ts:92

___

### mongoDBDatabase

• `Private` **mongoDBDatabase**: *MongoProcessor*

Defined in: uspto-patent-processor/uspto-patent-processor.ts:96

___

### patentAllowListFilePath

• `Private` `Readonly` **patentAllowListFilePath**: *string*

The file path to a file that contains a JSON array of patent numbers
that will act as a filter to newly fetched patent data.

Defined in: uspto-patent-processor/uspto-patent-processor.ts:67

___

### patentFilteringArray

• `Private` `Readonly` **patentFilteringArray**: *string*[]

An array of patent numbers that will be used to filter out fetched data
from the USPTO patent data.

Defined in: uspto-patent-processor/uspto-patent-processor.ts:73

___

### startDate

• `Private` `Readonly` **startDate**: *DateTime*

The starting date of the bulk patent files that will be fetched.

Defined in: uspto-patent-processor/uspto-patent-processor.ts:50

## Methods

### fetchAndProcessBulkUsptoZipFiles

▸ `Private`**fetchAndProcessBulkUsptoZipFiles**(): *Promise*<void\>

The core method of the UsptoPatentProcessor class used to fetch and
process all of the bulk USPTO Red book patent grant files.

**`author`** Anthony Mancini

**`version`** 2.0.0

**`license`** AGPLv3

**Returns:** *Promise*<void\>

Defined in: uspto-patent-processor/uspto-patent-processor.ts:155

___

### processAndSaveUsptoData

▸ `Private`**processAndSaveUsptoData**(`usptoZipFileName`: *string*, `usptoEntryFileName`: *string*, `usptoEntryFileBuffer`: *Buffer*): *Promise*<void\>

Processes and saves a single USPTO bulk file. This method can handle
multiple formats of bulk USPTO Red Book grant bulk files, and contains
parsers for bulk data going back to 1980 bulk data files.

**`author`** Anthony Mancini

**`version`** 2.0.0

**`license`** AGPLv3

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `usptoZipFileName` | *string* | the name of the USPTO bulk zip file. |
| `usptoEntryFileName` | *string* | the name of the entry file extracted from the zip file. |
| `usptoEntryFileBuffer` | *Buffer* | the contents of the extracted entry file. |

**Returns:** *Promise*<void\>

Defined in: uspto-patent-processor/uspto-patent-processor.ts:318

___

### run

▸ **run**(): *Promise*<void\>

A public function used to run the entire fetching, parsing, and processing
operation.

**`author`** Anthony Mancini

**`version`** 2.0.0

**`license`** AGPLv3

**Returns:** *Promise*<void\>

Defined in: uspto-patent-processor/uspto-patent-processor.ts:384

___

### saveToLocalDirectory

▸ `Private`**saveToLocalDirectory**(`directory`: *string*, `fileName`: *string*, `contents`: *Buffer*): *void*

Saves a file to a local directory. If the specified directory does not
exist, creates the directory.

**`author`** Anthony Mancini

**`version`** 2.0.0

**`license`** AGPLv3

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `directory` | *string* | the name of the directory that the file wil be saved to. |
| `fileName` | *string* | the name of the file that will be saved. |
| `contents` | *Buffer* | the contents of the file. |

**Returns:** *void*

Defined in: uspto-patent-processor/uspto-patent-processor.ts:281

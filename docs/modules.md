[uspto_bulk_file_processor](README.md) / Exports

# uspto_bulk_file_processor

## Table of contents

### Classes

- [UsptoPatentProcessor](classes/usptopatentprocessor.md)

### Interfaces

- [UsptoPatentData](interfaces/usptopatentdata.md)
- [UsptoPatentProcessorOptions](interfaces/usptopatentprocessoroptions.md)

### Functions

- [convertUsptoPftapsDataToJs](modules.md#convertusptopftapsdatatojs)
- [convertUsptoVersion2XmlDataToJs](modules.md#convertusptoversion2xmldatatojs)
- [convertUsptoVersion4XmlDataToJs](modules.md#convertusptoversion4xmldatatojs)

## Functions

### convertUsptoPftapsDataToJs

▸ **convertUsptoPftapsDataToJs**(`pftapsData`: *string*): *Promise*<[*UsptoPatentData*](interfaces/usptopatentdata.md)[]\>

Converts the Pftaps Version of USPTO Red Book Grant bulk TXT data into a JavaScript
Object format.

**`author`** Anthony Mancini

**`version`** 3.0.0

**`license`** AGPLv3

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `pftapsData` | *string* | the Pftaps Version of the bulk Red Book grant data. |

**Returns:** *Promise*<[*UsptoPatentData*](interfaces/usptopatentdata.md)[]\>

an array of patent data in the UsptoPatentSchemaData format.

Defined in: uspto-patent-processor/converters.ts:302

___

### convertUsptoVersion2XmlDataToJs

▸ **convertUsptoVersion2XmlDataToJs**(`xmlData`: *string*): *Promise*<[*UsptoPatentData*](interfaces/usptopatentdata.md)[]\>

Converts Version 2 of USPTO Red Book Grant bulk XML data into a JavaScript
Object format.

**`author`** Anthony Mancini

**`version`** 3.0.0

**`license`** AGPLv3

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `xmlData` | *string* | the Version 2 of the bulk Red Book grant data. |

**Returns:** *Promise*<[*UsptoPatentData*](interfaces/usptopatentdata.md)[]\>

an array of patent data in the UsptoPatentSchemaData format.

Defined in: uspto-patent-processor/converters.ts:158

___

### convertUsptoVersion4XmlDataToJs

▸ **convertUsptoVersion4XmlDataToJs**(`xmlData`: *string*): *Promise*<[*UsptoPatentData*](interfaces/usptopatentdata.md)[]\>

Converts Version 4 of USPTO Red Book Grant bulk XML data into a JavaScript
Object format.

**`author`** Anthony Mancini

**`version`** 3.0.0

**`license`** AGPLv3

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `xmlData` | *string* | the Version 4 of the bulk Red Book grant data. |

**Returns:** *Promise*<[*UsptoPatentData*](interfaces/usptopatentdata.md)[]\>

an array of patent data in the UsptoPatentSchemaData format.

Defined in: uspto-patent-processor/converters.ts:30

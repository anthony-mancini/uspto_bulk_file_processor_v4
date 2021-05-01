import { UsptoPatentProcessor } from './uspto-patent-processor';
import {
    UsptoPatentProcessorOptions,
    UsptoPatentData,
  } from './interfaces';
import {
  convertUsptoPftapsDataToJs,
  convertUsptoVersion2XmlDataToJs,
  convertUsptoVersion4XmlDataToJs,
} from './converters';

export {
  UsptoPatentProcessor,
  UsptoPatentProcessorOptions,
  UsptoPatentData,
  convertUsptoPftapsDataToJs,
  convertUsptoVersion2XmlDataToJs,
  convertUsptoVersion4XmlDataToJs,
}
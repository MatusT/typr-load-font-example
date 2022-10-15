import './style.css';
// I added "allowJs": true to tsconfig.json to allow pure js modules
// Sadly Typr.js does not seem to have types
// I also downloaded it manually as it is not published on npm
import { Typr } from './Typr';

// Fetch is a new API for loading files superseding XMLHttpRequest https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
const response: Response = await fetch('/Roboto-Regular.ttf');
// We ask for Blob which means that the requested file is BINARY
const blob = await response.blob();
// We want blob turned into ArrayBuffer https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
// This is object in JavaScript to support raw byte arrays and arrays of typed native types that are not found in javascript (Int32Array for 32-bit integers etc...)
const arrayBuffer = await blob.arrayBuffer();

// Typr requires OTF/TTF files as raw binary arrays, it doesn't take care of loading those files!
// Can have more fonts hence [0]
const tables = Typr.parse(arrayBuffer);
const font = tables[0];
console.log(font); // Check console output 

// Shape may consists of multiple glyps (glyph can be "pismeno (a)", "dlzen", "makcen"....)
// We can transform UNICODE/UTF-8 strings int shapes and read each singular glyph
const shape = Typr.U.shape(font, 'A', true);
console.log(shape); // Check console output 

// But, this function can turn entire shape into a single path
const path = Typr.U.shapeToPath(font, shape);
console.log(path); // Check console output 

// When you check the output of our path you will notice pretty large coordinates (like [1035, 765])
// Font units are integers and typically in some standard unit space (like 1024 or 2048)
// Far more info about this can be read at https://learn.microsoft.com/en-us/typography/opentype/spec/ttch01 if you are interested

// However, for our purposes (drawing with GPU in 3D space) we will want them in some unit space ([-1, -1] to [1, 1]) and scale them accordingly
// Typr.js contains info about standard square in which the font is designed. This can be retrieved with font.head.unitsPerEm
const pathUnit = path.crds.map(coord => coord / font.head.unitsPerEm);
const path32 = path.crds.map(coord => 32 * coord);

console.log(pathUnit, path32);
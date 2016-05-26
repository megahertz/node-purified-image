## Image
**Kind**: global class  

* [Image](#Image)
    * [new Image([imagePath], [imageType])](#new_Image_new)
    * _instance_
        * [.load(imagePath, imageType)](#Image+load) ⇒ <code>[Image](#Image)</code>
        * [.loadFont(fontPath, [fontName])](#Image+loadFont)
        * [.copy()](#Image+copy) ⇒
        * [.draw(callback)](#Image+draw) ⇒ <code>[Image](#Image)</code>
        * [.toBuffer([imageType])](#Image+toBuffer) ⇒ <code>Promise.&lt;Buffer&gt;</code>
        * [.fromBuffer(buffer, [imageType])](#Image+fromBuffer) ⇒ <code>[Image](#Image)</code>
        * [.save(imagePath, [imageType])](#Image+save) ⇒ <code>Promise.&lt;stream.Writable&gt;</code>
    * _inner_
        * [~drawCallback](#Image..drawCallback) : <code>function</code>

<a name="new_Image_new"></a>

### new Image([imagePath], [imageType])
Optionally load a file


| Param | Type | Default |
| --- | --- | --- |
| [imagePath] | <code>string</code> |  | 
| [imageType] | <code>string</code> | <code>&quot;auto&quot;</code> | 

<a name="Image+load"></a>

### image.load(imagePath, imageType) ⇒ <code>[Image](#Image)</code>
Load an image from a file

**Kind**: instance method of <code>[Image](#Image)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| imagePath | <code>string</code> |  |  |
| imageType | <code>string</code> | <code>&quot;auto&quot;</code> | png or jpeg (now only png is supported) |

<a name="Image+loadFont"></a>

### image.loadFont(fontPath, [fontName])
Load a TTF font file

**Kind**: instance method of <code>[Image](#Image)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fontPath | <code>string</code> |  |
| [fontName] | <code>string</code> | By default it's base name of file |

<a name="Image+copy"></a>

### image.copy() ⇒
Make a copy of the current image

**Kind**: instance method of <code>[Image](#Image)</code>  
**Returns**: Image  
<a name="Image+draw"></a>

### image.draw(callback) ⇒ <code>[Image](#Image)</code>
Draw on image canvas

**Kind**: instance method of <code>[Image](#Image)</code>  

| Param | Type |
| --- | --- |
| callback | <code>[drawCallback](#Image..drawCallback)</code> | 

<a name="Image+toBuffer"></a>

### image.toBuffer([imageType]) ⇒ <code>Promise.&lt;Buffer&gt;</code>
Save image data to buffer

**Kind**: instance method of <code>[Image](#Image)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [imageType] | <code>string</code> | <code>&quot;png&quot;</code> | 

<a name="Image+fromBuffer"></a>

### image.fromBuffer(buffer, [imageType]) ⇒ <code>[Image](#Image)</code>
Load an image from a buffer

**Kind**: instance method of <code>[Image](#Image)</code>  

| Param | Type | Default |
| --- | --- | --- |
| buffer | <code>Buffer</code> |  | 
| [imageType] | <code>string</code> | <code>&quot;png&quot;</code> | 

<a name="Image+save"></a>

### image.save(imagePath, [imageType]) ⇒ <code>Promise.&lt;stream.Writable&gt;</code>
Save image data to file

**Kind**: instance method of <code>[Image](#Image)</code>  

| Param | Type | Default |
| --- | --- | --- |
| imagePath | <code>string</code> |  | 
| [imageType] | <code>string</code> | <code>&quot;auto&quot;</code> | 

<a name="Image..drawCallback"></a>

### Image~drawCallback : <code>function</code>
This callback is called when a pureimage canvas is ready

**Kind**: inner typedef of <code>[Image](#Image)</code>  

| Param | Type |
| --- | --- |
| ctx | <code>Bitmap4BBPContext</code> | 


## Image

* [Image](#Image)
    * [new Image([imagePath], [imageType], [silent])](#new_Image_new)
    * _instance_
        * [.load(imagePath, imageType)](#Image+load) ⇒ [<code>Image</code>](#Image)
        * [.loadFont(fontPath, [fontName])](#Image+loadFont)
        * [.copy()](#Image+copy) ⇒
        * [.ready(callback, [modifyImage])](#Image+ready)
        * [.draw(callback)](#Image+draw) ⇒ [<code>Image</code>](#Image)
        * [.resize(width, height)](#Image+resize) ⇒ [<code>Image</code>](#Image)
        * [.toBuffer([imageType])](#Image+toBuffer) ⇒ <code>Promise.&lt;Buffer&gt;</code>
        * [.fromBuffer(buffer, [imageType])](#Image+fromBuffer) ⇒ [<code>Image</code>](#Image)
        * [.save(imagePath, [imageType])](#Image+save) ⇒ <code>Promise.&lt;stream.Writable&gt;</code>
        * ["image-loaded" (image)](#Image+event_image-loaded)
        * ["font-loaded"](#Image+event_font-loaded)
        * ["loaded"](#Image+event_loaded)
    * _inner_
        * [~readyCallback](#Image..readyCallback) ⇒ <code>Bitmap</code>
        * [~drawCallback](#Image..drawCallback) : <code>function</code>

<a name="new_Image_new"></a>

### new Image([imagePath], [imageType], [silent])
Optionally load a file


| Param | Type | Default |
| --- | --- | --- |
| [imagePath] | <code>string</code> |  | 
| [imageType] | <code>string</code> | <code>&quot;auto&quot;</code> | 
| [silent] | <code>boolean</code> | <code>false</code> | 

<a name="Image+load"></a>

### image.load(imagePath, imageType) ⇒ [<code>Image</code>](#Image)
Load an image from a file

**Kind**: instance method of [<code>Image</code>](#Image)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| imagePath | <code>string</code> |  |  |
| imageType | <code>string</code> | <code>&quot;auto&quot;</code> | png or jpeg (now only png is supported) |

<a name="Image+loadFont"></a>

### image.loadFont(fontPath, [fontName])
Load a TTF font file

**Kind**: instance method of [<code>Image</code>](#Image)  

| Param | Type | Description |
| --- | --- | --- |
| fontPath | <code>string</code> |  |
| [fontName] | <code>string</code> | By default it's base name of file |

<a name="Image+copy"></a>

### image.copy() ⇒
Make a copy of the current image

**Kind**: instance method of [<code>Image</code>](#Image)  
**Returns**: Image  
<a name="Image+ready"></a>

### image.ready(callback, [modifyImage])
Shortcut for handling loaded event

**Kind**: instance method of [<code>Image</code>](#Image)  

| Param | Type | Description |
| --- | --- | --- |
| callback | [<code>readyCallback</code>](#Image..readyCallback) |  |
| [modifyImage] | <code>Boolean</code> | Is an image will be modified in a callback |

<a name="Image+draw"></a>

### image.draw(callback) ⇒ [<code>Image</code>](#Image)
Draw on image canvas

**Kind**: instance method of [<code>Image</code>](#Image)  

| Param | Type |
| --- | --- |
| callback | [<code>drawCallback</code>](#Image..drawCallback) | 

<a name="Image+resize"></a>

### image.resize(width, height) ⇒ [<code>Image</code>](#Image)
Change canvas size of the current image

**Kind**: instance method of [<code>Image</code>](#Image)  

| Param | Type |
| --- | --- |
| width | <code>Number</code> | 
| height | <code>Number</code> | 

<a name="Image+toBuffer"></a>

### image.toBuffer([imageType]) ⇒ <code>Promise.&lt;Buffer&gt;</code>
Save image data to buffer

**Kind**: instance method of [<code>Image</code>](#Image)  

| Param | Type | Default |
| --- | --- | --- |
| [imageType] | <code>string</code> | <code>&quot;png&quot;</code> | 

<a name="Image+fromBuffer"></a>

### image.fromBuffer(buffer, [imageType]) ⇒ [<code>Image</code>](#Image)
Load an image from a buffer

**Kind**: instance method of [<code>Image</code>](#Image)  

| Param | Type | Default |
| --- | --- | --- |
| buffer | <code>Buffer</code> |  | 
| [imageType] | <code>string</code> | <code>&quot;png&quot;</code> | 

<a name="Image+save"></a>

### image.save(imagePath, [imageType]) ⇒ <code>Promise.&lt;stream.Writable&gt;</code>
Save image data to file

**Kind**: instance method of [<code>Image</code>](#Image)  

| Param | Type | Default |
| --- | --- | --- |
| imagePath | <code>string</code> |  | 
| [imageType] | <code>string</code> | <code>&quot;auto&quot;</code> | 

<a name="Image+event_image-loaded"></a>

### "image-loaded" (image)
**Kind**: event emitted by [<code>Image</code>](#Image)  

| Param | Type |
| --- | --- |
| image | <code>Bitmap</code> | 

<a name="Image+event_font-loaded"></a>

### "font-loaded"
**Kind**: event emitted by [<code>Image</code>](#Image)  
<a name="Image+event_loaded"></a>

### "loaded"
Fired when both image data and font are loaded

**Kind**: event emitted by [<code>Image</code>](#Image)  
<a name="Image..readyCallback"></a>

### Image~readyCallback ⇒ <code>Bitmap</code>
This callback is called when a all resources are loaded

**Kind**: inner typedef of [<code>Image</code>](#Image)  
**Returns**: <code>Bitmap</code> - image  

| Param | Type |
| --- | --- |
| [image] | <code>Bitmap</code> | 
| [...fonts] | <code>Object</code> | 

<a name="Image..drawCallback"></a>

### Image~drawCallback : <code>function</code>
This callback is called when a pureimage canvas is ready

**Kind**: inner typedef of [<code>Image</code>](#Image)  

| Param | Type |
| --- | --- |
| ctx | <code>Context</code> | 


import { EventEmitter } from 'events';
import { Writable } from 'stream';

declare class Image extends EventEmitter {
  static default: {
    new(imagePath?: string, imageType?: ImageType, silent?: boolean): Image;
  }

  load(imagePath: string, imageType?: ImageType): this;
  loadFont(fontPath: string, fontName?: string): this;
  copy(): this;
  draw(callback: (ctx: Context) => void): this;
  resize(width: number, height: number): this;
  toBuffer(): Promise<Buffer>;
  fromBuffer(buffer: Buffer, imageType: ImageType): this;
  save(imagePath: string, imageType?: ImageType): Promise<Writable>
}

type ImageType = 'jpg' | 'png';

/**
 * The Bitmap class is used for direct pixel manipulation
 * (for example setting a pixel colour, transparency etc). It also provides
 * a factory method for creating new instances of Context
 */
declare class Bitmap {
  data: ArrayBuffer;

  height: number;

  width: number

  constructor(w: number, h: number, options: any);

  calculateIndex(x: number, y: number): number;

  /**
   * Context factory
   */
  getContext(): Context;

  /**
   * Get the RGBA value of an individual pixel as a hexadecimal number
   * (See NAMED_COLORS for examples)
   */
  getPixelRGBA(x: number, y: number): number;

  /**
   * Set the RGBA(Red, Green, Blue, Alpha) values on an individual pixel level
   */
  setPixelRGBA(x: number, y: number, rgba: number): void;

  /**
   * Set the individual red, green, blue and alpha levels of an individual pixel
   */
  setPixelRGBA_i(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    a: number,
  ): void
}

/**
 * Used for drawing rectangles, text, images and other objects onto the
 * canvas element. It provides the 2D rendering context for a drawing surface.
 *
 * It has the same API as CanvasRenderingContext2D from the HTML5 canvas spec
 */
declare class Context {
  bitmap: Bitmap;

  /**
   * The color or style to use inside shapes.
   */
  fillStyle: string;

  /**
   * The current text style being used when drawing text.
   */
  font: {
    size: number;
    family: string;
  };

  /**
   * The alpha value that is applied to shapes and images before they are
   * drawn onto the canvas.
   */
  globalAlpha: boolean;

  imageSmoothingEnabled: boolean;

  /**
   * The thickness of lines in space units.
   */
  lineWidth: number;

  path: any[];

  /**
   * Set the starting co-ordinates for the path starting point
   */
  pathstart: Point;

  /**
   * The color or style to use for the lines around shapes.
   */
  strokeStyle: string;

  textAlign: string;

  textBaseline: string;

  transform: object;

  static colorStringToUint32(str: string): number;

  constructor(bitmap: Bitmap);

  /**
   * Adds an arc to the path which is centered at (x, y) position with radius
   * r starting at startAngle and ending at endAngle going in the given
   * direction by anticlockwise (defaulting to clockwise).
   */
  arc(
    x: number,
    y: number,
    rad: number,
    start: number,
    end: number,
    anticlockwise: boolean,
  ): void;

  /**
   * Starts a new path by emptying the list of sub-paths.
   */
  beginPath(): void;

  /**
   * Adds a cubic Bézier curve to the path.
   */
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number,
  ): void;

  /**
   * Sets all pixels in the rectangle defined by starting point (x, y) and size
   * (width, height) to transparent black, erasing any previously drawn content.
   */
  clearRect(x: number, y: number, w: number, h: number): void;

  /**
   * Turns the path currently being built into the current clipping path.
   */
  clip(): void;

  /**
   * Causes the point of the pen to move back to the start of the current
   * sub-path.
   */
  closePath(): void;

  createLinearGradient(x0: number, y0: number, x1: number, y1: number): any;

  createRadialGradient(x0: number, y0: number): any;

  /**
   * Provides different ways to draw an image onto the canvas.
   */
  drawImage(
    bitmap: Bitmap,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;

  /**
   * Draw a line using the correct anti-aliased, or non-anti-aliased line
   * drawing function based on the value of imageSmoothingEnabled
   */
  drawLine(line: Line): void;

  /**
   * Draw Line Anti-aliased
   */
  drawLine_aa(line: Line): void;

  /**
   * Draw a line without anti-aliasing using Bresenham's algorithm
   */
  drawLine_noaa(line: Line): void;

  /**
   * Fills the current or given path with the current fill style.
   */
  fill(): void;

  /**
   * Set the background colour of a single pixel denoted by the x and
   * y co-ordinates
   */
  fillPixel(x: number, y: number): void;

  /**
   * Draws a filled rectangle whose starting point is at the coordinates (x, y)
   * with the specified width and height and whose style is determined by the
   * fillStyle attribute.
   */
  fillRect(x: number, y: number, w: number, h: number): void;

  /**
   * Draws a text string at the specified coordinates, filling the string's
   * characters with the current foreground color
   */
  fillText(text: string, x: number, y: number): void;

  /**
   * Fill Anti-aliased
   */
  fill_aa(): void;

  /**
   * Fill No Anti-aliased
   */
  fill_noaa(): void;

  /**
   * Connects the last point in the sub-path to the x, y coordinates with
   * a straight line (but does not actually draw it).
   */
  lineTo(x: number, y: number): void;

  /**
   * Moves the starting point of a new sub-path to the (x, y) coordinates.
   */
  moveTo(x: number, y: number): void;

  pixelInsideClip(x: number, y: number): void;

  /**
   * Adds a quadratic Bézier curve to the path.
   */
  quadraticCurveTo(cp1x: number, cp1y: number, x: number, y: number): void;

  /**
   * Restores the most recently saved canvas state by popping the top entry
   * in the drawing state stack.
   */
  restore(): void;

  /**
   * Add a rotation to the transformation matrix.
   */
  rotate(angle: number): void;

  /**
   * Saves the entire state of the canvas by pushing the current state onto
   * a stack
   */
  save(): void;

  /**
   * Adds a scaling transformation to the canvas units by x horizontally and by
   * y vertically
   */
  scale(sx: number, sy: number): void;

  /**
   * Strokes the current or given path with the current stroke style
   */
  stroke(): void;

  /**
   * Paints a pixel which has an x axis position of x and a y axis position of y
   */
  strokePixel(x: number, y: number): void;

  /**
   * Paints a rectangle which has a starting point at (x, y) and has a w width
   * and an h height onto the canvas, using the current stroke style.
   */
  strokeRect(x: number, y: number, w: number, h: number): void;

  /**
   * Draws the outlines of the characters of a specified text string at the
   * given (x, y) position.
   */
  strokeText(text: string, x: number, y: number): void;

  /**
   * Adds a translation transformation by moving the canvas and its origin
   * x horizontally and y vertically on the grid
   */
  translate(x: number, y: number): void;
}

/**
 * Create a line object represnting a set of two points in 2D space.
 * Line objects can be constructed by passing in either 4 numbers
 * (startX, startY, endX, endY) - or two Point objects representing
 * start and end respectively.
 */
declare class Line {
  end: Point;
  start: Point;
  constructor(startX: number, startY: number, endX: number, endY: number);
  getLength(): number;
}

/**
 * Represents a set of co-ordinates on a 2D plane
 */
declare class Point {
  x: number;
  y: number;
  constructor(x: number, y: number);
}

export = Image;

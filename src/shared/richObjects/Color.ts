import Byte, { matchTBytes } from "@shared/types/Byte";

type THexChar = `${
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "A"
  | "b"
  | "B"
  | "c"
  | "C"
  | "d"
  | "D"
  | "e"
  | "E"
  | "f"
  | "F"}`;

type TByteHex = `${THexChar}${THexChar}`;

class TRGBHexStringValues {
  r: TByteHex = "00";
  g: TByteHex = "00";
  b: TByteHex = "00";
}

class TRGBHexByteValues {
  r: Byte = 0;
  g: Byte = 0;
  b: Byte = 0;
}

class TRGBHexNumberValues {
  r: number = 0;
  g: number = 0;
  b: number = 0;
}

class ColorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ColorError";
  }
}

class Color extends TRGBHexStringValues {
  /**
   * Constructor of color, if @param color is not informed, the default color value will be #000000
   * @param color default value: #000000
   */
  constructor(
    color:
      | string
      | TRGBHexStringValues
      | TRGBHexByteValues
      | TRGBHexNumberValues = "#000000"
  ) {
    super();
    this.setColor(color);
  }

  /**
   * Default "value" for color
   */
  public get value() {
    return this.hexString;
  }

  /**
   * Set the color value as a string
   */
  public set value(color: string) {
    this.hexString = color;
  }

  public get hexString() {
    return `#${this.r}${this.g}${this.b}`;
  }

  public set hexString(color: string) {
    this.setColor(color);
  }

  public set RGBStringValues(color: TRGBHexStringValues) {
    this.setColor(color);
  }

  public get RGBStringValues() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
    } as TRGBHexStringValues;
  }
  public set RGBByteValues(color: TRGBHexByteValues) {
    this.setColor(color);
  }

  public get RGBByteValues() {
    return {
      r: parseInt(this.r),
      g: parseInt(this.g),
      b: parseInt(this.b),
    } as TRGBHexByteValues;
  }

  public set RGBNumberValues(color: TRGBHexNumberValues) {
    this.setColor(color);
  }

  public get RGBNumberValues() {
    return {
      r: parseInt(this.r),
      g: parseInt(this.g),
      b: parseInt(this.b),
    } as TRGBHexNumberValues;
  }

  setRGBValues(r: TByteHex, g: TByteHex, b: TByteHex) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  getRGBValues(): TRGBHexStringValues {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
    } as TRGBHexStringValues;
  }

  setColor(
    color:
      | string
      | TRGBHexStringValues
      | TRGBHexByteValues
      | TRGBHexNumberValues
  ) {
    if (typeof color === "string") {
      if (!Color.isValid(color))
        throw new Color.ColorError("Invalid color format");

      this.r = color.substr(1, 2) as TByteHex;
      this.g = color.substr(3, 2) as TByteHex;
      this.b = color.substr(5, 2) as TByteHex;
    }

    if (color instanceof TRGBHexStringValues) {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
    }

    if (color instanceof TRGBHexByteValues) {
      if (
        !(matchTBytes(color.r) && matchTBytes(color.g) && matchTBytes(color.b))
      )
        throw new Color.ColorError(
          "Color rgb values (when using number) must be between 0 and 255"
        );

      this.r = color.r.toString(16) as TByteHex;
      this.g = color.g.toString(16) as TByteHex;
      this.b = color.b.toString(16) as TByteHex;
    }

    if (color instanceof TRGBHexNumberValues) {
      if (
        !(matchTBytes(color.r) && matchTBytes(color.g) && matchTBytes(color.b))
      )
        throw new Color.ColorError(
          "Color rgb values (when using number) must be between 0 and 255"
        );

      this.r = color.r.toString(16) as TByteHex;
      this.g = color.g.toString(16) as TByteHex;
      this.b = color.b.toString(16) as TByteHex;
    }
  }

  public toString() {
    return this.hexString;
  }

  static isValid = (color: string): boolean => {
    const regex = /^#[a-fA-F0-9]{6}$/;

    if (regex.test(color)) return true;

    return false;
  };

  static stringToRGBHexValues(color: string): TRGBHexStringValues {
    if (!Color.isValid(color))
      throw new Color.ColorError("Invalid color format");

    const r = color.substr(1, 2) as TByteHex;
    const g = color.substr(3, 2) as TByteHex;
    const b = color.substr(5, 2) as TByteHex;

    return { r, g, b } as TRGBHexStringValues;
  }

  static ColorError = ColorError;
}

export default Color;

export {
  ColorError,
  THexChar as THexChar,
  TByteHex as TByteHex,
  TRGBHexStringValues as TRGBHexStringValues,
  TRGBHexByteValues as TRGBHexByteValues,
  TRGBHexNumberValues as TRGBHexNumberValues,
};

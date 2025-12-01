export class BigInt {
  buffer: Buffer;
  sign: number;

  constructor(n: number | BigInt, v?: number) {
    if (BigInt.isBigInt(n)) {
      this.buffer = Buffer.alloc((n as BigInt).buffer.length);
      (n as BigInt).buffer.copy(this.buffer, 0);
      this.sign = (n as BigInt).sign;
    } else {
      this.buffer = Buffer.alloc(n as number);
      this.buffer.fill(0);
      this.sign = 1;

      v = v || 0;

      if (v !== 0) {
        if (v < 0) {
          this.sign = -1;
          v = -v;
        }

        const hexValue = v.toString(16);
        const size = Math.ceil(hexValue.length / 2);
        const carry = size * 2 - hexValue.length;

        for (let i = 0; i < size; i++) {
          const start = (size - i - 1) * 2 - carry;
          this.buffer.writeUInt8(
            parseInt(start === -1 ? hexValue.substr(0, 1) : hexValue.substr(start, 2), 16),
            i
          );
        }
      }
    }
  }

  static isBigInt(v: any): v is BigInt {
    return v && v.buffer && Buffer.isBuffer(v.buffer);
  }

  static toBigInt(n: number, v: number): BigInt {
    return new BigInt(n, v);
  }

  static fromBuffer(b: Buffer, sign?: number): BigInt {
    sign = typeof sign === 'undefined' ? 1 : sign;
    const bi = new BigInt(0);
    bi.sign = sign;
    bi.buffer = b;
    return bi;
  }

  add(v: number | BigInt): BigInt {
    let vBigInt: BigInt;
    if (!BigInt.isBigInt(v)) {
      vBigInt = BigInt.toBigInt(this.buffer.length, v as number);
    } else {
      vBigInt = v;
    }

    if (this.sign !== vBigInt.sign) {
      return this.neg().sub(vBigInt);
    }

    let carry = 0;
    const n = Math.max(vBigInt.buffer.length, this.buffer.length);
    const result = new BigInt(n);

    for (let i = 0; i < n; i++) {
      const r =
        (i < this.buffer.length ? this.buffer.readUInt8(i) : 0) +
        (i < vBigInt.buffer.length ? vBigInt.buffer.readUInt8(i) : 0) +
        carry;
      result.buffer.writeUInt8(r & 0xff, i);
      carry = r >> 8;
    }

    result.sign = this.sign;

    return result;
  }

  neg(): BigInt {
    const result = new BigInt(this);
    result.sign *= -1;
    return result;
  }

  abs(): BigInt {
    const result = new BigInt(this);
    result.sign = 1;
    return result;
  }

  sub(v: number | BigInt): BigInt {
    let vBigInt: BigInt;
    if (!BigInt.isBigInt(v)) {
      vBigInt = BigInt.toBigInt(this.buffer.length, v as number);
    } else {
      vBigInt = v;
    }

    if (this.sign !== vBigInt.sign) {
      return this.add(vBigInt.neg());
    }

    let carry = 0;
    let a = new BigInt(this);
    let b = new BigInt(vBigInt);
    const n = Math.max(a.buffer.length, b.buffer.length);
    const result = new BigInt(n);
    let sign = this.sign;

    if (a.abs().lt(b.abs())) {
      const t = a;
      a = b;
      b = t;
      sign *= -1;
    }

    for (let i = 0; i < n; i++) {
      const va = i < a.buffer.length ? a.buffer.readUInt8(i) : 0;
      const vb = i < b.buffer.length ? b.buffer.readUInt8(i) : 0;
      let c = 0;
      let r = va - vb - carry;

      while (r < 0) {
        r += 0xff;
        c--;
      }

      result.buffer.writeUInt8(r & 0xff, i);
      carry = (r >> 8) + c;
    }

    result.sign = sign;

    return result;
  }

  toBuffer(): Buffer {
    return this.buffer;
  }

  toNumber(): number {
    const b = Buffer.alloc(this.buffer.length);

    for (let i = 0; i < this.buffer.length; i++) {
      b.writeUInt8(this.buffer.readUInt8(this.buffer.length - i - 1), i);
    }

    return parseInt(b.toString('hex'), 16);
  }

  compare(v: number | BigInt): number {
    let vBigInt: BigInt;
    if (!BigInt.isBigInt(v)) {
      vBigInt = BigInt.toBigInt(this.buffer.length, v as number);
    } else {
      vBigInt = v;
    }

    const n = Math.max(vBigInt.buffer.length, this.buffer.length);

    if (this.sign > vBigInt.sign) return 1;
    if (this.sign < vBigInt.sign) return -1;

    for (let i = n - 1; i >= 0; i--) {
      const a = i < this.buffer.length ? this.buffer.readUInt8(i) : 0;
      const b = i < vBigInt.buffer.length ? vBigInt.buffer.readUInt8(i) : 0;
      if (a !== b) {
        return a > b ? this.sign : -this.sign;
      }
    }

    return 0;
  }

  lt(v: number | BigInt): boolean {
    return this.compare(v) < 0;
  }

  le(v: number | BigInt): boolean {
    return this.compare(v) <= 0;
  }

  gt(v: number | BigInt): boolean {
    return this.compare(v) > 0;
  }

  ge(v: number | BigInt): boolean {
    return this.compare(v) >= 0;
  }
}

export default BigInt;
